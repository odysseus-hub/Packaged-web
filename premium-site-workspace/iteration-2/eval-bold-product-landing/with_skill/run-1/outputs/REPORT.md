# Relay — landing page report

Project: `outputs/site` (Next.js 16.4.2 App Router, Tailwind v4, shadcn/ui base-nova, Motion 14.5, Kokonut UI, Bklit UI). Art direction is in `site/ART_DIRECTION.md`. Screenshots are in `outputs/shots/`.

## Concept
> A fire-alarm pull station: black steel, one hazard-orange signal, stencilled numbers that shout the countdown. The page *is* the alarm going off before your users notice.

## Type pairing
- **Display:** Anton 400. All caps, set at `clamp(3.4rem, 8.6vw, 9.25rem)` in the hero and up to 30rem for the "9.4s" number.
- **Text:** Archivo (variable, wdth axis). Body text is 18px.
- **Mono:** Geist Mono, for labels, timestamps, latency figures and the plan toggle.

All three load through `next/font/google` as `--font-display` / `--font-sans` / `--font-mono`.

## Accent
- `--brand: oklch(0.70 0.215 38)` (hazard orange).
- `--brand-foreground: oklch(0.16 0.02 38)`.
- Neutrals are tinted to hue 40: background `oklch(0.145 0.008 40)`, surface `oklch(0.185 0.009 40)`, hairlines `oklch(1 0 0 / 10%)`.
- shadcn `--primary` / `--ring` and Bklit `--chart-line-primary` / `--chart-1` / `--chart-crosshair` are mapped to `--brand`.
- The accent floods only one section: the final signup slab. Everywhere else it stays a signal (one word per headline, CTAs, chart lines, the escalation step).

## Section map
| # | Section | Component | Motion idea |
|---|---|---|---|
| 0 | Nav | custom header + brand CTA | fades in last (0.9s) |
| 1 | Hero `#hero`: "Your API broke. You knew in 9.4 seconds." | `MaskedLines` + `Stagger onMount`, Kokonut `notification-stack` (restyled into a Relay alert feed in a hazard-striped frame), giant stroked "10" as a background type layer | headline lines rise from the mask; the alert panel rises and scales in last. **flowy:** the "10" parallaxes and the copy lifts/dims on exit |
| 2 | Integrations strip `#integrations` | wordmarks set in Anton at 40% opacity (no third-party logo files) | **flowy:** seamless CSS ticker that pauses on hover/focus |
| 3 | Speed `#speed` | `CountUp` to 9.4 at about 30rem, plus a 4-step failure→page timeline | number rolls up; steps stagger |
| 4 | Latency `#latency`: "p95 down 72% in 12 weeks" | Bklit `area-chart` in `InViewMount`, 4/8 split | chart clip-reveal when it scrolls into view |
| 5 | Uptime `#uptime`: "212 minutes down. Then 4." | Bklit `bar-chart` (stacked before/with Relay) plus a 99.99% stat, flipped 7/5 split on a surface band | bars grow when in view |
| 6 | Features `#features` | bento grid with mixed spans: Kokonut `uptime-card` (recolored to tokens), escalation list, p95 spark bars, `relay.yml` snippet, region quorum table, three text cells | cells stagger; `HoverLift` on the small cells |
| 7 | Pricing `#pricing` | 3 plans (Hobby $0 / Team $29 / Scale $99), monthly/yearly radiogroup with a `layoutId` pill | price digits swap with `AnimatePresence popLayout` + y |
| 8 | Signup `#signup` | full-bleed orange slab, `MaskedLines` (whileInView), email form + Kokonut `particle-button` inside `Magnetic`, `/api/signup` stub | headline masks in; the button bursts ink chips on success |
| 9 | Footer | link grid plus a giant cropped "RELAY" wordmark | none |

