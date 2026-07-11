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

Nach dem regulären Build läuft `scripts/merge-angular-articles.mjs` und mischt
zusätzlich alle Blogposts von `angular-schule/website-articles` hinein, bei denen

1. **Johannes Hoppe** als `author` oder `author2` eingetragen ist **und**
2. das Keyword **`AI`** in den Frontmatter-`keywords` vorkommt.

Bilder dieser übernommenen Artikel werden nicht kopiert, sondern absolut von
`angular-schule.github.io` verlinkt. Bei Slug-Kollisionen gewinnt der lokale
Artikel aus diesem Repo. Der tägliche Cron sorgt dafür, dass neue AI-Posts
der angular.schule automatisch auftauchen.

## Lokal bauen

```bash
git submodule update --init --recursive
cd build && npm install && npm run build
cd .. && node scripts/merge-angular-articles.mjs
```
