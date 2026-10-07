# Social Media: Artikel promoten

Jeder Artikel der Serie wird auf sechs Kanälen beworben: LinkedIn, X, Bluesky, TikTok, Instagram und YouTube Shorts. Diese Arbeit läuft in einer eigenen Sitzung. Dort werden die Artikel nur gelesen, nie geändert. Fällt beim Lesen ein Fehler im Artikel auf, wird er notiert und in einer Artikel-Sitzung behoben.

**Rollen:** Die Artikel-Sitzung schreibt die Artikel mit Johannes, die Social-Media-Sitzung macht Posts, Videos und Reporting. Bei grundlegenden Änderungen (Erscheinungsdatum, Titel oder Slug, Artikel fällt weg oder kommt dazu, starker inhaltlicher Umbau) stimmen sich beide Sitzungen per Nachricht ab.

Der Skill `/social-post` (siehe `.claude/skills/social-post/SKILL.md`) führt durch den Ablauf unten. Die Belege für jede Regel stehen am Ende dieses Dokuments.

## Die Serie

- **30 Artikel über AI für Entwickler, auf Deutsch.** Jeder Tag ist ein kleiner Tipp mit einem ausführlichen, fachlich fundierten Artikel dahinter. Alles, was gezeigt wird, hat Johannes selbst ausprobiert.
- **Qualität vor Takt.** Ein neuer Tag erscheint etwa jeden Tag oder jeden zweiten Tag. Dauert ein Artikel länger, kommt der nächste Tag eben später. Lücken im Kalender sind ausdrücklich erlaubt.
- **„Tag N" zählt die Artikel**, nicht die Videos und nicht die Kalendertage. Ein zweites Video zum selben Artikel trägt dieselbe Nummer (Tag 2 hat zwei Videos zum Mac-mini-Artikel). Die Nummer springt bei einer Lücke nicht. Welcher Artikel welcher Tag ist, entscheidet Johannes beim Posten. Stand: Tag 1 bösartige AI-Skills, Tag 2 Mac mini, Tag 3 git worktrees.
- **Artikel mit Datum in der Zukunft sind gewollt.** Die Website zeigt sie sofort an, damit Suchmaschinen sie schon vor ihrem Tag indexieren können. Das `published:`-Datum steuert nur Anzeige und Sortierung. Kein Hinweis darauf nötig.
- **Die Artikel erscheinen weiterhin zweisprachig** (`-DE` und `-EN`). Die Posts verlinken immer die deutsche Fassung.

## Grundregeln

