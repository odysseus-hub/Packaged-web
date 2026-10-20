# Nocturne marketing site: report

## What was built
A single-page marketing site for **Nocturne**, an AI color-grading tool for indie filmmakers. It is a dark, cinematic site built with **Next.js 16.4.2 (App Router) + Tailwind CSS 4.3.3 + TypeScript**. The project is in `site/`.

### Sections
1. **Hero (opening-titles sequence).** The screen starts black. Letterbox bars open to 2.39:1, then a "Nocturne Labs presents" credit fades in and out. The serif NOCTURNE title resolves from blur while its letter-spacing tightens, followed by the tagline and CTAs. Behind it is a graded "film still" with a slow Ken Burns push, a projector flicker, an anamorphic light sweep, a vignette and animated film grain. A camera HUD sits on the letterbox bars: REC dot, a live 24fps timecode, scene/take/look, ISO/shutter and LogC→Rec.709.
2. **Camera/format marquee strip.**
3. **How it works.** Three numbered steps, plus a LOG → Balance → Look frame strip.
4. **Looks showcase.** A before/after viewer: you drag to compare camera LOG with the grade. There are 5 selectable looks (Midnight Teal, Print '83, Silver Retention, Neon Vigil, Magic Hour), each with a thumbnail, swatches and a description. The "footage" is a hand-drawn SVG still, graded with a CSS filter plus a blend-mode overlay, so there are no image assets or licensing.
5. **Render speed stats.** 2.4s per shot, 11 min first pass on a 90-minute feature, 14x faster than a manual pass. They carry a beta-benchmark footnote.
6. **Testimonials.** Three filmmaker quotes.
7. **Pricing.** Free $0, **Pro $24/mo** (featured), Studio $79/mo.
8. **FAQ.** Six native `<details>` accordions.
9. **Waitlist CTA.** An email + role form with client validation. It posts to `app/api/waitlist/route.ts`, which validates on the server and forwards to `WAITLIST_WEBHOOK_URL` if that is set (otherwise it logs). It shows success and error states.
10. **"End credits" footer.**

Also included: responsive nav with a mobile menu, IntersectionObserver scroll reveals, `prefers-reduced-motion` support, fonts self-hosted via `next/font` (Cormorant Garamond, Inter, JetBrains Mono), an SVG favicon, and metadata/OG tags.

> Placeholder copy to replace before launch: the testimonial names and quotes, the stats, the "4,200+ filmmakers" count and hello@nocturne.film.

## Verification
- `npx next build` passes with no TypeScript or build errors. `/` is static and `/api/waitlist` is a dynamic function.
- I ran the prod server (`next start -p 3102`) and drove it with Playwright/Chromium:
  - No console or page errors at desktop or mobile size.
  - No horizontal overflow at 1440px or 390px.
  - The look picker and before/after slider work (`shots/desktop-showcase-neon.png`).
  - The waitlist rejects an invalid email inline, and a valid one shows the success state (`shots/desktop-waitlist-success.png`).
  - The API returns 422 for an invalid email.
- Screenshots are in `shots/`:
  - `desktop-hero.png` (1440x900, after the title sequence) and `desktop-full.png` (1440 full page)
  - `mobile-hero.png` (390x844) and `mobile-full.png` (390 full page)
- Capture notes:
  - Chromium's beyond-viewport full-page capture dropped tiles while the infinite animations (grain, marquee, Ken Burns) were running. For the full-page shots only, the capture script freezes those loops and un-fixes the nav. The site itself is unchanged.
  - The mobile full page was stitched from 844px viewport tiles, because a single capture lost tiles past roughly 8000px.
  - I checked sections individually with viewport screenshots, and they render correctly in normal browsing.
- The server was killed afterwards, and port 3102 was free.

## Deploy
Not deployed, because there are no Vercel credentials here. To deploy:

    cd site
    npx vercel --prod     # or import the repo in Vercel (preset: Next.js)

Optional env var: `WAITLIST_WEBHOOK_URL`, which receives `{email, role, at}` for each signup.
