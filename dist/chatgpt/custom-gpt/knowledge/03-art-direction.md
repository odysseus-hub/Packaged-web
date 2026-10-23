# Art direction

Contents: 1. The concept · 2. Display type · 3. Hero imagery · 4. Accent color · 5. Spacing & grid ·
6. Wiring tokens · 7. The generic-site checklist

## 1. The concept: one bold idea

Write one sentence that a designer could say in a pitch. It should name a **metaphor or
reference world**, not a feeling.

| Weak (a feeling) | Strong (a world) |
|---|---|
| "Modern and clean" | "A Swiss railway timetable: every number aligned, nothing decorative" |
| "Futuristic and bold" | "The opening titles of a sci-fi film: black, one light source, type that arrives" |
| "Friendly and fun" | "A risograph zine: two inks, misregistered, hand-cut shapes" |
| "Premium" | "An auction catalogue: serif captions, lots of paper, one object per page" |

The concept settles questions before they come up. Does this section get a gradient? Ask the
timetable. Does the CTA bounce? Ask the film titles. If a choice doesn't serve the concept,
cut it. Write the concept at the top of `ART_DIRECTION.md`.

## 2. Display type

Pick **one display face with character, and one quiet text face**. The display face carries
the brand, so set it **big**: hero sizes of `clamp(3.5rem, 9vw, 9.5rem)`, tight leading
(0.9–0.95) and negative tracking (-0.02 to -0.045em). Small display type wastes the face.

Pairings that work, all on Google Fonts and verified in `next/font/google`:

| Mood | Display | Text | Notes |
|---|---|---|---|
| Cinematic / editorial | Instrument Serif (400, italic) | Inter Tight or Geist | Italic for one emphasized word per headline |
| Luxurious / fashion | Bodoni Moda (opsz) or Italiana | Hanken Grotesk | High contrast; needs big sizes and dark or paper backgrounds |
| Warm editorial | Fraunces (SOFT, WONK, opsz axes) | Instrument Sans | Turn up `SOFT` for friendliness, `WONK` for quirk |
| Engineered / dev tool | Geist (600–700) tight | Geist + Geist Mono | Mono for labels, numbers and kbd |
| Bold product / startup | Bricolage Grotesque (opsz, wdth) | Inter Tight | Use the width axis: condensed for big headlines |
| Loud / poster | Anton or Archivo Black | Archivo | All caps, giant, kissing the edges |
| Geometric / tech-optimistic | Unbounded or Syne (700–800) | Manrope or Figtree | Wide; keep headlines short |
| Swiss / systematic | Schibsted Grotesk or Familjen Grotesk | same family | One family, weight contrast only |

Rules:
- At most two families, plus a mono if the concept is technical. Each extra family dilutes the
  voice.
- Use real typographic details: `text-balance` on headlines, `text-pretty` on paragraphs,
  `tabular-nums` on numbers, and en dashes and curly quotes in copy.
- Body copy at 17–19px with a 60–72ch measure. Long lines read as a template.

## 3. Hero imagery: the first screen must *show* something

Decide what the hero shows before choosing its layout:

1. **Generative.** A Kokonut canvas background as the image: `background-paths` (flowing
   ribbon), `flow-field` (streamlines), `dot-field` (halftone membrane), `topo-background`
   (contour map), `drape-background` (WebGL curtain), or `halftone-background` (any image as a
   halftone screen, with a loupe). These take their color from CSS `color` on the component, so
   `className="bg-transparent text-[var(--brand)]"` tints them to the accent. All of them
   already respect reduced motion.
2. **The product.** A real UI composed in code: a Kokonut product-ish card (`metric-card`,
   `uptime-card`, `notification-stack`, `ai-*`) or a Bklit chart in a framed device. Tilt or
   layer it. This is the most convincing hero for software, because it *is* the product.
3. **Photography.** Only if the user supplies it, or you can verify a licensed source
   (Unsplash via `images.remotePatterns`). Use `next/image` with `priority`, `sizes="100vw"`,
   and a gradient scrim for text contrast. Don't hotlink unverified URLs.
4. **Type-as-image.** The headline *is* the hero, set at 15–25vw and cropped by the viewport
   edge, with an accent detail. Kokonut `swoosh-text` (extruded 3D, pointer-lit) or
   `cradle-text` (physics letters) can carry one word of it.

