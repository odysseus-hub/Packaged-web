# Relay landing page: report

## What I built
This is a one-page marketing site for **Relay**, an API monitoring product for small dev teams. It is built with **Next.js 16.4.2 (App Router) and Tailwind CSS 4.3**, using TypeScript and React 19. The project is in `site/`.

**Visual direction.** The page is meant to feel loud and confident:
- Huge uppercase headlines in Archivo Black, widened to 112% using its `wdth` axis.
- JetBrains Mono for data and labels.
- **One strong color, signal orange `#ff4d00`.** Everything else is near-black ink `#0c0c0c` or warm paper `#f3f0e8`.
- Hard 2px borders and offset block shadows. No gradients and no soft cards.

Sections, top to bottom:
1. **Sticky nav**: wordmark, anchor links and a "Start free" CTA.
2. **Hero**: the headline "Your API breaks. You know in under 10s.", a mock live incident console (fail → incident → Slack/PagerDuty/status page, with "6.8s" failure-to-human) and a 4-stat strip.
3. **Orange marquee band** that scrolls the selling points.
4. **Proof / charts** (`components/Proof.tsx`):
   - A line chart of weekly p95 latency over 16 weeks, with a "Relay on" marker. It drops from 905ms to 196ms, which is −78%. The callouts are computed from the data.
   - A bar chart of 90 days of daily uptime. Incident days are orange. It shows 99.998% for the last 30 days, up from 99.77%; both figures are computed.
   - A bar chart of median downtime per month (47 → 4 min).
   - The charts are built with HTML and SVG. The axis text is HTML so it stays readable on mobile, and the SVG lines use non-scaling strokes.
   - The charts animate in as you scroll (a curtain wipe and growing bars). This respects `prefers-reduced-motion`.
   - There is a visible footnote saying the figures are illustrative.
5. **Feature grid**: 7 features in a bordered grid. The two hero cells span two columns and include mini mocks (alert time, status page). The SSL cell has an expiry list mock.
6. **Integrations strip**: 12 tiles with simple custom line glyphs and text wordmarks: Slack, PagerDuty, Discord, MS Teams, Opsgenie, GitHub, GitLab, Vercel, Linear, Jira, Datadog and Webhooks. No third-party logo artwork is copied.
7. **Pricing** (a client component): Hobby $0, Team $29 and Scale $99. A Monthly/Yearly toggle switches to the "2 months free" prices ($24 / $83). Team is featured.
8. **Final signup CTA**: a full orange block with the headline "Stop hearing about outages from users.", an email form with validation, an error message and a success state, plus a stat row.
9. **Footer**: link columns and a giant faded wordmark.

**Other details:**
- Metadata, OpenGraph and an SVG favicon (`app/icon.svg`).
- Skip link, `aria-label`s on the charts, `aria-pressed` on the pricing toggle, and an `aria-live` form note.
- With JavaScript disabled, all reveal content still shows. The `.js` class is added only on the client.

## How I verified it
- `npx tsc --noEmit` passes with no errors.
- `next build` succeeds. The `/` route is prerendered as static, with no warnings or errors.
- I served the production build with `./node_modules/.bin/next start -p 3140`, then stopped it by its own PID.
- Playwright (global install, Chromium) screenshots, taken after scrolling the page so the scroll reveals fire:
  - `shots/desktop.png`: 1440×900 viewport, full page (1440×9268).
  - `shots/mobile.png`: 390×844 viewport, full page (390×11388).
- Automated checks during the screenshot run:
  - No horizontal overflow at either width (scrollWidth equals clientWidth).
  - Every `.reveal` block reached its visible state.
  - No console errors or page errors.
- Interaction test at 390px:
  - The pricing toggle switches yearly ($0/$24/$83) to monthly ($0/$29/$99).
  - An invalid email shows the error message.
  - A valid email shows the "You're in." state.
  - No integration tile overflows.
- I reviewed the screenshots by eye and fixed what I found:
  - Overflow from the footer wordmark and the chart headline on mobile.
  - The "Relay on" label overlapping the latency line.
  - Empty space in the SSL feature cell.
  - Wrapping in the hero console on mobile.
  - The PagerDuty tile overflowing at 390px.

## Not included / to do before launch
- The signup form has no backend. `components/SignupCTA.tsx` marks where to POST to a real endpoint.
- The footer links and "Log in" are placeholders (anchors).
- The chart data in `lib/data.ts` is illustrative.

## Deploy
I did not deploy, because there are no Vercel credentials in this environment. From `site/`:

```bash
npm install
npx vercel --prod
```

Vercel detects Next.js automatically. Build command: `next build`. Output: `.next`.
