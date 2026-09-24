---
name: social-post
description: "Erstellt für einen Tag der 30-Tage-Serie das Video-Skript, das Kommentar-Keyword und kopierfertige Posts für YouTube Shorts, Instagram, TikTok und LinkedIn. Nutzen, wenn Johannes einen Artikel promoten will, z. B. „/social-post 2“, „/social-post malicious-ai-skills“, „social media für Tag 3“ oder „make the posts for today's article“."
---

# /social-post

Promotion eines Artikels der agentic.schule-Serie. Maßstab ist **`docs/social-media.md`**; lies die Datei vollständig, bevor du irgendetwas entwirfst. Sie enthält Ton, Skript-Muster, Plattform-Vorlagen und die Faktenregel.

## Eingabe

Das Argument ist entweder eine **Tagesnummer** (`2`, `day 2`) oder ein **Slug** (`malicious-ai-skills`). Ohne Argument gilt der heutige Tag.

- Tagesnummer → Artikel: Tag N erscheint am 2026-09-23 plus (N − 1) Tage. Suche den `-EN`-Ordner, dessen `published:` diesem Datum entspricht.
- Slug → Tag: aus `published:` des gefundenen Ordners zurückrechnen.
- Liegt der Artikel noch auf einem offenen Branch und nicht auf `main`, sag das und frag, ob du trotzdem entwerfen sollst.

## Ablauf

1. **Artikel lesen:** `blog/<slug>-EN/README.md` komplett. Gibt es keine EN-Fassung, melde das; die Videos sind nur englisch, ohne EN-Artikel gibt es keinen Post.
2. **Reel-Banner prüfen:** Existiert `blog/<slug>-EN/header-reel.png`, und passen Titel und „Day N/30" in `header-reel.src.html` zum Artikel und zum Tag? Fehlt es oder stimmt etwas nicht, nach `docs/banner.md` bauen bzw. korrigieren, mit `node tools/render-reel.mjs blog/<slug>-EN` rendern und das Bild ansehen, bevor du weitermachst.
3. **Entwerfen**, gemäß `docs/social-media.md`:
   - Kommentar-Keyword (ein, zwei Wörter).
   - Video-Skript, etwa 30 Sekunden, einfache Wörter, kurze Sätze. Die Vorstellung der Firma nur an Tag 1.
   - YouTube-Shorts-Titel und -Beschreibung, Instagram-Caption, TikTok-Caption, LinkedIn-Post samt erstem Kommentar.
   - Link: `https://agentic.schule/en/blog/<slug>`.
4. **Faktencheck:** Jede Aussage in Skript und Posts muss im Artikel stehen. Zahlen, Namen und Zuspitzungen einzeln gegen den Artikeltext abgleichen. Was der Artikel nicht deckt, fliegt raus oder wird entschärft.
5. **Vorlegen:** Ein kopierfertiger Block pro Element (Keyword, Skript, YouTube, Instagram, TikTok, LinkedIn, LinkedIn-Kommentar), dazu der Link und der Pfad zum Reel-Banner mit der Video-Platzierung (y = 1312 bis 2528).

## Grenzen

- **Artikel nicht ändern.** Fällt ein Fehler im Artikel auf, nenne ihn mit Datei und Zeile; behoben wird er in einer Artikel-Sitzung.
- **Nichts veröffentlichen.** Keine Posts, keine Uploads, keine Nachrichten nach außen. Johannes postet selbst.
- Änderungen am Reel-Banner (Schritt 2) nur nach Rückfrage committen.