Whichever you choose, layer it: background (generative, gradient or grain), then midground
(product or image), then foreground (type and CTA). Depth reads as craft.

## 4. Accent color: one, in OKLCH, used rarely

- Define `--brand` in OKLCH, plus `--brand-foreground` (the text color that sits *on* the
  brand). Choose chroma deliberately. Electric (`oklch(0.72 0.19 45)`, a hot orange) feels
  different from muted (`oklch(0.62 0.09 160)`, a sage).
- **Tint the neutrals toward the brand hue** (chroma 0.005–0.015) rather than using pure grey.
  `oklch(0.14 0.01 260)` reads as rich ink; `oklch(0.14 0 0)` reads as default.
- Map shadcn and Bklit onto it: `--primary: var(--brand)`, `--ring: var(--brand)`,
  `--chart-line-primary: var(--brand)`.
- The accent covers under 10% of a screen. Good places for it: one word in the headline, the
  primary CTA, a chart line, a focus ring, small labels. Never as the background of whole
  sections, unless the concept *is* that color.
- Avoid the default AI palette (purple→blue gradient on white, or neon cyan on navy) unless the
  concept explicitly calls for it.

Dark sites: the background sits around `oklch(0.12–0.16 …)`, not `#000`. Use one raised
surface step (+0.04 L) and hairline borders at `oklch(1 0 0 / 8–12%)`. Add a subtle grain or
noise overlay (a CSS SVG filter at 3–5% opacity) to prevent banding on large gradients.

## 5. Spacing & grid

- Section padding: `py-[clamp(6rem,12vw,11rem)]`. The hero gets at least `min-h-[100svh]` (use
  `svh`, not `vh`, so mobile browser chrome doesn't crop it).
- Container: `max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12`. Let some elements break out to
  full bleed.
- 12-column grid at desktop. Prefer **asymmetric splits** (7/5, 8/4, 5/7 with an offset) to
  centered stacks.
- Vertical rhythm on an 8px scale: eyebrow→headline 16–24px, headline→body 24–32px,
  body→CTA 40px.
- Change density between sections: an airy hero, a dense feature grid, then one giant number
  alone on the screen.

## 6. Wiring tokens

`scaffold.sh` installs this layout from `assets/templates/layout.tsx`. Swap the three
`next/font` imports for your pairing and keep the variable names (`--font-display`,
`--font-sans`, `--font-mono`); `globals.css` maps them to the `font-display`, `font-sans`
and `font-mono` utilities. For a dark site, `--dark` adds `dark` to the `<html>` className.

`src/app/layout.tsx`:

```tsx
import { Geist_Mono, Instrument_Serif, Inter_Tight } from "next/font/google";
import { MotionProvider } from "@/components/motion/motion-provider";

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-display" });
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
      <body className="bg-background text-foreground font-sans">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
```

`src/app/globals.css`: add to `@theme inline` and override the shadcn tokens. Put overrides in
`.dark` for a dark site, or in `:root` for a light one.

```css
@theme inline {
  --font-display: var(--font-display);   /* added by scaffold.sh */
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
}
.dark {
  --brand: oklch(0.72 0.19 45);
  --brand-foreground: oklch(0.15 0.02 45);
  --background: oklch(0.13 0.01 260);
  --foreground: oklch(0.96 0.005 260);
  --primary: var(--brand);
  --primary-foreground: var(--brand-foreground);
  --ring: var(--brand);
  --chart-line-primary: var(--brand);
}
```

Also replace the `metadata` title and description, and add an `opengraph-image` if time
allows.

## 7. The generic-site checklist: if three or more are true, redo the art direction

- Everything is centered.
- The hero is a headline, a subhead and two buttons on a flat or gradient background, with no
  image.
- There's a purple-to-blue gradient that the concept didn't ask for.
- Features are three or six identical cards with an icon, a title and two lines of text.
- Every element fades up with the same timing.
- Display type is under 64px on desktop.
- Copy uses "Unlock", "Supercharge", "Seamless", "Revolutionize", or "Lorem ipsum".
- There are emoji as icons.
- Section padding is under 80px.
- More than one accent color competes for attention.
