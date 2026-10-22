# Art direction — Relay

**Concept (one sentence, a world not a feeling):**
> A fire-alarm pull station: black steel, one hazard-orange signal, stencilled numbers that shout the countdown — the page *is* the alarm going off before your users notice.

**Audience & single job of the page:** Tech leads and founders of 2–15-person dev teams who
currently find out about outages from customers. One job: start the free plan (email signup).

**Display type:** Anton (400) — all caps, set at clamp(3.75rem, 11vw, 11rem) / leading 0.86 / tracking -0.01em; giant numerals cropped by the viewport edge
**Text type:** Archivo (variable, wdth axis) — body 18px / measure 62ch
**Mono:** Geist Mono — labels, timestamps, latency numbers, integration wordmarks

**Accent:** `--brand: oklch(0.70 0.215 38)` (hazard orange) · on-accent `--brand-foreground: oklch(0.16 0.02 38)`
**Neutrals:** background `oklch(0.145 0.008 40)` · surface `oklch(0.185 0.009 40)` · hairline `oklch(1 0 0 / 10%)` · tinted toward hue 40
**Theme:** dark

**Hero imagery:** type-as-image + the product. "10" in giant stroked Anton, cropped off the right edge (background),
a live Relay alert stack (Kokonut `notification-stack`, restyled) as the midground, headline + CTA foreground.

**Spacing:** section padding clamp(6rem,12vw,11rem) · container 1320px · grid 12-col

**Signature moment (one):** the full-bleed hazard-orange signup slab at the end — the only place the
accent floods a section, because the concept *is* that color going off. `particle-button` throws orange-ink chips.
**Motion personality:** snappy, mechanical, loud — expo-out 0.5s entrances, 0.06s staggers, hero 0.9s. No floaty drift.

## Section map
| # | Section | Job | Component(s) | Layout | Motion idea (one) |
|---|---|---|---|---|---|
| 0 | Nav | Wordmark + one CTA | custom header + Button | thin bar | fades in last |
| 1 | Hero `#hero` | State the promise: paged in under 10s | MaskedLines, Stagger onMount, Kokonut `notification-stack`, ghost "10" | 7/5 split, type kisses edges | headline lines rise from mask |
| 2 | Integrations `#integrations` | "Fits your stack" | mono wordmarks (no logos) | single dense row, hairline rules | tight stagger; flowy → marquee |
| 3 | Countdown `#speed` | Prove "under 10 s" | CountUp in display type + 4-step timeline | one giant number alone | number rolls up |
| 4 | Latency `#latency` | p95 improvement is real | Bklit `area-chart` | 4/8 split, chart big | chart clip-reveal (InViewMount) |
| 5 | Uptime `#uptime` | Downtime collapses | Bklit `bar-chart` + stat | 8/4 flipped split | bars grow (InViewMount) |
| 6 | Features `#features` | What you get | bento (mixed spans) + Kokonut `uptime-card` + code + mini demos | dense grid | cells stagger, HoverLift |
| 7 | Pricing `#pricing` | Make the decision cheap | custom cards + period toggle | 3 columns, middle plan inverted | price swaps with AnimatePresence |
| 8 | Signup `#signup` | Convert | full-bleed orange slab, email form + Kokonut `particle-button` | giant headline, form below | MaskedLines whileInView, Magnetic CTA |
| 9 | Footer | Close | giant cropped RELAY wordmark | full bleed | none |

## Copy voice
Blunt, fast, numerical. Banned: "seamless", "unlock".
