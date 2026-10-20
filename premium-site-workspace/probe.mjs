// Runtime probe used by grade.py: overflow, console errors, reduced-motion visibility, h1 size.
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import path from "node:path";

const url = process.argv[2];
const req = createRequire(import.meta.url);
const { chromium } = req(path.join(execSync("npm root -g").toString().trim(), "playwright"));
const browser = await chromium.launch();
const errors = [];
const walk = async (page, vh) => {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += Math.round(vh * 0.5)) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(1200);
};
const res = {};
try {
  // desktop
  let ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  let page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push("console: " + m.text()));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  Object.assign(res, await page.evaluate(() => {
    const h = document.querySelector("h1");
    const cs = h ? getComputedStyle(h) : null;
    return { h1Size: cs ? parseFloat(cs.fontSize) : 0, h1Family: cs ? cs.fontFamily : "" };
  }));
  await ctx.close();
  // mobile
  ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push("[mobile] " + e.message));
  await page.goto(url, { waitUntil: "networkidle" });
  await walk(page, 844);
  Object.assign(res, await page.evaluate(() => ({
    mobileScrollWidth: document.documentElement.scrollWidth,
    mobileOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
  })));
  await ctx.close();
  // reduced motion
  ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await walk(page, 900);
  Object.assign(res, await page.evaluate(() => {
    const hidden = [];
    for (const el of document.querySelectorAll("h1,h2,h3,p,li,button,a")) {
      const text = (el.innerText || "").trim();
      if (!text || el.closest("[aria-hidden=true],[hidden]")) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue; // collapsed (accordion etc.)
      let n = el, op = 1;
      while (n && n !== document.documentElement) { op *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
      if (op < 0.1) hidden.push(text.slice(0, 40));
    }
    return { reducedHidden: hidden.length, reducedHiddenSamples: hidden };
  }));
  await ctx.close();
} catch (e) {
  console.log(JSON.stringify({ error: String(e) }));
  process.exit(0);
}
await browser.close();
res.errors = errors;
console.log(JSON.stringify(res));
