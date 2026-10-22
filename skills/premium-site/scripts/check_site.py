#!/usr/bin/env python3
"""Static audit for a premium-site project. Catches the mistakes that make a site feel
cheap or broken before you spend a build + screenshot cycle on it.

Usage: python3 check_site.py <project-dir>
Exit code 1 if any FAIL; WARNs are judgment calls to review, not blockers.
"""
import re
import sys
from pathlib import Path

root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
src = root / "src" if (root / "src").is_dir() else root
files = [p for p in src.rglob("*") if p.suffix in {".ts", ".tsx", ".css"} and "node_modules" not in p.parts]
# Vendored registry code (kokonutui/, charts/, ui/) is audited upstream; check what we author.
VENDORED = {"kokonutui", "charts", "ui"}
own = [p for p in files if not (set(p.relative_to(src).parts) & VENDORED)]
text = {p: p.read_text(errors="ignore") for p in files}
results = []


def check(ok, level, msg):
    results.append(("PASS" if ok else level, msg))


def own_grep(pattern, flags=0):
    rx = re.compile(pattern, flags)
    return [(p, m) for p in own for m in rx.finditer(text[p])]


all_src = "\n".join(text.values())
own_src = "\n".join(text[p] for p in own)

# --- accessibility / motion safety ---------------------------------------------------------
check(re.search(r'reducedMotion=["\{]"?user', all_src) is not None, "FAIL",
      'MotionConfig reducedMotion="user" wraps the app (assets/motion/motion-provider.tsx)')
check(not own_grep(r'from\s+["\']framer-motion["\']'), "FAIL",
      'imports use "motion/react", not the legacy "framer-motion" package')
layout_anim = own_grep(
    r'(?:initial|animate|whileHover|whileTap|whileInView|exit)=\{\{[^}]*\b(width|height|top|left|right|bottom|margin\w*|padding\w*)\s*:')
check(not layout_anim, "FAIL",
      "no layout-property animation (width/height/top/left/margin) — use x/y/scale"
      + (f" → {', '.join(sorted({p.name for p, _ in layout_anim}))}" if layout_anim else ""))
controllers = sum(bool(re.search(p, all_src)) for p in [r"new Lenis\(|ReactLenis", r"ScrollSmoother"])
check(controllers <= 1, "FAIL", "at most one smooth-scroll controller (Lenis OR ScrollSmoother)")
check("prefers-reduced-motion" in all_src or "useReducedMotion" in own_src, "WARN",
      "reduced-motion handled for any CSS keyframes / custom loops (media query or useReducedMotion)")

# --- registry install hygiene --------------------------------------------------------------
check("var(----" not in all_src, "FAIL", "no double-prefixed Bklit vars (run scripts/patch_registry.sh)")
check(not re.search(r'"\.\./components/shimmering-text"', all_src), "FAIL",
      "Bklit shimmering-text import patched (run scripts/patch_registry.sh)")

# --- art direction ---------------------------------------------------------------------------
layout = next((p for p in files if p.name == "layout.tsx" and p.parent.name == "app"), None)
ltxt = text.get(layout, "") if layout else ""
check("--font-display" in all_src, "FAIL", "a display face is loaded and exposed as --font-display")
check(re.search(r"--brand\s*:", all_src) is not None, "FAIL", "one accent token --brand is defined")
check("Create Next App" not in ltxt and "TODO:" not in ltxt, "FAIL", "metadata title/description replaced (no template TODOs)")
# <MaskedLines> renders an h1 unless given another `as`.
h1s = len(re.findall(r"<h1\b|as=\"h1\"|as: \"h1\"|<MaskedLines(?![^>]*\bas=)", own_src))
check(h1s >= 1, "WARN", f"page has an h1 (found {h1s})")
raw_imgs = own_grep(r"<img\b")
check(not raw_imgs, "WARN", "hero/section imagery uses next/image, not raw <img>")
lorem = own_grep(r"lorem ipsum", re.I)
check(not lorem, "FAIL", "no lorem ipsum — write real, specific copy")
brand_hex = set(re.findall(r"#[0-9a-fA-F]{6}\b", own_src))
check(len(brand_hex) <= 6, "WARN",
      f"palette discipline: {len(brand_hex)} distinct hex literals in authored code — UI colors belong in "
      "tokens; colors painted inside SVG/canvas artwork are fine, ignore this warn if that's what they are")

for level, msg in results:
    print(f"{level:4}  {msg}")
fails = sum(1 for l, _ in results if l == "FAIL")
warns = sum(1 for l, _ in results if l == "WARN")
print(f"\n{fails} fail, {warns} warn, {len(results) - fails - warns} pass")
sys.exit(1 if fails else 0)
