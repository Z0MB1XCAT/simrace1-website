import puppeteer from 'puppeteer';
import { existsSync, mkdirSync } from 'fs';

const dir = './temporary screenshots';
if (!existsSync(dir)) mkdirSync(dir);

const files = (await import('fs')).readdirSync(dir);
const nums  = files.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1])).filter(Boolean);
let n = (nums.length ? Math.max(...nums) : 0) + 1;

const browser = await puppeteer.launch({ headless: 'new' });
const page    = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

const base = 'http://localhost:3000/book-online/';
await page.goto(base, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')));
await new Promise(r => setTimeout(r, 600));

// Step 1 — bump sims to 3
await page.click('#simPlus');
await page.click('#simPlus');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: `${dir}/screenshot-${n++}-bk-step1-3sims.png`, fullPage: false });
console.log('step 1 done');

// Step 2 — calendar
await page.click('#bkNext');
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: `${dir}/screenshot-${n++}-bk-step2-calendar.png`, fullPage: false });
console.log('step 2 calendar');

// Pick the first available day
const firstAvail = await page.$('.cal-day.avail');
if (firstAvail) {
  await firstAvail.click();
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: `${dir}/screenshot-${n++}-bk-step2-date-selected.png`, fullPage: false });
  console.log('step 2 date selected');
}

// Step 3 — time slots
await page.click('#bkNext');
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: `${dir}/screenshot-${n++}-bk-step3-times.png`, fullPage: false });

// Pick a time slot
const firstSlot = await page.$('.time-chip');
if (firstSlot) { await firstSlot.click(); await new Promise(r => setTimeout(r, 200)); }
await page.screenshot({ path: `${dir}/screenshot-${n++}-bk-step3-time-selected.png`, fullPage: false });
console.log('step 3 done');

// Step 4 — details form
await page.click('#bkNext');
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: `${dir}/screenshot-${n++}-bk-step4-details.png`, fullPage: false });
console.log('step 4 done');

// Mobile view — step 1
await page.setViewport({ width: 390, height: 844 });
await page.goto(base, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('in')));
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: `${dir}/screenshot-${n++}-bk-mobile.png`, fullPage: false });
console.log('mobile done');

await browser.close();
console.log('all done');
