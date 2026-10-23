# Packaged-web

## `skills/premium-site`
A Claude skill for building high-end animated marketing sites on Next.js + Tailwind v4 + shadcn/ui,
with Motion for animation, Kokonut UI for animated components, Bklit UI for charts, deployed to Vercel.
It encodes art direction, motion rules, a section→component map, a tested signature-effects library
(shader hero, kinetic/variable type, layout morphs, physics, flood transitions, live palettes, scroll-pinned
3D products), 2026 design research, and hands scroll-linked polish to the `flowy` skill. Install the packaged version from `dist/premium-site.skill`.

## `skills/oracle`
Exhaustive, citation-verified web research (tech, markets, academic): multi-angle fan-out, primary
sources first, a claim ledger, a contrary-evidence pass, and every cited source reopened before
answering. Invoke with `/oracle [quick|deep] [tech|markets|academic] <question>`. Claude package:
`dist/oracle.skill`; ChatGPT/Codex edition (`$oracle`, with `agents/openai.yaml`):
`dist/chatgpt/oracle-codex-skill.zip`.

## `skills/orchestrate-analytics-engagement`
Runs substantial analytics work (ML, forecasting, causal inference, segmentation, optimization) as a
routed team of specialist experts with independent first passes, checksum-verified data copies,
a model-selection panel, a canonical-results layer and an independent validator. Includes
`scripts/scaffold_engagement.py` and `scripts/verify_engagement.py` (copy / preflight / release
gates). Written Codex-first (`agents/openai.yaml` included); works in Claude too. Package:
`dist/orchestrate-analytics-engagement.skill`.

## `demos/`
Two sites built with the skill during testing (each deploys on Vercel with its folder as Root Directory):
- `demos/nocturne-cinematic-dark` — cinematic dark hero site ("opening titles of a film")
- `demos/relay-product-landing` — bold product landing page ("emergency broadcast for your API")
- `demos/motion-specimen` — motion showreel for the skill: a WebGL halftone hero, a scroll-pinned 3D soda can, layout morphs, physics, ink-flood transitions, variable type and a live palette switcher (19/19 on the eval grader). Videos: `shots/walkthrough.mp4`, `shots/soda-can.mp4`

Deploy: `cd demos/<name> && npx vercel --prod`.

## `premium-site-workspace/`
Eval prompts, grader (`grade.py` + `probe.mjs`), iteration-1 runs (with skill vs. baseline),
`benchmark.md`, and the static review viewer `iteration-1/review.html`.
