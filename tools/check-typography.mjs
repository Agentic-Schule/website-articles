// Verbotene Zeichen in den Artikeln (CLAUDE.md, „Kein Mittelpunkt (·)“): Der Mittelpunkt gilt als
// typisches Merkmal maschinell geschriebener Texte. Geprüft werden alle Markdown-Dateien unter blog/.
// Ausgenommen sind Code-Blöcke und Inline-Code: Dort stehen wörtlich zitierte Programmausgaben, die
// den Punkt selbst enthalten. Bei einem Fund bricht der Build ab.
//
//   node tools/check-typography.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FORBIDDEN = { '·': 'Mittelpunkt' };

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, files);
    else if (name.endsWith('.md')) files.push(full);
  }
  return files;
}

const hits = [];
for (const file of walk(path.join(ROOT, 'blog'))) {
  let fence = null;
  fs.readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      const marker = line.match(/^\s*(```|~~~)/)?.[1];
      if (marker && (!fence || fence === marker)) {
        fence = fence ? null : marker;
        return;
      }
      if (fence) return;
      const prose = line.replace(/(`+)[\s\S]*?\1/g, '');
      for (const [ch, label] of Object.entries(FORBIDDEN)) {
        if (prose.includes(ch)) hits.push(`${path.relative(ROOT, file)}:${i + 1}: ${label} „${ch}“`);
      }
    });
}
if (hits.length) {
  console.error(`check-typography: ${hits.length} verbotene Zeichen (Ausnahme nur in Code):\n  ` + hits.join('\n  '));
  process.exit(1);
}
console.log('check-typography: keine verbotenen Zeichen.');
