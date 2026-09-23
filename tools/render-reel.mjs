// tools/render-reel.mjs — rendert das Reel-Banner (9:16) eines Artikel-Ordners.
//
// Aufruf:    node tools/render-reel.mjs blog/<artikel-ordner>
// Pipeline:  header-reel.src.html (+ logo-agentic-schule.png daneben) -> headless
//            Chrome (Playwright) -> Screenshot -> header-reel.png (2160x3840, PNG)
//
// Das Reel-Banner ist der Hochformat-Hintergrund fürs Video-Overlay (Instagram
// Reels / TikTok). Die mittlere 16:9-Zone bleibt frei, dort liegt später das Video.
// Vorgaben und Layout: docs/banner.md, Abschnitt „Reel-Banner (9:16)".
//
// Voraussetzung: playwright-core (`cd tools && npm install`) und Google Chrome.
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const folder = resolve(process.argv[2] ?? '.');
const src = join(folder, 'header-reel.src.html');
if (!existsSync(src)) {
  console.error(`Kein header-reel.src.html in ${folder}`);
  process.exit(1);
}

const { chromium } = await import('playwright-core');
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--disable-gpu', '--force-color-profile=srgb', '--allow-file-access-from-files'],
});
try {
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(src).href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  await page.screenshot({ path: join(folder, 'header-reel.png'), type: 'png' });
} finally {
  await browser.close();
}
console.log('header-reel.png regeneriert:', join(folder, 'header-reel.png'));
