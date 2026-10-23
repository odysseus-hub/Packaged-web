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

# 7. Patch Bklit (gotchas 2, 3 & 7), and re-run after every @bklit add
bash <skill>/scripts/patch_registry.sh .

# 8. eslint override for vendored code (gotcha 8), font var mapping (gotcha 5), layout
#    template — see scaffold.sh for the exact edits.
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
   the same `cn`). After that, later adds skip identical files. Already-installed shadcn `ui/*`
   files may still import `cn` from the `cn` package while everything else imports
   `@/lib/utils`. Both work, and it's harmless. Pass `</dev/null` to any `shadcn add`
   in scripts, so a surprise prompt fails fast instead of hanging.
2. **Bklit CSS vars were double-prefixed** (fixed upstream by 2026-10-22; the patch is now a no-op, kept for older registry snapshots). The CLI writes `--color-chart-grid: var(----chart-grid)`
   into `@theme inline`. Because the vars are undefined, chart grid, label and tooltip colors fail
   silently. Fix: `sed -i 's/var(----/var(--/g' src/app/globals.css`.
3. **Bklit `chart-loading-label.tsx` had a monorepo import** (fixed upstream by 2026-10-22 to `"../shimmering-text"`; the patch is a no-op now). It uses
   `"../components/shimmering-text"`, which causes "Module not found" at build. Fix: use
   `"@/components/shimmering-text"`.
4. **Kokonut and shadcn use class-based dark mode** (`@custom-variant dark (&:is(.dark *))`).
   For a dark site, put `className="dark …"` on `<html>`. The OS media query won't flip
   them.
5. **Font variables don't line up.** shadcn's `@theme inline` has
   `--font-sans: var(--font-sans)`, which refers to itself and only resolves if `<html>` carries
   a `next/font` variable named `--font-sans`. It also has `--font-mono: var(--font-geist-mono)`
   and `--font-heading: var(--font-sans)`. Meanwhile create-next-app's layout emits
   `--font-geist-sans` and `--font-geist-mono`. Without a fix, headings silently fall back to
   Times New Roman. `scaffold.sh` maps the theme to role names (`--font-display`,
   `--font-sans`, `--font-mono`) and installs `assets/templates/layout.tsx`, which defines all
   three.
6. **Next 16 defaults**: `next.config.ts` ships with `cacheComponents: true` and
   `partialPrefetching: true`. Pages that are all client components still prerender static. Keep
   `page.tsx` a server component that composes client sections. That keeps the HTML static and
   the JS split.
7. **Bklit `bar.tsx` draws negative heights.** While the y-domain tweens, zero-value bars
   compute `innerHeight - valuePos < 0`, which logs "negative height" `<rect>` console
   errors. `patch_registry.sh` clamps it with `Math.max(0, …)`.
8. **eslint-config-next 16 fails vendored registry code.** Its React-Compiler hook rules
   (`react-hooks/refs`, `set-state-in-effect`, `purity`, `immutability`) report 30–60 errors in
   freshly installed Bklit and Kokonut source. `scaffold.sh` adds a `files:` override that turns
   those rules off for `components/{charts,kokonutui,ui}/**` only. Your own code stays strict;
   don't silence errors there.
9. **Stopping servers.** Both `npx next start` and `./node_modules/.bin/next start` are wrappers
   that spawn `next-server` as a child process. `kill $!` kills only the wrapper and orphans
   the real server, which keeps holding the port. Either use `screenshot.mjs <site-dir>`
   (it serves its own build and kills the whole process tree), or stop your server with
   `pkill -P $PID; kill $PID`. Never `pkill -f next`: it kills other projects' servers on a
   shared machine.
10. **Hydration and reduced motion.** Motion's `useReducedMotion()` returns the real preference
    on the first client render, but the server rendered `null`. Branching *markup* on it (text,
    conditional elements, `style={reduce ? undefined : {...}}`) triggers React error #418. Use
    `usePrefersReducedMotion()` (in `assets/motion/`, built on `useSyncExternalStore`) for
    render-affecting branches, or keep the markup identical and change only the motion values.
11. **`new Date()` (and `Math.random()`) in a server component fails the build** under
    Next 16's default `cacheComponents`: "encountered the unstable value `new Date()` while
    prerendering". The classic victim is a footer copyright year. Hardcode the year, or render
    it from a client component. Verified 2026-10-22.
12. **Remote images** need `images.remotePatterns` in `next.config.ts` (e.g. `images.unsplash.com`).
   Prefer local files in `public/` for hero imagery: they're faster, and no outside host can
   break your hero.

## Optional: 3D (three.js + React Three Fiber)
`scaffold.sh --3d`, or by hand:
`npm i three@0.186.1 @react-three/fiber@9.8.2 @react-three/drei@10.7.9 && npm i -D @types/three@0.186.0`.
Fiber 9.8 peers on `react >=19 <19.4`. Load scenes with `next/dynamic(..., { ssr: false })`.
Details: `references/3d-product.md`.

## Motion essentials (motion.dev)

- Client components: put `"use client"` at the top and `import { motion } from "motion/react"`.
  For a server component that needs only a simple `motion.div`, use
  `import * as motion from "motion/react-client"`.
- Stagger in React: put `transition: { delayChildren: stagger(0.08) }` in a parent variant
  (`stagger` is exported from `motion/react`).
- Reduced motion: `<MotionConfig reducedMotion="user">` and `useReducedMotion()`.
- Lenis (if the scroll layer adds it) runs on Motion's frame loop:
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
