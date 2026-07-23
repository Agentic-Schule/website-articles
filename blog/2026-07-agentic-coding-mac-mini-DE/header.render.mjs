#!/usr/bin/env node
// header.render.mjs — regeneriert header.jpg aus header.src.html.
// Pipeline: HTML/CSS/SVG -> headless Chrome (Playwright) -> Screenshot -> JPG (2400x1350).
//
// Quelldateien in diesem Ordner (werden vom Site-Build ignoriert, nur README.md wird zum Artikel):
//   header.src.html  - die Komposition (Titeltext, Claude-Logo via CSS-mask, Mac mini, Orbit, Signal-Punkte)
//   claude.svg       - Claude-Logo, als CSS-mask genutzt und in Coral eingefaerbt
//   mac-mini-m4.svg  - Mac mini M4, CC0 (Wikimedia Commons, "LoMit"), zur Render-Zeit in .mini injiziert
//
// Ausfuehren:  node header.render.mjs
// Voraussetzung: playwright-core (z. B. `npm i playwright-core`; steckt auch im npx-Cache von
//                @playwright/mcp) und Google Chrome (channel: "chrome").
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const { chromium } = await import('playwright-core');

const mini = readFileSync(join(here, 'mac-mini-m4.svg'), 'utf8');
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--disable-gpu', '--force-color-profile=srgb', '--hide-scrollbars', '--allow-file-access-from-files'],
});
const ctx = await browser.newContext({ viewport: { width: 1200, height: 675 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('file://' + join(here, 'header.src.html'));
await page.evaluate((svg) => { document.querySelector('.mini').innerHTML = svg; }, mini);
await page.waitForTimeout(350);
await page.screenshot({ path: join(here, 'header.jpg'), type: 'jpeg', quality: 92 });
await browser.close();
console.log('header.jpg regeneriert');
