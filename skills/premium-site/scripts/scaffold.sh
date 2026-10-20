#!/usr/bin/env bash
# Scaffold a premium-site project: Next.js (App Router, TS, Tailwind v4) + shadcn/ui
# + Motion + Kokonut UI + Bklit UI registries, with the known registry gotchas patched.
#
# Usage: bash scaffold.sh <project-dir> [--dark] [--kokonut "a b c"] [--bklit "x y"] [--lenis]
#   --dark        put class="dark" on <html> (shadcn + Kokonut use the .dark class variant)
#   --kokonut     space-separated Kokonut component names to install (e.g. "background-paths particle-button")
#   --bklit       space-separated Bklit chart names to install (e.g. "area-chart bar-chart")
#   --lenis       also install lenis (only if you are NOT handing smooth scroll to the flowy skill)
#
# Verified 2026-10 against: next 16.4, tailwindcss 4.3, shadcn 4.22 (base-nova), motion 14.4.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

DIR="${1:?project dir required}"; shift || true
DARK=0; KOKONUT=""; BKLIT=""; LENIS=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dark) DARK=1 ;;
    --kokonut) KOKONUT="$2"; shift ;;
    --bklit) BKLIT="$2"; shift ;;
    --lenis) LENIS=1 ;;
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
if [[ $LENIS == 0 ]]; then rm -f src/components/motion/smooth-scroll.tsx; fi  # needs lenis; flowy adds it

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
