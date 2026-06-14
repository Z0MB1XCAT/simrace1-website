# SimRace1.com — Website

The official website for **SimRace1**, a professional sim racing venue in Swansea, Wales. Eight pro-grade simulators, 60+ laser-scanned tracks, open to ages 13+.

Live site: [www.simrace1.com](https://www.simrace1.com)

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Pages | Vanilla HTML | Zero JS overhead, instant SSR-equivalent performance |
| Styles | Custom CSS with design tokens | No framework bloat; full control over design system |
| Fonts | Self-hosted WOFF2 | Eliminates Google Fonts render-blocking round-trip |
| Images | WebP + `<picture>` | 90%+ smaller than original JPGs with no visible quality loss |
| Dev server | Node.js (`serve.mjs`) | Serves correct MIME types for `.woff2`, `.webp` |
| Booking | 4-step vanilla JS wizard | `mailto:` submit — no backend required |
| SEO | Schema.org JSON-LD | EntertainmentBusiness + BreadcrumbList structured data |
| Audits | Lighthouse CLI + Puppeteer | Automated screenshot & score verification |

Lighthouse scores (homepage): **Performance 99 · Accessibility 100 · Best Practices 100 · SEO 100**

---

## Project Structure

```
/
├── index.html               # Homepage
├── styles.css               # Shared design system (CSS variables, components)
├── main.js                  # Shared JS (nav toggle, scroll-reveal, footer year)
├── robots.txt
├── sitemap.xml
│
├── book-online/
│   └── index.html           # 4-step booking wizard
│
├── carsandtracks/
│   └── index.html           # Car categories & 60+ track listings
│
├── fonts/                   # Self-hosted WOFF2 subsets
│   ├── SairaCondensed-700.woff2
│   ├── SairaCondensed-800.woff2
│   ├── Barlow-400.woff2
│   ├── Barlow-600.woff2
│   └── ...
│
├── images/                  # WebP-optimised venue photos + OG image
│
├── serve.mjs                # Local dev server (port 3000)
├── screenshot.mjs           # Puppeteer screenshot helper
└── _old-site/               # Archived original Wix export (reference only)
```

---

## Design System

**"Night Session"** — carbon black cockpit aesthetic with racing red and LED blue accents.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a0c10` | Page background |
| `--red` | `#e63429` | Primary accent, CTAs |
| `--blue` | `#4cc2ff` | Secondary accent, links |
| `--display` | Saira Condensed | Headings |
| `--body` | Barlow | Body text |
| `--notch` | `polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)` | Clipped card corners |

---

## Running Locally

```bash
# Install dependencies (Puppeteer only — for screenshots)
npm install

# Start dev server
node serve.mjs
# → http://localhost:3000
```

> **Important:** Always open the site via `http://localhost:3000`, not by double-clicking an HTML file. Absolute asset paths (`/fonts/`, `/images/`) won't resolve with the `file://` protocol.

---

## Screenshot & Audit Workflow

```bash
# Full-page screenshot (auto-increments, saves to ./temporary screenshots/)
node screenshot.mjs http://localhost:3000
node screenshot.mjs http://localhost:3000/book-online/

# Optional label suffix
node screenshot.mjs http://localhost:3000 hero

# Lighthouse audit (requires lighthouse installed globally)
npx lighthouse http://localhost:3000 --output json --output-path ./lighthouse-home.json
```

---

## Booking System

The booking wizard (`/book-online/`) is a four-step pure JS state machine:

1. **Simulators** — 1–8 sims, price calculated live (£12/sim)
2. **Date** — calendar rendered client-side; Wednesday only available for 6+ sims
3. **Time** — available slots derived from opening hours config
4. **Details** — name, email, phone, notes

On submit, a pre-filled `mailto:` URI opens the user's email client addressed to `simrace1@yahoo.com`. No backend or database is involved.

Alternative booking methods (below the wizard): telephone, Facebook Messenger, walk-in with Google Maps link.

---

## Image Optimisation

Original Wix JPGs were 2–5 MB each. Optimised pipeline:

```bash
node optimize-images.mjs
```

Uses `sharp` to convert JPG → WebP at quality 82, generating mobile-specific crops for the hero. Results: 79–179 KB per image.

---

## SEO

- Schema.org `EntertainmentBusiness` JSON-LD on homepage (address, phone, hours, pricing, social links)
- `BreadcrumbList` on subpages
- `sitemap.xml` listing all pages
- `robots.txt` with sitemap pointer and `/_old-site/` excluded
- All images have descriptive `alt` text
- `<meta>` description, Open Graph, and Twitter Card tags on every page

---

## Social Links

| Platform | Handle |
|---|---|
| Facebook | [/SimRace1](https://www.facebook.com/SimRace1/) |
| Instagram | [@simrace1.swansea](https://www.instagram.com/simrace1.swansea/) |
| TikTok | [@simrace1](https://www.tiktok.com/@simrace1) |

---

## License

All venue photography and branding © SimRace1. Code is provided for reference.
