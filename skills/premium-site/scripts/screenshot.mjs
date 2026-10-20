// Capture the running site the way a reviewer sees it: desktop + mobile, full page, plus a
// reduced-motion pass. Scrolls the page first so whileInView reveals have fired.
//
// Usage: node screenshot.mjs <url> <out-dir>
//   e.g. node screenshot.mjs http://localhost:3000 ./shots
// Needs playwright (global install or project dep). In Claude cloud containers Chromium is at
// /opt/pw-browsers and PLAYWRIGHT_BROWSERS_PATH is already set — do not run `playwright install`.
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import path from "node:path";

const [url = "http://localhost:3000", out = "./shots"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });

function loadPlaywright() {
  const req = createRequire(import.meta.url);
  for (const id of ["playwright", "@playwright/test"]) {
    try { return req(id); } catch {}
    try {
      const globalRoot = execSync("npm root -g").toString().trim();
      return req(path.join(globalRoot, id));
    } catch {}
  }
  throw new Error("playwright not found — `npm i -D playwright` (browsers are preinstalled)");
}
const { chromium } = loadPlaywright();

const runs = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" },
  { name: "mobile", viewport: { width: 390, height: 844 }, reducedMotion: "no-preference", isMobile: true, hasTouch: true },
  { name: "desktop-reduced", viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" },
];

const browser = await chromium.launch();
const errors = [];
for (const r of runs) {
  const ctx = await browser.newContext({ viewport: r.viewport, reducedMotion: r.reducedMotion, isMobile: r.isMobile, hasTouch: r.hasTouch });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`[${r.name}] ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`[${r.name}] console: ${m.text()}`));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800); // let the hero choreography finish
  await page.screenshot({ path: `${out}/${r.name}-hero.png` });
  // Walk the page so every once-only reveal triggers, then return to top for the full shot.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += Math.round(r.viewport.height * 0.6)) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(900);
  const overflowX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (overflowX) errors.push(`[${r.name}] horizontal overflow: page is wider than the viewport`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/${r.name}-full.png`, fullPage: true });
  await ctx.close();
}
await browser.close();
console.log(`screenshots → ${out}`);
if (errors.length) {
  console.log("issues:\n  " + errors.join("\n  "));
  process.exitCode = 1;
}
