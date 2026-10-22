# Art direction — Nocturne

**Concept (one sentence, a world not a feeling):**
> The opening titles of an independent film: a black, letterboxed frame, one warm tungsten
> light, and credits that fade up one card at a time — every section is a title card.

**Audience & single job of the page:** indie directors, DPs and editor-colorists finishing
films without a colorist budget. One job: join the waitlist.

**Display type:** Instrument Serif (400, roman + italic) — hero clamp(3.5rem, 9.5vw, 10rem) / leading 0.9 / tracking -0.03em. One italic word per headline.
**Text type:** Inter Tight — body 18px / measure 62ch
**Mono:** Geist Mono — timecodes, scene slugs, LUT names, labels (uppercase, +0.18em tracking)

**Accent:** `--brand: oklch(0.79 0.135 68)` (tungsten amber) · on-accent `--brand-foreground: oklch(0.17 0.02 60)`
**Neutrals:** background `oklch(0.135 0.006 60)` · surface `oklch(0.175 0.007 60)` · hairline `oklch(1 0 0 / 9%)` · tinted toward hue 60 (warm ink, like a darkened theatre)
**Theme:** dark

**Hero imagery:** generative (Kokonut `background-paths`, tinted amber at low opacity — a projector beam through haze) + type-as-image
Layers: background = film grain + light ribbon / midground = 2.39:1 letterbox matte with timecode slate / foreground = masked title lines + CTA

**Spacing:** section padding clamp(6rem,12vw,11rem) · container 1320px · grid 12-col

**Signature moment (one):** the hero title sequence — letterbox mattes close in, then the title lines rise from behind the matte like a credit card.
**Motion personality:** slow, weighty, cinematic — expo-out, hero 1.3s, loose 0.16s stagger, long holds. Nothing bounces.

## Section map
| # | Section | Job | Component(s) | Layout | Motion idea (one) |
|---|---|---|---|---|---|
| 0 | Nav | wayfinding, one CTA | custom header in the top matte | thin bar | fades in last in the hero sequence |
| 1 | Hero `#hero` | the concept in one screen | Kokonut `background-paths` + `MaskedLines` + `Stagger onMount` + `Magnetic` | full-bleed, letterboxed, left-aligned title card | mattes close, lines rise from behind the matte |
| 2 | How it works `#how` | 3 steps, show it's simple | custom ordered list (`motion.li`) | 4/8 asymmetric split, sticky heading left | steps stagger in reading order |
| 3 | Looks `#looks` | prove the grades are good | custom SVG scene + CSS grade filters, look selector | one big frame + rail of 6 swatch buttons | regrade crossfade when a look is picked |
| 4 | Render speed `#speed` | proof | `CountUp` + Bklit `bar-chart` in `InViewMount` | one giant number alone, then chart 5/7 | number rolls up; bars grow on view |
| 5 | Testimonials `#voices` | trust | display-italic pull quote + 3 shadcn-style cards | pull quote full width, 3-up offset masonry | cards stagger |
| 6 | Pricing `#pricing` | convert | shadcn `Card` + `Badge` + `HoverLift` | 3 columns, Pro raised with amber hairline | cards stagger, lift on hover |
| 7 | FAQ `#faq` | remove doubt | shadcn `Accordion` | 4/8 split | none (calm) |
| 8 | Waitlist `#waitlist` | the one action | Kokonut `particle-button` + email form → `/api/waitlist` | centered closing card, giant "Fade in." | headline masks in on view |
| 9 | Footer | end credits | giant cropped wordmark | credits roll layout | none |

## Copy voice
3 adjectives: quiet, exact, crafted · banned words: "unlock", "seamless"
