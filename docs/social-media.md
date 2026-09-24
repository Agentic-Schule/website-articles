# Social Media: Artikel promoten (Reels und Posts)

Jeder Artikel der Serie bekommt ein kurzes Video und Posts für YouTube Shorts, Instagram, TikTok und LinkedIn. Diese Arbeit läuft in einer eigenen Sitzung. Dort werden die Artikel nur gelesen, nie geändert. Fällt beim Lesen ein Fehler im Artikel auf, wird er notiert und in einer Artikel-Sitzung behoben.

Der Skill `/social-post` (siehe `.claude/skills/social-post/SKILL.md`) führt durch den Ablauf unten.

## Die Serie

- **30 Tage, jeden Tag ein Artikel.** Das Motto im Video: „one new article about AI for developers, every day, 30 days in a row".
- **Der Tag ergibt sich aus dem Erscheinungsdatum:** Tag N = Anzahl Tage seit dem 2026-09-23 plus 1, berechnet aus `published:` im Frontmatter. Der 2026-09-23 ist also Tag 1, der 2026-10-01 Tag 9.
- Welcher Artikel an welchem Tag erscheint, steht damit allein im Frontmatter. Eine separate Liste gibt es nicht.

## Sprache und Ton

- **Videos und Posts sind englisch.** Auch Deutsche lesen Englisch, umgekehrt funktioniert es nicht.
- **Einfache Wörter, kurze Sätze.** Johannes spricht die Skripte selbst, als Nicht-Muttersprachler. Keine Redewendungen, keine Wörter, die man nicht spontan so sagen würde.
- **„AI" ist das Buzzword.** Wo es passt, steht „AI" im Hook, im Titel oder in der Caption.
- **Zugespitzt, aber wahr.** Jede Aussage muss der Artikel decken. Ein Beispiel für die Grenze: Die Sicherheitsfirma im Day-1-Artikel hat tatsächlich die Kontrolle über zehntausende Agenten übernommen, das darf gesagt werden. „Still infecting computers right now" geht dagegen weiter als der Artikel, denn die Nutzlast wurde bewusst harmlos gehalten; „still live" oder „still spreading" ist gedeckt.
- Souverän statt marktschreierisch, wie in den Artikeln selbst (siehe `CLAUDE.md`).

## Das Video-Skript

Etwa 30 Sekunden, direkt in die Kamera. Aufbau:

1. **Einstieg:** nur an Tag 1 die Vorstellung (neue Firma, 30 Tage, ein Artikel pro Tag). Ab Tag 2 direkt „Day N" und das Thema.
2. **Hook:** ein konkreter, überraschender Fakt aus dem Artikel, in zwei, drei kurzen Sätzen.
3. **Versprechen:** was der Artikel zeigt und was man danach kann.
4. **Aufruf:** „Comment ‚\<keyword\>' and I'll send you the link." und „Follow me so you don't miss tomorrow's article."

Das finale Skript von Tag 1 als Referenz:

```
Hi, I'm Johannes. I started a new company, and I'll post one new article
about AI for developers every day, 30 days in a row.

So, this is day one. I'll show you an attack that uses AI skills and is
still live right now. I'll show you how it works, and how to protect yourself.

Interested? Comment "evil skills" and I'll send you the link.
Follow me so you don't miss tomorrow's article.
```

## Das Kommentar-Keyword

- Ein oder zwei Wörter aus dem Thema des Artikels, leicht zu tippen, z. B. „evil skills".
- Dasselbe Keyword auf allen Plattformen.
- Wer es kommentiert, bekommt den Link per DM (auf Instagram per Automatisierung, sonst von Hand).

## Das Reel-Banner

- Datei: `header-reel.png` im `-EN`-Ordner des Artikels, 2160 × 3840 PNG. Gerendert aus `header-reel.src.html` mit `node tools/render-reel.mjs blog/<ordner>`. Aufbau, Farben und Vorlage stehen in [`docs/banner.md`](banner.md), Abschnitt „Reel-Banner (9:16)".
- **Video-Platzierung für den Schnitt:** das Querformat-Video (16:9) auf volle Breite, 2160 × 1215, von **y = 1312 bis y = 2528**.
- **Das untere Band bleibt frei.** Dort liegen die eingebrannten Untertitel. Keine weitere Schrift ins Banner.
- Fehlt das Reel-Banner für einen Artikel, wird es in der Social-Media-Sitzung nach `docs/banner.md` gebaut, gerendert und geprüft, bevor es rausgeht.

