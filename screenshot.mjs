// Usage: node screenshot.mjs <url> [label] [--mobile]
// Saves to ./temporary screenshots/screenshot-N[-label].png
import puppeteer from 'puppeteer';
import { mkdirSync, readdirSync } from 'fs';

const url = process.argv[2] || 'http://localhost:3000';
const label = (process.argv[3] && !process.argv[3].startsWith('--')) ? process.argv[3] : '';
const mobile = process.argv.includes('--mobile');
const viewportOnly = process.argv.includes('--viewport');

const dir = './temporary screenshots';
mkdirSync(dir, { recursive: true });
const nums = readdirSync(dir)
  .map(f => /^screenshot-(\d+)/.exec(f))
  .filter(Boolean)
  .map(m => parseInt(m[1], 10));
const n = (nums.length ? Math.max(...nums) : 0) + 1;
const file = `${dir}/screenshot-${n}${label ? '-' + label : ''}.png`;

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport(mobile ? { width: 390, height: 844, deviceScaleFactor: 2 } : { width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
// Scroll through the page to trigger scroll-reveal animations, then return to top
await page.evaluate(async () => {
  const step = window.innerHeight / 2;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 90));
  }
  window.scrollTo(0, 0);
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
});
if (viewportOnly && url.includes('#')) {
  await page.evaluate(hash => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ block: 'start' });
  }, '#' + url.split('#')[1]);
}
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: file, fullPage: !viewportOnly });
await browser.close();
console.log('Saved', file);