- **Der Hook kommt zuerst.** Fast alle, die einen Post oder ein Reel sehen, folgen dir nicht und kennen die Serie nicht. Keine Vorstellung, kein „Tag 1 von 30" am Anfang. Die Serie steht in der Caption.
- **Kurz und auf den Kern.** Ein Post erzählt den Artikel nicht nach. Er setzt das Thema, zeigt den einen Kern und macht neugierig auf die Auflösung.
- **Das bewährte Muster ist die Knobelaufgabe, aufs Äußerste verdichtet:** Der Post besteht aus zwei Sätzen, dem Link und einem Bild. Satz 1 stellt die Frage direkt an den Leser („Ich habe eine kleine Knobelaufgabe für dich! Siehst du in folgendem AI-Skill einen gefährlichen Angriff?"). Satz 2 leitet zum Artikel über („Hast du den Angriff nicht gefunden? Dann lies besser diesen Artikel:"). Das Bild ist die Aufgabe: ein Screenshot des echten Materials, etwas zum Anschauen und Mitsuchen. Die Frage bleibt offen, die Auflösung steht im Artikel.
- **Den Post-Typ abwechseln, nicht jeden Tag eine Knobelaufgabe.** Die Knobelaufgabe mit Screenshot passt, wenn der Artikel ein zeigbares Stück Material hat (eine Datei, einen Befehl, eine Ausgabe). Geht es um ein Setup, eine Erfahrung oder eine Meinung, passt die **offene Frage** besser: eine Frage an den Leser („Wo laufen eigentlich deine AI-Agenten, wenn du den Laptop zuklappst?"), ein Satz zur eigenen Lösung, der Link. Als Bild reicht dann das Header-Bild oder ein Foto.
- **Den Wortlaut der Frage von Tag zu Tag variieren** („Siehst du …?", „Findest du …?", „Ich wette, du hättest … nicht gefunden"). Dreißigmal derselbe Einstieg nutzt sich ab.
- **Echtes Material statt Platzhalter.** Wörtliche Zitate, echte Zeilennummern, echte Namen. Ein Platzhalter wie „innocent-looking-domain.com" verrät die Lösung schon im Namen. Im Text werden gefährliche Adressen wie im Artikel entschärft (`stitch-design[.]ai`), damit kein klickbarer Link entsteht. Im Bild bleibt die echte Adresse stehen, dort lässt sie sich nicht anklicken.
- **Der Post muss trotzdem für sich stehen.** Reine Neugier ohne Substanz wirkt wie Clickbait. Das gezeigte Material ist der Grund, weiterzulesen.
- **Höchstens ein Emoji, am Ende der Knobelfrage und passend zum Thema** (Tag 1: ☠️). Keine Hand-Emojis, keine Deko-Emojis, keine Emojis als Text im Video.
- **Vor dem Link steht ein ausgeschriebener Satz,** der zum Artikel überleitet: „Hast du den Angriff nicht gefunden? Dann lies besser diesen Artikel:"„Not sure what the attack is? Then you should read this article:".
- **Fremde Autoren immer nennen und mit verifizierten Handles markieren.** Stellt ein Artikel Werkzeuge oder Arbeiten anderer vor, werden deren Autoren genannt und auf jeder Plattform markiert, auf der sie ein nachweislich eigenes Konto haben. Nachweis heißt: Das Konto verlinkt auf ihr GitHub oder ihre Website, die Website oder das GitHub-Profil verlinkt das Konto, oder das Konto postet selbst über die eigenen Projekte. Namensgleichheit reicht nicht. Die Suche beginnt beim GitHub-Profil (Profilfelder, Social Accounts, Profil-README), dann persönliche Website, Paket-Registry (npm, PyPI) und eine Websuche; X-Profile lassen sich über den Playwright-MCP prüfen. Ohne verifiziertes Konto auf einer Plattform steht dort nur der Name. Beispiel Tag 4: Junyong Lee (cswap-pin) ist auf X `@codeslake` und auf LinkedIn `linkedin.com/in/codeslake`; Onur Cetinkol (claude-swap) hat nur GitHub, also nur der Name.
- **Zugespitzt, aber wahr.** Jede Aussage muss der Artikel decken. Ein Beispiel für die Grenze: Die Sicherheitsfirma im Artikel zu bösartigen AI-Skills hat nach eigener Aussage zehntausende Agenten dazu gebracht, ihr Skript auszuführen, das darf gesagt werden. „Infiziert gerade Rechner" geht dagegen weiter als der Artikel, denn die Nutzlast wurde bewusst harmlos gehalten; „ist bis heute im Umlauf" ist gedeckt.
- **Souverän statt marktschreierisch,** wie in den Artikeln selbst (siehe `CLAUDE.md`). Deutsche Posts folgen dem Stil aus `CLAUDE.md`: duzen, kurze Sätze, keine Gedankenstriche, keine „nicht X, sondern Y"-Antithese.

## Sprache: Deutsch auf allen Kanälen

- **Jeder Post und jedes Video ist deutsch** und verlinkt die `-DE`-Fassung des Artikels. Die Kunden sitzen in Deutschland und Österreich, und die englischen Posts haben dort kaum Reichweite gebracht.
- **Ein Video für alle Kurzvideo-Plattformen.** Es wird einmal gedreht und auf TikTok, Instagram und YouTube Shorts hochgeladen.
- **Kurze Sätze im Video,** so wie Johannes spontan spricht. Keine Schriftsprache, die man vor der Kamera nicht sagen würde.
- **„AI" ist das Buzzword.** Wo es passt, steht „AI" im Hook oder in der Caption.

## Die Plattformen im Überblick

| Plattform | Sprache | Format | Link | Aufruf |
| --- | --- | --- | --- | --- |
| LinkedIn | DE | zwei Sätze + Screenshot | reine URL im Post | Knobelfrage, kein Keyword |
| X | DE | zwei Sätze + derselbe Screenshot, höchstens 280 Zeichen | im Post | Knobelfrage, kein Keyword |
| Bluesky | DE | Text wie auf X + derselbe Screenshot, höchstens 300 Zeichen inklusive voller URL | im Post | wie auf X |
| TikTok | DE | vertikales Video | `agentic.schule` im Video und in der Caption | „Den ganzen Artikel findest du auf meiner Website: agentic.schule" |
| Instagram Reels | DE | dasselbe Video | `agentic.schule` im Video und in der Caption | derselbe Satz |
| YouTube Shorts | DE | dasselbe Video | in der Beschreibung, nicht klickbar | derselbe Satz |
| Facebook | – | kein eigener Aufwand | – | – |

**Facebook:** Das automatische Crossposting von Instagram nach Facebook bleibt aus. Facebook ist kein Zielkanal.

## Das Bild (LinkedIn und X)

Das Bild trägt die Knobelaufgabe. Johannes erstellt es selbst im Editor; die Sitzung gibt vor, welche Datei, welche Zeilen und was ausgelassen wird.

- **Ein Screenshot der echten Quelle im Editor** (VS Code, dunkles Theme, große Schrift), so wie die Datei wirklich aussieht.
- **Auf das Nötigste gekürzt.** Nur die Zeilen, die die Aufgabe braucht, wörtlich. Ausgelassenes wird durch `[...]` ersetzt. Das `[...]` zeigt nebenbei, wie weit die Teile auseinanderliegen.
- **Der entscheidende Teil steht unten.** Wer sucht, findet ihn zuletzt.
- **Auf dem Handy lesbar:** wenige Zeilen, große Schrift.
- **Dasselbe Bild für LinkedIn und X.**
- **Alternativ ein Social-Banner im Look des Header-Bilds,** etwa mit einem Befehl in groß als Blickfang: `social.src.html` im `-DE`-Ordner des Artikels (1200×675, Assets relativ daneben), gerendert mit `node tools/render-social.mjs blog/<ordner>` zu `social.jpg`. Beispiel Tag 3: `claude --worktree feature-name`.
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

## X

- **Der Post passt in 280 Zeichen** (die Grenze ohne Premium). Links zählen dabei immer 23 Zeichen. Zitate lassen sich mit „…" kürzen, solange der Rest wörtlich bleibt.
- **Der Link steht direkt im Post,** eingeleitet mit dem Überleitungssatz. X stuft Links nach Aussage der Produktleitung nicht herab, und der veröffentlichte Ranking-Code enthält keine Link-Strafe. Ein Link in einer Antwort bringt nichts: Antworten zeigt X Nicht-Followern im For-You-Feed nicht, und der Schub für kleine Accounts gilt nur für eigenständige Posts.
- **Text und Bild müssen ohne Link tragen.** Link-Posts sammeln weniger Likes und Antworten, weil die Leute auf die Seite wechseln.
- **Kein Video.** Zwei Sätze plus derselbe Screenshot wie auf LinkedIn.

## Bluesky

- **Derselbe Text wie auf X,** dazu derselbe Screenshot.
- **Höchstens 300 Zeichen, und der Link zählt mit voller Länge** (anders als auf X, wo jeder Link 23 Zeichen zählt). Die URLs sind rund 55 bis 65 Zeichen lang; passt der X-Text damit nicht, wird er gekürzt, nicht der Link.
- Nur geprüfte Handles markieren.

## Das Video (TikTok, Instagram, YouTube Shorts)

### Aufbau: Split-Screen

Jedes Video zeigt etwas. Das Bild ist durchgehend geteilt:

| Bereich (1080×1920) | Inhalt |
| --- | --- |
| obere Hälfte | Bildschirmaufnahme des Materials, z. B. die Datei auf GitHub. Große Schrift, die entscheidende Stelle markiert. Die wichtige Zeile nicht ganz oben, dort liegt der Fortschrittsbalken. |
| Mitte, an der Trennlinie | in den ersten Sekunden der Hook als Text, danach die Untertitel |
| untere Hälfte | Johannes, Kopf und Schultern, eher im oberen Teil der Hälfte. Ganz unten legt die Plattform Caption und Nutzernamen darüber. |

Warum Split-Screen: Die Knobelaufgabe steht ab Sekunde 0 im Bild, der Zuschauer rät mit, während die Frage gestellt wird. Und er sieht immer, worüber gesprochen wird. Daten, dass Split-Screen besser läuft als Vollbild mit Schnitten, gibt es nicht; für die Knobelaufgabe ist es die natürliche Form.

### Variante: Wechsel zwischen Vollbild und Split-Screen

Für Setup-Videos (eigenes Setup Schritt für Schritt, Vorbild sind die Hit-Reels von @josephbchandler) wechseln zwei Szenenarten mit harten Schnitten: Johannes im Vollbild und Split-Screen mit einem Bild oben. Der Wechsel selbst sorgt für den Schnitt-Rhythmus alle paar Sekunden.

- **Vollbild-Szenen:** Johannes füllt das ganze Bild, Kopf im oberen Drittel. Die Kamera liegt dafür hochkant (siehe „Aufnahme").
- **Bildszenen als Split-Screen:** oben das Bild, unten das Sprechervideo über die volle Breite, harte Kante bei y 960, keine Karte, kein Rahmen, keine abgerundeten Ecken.
- **Rein- und Rauszoomen an Satzgrenzen** (engl. *Punch-in*): Innerhalb einer Sprecher-Einstellung an jedem Satzende ein harter Schnitt, der Ausschnitt wechselt zwischen 100 % und 110 %. So ändert sich das Bild alle paar Sekunden, und die Aufmerksamkeit bleibt. Kein animierter Zoom. Gilt auch im normalen Split-Screen für die untere Hälfte.
- **Kein Freistellen.** Vor der schwarzen Kellerwand stellt Descript Johannes nicht sauber frei (helle Kleidung und Haare werden durchsichtig, dunkle Flecken bleiben). Split-Screen sieht deutlich sauberer aus.
- **Untertitel im ganzen Video an der Trennlinie bei y 960,** in beiden Szenenarten, damit sie in den Split-Szenen nicht auf dem Gesicht liegen.
- Eigene Aufnahmen (etwa der mini im Keller, das Handy mit der Claude-App) laufen im Vollbild ohne Sprecher.

Beispiel mit Skript, Drehliste und Underlord-Anweisungen: das Mac-mini-Setup-Video, Bilder unter `docs/video-bilder/mini-setup/`.

### Aufnahme

- **Johannes nimmt direkt in Descript auf,** die Sony liegt hochkant auf dem Stativ und hängt per Elgato Cam Link 4K am Rechner. HDMI überträgt immer quer: Die Aufnahme kommt als 3840×2160 an, Johannes liegt darin auf der Seite. Um 90° im Uhrzeigersinn gedreht wird daraus 2160×3840, ein volles Hochkant-Bild in doppelter Zielauflösung. Die Drehung steht als erster Schritt in der Layout-Vorlage ([`docs/descript-instructions.md`](descript-instructions.md)). Mittig bleiben, keine Gesten zur Seite.
- **Die Bildschirmaufnahme läuft die ganzen 25 Sekunden.** Das Browserfenster vorher schmal und hoch ziehen (etwa über die Handy-Ansicht der Entwicklertools), damit lange Zeilen umbrechen und die Schrift groß bleibt. Zeilennummern im Bild müssen zum Skript passen.
- **Etwa 25 Sekunden.**

### Schnitt in Descript

Jedes Video läuft in Descript in zwei Schritten: erst der Schnitt (nur wörtlich genannte Stellen löschen), dann Hochformat, Bilder, Untertitel und Audio. Die Sitzung schreibt für beide Schritte die Anweisungen an Underlord. Vorlagen und Untertitel-Stil (Manrope, 140 pt im 4K-Export, einzeilig) stehen in [`docs/descript-instructions.md`](descript-instructions.md).

### Bilder für die obere Hälfte

Für jede Szene baut die Sitzung ein eigenes Bild im agentic.schule-Look statt einer Bildschirmaufnahme: dunkler Lila-Hintergrund, Überschrift weiß mit Verlauf von `#a06bff` nach `#e90464`, Code in SF Mono, kein Logo.

- **Format:** 1080×960, gerendert in doppelter Auflösung mit `node tools/render-video-image.mjs <quelle.html> <ziel.jpg>`.
- **Oben 200 px frei.** In der Feed- und Profilansicht von Instagram liegen Name und „Original-Audio" über den obersten rund 170 px des Videos, im Vollbild die Leiste „Reels". In diesem Streifen darf kein Text stehen; Farben und Verläufe sind erlaubt. Die Vorlagen erreichen das mit einem Wrapper `.stage { transform: translateY(200px) scale(.8); transform-origin: 50% 0 }` um den gesamten Inhalt.
- **Unten Luft lassen.** Der Inhalt endet spätestens bei etwa 900 px, darunter beginnen an der Trennlinie die Untertitel.
- **Der Hook als eigenes Bild:** nur Text, groß und plakativ, etwa „Deine AI-Agenten gehören NICHT in die Cloud." Er läuft, solange der Hook gesprochen wird.
- **Kein Emoji, keine Firmenlogos.** Icons als schlichte Linien-SVG.
- **Material echt halten:** Befehle, Pfade und Dateinamen so, wie sie wirklich aussehen (etwa `ls ~/.claude/projects/-projektverzeichnis/` mit `.jsonl`-Dateien und `memory/`). Persönliche Pfade durch einen sprechenden Platzhalter ersetzen, Kundenprojekte nie zeigen.
- **Bilder in 1080×1920:** `--full` rendert das Bild hochkant, der Inhalt sitzt zwischen y 230 und 950. Im Split-Screen verdeckt das Sprechervideo die untere Hälfte; ohne Sprecher füllt das Bild den ganzen Rahmen. Gemeinsames Stylesheet und Beispiel: `docs/video-bilder/mini-setup/`.
- **Ablage:** Quellen unter `docs/video-bilder/tag<N>/` mit gemeinsamem `docs/video-bilder/base.css`, fertige Bilder als `~/Shots/tag<N>-video-<nr>-<name>.jpg`. Jedes Bild vor der Abgabe ansehen: kein ungewollter Zeilenumbruch, nichts überlappt.

### Format

- **Vertikal 9:16, bildfüllend, Export in 4K hochkant (2160×3840).** Die gedrehte Aufnahme und die gerenderten Bilder haben genau diese Größe. Positionsangaben in diesem Playbook (etwa „y 960", „oben 200 px") beziehen sich auf das halbe Raster 1080×1920; in den Underlord-Anweisungen stehen sie verdoppelt. Keine Ränder, keine Balken, kein Rahmen. Instagram zeigt Reels mit Rändern seltener, und TikTok nennt Balken ausdrücklich als Problem.
- **Kein Logo, kein Wasserzeichen, kein „Tag N" im Bild.** Instagram zeigt Reels mit Logos oder Wasserzeichen seltener. Das Branding kommt über das Profil.
- **Wenig Text im Bild:** der Hook und die Untertitel. Instagram zeigt Reels seltener, deren Bild überwiegend mit Text bedeckt ist.
- **Ränder frei halten.** Oben, unten und rechts liegt die Oberfläche der Plattformen (Fortschrittsbalken, Caption, Nutzername, Buttons).
- **Sauber exportieren und auf jede Plattform einzeln hochladen.** Kein heruntergeladenes TikTok-Video mit Wasserzeichen auf Instagram. Und auf Instagram nichts erneut hochladen, was dort schon einmal lief; eine neu aufgenommene Fassung ist ein neues Video.

### Untertitel

- **Einmal im Schnitt einbrennen,** an der Trennlinie zwischen den beiden Hälften. Dort verdecken sie weder das Material noch das Gesicht, und sie liegen außerhalb der Plattform-Oberfläche.
- Alle drei Plattformen erzeugen zwar automatische Untertitel per Spracherkennung (Instagram, TikTok, YouTube Shorts; Deutsch wird überall unterstützt). Deren Anzeige, Stil und Position bestimmt aber die jeweilige Plattform bzw. der Zuschauer. Eingebrannte Untertitel sehen überall gleich aus und stehen dort, wo sie hingehören.
- **Doppelte Untertitel vermeiden:** vor dem Posten in der Vorschau prüfen. Auf TikTok lassen sich die automatischen Untertitel bearbeiten oder entfernen.

### Hook-Formeln

Der Hook steht in der ersten Sekunde, gesprochen und als Bild, höchstens etwa zwölf gesprochene Wörter. Die Formeln stammen aus Vorlagen-Sammlungen für Kurzvideos (etwa [Opus Clip, Mai 2026](https://www.opus.pro/research/best-video-hooks-instagram)); deren Erfolgszahlen sind nicht überprüfbar, übernommen werden nur die Muster. Jede Formel ist auf Johannes' Ton zugeschnitten: souverän, keine Pannen-Erzählung, kein Hype-Vokabular („Das hat mich geschockt", „unfair", „Game Changer").

| Formel | Muster | Beispiel |
| --- | --- | --- |
| Altes Werkzeug, neuer Zweck | „Dieses X gibt es seit <Jahr>. Unverzichtbar erst mit AI-Agenten." | „Dieses Git-Feature gibt es seit 2015. Unverzichtbar wurde es erst mit AI-Agenten." |
| Ich-Setup mit „weil" | „Ich habe meinen AI-Agenten X gegeben, weil …" | „Ich habe meinen AI-Agenten einen eigenen Mac mini gegeben, weil ich meinen Laptop zuklappen will." |
| Die meisten / ich | „Die meisten machen X. Ich mache Y." | „Die meisten lassen ihre Agenten im selben Ordner arbeiten. Ich gebe jedem seinen eigenen." |
| Hyperkonkrete Situation | „Wenn <sehr konkrete Situation>, dann …" | „Wenn zwei AI-Agenten im selben Repo arbeiten, überschreiben sie sich gegenseitig die Dateien." |
| Knobelaufgabe | „Findest du X in diesem Y?" | „Findest du den Angriff in diesem AI-Skill?" |
| Warnung | „Bevor du X machst, kenn Y." | „Bevor du den zweiten Agenten startest, kenn diesen Git-Befehl." |
| Widerspruch | „<Verbreitete Annahme> stimmt nicht." | „Deine AI-Agenten gehören NICHT in die Cloud." |
| Konkretes Ergebnis | „<Konkretes Ergebnis> mit <einfachem Mittel>." | „Fünf Claude-Code-Sessions an einem Repo, ohne dass eine die andere stört." |
| Weiterleiten | „Schick das jedem, der …" | „Schick das jedem, der noch mit `git stash` zwischen Branches springt." |

- **„Ich habe X immer falsch gemacht, bis …" nicht wörtlich verwenden.** Die Pannen-Erzählung widerspricht dem souveränen Ton. Dieselbe Spannung liefern „Altes Werkzeug, neuer Zweck" und „Die meisten / ich": Es gibt eine bessere Art, und Johannes kennt sie.
- Zahlen im Hook nur, wenn sie stimmen und etwas aussagen (das Jahr 2015 für `git worktree` steht in den Release Notes von Git 2.5).
- Formel nicht zwei Tage hintereinander wiederholen.

### Skript-Aufbau (Knobelaufgabe)

1. **Hook als Frage an den Zuschauer:** „Ich habe eine kleine Knobelaufgabe für dich. Findest du den Angriff in diesem AI-Skill?", gesprochen und als Text im Bild. Das Material ist dabei oben schon zu sehen.
2. **Material durchgehen:** Stelle 1, schneller Scroll, Stelle 2. Der Scroll zeigt, wie weit die beiden Teile auseinanderliegen.
3. **Die erste Ebene auflösen.** Wer bis zum Ende schaut, bekommt eine Antwort. Das macht das Video sehenswert und teilbar.
4. **Cliffhanger:** Die zweite Ebene bleibt im Artikel („Und wenn du draufklickst, sieht alles harmlos aus. Wie geht das?").
5. **Aufruf:** „Den ganzen Artikel findest du auf meiner Website: agentic.schule", dazu `agentic.schule` als Text im Bild in den letzten Sekunden.

Keine Vorstellung („Hallo, ich bin Johannes …"), kein „Tag N" im gesprochenen Text. Wer Johannes ist, steht im Profil.

### Skript-Aufbau (Setup-Video)

Für Artikel über ein eigenes Setup. Vorbild sind die beiden Hit-Reels von @josephbchandler (Oktober 2026). Ihre Flops hatten dieselbe Machart, zeigten aber Einordnung und Vergleich statt eines Setups. Den Unterschied macht also der Inhalt: ein konkretes, nachmachbares eigenes Setup mit echten Bildschirmen.

1. **Ich-Hook mit „weil" und einem Alltagsproblem:** „Ich habe meinen AI-Agenten einen eigenen Mac mini gegeben, weil ich meinen Laptop zuklappen will, ohne dass sie aufhören zu arbeiten." Der Werkzeugname (Claude Code) fällt im ersten Satz.
2. **Das Problem konkret:** zwei, drei Alltagssituationen („bis ich ihn zuklappe, in den Rucksack stecke oder der Akku leer ist").
3. **Ein zweiter, emotionaler Grund:** meist Sicherheit („Auf meinem Laptop liegen meine Passwörter, meine Mails, mein ganzes Leben.").
4. **Drei Schritte, jeder mit einem echten Bildschirm:** „Ich habe … Dann … Dann …". Echte Ausgaben vom eigenen Rechner (`pmset -g`, `tailscale status`, `tmux ls`), private Adressen maskiert.
5. **„Und jetzt kommt das Wichtigste:"** ein einzelner Befehl oder Klick mit sichtbarem Ergebnis, am besten als echte Bildschirmaufnahme.
6. **Das Gefühl in einem Satz:** „Fühlt sich an, als liefe alles auf meinem Handy. Läuft aber im Keller."
7. **Aufruf mit Stichwort:** „Mein komplettes Setup steht Schritt für Schritt in meinem Artikel. Folg mir und kommentiere ‚Mini', dann schick ich ihn dir."

- **Länge 45 bis 50 Sekunden.** Länger kostet Zuschauer am Ende. Nach dem Schnitt der Versprecher in einem zweiten Durchgang straffen: Pausen auf 0,2 s, Füllwörter wie „halt", „nun", „eigentlich", „endlich" raus.
- **Cover mit Nutzen** in zwei, drei Wörtern („Claude Code 24/7"), kein Vergleich („Mac mini vs. Cloud").
- **Drehen:** hochkant vor der schwarzen Kellerwand, kein schwarzes Shirt, ein Licht seitlich von hinten. Ein ganzer Durchlauf pro Take, Versprecher einfach wiederholen; Underlord nimmt den letzten vollständigen Durchlauf.
- **Eigene Aufnahmen** (Gerät an seinem Platz, Laptop zuklappen, Befehl tippen, Handy) machen das Video echt. Für jede fehlende Aufnahme steht ein gerendertes Ersatzbild bereit.
- Layout: „Variante: Wechsel zwischen Vollbild und Split-Screen" oben. Vollständiges Beispiel mit Drehliste und Underlord-Anweisungen: das Mac-mini-Setup-Video (Bilder unter `docs/video-bilder/mini-setup/`).

## Der Aufruf auf den Kurzvideo-Plattformen

Zwei Formen, je nach Video:

- **Standard (Knobelaufgabe, offene Frage):** „Den ganzen Artikel findest du auf meiner Website: agentic.schule". Gesprochen am Ende des Videos, dazu `agentic.schule` als Text im Bild, und derselbe Satz in der Caption. Voraussetzung: Der neue Artikel steht auf agentic.schule ganz oben und ist ohne Suchen zu finden.
- **Setup-Video: Folgen und Stichwort.** „Folg mir und kommentiere ‚Mini', dann schick ich ihn dir." Gesprochen am Ende, derselbe Satz in der Caption. Die Kommentare treiben die Reichweite, deshalb steht der Link **nirgends sichtbar**: nicht im Video, nicht in der Caption, nicht als angepinnter Kommentar. Das Folgen löst zwei Probleme: Bei Followern erscheint der Nachrichten-Knopf, und DMs an Follower landen im Posteingang statt in den Anfragen oder im Spam.
- **Jedes Codewort bekommt sofort einen Kurzlink,** ohne Rückfrage, sobald das Codewort feststeht: `agentic.schule/<codewort>` (kleingeschrieben) leitet auf die deutsche Fassung des Artikels weiter. Eintrag in `public/_redirects` im Website-Repo (`Agentic-Schule/agentic-schule-website`, lokal `~/Work/haushoppe-headquarter/agentic.schule`), direkt auf `main` committen und pushen, über einen eigenen Worktree auf `origin/main`. Format: `/mini  /blog/<slug>?utm_source=kurzlink&utm_campaign=mini  302`. Nach dem Deploy mit `curl -sI https://agentic.schule/<codewort>` prüfen. Der Kurzlink geht nur per DM raus.
- **Antworten per DM, Stand Oktober 2026:**
  - **Instagram:** die kostenlose Automation „Comment to Message" der Meta Business Suite (Desktop). Sie nutzt Meta Private Replies: genau eine Nachricht pro Kommentar, innerhalb von 7 Tagen, bei Followern im Posteingang, sonst in den Nachrichtenanfragen ([Meta-Doku Private Replies](https://developers.facebook.com/docs/instagram-platform/private-replies/)). ManyChat nutzt denselben Kanal und löst das Zustellproblem nicht.
  - **TikTok und YouTube** haben keine Automation für Kommentare (TikToks Stichwort-Antwort reagiert nur auf Direktnachrichten). Dort von Hand per DM.
  - **Der Nachrichten-Knopf erscheint erst nach dem Folgen** (Johannes' Beobachtung): Öffentliches Profil → folgen → Knopf da. Privates Profil → Folgeanfrage → Knopf erst nach Bestätigung. Teen Accounts lassen sich laut Instagram nur von Leuten anschreiben, denen sie selbst folgen ([Teen Accounts](https://about.instagram.com/blog/announcements/instagram-teen-accounts)).
  - **Sperre vermeiden:** Laut Erfahrungsberichten flaggt Instagram vor allem Muster (gleicher Text, gleicher Link, gleicher Takt), weniger die Menge ([ManyChat Community](https://community.manychat.com/general-q-a-43/best-way-to-add-random-delays-to-ig-comment-triggers-to-avoid-action-blocks-9904)). Drei bis fünf Textvarianten im Wechsel, in Etappen antworten. Erste DM gern ohne Link („Danke! Soll ich dir den Link schicken?"), der Link nach der Antwort; DMs mit Link an viele Nicht-Follower landen laut Berichten im versteckten Spam-Ordner ([Reddit](https://www.reddit.com/r/InstagramMarketing/comments/1tm46ru/commenttodm_automation_going_to_spammessage/)). Feste Grenzwerte veröffentlicht Instagram nicht.
  - **Öffentlich antworten nur in Ausnahmen:** Viele öffentliche Antworten mit Link führen schneller zur Sperre als DMs.
- **LinkedIn und X:** Der Link steht im Post.

## Links

- Alle Kanäle verlinken die deutsche Fassung: `https://agentic.schule/blog/<slug>`
- `<slug>` ist der Ordnername ohne `-EN`/`-DE`, z. B. `2026-09-malicious-ai-skills`. Alle Slugs sind englisch; alte deutsche Slugs leiten über `redirects.json` weiter, werden in Posts aber nicht verwendet.

## Vorlagen

**Knobelaufgabe, LinkedIn**, dazu der Screenshot

```
Ich habe eine kleine Knobelaufgabe für dich! <Frage an den Leser, z. B. „Siehst du in folgendem … einen …?"> <höchstens ein passendes Emoji>

<Nicht gefunden?> Dann lies besser diesen Artikel:
https://agentic.schule/blog/<slug>
```

**Knobelaufgabe, X und Bluesky**, dazu derselbe Screenshot

```
Ich habe eine kleine Knobelaufgabe für dich! <Frage an den Leser> <höchstens ein passendes Emoji>

<Nicht gefunden?> Dann lies besser diesen Artikel: https://agentic.schule/blog/<slug>
```

**Offene Frage, LinkedIn, X und Bluesky**, dazu Header-Bild oder Foto

```
<Frage an den Leser, z. B. „Wo laufen eigentlich deine AI-Agenten, wenn du den Laptop zuklappst?">

<Ein, zwei Sätze zur eigenen Lösung.> Wie das funktioniert, liest du hier:
https://agentic.schule/blog/<slug>
```

**Instagram Reels**

```
<Hook in einer Zeile>. Tag N

Den ganzen Artikel findest du auf meiner Website: agentic.schule

#AI #KI <2 bis 3 Themen-Hashtags>
```

**TikTok**

```
<Hook in einer Zeile>. Tag N. Den ganzen Artikel findest du auf agentic.schule #AI #KI <2 bis 3 Themen-Hashtags>
```

**YouTube Shorts**

```
Titel: <Hook in wenigen Wörtern> (Tag N)

Beschreibung:
<Hook-Satz.>
Den ganzen Artikel liest du hier: https://agentic.schule/blog/<slug>
Abonnieren: Hier gibt es regelmäßig fundierte Tipps zu AI.

#Shorts #AI #KI <2 bis 3 Themen-Hashtags>
```

- **YouTube-Titel dürfen reißerischer sein** als die übrigen Posts (etwa „Dieser bösartige AI-Skill ist immer noch im Umlauf 😳"); die Wahl liegt bei Johannes. „(Tag N)" im Titel ist erwünscht, aber kein Muss. Die Sitzung schlägt einen Titel vor, meldet Johannes' eigene Titel aber nicht als Lücke oder Fehler.
- „Abonnieren" verspricht keinen festen Takt, denn zwischen den Tagen sind Lücken erlaubt.

Hashtags gehören nur auf Instagram, TikTok und YouTube, dort helfen Stichworte bei der Suche.

## Beispiel: Knobelaufgabe zu bösartigen AI-Skills

Der Kern des Artikels in zwei Zeilen der echten Datei: Zeile 31 schickt den Agenten zur Dokumentation, Zeile 248 von 258 nennt deren Adresse, und die gehört den Angreifern.

**LinkedIn, X und Bluesky**, dazu der Screenshot

```
Ich habe eine kleine Knobelaufgabe für dich! Siehst du in folgendem AI-Skill einen gefährlichen Angriff? ☠️

Hast du den Angriff nicht gefunden? Dann lies besser diesen Artikel:
https://agentic.schule/blog/2026-09-malicious-ai-skills
```

**Der Screenshot** ([`docs/social-media-beispiel-tag-1.png`](social-media-beispiel-tag-1.png)): `SKILL.md` in VS Code. Oben der Abschnitt „Getting Stitch Ready" mit den Schritten 1 und 2 (Zeilen 27 bis 32 der echten Datei), dann `[...]`, unten der Abschnitt „Stitch Documentation" mit dem Link auf die echte Domain (Zeilen 246 bis 248).

**Video (etwa 25 Sekunden, Split-Screen)**

Unten durchgehend Johannes. Oben die [Datei auf GitHub](https://github.com/wshobson/agents/blob/main/plugins/brand-landingpage/skills/brand-landingpage/SKILL.md) im schmalen Fenster; nur dort stimmen die Zeilennummern. In der entschärften Archivkopie des Artikels stehen dieselben Stellen wegen des Warnhinweises in Zeile 78 und 295.

| Sekunde | oben (Bildschirm) | Mitte (Text) | Ton |
| --- | --- | --- | --- |
| 0–3 | Zeile 31 mit Umgebung | „Findest du den Angriff?" | „Ich habe eine kleine Knobelaufgabe für dich. Findest du den Angriff in diesem AI-Skill?" |
| 3–8 | Zeile 31, markiert | Untertitel | „Zeile 31: Lies die Doku zum SDK. Klingt harmlos." |
| 8–10 | schneller Scroll nach unten | – | nichts |
| 10–15 | Zeile 248, Link markiert | Untertitel | „Zeile 248: der Link zu genau dieser Doku." |
| 15–20 | Zeile 248, Domain hervorgehoben | Untertitel | „Aber das ist nicht die Website von Google. Sie gehört den Angreifern. Und wenn du draufklickst, sieht alles harmlos aus." |
| 20–25 | Zeile 248 bleibt stehen | `agentic.schule` | „Wie das geht? Den ganzen Artikel findest du auf meiner Website: agentic.schule." |

**Instagram**

```
Findest du den Angriff in diesem AI-Skill? Tag 1

Den ganzen Artikel findest du auf meiner Website: agentic.schule

#AI #KI #ClaudeCode #AISecurity
```

**TikTok**

```
Findest du den Angriff in diesem AI-Skill? Tag 1. Den ganzen Artikel findest du auf agentic.schule #AI #KI #ClaudeCode #AISecurity
```

**YouTube Shorts**

```
Titel: Findest du den Angriff in diesem AI-Skill? (Tag 1)

Beschreibung:
AI-Skills können Schadcode ausführen, ohne eine einzige verdächtige Zeile.
Den ganzen Artikel liest du hier: https://agentic.schule/blog/2026-09-malicious-ai-skills
Abonnieren: Hier gibt es regelmäßig fundierte Tipps zu AI.

#Shorts #AI #KI #ClaudeCode #AISecurity
```

## Die Kanäle

| Kanal | Profil |
| --- | --- |
| YouTube | https://www.youtube.com/@JohannesHoppe |
| TikTok | https://www.tiktok.com/@johannes_hoppe |
| Instagram | https://www.instagram.com/_johannes_hoppe_/ |
| LinkedIn | https://www.linkedin.com/in/johanneshoppe/ |
| X | https://x.com/JohannesHoppe |
| Bluesky | https://bsky.app/profile/johanneshoppe.de |

Nach jeder Veröffentlichung prüft die Sitzung ungefragt, ob der Tag auf allen sechs Kanälen erschienen ist, und meldet nur die Lücken. Bluesky über die öffentliche API, YouTube über den RSS-Feed, X und Instagram über den Playwright-MCP; LinkedIn (Login-Wand) und TikTok (Captcha) sind nicht prüfbar. Dabei auch die Texte gegen die Faktenregel lesen; YouTube-Titel sind davon ausgenommen (siehe YouTube Shorts).

## Faktenregel

Posts und Skripte enthalten nur, was in der deutschen Fassung des Artikels steht. Die Artikel sind an Primärquellen geprüft; neue Zahlen, Namen oder Behauptungen kommen in Posts nicht hinzu. Ausnahme ist das gezeigte Material selbst: wörtliche Zitate und Zeilennummern aus der Quelle, die der Artikel verlinkt, werden an dieser Quelle geprüft. Aussagen wie „bis heute" werden vor dem Posten gegen den aktuellen Stand geprüft. Vor der Freigabe wird jede Aussage abgeglichen.

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

1. Den Artikel und die Tagesnummer mit Johannes klären.
2. Die deutsche Fassung (`-DE/README.md`) komplett lesen.
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
