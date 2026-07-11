---
title: 'Lorem Ipsum — der Testartikel'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
published: 2026-07-11
keywords:
  - Test
  - Lorem Ipsum
language: de
---

**Lorem ipsum dolor sit amet, consectetur adipiscing elit.** Dieser Artikel
existiert nur, um die Blog-Pipeline der agentic.schule zu testen — vom
Markdown über den Build bis zum Rendering.

<hr>

## Was hier getestet wird

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

- Frontmatter-Parsing (Titel, Autor, Datum, Sprache)
- Markdown zu HTML
- Code-Highlighting
- Listen und Überschriften

## Ein bisschen Code

```typescript
export function loremIpsum(dolor: string): string {
  return `sit amet ${dolor}`;
}
```

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
eu fugiat nulla pariatur. :rocket:
