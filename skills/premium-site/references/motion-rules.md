# Motion rules

Motion should make the page feel **inevitable**: things arrive in the order you'd read them,
settle with weight, and respond to touch like objects. It should never feel busy. These rules
are what that looks like in code. Everything here uses `assets/motion/*`.

Contents: 1. Ownership · 2. Tokens · 3. Choreography & stagger · 4. Hover & press (springs) ·
5. Scroll reveals · 6. Reduced motion · 7. Performance · 8. Kokonut & Bklit inside the system ·
9. Anti-patterns

## 1. Ownership: who animates what

| Kind | Owner | Tool |
|---|---|---|
| Hero entrance on load | this skill | `Stagger onMount`, `MaskedLines` |
| Section entrance when scrolled into view (fires once) | this skill | `Reveal`, `Stagger` / `StaggerItem` |
| Hover, press, magnetic, focus | this skill | `HoverLift`, `Magnetic`, `whileHover` + spring tokens |
| Number roll-ups, chart reveals | this skill | `CountUp`, `InViewMount` + Bklit |
| Component-internal motion (Kokonut physics, canvas loops) | the component | leave alone |
| Smooth/inertial scroll, parallax, scrub, pin, horizontal, marquee, section continuity | **flowy** | Motion `useScroll` (+ Lenis on Motion's frame loop) |

Keeping these separate is what lets flowy add scroll polish later without tearing up your
entrances.

## 2. Tokens (`components/motion/tokens.ts`)

- **Easing**: `easeOutExpo [0.16, 1, 0.3, 1]` for anything arriving. `easeInOutQuart` for
  moving between two resting states. Never `linear`, except for scrubbed or looping progress.
- **Durations**: micro 0.18s (hover/press), base 0.6s (a reveal), hero 1.1s (headline lines).
  If something takes more than 1.2s, the user is waiting on you.
- **Travel**: 12px (small text), 24px (default), 48px (big blocks). Short travel looks
  expensive; 100px slides look cheap.
- **Stagger**: tight 0.04s (letters, icons), base 0.08s (cards, list items), loose 0.14s (hero
  lines, big blocks). Cap a cascade at about 8 items. After that, stagger the rows, not every
  cell.
- **Springs**: `spring.hover` (stiffness 400, damping 28, mass 0.6, snappy) for hover and press;
  `spring.follow` (160/18/0.4, floaty) for magnetic and cursor-linked motion; `spring.layout`
  (visualDuration 0.5, bounce 0.15) for layout and shared-element moves.

Pick a **motion personality** that fits the concept and tune these numbers *once*. A
cinematic site might use a 1.4s hero with a 0.18 stagger; a snappy product site might use
0.5s and 0.06. Then use the tokens everywhere. Consistency is what makes motion read as
designed.

## 3. Choreography & stagger

**Hero order** (on mount, total under 1.6s):
1. Background or imagery fades in (opacity only, 0.8–1.2s).
2. Eyebrow, about 0.1s in.
3. Headline lines via `MaskedLines`, staggered 0.1–0.18s.
4. Subhead, then CTAs (`StaggerItem`), overlapping the tail of the headline.
5. Supporting visual (product shot or chart) last, usually with a slightly larger rise or a
   scale from 0.96.

```tsx
<MaskedLines lines={["Your data,", <>in <em className="text-brand">motion</em>.</>]}
  className="font-display text-[clamp(3.5rem,9vw,9.5rem)] leading-[0.92] tracking-[-0.035em]" />
<Stagger onMount delay={0.5} className="mt-8 flex gap-3">
  <StaggerItem><p className="max-w-md text-lg text-muted-foreground">…</p></StaggerItem>
  <StaggerItem><Magnetic><Button size="lg">Start free</Button></Magnetic></StaggerItem>
</Stagger>
```

**Sections**: one `Stagger` per section, ordered by reading order (heading, then body, then
items). Stagger groups, not every element: the whole section is one gesture.

**Overlap**: start each group before the previous one finishes (delays around 60–70% of the
previous duration). Waiting for each step to end feels like a slideshow.

## 4. Hover & press: springs

- Use springs (from tokens) for everything pointer-driven. They pick up from wherever they are
  when interrupted, so a quick mouse-over never stutters.
- Cards: `HoverLift` (y -4 to -8, scale ≤ 1.02) plus a border or shadow shift in CSS. Don't
  pair it with a 3D tilt unless the concept is tactile.
- Buttons: `whileTap={{ scale: 0.97 }}`. Use `Magnetic` on *one* primary CTA per screen.
- Links: underline drawn with `scale-x` from the left (CSS `transition-transform`).
- Focus states must be at least as visible as hover states (`focus-visible:ring-2 ring-brand`).
  Never put an interaction on hover alone.
- On touch devices hover doesn't exist. Nothing important may live behind it. `Magnetic`
  already ignores non-mouse pointers.

## 5. Scroll reveals (time-based, fire once)

- `whileInView` with `viewport={{ once: true, amount: 0.25, margin: "0px 0px -10% 0px" }}`. This
  is already built into `Reveal`/`Stagger`. Once means once: replaying on scroll-up feels
  twitchy.
- Animate opacity together with a small `y`, or a clip/mask. Avoid blur on big elements:
  `filter: blur` is expensive and looks smeared on low-DPI screens.
- Don't put reveals on everything. Headlines, groups and visuals: yes. Every paragraph and
  icon: no.
- Above the fold, use `onMount`, not `whileInView`, so the hero never waits on an
  IntersectionObserver.
- Bklit charts: wrap them in `<InViewMount aspect="2 / 1">` so their built-in clip-reveal plays
  when seen.
- Anything scroll-*linked* (progress follows the scrollbar) belongs to flowy. Don't hand-roll
  `useScroll` parallax here.

## 6. Reduced motion is designed, not bolted on

`MotionProvider` sets `MotionConfig reducedMotion="user"`. With that set, Motion drops
transform and layout animation and keeps opacity. Content still fades in; it just doesn't
travel. Then:

- **Custom loops** (your own `requestAnimationFrame`, `useAnimationFrame`, CSS `@keyframes`
  marquees and floats): gate them with `useReducedMotion()` or
  `@media (prefers-reduced-motion: reduce) { animation: none }`.
- **CountUp** renders the final value immediately.
- **Bklit**: pass `animationDuration={reduce ? 0 : 1100}` to charts.
- **Kokonut** canvas backgrounds and physics components already check
  `prefers-reduced-motion`. Don't override that.
- **Autoplay video** needs `autoPlay={!reduce}`, plus a poster image.
- **Test it**: `scripts/screenshot.mjs` captures a `desktop-reduced-full.png`. Every piece of
  content must be visible in it.

## 7. Performance

- Animate only `transform` and `opacity` (plus `clip-path` for masks). `scripts/check_site.py`
  flags width, height, top, left and margin in motion props.
- `will-change: transform` only on elements about to animate (`MaskedLines` does this), never
  globally.
- At most one heavy canvas or WebGL component visible at once. Kokonut backgrounds pause when
  offscreen, but two stacked in one viewport will still drop frames on laptops.
- Keep `page.tsx` a server component that imports client sections. Sections that are
  `"use client"` hydrate independently.
- Fonts: `next/font` with `display: swap` (the default). Don't import fonts in CSS.
- Images: `next/image` with explicit `sizes`, `priority` on the hero image only.

## 8. Kokonut & Bklit inside the system

- Kokonut components bring their own motion, tuned by their author. Don't wrap them in extra
  transforms or springs that fight their physics. Wrapping one in `Reveal` (opacity plus a
  small y) for its entrance is fine.
- Kokonut defaults are zinc-on-white with `dark:` variants. Override them through `className`
  (they all accept it), and edit the source in `components/kokonutui/` when needed. It's your
  code now. Typical edits: `bg-transparent`, `text-[var(--brand)]` for canvas color, and
  removing the built-in demo heading when you supply your own.
- Bklit charts animate on mount: clip-reveal, y-domain tween and tooltip springs. Theme them
  through the `--chart-*` variables (see `bklit-charts.md`), not per-chart props, so every
  chart stays consistent.

## 9. Anti-patterns (each makes a site feel cheaper)

- The same fade-up on every element, with the same delay.
- Bouncy overshoot on entrances. Bounce is for things the user threw.
- Animations over 1.2s, or a hero that hides the CTA for more than a second.
- Parallax on text (it hurts reading), or more than two parallax depths per section.
- Typewriter effects on the main headline, which delays the message.
- Infinite attention loops (pulsing buttons, wiggling arrows). One subtle loop per page, at
  most.
- Scroll-jacking, or blocking the scroll during an intro.
