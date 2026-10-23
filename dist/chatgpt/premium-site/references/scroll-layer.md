# The scroll-linked layer

**Split of responsibilities:** the first pass builds the page and its time-based motion. This
layer adds scroll-linked motion on top, once the page builds clean and the screenshots look
right without scroll effects. It's a polish pass, not a rescue.

## When to add it

Add it if the art direction calls for any of: inertial smooth scroll, parallax depth,
scroll-scrubbed reveals (progress follows the scrollbar), pinned or sticky storytelling
scenes, horizontal-scroll galleries, velocity marquees, scroll-driven theme changes, or
section-to-section continuity.

Skip this layer (and say so in the report) for a short page whose concept is "still and
precise" (Swiss and editorial concepts are often better without scroll effects), or when the
user asked for no smooth scroll.

## How

Do it yourself with the rules and recipes below; `references/vfx-recipes.md` has the
tested pieces (flood, stacking, pinned rows, velocity skew). If a `flowy` skill is installed,
you may instead give it this brief, filled in, in its "adapt an existing project" mode:

```markdown
## Scroll layer brief: <site>
Project: <path>, Next.js 16 App Router, Tailwind v4, shadcn/ui.
Motion stack ALREADY PRESENT: `motion` (motion.dev), imported from "motion/react".
  → Stay on Motion. No GSAP/ScrollTrigger unless an effect is impossible in Motion (justify it).
Motion tokens: src/components/motion/tokens.ts. Reuse them.
Reduced motion: <MotionConfig reducedMotion="user"> in layout. Keep scroll effects off under reduce.
Already animated (don't re-animate): hero entrance, section entrances (whileInView once),
  hovers, charts (InViewMount).
Smooth scroll: `npm i lenis`, copy assets/motion/smooth-scroll.tsx (Lenis on Motion's
  frame.setup, one clock), mount <SmoothScroll /> once in layout, import "lenis/dist/lenis.css".
Visual theme: final. Do not change colors, type or imagery.

| Section (selector) | Effect | Notes |
|---|---|---|
```

Rules for this layer:
- **One dominant idea per section.** Generous still space between them is part of the effect.
- **Pins always release.** Never trap the scroll, hijack keyboard or anchor navigation, or
  block reading until an animation finishes.
- **Measure travel from rendered geometry** (ResizeObserver), never guessed viewport math.
- **One smooth-scroll controller,** with `scroll-behavior: smooth` removed from CSS.
- **Reduced motion:** keep the same elements and style objects, and map motion values to
  their resting state. Pinned rows become plain grids.

Mark targets in markup with `id`s on sections, plus `data-scroll="<role>"` on elements you
expect the scroll layer to drive, so it can attach without restructuring.

## GSAP recipe → Motion equivalent (most tutorials are written in GSAP)

| GSAP | Motion for React |
|---|---|
| `ScrollTrigger` scrub tween | `const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })` → `useTransform(scrollYProgress, [0, 1], [80, -80])` → `style={{ y }}` |
| Pin + horizontal scroll | Tall outer `section` (e.g. `h-[300vh]`), inner `sticky top-0 h-svh overflow-hidden`, track `style={{ x: useTransform(scrollYProgress, [0,1], ["0%", "-66%"]) }}`. Measure the travel from `track.scrollWidth - innerWidth` |
| `gsap.matchMedia()` reduced-motion gate | Keep the same element and `style` object. When reduced, map motion values to resting states (`useTransform(p, [0,1], reduce ? [0,0] : [80,-80])`). Don't swap markup or drop `style`; that causes hydration error #418 |
| Lenis + `gsap.ticker` | `smooth-scroll.tsx` (Lenis on `frame.setup`) |
| `toggleActions` reveals | Already handled: `whileInView` / `Reveal` |
| Smoothed scrub (`scrub: 1`) | `useSpring(useTransform(...), { stiffness: 120, damping: 30 })` |
| Theme flip on scroll | `useTransform(scrollYProgress, [...], ["oklch(…)", "oklch(…)"])` on a wrapper's `backgroundColor` |
| Marquee | CSS `@keyframes` on `transform: translateX`, duplicated track, paused under reduced motion. For velocity response: `useVelocity(scrollY)` → `useTransform` → skew, **on a wrapper element**. The keyframe animation and Motion's `style` both write `transform`, and on the same element the CSS animation wins |

## After the layer is in

Run `check_site.py`, `eslint`, `next build` and the screenshots again. Specifically check:
- One controller: `check_site.py` fails if both Lenis and ScrollSmoother are present.
- Pinned sections release, and the mobile screenshot has no horizontal overflow
  (`screenshot.mjs` reports it).
- `desktop-reduced-full.png` still shows all content with no parallax offsets.
- Visual theme unchanged.
