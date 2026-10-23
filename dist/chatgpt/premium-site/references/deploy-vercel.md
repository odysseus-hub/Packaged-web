# Deploy to Vercel

Next.js on Vercel needs no config: no `vercel.json`, no adapter. The build command is
`next build`, and the framework is auto-detected.

## Before deploying
- `npx eslint` and `npx next build` are clean locally. A broken build on Vercel is slower to
  debug than a local one.
- `metadata` has a real title, a description and `metadataBase` (needed for absolute OG image
  URLs). Add `app/opengraph-image.tsx` or a static `opengraph-image.png` if you can.
- No secrets in client code. Any env vars go in Vercel → Project → Settings → Environment
  Variables, or via `vercel env add NAME`.
- Remote image hosts are listed in `images.remotePatterns`.

## Path A: CLI (when credentials exist)

Check for credentials first: `echo $VERCEL_TOKEN` or `npx vercel whoami`.

```bash
npx vercel@latest --yes                     # preview deploy: links the project on first run, prints a URL
npx vercel@latest --prod --yes              # production
# Non-interactive / CI:
npx vercel@latest deploy --prod --yes --token "$VERCEL_TOKEN"
```

The first run creates `.vercel/project.json`. Add `.vercel` to `.gitignore` (create-next-app
already does this).

## Path B: Git import (no CLI credentials, or for the user's ongoing workflow)

1. Push the project to GitHub (its own repo, or a monorepo subfolder).
2. vercel.com/new → Import the repo. For a subfolder, set **Root Directory** to it (e.g.
   `demos/cinematic-dark`).
3. Every push to the default branch deploys to production; PRs get preview URLs.

## If you can't deploy from here
Don't fake a URL. Leave the project build-clean, and tell the user the exact command
(`cd <dir> && npx vercel --prod`) and the Git-import alternative with the root directory to
use.

## After deploying
Open the URL and check the hero renders, fonts load (no fallback flash), and the console has no
errors. If you can, run Lighthouse (`npx lighthouse <url> --only-categories=performance,accessibility --quiet`):
aim for performance ≥ 90 and accessibility ≥ 95. Heavy WebGL heroes are the usual performance
cost. Lower their density or swap in a lighter Kokonut background on mobile.
