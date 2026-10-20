# Relay landing page: report

## What was built
A single-page marketing site for **Relay** (API monitoring for small dev teams), built with **Next.js 16.4.2 (App Router, Turbopack), React 19 and Tailwind CSS v4**. The project is at `site/`.

**Art direction:** loud and confident. One strong colour, signal orange `#FF4D00`, against ink black `#0A0A0A` and a warm bone white `#F4F1EA`, with no other hues. Headlines use **Archivo at weight 900 with its width axis at 125%**: huge, wide uppercase type (the hero headline reaches about 10.5rem). Supporting text uses Inter, and labels/data use JetBrains Mono. Other details: hard offset shadows, 2px ink borders, outlined "stroke" type, a subtle dot grain and marquee bands. Fonts load through `next/font`, so they are self-hosted at build time.

**Sections** (`site/app/page.tsx`, components in `site/components/`):
1. **Nav**: sticky orange bar, anchor links, "Start free" CTA.
2. **Hero**: "YOUR API BROKE. YOU KNOW IN <10s.", value prop, two CTAs, a tilted mock **alert card** (POST /v1/checkout 502, detected in 7.2s), and a 3-up stat strip (7.2s / p95 / 1 click).
3. **Marquee**: black band of scrolling claims.
4. **Proof (charts)**:
   - *p95 latency line/area chart*, 842ms → 128ms over 12 weeks (−85%). It is interactive: hovering moves a crosshair point and tooltip, and annotated events mark the fixes. It mixes SVG and HTML so the labels stay legible at phone width.
   - *Uptime*: 99.99% headline and 90 daily bars, with the 3 incident days highlighted (each bar has a hover title).
   - *"Who finds out first?"*: log-scale horizontal bars comparing Relay 7.2s, a 1-min pinger, a 5-min pinger and "your customers" (41m).
   - A footnote marks the charts as sample/demo data.
5. **Feature grid**: bento layout. A large orange "<10s" alerting tile, plus p95 dashboards (sparkline with deploy marker), status pages, multi-step checks, on-call routing, and 90-second setup (CLI snippet).
6. **Integrations strip**: wordmark marquee (Slack, PagerDuty, Discord, GitHub, Teams, Opsgenie, Linear, Vercel, Grafana, Datadog, Webhooks, Twilio SMS). It pauses on hover. Text wordmarks are used, not third-party logo files.
7. **Pricing**: Hobby $0 / Team $29 / Scale $99, with a Monthly / Annual (−20%) toggle. Team is the featured plan.
8. **Final CTA**: "STOP FINDING OUT FROM TWITTER." with an email signup form. It shows a client-side confirmation and has no backend.
9. **Footer**: link columns, status pill, oversized RELAY wordmark.

**Accessibility and quality:** semantic landmarks, skip link, `aria-label`s on charts, radiogroup semantics on the pricing toggle, labelled email input, visible orange focus rings, and a `prefers-reduced-motion` override that stops the marquees and animations. The page is fully static (prerendered `○ /`), and only the latency chart, pricing toggle and signup form are client components.

## Verification
- `npm run build` passed with no errors: TypeScript passed, and `/` was prerendered as static content.
- I served the production build with `next start -p 3104` and drove it with Playwright (global install, preinstalled Chromium):
  - Page title confirmed as "Relay — Your API broke. Know in 10 seconds."
  - **Horizontal overflow: 0px** at both 1440 and 390 widths.
  - **No console errors or page errors** at either viewport.
  - Pricing toggle: clicking "Monthly" changes Team from $23 to **$29**.
  - Signup: filling an email and submitting shows the "You're in." confirmation.
  - Latency chart hover at 45% width shows the tooltip **"Wk 6 · 437ms"**.
- Screenshots (full page):
  - `shots/desktop.png`: 1440×900 viewport, 1440×8476 page.
  - `shots/mobile.png`: 390×844 viewport, rendered at 2× scale (780×22250 px).
- I reviewed the screenshots visually and fixed these issues from the first pass:
  - The uptime figure overflowed its card at desktop.
  - Units showed as "10S", "7.2S" and "MS" because of the uppercase display style; they are now lowercase s/ms.
  - The pricing toggle label wrapped.
  - "1 CLICK" wrapped on mobile.
  - The featured pricing card's shadow overlapped the next card on mobile.
- The server was stopped afterwards. Nothing was committed.

## Deploy
No Vercel credentials are available here, so the site was not deployed. To deploy from `site/`:

```bash
cd site
npm install
npm run build          # sanity check
npx vercel --prod      # or: vercel deploy --prod (framework auto-detected as Next.js)
```

No environment variables are required.

## Notes / placeholders
- All metrics (latency series, uptime, incident days, competitor detection times) are illustrative sample data and are labelled that way on the page.
- The signup form does not submit anywhere. Wire `FinalCta.tsx` `onSubmit` to a real endpoint or a Server Action.
- Footer and nav "Log in" links are placeholder anchors.
