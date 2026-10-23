# VFX recipes: the signature-effects library

Ready-made effects in `assets/fx/`, `assets/palette/` and `assets/3d/`. Every one was built,
verified (lint, build, desktop, mobile and reduced-motion tours), and shipped in the Motion
Specimen demo (`demos/motion-specimen`). Copy what the concept calls for into
`src/components/fx/` (or `palette/`, `3d/`).

**Restraint first.** A page gets **one hero moment and one signature interaction**. Pick from
this list deliberately; a page wearing six of these looks like a template gallery. The demo
breaks the rule on purpose because it's a catalogue.

Contents: 1. Shader hero · 2. Kinetic type · 3. Layout morphs · 4. Physics · 5. Line work ·
6. Section transitions · 7. Depth & stacking · 8. Variable type · 9. Live palette ·
10. Chrome · 11. 3D product · 12. CSS-only scroll · Gotchas we paid for

## 1. Shader hero: `fx/halftone-shader.tsx`
A two-ink halftone field (fragment shader, raw WebGL) on domain-warped noise. The cursor pulls
a lens and blooms ink, and scroll velocity knocks the ink plate off-register.
- **Use when:** the concept is print, texture or generative, and you want a hero image without
  photography.
- **Wire:** an `absolute inset-0` layer behind the hero copy. Inks come from `--paper`/`--ink`/`--brand`.
- **Built in:** runs on Motion's `frame.render` (one clock), pauses offscreen and on hidden tabs,
  freezes to one still frame under reduced motion, and repaints on a palette change.
- **Must do:** keep a **knock-out zone** under the type. The shader thins ink on the left and
  bottom, where headlines sit. Without it the field drowns the copy (we shipped that bug
  once). Put small text (eyebrows, links) on a `bg-background/85` chip.

## 2. Kinetic type: `fx/text.tsx`
- `SplitChars`: each glyph rises and un-tilts from its own clip, staggered with
  `delayChildren: stagger()`. Words don't break. `aria-label` carries the string.
