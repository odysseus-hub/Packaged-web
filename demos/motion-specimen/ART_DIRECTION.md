# Art direction — Motion Specimen

**Concept:**
> A risograph-printed specimen book for motion — every plate demonstrates the rule it prints.

**Audience & single job of the page:** designers and developers deciding whether to use the
premium-site skill. One action: copy the install command.

**Display type:** Bricolage Grotesque (opsz + wdth axes, 700–800), set at clamp(3.5rem, 11vw, 11rem) / leading 0.88 / tracking -0.045em
**Text type:** Instrument Sans: body 18px, measure 62ch
**Mono:** JetBrains Mono for plate numbers, token values and captions

**Accent:** `--brand: oklch(0.64 0.25 358)` (fluorescent riso pink) · on-accent `--brand-foreground: oklch(0.99 0.01 358)`
**Neutrals:** paper `oklch(0.965 0.012 85)` · card `oklch(0.985 0.008 85)` · ink `oklch(0.22 0.02 265)` (riso blue-black) · hairline ink at 14%
**Theme:** light (paper). Deliberately unlike the two dark demos.

**Hero imagery:** generative. A Kokonut `dot-field` halftone membrane printed in the pink, which
is the riso screen itself.
Layers: background halftone field / midground misregistered pink offset on one word / foreground type + CTA.

**Spacing:** section padding clamp(6rem, 12vw, 11rem) · container 1320px · 12-col grid

**Signature moment (one):** the halftone field in the hero ripples under the cursor. A shockwave on click.
**Signature detail:** riso misregistration, a pink offset shadow on exactly one word per display headline.
**Motion personality:** precise and printerly: expo-out, short travel (12–24px), 60–80ms staggers, snappy springs.

## Section map
| # | Section | Job | Component(s) | Layout | Motion idea (one) |
|---|---|---|---|---|---|
| 0 | Nav | wayfinding | Kokonut `morphic-navbar` (compact) | fixed top | folds after 80px |
| 1 | Hero / Plate 00 | concept in one screen | Kokonut `dot-field` + `MaskedLines` + `Magnetic` | full-bleed, left-aligned | masked lines rise; content drifts on scroll-away (flowy) |
| 2 | Plate 01 Art direction | show the decisions | specimen card, swatch, spacing ruler | 5/7 asymmetric split | stagger in view |
| 3 | Plate 02–03 Stagger & springs | show timing tokens | token cards with `HoverLift`, replay button | 3-col tight grid | cascade (replayable) + spring hover |
| 4 | Plate 04 Kinetic type | one expressive line | Kokonut `dynamic-text` | single giant line | morphing word |
| 5 | Plate 05 Proof | numbers as argument | `CountUp`, Bklit `bar-chart`, `gauge-chart`, `area-chart` in `InViewMount` | huge number + 2 charts | charts reveal when seen |
| 6 | Plate 06 Section map | show component choices | Kokonut `smooth-tab` | centered panel | swipeable tabs |
| 7 | Plate 07 Verification | show the checks | Kokonut `notification-stack` | 7/5 split | stack fans on hover |
| 8 | Plate 08 Scroll (flowy) | scroll-linked layer | pinned horizontal track + velocity marquee | full-bleed pinned | scrubbed x + skew |
| 9 | Plate 09 Reduced motion | accessibility as design | shadcn `Switch` + `MotionConfig` preview | split demo | same cascade, with/without travel |
| 10 | FAQ | objections | shadcn `Accordion` | narrow column | none |
| 11 | CTA | install | `MaskedLines` + Kokonut `particle-button` | full-bleed pink | particle burst on copy |
| 12 | Footer / colophon | credits | giant cropped wordmark | bottom | none |

## Copy voice
Precise, printerly, a little dry. Banned: "unlock", "seamless".
