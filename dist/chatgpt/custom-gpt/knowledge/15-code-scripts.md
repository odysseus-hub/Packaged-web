# Scripts

Run locally from the skill folder. scaffold.sh needs Node 20+ and network. check_site.py is a static audit. screenshot.mjs needs Playwright.


## `scripts/check_site.py`

```python
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

# Render loops (WebGL, canvas, R3F) must stand down under reduced motion.
loopers = [p for p in own if re.search(r'getContext\(["\']webgl|<Canvas\b|requestAnimationFrame\(', text[p])]
ungated = [p.name for p in loopers if not re.search(r"prefers-reduced-motion|usePrefersReducedMotion|useReducedMotion|\breduce\b", text[p])]
check(not ungated, "WARN", "render loops (WebGL/canvas/R3F/rAF) are gated by reduced motion" + (f" → {ungated}" if ungated else ""))

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
```


## `scripts/patch_registry.sh`

```bash
#!/usr/bin/env bash
# Idempotent fixes for known shadcn-registry install bugs (verified 2026-10). Safe to re-run
# after every `shadcn add @bklit/*` or `@kokonutui/*`.
set -euo pipefail
ROOT="${1:-.}"
CSS="$(ls "$ROOT"/src/app/globals.css "$ROOT"/app/globals.css 2>/dev/null | head -1 || true)"

# 1. Bklit's cssVars land in `@theme inline` double-prefixed: `var(----chart-grid)`.
#    Undefined vars silently break every `*-chart-*` Tailwind utility (grid, labels, tooltips).
if [[ -n "$CSS" ]] && grep -q 'var(----' "$CSS"; then
  sed -i 's/var(----/var(--/g' "$CSS"; echo "  patched: var(---- → var(-- in $CSS"
fi

# 2. Bklit's chart-loading-label imports "../components/shimmering-text" (monorepo layout).
#    In an app the file lives at @/components/shimmering-text → module-not-found at build.
for f in "$ROOT"/src/components/charts/chart-loading-label.tsx "$ROOT"/components/charts/chart-loading-label.tsx; do
  if [[ -f "$f" ]] && grep -q '"\.\./components/shimmering-text"' "$f"; then
    sed -i 's#"\.\./components/shimmering-text"#"@/components/shimmering-text"#' "$f"; echo "  patched: shimmering-text import in $f"
  fi
done
# 3. Bklit bar charts log "<rect> attribute height: A negative value is not valid" while the
#    y-domain tweens and before the container is measured. Clamp the plot size and the rect
#    heights at 0. Anchors verified against the registry on 2026-10-22; reports when stale.
for d in "$ROOT"/src/components/charts "$ROOT"/components/charts; do
  [[ -f "$d/bar-chart.tsx" ]] || continue
  hit=0
  if grep -q 'const innerWidth = width - margin.left - margin.right;' "$d/bar-chart.tsx"; then
    sed -i 's/const innerWidth = width - margin.left - margin.right;/const innerWidth = Math.max(0, width - margin.left - margin.right);/; s/const innerHeight = height - margin.top - margin.bottom;/const innerHeight = Math.max(0, height - margin.top - margin.bottom);/' "$d/bar-chart.tsx"; hit=1
  fi
  if [[ -f "$d/bar.tsx" ]] && grep -qE 'height=\{(barHeight|height)\}' "$d/bar.tsx"; then
    sed -i -E 's/height=\{(barHeight|height)\}/height={Math.max(0, \1)}/g' "$d/bar.tsx"; hit=1
  fi
  if [[ $hit == 1 ]]; then echo "  patched: negative bar height clamps in $d"
  elif ! grep -q 'Math.max(0, width - margin.left' "$d/bar-chart.tsx"; then
    echo "  WARN: bar-chart clamp anchors not found in $d (upstream changed). Watch for negative <rect> height console errors and clamp by hand."
  fi
done
exit 0
```


## `scripts/scaffold.sh`

```bash
#!/usr/bin/env bash
# Scaffold a premium-site project: Next.js (App Router, TS, Tailwind v4) + shadcn/ui
# + Motion + Kokonut UI + Bklit UI registries, with the known registry gotchas patched.
#
# Usage: bash scaffold.sh <project-dir> [--dark] [--fx] [--3d] [--kokonut "a b c"] [--bklit "x y"] [--lenis]
#   --fx          copy the signature-effects library (assets/fx, assets/palette) into src/components
#   --3d          install three.js + React Three Fiber + drei and copy the product-scene templates
#   --dark        put class="dark" on <html> (shadcn + Kokonut use the .dark class variant)
#   --kokonut     space-separated Kokonut component names to install (e.g. "background-paths particle-button")
#   --bklit       space-separated Bklit chart names to install (e.g. "area-chart bar-chart")
#   --lenis       also install lenis (smooth scroll up front instead of in the scroll layer)
#
# Verified 2026-10 against: next 16.4, tailwindcss 4.3, shadcn 4.22 (base-nova), motion 14.4.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

DIR="${1:?project dir required}"; shift || true
DARK=0; KOKONUT=""; BKLIT=""; LENIS=0; FX=0; THREE=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dark) DARK=1 ;;
    --kokonut) KOKONUT="$2"; shift ;;
    --bklit) BKLIT="$2"; shift ;;
    --lenis) LENIS=1 ;;
    --fx) FX=1 ;;
    --3d) THREE=1 ;;
    *) echo "unknown flag $1" >&2; exit 2 ;;
  esac
  shift
done

if [[ -e "$DIR/package.json" ]]; then
  echo "• $DIR already has package.json — skipping create-next-app"
else
  echo "• create-next-app"
  npx --yes create-next-app@latest "$DIR" --ts --tailwind --eslint --app --src-dir \
    --import-alias "@/*" --use-npm --turbopack --no-react-compiler --yes >/dev/null
fi
cd "$DIR"

if [[ ! -f components.json ]]; then
  echo "• shadcn init (base-nova preset)"
  npx --yes shadcn@latest init -d -y --no-monorepo >/dev/null
fi

echo "• registries → components.json"
node -e '
const fs=require("fs");const c=JSON.parse(fs.readFileSync("components.json","utf8"));
c.registries=Object.assign({},c.registries,{
  "@kokonutui":"https://kokonutui.com/r/{name}.json",
  "@bklit":"https://ui.bklit.com/r/{name}.json"});
fs.writeFileSync("components.json",JSON.stringify(c,null,2)+"\n");'

echo "• motion"
npm i motion >/dev/null 2>&1
if [[ $LENIS == 1 ]]; then npm i lenis >/dev/null 2>&1; fi

# Kokonut's utils item rewrites src/lib/utils.ts (shadcn's new init re-exports `cn` from the
# "cn" package). Both export the same `cn`; installing it once with -o stops every later
# `shadcn add @kokonutui/*` from blocking on an interactive overwrite prompt.
echo "• kokonut utils"
npx shadcn@latest add https://kokonutui.com/r/utils.json -y -o >/dev/null

if [[ -n "$KOKONUT" ]]; then
  echo "• kokonut: $KOKONUT"
  # shellcheck disable=SC2086
  npx shadcn@latest add $(printf '@kokonutui/%s ' $KOKONUT) -y </dev/null >/dev/null
fi
if [[ -n "$BKLIT" ]]; then
  echo "• bklit: $BKLIT"
  # shellcheck disable=SC2086
  npx shadcn@latest add $(printf '@bklit/%s ' $BKLIT) -y </dev/null >/dev/null
fi

bash "$SCRIPT_DIR/patch_registry.sh" .

echo "• motion primitives → src/components/motion/"
mkdir -p src/components/motion
for f in "$SCRIPT_DIR/../assets/motion/"*.ts*; do
  [[ -e "src/components/motion/$(basename "$f")" ]] || cp "$f" src/components/motion/
done
if [[ $LENIS == 0 ]]; then rm -f src/components/motion/smooth-scroll.tsx; fi  # needs lenis; the scroll layer adds it

if [[ $FX == 1 ]]; then
  echo "• fx library → src/components/fx, src/components/palette"
  mkdir -p src/components/fx src/components/palette
  for d in fx palette; do
    for f in "$SCRIPT_DIR/../assets/$d/"*; do
      [[ -e "src/components/$d/$(basename "$f")" ]] || cp "$f" "src/components/$d/"
    done
  done
fi

if [[ $THREE == 1 ]]; then
  # Verified 2026-10-22: fiber 9.8 peers on react >=19 <19.4.
  echo "• 3d: three + @react-three/fiber + drei, templates → src/components/3d"
  npm i three@0.186.1 @react-three/fiber@9.8.2 @react-three/drei@10.7.9 >/dev/null 2>&1
  npm i -D @types/three@0.186.0 >/dev/null 2>&1
  mkdir -p src/components/3d
  for f in "$SCRIPT_DIR/../assets/3d/"*; do
    [[ -e "src/components/3d/$(basename "$f")" ]] || cp "$f" src/components/3d/
  done
fi

# eslint-config-next 16's React-Compiler hook rules fail freshly installed Bklit/Kokonut code
# (30-60 errors, none in your code). Lint vendored registry folders leniently; keep yours strict.
echo "• eslint: relax react-compiler rules for vendored registry code"
node -e '
const fs=require("fs");const f="eslint.config.mjs";let s=fs.readFileSync(f,"utf8");
if(!s.includes("components/kokonutui/**")){
 s=s.replace(/(\.\.\.nextTs,\n)/, `$1  // Vendored shadcn-registry source (Bklit charts, Kokonut UI, shadcn ui) is audited upstream.
  {
    files: ["src/components/charts/**", "src/components/kokonutui/**", "src/components/ui/**", "src/components/shimmering-text.tsx"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
    },
  },
`);fs.writeFileSync(f,s);}'

# Font variables: shadcn's theme expects --font-sans / --font-mono; create-next-app emits
# --font-geist-*. Point the theme at role-named vars (--font-sans, --font-mono, --font-display)
# that the layout's next/font calls will define.
echo "• fonts: role-named theme vars (--font-display / --font-sans / --font-mono)"
node -e '
const fs=require("fs");const f="src/app/globals.css";let s=fs.readFileSync(f,"utf8");
s=s.replace(/--font-mono:\s*var\(--font-geist-mono\);/,"--font-mono: var(--font-mono);");
if(!s.includes("--font-display: var(--font-display)"))
  s=s.replace(/@theme inline \{\n/,"@theme inline {\n  --font-display: var(--font-display);\n");
s=s.replace(/--font-heading:\s*var\(--font-sans\);/,"--font-heading: var(--font-display);");
fs.writeFileSync(f,s);'

echo "• layout: template with role-named fonts + <MotionProvider>"
if grep -q "Create Next App" src/app/layout.tsx; then cp "$SCRIPT_DIR/../assets/templates/layout.tsx" src/app/layout.tsx; fi

if [[ $DARK == 1 ]]; then
  # shadcn + Kokonut style dark mode through the `.dark` class variant, not the media query.
  node -e '
const fs=require("fs");const f="src/app/layout.tsx";let s=fs.readFileSync(f,"utf8");
s=s.replace(/className=\{`/, "className={`dark ");fs.writeFileSync(f,s);'
  echo "• dark: added class=\"dark\" to <html>"
fi

echo "✓ scaffolded $DIR — next: pick fonts in layout.tsx, set --brand tokens in globals.css, replace metadata TODOs"
```


## `scripts/screenshot.mjs`

```js
// Capture the running site the way a reviewer sees it: desktop + mobile, full page, plus a
// reduced-motion pass. Scrolls the page first so whileInView reveals have fired.
//
// Usage: node screenshot.mjs <site-dir | url> <out-dir> [--port N]
//   node screenshot.mjs ./my-site ./shots           ← preferred: builds must exist (next build);
//                                                     starts `next start` on a free port and
//                                                     stops exactly that server afterwards
//   node screenshot.mjs http://localhost:3000 ./shots   (a server you manage yourself)
// Needs playwright (global install or project dep). In Claude cloud containers Chromium is at
// /opt/pw-browsers and PLAYWRIGHT_BROWSERS_PATH is already set — do not run `playwright install`.
import { existsSync, mkdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { execSync, spawn } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";

const argv = process.argv.slice(2);
const portFlag = argv.indexOf("--port");
const fixedPort = portFlag >= 0 ? Number(argv.splice(portFlag, 2)[1]) : null;
const [rawTarget = "http://localhost:3000", out = "./shots"] = argv;
const target = /^https?:/.test(rawTarget) ? rawTarget : path.resolve(rawTarget);
mkdirSync(out, { recursive: true });

// Self-serve mode: never leave a stray server behind, never kill someone else's by name.
let server = null;
let url = target;
if (existsSync(target) && statSync(target).isDirectory()) {
  const bin = path.join(target, "node_modules/.bin/next");
  if (!existsSync(path.join(target, ".next"))) throw new Error(`no build in ${target} — run next build first`);
  const port = fixedPort ?? await new Promise((r) => { const s = createServer().listen(0, () => { const p = s.address().port; s.close(() => r(p)); }); });
  server = spawn(bin, ["start", "-p", String(port)], { cwd: target, detached: true, stdio: "ignore" });
  url = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 60; i++) {
    try { await fetch(url); break; } catch { await new Promise((r) => setTimeout(r, 500)); }
  }
}
// `next start` re-spawns next-server in its own process group, so signalling our group misses
// it. Walk the whole descendant tree (pgrep -P works on Linux and macOS) and kill each pid.
const descendants = (pid) => {
  let kids = [];
  try { kids = execSync(`pgrep -P ${pid}`).toString().split(/\s+/).filter(Boolean).map(Number); } catch {}
  return kids.flatMap((k) => [k, ...descendants(k)]);
};
const stopServer = () => {
  if (!server) return;
  for (const pid of [...descendants(server.pid), server.pid]) { try { process.kill(pid, "SIGTERM"); } catch {} }
  server = null;
};
process.on("exit", stopServer);

function loadPlaywright() {
  const req = createRequire(import.meta.url);
  for (const id of ["playwright", "@playwright/test"]) {
    try { return req(id); } catch {}
    try {
      const globalRoot = execSync("npm root -g").toString().trim();
      return req(path.join(globalRoot, id));
    } catch {}
  }
  throw new Error("playwright not found — `npm i -D playwright` (browsers are preinstalled)");
}
const { chromium } = loadPlaywright();

const runs = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" },
  { name: "mobile", viewport: { width: 390, height: 844 }, reducedMotion: "no-preference", isMobile: true, hasTouch: true },
  { name: "desktop-reduced", viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" },
];

const browser = await chromium.launch();
const errors = [];
for (const r of runs) {
  const ctx = await browser.newContext({ viewport: r.viewport, reducedMotion: r.reducedMotion, isMobile: r.isMobile, hasTouch: r.hasTouch });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`[${r.name}] ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`[${r.name}] console: ${m.text()}`));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800); // let the hero choreography finish
  await page.screenshot({ path: `${out}/${r.name}-hero.png` });
  // Walk the page so every once-only reveal triggers, then return to top for the full shot.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += Math.round(r.viewport.height * 0.6)) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(900);
  // Compare against the DEVICE width: with isMobile, Chromium widens the layout viewport to fit
  // overflowing content, so scrollWidth === innerWidth even when the page is broken.
  const overflowX = await page.evaluate((w) => document.documentElement.scrollWidth > w + 1, r.viewport.width);
  if (overflowX) errors.push(`[${r.name}] horizontal overflow: page is wider than the viewport`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/${r.name}-full.png`, fullPage: true });
  await ctx.close();
}
await browser.close();
stopServer();
console.log(`screenshots → ${out}`);
if (errors.length) {
  console.log("issues:\n  " + errors.join("\n  "));
  process.exitCode = 1;
}
```
