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
- **Das bewährte Muster ist die Knobelaufgabe, aufs Äußerste verdichtet:** Der Post besteht aus zwei Sätzen, dem Link und einem Bild. Satz 1 stellt die Frage direkt an den Leser („Ich habe eine kleine Knobelaufgabe für dich! Siehst du in folgendem AI-Skill einen gefährlichen Angriff?"). Satz 2 leitet zum Artikel über („Hast du den Angriff nicht gefunden? Dann lies besser diesen Artikel:"). Das Bild ist die Aufgabe: ein Screenshot des echten Materials, etwas zum Anschauen und Mitsuchen. Die Frage bleibt offen, die Auflösung steht im Artikel.
- **Den Post-Typ abwechseln, nicht jeden Tag eine Knobelaufgabe.** Die Knobelaufgabe mit Screenshot passt, wenn der Artikel ein zeigbares Stück Material hat (eine Datei, einen Befehl, eine Ausgabe). Geht es um ein Setup, eine Erfahrung oder eine Meinung, passt die **offene Frage** besser: eine Frage an den Leser („Wo laufen eigentlich deine AI-Agenten, wenn du den Laptop zuklappst?"), ein Satz zur eigenen Lösung, der Link. Als Bild reicht dann das Header-Bild oder ein Foto.
- **Den Wortlaut der Frage von Tag zu Tag variieren** („Siehst du …?", „Findest du …?", „Ich wette, du hättest … nicht gefunden"). Dreißigmal derselbe Einstieg nutzt sich ab.
- **Echtes Material statt Platzhalter.** Wörtliche Zitate, echte Zeilennummern, echte Namen. Ein Platzhalter wie „innocent-looking-domain.com" verrät die Lösung schon im Namen. Im Text werden gefährliche Adressen wie im Artikel entschärft (`stitch-design[.]ai`), damit kein klickbarer Link entsteht. Im Bild bleibt die echte Adresse stehen, dort lässt sie sich nicht anklicken.
- **Der Post muss trotzdem für sich stehen.** Reine Neugier ohne Substanz wirkt wie Clickbait. Das gezeigte Material ist der Grund, weiterzulesen.
- **Höchstens ein Emoji, am Ende der Knobelfrage und passend zum Thema** (Tag 1: ☠️). Keine Hand-Emojis, keine Deko-Emojis, keine Emojis als Text im Video.
- **Vor dem Link steht ein ausgeschriebener Satz,** der zum Artikel überleitet: „Hast du den Angriff nicht gefunden? Dann lies besser diesen Artikel:" bzw. „Not sure what the attack is? Then you should read this article:".
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
| LinkedIn | DE | zwei Sätze + Screenshot | reine URL im Post | Knobelfrage, kein Keyword |
| X | EN | zwei Sätze + derselbe Screenshot, höchstens 280 Zeichen | im Post | Knobelfrage, kein Keyword |
| TikTok | EN | vertikales Video | `agentic.schule` im Video und in der Caption | „Find the full article on my website: agentic.schule" |
| Instagram Reels | EN | dasselbe Video | `agentic.schule` im Video und in der Caption | derselbe Satz |
| YouTube Shorts (optional) | EN | dasselbe Video | in der Beschreibung, nicht klickbar | derselbe Satz |
| Facebook | – | kein eigener Aufwand | – | – |

**Facebook:** Das automatische Crossposting von Instagram nach Facebook bleibt aus. Facebook ist kein Zielkanal.

## Das Bild (LinkedIn und X)

Das Bild trägt die Knobelaufgabe. Johannes erstellt es selbst im Editor; die Sitzung gibt vor, welche Datei, welche Zeilen und was ausgelassen wird.

- **Ein Screenshot der echten Quelle im Editor** (VS Code, dunkles Theme, große Schrift), so wie die Datei wirklich aussieht.
- **Auf das Nötigste gekürzt.** Nur die Zeilen, die die Aufgabe braucht, wörtlich. Ausgelassenes wird durch `[...]` ersetzt. Das `[...]` zeigt nebenbei, wie weit die Teile auseinanderliegen.
- **Der entscheidende Teil steht unten.** Wer sucht, findet ihn zuletzt.
- **Auf dem Handy lesbar:** wenige Zeilen, große Schrift.
- **Dasselbe Bild für LinkedIn und X.**
- Beispiel Tag 1: [`docs/social-media-beispiel-tag-1.png`](social-media-beispiel-tag-1.png)

## LinkedIn (DE)

- **Vom persönlichen Profil posten.** Posts einer Unternehmensseite erreichen zuerst nur deren Follower.
- **Der Hook steht in den ersten zwei Zeilen,** vor dem „… mehr".
- **Kein Video.** Zwei Sätze plus Screenshot (siehe „Das Bild").
- **Der Link steht als reine URL im Post,** eingeleitet mit dem Überleitungssatz. Das Bild anhängen; bietet LinkedIn zusätzlich eine Link-Vorschaukarte an, diese entfernen.
- **Kein „Kommentiere X, dann schicke ich dir den Link".** LinkedIn filtert diese Art Engagement-Köder und verbietet automatisierte Kommentare und Nachrichten.
- **Keine Hashtags.**
- **Die Frage muss echt sein.** Bei der Knobelaufgabe ist sie es von selbst.
- **In der ersten Stunde auf Kommentare antworten.**
- Tägliches Posten ist in Ordnung. LinkedIn empfiehlt mindestens zwei bis drei Posts pro Woche.

## X (EN)

- **Der Post passt in 280 Zeichen** (die Grenze ohne Premium). Links zählen dabei immer 23 Zeichen. Zitate lassen sich mit „…" kürzen, solange der Rest wörtlich bleibt.
- **Der Link steht direkt im Post,** eingeleitet mit dem Überleitungssatz. X stuft Links nach Aussage der Produktleitung nicht herab, und der veröffentlichte Ranking-Code enthält keine Link-Strafe. Ein Link in einer Antwort bringt nichts: Antworten zeigt X Nicht-Followern im For-You-Feed nicht, und der Schub für kleine Accounts gilt nur für eigenständige Posts.
- **Text und Bild müssen ohne Link tragen.** Link-Posts sammeln weniger Likes und Antworten, weil die Leute auf die Seite wechseln.
- **Kein Video.** Zwei Sätze plus derselbe Screenshot wie auf LinkedIn.

## Das Video (TikTok, Instagram, YouTube Shorts)

### Aufbau: Split-Screen

Jedes Video zeigt etwas. Das Bild ist durchgehend geteilt:

| Bereich (1080×1920) | Inhalt |
| --- | --- |
| obere Hälfte | Bildschirmaufnahme des Materials, z. B. die Datei auf GitHub. Große Schrift, die entscheidende Stelle markiert. Die wichtige Zeile nicht ganz oben, dort liegt der Fortschrittsbalken. |
| Mitte, an der Trennlinie | in den ersten Sekunden der Hook als Text, danach die Untertitel |
| untere Hälfte | Johannes, Kopf und Schultern, eher im oberen Teil der Hälfte. Ganz unten legt die Plattform Caption und Nutzernamen darüber. |

Warum Split-Screen: Die Knobelaufgabe steht ab Sekunde 0 im Bild, der Zuschauer rät mit, während die Frage gestellt wird. Und er sieht immer, worüber gesprochen wird. Daten, dass Split-Screen besser läuft als Vollbild mit Schnitten, gibt es nicht; für die Knobelaufgabe ist es die natürliche Form.

### Aufnahme

- **Johannes wird im Querformat gedreht** und im Schnitt zugeschnitten: links und rechts weg, oben und unten bleibt. Mittig bleiben, keine Gesten zur Seite. Für die untere Hälfte (1080×960, fast quadratisch) reicht eine 1080p-Aufnahme. Ein Vollbild im Hochformat (1080×1920) bräuchte 4K, denn aus 16:9 bleibt dafür nur knapp ein Drittel der Breite.
- **Die Bildschirmaufnahme läuft die ganzen 25 Sekunden.** Das Browserfenster vorher schmal und hoch ziehen (etwa über die Handy-Ansicht der Entwicklertools), damit lange Zeilen umbrechen und die Schrift groß bleibt. Zeilennummern im Bild müssen zum Skript passen.
- **Etwa 25 Sekunden.**

### Format

- **Vertikal 9:16, bildfüllend, 1080×1920.** Keine Ränder, keine Balken, kein Rahmen. Instagram zeigt Reels mit Rändern seltener, und TikTok nennt Balken ausdrücklich als Problem.
- **Kein Logo, kein Wasserzeichen, kein „Day N/30" im Bild.** Instagram zeigt Reels mit Logos oder Wasserzeichen seltener. Das Branding kommt über das Profil.
- **Wenig Text im Bild:** der Hook und die Untertitel. Instagram zeigt Reels seltener, deren Bild überwiegend mit Text bedeckt ist.
- **Ränder frei halten.** Oben, unten und rechts liegt die Oberfläche der Plattformen (Fortschrittsbalken, Caption, Nutzername, Buttons).
- **Sauber exportieren und auf jede Plattform einzeln hochladen.** Kein heruntergeladenes TikTok-Video mit Wasserzeichen auf Instagram. Und auf Instagram nichts erneut hochladen, was dort schon einmal lief; eine neu aufgenommene Fassung ist ein neues Video.

### Untertitel

- **Einmal im Schnitt einbrennen,** an der Trennlinie zwischen den beiden Hälften. Dort verdecken sie weder das Material noch das Gesicht, und sie liegen außerhalb der Plattform-Oberfläche.
- Alle drei Plattformen erzeugen zwar automatische Untertitel per Spracherkennung (Instagram, TikTok, YouTube Shorts; Englisch wird überall unterstützt). Deren Anzeige, Stil und Position bestimmt aber die jeweilige Plattform bzw. der Zuschauer. Eingebrannte Untertitel sehen überall gleich aus und stehen dort, wo sie hingehören.
- **Doppelte Untertitel vermeiden:** vor dem Posten in der Vorschau prüfen. Auf TikTok lassen sich die automatischen Untertitel bearbeiten oder entfernen.

### Skript-Aufbau (Knobelaufgabe)

1. **Hook als Frage an den Zuschauer:** „I have a little puzzle for you. Can you spot the attack in this AI skill?", gesprochen und als Text im Bild. Das Material ist dabei oben schon zu sehen.
2. **Material durchgehen:** Stelle 1, schneller Scroll, Stelle 2. Der Scroll zeigt, wie weit die beiden Teile auseinanderliegen.
3. **Die erste Ebene auflösen.** Wer bis zum Ende schaut, bekommt eine Antwort. Das macht das Video sehenswert und teilbar.
4. **Cliffhanger:** Die zweite Ebene bleibt im Artikel („And if you click it, everything looks fine. How?").
5. **Aufruf:** „Find the full article on my website: agentic.schule", dazu `agentic.schule` als Text im Bild in den letzten Sekunden.

Keine Vorstellung („Hi, I'm Johannes …"), kein „Day N" im gesprochenen Text. Wer Johannes ist, steht im Profil.

## Der Aufruf auf den Kurzvideo-Plattformen

- **Überall derselbe Satz:** „Find the full article on my website: agentic.schule". Gesprochen am Ende des Videos, dazu `agentic.schule` als Text im Bild, und derselbe Satz in der Caption.
- **Kein Kommentar-Keyword, keine DM-Automatisierung.** Die Website funktioniert auf jeder Plattform gleich, DMs nicht: Auf TikTok lässt sich ManyChat aus der EU nicht verbinden, DMs von Instagram an Nicht-Follower landen im Anfrage-Ordner, Shorts haben gar keinen DM-Weg, und Meta stuft „Kommentiere ein bestimmtes Wort" auf Facebook als *Comment Baiting* ein. Kommentare gehören laut Instagram ohnehin nicht zu den drei wichtigsten Ranking-Signalen.
- **Voraussetzung:** Der neue Artikel steht auf agentic.schule ganz oben und ist ohne Suchen zu finden.
- **Fragt jemand in den Kommentaren nach dem Link,** öffentlich mit der Adresse antworten.
- **LinkedIn und X:** Der Link steht im Post.

## Links

- Deutsch (LinkedIn): `https://agentic.schule/blog/<slug>`
- Englisch (alles andere): `https://agentic.schule/en/blog/<slug>`
- `<slug>` ist der Ordnername ohne `-EN`/`-DE`, z. B. `2026-09-malicious-ai-skills`. Alle Slugs sind englisch; alte deutsche Slugs leiten über `redirects.json` weiter, werden in Posts aber nicht verwendet.

## Vorlagen

**LinkedIn (DE)**, dazu der Screenshot

```
Ich habe eine kleine Knobelaufgabe für dich! <Frage an den Leser, z. B. „Siehst du in folgendem … einen …?"> <höchstens ein passendes Emoji>

<Nicht gefunden?> Dann lies besser diesen Artikel:
https://agentic.schule/blog/<slug>
```

**X (EN)**, dazu derselbe Screenshot

```
I have a little puzzle for you! <Question, e.g. "Do you see a … in the following …?"> <höchstens ein passendes Emoji>

<Not sure …?> Then you should read this article: https://agentic.schule/en/blog/<slug>
```

**Offene Frage, LinkedIn (DE)**, dazu Header-Bild oder Foto

```
<Frage an den Leser, z. B. „Wo laufen eigentlich deine AI-Agenten, wenn du den Laptop zuklappst?">

<Ein, zwei Sätze zur eigenen Lösung.> Wie das funktioniert, liest du hier:
https://agentic.schule/blog/<slug>
```

**Offene Frage, X (EN)**

```
<Question to the reader, e.g. "Where do your AI agents run when you close your laptop?">

<One or two sentences about your own solution.> Here's the whole setup: https://agentic.schule/en/blog/<slug>
```

**Instagram Reels (EN)**

```
<Hook in einer Zeile>. Day N/30

Find the full article on my website: agentic.schule

#AI #AIAgents <2 bis 3 Themen-Hashtags>
```

**TikTok (EN)**

```
<Hook in einer Zeile>. Day N/30. Full article on agentic.schule #AI #AIAgents <2 bis 3 Themen-Hashtags>
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

**LinkedIn (DE)**, dazu der Screenshot

```
Ich habe eine kleine Knobelaufgabe für dich! Siehst du in folgendem AI-Skill einen gefährlichen Angriff? ☠️

Hast du den Angriff nicht gefunden? Dann lies besser diesen Artikel:
https://agentic.schule/blog/2026-09-malicious-ai-skills
```

**X (EN)**, dazu derselbe Screenshot

```
I have a little puzzle for you! Do you see a dangerous attack in the following AI skill? ☠️

Not sure what the attack is? Then you should read this article: https://agentic.schule/en/blog/2026-09-malicious-ai-skills
```

**Der Screenshot** ([`docs/social-media-beispiel-tag-1.png`](social-media-beispiel-tag-1.png)): `SKILL.md` in VS Code. Oben der Abschnitt „Getting Stitch Ready" mit den Schritten 1 und 2 (Zeilen 27 bis 32 der echten Datei), dann `[...]`, unten der Abschnitt „Stitch Documentation" mit dem Link auf die echte Domain (Zeilen 246 bis 248).

**Video (EN, etwa 25 Sekunden, Split-Screen)**

Unten durchgehend Johannes. Oben die [Datei auf GitHub](https://github.com/wshobson/agents/blob/main/plugins/brand-landingpage/skills/brand-landingpage/SKILL.md) im schmalen Fenster; nur dort stimmen die Zeilennummern. In der entschärften Archivkopie des Artikels stehen dieselben Stellen wegen des Warnhinweises in Zeile 78 und 295.

| Sekunde | oben (Bildschirm) | Mitte (Text) | Ton |
| --- | --- | --- | --- |
| 0–3 | Zeile 31 mit Umgebung | „Can you spot the attack?" | „I have a little puzzle for you. Can you spot the attack in this AI skill?" |
| 3–8 | Zeile 31, markiert | Untertitel | „Line 31: Consult the SDK documentation. Sounds fine." |
| 8–10 | schneller Scroll nach unten | – | nichts |
| 10–15 | Zeile 248, Link markiert | Untertitel | „Line 248: the link to that documentation." |
| 15–20 | Zeile 248, Domain hervorgehoben | Untertitel | „But this is not Google's website. It belongs to the attackers. And if you click it, everything looks fine." |
| 20–25 | Zeile 248 bleibt stehen | `agentic.schule` | „How? Find the full article on my website: agentic.schule." |

**Instagram**

```
Can you spot the attack in this AI skill? Day 1/30

Find the full article on my website: agentic.schule

#AI #AIAgents #ClaudeCode #AISecurity
```

**TikTok**

```
Can you spot the attack in this AI skill? Day 1/30. Full article on agentic.schule #AI #AIAgents #ClaudeCode #AISecurity
```

**YouTube Shorts (optional)**

```
Title: Can you spot the attack in this AI skill? (Day 1/30)

Description:
AI skills can run malicious code without one bad line.
Read the full article here: https://agentic.schule/en/blog/2026-09-malicious-ai-skills

#Shorts #AI #AIAgents #ClaudeCode #AISecurity
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
4. Bildvorlage, Plattform-Texte und Video-Skript samt Drehplan entwerfen.
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

**Aufruf, Keyword und DMs**

- Meta, Engagement-Köder auf Facebook: „Comment baiting: Asking people to comment with specific answers", https://www.facebook.com/business/help/259911614709806
- Meta, Private Replies auf Instagram: Nachrichten an Nicht-Follower landen im „Request folder", https://developers.facebook.com/docs/instagram-platform/private-replies/
- ManyChat: „Users located in the EU and UK are currently unable to connect their TikTok accounts", https://help.manychat.com/hc/en-us/articles/17928990909084
- TikTok, Link im Profil ab 1.000 Followern oder mit verifiziertem Business-Account, https://support.tiktok.com/en/getting-started/setting-up-your-profile/linking-another-social-media-account

**Zielgruppe**

- Stack Overflow Developer Survey 2025, genutzte Community-Plattformen (Profis): YouTube 60,3 %, Reddit 53,6 %, LinkedIn 38,1 %, Hacker News 20,4 %, X 17 %; TikTok und Instagram stehen nicht zur Auswahl, https://survey.stackoverflow.co/2025/technology
