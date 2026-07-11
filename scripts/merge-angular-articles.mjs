#!/usr/bin/env node
/**
 * Mischt Blogposts der angular.schule in unser dist/:
 *   Übernommen wird, was (1) Johannes Hoppe als author ODER author2 hat
 *   UND (2) das Keyword "AI" in den Frontmatter-keywords trägt.
 *
 * Läuft NACH dem regulären Build (build/npm run build) und arbeitet direkt
 * auf dist/blog/. Bilder der übernommenen Artikel werden nicht kopiert —
 * der %%MARKDOWN_BASE_URL%%-Platzhalter wird stattdessen auf die absolute
 * angular.schule-Quelle festgenagelt (die Website reicht absolute URLs durch).
 * Bei Slug-Kollision gewinnt der lokale Artikel aus diesem Repo.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ANGULAR_BASE = 'https://angular-schule.github.io/website-articles';
const AUTHOR = 'Johannes Hoppe';
const KEYWORD = 'ai'; // case-insensitive verglichen

const DIST_BLOG = path.resolve('dist/blog');

/** Sortierung identisch zum Build-Tool (base.utils.ts compareEntries):
 *  1. sortKey aufsteigend, 2. sticky zuerst, 3. published absteigend, 4. Slug absteigend. */
function compareEntries(a, b) {
  const aKey = a.meta.sortKey ?? '';
  const bKey = b.meta.sortKey ?? '';
  if (aKey !== bKey) return aKey < bKey ? -1 : 1;
  const aSticky = a.meta.sticky ? 1 : 0;
  const bSticky = b.meta.sticky ? 1 : 0;
  if (aSticky !== bSticky) return bSticky - aSticky;
  if (a.meta.published !== b.meta.published) return a.meta.published < b.meta.published ? 1 : -1;
  return a.slug < b.slug ? 1 : -1;
}

function absolutizeHeader(meta, slug) {
  if (meta.header?.url && !/^https?:\/\//.test(meta.header.url)) {
    meta.header.url = `${ANGULAR_BASE}/blog/${slug}/${meta.header.url}`;
  }
}

const ownList = JSON.parse(await readFile(path.join(DIST_BLOG, 'list.json'), 'utf8'));
const ownSlugs = new Set(ownList.map(e => e.slug));

const listRes = await fetch(`${ANGULAR_BASE}/blog/list.json`);
if (!listRes.ok) throw new Error(`angular-schule list.json: HTTP ${listRes.status}`);
const angularList = await listRes.json();

const candidates = angularList.filter(e =>
  (e.meta.author === AUTHOR || e.meta.author2 === AUTHOR) && !ownSlugs.has(e.slug)
);

const adopted = [];
for (const candidate of candidates) {
  const entryRes = await fetch(`${ANGULAR_BASE}/blog/${candidate.slug}/entry.json`);
  if (!entryRes.ok) {
    console.warn(`  ⚠ ${candidate.slug}: entry.json HTTP ${entryRes.status} — übersprungen`);
    continue;
  }
  const entry = await entryRes.json();
  const keywords = (entry.meta.keywords ?? []).map(k => String(k).toLowerCase());
  if (!keywords.includes(KEYWORD)) continue;

  // Assets bleiben bei angular.schule — Platzhalter absolut machen
  entry.html = entry.html.replaceAll('%%MARKDOWN_BASE_URL%%', ANGULAR_BASE);
  absolutizeHeader(entry.meta, entry.slug);

  const listEntry = structuredClone(candidate);
  listEntry.html = listEntry.html.replaceAll('%%MARKDOWN_BASE_URL%%', ANGULAR_BASE);
  absolutizeHeader(listEntry.meta, listEntry.slug);

  await mkdir(path.join(DIST_BLOG, entry.slug), { recursive: true });
  await writeFile(path.join(DIST_BLOG, entry.slug, 'entry.json'), JSON.stringify(entry));
  adopted.push(listEntry);
}

const merged = [...ownList, ...adopted].sort(compareEntries);
await writeFile(path.join(DIST_BLOG, 'list.json'), JSON.stringify(merged));

console.log(`Eigene Artikel: ${ownList.length}`);
console.log(`Aus angular-schule übernommen (${AUTHOR} + Keyword "${KEYWORD}"): ${adopted.length}`);
adopted.forEach(e => console.log(`  + ${e.slug}`));
