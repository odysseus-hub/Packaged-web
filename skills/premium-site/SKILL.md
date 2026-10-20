---
name: premium-site
description: >-
  Build high-end, animated marketing websites — landing pages, product launches, studio and
  portfolio sites, SaaS homepages, waitlists — on Next.js + Tailwind + shadcn/ui, with Motion
  (motion.dev) for animation, Kokonut UI for animated components, Bklit UI for charts, deployed
  to Vercel. Covers art direction (one bold concept, display type, hero imagery, a single accent,
  generous spacing), motion rules (staggers, spring hovers, scroll reveals, reduced motion) and
  which component to use for each section. Use whenever someone wants a site or landing page
  that looks premium, polished, cinematic, award-worthy, "like Linear/Vercel/Apple", or "not
  generic" — even if they only say "make me a landing page", "build a homepage for my product",
  or "I need a marketing site", and even if they never name the libraries. Also use when
  restyling an existing Next.js marketing page to feel premium. Hands scroll-linked polish
  (smooth scroll, parallax, pinning) to the flowy skill.
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
bash <skill>/scripts/scaffold.sh <dir> [--dark] \
  --kokonut "background-paths particle-button" \
  --bklit "area-chart bar-chart"
```

The script runs create-next-app, `shadcn init`, adds the `@kokonutui` and `@bklit`
registries, installs `motion`, patches two Bklit install bugs (`scripts/patch_registry.sh`),
and copies the Motion primitives from `assets/motion/` into `src/components/motion/`.
Re-run `patch_registry.sh` after any later `shadcn add @bklit/*`. If you'd rather run the
commands by hand, or something fails, read `references/stack-setup.md`, which has the
commands, versions and every known gotcha.

Then wire the layout: load the display and text fonts, set the `--brand` tokens, and wrap
`{children}` in `<MotionProvider>`. `references/art-direction.md` §6 has copy-ready code.

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
- **Only transform and opacity animate.** Never width, height, top, left or margin.

### 5. Hand off scroll-linked polish to flowy

This skill owns **time-based** motion: entrances, staggers, hovers, in-view reveals.
**Scroll-linked** motion (smooth/inertial scroll, parallax, scroll-scrubbed reveals, pinned
or horizontal sections, marquees, section-to-section continuity) belongs to the **flowy**
skill. Once the page is built and passes step 6's checks, invoke flowy, or read its
SKILL.md if you can't invoke it, in "adapt an existing project" mode. Pass it the handoff
brief from `references/flowy-handoff.md`. The brief states that the project already owns
Motion, so flowy stays on Motion's clock (`useScroll`, and Lenis via `frame.setup` if it
wants inertia) and doesn't add GSAP. Two animation clocks on one page cause jank.

If flowy isn't available, ship without scroll-linked effects and say so. A clean page with
good entrances beats a half-wired parallax.

### 6. Verify, then deploy

```bash
python3 <skill>/scripts/check_site.py <dir>         # static audit: a11y, tokens, registry bugs
cd <dir> && npx eslint && npx next build             # must be clean
npx next start -p 3000 & node <skill>/scripts/screenshot.mjs http://localhost:3000 ./shots
```

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
- what flowy added, or why it was skipped
- the deploy URL or the deploy command

## Reference map

| Need | Read |
|---|---|
| Install commands, versions, registry gotchas, Next 16 notes | `references/stack-setup.md` |
| Concept, type pairings, hero imagery, color, spacing, wiring tokens | `references/art-direction.md` |
| Motion tokens, choreography, springs, reveals, reduced motion, perf | `references/motion-rules.md` |
| Which component for which section (Kokonut / Bklit / shadcn / custom) | `references/section-map.md` |
| Bklit chart API, theming to the accent, in-view reveal | `references/bklit-charts.md` |
| What to hand flowy and how to keep one animation clock | `references/flowy-handoff.md` |
| Vercel CLI / Git deploy, env, domains, checks | `references/deploy-vercel.md` |
