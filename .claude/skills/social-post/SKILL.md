---
name: social-post
description: "Erstellt für einen Tag der 30-Tage-Serie den deutschen LinkedIn-Post, den englischen X-Post, das englische Video-Skript samt Kommentar-Keyword und die Captions für TikTok, Instagram und YouTube Shorts. Nutzen, wenn Johannes einen Artikel promoten will, z. B. „/social-post 2“, „/social-post malicious-ai-skills“, „social media für Tag 3“ oder „make the posts for today's article“."
---

# /social-post

Promotion eines Artikels der agentic.schule-Serie. Maßstab ist **`docs/social-media.md`**; lies die Datei vollständig, bevor du irgendetwas entwirfst. Sie enthält Sprachregeln, Plattform-Regeln, Skript-Muster, Vorlagen, das Tag-1-Beispiel und die Faktenregel.

## Eingabe

Das Argument ist entweder eine **Tagesnummer** (`2`, `day 2`) oder ein **Slug** (`malicious-ai-skills`). Ohne Argument gilt der heutige Tag.

- Tagesnummer → Artikel: Tag N erscheint am 2026-09-23 plus (N − 1) Tage. Suche die Ordner, deren `published:` diesem Datum entspricht.
- Slug → Tag: aus `published:` des gefundenen Ordners zurückrechnen.
- Liegt der Artikel noch auf einem offenen Branch und nicht auf `main`, sag das und frag, ob du trotzdem entwerfen sollst.

## Ablauf

1. **Artikel lesen:** `blog/<slug>-EN/README.md` komplett, dazu `blog/<slug>-DE/README.md` für den LinkedIn-Post. Fehlt eine Fassung, melde das. Ohne EN-Fassung gibt es kein Video und keinen X-Post, ohne DE-Fassung keinen LinkedIn-Post.
2. **Den Kern finden:** das eine Stück echtes Material, an dem sich der Trick zeigen lässt (z. B. zwei Zeilen einer Datei, ein Befehl, eine Ausgabe). Daraus wird das Rätsel: „Ich wette, du hättest es nicht gefunden."
3. **Entwerfen**, gemäß `docs/social-media.md` (Tag 1 dort ist das Muster):
   - LinkedIn-Post (DE), Link auf die `-DE`-Fassung, eingeleitet mit „Den ganzen Artikel liest du hier:".
   - X-Post (EN), höchstens 280 Zeichen (Link zählt 23, Emoji 2; nachzählen), eingeleitet mit „Read the full article here:".
   - Kommentar-Keyword (ein, zwei Wörter), Video-Skript (EN, etwa 25 Sekunden, Rätsel-Form) und Drehplan als Tabelle: Sekunde, Bild (Gesicht oder Bildschirm), Ton.
   - Captions für Instagram und TikTok, optional Titel und Beschreibung für YouTube Shorts.
   - Kurz halten und kein Hand-Emoji als Link-Hinweis. Gefährliche Adressen entschärfen (`[.]`).
4. **Faktencheck:** Jede Aussage muss in der jeweiligen Sprachfassung des Artikels stehen. Zahlen, Namen und Zuspitzungen einzeln gegen den Artikeltext abgleichen. Zitate und Zeilennummern gegen die verlinkte Quelle prüfen, zeitabhängige Aussagen („bis heute", „still live") gegen den aktuellen Stand, etwa per `gh`. Was nicht gedeckt ist, fliegt raus oder wird entschärft.
5. **Stil prüfen:** Der deutsche Post folgt `CLAUDE.md` (duzen, kurze Sätze, keine Gedankenstriche, keine „nicht X, sondern Y"-Antithese, echte Umlaute). Die englischen Texte nutzen einfache Wörter, die Johannes spontan so sagen würde.
6. **Vorlegen:** Ein kopierfertiger Block pro Element (LinkedIn, X, Keyword, Video-Skript mit Drehplan, Instagram, TikTok, optional YouTube Shorts), dazu die beiden Links und der Pfad zum Header-Bild der `-DE`-Fassung für LinkedIn.

## Grenzen

- **Artikel nicht ändern.** Fällt ein Fehler im Artikel auf, nenne ihn mit Datei und Zeile; behoben wird er in einer Artikel-Sitzung.
- **Nichts veröffentlichen.** Keine Posts, keine Uploads, keine Nachrichten nach außen. Johannes postet selbst.
