// Functional smoke test: console errors, failed requests, internal links, nav toggle
import puppeteer from 'puppeteer';

const base = 'http://localhost:3000';
const pages = ['/', '/carsandtracks/', '/book-online/'];
const browser = await puppeteer.launch();
let failures = 0;

for (const path of pages) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push('REQUEST FAILED: ' + r.url()));
  page.on('response', r => { if (r.status() >= 400) errors.push('HTTP ' + r.status() + ': ' + r.url()); });
  await page.goto(base + path, { waitUntil: 'networkidle0', timeout: 60000 });

  // Collect internal links
  const links = await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
  const internal = [...new Set(links.filter(h => h.startsWith('/') && !h.startsWith('//')))];
  for (const href of internal) {
    const clean = base + href.split('#')[0];
    const res = await fetch(clean);
    if (!res.ok) { errors.push('BROKEN LINK ' + href + ' -> ' + res.status); }
  }

  console.log(path, errors.length ? 'FAIL' : 'OK');
  errors.forEach(e => { console.log('  ', e); failures++; });
  await page.close();
}

// Mobile nav toggle test
const m = await browser.newPage();
await m.setViewport({ width: 390, height: 844 });
await m.goto(base + '/', { waitUntil: 'networkidle0' });
await m.click('.nav-toggle');
const visible = await m.$eval('.nav-links', el => getComputedStyle(el).display !== 'none');
const expanded = await m.$eval('.nav-toggle', el => el.getAttribute('aria-expanded'));
console.log('mobile nav opens:', visible && expanded === 'true' ? 'OK' : 'FAIL');
if (!(visible && expanded === 'true')) failures++;

await browser.close();
process.exit(failures ? 1 : 0);
