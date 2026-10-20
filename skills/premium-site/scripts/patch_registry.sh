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
# 3. Bklit bar.tsx: while the y-domain tweens, zero-value bars compute a negative height →
#    "<rect> attribute height: A negative value is not valid" console errors. Clamp at 0.
for f in "$ROOT"/src/components/charts/bar.tsx "$ROOT"/components/charts/bar.tsx; do
  if [[ -f "$f" ]] && grep -q 'barHeight = innerHeight - valuePos;' "$f"; then
    sed -i 's/barHeight = innerHeight - valuePos;/barHeight = Math.max(0, innerHeight - valuePos);/' "$f"; echo "  patched: negative bar height clamp in $f"
  fi
done
exit 0
