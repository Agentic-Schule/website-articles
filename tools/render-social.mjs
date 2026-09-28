// tools/render-social.mjs — rendert das Social-Bild (LinkedIn/X) eines Artikel-Ordners.
//
// Aufruf:    node tools/render-social.mjs blog/<artikel-ordner>
// Pipeline:  social.src.html (1200x675, Assets relativ daneben) -> headless Chrome
//            (Playwright) -> Screenshot -> social.jpg (2400x1350, JPEG q92)
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const folder = resolve(process.argv[2] ?? '.');
const src = join(folder, 'social.src.html');
if (!existsSync(src)) {
  console.error(`Kein social.src.html in ${folder}`);
  process.exit(1);
}
const { chromium } = await import('playwright-core');
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--disable-gpu', '--force-color-profile=srgb', '--allow-file-access-from-files'],
});
try {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 675 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(src).href, { waitUntil: 'networkidle' });
  await page.screenshot({ path: join(folder, 'social.jpg'), type: 'jpeg', quality: 92 });
  console.log('social.jpg gerendert:', join(folder, 'social.jpg'));
} finally {
  await browser.close();
}
