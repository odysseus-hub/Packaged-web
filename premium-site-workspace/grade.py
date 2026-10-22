#!/usr/bin/env python3
"""Programmatic grader for premium-site eval runs.
Usage: python3 grade.py <iteration-dir>   → writes grading.json into every <eval>/<config>/ run dir.
"""
import json, re, subprocess, sys, time, os, socket
from pathlib import Path

ITER = Path(sys.argv[1]).resolve()
HERE = Path(__file__).resolve().parent
PROBE = HERE / "probe.mjs"
VENDORED = {"kokonutui", "charts", "ui", "node_modules", ".next"}


def authored(site):
    src = site / "src" if (site / "src").is_dir() else site
    out = {}
    for p in src.rglob("*"):
        if p.suffix in {".ts", ".tsx", ".css", ".js", ".jsx"} and not (set(p.relative_to(src).parts) & VENDORED):
            out[p] = p.read_text(errors="ignore")
    return out


def run(cmd, cwd, timeout=600):
    r = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True, timeout=timeout)
    return r.returncode, (r.stdout + r.stderr)[-3000:]


def free_port():
    s = socket.socket(); s.bind(("", 0)); p = s.getsockname()[1]; s.close(); return p


def chroma_ok(val):
    m = re.search(r"oklch\(\s*[\d.]+%?\s+([\d.]+)", val)
    if m:
        return float(m.group(1)) >= 0.06
    m = re.search(r"#([0-9a-fA-F]{6})", val)
    if m:
        r, g, b = (int(m.group(1)[i:i + 2], 16) for i in (0, 2, 4))
        return max(r, g, b) - min(r, g, b) > 40
    return bool(re.search(r"hsl\(\s*[\d.]+\s*,?\s*([3-9]\d|100)%", val))


