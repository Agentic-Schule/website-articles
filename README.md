# agentic.schule: Blog-Artikel

Markdown-Quellen für den Blog auf [agentic.schule](https://agentic.schule/blog).

## Aufbau

- Ein Ordner pro Artikel: `blog/YYYY-MM-slug/README.md` + Bild-Assets daneben.
- Frontmatter wie bei `angular-schule/website-articles` (gleicher Build-Stack,
  das `build/`-Submodul zeigt auf `angular-schule/website-articles-build`).
- Die GitHub Action baut bei jedem Push auf `main` das `dist/` und deployt es in
  den `gh-pages`-Branch dieses Repos: `https://agentic-schule.github.io/website-articles`

## Besonderheit: Zwei Quellen

Der Zwei-Quellen-Merge lebt in der **Website** (agentic-schule-website,
`BlogService`): Sie lädt dieses Repo komplett UND zusätzlich die
`list.json` von `angular-schule/website-articles`, gefiltert auf Artikel
mit dem Keyword **`AI`**, bei denen Johannes Hoppe oder einer der
Team-Accounts (Co-)Autor ist (Details: `BlogService` in der Website). Dieses Repo baut also nur die eigenen Artikel.

## Übersetzungen (-DE/-EN-Konvention)

Ein Artikel darf in zwei Sprachfassungen vorliegen. Dann enden die
Ordnernamen mit Suffix, exakt in Großbuchstaben:

- `blog/2026-08-mein-artikel-DE/` (deutsche Fassung, `language: de`)
- `blog/2026-08-mein-artikel-EN/` (englische Fassung, `language: en`)

Die Website zeigt im deutschen Build nur die -DE-Fassung, im englischen
nur die -EN-Fassung. In der URL erscheint der Slug ohne Suffix, beide
Sprachen teilen sich dieselbe Adresse. Bilder referenzieren wie immer
relativ, sie liegen im jeweiligen Ordner (der echte Slug mit Suffix
bleibt intern erhalten). Artikel ohne Suffix gelten für beide Sprachen.

## Lokal bauen

```bash
git submodule update --init --recursive
cd build && npm install && npm run build
```
