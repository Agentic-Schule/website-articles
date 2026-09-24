# Social Media: Artikel promoten

Jeder Artikel der Serie wird auf LinkedIn, X, TikTok und Instagram beworben, optional zusätzlich auf YouTube Shorts. Diese Arbeit läuft in einer eigenen Sitzung. Dort werden die Artikel nur gelesen, nie geändert. Fällt beim Lesen ein Fehler im Artikel auf, wird er notiert und in einer Artikel-Sitzung behoben.

Der Skill `/social-post` (siehe `.claude/skills/social-post/SKILL.md`) führt durch den Ablauf unten. Die Belege für jede Regel stehen am Ende dieses Dokuments.

## Die Serie

- **30 Tage, jeden Tag ein Artikel** über AI für Entwickler.
- **Der Tag ergibt sich aus dem Erscheinungsdatum:** Tag N = Anzahl Tage seit dem 2026-09-23 plus 1, berechnet aus `published:` im Frontmatter. Der 2026-09-23 ist also Tag 1, der 2026-10-01 Tag 9.
- Welcher Artikel an welchem Tag erscheint, steht damit allein im Frontmatter. Eine separate Liste gibt es nicht.

## Grundregeln

- **Der Hook kommt zuerst.** Fast alle, die einen Post oder ein Reel sehen, folgen dir nicht und kennen die Serie nicht. Keine Vorstellung, kein „Tag 1 von 30" am Anfang. Die Serie steht in der Caption.
- **Kurz und auf den Kern.** Ein Post erzählt den Artikel nicht nach. Er setzt das Thema, zeigt den einen Kern und macht neugierig auf die Auflösung.
- **Das bewährte Muster ist das Rätsel:** „X ist beliebt, aber es gibt einen fiesen Trick. Ich wette, du hättest ihn nicht gefunden." Dann das echte Material zeigen, etwa zwei Zeilen aus einer Datei, und fragen: „Wo steckt der Angriff?" Die Auflösung steht im Artikel. Die Leute suchen selbst, und die Antworten in den Kommentaren kommen von allein.
- **Echtes Material statt Platzhalter.** Wörtliche Zitate, echte Zeilennummern, echte Namen. Ein Platzhalter wie „innocent-looking-domain.com" verrät die Lösung schon im Namen. Gefährliche Adressen werden wie im Artikel entschärft (`stitch-design[.]ai`), damit kein klickbarer Link entsteht.
- **Der Post muss trotzdem für sich stehen.** Reine Neugier ohne Substanz wirkt wie Clickbait. Das gezeigte Material ist der Grund, weiterzulesen.
- **Keine Emojis.** Weder im Post noch in der Caption noch als Text im Video. Vor dem Link steht ein ausgeschriebener Satz: „Den ganzen Artikel liest du hier:" bzw. „Read the full article here:".
- **Zugespitzt, aber wahr.** Jede Aussage muss der Artikel decken. Ein Beispiel für die Grenze: Die Sicherheitsfirma im Day-1-Artikel hat nach eigener Aussage zehntausende Agenten dazu gebracht, ihr Skript auszuführen, das darf gesagt werden. „Still infecting computers right now" geht dagegen weiter als der Artikel, denn die Nutzlast wurde bewusst harmlos gehalten; „still live" oder „still out there" ist gedeckt.
- **Souverän statt marktschreierisch,** wie in den Artikeln selbst (siehe `CLAUDE.md`). Deutsche Posts folgen dem Stil aus `CLAUDE.md`: duzen, kurze Sätze, keine Gedankenstriche, keine „nicht X, sondern Y"-Antithese.

## Sprache: Deutsch für LinkedIn, Englisch für alles andere

- **LinkedIn ist deutsch** und verlinkt die `-DE`-Fassung. Dort sitzen das deutsche Netzwerk und die B2B-Kunden, und die Sprache des Posts ist ein offizielles Ranking-Signal.
- **X, TikTok, Instagram und YouTube Shorts sind englisch** und verlinken die `-EN`-Fassung. Hier geht es um Reichweite über den deutschen Sprachraum hinaus.
- **Ein Video für alle Kurzvideo-Plattformen.** Es wird einmal auf Englisch gedreht und auf TikTok, Instagram und optional YouTube Shorts hochgeladen.
- **Einfache Wörter, kurze Sätze im Video.** Johannes spricht die Skripte selbst, als Nicht-Muttersprachler. Keine Redewendungen, keine Wörter, die man nicht spontan so sagen würde.
- **„AI" ist das Buzzword.** Wo es passt, steht „AI" im Hook oder in der Caption.

