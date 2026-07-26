#!/usr/bin/env node
// header.render.mjs — regeneriert header.jpg aus header.src.html.
// Pipeline: HTML/CSS/SVG -> headless Chrome (Playwright) -> Screenshot -> JPG (2400x1350).
//
// Quelldateien in diesem Ordner (werden vom Site-Build ignoriert, nur README.md wird zum Artikel):
//   header.src.html  - die Komposition (Titeltext, Git-Stamm mit drei Terminal-Spuren)
//   claude.svg       - Claude-Logo, als CSS-mask genutzt und in Coral eingefaerbt (ein Agent je Spur)
//
// Ausfuehren:  node header.render.mjs
// Voraussetzung: playwright-core (z. B. `npm i playwright-core`; steckt auch im npx-Cache von
//                @playwright/mcp) und Google Chrome (channel: "chrome").
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const { chromium } = await import('playwright-core');

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--disable-gpu', '--force-color-profile=srgb', '--hide-scrollbars', '--allow-file-access-from-files'],
});
try {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 675 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  // networkidle wartet auch auf die per CSS-mask geladene claude.svg
  await page.goto(pathToFileURL(join(here, 'header.src.html')).href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350); // kleine Reserve fuers Compositing
  await page.screenshot({ path: join(here, 'header.jpg'), type: 'jpeg', quality: 92 });
} finally {
  await browser.close();
}
console.log('header.jpg regeneriert');
