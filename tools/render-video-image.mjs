// tools/render-video-image.mjs: rendert ein Videobild.
//
// Aufruf:    node tools/render-video-image.mjs <quelle.html> <ziel.jpg|.png> [--full|--square]
// Formate:   Standard 1080x960 (obere Hälfte im Split-Screen),
//            --full 1080x1920 (Hochformat), --square 1080x1080 (Kachel)
// Ziel .png: transparenter Hintergrund (Seite ohne eigenen Hintergrund), zum Überlagern
// Pipeline:  HTML (Assets relativ daneben) -> headless Chrome (Playwright)
//            -> Screenshot -> JPEG q92 in doppelter Auflösung
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const full = args.includes('--full');
const square = args.includes('--square');
const [src, out] = args.filter((a) => !a.startsWith('--'));
if (!src || !out) {
  console.error('Aufruf: node tools/render-video-image.mjs <quelle.html> <ziel.jpg> [--full]');
  process.exit(1);
}
const { chromium } = await import('playwright-core');
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--disable-gpu', '--force-color-profile=srgb', '--allow-file-access-from-files'],
});
try {
  const viewport = { width: 1080, height: full ? 1920 : square ? 1080 : 960 };
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(resolve(src)).href, { waitUntil: 'networkidle' });
  await page.screenshot(out.endsWith('.png')
    ? { path: out, type: 'png', omitBackground: true }
    : { path: out, type: 'jpeg', quality: 92 });
  console.log('gerendert:', out);
} finally {
  await browser.close();
}
