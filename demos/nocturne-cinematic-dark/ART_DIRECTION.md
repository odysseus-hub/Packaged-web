# Art direction — Nocturne

**Concept (one sentence, a world not a feeling):**
> The opening titles of a film: a black frame, one warm projector light, credits that arrive line by line — and every section is the next reel.

**Audience & single job of the page:** indie directors, editors and DPs who grade their own work. One action: join the waitlist (email).

**Display type:** Instrument Serif (400, normal + italic) — hero at clamp(3.5rem, 10vw, 10rem) / leading 0.9 / tracking -0.035em. One italic word per headline, in the accent.
**Text type:** Inter Tight — body 18px / measure ~62ch
**Mono:** Geist Mono — timecodes, reel numbers, LUT names, credits labels (the "slate" voice)

**Accent:** `--brand: oklch(0.80 0.135 72)` (projector amber / tungsten) · on-accent `--brand-foreground: oklch(0.17 0.02 70)`
**Neutrals:** background `oklch(0.135 0.008 60)` (warm ink, not #000) · surface `oklch(0.175 0.009 60)` · hairline `oklch(1 0 0 / 9%)` · tinted toward hue 60
**Theme:** dark

**Hero imagery:** generative — Kokonut `background-paths` tinted amber, read as a beam of projector light through haze.
Layers: background = light ribbon + vignette + film grain / midground = letterbox bars (2.39:1 matte) and slate credits ("A Nocturne picture", timecode) / foreground = masked headline + waitlist CTA.

**Spacing:** section padding clamp(6rem,12vw,11rem) · container 1320px · 12-col grid, asymmetric splits

**Signature moment (one):** the hero title sequence (credits → masked headline → light settles). Secondary interaction: the waitlist `particle-button`.
**Motion personality:** slow, weighty, cinematic — expo-out, hero lines 1.3s with 0.18s stagger, long holds; hovers stay snappy springs.

## Section map
| # | Section | Job | Component(s) | Layout | Motion idea (one) |
|---|---|---|---|---|---|
| 0 | Nav | Wordmark + 3 links + CTA | custom header | thin bar, hairline when scrolled | fades in last in hero sequence |
| 1 | Hero `#hero` | State the concept: titles of a film | Kokonut `background-paths`, `MaskedLines`, `Stagger onMount`, `Magnetic` | full-bleed, letterboxed, left-aligned type | credits then headline lines rise from behind the matte |
| 2 | How it works `#how` | 3 steps: drop footage → pick a look → render | custom "reel" rows | 5/7 split: sticky heading left, three hairline rows right with giant serif numerals | rows stagger in reading order |
| 3 | Looks `#looks` | Show what the grades do | custom SVG "frame" + CSS grade filters, look list | 7/5 split flipped: big 2.39:1 frame left, look index right | grade cross-fades between looks on select (opacity only) |
| 4 | Speed `#speed` | Prove render speed | `CountUp` + Bklit `bar-chart` in `InViewMount` | one giant number alone, then a chart beside a short claim | number rolls up; chart clip-reveals in view |
| 5 | Testimonials `#voices` | Social proof from filmmakers | pull quote (display italic) + 4 small cards (shadcn Card) | offset masonry | cards stagger in |
| 6 | Pricing `#pricing` | Free / Pro $24 / Studio $79 | shadcn Card + Badge + `HoverLift` | 3 columns, Pro raised with amber border | cards stagger, spring lift on hover |
| 7 | FAQ `#faq` | Remove objections | shadcn Accordion | 4/8 split | none (calm) |
| 8 | Waitlist `#waitlist` | Convert | `MaskedLines` (in view) + Kokonut `particle-button` + email input | centered closing "end credits" | headline masks in; button bursts on success |
| 9 | Footer | Wordmark, links, small print | custom | giant cropped wordmark | none |

## Copy voice
Quiet, precise, cinematic. Banned: "Unlock", "Seamless".
