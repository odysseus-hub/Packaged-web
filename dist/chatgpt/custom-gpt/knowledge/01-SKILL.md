---
name: premium-site
description: >-
  Build high-end animated marketing websites (landing pages, product launches, studio and
  portfolio sites, SaaS homepages) on Next.js + Tailwind + shadcn/ui, with Motion for animation,
  Kokonut UI components, Bklit UI charts and Vercel deploys. Covers art direction (one bold
  concept, display type, hero imagery, one accent, spacing), motion rules, a section-to-component
  map, and a tested effects library: shader heroes, kinetic and variable type, layout morphs,
  physics, ink-flood transitions, live palette swaps and scroll-pinned 3D products. Use whenever
  someone wants a site that looks premium, cinematic, award-worthy or "not generic", even if they
  only say "make me a landing page" or never name the libraries; also when they ask for more
  motion, VFX, shaders, a 3D product spin or a palette switch. Includes a scroll-linked layer
  playbook (smooth scroll, parallax, pinning).
---

# Premium Site

Premium sites feel expensive because of decisions, not effects. Most AI-built landing pages
fail the same way: centered everything, a purple gradient, three equal feature cards, and
fades on every element. This skill gets past that with an order of work. **Art direction
first, then structure, then motion, then polish.** Each layer is cheap to change before the
next one goes on and expensive after.

The stack is fixed: **Next.js (App Router) + Tailwind v4 + shadcn/ui**, **Motion** for
animation, **Kokonut UI** for animated components, **Bklit UI** for charts, and **Vercel** for
deployment. Kokonut and Bklit are both shadcn registries, so everything installs through one
CLI and lands in the project as source code you own and can edit.

## Where this runs (ChatGPT / Codex)

`<skill>` below means this skill's folder: for example `~/.codex/skills/premium-site` or
`~/.agents/skills/premium-site` in Codex, or wherever ChatGPT mounted it (often under
`/home/oai/skills/`). Find it by locating this `SKILL.md`.

