# Section → component map

Install Kokonut items with `npx shadcn@latest add @kokonutui/<name> -y </dev/null`. They land
at `@/components/kokonutui/<name>` as a **default export**. Full catalogue with descriptions:
https://kokonutui.com/r/registry.json. Every Kokonut item accepts `className`, and the source
is yours to edit.

"Motion idea" is the *one* thing that moves in that section. See `motion-rules.md`.

Contents: Nav · Hero · Kinetic headline · Social proof · Features · Product showcase ·
Metrics & proof · Product UI vignettes · Gallery · Testimonials · Pricing · FAQ · CTA · Footer ·
Long-page aids

## Nav
| Pick | When | Notes |
|---|---|---|
| `morphic-navbar` (Kokonut) | Product/SaaS, 3–6 links | `items={{ "#features": { name: "Features" }, … }}`, `compact` folds after 80px of scroll. Pill style, springy |
| Custom: `<header>` + shadcn `Button` | Editorial/cinematic | Thin top bar with wordmark left, 2–3 links and one CTA right; `backdrop-blur` with a hairline border once scrolled |

Motion idea: the nav fades in last in the hero sequence. Never animate it on every scroll.

## Hero (choose by the art direction's hero-imagery decision)
| Pick | Look | Key props |
|---|---|---|
| `background-paths` | Flowing ribbon of lines, cinematic | `count` (42), `spread`, `angle` (-8), `speed`, `interactive`; children render over it. Color = CSS `color` → `className="bg-transparent text-[var(--brand)]"` |
| `flow-field` | Streamlines that part around the cursor | `density`, `speed`, `interactive` |
| `dot-field` | Halftone dot membrane that ripples | `spacing` (16), `interactive`, `seed` |
| `topo-background` | Living contour map: maps, data, outdoors | `interval`, `speed`, `labels`, `seed` |
| `drape-background` | WebGL curtain in a breeze: fashion, luxury | `wind`, `pleat`, `interactive` |
| `halftone-background` | An image (or lit sphere) as a halftone print, with a loupe | `src`, `cell`, `angle`, `loupe` |
| `shape-hero` | Playful physics shapes drop and pile under the headline | `eyebrow`, `title`, `description`, `actions`, `as="h1"`, `shapes`, `fill` |
| Custom split hero | Product shot on the right, type on the left | `MaskedLines` + `Stagger onMount` + a framed product vignette |
| Type-as-image | Giant cropped headline | `MaskedLines` at 15–25vw; optional `swoosh-text` for one word |

Most Kokonut hero backgrounds render a **demo heading** when children are omitted. Always pass
your own children, or `null` for a bare background layered under your own markup. Check the
defaults: they ship `min-h-[560px] bg-white dark:bg-zinc-950`, so override with `className`.

Motion idea: masked headline lines plus a background that settles. CTAs are already
`Magnetic`.

## Kinetic headline accents (use one at most per page)
| Pick | Effect |
|---|---|
| `dynamic-text` | Morphing words: shared letters travel. `words={["build","ship","scale"]}`, `interval` |
| `type-writer` | Human typing with typos. Good for an AI prompt demo, bad for the main headline |
| `glitch-text` | Hard-shifted bands, red/cyan split. `trigger="hover"|"idle"`, `accent` |
| `swoosh-text` | 3D extruded, pointer-lit letters. `as="h2"`, `depth`, `accent` |
| `cradle-text` | Newton's-cradle letters you knock |
| `spoiler-text` | Hidden-under-specks reveal: a teaser line |

## Social proof / logo strip
- Logos (SVG, `currentColor`, ~40% opacity) in a single row. For an infinite marquee, leave a
  static, wrapped row and **hand the marquee to flowy** (it has velocity-reactive marquees).
  Motion+ Ticker is paid, so don't use it.
- Motion idea: the row staggers in (tight stagger), hovering a logo raises it to 100%
  opacity.

