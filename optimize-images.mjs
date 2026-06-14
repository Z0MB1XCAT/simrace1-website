// One-off: resize + convert venue photos to web-ready WebP with SEO filenames
import sharp from 'sharp';

const jobs = [
  // [src, out, width]
  ['images/hero.jpg', 'images/simrace1-racing-simulators-swansea.webp', 1920],
  ['images/hero.jpg', 'images/simrace1-racing-simulators-swansea-mobile.webp', 860],
  ['images/shop-1.jpg', 'images/racers-on-simulators.webp', 1100],
  ['images/shop-3.jpg', 'images/venue-interior-led.webp', 1100],
  ['images/rig-4.jpg', 'images/simulator-rig-triple-screens.webp', 1100],
  ['images/rig-5.jpg', 'images/fanatec-wheel-load-cell-pedals.webp', 1100],
  ['images/rig-3.jpg', 'images/simrace1-storefront-high-street-swansea.webp', 1100],
  ['images/rig-1.jpg', 'images/hot-lap-champion-trophies.webp', 900],
  ['images/rig-2.jpg', 'images/race-night-group.webp', 900],
  ['images/shop-2.jpg', 'images/group-event-simrace1.webp', 900],
  ['images/skoda.jpg', 'images/endurance-race-team.webp', 900],
  ['images/hero.jpg', 'images/og-simrace1.jpg', 1200],
];

for (const [src, out, width] of jobs) {
  const opts = out.endsWith('.jpg') ? { quality: 82 } : { quality: 78 };
  const img = sharp(src).resize({ width, withoutEnlargement: true });
  if (out.endsWith('.jpg')) await img.jpeg(opts).toFile(out);
  else await img.webp(opts).toFile(out);
  const meta = await sharp(out).metadata();
  console.log(out, meta.width + 'x' + meta.height);
}

// Favicons from the chequered-flag logo (square crop)
await sharp('images/logo.jpg').resize(180, 180, { fit: 'cover' }).png().toFile('images/apple-touch-icon.png');
await sharp('images/logo.jpg').resize(48, 48, { fit: 'cover' }).png().toFile('images/favicon-48.png');
await sharp('images/logo.jpg').resize(32, 32, { fit: 'cover' }).png().toFile('images/favicon-32.png');
console.log('favicons done');
