# Motion Specimen: deliverable report

A showcase built with the premium-site skill, where every section demonstrates the feature it describes.

- **Concept:** a risograph-printed specimen book for motion. Every plate demonstrates the rule it prints.
- **Type:** Bricolage Grotesque (display, opsz + wdth) · Instrument Sans (text) · JetBrains Mono (labels)
- **Accent:** `--brand: oklch(0.64 0.25 358)`, fluorescent riso pink, on paper `oklch(0.965 0.012 85)` and blue-black ink.
  Light theme, chosen deliberately to differ from the two dark demos (see the convergence note in iteration-2).

## Section map: feature shown per plate
| Plate | Feature demonstrated | Components |
|---|---|---|
| 00 Hero | generative hero, masked headline, magnetic CTA, scroll-away parallax | Kokonut `dot-field`, `MaskedLines`, `Stagger onMount`, `Magnetic`, `useScroll` |
| Nav | animated nav that folds on scroll | Kokonut `morphic-navbar` (recolored to brand) |
| 01 Art direction | concept, type pairing, one accent, spacing rhythm | specimen cards, `Stagger` in view |
| 02–03 Stagger & springs | motion tokens; replayable cascade; spring hover | `Stagger`/`StaggerItem`, `HoverLift` |
| 04 Kinetic type | one expressive line | Kokonut `dynamic-text` |
| 05 Proof | numbers as argument; charts revealed in view | `CountUp`, Bklit `bar-chart`, `gauge-chart`, `area-chart` inside `InViewMount` |
| 06–07 Section map & verification | component choices; the checks | Kokonut `smooth-tab`, `notification-stack` (recolored) |
| 08 Scroll (flowy layer) | Lenis on Motion's clock, pinned horizontal scrub, velocity-skew marquee | `SmoothScroll`, `useScroll`/`useTransform`, `useVelocity`/`useSpring` |
| 09 Reduced motion | live preview of the reduced-motion fallback | shadcn `Switch` + nested `MotionConfig` |
| 10 FAQ | calm section | shadcn `Accordion` |
| 11 Install | signature CTA | `MaskedLines`, Kokonut `particle-button` (copies the install command) |

## Data honesty
- Plate 05 shows real numbers from this repo's eval: 38/38 vs 21/38 checks (round 1), 37/38 vs 21/38 (round 2), +42 pts.
- The area chart plots the actual `easeOutExpo` curve. The "90% in the first third" caption was computed (90.3%).
- Plate 07's results are this page's real check results.

## Reduced motion
Transforms drop out and opacity stays (MotionConfig "user"). Lenis, the pin, the parallax, the marquee loop and the velocity skew all stand down.
The pinned row becomes a plain grid, and CountUp shows final values. Render-affecting branches use the hydration-safe `usePrefersReducedMotion()`.

## Verified
- `tsc`, `eslint`: clean. `next build`: static.
- `check_site.py`: 0 fail, 0 warn, 14 pass.
- `screenshot.mjs`: no console or hydration errors, no overflow. The mobile pass caught a real 3px overflow in the smooth-tab bar, which is now fixed.
- Grader: 19/19, the same checks as the eval.
- Reviewing the screenshots fixed: display tracking too tight, Kokonut's orange nav indicator off-brand, an undersized gauge, and a narrow tab panel.
- A mid-scroll capture confirms the pinned row scrubs horizontally and releases.

## Deploy
`cd demos/motion-specimen && npx vercel --prod`, or import the repo on Vercel with Root Directory `demos/motion-specimen`.
