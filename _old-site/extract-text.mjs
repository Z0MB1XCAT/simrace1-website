// Quick text extractor for the old Wix pages
import { readFileSync } from 'fs';

const file = process.argv[2];
let html = readFileSync(file, 'utf8');

// Remove scripts, styles, and SVG noise
html = html.replace(/<script[\s\S]*?<\/script>/gi, ' ');
html = html.replace(/<style[\s\S]*?<\/style>/gi, ' ');
html = html.replace(/<svg[\s\S]*?<\/svg>/gi, ' ');
html = html.replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ');

// Strip tags
let text = html.replace(/<[^>]+>/g, '\n');
text = text.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<');

// Collapse whitespace, dedupe consecutive lines
const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
const out = [];
for (const l of lines) {
  if (out[out.length - 1] !== l) out.push(l);
}
console.log(out.join('\n'));
