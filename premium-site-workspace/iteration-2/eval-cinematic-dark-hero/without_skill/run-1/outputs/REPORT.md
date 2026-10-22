# Nocturne marketing site: report

## What I built
A single-page marketing site for **Nocturne**, an AI colour-grading tool for indie filmmakers. It is built with **Next.js 15.5 (App Router) + Tailwind CSS v4 + TypeScript** and lives in `site/`.

**Look and feel:** near-black "ink" palette with bone-white type, amber accents and teal light. Headings use Instrument Serif, body text uses Inter and HUD/credits text uses JetBrains Mono, all loaded through `next/font/google`. An animated film-grain overlay covers the whole page.

**Hero (an opening-titles sequence, pure CSS):**
1. Two letterbox bars close in from a black screen to a 2.39-style frame.
2. "NOCTURNE LABS PRESENTS" fades in and then out.
3. The title "NOCTURNE" comes into focus: the letter-spacing narrows and the blur clears. At the same moment an anamorphic lens-flare streak sweeps across behind it, and afterwards the title flickers slightly like a projector.
4. The tagline, body copy and CTAs fade in one after another.

Behind it, an SVG "film still" plate (a dusk highway with a lone figure) drifts slowly and carries a teal grade. The bottom letterbox bar works as a HUD: "Reel 01", "Directed by you · Graded by Nocturne", and a live 24 fps timecode.

**Sections:**
- **How it works:** 3 numbered steps.
- **Look library showcase:** an interactive before/after comparison. You drag a split between the ungraded log plate and the selected grade. There are 5 grades: Midnight Teal, 2383 Print, Bleach Bypass, Sodium & Neon and Magic Hour, each with a swatch, a reference code and a note.
- **Render-speed stats:** 3 figures (38 ms per 4K frame, 11 min per feature, 24×).
- **Testimonials:** 3 filmmakers.
- **Pricing:** Free $0, **Pro $24/mo** (highlighted) and Studio $79/mo.
- **FAQ:** 6 questions, using native `<details>` elements.
- **Waitlist CTA:** an email field plus a role select. It posts to the route handler `app/api/waitlist/route.ts`, which validates the input and returns 422 on a bad email. The form has loading, error and success states.
- **Footer:** styled as end credits.

**Motion and accessibility:**
- Sections reveal on scroll through IntersectionObserver.
- `prefers-reduced-motion` turns off every animation.
- Adding `?still=1` shows the final state with no motion. I used this for the full-page screenshots.
- The page uses semantic landmarks, labelled form fields, tab roles on the look switcher and `aria-live` messages.

## Placeholders to replace before launch
- **Stats and testimonials are made up:** the speed figures, the filmmakers and their quotes, and "4,200 on the waitlist" are all invented. Replace them with real data.
- **Waitlist signups are not saved:** the API only `console.log`s them. Connect it to Resend, Loops, Supabase, Vercel KV or similar at the `TODO` in `app/api/waitlist/route.ts`.
- `hello@nocturne.film` is a placeholder address.

## How I verified it
- **Build:** `next build` finished with no type errors or lint failures. `/` is prerendered as static and `/api/waitlist` is a dynamic function.
- **Production server:** ran `./node_modules/.bin/next start -p 3120`, then stopped it by its PID.
  - `GET /` returned 200.
  - `POST /api/waitlist` with a valid email returned 200 and `{ok:true}`.
  - With an invalid email it returned 422.
- **Playwright + Chromium, at desktop 1440×900 and mobile 390×844:**
  - No console errors or page errors.
  - `scrollWidth` equals the viewport width, so there is no horizontal scroll.
  - Switching looks works.
  - Submitting the waitlist form in the browser reaches the success state.
- **Bugs found in screenshot review and fixed:**
  - The grain overlay was enlarging the mobile layout viewport.
  - On mobile, the showcase frame's `min-height` combined with its aspect ratio forced a width of 526px.
  - The title's flicker animation was overriding its title-in animation.
  - The waitlist button text was wrapping.

### Screenshots (`shots/`)
- `desktop-full.png` (1440 wide) and `mobile-full.png` (390 wide): the full page, captured with `?still=1`.
- `desktop-hero.png` and `mobile-hero.png`: the hero once the title sequence has finished (about 7 s).
- `desktop-hero-t1.5s.png` and `mobile-hero-t1.5s.png`: a mid-sequence frame showing the "presents" card.
- `desktop-look-neon.png` and `mobile-look-neon.png`: the showcase after switching to the Sodium & Neon look.

## Run and deploy
```bash
cd site
npm install
npm run build && npm start      # local production check
npx vercel --prod                # deploy (needs a Vercel login; framework auto-detected as Next.js)
```
Alternatively, push `site/` to a Git repository and import it in the Vercel dashboard (Root Directory: `site`). No environment variables are needed.
