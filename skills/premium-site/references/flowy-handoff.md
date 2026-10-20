# Handing scroll-linked polish to flowy

**Split of responsibilities:** premium-site builds the page and its time-based motion; flowy
adds the scroll-linked layer on top. Hand off only when the page builds clean and the
screenshots look right without scroll effects. flowy is a polish pass, not a rescue.

## When to hand off

Hand off if the art direction calls for any of: inertial smooth scroll, parallax depth,
scroll-scrubbed reveals (progress follows the scrollbar), pinned or sticky storytelling
scenes, horizontal-scroll galleries, velocity marquees, scroll-driven theme changes, or
section-to-section continuity.

Skip the handoff (and say so in the report) for a short page whose concept is "still and
precise" (Swiss and editorial concepts are often better without scroll effects), or when the
user asked for no smooth scroll.

## How

Invoke the `flowy` skill. If the Skill tool isn't available in your context (for example, you
are a subagent), read flowy's `SKILL.md` and its `references/adaptation-workflow.md` directly
and follow them (locate it with `find / -path '*flowy/SKILL.md' -not -path '*/proc/*' 2>/dev/null`). Use **Mode B: adapt an existing project**. Give it this brief, filled in:

```markdown
## flowy handoff — <site>
Project: <path>, Next.js 16 App Router, Tailwind v4, shadcn/ui.
Motion stack ALREADY PRESENT: `motion` (motion.dev) — `import … from "motion/react"`.
  → Per flowy's tool table, use the existing library. Do NOT add GSAP/ScrollTrigger unless an
    effect is impossible in Motion; if so, justify it in the report.
Motion tokens: src/components/motion/tokens.ts (easing, durations, springs). Reuse them.
Reduced motion: <MotionConfig reducedMotion="user"> in layout. Keep scroll effects off under reduce.
Already animated by premium-site (do not re-animate): hero entrance (MaskedLines/Stagger onMount),
  section entrances (Reveal/Stagger, whileInView once), hovers (HoverLift/Magnetic), charts (InViewMount).
Smooth scroll: none installed. If wanted: `npm i lenis`, copy <premium-site skill>/assets/motion/
  smooth-scroll.tsx (Lenis on Motion's frame.setup — one clock) into src/components/motion/, mount
  <SmoothScroll /> once in layout, import "lenis/dist/lenis.css". Never a second controller.
Visual theme: preserve it exactly. Colors, type and imagery are final.

Requested scroll layer (one dominant idea per section):
| Section (selector) | Effect | Notes |
|---|---|---|
| #hero | background parallax + headline drifts up/fades as you leave | if the background is a Kokonut canvas, transform its wrapper, not the canvas |
| #product | scroll-scrubbed scale/tilt of product frame | |
| #logos | velocity marquee | static row exists; replace with marquee |
| … | | |
```

Mark targets in markup with `id`s on sections, plus `data-flowy="<role>"` on elements you
expect flowy to drive, so it can attach without restructuring.

## GSAP recipe → Motion equivalent (flowy's patterns are written in GSAP)

| flowy (GSAP) | Motion for React |
|---|---|
| `ScrollTrigger` scrub tween | `const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })` → `useTransform(scrollYProgress, [0, 1], [80, -80])` → `style={{ y }}` |
| Pin + horizontal scroll | Tall outer `section` (e.g. `h-[300vh]`), inner `sticky top-0 h-svh overflow-hidden`, track `style={{ x: useTransform(scrollYProgress, [0,1], ["0%", "-66%"]) }}`. Measure the travel from `track.scrollWidth - innerWidth` |
| `gsap.matchMedia()` reduced-motion gate | Keep the same element and `style` object. When reduced, map motion values to resting states (`useTransform(p, [0,1], reduce ? [0,0] : [80,-80])`). Don't swap markup or drop `style`; that causes hydration error #418 |
| Lenis + `gsap.ticker` | `smooth-scroll.tsx` (Lenis on `frame.setup`) |
| `toggleActions` reveals | Already handled: `whileInView` / `Reveal` |
| Smoothed scrub (`scrub: 1`) | `useSpring(useTransform(...), { stiffness: 120, damping: 30 })` |
| Theme flip on scroll | `useTransform(scrollYProgress, [...], ["oklch(…)", "oklch(…)"])` on a wrapper's `backgroundColor` |
| Marquee | CSS `@keyframes` on `transform: translateX`, duplicated track, paused under reduced motion. For velocity response: `useVelocity(scrollY)` → `useTransform` → skew, **on a wrapper element**. The keyframe animation and Motion's `style` both write `transform`, and on the same element the CSS animation wins |

## After flowy returns

Run `check_site.py`, `eslint`, `next build` and the screenshots again. Specifically check:
- One controller: `check_site.py` fails if both Lenis and ScrollSmoother are present.
- Pinned sections release, and the mobile screenshot has no horizontal overflow
  (`screenshot.mjs` reports it).
- `desktop-reduced-full.png` still shows all content with no parallax offsets.
- Visual theme unchanged.
