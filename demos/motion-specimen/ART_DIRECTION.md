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

## Section map (v2: motion showreel)
| # | Section | Component(s) | Motion idea |
|---|---|---|---|
| — | Chrome | `ScrollProgress`, `InkCursor` | spring progress rule; ink-dot cursor that labels what it's over |
| 0 | Nav | Kokonut `morphic-navbar` | folds on scroll; paper strip fades in behind it |
| 00 | Hero | custom WebGL `RisoShader`, `SplitChars`, `MisregWord`, `ScrambleText`, `Magnetic` | two-ink halftone shader: cursor lens + scroll-velocity misregistration; per-letter rise |
| 01 | Art direction | specimen cards | stagger in view |
| 02–03 | Stagger & springs | `Stagger`, `HoverLift` | replayable cascade, spring hover |
| 04 | Layout | `layoutId`, `AnimatePresence popLayout`, `LayoutGroup` | swatch morphs into the panel; filter pill glides; grid reflows |
| 05 | Physics | Motion `drag`, Kokonut `cradle-text` | throwable stickers, elastic bounds |
| 05b | Product in 3D | three.js + React Three Fiber + drei: lathe-turned can, canvas-printed riso labels, Lightformer studio env, contact shadow, instanced bubbles | pinned scroll spins the can; flavor flips re-print the label; stage floods per flavor; drag-to-throw momentum; pointer tilt |
| 06 | Line work | SVG `pathLength`, `d` morph | scroll-drawn ribbon; morphing blob |
| 07 | Ink room | `useMotionTemplate` clip-path flood, `ScrollWords`, `TiltCard`, sticky stack, pinned row, velocity band | page floods to ink; words ink in; 3D glare; laws stack; scrubbed pin |
| 08 | Proof | `CountUp`, Bklit bar / gauge / area / live-line | charts reveal in view; live feed streams while visible |
| 09 | Toybox | Kokonut attract-button, swoosh-text, card-stack, glitch-text, liquid-gauge, dynamic-text | every toy, on purpose |
| 10 | Section map & verification | Kokonut `smooth-tab`, `notification-stack` | swipe tabs; stack fans |
| 11 | Reduced motion | `Switch` + nested `MotionConfig` | live preview of the fallback |
| 12 | FAQ | shadcn `Accordion` | none |
| 13 | Install | `MaskedLines`, Kokonut `particle-button` | particle burst on copy |
| — | Footer | per-letter springs | letters rise in, hop on hover |

## Copy voice
Precise, printerly, a little dry. Banned: "unlock", "seamless".