- `ScrambleText`: glyph-noise decode in view (free; Motion+'s ScrambleText is paid). The
  server renders the final string, the scramble runs after mount, and it's off under reduced motion.
- `ScrollWords`: words ink in as they reach the eye line. Opacity and y are mapped to scroll.
  Use it for one manifesto paragraph, never body copy.
- `OffsetWord`: a misregistered accent plate that drifts with the cursor on springs. One word
  per headline.

## 3. Layout morphs (Motion `layoutId`)
A swatch or card becomes its detail panel: the same `layoutId` sits on the grid item and the
dialog, inside `AnimatePresence`. Filters use a `layoutId` pill plus `AnimatePresence
mode="popLayout"` on the grid so the items reflow.
- Put `borderRadius` in `style`, not a class, so Motion corrects corner distortion mid-morph.
- In the dialog: `role="dialog"`, Escape closes, and focus moves to Close on open.
- `MotionConfig reducedMotion="user"` disables layout animation automatically.

## 4. Physics
- **Throwables:** `drag` + `dragConstraints={ref}` + `dragElastic≈0.18` +
  `dragTransition={{ bounceStiffness: 320, bounceDamping: 16, power: 0.35 }}`, with
  `whileDrag` scale and rotate. Add `touch-none` on the item only (the sheet keeps
  `touch-pan-y`).
- **Kokonut physics pieces:** `cradle-text`, `card-stack`, `attract-button`, `liquid-gauge`.
  Recolor them in source (see section-map).

## 5. Line work (SVG)
- **Scroll-drawn path:** `style={{ pathLength: useSpring(useTransform(scrollYProgress, ...)) }}`.
  Use the hydration-safe hook if reduced motion swaps the value.
- **Shape morph:** animate `d` only between paths that share an **identical command structure**.
  Generate them with one function (Catmull-Rom → cubic Bézier over N points); `plate-line.tsx`
  in the demo has `blob()`.

## 6. Section transitions: the ink flood
Instead of cutting to a dark section, flood it: an `absolute inset-0 bg-background` layer with
`clipPath: useMotionTemplate\`circle(${r}% at 50% 100%)\``, where `r` is scrubbed 0→100 over
a ~90svh entry block. Then invert the tokens on the section (`.ink-room { --background:
var(--ink); --foreground: var(--paper) }`).
- Put the clip on a **dedicated entry block**, not the whole tall section. Percent radii
  scale with the element's size, so a huge section floods instantly.
- Bottom-origin circles ink the content edge first, so the light text on the dark flood is
  never shown on paper.
- A fixed nav needs a scroll-in backdrop strip, or it vanishes over the dark section.

## 7. Depth & stacking: `fx/tilt.tsx` and the stack pattern
- `TiltCard` + `Depth`: `rotateX/Y` springs, `translateZ` layers under `preserve-3d`, and a
  radial glare driven by a motion template. Mouse only; flat under reduced motion.
- **Stacking cards:** `sticky` wrappers with `top: calc(12svh + i*26px)`. Each card's scale and
  rotate recede as later cards land, mapped from the stack's `scrollYProgress`. Ancestors
  must not be `overflow: hidden`; use `overflow: clip`, which keeps sticky working.

## 8. Variable type: `fx/variable-type.tsx`
Glyph weight and width swell toward the pointer through the font's own axes, on springs.
An idle scanner weaves across the lines for touch screens.
- Needs a variable font with `wght` (and ideally `wdth`): Bricolage Grotesque, Inter Tight,
  Archivo or Fraunces. In `next/font`, list the extra axes (`axes: ["opsz","wdth"]`).
- **This bends the "transform only" rule:** axis changes reflow glyph advances. Contain it to
  one or two display lines (`contain: layout paint`), never body copy, and switch it off under
  reduced motion.
- Measure glyph centers once (and on resize or `document.fonts.ready`), not per frame.

## 9. Live palette: `palette/*`
The palette is three base inks (`--paper`, `--ink`, `--brand`) per `[data-palette]`. Every
other color derives from them with `color-mix()`, so a swap is one attribute. Clicking an ink
runs `document.startViewTransition()`, and the new palette grows as a `clip-path` circle from the
click point (`::view-transition-new(root)`; default crossfade disabled in CSS).
- A boot script in `<head>` (`PALETTE_BOOT`) applies the saved choice before paint. Put
  `suppressHydrationWarning` on `<html>`.
- `usePalette()` reads the attribute through `useSyncExternalStore` (hydration-safe).
- View Transitions (same-document) are Baseline: Chrome/Edge 111, Safari 18, Firefox 144.
  The fallback is an instant swap; reduced motion also swaps instantly.
- Check contrast for **every** palette, not just the default.

## 10. Chrome: `fx/chrome.tsx`
- `ScrollProgress`: a spring `scaleX` rule at the top.
- `LabelCursor`: a decorative ink dot that grows into a label over `[data-cursor="Spin"]`
  targets. Native cursor stays visible, fine pointer only, gone under reduced motion. It
  animates `scale` (fixed 84px dot), never width or height. It re-reads its target on
  `scroll`, or the label goes stale.

## 11. 3D product: `3d/*`
A scroll-pinned, grabbable product. See `references/3d-product.md`.

## 12. CSS-only scroll-driven animation
Native `animation-timeline: view()` / `scroll()` is Baseline and runs off the main thread.
Use it for the simple ~80%: rules drawing in, progress bars, subtle reveals. Zero JS:
```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .rule-draw::before { animation: rule-draw linear both; animation-timeline: view(); animation-range: entry 10% cover 35%; }
  }
}
```
Keep Motion's `useScroll` for anything that also needs springs, velocity or JS state.

## Gotchas we paid for
- **One clock.** Shaders and 3D run on Motion's `frame` loop or R3F's own loop, gated by
  `IntersectionObserver` or `useInView`. Never a stray `requestAnimationFrame` that runs
  offscreen.
- **Hydration.** Any reduced-motion branch that changes markup uses
  `usePrefersReducedMotion()`. Client-only data (live charts, `Date.now()`, `Math.random()`)
  mounts inside `InViewMount` or `dynamic(..., { ssr: false })`.
- **React-Compiler lint (eslint-config-next 16) rejects:**
  - mutating props or hook return values (`camera.position.z = …`, `dragRef.current.vel = …`
    when passed as a prop): pass a callback the owner defines, or use declarative props
    (`<PerspectiveCamera position={…}/>`)
  - reassigning closure variables inside `useMemo` (`let s; rnd = () => s = …`): move the
    generator to module scope
  - `setState` directly in an effect body: set it from a callback, an event or `onUpdate`
- **Headless screenshots lie** about View Transitions (blank mid-wipe), sticky pins (empty
  gaps) and very tall pages (blank past ~16k px). Verify those with viewport shots at specific
  scroll positions, or a recorded video (`recordVideo` in Playwright).