## Features
| Pick | When |
|---|---|
| Custom bento (CSS grid, mixed spans 2×2 / 1×1 / 2×1) + `HoverLift` | Default. Each cell holds a *live* micro-demo (a Kokonut piece, a mini chart, a code snippet), not an icon |
| `smooth-tab` | 3–5 feature modes with a swipeable panel. `items`, `activeColor` |
| Alternating split rows (text 5 / visual 7, then flipped) | Fewer, deeper features |
| `bento-grid` (Kokonut) | Only when "rearrangeable dashboard" *is* the feature: it's a draggable, resizable widget grid |

Motion idea: the grid staggers by cell in reading order. Each cell's demo runs on its own.

## Product showcase
- A framed screenshot or composed UI with layered depth (`-rotate-2`, a shadow stack, an
  accent glow behind it). For scroll-scrubbed zoom or tilt, mark it `data-flowy="product"` and
  hand it to flowy.
- `lightbox-grid` for multiple screens: thumbnails grow into a full view.

## Metrics & proof
| Pick | Story |
|---|---|
| `CountUp` (assets) in display type | One giant number alone on screen: "2.4M builds/day" |
| Bklit `area-chart` / `line-chart` | Growth over time |
| Bklit `bar-chart` | Us vs them, before vs after |
| Bklit `gauge-chart` / `ring-chart` | % of a target, uptime, utilisation |
| Bklit `funnel-chart` | Conversion or pipeline |
| Bklit `live-line-chart` | "Real-time" products: stream mock points with `setInterval`; pause under reduced motion |
| Kokonut `metric-card` | A KPI card you can scrub: a dashboard vignette |

Wrap every chart in `InViewMount`. See `bklit-charts.md`.

## Product UI vignettes (show, don't tell)
Kokonut has realistic, animated UI fragments that work as feature visuals:
`uptime-card` (status), `notification-stack`, `apple-activity-card` (rings),
`receipt-printer`, `currency-transfer`, `activity-terrain` (3D heatmap), `spending-ring`,
`liquid-gauge`, and for AI products `ai-prompt`, `ai-loading`, `ai-citations`,
`ai-diff-review`, `ai-tool-approval`, `ai-model-selector`, `ai-context-meter`. Restyle them to
the tokens. One or two per page, inside bento cells.

## Gallery / work
`lightbox-grid` (grid that expands to full view), `card-stack` (a deck you flick: `cards`,
`accent`), `carousel-cards` (momentum rail with cover-flow).

## Testimonials
- One large pull quote in display italic plus 3–6 small cards (shadcn `Card`) in a staggered
  masonry. Use real-looking names and roles. Never "John Doe".
- `card-stack` when there are many quotes and the concept is tactile.

## Pricing
shadcn `Card` + `Badge` + `Switch` (monthly/yearly) + `HoverLift`. Highlight one plan with the
accent border. Switching periods: animate the price with `AnimatePresence` + `y` (popLayout),
not a layout change.

## FAQ
shadcn `Accordion` (`npx shadcn@latest add accordion`). Motion idea: none beyond the
accordion's own. FAQs should be calm.

## CTA (final)
| Pick | Character |
|---|---|
| `particle-button` | Async action (join waitlist, start trial): spinner → check → particle burst. `onClick` may return a promise; `pendingLabel`, `successLabel` |
| `attract-button` | Iron-filings field around the button. A signature moment on dark sites. `density`, `radius` |
| `gradient-button` | Layered gradient (`variant="emerald"|"purple"|"orange"`). Edit to the brand hue |
| `hold-button` | Press-and-hold to confirm: deliberate, playful |
| `slide-text-button` | Link with vertical text slide on hover. `text`, `hoverText`, `href`, `variant="ghost"` |
| `bell-button` | Subscribe/notify |

Pair it with a giant closing headline (`MaskedLines`, whileInView). Motion idea: the final
headline masks in, and the CTA is `Magnetic`.

## Footer
Plain. Wordmark at display size (it can be huge and cropped), a link grid, small print. Use
`slide-text-button` variant ghost for links if the concept is playful.

## Long-page aids
`scroll-index` (Kokonut): a section rail with ticks you can drag. Good for long editorial or
case-study pages; `selector="section[id]"`.