## Dependencies added
- **From the scaffold:** `motion`, `@base-ui/react`, `cn`, `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `tw-animate-css`, the visx/d3 packages and `@number-flow/react` (Bklit).
- **Added for flowy:** `lenis`.
- **Registry components:** Kokonut `particle-button`, `notification-stack` and `uptime-card`; Bklit `area-chart` and `bar-chart`; shadcn `button`.

## Signup endpoint
`src/app/api/signup/route.ts` validates the email. If `SIGNUP_WEBHOOK_URL` is set, it forwards the email there. **It stores nothing itself.** Set that env var in Vercel to collect signups.

## Reduced motion
- `MotionConfig reducedMotion="user"` drops transforms and keeps opacity fades.
- `CountUp` renders 9.4 immediately (hydration-safe hook).
- Bklit charts get `animationDuration={0}`.
- The hero parallax values map to their resting state (same elements, same style objects, so no hydration branch).
- Lenis does not start under reduced motion or on coarse pointers.
- The marquee stops; the duplicate group is hidden and the list wraps statically (pure CSS media query).
- The single CSS loop (the live "signal" dot) is gated.
- `desktop-reduced-full.png` shows every piece of content.

## Verification
- `python3 check_site.py site`: **0 fail, 0 warn, 14 pass**.
- `npx eslint`: **clean** (no output).
- `npx next build`: **clean**. `/` is prerendered static; `/api/signup` is dynamic.
- `screenshot.mjs site shots` (site-dir mode): **no console errors, hydration errors or overflow reported**, on the final run and every earlier run.
- **Manual screenshot review:**
  - **First pass** found a mobile layout bug: the page was 425px wide on a 390px viewport. Grid items in the features bento auto-sized to the uptime card and the code block. The script did not catch it (see the notes below). Fixed with `grid-cols-1` + `min-w-0`; the mobile capture is now exactly 390px wide.
  - The first pass also found three smaller problems, all fixed:
    - the email input collapsed in height on mobile (`flex-1` in a column)
    - the hero headline lines touched (leading 0.88 → 0.98)
    - the speed eyebrow collided with the giant number
- **API smoke test:** `next start -p 3134`, stopped by its own PID. A valid email returns `{"ok":true}`; an invalid one returns 422.

## What flowy added
flowy was read from disk (`SKILL.md` + `references/adaptation-workflow.md`, Mode B). It stayed on Motion's clock; no GSAP was added.
- **Lenis inertial scroll:** `smooth-scroll.tsx` drives Lenis from Motion's `frame.setup`, so there is one clock. It is mounted once in the layout with `navOffset={64}` for the fixed header, and `lenis/dist/lenis.css` is imported. It is skipped under reduced motion and on touch.
- **Hero:** `useScroll` + `useTransform`. The stroked "10" sinks at a slower rate than the page (+260px over the hero), and the copy column lifts 90px and dims as you leave.
- **Integrations:** a CSS transform ticker on a duplicated track (each group carries its trailing gap, so −50% is seamless), with edge mask fades. It pauses on hover/focus.
- **Deliberately not added:** pinning, horizontal scroll and scrubbed chart tilt. The concept is "loud and instant", and the charts already reveal on view; one dominant idea per section.
- There is only one smooth-scroll controller; `check_site.py` confirms it.
- **Visual-theme changes from flowy:** none.

## Deploy
No Vercel credentials exist in this environment, so the site was not deployed. To deploy:

```bash
cd outputs/site && npx vercel@latest --prod --yes
```

**Git-import path:** push the project to GitHub, open vercel.com/new and import the repo. Set **Root Directory** to the `site` folder (e.g. `premium-site-workspace/iteration-2/eval-bold-product-landing/with_skill/run-1/outputs/site` if pushed as part of this repo). Framework detection is automatic. Optionally add `SIGNUP_WEBHOOK_URL`. Also update `metadataBase` in `layout.tsx` (currently `https://relay.dev`, a placeholder) to the real domain.

## Content notes
- Chart data, "1,200 teams", the 9.4s median and the customer story are illustrative placeholders for a fictional product. The chart captions say "Sample workspace". Replace them with real figures before launch.
- Integration names are plain-text wordmarks, not logos.