## Die Plattformen im Überblick

| Plattform | Sprache | Format | Link | Aufruf |
| --- | --- | --- | --- | --- |
| LinkedIn | DE | Text + `header.jpg` der `-DE`-Fassung | reine URL im Post | echte Frage zum Thema, kein Keyword |
| X | EN | Text, höchstens 280 Zeichen | im Post | keiner |
| TikTok | EN | vertikales Video | keiner klickbar | Keyword, DMs von Hand |
| Instagram Reels | EN | dasselbe Video | per Keyword-DM | Keyword |
| YouTube Shorts (optional) | EN | dasselbe Video | in der Beschreibung, nicht klickbar | Keyword-Kommentare öffentlich mit der URL beantworten |
| Facebook | – | kein eigener Aufwand | – | – |

**Facebook:** Das automatische Crossposting von Instagram nach Facebook bleibt aus. Meta stuft „Kommentiere ein bestimmtes Wort" auf Facebook ausdrücklich als *Comment Baiting* ein und senkt die Reichweite solcher Posts.

## LinkedIn (DE)

- **Vom persönlichen Profil posten.** Posts einer Unternehmensseite erreichen zuerst nur deren Follower.
- **Der Hook steht in den ersten zwei Zeilen,** vor dem „… mehr".
- **Kein Video.** Text plus das Header-Bild der `-DE`-Fassung.
- **Der Link steht als reine URL im Post,** eingeleitet mit „Den ganzen Artikel liest du hier:". Das Header-Bild anhängen, damit keine Link-Vorschaukarte erscheint.
- **Kein „Kommentiere X, dann schicke ich dir den Link".** LinkedIn filtert diese Art Engagement-Köder und verbietet automatisierte Kommentare und Nachrichten.
- **Keine Hashtags.**
- **Die Frage muss echt sein.** Beim Rätsel ist sie es von selbst: „Wo steckt der Angriff?"
- **In der ersten Stunde auf Kommentare antworten.**
- Tägliches Posten ist in Ordnung. LinkedIn empfiehlt mindestens zwei bis drei Posts pro Woche.

## X (EN)

- **Der Post passt in 280 Zeichen** (die Grenze ohne Premium). Links zählen dabei immer 23 Zeichen. Zitate lassen sich mit „…" kürzen, solange der Rest wörtlich bleibt.
- **Der Link steht direkt im Post,** eingeleitet mit „Read the full article here:". X stuft Links nach Aussage der Produktleitung nicht herab, und der veröffentlichte Ranking-Code enthält keine Link-Strafe. Ein Link in einer Antwort bringt nichts: Antworten zeigt X Nicht-Followern im For-You-Feed nicht, und der Schub für kleine Accounts gilt nur für eigenständige Posts.
- **Der Text muss ohne Link tragen.** Link-Posts sammeln weniger Likes und Antworten, weil die Leute auf die Seite wechseln.
- **Kein Video.**

## Das Video (TikTok, Instagram, YouTube Shorts)

### Format

- **Vertikal 9:16, bildfüllend,** mindestens 1080×1920. Keine Ränder, keine Balken, kein Rahmen um ein Querformat-Video. Instagram zeigt Reels mit Rändern seltener, und TikTok nennt Balken ausdrücklich als Problem.
- **Kein Logo, kein Wasserzeichen, kein „Day N/30" im Bild.** Instagram zeigt Reels mit Logos oder Wasserzeichen seltener. Das Branding kommt über das Profil.
- **Etwa 25 Sekunden.**
- **Zwei Bildquellen, harte Schnitte:** das Gesicht für Hook und Schluss, dazwischen der Bildschirm. Das Video zeigt das Material, über das es spricht.
- **Die Bildschirmaufnahme zeigt die echte Quelle,** etwa die Datei auf GitHub, stark gezoomt, damit der Code auf dem Handy lesbar ist. Die entscheidende Stelle wird markiert. Zeilennummern im Bild müssen zum Skript passen.
- **Der Hook steht ab Sekunde 0 zusätzlich als Text im Bild.** Sonst wenig Text: Instagram zeigt Reels seltener, deren Bild überwiegend mit Text bedeckt ist.
- **Ränder frei halten.** Oben, unten und rechts liegt die Oberfläche der Plattformen (Fortschrittsbalken, Caption, Nutzername, Buttons).
- **Sauber exportieren und auf jede Plattform einzeln hochladen.** Kein heruntergeladenes TikTok-Video mit Wasserzeichen auf Instagram. Und auf Instagram nichts erneut hochladen, was dort schon einmal lief; eine neu aufgenommene Fassung ist ein neues Video.