- **A shell with Node 20+ and network** (Codex CLI, IDE, desktop): run the scripts as written.
- **A sandbox without npm or network** (ChatGPT's code tool): don't pretend to scaffold or
  build. Write the full project files (start from `assets/`; the templates are real, tested
  source), package them as a downloadable zip, and give the user the exact commands
  (`scaffold.sh` flags, `npm install`, `npm run build`, `check_site.py`, `screenshot.mjs`) to
  run locally. Say plainly which checks you could not run.
- Copy component source from `assets/` rather than re-deriving it. Each file passed lint,
  typecheck, build and a browser test.

## Workflow

### 1. Write the art direction before any code

Fill in `assets/templates/art-direction.md` and save it as `ART_DIRECTION.md` in the project.
It takes five minutes and every later decision gets checked against it. Read
`references/art-direction.md` for how to fill each field well. The essentials:

- **One bold concept**: a single sentence a designer could say out loud ("a film title
  sequence for a database", "a field guide printed on newsprint"). Every section serves it.
  One idea pushed far beats three ideas half-done.
- **Display type**: one characterful display face plus one quiet text face, loaded with
  `next/font`. The display face does most of the brand's work, so set it big.
- **Hero imagery**: decide what the first screen *shows*. Options are generative (a Kokonut
  canvas background), the product itself, photography, or type-as-image. "Nothing" is not an
  option.
- **One accent color** in OKLCH, saved as `--brand`. Everything else is tinted neutrals. The
  accent covers under 10% of any screen; that scarcity is what makes it read as brand.
- **Spacing**: section padding of at least `clamp(6rem, 12vw, 11rem)`. Cramped spacing is the
  quickest giveaway of a cheap site.

If the user gave a brief, extract these from it. Where it is silent, make a confident choice
and state it. Don't stall on questions you can answer with taste.

### 2. Scaffold (scripted, about 2 minutes)

```bash
bash <skill>/scripts/scaffold.sh <dir> [--dark] [--fx] [--3d] \
  --kokonut "background-paths particle-button" \
  --bklit "area-chart bar-chart"
```

`--fx` copies the signature-effects library (`assets/fx/` and `assets/palette/`) into
`src/components/`. `--3d` installs three.js + React Three Fiber and copies the product-scene
templates (`assets/3d/`). Add each only when the art direction calls for it.

The script runs create-next-app, `shadcn init`, adds the `@kokonutui` and `@bklit`
registries, and installs `motion`. It also:

- patches the known Bklit install bugs (`scripts/patch_registry.sh`)
- copies the Motion primitives from `assets/motion/` into `src/components/motion/`
- makes eslint lenient on vendored registry code; your own code stays strict
- maps the theme's font variables to role names (`--font-display` / `--font-sans` /
  `--font-mono`)
- replaces the stock layout with `assets/templates/layout.tsx`: role-named `next/font` setup
  plus `<MotionProvider>`

Lenis isn't installed by default: smooth scroll belongs to the scroll-linked layer in step 5,
which adds `lenis` and copies `assets/motion/smooth-scroll.tsx` back in (or pass `--lenis`
up front).
Re-run `patch_registry.sh` after any later `shadcn add @bklit/*`. If you'd rather run the
commands by hand, or something fails, read `references/stack-setup.md`, which has the
commands, versions and every known gotcha.

Then make it yours:

- swap the three fonts in `layout.tsx` for the art direction's pairing, keeping the variable
  names
- set the `--brand` tokens in `globals.css`
- replace the metadata TODOs

`references/art-direction.md` §6 has copy-ready code.

### 3. Map sections to components

Write the page as a list of sections, each with a job, a component, and *one* motion idea.
Use `references/section-map.md`, which maps every common marketing section to the Kokonut,
Bklit, shadcn or custom Motion component that fits, with install names and props. Some rules
of thumb:

- **Every section needs a different layout.** Alternate density, alignment and scale: a
  full-bleed hero, then an asymmetric split, then a tight grid, then one huge number. Rhythm
  is what makes a long page feel designed.
- **One hero moment, one signature interaction.** Pick one standout Kokonut piece (say, a
  generative hero, or a particle CTA) and let the rest be quiet. Three showpieces compete and
  cancel out.
- **Charts are proof, not decoration.** Use Bklit where a number is the argument (growth,
  speed, conversion), with a headline that says what the chart proves.
- **Choose the signature moment from the effects library.** `references/vfx-recipes.md` lists
  tested effects:
  - a shader hero
  - kinetic and variable type
  - layout morphs
  - throwable physics
  - scroll-drawn lines
  - an ink-flood section transition
  - 3D tilt and stacking cards
  - a live palette swap
  - a scroll-pinned 3D product (`references/3d-product.md`)

  Pick the **one** that serves the concept, and maybe one quieter supporting effect. Check
  `references/design-trends.md` for what currently reads as fresh or dated: 3D should tie to
  scroll, not float in the hero.

### 4. Build with the motion rules

Read `references/motion-rules.md` before writing animation code. In short:

- **Timing comes from tokens.** Everything imports from `components/motion/tokens.ts`:
  expo-out entrances (~0.6s, hero ~1.1s), 12–24px of travel, 40–140ms staggers.
- **Stagger groups, don't fade elements.** A section enters as one choreographed cascade
  (`<Stagger>` + `<StaggerItem>`), in reading order. The hero runs on mount (`onMount`);
  everything else runs once, in view.
- **Springs for anything the pointer touches.** `HoverLift` and `Magnetic` use spring tokens,
  so they stay interruptible and physical. Tweens are for entrances.
- **Display headlines use `<MaskedLines>`.** Lines rise from behind a clip, with art-directed
  line breaks.
- **Bklit charts go inside `<InViewMount>`.** Otherwise their reveal plays off-screen at load.
- **Reduced motion is part of the design.** `MotionConfig reducedMotion="user"` covers
  transforms. Gate custom loops and CSS keyframes yourself. Content never depends on an
  animation finishing.
- **Keep reduced motion hydration-safe.** When the preference changes *rendered output*
  (text, which element renders, inline style objects), read it with
  `usePrefersReducedMotion()` from the primitives. Better still, keep the markup identical and
  resolve motion values to their resting state. Motion's `useReducedMotion()` is fine for
  choosing animation targets, but branching markup on it causes React hydration error #418.
- **Only transform and opacity animate.** Never width, height, top, left or margin. The one
  contained exception is variable-font axes on a single display line (`fx/variable-type.tsx`).
- **Every loop is gated.** Shaders, canvases and 3D render on Motion's frame loop or R3F's own,
  pause offscreen, and fall back to one still frame under reduced motion.
- **Palettes are three tokens.** Define `--paper`, `--ink` and `--brand`, and derive everything
  else with `color-mix()`. Recoloring, inverted sections and live palette swaps then come
  for free.

### 5. Add the scroll-linked layer

This skill's first pass owns **time-based** motion: entrances, staggers, hovers, in-view
reveals. **Scroll-linked** motion is a separate layer, added once the page passes step 6's
checks: smooth or inertial scroll, parallax, scroll-scrubbed reveals, pinned or horizontal
sections, marquees, and section-to-section continuity.

Follow `references/scroll-layer.md`. Pick one dominant scroll idea per section, all on
Motion's clock (`useScroll`/`useTransform`, sticky pins, Lenis driven by `frame.setup`). Never
add GSAP alongside Motion: two animation clocks on one page cause jank. If a `flowy` skill is
installed, you can hand it the brief in that file instead.

If time is short, ship without scroll-linked effects and say so. A clean page with good
entrances beats a half-wired parallax.

### 6. Verify, then deploy

```bash
python3 <skill>/scripts/check_site.py <dir>         # static audit: a11y, tokens, registry bugs
(cd <dir> && npx eslint && npx next build)           # must be clean
node <skill>/scripts/screenshot.mjs <dir> <dir>/../shots   # serves the build itself, then stops it
```

`screenshot.mjs` reports console errors, hydration errors and horizontal overflow. Treat any
of those as a failure. Use `--port N` if your environment assigns port ranges.

If you start a server yourself, note that `next start` is a wrapper: it spawns `next-server`
as a child process. Killing only the wrapper's PID orphans the real server. Stop it with
`pkill -P $PID; kill $PID`. That kills the server's children, then the wrapper, and stays
scoped to your own process. Never `pkill` by name: other projects on the machine may be
running their own servers.

**Look at the screenshots.** This step matters more than any other check. Review
desktop-hero, mobile-full and desktop-reduced-full. Ask: is the concept obvious in the first
screen? Is anything overlapping, clipped or overflowing on mobile? With reduced motion, is
every piece of content visible? Fix what you see, then capture again.

Deploy with `references/deploy-vercel.md`. If no Vercel credentials exist (no `VERCEL_TOKEN`,
no logged-in CLI), don't block. Leave the project build-clean, and give the user the
one-command deploy plus the Git-import path.

## Deliverable report

Finish with a short report:
- the concept sentence
- the type pairing
- the accent color
- the section map (section → component → motion idea)
- dependencies added
- reduced-motion behavior
- what was verified (build, lint, audit, screenshots)
- what the scroll layer added, or why it was skipped
- the deploy URL or the deploy command

## Reference map

| Need | Read |
|---|---|
| Install commands, versions, registry gotchas, Next 16 notes | `references/stack-setup.md` |
| Concept, type pairings, hero imagery, color, spacing, wiring tokens | `references/art-direction.md` |
| Motion tokens, choreography, springs, reveals, reduced motion, perf | `references/motion-rules.md` |
| Which component for which section (Kokonut / Bklit / shadcn / custom) | `references/section-map.md` |
| Bklit chart API, theming to the accent, in-view reveal | `references/bklit-charts.md` |
| Scroll-linked layer: pins, parallax, scrub, marquee, Lenis, on one clock | `references/scroll-layer.md` |
| Vercel CLI / Git deploy, env, domains, checks | `references/deploy-vercel.md` |
| Signature effects: shader hero, kinetic and variable type, morphs, physics, flood, tilt, stack, palette swap | `references/vfx-recipes.md` |
| Scroll-pinned 3D product (three.js + R3F): modeling, materials, choreography, mobile, gotchas | `references/3d-product.md` |
| What reads as fresh vs. dated in 2026 (research with sources) | `references/design-trends.md` |
