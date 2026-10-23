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
