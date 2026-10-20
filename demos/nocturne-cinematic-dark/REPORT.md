# Nocturne — deliverable report

Project: `site/` (Next.js 16.4 App Router, Tailwind v4, shadcn/ui base-nova, Motion 14.4). Art direction: `site/ART_DIRECTION.md`. Screenshots: `shots/`.

## Concept
> The opening titles of a film: a black frame, one warm projector light, and credits that arrive line by line. Each section is the next reel.

## Type pairing
- **Display:** Instrument Serif 400 + italic. The hero is set at clamp(3.5rem, 10.5vw, 10.5rem) with leading 0.9 and tracking -0.035em. Each headline has one italic word in the accent colour.
- **Text:** Inter Tight.
- **Mono:** Geist Mono, used for timecodes, reel numbers, grade wheel values and credits.

## Accent
`--brand: oklch(0.80 0.135 72)` is projector amber. The text colour on top of it is `oklch(0.17 0.02 70)`. The neutrals are warm ink tinted toward hue 60: background `oklch(0.135 0.008 60)`, surface `oklch(0.175 0.009 60)` and hairline `oklch(1 0 0 / 9%)`. shadcn primary/ring and Bklit `--chart-line-primary` map to the brand. A 5.5% film-grain overlay sits over the page.

## Section map
| # | Section | Component(s) | Layout | Motion idea |
|---|---|---|---|---|
| 0 | Nav | custom header | thin bar, blurs after 40px of scroll | fades in last |
| 1 | Hero | Kokonut `background-paths` (amber beam), `MaskedLines`, `Stagger onMount`, `Magnetic` CTA | full-bleed, letterboxed, bottom-left title card | matte bars open, headline lines rise from behind a clip |
| 2 | How it works | custom reel rows (`motion.li` stagger) | 5/7 split, sticky heading, giant italic numerals | rows stagger |
| 3 | Looks | SVG "negative" + 6 CSS grades, look index with `layoutId` marker | 8/4 split, 2.39:1 frame | grades cross-fade (opacity) |
| 4 | Render speed | `CountUp` 38s / 7.3×, Bklit `bar-chart` in `InViewMount` | giant number alone, then a 4/7 split with the chart | roll-up, chart clip-reveal |
| 5 | Testimonials | display-italic pull quote + 4 cards | offset masonry | stagger |
| 6 | Pricing | shadcn Badge + `HoverLift` | 3 columns, Pro raised with an amber border | stagger, spring lift |
| 7 | FAQ | shadcn Accordion | 4/7 split | none |
| 8 | Waitlist | Kokonut `particle-button` + email input + `/api/waitlist` | centred end credits | headline masks in, particle burst on success |
| 9 | Footer | custom | huge cropped wordmark | none |

## Dependencies added
`motion`, `lenis`, plus what the registries pulled in: `@base-ui/react`, `@visx/*`, `d3-array`, `@number-flow/react`, `lucide-react`, `clsx`, `tailwind-merge`, `cn`, `cva`, `tw-animate-css`. Registry items:
- Kokonut: `utils`, `background-paths`, `particle-button`
- Bklit: `bar-chart`
- shadcn: `button`, `accordion`, `card`, `badge`, `input`

## Reduced motion
- `MotionConfig reducedMotion="user"` turns off transforms. The matte, masked lines and staggers land in their final state, and only opacity fades.
- The Kokonut canvas draws one static frame.
- The grain keyframes are disabled.
- The Bklit chart gets `animationDuration={0}`.
- `CountUp` shows the final value.
- Lenis, the hero parallax and the frame scrub are all off.
- `desktop-reduced-full.png` shows all content.

## Verified
- `check_site.py`: 0 fail, 0 warn, 14 pass.
- `npx eslint`: clean, with rules relaxed for vendored folders only (see below).
- `npx next build`: clean. `/` is static and `/api/waitlist` is dynamic.
- `screenshot.mjs` against `next start -p 3101`: exit 0, no issues (no console errors, no horizontal overflow).
- Playwright probe: Lenis is active, the anchor offset is correct, the waitlist submits end to end, and the API returns 200 for a valid email and 422 for an invalid one.
- Fixed after the first screenshot pass: the pull quote wrapped one word per line, the mobile hero credits collided, the mobile email input collapsed, a Bklit negative-`<rect>` console error, and a React #418 hydration error.

## Local patches to vendored code
1. **`components/motion/count-up.tsx`:** made it hydration-safe with a `useSyncExternalStore` media query. motion's `useReducedMotion` gave a server/client text mismatch, which caused React error #418.
2. **`components/charts/bar.tsx` (Bklit):** clamped bar height with `Math.max(0, …)`. Zero-value bars went negative while the y-domain was animating.
3. **`eslint.config.mjs`:** turned off the react-hooks `refs` / `set-state-in-effect` and related rules for `src/components/charts/**` and `src/components/kokonutui/**` only. Without this, vendored code fails eslint-config-next 16 with 32 errors.

## flowy
Read from disk and run in Mode B: adapt an existing project.
- **Stack:** stayed on Motion's clock, with no GSAP. There is one controller: Lenis on Motion's `frame.setup`, with `anchors: { offset: -64 }`. I removed CSS `scroll-behavior: smooth` so it doesn't fight Lenis.
- **Effects added:**
  - `#hero`: the background drifts slower than the page (0 → 28%), and the title card lifts and fades as you leave.
  - `#looks`: the product frame racks in from scale 0.92 to 1, scrubbed to scroll and smoothed with `useSpring`.
- **Fallbacks:** all of it is off under reduced motion. Lenis is skipped on coarse pointers.
- **Visual theme:** unchanged.
- **Left out on purpose:** no marquee and no pinned horizontal section, for restraint.

## Placeholders to replace before launch
- Testimonials are illustrative.
- Benchmark figures (38s, 380/52/11 fps, 7.3×) are pre-release placeholders, footnoted on the page.
- The looks still is a drawn SVG scene.
- `/api/waitlist` validates the email but doesn't store it (see the TODO in the route).
- `metadataBase` is set to `https://nocturne.film`.

## Deploy
Not deployed, because there are no Vercel credentials here.
- **CLI:** `cd site && npx vercel@latest --prod --yes`
- **Git import:** push to GitHub, then go to vercel.com/new and import the repo with Root Directory = the `site` folder. No env vars are needed yet.
