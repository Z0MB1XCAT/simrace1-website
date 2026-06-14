// One-off: download latin woff2 subsets from Google Fonts for self-hosting
import { mkdirSync, writeFileSync } from 'fs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';
const cssUrl = 'https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@600;700;800&display=swap';

const css = await (await fetch(cssUrl, { headers: { 'User-Agent': UA } })).text();
mkdirSync('fonts', { recursive: true });

// Parse blocks: comment with subset name, @font-face body
const re = /\/\* (\w[\w-]*) \*\/\s*@font-face\s*{([^}]+)}/g;
let m, manifest = [];
while ((m = re.exec(css))) {
  const subset = m[1];
  if (subset !== 'latin') continue;
  const body = m[2];
  const family = /font-family: '([^']+)'/.exec(body)[1].replace(/\s+/g, '');
  const style = /font-style: (\w+)/.exec(body)[1];
  const weight = /font-weight: (\d+)/.exec(body)[1];
  const url = /url\((https:[^)]+\.woff2)\)/.exec(body)[1];
  const name = `${family}-${weight}${style === 'italic' ? 'i' : ''}.woff2`;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(`fonts/${name}`, buf);
  manifest.push({ family: /font-family: '([^']+)'/.exec(body)[1], style, weight, name, kb: Math.round(buf.length / 1024) });
}
console.table(manifest);