## Links

- Englisch: `https://agentic.schule/en/blog/<slug>`
- Deutsch: `https://agentic.schule/blog/<slug>`
- `<slug>` ist der Ordnername ohne `-EN`/`-DE`, z. B. `2026-09-malicious-ai-skills`. Alle Slugs sind englisch; alte deutsche Slugs leiten über `redirects.json` weiter, werden in Posts aber nicht mehr verwendet.
- In Posts immer den englischen Link.

## Die Plattformen

Überall dasselbe Hochformat-Video; nur Text und Link-Platzierung unterscheiden sich.

| Plattform | Link steht … | Besonderheit |
| --- | --- | --- |
| YouTube Shorts | in der Beschreibung und im angepinnten Kommentar | Titel unter 100 Zeichen, `#Shorts` |
| Instagram Reels | per DM über das Keyword, zusätzlich in der Bio | Captions sind nicht klickbar |
| TikTok | in der Bio | Caption kurz halten |
| LinkedIn | im **ersten Kommentar**, nie im Post selbst | Video **nativ hochladen**, 3 bis 5 Hashtags |

LinkedIn unterstützt native Videos, auch im Hochformat. Externe Links im Post-Text kosten dort Reichweite, deshalb gehört der Link in den ersten Kommentar.

### Vorlagen

**YouTube Shorts**

```
Title: <Hook in wenigen Wörtern> (Day N/30)

Description:
Day N of 30: one new article about AI for developers, every single day.

<2 bis 3 Sätze Hook aus dem Artikel>

Full article: https://agentic.schule/en/blog/<slug>
Subscribe, a new one drops tomorrow.

#Shorts #AI #AIAgents #DeveloperTools <2 bis 3 Themen-Hashtags>
```

**Instagram Reels**

```
Day N/30 <Emoji> <Hook in einer Zeile>

<2 bis 3 Sätze Hook aus dem Artikel>

💬 Comment "<keyword>" and I'll send you the link.
➕ Follow so you don't miss tomorrow: one AI article for devs, 30 days straight.

#AI #AgenticAI #AIAgents #SoftwareDevelopment #DevTools #Coding <2 bis 4 Themen-Hashtags>
```

**TikTok**

```
<Hook in einer Zeile> Day N/30: one AI article for devs, every day. Comment "<keyword>" for the link 👇

#AI #AgenticAI #Coding #TechTok #Developer <2 bis 3 Themen-Hashtags>
```

**LinkedIn** (Post plus erster Kommentar)

```
<Hook-Satz>

<3 bis 5 kurze Absätze: worum es geht, der eine überraschende Fakt,
was der Artikel zeigt>

👇 Link in the comments. Follow along, a new article every day.

#AI #SoftwareDevelopment #AIAgents <1 bis 2 Themen-Hashtags>
```

```
Erster Kommentar: Full article 👉 https://agentic.schule/en/blog/<slug>
```

Auf LinkedIn darf der Ton etwas sachlicher und ausführlicher sein als auf den anderen Plattformen.

## Faktenregel

Posts und Skripte enthalten nur, was im Artikel steht. Die Artikel sind an Primärquellen geprüft; neue Zahlen, Namen oder Behauptungen kommen in Posts nicht hinzu. Vor der Freigabe wird jede Aussage gegen den Artikeltext abgeglichen.

## Ablauf einer Sitzung

1. Tag bestimmen und den passenden Artikel finden (Frontmatter `published:`).
2. Die englische Fassung (`-EN/README.md`) komplett lesen.
3. Prüfen, ob `header-reel.png` existiert und zum aktuellen Titel passt.
4. Keyword, Video-Skript und die vier Plattform-Texte entwerfen.
5. Jede Aussage gegen den Artikel prüfen.
6. Alles Johannes zur Freigabe vorlegen, einen Block pro Plattform, kopierfertig.

Veröffentlicht wird von Hand. Die Sitzung postet selbst nichts.
