# agentic.schule — Blog-Artikel

Markdown-Quellen für den Blog auf [agentic.schule](https://agentic.schule/blog).

## Aufbau

- Ein Ordner pro Artikel: `blog/YYYY-MM-slug/README.md` + Bild-Assets daneben.
- Frontmatter wie bei `angular-schule/website-articles` (gleicher Build-Stack,
  das `build/`-Submodul zeigt auf `angular-schule/website-articles-build`).
- Die GitHub Action baut bei jedem Push auf `main` (und täglich per Cron) das
  `dist/` und deployt es in den `gh-pages`-Branch dieses Repos:
  `https://agentic-schule.github.io/website-articles`

## Besonderheit: Zwei Quellen

Der Zwei-Quellen-Merge lebt in der **Website** (agentic-schule-website,
`BlogService`): Sie lädt dieses Repo komplett UND zusätzlich die
`list.json` von `angular-schule/website-articles`, gefiltert auf Artikel
mit **Johannes Hoppe** als `author`/`author2` und dem Keyword **`AI`**
(die keywords stehen dafür seit Build-Tool-Commit `190223c` in der
Light-Liste). Dieses Repo baut also nur die eigenen Artikel.

## Lokal bauen

```bash
git submodule update --init --recursive
cd build && npm install && npm run build
cd .. && node scripts/merge-angular-articles.mjs
```
