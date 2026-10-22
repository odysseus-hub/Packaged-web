# Motion Specimen v2: deliverable report

A showreel built with the premium-site skill. Every plate demonstrates a motion feature, live.
Watch `shots/walkthrough.mp4`: a 76-second scripted run through the real build, recorded in headless Chromium.

- **Concept:** a risograph-printed specimen book for motion. Light paper stock, blue-black ink, one fluorescent pink.
- **Type:** Bricolage Grotesque · Instrument Sans · JetBrains Mono. **Accent:** `--brand: oklch(0.64 0.25 358)`.

## Effects (all built on Motion's free package plus a raw WebGL shader; no new runtime deps besides lenis)
| Effect | Where | How |
|---|---|---|
| GPU riso halftone field | Hero | Fragment shader: domain-warped fbm → two rotated halftone screens, multiply-printed. Cursor lens + ink bloom; scroll velocity knocks the plates off-register. Runs on Motion's `frame.render` (one clock). Pauses offscreen. |
| Per-letter reveal | Hero h1 | `SplitChars`: per-glyph clip + y/rotate, staggered via `delayChildren: stagger()` |
| Misregistration on cursor | "by the" | Two plates, pink one on springs following the pointer |
| Text decode | Eyebrows, labels | `ScrambleText` (free re-implementation; Motion+'s is paid) |
| Shared-element morph | Swatch book | `layoutId` swatch → dialog panel, `LayoutGroup` filter pill, `popLayout` reflow |
| Throw physics | Sticker sheet | `drag` + `dragConstraints` + `dragElastic` + bounce `dragTransition` |
| Scroll-drawn line, shape morph | Line work | `pathLength` on a spring; `d` morph between same-structure Bézier blobs |
| Ink flood | Into the ink room | `clip-path: circle()` scrubbed by scroll via `useMotionTemplate`; token inversion |
| Scroll-lit words | Ink room | Per-word opacity/y mapped to scroll progress |
| 3D tilt + glare | Ink room | `rotateX/Y` springs, `translateZ` layers, radial glare via motion template |
| Stacking cards | Ink room | Sticky stack, receding scale/rotate per card |
| Pinned horizontal + velocity skew | Ink room | flowy layer: Lenis on `frame.setup`, scrubbed `x`, `useVelocity` skew on a wrapper |
| Live data | Proof | Bklit `live-line-chart`, streaming only while visible (simulated feed, labeled) |
| Ink cursor + progress rule | Global | Spring follower (scale-only), labels `[data-cursor]` targets; spring `scaleX` progress |
| Spring wordmark | Footer | Per-letter rise and hover hop |

## Reduced motion
The shader prints one still frame. The flood rests fully open. All words are lit. Cards don't recede. The pin becomes a grid.
Lenis, the marquee, the skew, the cursor, the misregistration drift and the blob morph all stand down. Verified with a full reduced-motion tour.

## Verified
- `tsc`, `eslint`: clean. `next build`: static.
- `check_site.py`: 0 fail, 1 warn. The warn is the 9 riso-ink hex values used as artwork, and the page reports that itself.
- Eval grader: **19/19**.
- `screenshot.mjs`: no console or hydration errors, no overflow.
- Scripted interaction tours, all with zero page errors:
  - desktop
  - desktop with reduced motion
  - 390px mobile (scrollWidth exactly 390)
- Fixed from visual review:
  - shader drowning the type (added a knock-out zone)
  - nav invisible over the ink room (scroll-in strip)
  - stale cursor labels
  - flat live chart
  - off-brand Kokonut colors (navbar indicator, gauge liquid, cradle type)

## Deploy
`cd demos/motion-specimen && npx vercel --prod`, or import on Vercel with Root Directory `demos/motion-specimen` on branch `claude/premium-site-skill-1qno3a`.
