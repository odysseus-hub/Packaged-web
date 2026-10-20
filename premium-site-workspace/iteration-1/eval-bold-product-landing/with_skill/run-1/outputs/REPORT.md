# Relay — landing page report

Project: `site/` (Next.js 16.4.2 App Router, Tailwind v4, shadcn/ui base-nova, Motion 14.4).
Art direction: `site/ART_DIRECTION.md`. Screenshots: `shots/`.

## Concept
> An emergency broadcast for your API: a black screen, one siren-orange signal, and headlines
> set like a stadium scoreboard flashing the time your API broke.

The hero headline is the incident itself: "YOUR API BROKE AT 3:14:07. YOU KNEW AT **3:14:15.**"
The 8-second gap is the product promise.

## Type pairing
- **Display:** Anton 400, all caps, hero `clamp(3rem,10vw,10.5rem)`, leading 0.9
- **Text:** Archivo, body 18–20px, measure under 62ch
- **Mono:** JetBrains Mono for timestamps, labels and kickers

All three load through `next/font/google` and are exposed as `--font-display`, `--font-sans` and `--font-mono`.

## Accent
`--brand: oklch(0.7 0.215 38)` (siren orange). The text color on top of it is `--brand-foreground: oklch(0.16 0.03 38)`.
The neutrals are warm ink tinted toward hue 40 (background `oklch(0.145 0.01 40)`, surface `oklch(0.185 0.012 40)`).
shadcn `--primary`/`--ring` and Bklit `--chart-line-primary`/`--chart-crosshair` map to `--brand`.
The accent stays under 10% of a screen except in the final CTA, which floods orange on purpose:
the concept *is* that siren color, and it is the signature moment. The Kokonut `uptime-card` was
recolored from emerald/amber/rose to neutral/brand so one strong color holds across the page.

## Section map
| # | Section | Component(s) | Motion idea |
|---|---|---|---|
| 0 | Nav | custom fixed header | Fades in last in the hero sequence |
| 1 | Hero `#hero` | `MaskedLines as="h1"` + Kokonut `notification-stack` (Relay alerts) | Lines mask up on mount; the alert stack rises last. flowy: grid parallax, and the headline lifts and dims on exit |
| 2 | Signal `#signal` | `CountUp` "8.2s" at 32vw | Rolls 0 → 8.2 in view |
| 3 | Proof `#proof` | Bklit `area-chart` (p95 842 → 214 ms) + stacked `bar-chart` (downtime before/after, 99.3% → 99.96%), 7/5 split | Charts clip-reveal via `InViewMount` |
| 4 | Features `#features` | Custom bento: alert timeline, p95 sparkline, region-quorum grid, Kokonut `uptime-card` status page, on-call, CLI | Cells stagger in reading order; `HoverLift` springs |
| 5 | Integrations `#integrations` | Display-face wordmark strip (10 integrations) | flowy: CSS marquee, with scroll velocity driving a sprung skew |
| 6 | Pricing `#pricing` | shadcn `Switch` + 3 plans (Team highlighted) | Price swaps with `AnimatePresence popLayout` |
| 7 | CTA `#cta` | Orange flood, `MaskedLines` + email + Kokonut `particle-button` in `Magnetic` | Headline masks in when in view; particle burst on success |
| 8 | Footer | Links + giant cropped RELAY | None |

## Dependencies added
`motion`, `lenis`. Kokonut: `particle-button`, `notification-stack`, `uptime-card`. Bklit: `area-chart`,
`bar-chart` (`ring-chart` was installed but not used). shadcn: `button`, `switch`. Plus their deps
(`@visx/*`, `d3-*`, `@number-flow/react`, `@base-ui/react`, `lucide-react`). There is no GSAP, and
there is one scroll controller.

## Reduced motion
- Entrances become opacity-only fades.
- `CountUp` jumps to its final value.
- Charts get `animationDuration={0}`.
- Hero scroll transforms resolve to their resting values.
- The marquee becomes a static wrapped row with the duplicate hidden, and skew is 0.
- Lenis is skipped (also on coarse pointers).
- The siren-dot pulse is disabled.
- `desktop-reduced-full.png` shows all content.

## Verified
- `check_site.py`: 0 fail, 0 warn, 14 pass
- `npx eslint`: clean (vendored registry dirs are ignored)
- `tsc --noEmit`: clean
- `next build`: clean, `/` is static
- `screenshot.mjs` on `next start -p 3103`: no issues on the final run, with no errors and no horizontal overflow

The first run reported React #418 in the reduced pass, caused by the CountUp hydration mismatch; it is fixed. Screenshot review led to these fixes:
- the hero alert stack had collapsed
- the mobile CTA headline overlapped and the email input had zero height
- the reduced-motion marquee row didn't wrap

I captured everything again after the fixes.

## flowy
I read flowy's `SKILL.md` and `references/adaptation-workflow.md` from disk and ran them in Mode B. Following its
"use the existing library" rule, everything runs on Motion's clock. It added:
- Lenis via `smooth-scroll.tsx` (anchors glide)
- the hero scroll exit (parallax grid, plus the headline lifting and fading)
- the velocity-skew marquee

I skipped pinning and horizontal sections on purpose.

## Deploy
No Vercel credentials are available, so this isn't deployed. To deploy:
`cd premium-site-workspace/iteration-1/eval-bold-product-landing/with_skill/outputs/site && npx vercel@latest --prod`.
Git route: import the repo at vercel.com/new and set Root Directory to that `site` path. Update `metadataBase` (now `https://relay.dev`).
