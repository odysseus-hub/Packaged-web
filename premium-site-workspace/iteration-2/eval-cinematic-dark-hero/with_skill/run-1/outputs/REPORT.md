# Nocturne — deliverable report

Project: `outputs/site` (Next.js 16.4.2 App Router, Tailwind v4, shadcn/ui base-nova, Motion 14.5). Screenshots: `outputs/shots`. Art direction: `site/ART_DIRECTION.md`.

## Concept
> The opening titles of an independent film: a black, letterboxed frame, one warm tungsten light, and credits that fade up one card at a time. Every section is a title card.

## Type pairing
- Display: **Instrument Serif** (roman and italic). Hero at clamp(3.4rem, 9.5vw, 10rem), leading 0.9, tracking -0.03em. One italic word per headline.
- Text: **Inter Tight**, 17–18px body.
- Mono: **Geist Mono** for slates, timecodes and LUT names (uppercase, 0.18em tracking).

## Accent
- `--brand: oklch(0.79 0.135 68)` (tungsten amber) on `--brand-foreground: oklch(0.17 0.02 60)`.
- Neutrals are a warm ink tinted toward hue 60: background `oklch(0.135 0.006 60)`, surface `oklch(0.175 0.007 60)`, hairlines at `oklch(1 0 0 / 9%)`.
- A 5% film-grain overlay sits on top.

## Section map
| Section | Component | Motion idea |
|---|---|---|
| Nav (in top letterbox matte) | custom header | fades in last in the hero sequence |
| Hero `#hero` | Kokonut `background-paths` (amber, as a projector beam), `MaskedLines`, `Stagger onMount`, `Magnetic` CTA | letterbox mattes close in (scaleY), then title lines rise from behind their clip. **Signature moment.** |
| How it works `#how` (3 "scenes") | custom `<ol>` with `motion.li`, 4/8 split with a sticky heading | steps stagger in reading order |
| Looks `#looks` | custom SVG "plate" drawn in code, graded live with CSS filters and blend washes; log-vs-grade split slider (accessible range input); 6 look buttons (`aria-pressed`) | crossfade regrade on selection |
| Render speed `#speed` | `CountUp` "38 fps" alone on screen; Bklit `bar-chart` (stacked, accent only on Nocturne) in `InViewMount` | number rolls up; bars grow on view |
| Testimonials `#voices` | display-italic pull quote and 3 offset cards | cards stagger |
| Pricing `#pricing` | Free $0 / Pro $24 / Studio $79; shadcn `Badge`, `HoverLift`, Pro with amber border and glow | cards stagger, spring lift on hover |
| FAQ `#faq` | shadcn `Accordion` (Base UI) | none (calm) |
| Waitlist `#waitlist` | giant "Fade in." (`MaskedLines` on view), email form, Kokonut `particle-button` → `POST /api/waitlist` | headline masks in; CTA is magnetic |
| Footer | "end credits", giant cropped wordmark | none |

## Dependencies added
- **By scaffold:** `motion`, Kokonut `background-paths` and `particle-button`, Bklit `bar-chart` (its visx and d3 dependencies came with it).
- **By hand:** shadcn `accordion`, `badge`, `switch`, `card`.
- **By the flowy pass:** `lenis`.

`switch` and `card` are installed but not used.

## Reduced motion
- `MotionConfig reducedMotion="user"` drops transforms, so the mattes, masked lines and staggers just fade.
- `CountUp` renders 38 immediately.
- The Bklit chart gets `animationDuration=0`.
- The Kokonut background draws statically and is not interactive.
- `particle-button` skips the burst.
- `Magnetic` is inert.
- The flowy scroll values resolve to resting states (same elements, same `style` objects).
- Lenis does not start under reduced motion or on coarse pointers.
- `desktop-reduced-full.png` shows all content.

## Verification
- `npx eslint`: clean, no output.
- `npx next build`: clean. `/` is static and `/api/waitlist` is dynamic.
- `check_site.py`: **0 fail, 1 warn, 13 pass**. The warning is "30 hex literals". They are the painted colors of the SVG film plate in `components/site/scene.tsx`: image content, not UI tokens. I'm leaving it as is.
- `screenshot.mjs` (site-dir mode), final run: **no console errors, hydration errors or horizontal overflow**.
  - The first run logged two `<rect> negative height` errors from Bklit. `patch_registry.sh` fix #3 no longer matches upstream `bar.tsx`, which now uses `Math.abs(zeroY - valuePos)`, so it silently patched nothing.
  - I clamped the values in `charts/bar.tsx` (AnimatedBar width and height, static rect) and in `charts/bar-chart.tsx` (innerWidth and innerHeight).
- Looked at the screenshots and fixed what they showed:
  - The mobile email input collapsed to about 20px: `flex-1` in a column flex.
  - The mobile chart's x labels overlapped, so I shortened them.
  - The footer wordmark overlapped the small print.
- Waitlist API smoke test: a valid email returns `{"ok":true}`; an invalid one returns 422.

## Flowy (read from disk, Mode B, stayed on Motion's clock with no GSAP)
- **Smooth scroll:** Lenis on Motion's `frame.setup`, using the skill's `smooth-scroll.tsx`, mounted once in the layout, with `lenis/dist/lenis.css` imported. Anchor links go through Lenis (`anchors`). I removed my CSS `scroll-behavior: smooth`. There is one controller.
- **`#hero`:** the background layer parallaxes down 28% as you leave. The title card lifts 90px and dims to 0.15 (`useScroll` and `useTransform`).
- **`#looks`:** the graded frame scrubs from scale 0.9 to 1 as it rolls into view.
- **Not added:**
  - No marquee: there is no logo row.
  - No pinning: the how-it-works sticky column already does that job.
  - No horizontal section: it doesn't fit the concept's stillness.

## Placeholder content to confirm before launch
- The stats are illustrative, not measured: 38 fps, 14 min vs 480 and 190 min, 312 shots, 34×.
- The testimonials and names are fictional.
- These product claims are drafts:
  - camera and format support
  - "footage stays local"
  - the plan features
  - the contact emails `@nocturne.film`
- `/api/waitlist` **stores nothing**. Set `WAITLIST_WEBHOOK_URL` (Zapier, Loops, Slack and so on) to forward signups.

## Deploy
I did not deploy: there are no Vercel credentials in this environment. From `outputs/site`:
```bash
npx vercel deploy --prod          # after `npx vercel login`; optional: npx vercel env add WAITLIST_WEBHOOK_URL
```
Or push the folder to a Git repo, then go to vercel.com/new and import it. The framework is auto-detected as Next.js and no settings are needed.
