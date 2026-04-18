/**
 * Full-length mobile screenshot (Playwright programmatic API).
 * Usage: npx --yes --package=playwright@1.49.1 node scripts/capture-mobile-fullpage.mjs [url] [out.png]
 */
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:4325/";
const out = process.argv[3] || "mobile-landing-390-full.png";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  locale: "th-TH",
  deviceScaleFactor: 2,
});
const page = await context.newPage();

await page.goto(url, { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(1500);

await page.waitForSelector(".page", { timeout: 60000 }).catch(() => {});

await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const max = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    document.documentElement.offsetHeight,
    document.body.offsetHeight
  );
  const step = Math.max(300, Math.floor(window.innerHeight * 0.85));
  for (let y = 0; y <= max; y += step) {
    window.scrollTo(0, y);
    await sleep(80);
  }
  window.scrollTo(0, 0);
  await sleep(200);
});

await page.waitForTimeout(400);

const docH = await page.evaluate(() =>
  Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    document.documentElement.offsetHeight,
    document.body.offsetHeight
  )
);
console.log("[capture] document height ~", docH, "px");

await page.screenshot({ path: out, fullPage: true, type: "png" });
await browser.close();
console.log("[capture] wrote", out);