def grade(run_dir, needs_chart):
    site = run_dir / "outputs" / "site"
    ex = []

    def add(text, passed, evidence):
        ex.append({"text": text, "passed": bool(passed), "evidence": evidence[:600]})

    if not (site / "package.json").exists():
        add("Project exists", False, f"no package.json at {site}")
        return ex
    # Process hygiene: the run must not leave its own dev/prod server running.
    left = []
    for pid in os.listdir("/proc"):
        if pid.isdigit():
            try:
                if "next-server" in open(f"/proc/{pid}/cmdline").read() and os.readlink(f"/proc/{pid}/cwd").startswith(str(site)):
                    left.append(pid)
            except OSError:
                pass
    add("No server left running by the run", not left, f"pids {left}" if left else "none")
    files = authored(site)
    src = "\n".join(files.values())
    names = lambda pat: sorted({p.name for p, t in files.items() if re.search(pat, t)})

    code, out = run("npx next build", site, 900)
    add("next build succeeds", code == 0, out.strip().splitlines()[-1] if out.strip() else "")
    code, out = run("npx eslint . --max-warnings=9999", site, 300)
    errs = re.search(r"(\d+) errors?", out)
    ev = "clean" if code == 0 else (errs.group(0) if errs else "eslint did not run: " + ("no eslint config" if "eslint.config" in out else out.strip().splitlines()[0][:120]))
    add("eslint reports 0 errors", code == 0, ev)

    add("Animation uses Motion (motion/react)", re.search(r'from\s+["\']motion/react', src),
        f"files: {names(r'from\s+[\"\\\']motion/react')}")
    rm = re.search(r'reducedMotion=["{]+"?user|useReducedMotion|prefers-reduced-motion', src)
    add("Reduced motion explicitly handled in authored code", rm, rm.group(0) if rm else "none found")
    kk = re.findall(r'components/kokonutui/([\w-]+)', src)
    add("Uses Kokonut UI animated components", kk, f"{sorted(set(kk))}")
    ch = re.findall(r'components/charts/([\w/-]+)', src)
    add("Uses Bklit UI charts" + ("" if needs_chart else " (stat visualisation)"), ch, f"{sorted(set(ch))}")
    layout = next((t for p, t in files.items() if p.name == "layout.tsx"), "")
    fonts = re.findall(r"import\s*\{([^}]+)\}\s*from\s*[\"']next/font/google", layout)
    fams = [f.strip() for f in ",".join(fonts).split(",") if f.strip()]
    add("Distinct display + text fonts via next/font", len(fams) >= 2 and not set(fams) <= {"Geist", "Geist_Mono"},
        f"families: {fams}")
    toks = re.findall(r"--(brand|accent|primary)\s*:\s*([^;]+);", src)
    chrom = [f"--{n}: {v.strip()}" for n, v in toks if chroma_ok(v)]
    add("A chromatic accent token is defined (--brand/--accent/--primary)", chrom, "; ".join(chrom[:3]) or f"{toks[:3]}")
    lay = re.findall(r'(?:initial|animate|whileHover|whileTap|whileInView|exit)=\{\{[^}]*\b(width|height|top|left|margin\w*)\s*:', src)
    add("No layout-property animation (width/height/top/left/margin)", not lay, f"{lay[:5]}" if lay else "none")
    st = re.search(r"delayChildren|staggerChildren|stagger\(|<Stagger\b", src)
    add("Staggered entrance choreography", st, st.group(0) if st else "none")
    sp = re.search(r'type:\s*["\']spring|useSpring|spring\.(hover|follow)|<HoverLift|<Magnetic', src) and re.search(r"whileHover|onPointerMove|HoverLift|Magnetic", src)
    add("Spring-based hover interactions", sp, "found" if sp else "none")
    sc = re.search(r"useScroll|new Lenis|ReactLenis|ScrollTrigger|animation-timeline", src)
    add("Scroll-linked motion layer present", sc, sc.group(0) if sc else "none")
    lorem = re.search(r"lorem ipsum", src, re.I)
    add("No lorem ipsum placeholder copy", not lorem, "found" if lorem else "none")

    # Runtime probe
    port = free_port()
    srv = subprocess.Popen(f"npx next start -p {port}", cwd=site, shell=True, stdout=subprocess.DEVNULL,
                           stderr=subprocess.DEVNULL, preexec_fn=os.setsid)
    try:
        for _ in range(60):
            try:
                socket.create_connection(("127.0.0.1", port), 1).close(); break
            except OSError:
                time.sleep(1)
        code, out = run(f"node {PROBE} http://127.0.0.1:{port}", HERE, 300)
        try:
            pr = json.loads(out.strip().splitlines()[-1])
        except Exception:
            pr = {"error": out[-400:]}
    finally:
        os.killpg(os.getpgid(srv.pid), 15)
    if "error" in pr:
        add("Runtime probe ran", False, pr["error"])
        return ex
    add("Mobile (390px): no horizontal overflow", not pr["mobileOverflow"], f"scrollWidth={pr['mobileScrollWidth']}")
    add("No runtime/console errors", not pr["errors"], "; ".join(pr["errors"][:3]) or "none")
    add("Reduced motion: no text hidden that is visible with motion on", pr["reducedHidden"] == 0,
        f"{pr['reducedHidden']} hidden text elements: {pr['reducedHiddenSamples'][:3]}")
    add("Hero headline readable within 1.5s of load", pr.get("h1VisibleAt1500"), f"h1 visible at 1.5s: {pr.get('h1VisibleAt1500')}")
    add("Hero headline is large display type (>= 64px on desktop)", pr["h1Size"] >= 64, f"h1 font-size {pr['h1Size']}px, family {pr['h1Family'][:60]}")
    return ex


for meta in sorted(ITER.glob("eval-*/eval_metadata.json")):
    md = json.loads(meta.read_text())
    for run_dir in sorted(meta.parent.glob('*/run-*')):
        ex = grade(run_dir, needs_chart=md["eval_name"] == "bold-product-landing")
        passed = sum(e["passed"] for e in ex)
        g = {"expectations": ex, "summary": {"passed": passed, "failed": len(ex) - passed, "total": len(ex),
                                              "pass_rate": round(passed / len(ex), 3) if ex else 0}}
        (run_dir / "grading.json").write_text(json.dumps(g, indent=2))
        print(f"{meta.parent.name}/{run_dir.parent.name}/{run_dir.name}: {passed}/{len(ex)}")
        for e in ex:
            print(f"   {'✓' if e['passed'] else '✗'} {e['text']} — {e['evidence'][:110]}")