### Untertitel

- **Einmal im Schnitt einbrennen,** im unteren Drittel, aber nicht ganz unten, wo die Plattform-Oberfläche liegt.
- Alle drei Plattformen erzeugen zwar automatische Untertitel per Spracherkennung (Instagram, TikTok, YouTube Shorts; Englisch wird überall unterstützt). Deren Anzeige, Stil und Position bestimmt aber die jeweilige Plattform bzw. der Zuschauer. Eingebrannte Untertitel sehen überall gleich aus und stehen dort, wo sie nicht verdeckt werden.
- **Doppelte Untertitel vermeiden:** vor dem Posten in der Vorschau prüfen. Auf TikTok lassen sich die automatischen Untertitel bearbeiten oder entfernen.

### Skript-Aufbau (Rätsel-Form)

1. **Hook als Wette:** „I bet you won't find this attack", gesprochen und als Text im Bild.
2. **Material zeigen:** Stelle 1, schneller Scroll, Stelle 2. Der Scroll zeigt, wie weit die beiden Teile auseinanderliegen.
3. **Die erste Ebene auflösen.** Wer bis zum Ende schaut, bekommt eine Antwort. Das macht das Video sehenswert und teilbar.
4. **Cliffhanger:** Die zweite Ebene bleibt im Artikel („And if you click it, everything looks fine. How?").
5. **Aufruf:** „Comment ‚\<keyword\>' and I'll send you the article."

Keine Vorstellung („Hi, I'm Johannes …"), kein „Day N" im gesprochenen Text. Wer Johannes ist, steht im Profil.

## Das Kommentar-Keyword

- Ein oder zwei Wörter aus dem Thema, leicht zu tippen, z. B. „evil skills". Dasselbe Keyword auf allen Kurzvideo-Plattformen.
- **Instagram:** Die DM kommt per Automatisierung (ManyChat). DMs an Nicht-Follower landen im Anfrage-Ordner, das ist normal.
- **TikTok:** ManyChat lässt sich in der EU nicht mit TikTok verbinden, also DMs von Hand. Einen Link in der Bio gibt es erst ab 1.000 Followern oder mit verifiziertem Business-Account.
- **YouTube Shorts:** Es gibt keinen DM-Weg. Auf Keyword-Kommentare öffentlich mit der URL antworten.
- **LinkedIn und X:** kein Keyword, der Link steht im Post.

## Links

- Deutsch (LinkedIn): `https://agentic.schule/blog/<slug>`
- Englisch (alles andere): `https://agentic.schule/en/blog/<slug>`
- `<slug>` ist der Ordnername ohne `-EN`/`-DE`, z. B. `2026-09-malicious-ai-skills`. Alle Slugs sind englisch; alte deutsche Slugs leiten über `redirects.json` weiter, werden in Posts aber nicht verwendet.

## Vorlagen

**LinkedIn (DE)**

```
<Hook: Das Thema ist beliebt, aber es gibt einen fiesen Trick.>

<Ich zeige dir X. Und ich wette, du hättest es nicht gefunden.>

<Material 1, z. B. „Zeile 31 eines echten Skills:" plus wörtliches Zitat>

<Material 2, z. B. „Zeile 248, ganz unten in derselben Datei:" plus wörtliches Zitat>

<Ein, zwei Sätze, die staunen lassen.>

<Echte Frage.> Den ganzen Artikel liest du hier:
https://agentic.schule/blog/<slug>
```

**X (EN)**

```
<Hook und Wette in ein, zwei Sätzen.>

<Material 1, gekürzt>
<Material 2, gekürzt>

<Kurze Frage> Read the full article here:
https://agentic.schule/en/blog/<slug>
```

**Instagram Reels (EN)**

```
<Hook in einer Zeile>. Day N/30

Comment "<keyword>" and I'll send you the article.

#AI #AIAgents <2 bis 3 Themen-Hashtags>
```

**TikTok (EN)**

```
<Hook in einer Zeile>. Day N/30. Comment "<keyword>" for the article #AI #AIAgents <2 bis 3 Themen-Hashtags>
```

**YouTube Shorts (EN, optional)**

```
Title: <Hook in wenigen Wörtern> (Day N/30)

Description:
<Hook-Satz.>
Read the full article here: https://agentic.schule/en/blog/<slug>

#Shorts #AI #AIAgents <2 bis 3 Themen-Hashtags>
```

Hashtags gehören nur auf Instagram, TikTok und YouTube, dort helfen Stichworte bei der Suche.

## Beispiel: Tag 1 (malicious-ai-skills)

Der Kern des Artikels in zwei Zeilen der echten Datei: Zeile 31 schickt den Agenten zur Dokumentation, Zeile 248 von 258 nennt deren Adresse, und die gehört den Angreifern.

**LinkedIn (DE)**

```
AI-Skills sind extrem beliebt. Und man kann damit Schadcode auf fremde Rechner bringen, ohne dass im Skill eine einzige böse Zeile steht.

Ich zeige dir eine besonders fiese Methode. Und ich wette, du hättest sie nicht gefunden.

Zeile 31 eines echten Skills:
„Consult the SDK documentation to verify the SDK is installed and is at its latest version."

Zeile 248, ganz unten in derselben Datei:
„Stitch SDK usage and installation documentation: stitch-design[.]ai/docs/sdk/ai-sdk"

Klingt beides harmlos. Drei Sicherheits-Scanner sahen das genauso. Und der Skill liegt bis heute in einem großen Marketplace.

Wo steckt der Angriff? Den ganzen Artikel liest du hier:
https://agentic.schule/blog/2026-09-malicious-ai-skills
```

**X (EN, 275 von 280 Zeichen)**

```
AI skills can run malicious code without one bad line. I bet you'd miss this.

Line 31: "Consult the SDK documentation to verify the SDK is installed…"
Line 248: "…installation documentation: stitch-design[.]ai/…"

Spot it? Read the full article here:
https://agentic.schule/en/blog/2026-09-malicious-ai-skills
```

**Video (EN, etwa 25 Sekunden)**

| Sekunde | Bild | Ton |
| --- | --- | --- |
| 0–3 | Gesicht, Text im Bild: „I bet you won't find this attack" | „AI skills are super popular. But this one is a trap. I bet you won't find the attack." |
| 3–8 | Bildschirm: Zeile 31 der Datei auf GitHub, markiert | „Line 31: Consult the SDK documentation. Sounds fine." |
| 8–10 | schneller Scroll nach unten | nichts |
| 10–15 | Bildschirm: Zeile 248, Link markiert | „Line 248: the link to that documentation." |
| 15–20 | Gesicht | „But this is not Google's website. It belongs to the attackers. And if you click it, everything looks fine." |
| 20–25 | Gesicht | „How? Comment ‚evil skills' and I'll send you the article." |

Gezeigt wird die echte Datei auf GitHub, denn nur dort stimmen die Zeilennummern. In der entschärften Archivkopie des Artikels stehen dieselben Stellen wegen des Warnhinweises in Zeile 78 und 295.

**Instagram**

```
I bet you won't find this attack. Day 1/30

Comment "evil skills" and I'll send you the article.

#AI #AIAgents #ClaudeCode #AISecurity
```

**TikTok**

```
I bet you won't find this attack. Day 1/30. Comment "evil skills" for the article #AI #AIAgents #ClaudeCode #AISecurity
```

## Faktenregel

Posts und Skripte enthalten nur, was im Artikel steht, in der jeweils passenden Sprachfassung. Die Artikel sind an Primärquellen geprüft; neue Zahlen, Namen oder Behauptungen kommen in Posts nicht hinzu. Ausnahme ist das gezeigte Material selbst: wörtliche Zitate und Zeilennummern aus der Quelle, die der Artikel verlinkt, werden an dieser Quelle geprüft. Aussagen wie „bis heute" oder „still live" werden vor dem Posten gegen den aktuellen Stand geprüft. Vor der Freigabe wird jede Aussage abgeglichen.

## Erfolg messen

- **Ein einzelner Post sagt nichts.** Geurteilt wird frühestens nach etwa zehn Posts pro Plattform.
- **Instagram:** Watch Time, Likes und Sends pro Reichweite sind laut Instagram die wichtigsten Signale. Dazu die Skip-Rate, also der Anteil, der in den ersten drei Sekunden weiterwischt. Unter „Kontostatus" steht, ob die Inhalte überhaupt empfohlen werden dürfen. *Trial Reels* (Test an Nicht-Followern) gibt es ab 200 Followern mit Professional-Account.
- **YouTube Shorts:** „Viewed vs. swiped away" zählt. Die reine Aufrufzahl sagt wenig, denn seit dem 24. August 2026 zählt jeder gestartete Abspielvorgang als Aufruf.
- **LinkedIn und X:** Impressionen und Antworten, nicht nur Likes.

## Feedback und neue Regeln

- **Korrekturen für einen einzelnen Post** („Hook zu lahm", „kürzer") gibt Johannes im Chat. Die Sitzung überarbeitet, bis er freigibt. Drei, vier Runden sind normal.
- **Korrekturen, die immer gelten sollen,** werden Regeln in diesem Playbook. Am Ende jeder Sitzung schlägt die Sitzung vor, welche Korrekturen nach einer allgemeinen Regel klangen. Nach Johannes' Zustimmung trägt sie die Regel hier ein, an der passenden Stelle und ohne Hinweis darauf, was vorher galt.
- **Playbook-Änderungen werden direkt auf `main` committet,** ohne Pull Request. Vorher `git branch --show-current` prüfen: Andere Sitzungen nutzen denselben Checkout. Steht er auf einem fremden Branch, über ein temporäres `git worktree` auf `main` committen und den Branch des Checkouts nicht wechseln.

## Ablauf einer Sitzung

1. Tag bestimmen und den passenden Artikel finden (Frontmatter `published:`).
2. Die englische Fassung (`-EN/README.md`) komplett lesen, die deutsche (`-DE/README.md`) für den LinkedIn-Post.
3. Den Kern des Artikels finden: das eine Stück Material, an dem sich der Trick zeigen lässt.
4. Keyword, Video-Skript samt Drehplan und die Plattform-Texte entwerfen.
5. Jede Aussage gegen den Artikel prüfen, Zitate und Zeilennummern gegen die Quelle, zeitabhängige Aussagen gegen den aktuellen Stand.
6. Alles Johannes zur Freigabe vorlegen, einen Block pro Plattform, kopierfertig.
7. Nach der Freigabe allgemeine Korrekturen als neue Regeln vorschlagen und nach Zustimmung ins Playbook übernehmen (siehe „Feedback und neue Regeln").

Veröffentlicht wird von Hand. Die Sitzung postet selbst nichts.

## Belege

Stand der Prüfung: 2026-09-24. Die Plattformen ändern ihre Regeln laufend, im Zweifel die Quelle neu lesen.

**Video-Format und Ranking**

- Instagram, „Reels you may see less often": „Contain borders, logos, or watermarks", „Have the majority of the image covered by text", https://help.instagram.com/1525585517644948
- Instagram, Ranking explained (2023): „the majority of what you see is from accounts you don't follow" und „reels that have already been posted on Instagram", https://about.instagram.com/blog/announcements/instagram-ranking-explained
- Instagram, Tipps für Reichweite: „We're less likely to recommend reposts of a reel that's already on Instagram, content with noticeable watermarks", https://creators.instagram.com/blog/tips-for-improving-your-reach
- Instagram, Empfehlungs-Tipps (2022/2023): „using high-resolution, 9 x 16 vertical videos with no borders", https://creators.instagram.com/blog/instagram-recommendations-eligibility-tips-creators?locale=en_US
- Adam Mosseri, 21.01.2025: „the top three signals that matter most for ranking are watch time, likes and sends", https://www.instagram.com/p/DFFyRp-pINJ/
- TikTok Creator Academy, „Fill the screen" (August 2026): „The blurry bars are the problem — not the shape of your video.", https://www.tiktok.com/creator-academy/en/article/fill-the-screen
- TikTok Creator Academy: Hook „ideally within the first 5 seconds", https://www.tiktok.com/creator-academy/en/article/elements-of-tiktok-video?lang=en
- Meta, Safe Zones für 9:16 (Anzeigen): „keep the edges (top, bottom and sides) free of key creative elements, text and logos", https://www.facebook.com/business/help/980593475366490/
- YouTube, Shorts-Ranking nach „% of viewers who chose to view, avg. view duration and avg. % viewed", https://support.google.com/youtube/answer/11914225
- YouTube, Links in Shorts-Beschreibungen und -Kommentaren sind nicht klickbar, https://support.google.com/youtube/answer/13748639
- YouTube, Aufrufe zählen ab Start der Wiedergabe (ab 24.08.2026), https://support.google.com/youtube/answer/2991785
- Instagram, Trial Reels ab 200 Followern (Professional), https://help.instagram.com/835643311711702/

**Untertitel**

- Instagram: „Instagram uses speech recognition technology to automatically create closed captions for Reels.", https://help.instagram.com/7487270478066359/
- TikTok: „Captions will be automatically generated for videos that you upload." Automatische Untertitel lassen sich bearbeiten oder entfernen, *Creator Captions* über den „Captions"-Button gestalten, https://www.tiktok.com/support/faq_detail?id=7581826684102679052
- YouTube: „Automatic captions on long-form videos and Shorts", Englisch unter den unterstützten Sprachen, https://support.google.com/youtube/answer/6373554

**LinkedIn**

- LinkedIn Help, Ranking-Signale: „The language of the post.", https://www.linkedin.com/help/linkedin/answer/a1339724
- LinkedIn Help, Seiten-Posts erreichen zuerst die Follower der Seite, https://www.linkedin.com/help/linkedin/answer/a567075
- Tim Jurka (LinkedIn), 12.03.2026: weniger „Comment ‚Yes' if you agree", Kommentar-Automatisierung „not allowed on LinkedIn", https://www.linkedin.com/pulse/updates-linkedin-feed-focusing-authentic-relevant-tim-jurka-umwnc/
- Rishi Jobanputra (LinkedIn), über Matt Navarra, 08.09.2025: „make sure your post gives enough context that it could stand alone without the link", https://www.linkedin.com/feed/update/urn:li:activity:7370869955623542785/
- Davang Shah (LinkedIn), 30.06.2026: „Avoid using hashtags in your copy", https://www.linkedin.com/business/marketing/blog/ai-search/how-to-maximize-ai-visibility-for-your-linkedin-posts
- LinkedIn for Marketing, 08.07.2026: „Post at least 2-3 times per week", „Engage with comments within the first hour of posting", https://www.linkedin.com/posts/your-linkedin-posts-deserve-to-be-seen-heres-share-7480689664664825856-V18Z/
- MagicPost (Anbieterdaten, Korrelation): deutschsprachige Posts in Deutschland 0,63 % gegenüber 0,38 % Engagement; Vorschaukarten mit deutlich weniger Impressionen als reine URLs, https://magicpost.in/blog/should-you-post-in-english-on-linkedin und https://magicpost.in/blog/linkedin-external-links-reach

**X**

- Nikita Bier (X), 28.07.2026: „you do not need to put the links in replies anymore", https://x.com/nikitabier/status/2082217171506344297
- Nikita Bier (X), 19.10.2025: Link-Posts bekommen weniger Signale, „the post should stand alone as great content", https://x.com/nikitabier/status/1979994223224209709
- Ranking-Code `xai-org/x-algorithm`: `home-mixer/filters/oon_retweet_reply_filter.rs` (Antworten von Nicht-Gefolgten fallen aus For You), `home-mixer/scorers/author_cold_start.rs` (Schub für Accounts mit höchstens 1.000 Followern, nur eigenständige Posts)

**Keyword und DMs**

- Meta, Engagement-Köder auf Facebook: „Comment baiting: Asking people to comment with specific answers", https://www.facebook.com/business/help/259911614709806
- Meta, Private Replies auf Instagram: Nachrichten an Nicht-Follower landen im „Request folder", https://developers.facebook.com/docs/instagram-platform/private-replies/
- ManyChat: „Users located in the EU and UK are currently unable to connect their TikTok accounts", https://help.manychat.com/hc/en-us/articles/17928990909084
- TikTok, Link im Profil ab 1.000 Followern oder mit verifiziertem Business-Account, https://support.tiktok.com/en/getting-started/setting-up-your-profile/linking-another-social-media-account

**Zielgruppe**

- Stack Overflow Developer Survey 2025, genutzte Community-Plattformen (Profis): YouTube 60,3 %, Reddit 53,6 %, LinkedIn 38,1 %, Hacker News 20,4 %, X 17 %; TikTok und Instagram stehen nicht zur Auswahl, https://survey.stackoverflow.co/2025/technology
