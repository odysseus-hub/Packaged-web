# Stack setup — verified commands and gotchas

Verified end-to-end on 2026-10-20 (fresh project → `next build` green). Versions at that date:
`next 16.4.2`, `react 19.3`, `tailwindcss 4.3`, `shadcn 4.22` (default preset **base-nova**, built on
Base UI), `motion 14.4`, `lenis 1.3`. If a command fails, check the live docs listed at the bottom
before improvising. These libraries move fast.

## Manual sequence (what `scripts/scaffold.sh` does)

```bash
# 1. Next.js app — TS, Tailwind v4, App Router, src/, @/* alias, Turbopack
npx create-next-app@latest my-site --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm --turbopack --no-react-compiler --yes
cd my-site

# 2. shadcn/ui — non-interactive, default preset (base-nova, neutral, CSS vars, lucide)
npx shadcn@latest init -d -y --no-monorepo

# 3. Registries: add to components.json
#    "registries": {
#      "@kokonutui": "https://kokonutui.com/r/{name}.json",
#      "@bklit":     "https://ui.bklit.com/r/{name}.json"
#    }

# 4. Motion (import from "motion/react"; never the old "framer-motion" package name)
npm i motion

# 5. Kokonut's cn helper, once, with -o (see gotcha 1)
npx shadcn@latest add https://kokonutui.com/r/utils.json -y -o

# 6. Components
npx shadcn@latest add @kokonutui/background-paths @kokonutui/particle-button -y
npx shadcn@latest add @bklit/area-chart @bklit/bar-chart -y
npx shadcn@latest add accordion card badge tabs -y      # plain shadcn primitives as needed

# 7. Patch Bklit (see gotchas 2 & 3), and re-run after every @bklit add
bash <skill>/scripts/patch_registry.sh .
```

Where things land:
- Kokonut → `src/components/kokonutui/<name>.tsx`, default export (`import BackgroundPaths from "@/components/kokonutui/background-paths"`)
- Bklit → `src/components/charts/*` (many files), plus `src/components/shimmering-text.tsx`. Named exports per file: `@/components/charts/area-chart` (exports `AreaChart`, `Area`), `.../grid`, `.../x-axis`, `.../bar-chart`, `.../bar`, `.../bar-x-axis`, `.../tooltip`
- shadcn → `src/components/ui/*`

## Known gotchas (each one cost a failed build or a broken prompt)

1. **Interactive overwrite prompt blocks automation.** The new `shadcn init` writes
   `src/lib/utils.ts` as `export { cn } from "cn"`. Kokonut ships its own `utils` (clsx +
   tailwind-merge), and the first `add @kokonutui/*` stops on "utils.ts already exists.
   Overwrite?". Install `https://kokonutui.com/r/utils.json` once with `-o` (both versions export
   the same `cn`). After that, later adds skip identical files. Pass `</dev/null` to any `shadcn add`
   in scripts, so a surprise prompt fails fast instead of hanging.
2. **Bklit CSS vars are double-prefixed.** The CLI writes `--color-chart-grid: var(----chart-grid)`
   into `@theme inline`. Because the vars are undefined, chart grid, label and tooltip colors fail
   silently. Fix: `sed -i 's/var(----/var(--/g' src/app/globals.css`.
3. **Bklit `chart-loading-label.tsx` has a monorepo import.** It uses
   `"../components/shimmering-text"`, which causes "Module not found" at build. Fix: use
   `"@/components/shimmering-text"`.
4. **Kokonut and shadcn use class-based dark mode** (`@custom-variant dark (&:is(.dark *))`).
   For a dark site, put `className="dark …"` on `<html>`. The OS media query won't flip
   them.
5. **`--font-sans: var(--font-sans)` is self-referential** in the `@theme inline` that shadcn
   generates. It only resolves if `<html>` carries a `next/font` variable named `--font-sans`.
   Name your text font's variable `--font-sans` and your display font's `--font-display`, then add
   `--font-display: var(--font-display);` to `@theme inline` so `font-display` works as a utility.
6. **Next 16 defaults**: `next.config.ts` ships with `cacheComponents: true` and
   `partialPrefetching: true`. Pages that are all client components still prerender static. Keep
   `page.tsx` a server component that composes client sections. That keeps the HTML static and
   the JS split.
7. **Remote images** need `images.remotePatterns` in `next.config.ts` (e.g. `images.unsplash.com`).
   Prefer local files in `public/` for hero imagery: they're faster, and no outside host can
   break your hero.

## Motion essentials (motion.dev)

- Client components: put `"use client"` at the top and `import { motion } from "motion/react"`.
  For a server component that needs only a simple `motion.div`, use
  `import * as motion from "motion/react-client"`.
- Stagger in React: put `transition: { delayChildren: stagger(0.08) }` in a parent variant
  (`stagger` is exported from `motion/react`).
- Reduced motion: `<MotionConfig reducedMotion="user">` and `useReducedMotion()`.
- Lenis (if flowy adds it) runs on Motion's frame loop:
  `new Lenis({ autoRaf: false })` + `frame.setup(({timestamp}) => lenis.raf(timestamp), true)`.
  That keeps one clock, and `useScroll` stays in sync. Import `lenis/dist/lenis.css`.
- Motion+ items (Ticker, AnimateNumber, ScrambleText, splitText, Typewriter, Carousel, Cursor)
  are **paid** and not in the `motion` package. Don't import them unless the user has Motion+.
  The free equivalents are in `assets/motion/` and Kokonut.

## Live docs (check when something disagrees with this file)

- Motion: https://motion.dev/llms.txt. Append `.md` to any docs URL for markdown, e.g. `https://motion.dev/docs/react-transitions.md`
- Kokonut UI: https://kokonutui.com/docs, https://kokonutui.com/setup.md, and the registry index at https://kokonutui.com/r/registry.json (every component, deps and description). Docs pages have markdown at `<url>.md`
- Bklit UI: https://bklit.com/docs/installation, https://bklit.com/docs/components/<chart>, and the source at https://github.com/bklit/bklit-ui (README via raw.githubusercontent.com)
- shadcn: https://ui.shadcn.com/llms.txt
- Next.js: https://nextjs.org/docs
