# Art direction — Relay

**Concept (one sentence, a world not a feeling):**
> An emergency broadcast for your API: a black screen, one siren-orange signal, and headlines set like a stadium scoreboard flashing the time your API broke.

**Audience & single job of the page:** Founders and leads of 2–15 person dev teams who have
found out about an outage from a customer. One action: start the free plan (email → "Start monitoring").

**Display type:** Anton (400, all caps) — hero clamp(3rem, 8.4vw, 9rem) / leading 0.88 / tracking -0.01em
**Text type:** Archivo — body 18px / measure 62ch
**Mono:** JetBrains Mono — timestamps, labels, numbers in UI vignettes

**Accent:** `--brand: oklch(0.7 0.215 38)` (siren orange) · on-accent `--brand-foreground: oklch(0.16 0.03 38)`
**Neutrals:** background `oklch(0.145 0.01 40)` · surface `oklch(0.185 0.012 40)` · hairline `oklch(1 0 0 / 10%)` · tinted toward hue 40 (warm ink)
**Theme:** dark

**Hero imagery:** type-as-image + product UI.
Layers: background — scanline grain + a faint scoreboard grid / midground — Relay alert stack
(Kokonut `notification-stack`, restyled) / foreground — the giant timestamp headline and CTA.

**Spacing:** section padding clamp(6rem,12vw,11rem) · container 1320px · 12-col grid

**Signature moment (one):** the final CTA — the whole screen goes siren orange (the one place
the accent floods; the concept *is* that color), with Kokonut `particle-button` bursting on signup.
**Motion personality:** snappy and loud — expo-out, hero lines 0.9s with a 0.12 stagger, short
travel. Nothing floats; things *hit*.

## Section map
| # | Section | Job | Component(s) | Layout | Motion idea (one) |
|---|---|---|---|---|---|
| 0 | Nav | Wordmark + one CTA | custom header + Button | thin bar | fades in last in the hero sequence |
| 1 | Hero `#hero` | State the promise as a timestamp | MaskedLines + Kokonut `notification-stack` | full-bleed type, 5/7 split underneath | headline lines mask up, alert stack rises last |
| 2 | Signal `#signal` | One number: median alert time | CountUp at 32vw | one giant number, left-cropped | the number rolls up 0 → 8.2 |
| 3 | Proof `#proof` | Prove latency + uptime improve | Bklit `area-chart`, `bar-chart` | asymmetric 7/5 split | charts clip-reveal in view (InViewMount) |
| 4 | Features `#features` | Show the three pillars + support | custom bento + Kokonut `uptime-card` + HoverLift | dense mixed-span grid | cells stagger in reading order |
| 5 | Integrations `#integrations` | "Pages wherever you already are" | wordmark strip | full-bleed band | tight stagger (flowy: marquee) |
| 6 | Pricing `#pricing` | Three plans, one highlighted | shadcn `Switch` + HoverLift | 3 columns, middle raised | price swaps with AnimatePresence popLayout |
| 7 | CTA `#cta` | Sign up | MaskedLines + Kokonut `particle-button` + Magnetic | full orange flood | closing headline masks in |
| 8 | Footer | Wordmark + links | custom | giant cropped RELAY | none |

## Copy voice
Blunt, specific, a little funny. Banned: "seamless", "supercharge".
