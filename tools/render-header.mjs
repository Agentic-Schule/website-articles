// tools/render-header.mjs — rendert das Header-Bild eines Artikel-Ordners.
//
// Aufruf:    node tools/render-header.mjs blog/<artikel-ordner>
// Pipeline:  header.src.html (+ Assets im Ordner) -> headless Chrome (Playwright)
//            -> Screenshot -> header.jpg (2400x1350, JPEG q92)
//
// Konventionen im Artikel-Ordner:
//   header.src.html   Pflicht: die Komposition, 1200x675, Assets relativ referenziert
//   mac-mini-m4.svg   optional: existiert die Datei UND ein <div class="mini"> in der
//                     Komposition, wird das SVG zur Render-Zeit injiziert (Mac-mini-Artikel)
//
// Hinweis: Der Site-Build kopiert Artikel-Ordner KOMPLETT nach dist/ (nur die README.md
// wird entfernt, jpg/png werden zu WebP). Die Quelldateien im Ordner werden also mit
// veröffentlicht; dieses Skript liegt deshalb bewusst außerhalb der Artikel-Ordner.
//
// Voraussetzung: playwright-core (z. B. `npm i playwright-core`; steckt auch im
// npx-Cache von @playwright/mcp) und Google Chrome (channel: "chrome").
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const folder = resolve(process.argv[2] ?? '.');
const src = join(folder, 'header.src.html');
if (!existsSync(src)) {
  console.error(`Kein header.src.html in ${folder}`);
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
  // networkidle wartet auch auf per CSS geladene Assets (z. B. eine claude.svg-Maske)
  await page.goto(pathToFileURL(src).href, { waitUntil: 'networkidle' });
  const miniSvg = join(folder, 'mac-mini-m4.svg');
  if (existsSync(miniSvg) && await page.$('.mini')) {
    await page.evaluate((svg) => { document.querySelector('.mini').innerHTML = svg; }, readFileSync(miniSvg, 'utf8'));
  }
  await page.waitForTimeout(350); // Reserve fuers Compositing nach networkidle
  await page.screenshot({ path: join(folder, 'header.jpg'), type: 'jpeg', quality: 92 });
} finally {
  await browser.close();
}
console.log('header.jpg regeneriert:', join(folder, 'header.jpg'));
