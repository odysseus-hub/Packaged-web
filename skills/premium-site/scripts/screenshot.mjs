// Capture the running site the way a reviewer sees it: desktop + mobile, full page, plus a
// reduced-motion pass. Scrolls the page first so whileInView reveals have fired.
//
// Usage: node screenshot.mjs <site-dir | url> <out-dir>
//   node screenshot.mjs ./my-site ./shots           ← preferred: builds must exist (next build);
//                                                     starts `next start` on a free port and
//                                                     stops exactly that server afterwards
//   node screenshot.mjs http://localhost:3000 ./shots   (a server you manage yourself)
// Needs playwright (global install or project dep). In Claude cloud containers Chromium is at
// /opt/pw-browsers and PLAYWRIGHT_BROWSERS_PATH is already set — do not run `playwright install`.
import { existsSync, mkdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { execSync, spawn } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";

const [target = "http://localhost:3000", out = "./shots"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });

// Self-serve mode: never leave a stray server behind, never kill someone else's by name.
let server = null;
let url = target;
if (existsSync(target) && statSync(target).isDirectory()) {
  const bin = path.join(target, "node_modules/.bin/next");
  if (!existsSync(path.join(target, ".next"))) throw new Error(`no build in ${target} — run next build first`);
  const port = await new Promise((r) => { const s = createServer().listen(0, () => { const p = s.address().port; s.close(() => r(p)); }); });
  server = spawn(bin, ["start", "-p", String(port)], { cwd: target, detached: true, stdio: "ignore" });
  url = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 60; i++) {
    try { await fetch(url); break; } catch { await new Promise((r) => setTimeout(r, 500)); }
  }
}
// `next start` re-spawns next-server in its own process group, so signalling our group misses
// it. Walk the whole descendant tree (pgrep -P works on Linux and macOS) and kill each pid.
const descendants = (pid) => {
  let kids = [];
  try { kids = execSync(`pgrep -P ${pid}`).toString().split(/\s+/).filter(Boolean).map(Number); } catch {}
  return kids.flatMap((k) => [k, ...descendants(k)]);
};
const stopServer = () => {
  if (!server) return;
  for (const pid of [...descendants(server.pid), server.pid]) { try { process.kill(pid, "SIGTERM"); } catch {} }
  server = null;
};
process.on("exit", stopServer);

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
stopServer();
console.log(`screenshots → ${out}`);
if (errors.length) {
  console.log("issues:\n  " + errors.join("\n  "));
  process.exitCode = 1;
}
