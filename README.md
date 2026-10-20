# Packaged-web

## `skills/premium-site`
A Claude skill for building high-end animated marketing sites on Next.js + Tailwind v4 + shadcn/ui,
with Motion for animation, Kokonut UI for animated components, Bklit UI for charts, deployed to Vercel.
It encodes art direction, motion rules, a section→component map, and hands scroll-linked polish to
the `flowy` skill. Install the packaged version from `dist/premium-site.skill`.

## `demos/`
Two sites built with the skill during testing (each deploys on Vercel with its folder as Root Directory):
- `demos/nocturne-cinematic-dark` — cinematic dark hero site ("opening titles of a film")
- `demos/relay-product-landing` — bold product landing page ("emergency broadcast for your API")

Deploy: `cd demos/<name> && npx vercel --prod`.

## `premium-site-workspace/`
Eval prompts, grader (`grade.py` + `probe.mjs`), iteration-1 runs (with skill vs. baseline),
`benchmark.md`, and the static review viewer `iteration-1/review.html`.
