// tools/render-video-image.mjs: rendert ein Bild für die obere Videohälfte (Split-Screen).
//
// Aufruf:    node tools/render-video-image.mjs <quelle.html> <ziel.jpg>
// Pipeline:  HTML (1080x960, Assets relativ daneben) -> headless Chrome (Playwright)
//            -> Screenshot -> JPEG q92 in doppelter Auflösung (2160x1920)
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [src, out] = process.argv.slice(2);
if (!src || !out) {
  console.error('Aufruf: node tools/render-video-image.mjs <quelle.html> <ziel.jpg>');
  process.exit(1);
}
const { chromium } = await import('playwright-core');
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--disable-gpu', '--force-color-profile=srgb', '--allow-file-access-from-files'],
});
try {
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 960 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(resolve(src)).href, { waitUntil: 'networkidle' });
  await page.screenshot({ path: out, type: 'jpeg', quality: 92 });
  console.log('gerendert:', out);
} finally {
  await browser.close();
}
