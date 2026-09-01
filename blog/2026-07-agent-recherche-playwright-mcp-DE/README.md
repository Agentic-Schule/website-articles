---
title: 'Dein Agent wird bei der Recherche ausgesperrt? Gib ihm einen eigenen, unauffälligen Playwright-MCP'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-07-29
keywords:
  - Playwright
  - MCP
  - Claude Code
  - Agentic Coding
  - Web-Recherche
  - Headless Chrome
  - Crawler
  - Bot-Erkennung
language: de
header: header.jpg
---

Kennst du das? Du schickst deinen Agenten zur Web-Recherche los, und er wird ausgesperrt.

**Dass eine Seite dich bewusst aussperrt, ist ihr gutes Recht. Meistens aber will der Betreiber nur die großen Botfarmen draußen halten, die mit ihrem Traffic echten Ärger machen. Dein Agent mit seinen paar Aufrufen macht diesen Ärger nicht, gerät aber in denselben Filter und kommt mit unter die Räder. Der Grund liegt beim Browser des Agenten: Ein Playwright-Standardstart sieht für jeden simplen Bot-Check aus wie eine verdächtige Maschine. Die Lösung ist ein eigener, dediziert eingerichteter Playwright-MCP, der sich so normal verhält wie der Browser eines Menschen.**

Dieser Artikel zeigt, woran ein Default-Headless-Browser erkannt wird (mit konkreten Werten), wie ein eigener MCP update-fest eingerichtet wird und wo die Grenze dieser Übung liegt.

## Inhalt

[[toc]]

## Warum Playwright?

Playwright ist eine der beliebtesten Lösungen, um einen Chrome zu automatisieren, wenn nicht die beliebteste. Entwickler setzen es seit Jahren ein. Man steuert damit einen echten Browser fern: JavaScript ausführen, Screenshots machen, Formulare ausfüllen, all das geht wunderbar.

Da liegt es nahe, auch dem eigenen AI-Agenten einen Playwright per MCP (Model Context Protocol) zur Verfügung zu stellen. Dann muss er sich das Werkzeug nicht erst mühevoll selbst installieren, was er ohnehin nur auf Befehl täte. Zumindest hoffe ich das, dass sich nicht irgendein Research-Agent einfach so Dinge installiert. 😅

Ein Auftrag klingt dann etwa so: „Mach eine Recherche zu Thema X. Wirst du ausgesperrt, gib nicht auf und nutze deinen installierten Playwright-MCP." Das Hauptmodell reicht die Anweisung an seine Sub-Agenten weiter, und die greifen nach eigenem Ermessen ganz selbstverständlich zum Playwright.

Das funktioniert an und für sich wunderbar. Wenn da nicht die Sperren wären.

## Das Problem: höflich angeklopft, trotzdem ausgesperrt

Die Ausgangslage ist harmlos. Ein Agent liest ein paar Doku-Seiten, um Aussagen zu prüfen, in Ruhe und ohne Eile. Kein Scraping, keine Last, nichts, was ein Mensch mit derselben Absicht nicht auch täte. Trotzdem kommt nichts Brauchbares zurück:

- Statt Inhalt erscheint „Access Denied" oder „Checking your browser…".
- Die Seite lädt, ist aber leer, weil das Frontend abbricht.
- Die Startseite kommt, jede Unterseite verweigert.

Was jetzt passieren kann, ist schlimmer als der Fehlschlag selbst. Manchmal gibt der beauftragte Sub-Agent einfach auf und meldet, dass er nicht durchkam. Er kann aber auch ausweichen, statt aufzugeben: Er nimmt die Suchmaschinen-Vorschau als Notlösung, den Cache, ein Zitat aus einem fremden Blog, oder er halluziniert gleich ganz. Das liest sich im Ergebnis genauso souverän wie eine echte Quelle. Das ist das Tückische daran: Eine blockierte Quelle wird lautlos zu einer schlechteren Quelle. Deshalb prüfe ich am Ende jede Behauptung noch einmal an der Primärquelle nach. Ein Auszug oder eine Vorschau zählt bei mir nicht als Beleg, nur die tatsächlich geöffnete Seite.

Und der Wind wird rauer. Cloudflare sitzt vor einem großen Teil des Webs und [kündigt zum 15. September 2026 neue Standardwerte an](https://blog.cloudflare.com/content-independence-day-ai-options/):

> For all new domains onboarding to Cloudflare, the categories of Training and Agent will be blocked by default on the pages that display ads, while Search will remain allowed by default.

Bezeichnend ist schon die Kategorie „Agent": Der Echtzeit-Zugriff durch KI-Agenten gilt inzwischen als eigene Verkehrsklasse, die man für neue, werbefinanzierte Seiten per Voreinstellung blockt. Das ist die bewusste Entscheidung einer Seite, und die respektiere ich, dazu unten mehr. Der Ärger, um den es in diesem Artikel geht, ist ein anderer: die groben Filter, die jede Automatisierung wegsortieren und dabei auch den freundlichen Leser treffen.

## Warum das passiert: der Browser sieht verdächtig aus

Ein frisch gestarteter Playwright-Browser trägt unter anderem drei Merkmale, die kein normaler Browser hat. Die folgenden Werte habe ich auf meiner Maschine ausgelesen, einmal im Standardzustand und einmal mit der Konfiguration, um die es gleich geht:

| Merkmal | Playwright im Standardzustand | mit eigener Konfiguration |
|---|---|---|
| `navigator.userAgent` | `…HeadlessChrome/…` | `…Chrome/…` |
| `navigator.webdriver` | `true` | `undefined` |
| `navigator.languages` | `["en-US","en"]` | `["de-DE","de","en-US","en"]` |

Diese Standardwerte stellen ein Problem dar. Das Wort **HeadlessChrome** steht im User-Agent und geht in jedem einzelnen Request an den Server. Dafür braucht es keine ausgefeilte Erkennung, ein simpler Textabgleich genügt: Kein normaler Benutzer surft headless. **`navigator.webdriver`** ist ein standardisiertes Flag, das der Browser selbst setzt, wenn er ferngesteuert wird, mittels JS ist es schnell ausgelesen. Und die Sprachliste `["en-US","en"]`? Für sich genommen ist sie kein Beweis, denn viele Menschen haben tatsächlich nur Englisch eingestellt. Zum Signal wird sie erst in Kombination. Eine typische Heuristik gleicht die Browsersprache mit der Geolokalisierung der IP ab: Ein Zugriff aus Deutschland, der ausschließlich US-Englisch meldet, passt schlecht zusammen. Dazu kommt, dass die Standardliste bei jeder Playwright-Installation dieselbe ist. So bleibt die Sprachliste für sich schwach. Zusammen mit den anderen Merkmalen wird sie zum weiteren Baustein im Gesamtbild.

Der entscheidende Punkt: **Diese Merkmale sagen nichts über die Absicht.** Sie machen es aber sehr einfach, eine Automatisierung zu erkennen. Wenn ein Betreiber grob filtert, sperrt er den freundlichen Leser genauso aus wie den Massen-Scraper.

## Die Lösung: ein eigener, dedizierter Playwright-MCP

Claude Code kann Playwright über einen [MCP-Server](https://code.claude.com/docs/en/mcp) ansprechen, und dafür gibt es ein offizielles Plugin von Microsoft im Marketplace. Es startet den quelloffenen Server [`@playwright/mcp`](https://github.com/microsoft/playwright-mcp) und ist mit einem Befehl installiert:

```bash
claude plugin install playwright@claude-plugins-official
```

Damit habe ich zunächst gearbeitet, und so werden es sicher viele angehen: ein Plugin aus dem offiziellen Marketplace, von einem Anbieter, dem man vertraut, da weiß man, was man hat. Am Ende habe ich es trotzdem abgeschaltet und den Server selbst registriert. Dafür gibt es zwei Gründe.

**Erstens Haltbarkeit.** Das fertige Plugin direkt anzupassen liegt nahe, viel steht da ohnehin nicht drin, die ganze Definition ist ein Vierzeiler:

```json
{ "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] } }
```

Also die Argumente ergänzen, fertig? Das ist aber eine Falle: Die Datei liegt im Plugin-Cache, und den schreibt Claude Code bei jedem Update neu. Jede Änderung dort ist nach dem nächsten Update wieder weg. Ein selbst registrierter Server liegt woanders: Laut [MCP-Dokumentation](https://code.claude.com/docs/en/mcp-quickstart) landet er bei `--scope user` in `~/.claude.json` unter dem Schlüssel `mcpServers` und gilt dann für alle Projekte. Updates fassen diese Datei nicht an.

Praktischerweise gewinnt der eigene Server ohnehin: Die Dokumentation nennt als Reihenfolge Local, Project, User, danach erst Plugins, und stellt klar, dass immer genau ein Eintrag gewinnt („The entire server entry from that source is used; fields are not merged across scopes"). Ein eigener `playwright` sticht das Plugin also. Ich schalte das Plugin trotzdem ab, weil zwei Definitionen für dieselbe Sache eine Einladung zum Rätselraten sind.

**Zweitens Übersichtlichkeit.** Ich bevorzuge es, wenn alle Einstellungen in einer Konfigurationsdatei stehen und nicht über eine wachsende Kette von Kommandozeilen-Schaltern verteilt sind. Und hier ist es nicht nur Geschmack: Zusätzliche Chrome-Argumente (gleich mehr dazu) lassen sich **nur** über die Konfiguration setzen, ein passendes CLI-Flag gibt es nicht. Eine Datei, eine Wahrheit.

> **🛠️ Selbst nachbauen: den Server registrieren**
> ```bash
> claude mcp add playwright --scope user -- \
>   npx @playwright/mcp@latest --config ~/.config/playwright-mcp/config.json
> ```
> Alles nach dem `--` ist der Startbefehl des Servers. Das mitgelieferte Plugin schaltet man in `~/.claude/settings.json` ab:
> ```json
> { "enabledPlugins": { "playwright@claude-plugins-official": false } }
> ```
> Oder man installiert einfach das offizielle Plugin wieder. Funktioniert genauso.
> Danach zeigt `claude mcp list` den eigenen Server, im Idealfall mit `✔ Connected`.

## Unauffällig ist nicht unsichtbar

Jetzt wollen wir den Chrome ein wenig tarnen. Zwei Handgriffe genügen, um die drei Verräter loszuwerden.

Der User-Agent wird auf einen normalen Chrome-String gesetzt. Entscheidend ist dabei die Versionsnummer: Sie sollte zum tatsächlich installierten Chrome passen. Ein User-Agent, der Version 130 behauptet, während der Browser sich in jedem anderen Detail wie Version 150 verhält, wirkt verdächtig. Deshalb liest mein Setup-Skript die Version aus dem installierten Chrome aus, statt sie fest einzutragen.

Der Rest ist ein kleines Skript, das vor jedem Seitenaufbau läuft:

> **🛠️ Selbst nachbauen: `pw-stealth.js`**
> ```js
> // Das Automations-Flag entfernen
> Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
>
> // Realistische Sprachliste statt nur en-US
> Object.defineProperty(navigator, 'languages', {
>   get: () => ['de-DE', 'de', 'en-US', 'en']
> });
> ```
> Der User-Agent lässt sich hier bewusst nicht setzen, denn er steckt im Request-Header und wird gesendet, bevor JavaScript überhaupt läuft. Dafür ist die Konfiguration zuständig.

**Doch die Tarnung hat eine Grenze:** Gegen echtes Bot-Management hilft das nicht. Systeme wie Cloudflare Turnstile oder DataDome schauen sich den TLS-Fingerabdruck an, messen Mausbewegungen und Timings und stellen aktive Rechenaufgaben. Zwei Zeilen JavaScript beeindrucken sie nicht, und das ist auch gut so. Wer eine solche Sperre vor sich hat, hat eine klare Antwort bekommen: Diese Seite möchte nicht automatisiert gelesen werden. Dann ist Schluss, unabhängig davon, was technisch ginge.

Dazu gehört ein zweiter Punkt, der nichts kostet und alles entscheidet: **Fair bleiben.** `robots.txt` und Nutzungsbedingungen respektieren. Ein paar Seiten in Ruhe lesen, statt zu hämmern. Keine Zugangs- oder Zahlschranken umgehen. Mein Anspruch ist, dass der eigene Browser sich so verhält wie ein Mensch mit derselben Absicht, und keinen Deut darüber hinaus.

## Headless auf einer Maschine ohne Bildschirm

Mein Agenten-Rechner ist ein [Mac mini ohne Monitor](https://agentic.schule/blog/2026-07-agentic-coding-mac-mini), an dem sich niemand grafisch anmeldet. Genau dort stürzte der echte Chrome beim Start reproduzierbar ab, sobald keine grafische Anmeldung aktiv war, mit `CVDisplayLink failed` und einem SIGTRAP. Der Grund ist unspektakulär: Chrome baut beim Start einen Grafik- und Display-Kontext auf, und ohne eine aktive grafische Sitzung gibt es den nicht. Die Lösung ist folgendes Chrome-Argument:

```json
"args": ["--disable-gpu"]
```

Ohne GPU-Prozess wird der Display-Kontext nie angefasst, und der Absturz ist strukturell unmöglich. WebGL funktioniert weiterhin, weil Chrome dann in Software rendert (SwiftShader). Das kostet einen kleinen Rest Unauffälligkeit, denn der WebGL-Renderer heißt jetzt „SwiftShader" statt nach einer echten Grafikkarte. Diesen kleinen Preis zahle ich gern: Ein zuverlässig laufender Browser ist mir wichtiger als ein makelloser Grafik-Fingerabdruck.

Und hier zeigt sich, warum die Konfigurationsdatei nötig ist: Für zusätzliche Chrome-Argumente gibt es keinen Kommandozeilen-Schalter, `launchOptions.args` existiert ausschließlich in der Konfiguration.

## Hygiene: wohin mit den Dateien?

Ein unscheinbares Detail mit Folgen. Der Playwright-MCP hinterlässt Spuren auf der Platte: Snapshots der Seitenstruktur, Screenshots, Konsolenprotokolle. Standardmäßig landen sie in einem Ordner `.playwright-mcp` **im aktuellen Arbeitsverzeichnis**, und das ist bei einem Coding-Agenten nun einmal das Repository. So sieht die Zuständigkeit im Quelltext von `@playwright/mcp` aus (Version 0.0.78):

```js
function outputDir(options) {
  if (options.config.outputDir)
    return path.resolve(options.config.outputDir);
  const baseName = options.config.skillMode ? ".playwright-cli" : ".playwright-mcp";
  if (isSystemDirectory(options.cwd) || !isWritable(options.cwd))
    return path.join(os.tmpdir(), baseName);
  return path.join(options.cwd, baseName);
}
```

Ohne `outputDir` schreibt der Server also mitten in das Projekt, an dem gerade gearbeitet wird. Die Artefakte muss man dann von Hand wieder löschen und bei Bedarf ein `.gitignore` anlegen, damit sie nicht im nächsten Commit landen. Und ohne Aufräumen wächst der Ordner immer weiter.

Der zweite Teil des Problems ist die Aufräumfunktion. Es gibt sie, aber sie tut standardmäßig nichts:

```js
async _enforceOutputBudget() {
  const maxSize = this._context.config.outputMaxSize;
  if (!maxSize)
    return;
  // … ältere Dateien löschen, bis das Budget wieder passt
}
```

Die erste Bedingung erklärt das vollständig. Ohne gesetztes Budget kehrt die Funktion sofort zurück und löscht nie etwas. Ist ein Budget gesetzt, sortiert sie nach Änderungsdatum und entfernt die ältesten Dateien zuerst. Wir sollten also unbedingt ein Budget setzen!

> **🛠️ Selbst nachbauen: die vollständige Konfiguration**
> `~/.config/playwright-mcp/config.json`
> ```json
> {
>   "outputDir": "/tmp/playwright-mcp",
>   "outputMaxSize": 209715200,
>   "browser": {
>     "browserName": "chromium",
>     "isolated": true,
>     "launchOptions": {
>       "channel": "chrome",
>       "headless": true,
>       "args": ["--disable-gpu"]
>     },
>     "contextOptions": {
>       "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/<version>.0.0.0 Safari/537.36"
>     },
>     "initScript": ["/pfad/zu/pw-stealth.js"]
>   }
> }
> ```
> `outputDir` lenkt die Dateien zentral nach `/tmp`, `outputMaxSize` (hier 200 MB) schaltet das Aufräumen überhaupt erst ein. `channel: chrome` nutzt den installierten Chrome statt eines Testbrowsers, `isolated: true` gibt jeder Sitzung ein frisches Profil im Arbeitsspeicher, was Sperrkonflikte bei parallelen Sessions vermeidet. Die Versionsnummer im `userAgent` (`<version>`) trägt das Setup-Skript unten passend zur Maschine ein.

> **⚠️ Beim Debuggen daran denken:** Die Konfiguration wird beim Start des Servers gelesen. Wer sie ändert und sich wundert, dass nichts passiert, debuggt gegen den falschen Prozess. Gelöst ist das durch ein Neuverbinden des Servers, das die Konfiguration frisch einliest.

## Einrichtung: ein Skript pro Maschine

Und ich automatisiere gerne alles: Hier ist mein Befehl, mit dem ich einen frischen Rechner mit dem Playwright-MCP für Claude Code einrichte und die Konfiguration über mehrere Rechner hinweg gleich halte.

> **🛠️ Selbst nachbauen: `setup-playwright-mcp.sh` (Kern)**
> ```bash
> #!/usr/bin/env bash
> set -euo pipefail
>
> # User-Agent aus dem echten Chrome ableiten, damit die Version zum
> # installierten Browser passt (sonst verrät die Diskrepanz alles).
> CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
> VER="$("$CHROME" --version | grep -oE '[0-9]+' | head -1)"
> UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${VER}.0.0.0 Safari/537.36"
>
> CONFIG="$HOME/.config/playwright-mcp/config.json"
> mkdir -p "$(dirname "$CONFIG")"
> cat > "$CONFIG" <<JSON
> { "outputDir": "/tmp/playwright-mcp", "outputMaxSize": 209715200,
>   "browser": { "browserName": "chromium", "isolated": true,
>     "launchOptions": { "channel": "chrome", "headless": true, "args": ["--disable-gpu"] },
>     "contextOptions": { "userAgent": "$UA" },
>     "initScript": ["$HOME/bin/pw-stealth.js"] } }
> JSON
>
> # idempotent: erst entfernen, dann sauber neu registrieren
> claude mcp remove playwright --scope user >/dev/null 2>&1 || true
> claude mcp add playwright --scope user -- npx @playwright/mcp@latest --config "$CONFIG"
> ```

## Aufräumen: liegengebliebene Chrome-Prozesse

Auf meinem Rechner haben sich ungenutzte Chrome-Prozesse angesammelt und zunehmend Arbeitsspeicher blockiert. Das ist ein bekanntes Problem: übrig bleibende Chrome-Prozesse [nach dem Schließen der Sitzung](https://github.com/microsoft/playwright-mcp/issues/1568), [ganze verwaiste Prozessbäume](https://github.com/microsoft/playwright-mcp/issues/1634) und [Zombies, die im App-Switcher hängen bleiben](https://github.com/microsoft/playwright-mcp/issues/1458). Die Issues sind zwar geschlossen, doch bei mir zeigt sich das Muster weiter.

Ich habe mich damit beholfen, die Prozesse nach einem gewissen Alter einfach zu killen. Ein gerade laufender Aufruf hat einen jungen Browser und bleibt verschont, die Leichen von gestern fliegen raus.

> **🛠️ Selbst nachbauen: `chrome-reaper.sh`**
> ```bash
> #!/usr/bin/env bash
> # Killt Google-Chrome-Prozesse, die älter als CHROME_MAX_AGE_MIN Minuten sind.
> # Ein gerade laufender Aufruf hat einen jungen Browser und bleibt verschont.
> # DRY_RUN=1 zeigt nur an, was gekillt werden würde.
> set -uo pipefail
> export PATH=/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin
>
> MAX_AGE_MIN="${CHROME_MAX_AGE_MIN:-120}"
> DRY_RUN="${DRY_RUN:-0}"
> threshold=$(( MAX_AGE_MIN * 60 ))
>
> # etime ([[TT-]HH:]MM:SS) in Sekunden umrechnen
> etime_to_secs() {
>   awk -F'[-:]' '{
>     if (NF==4) print (($1*24+$2)*60+$3)*60+$4;
>     else if (NF==3) print ($1*60+$2)*60+$3;
>     else if (NF==2) print $1*60+$2;
>     else print 0
>   }' <<<"$1"
> }
>
> # Bracket-Trick: so matcht grep sich nicht selbst
> while read -r pid etime _; do
>   [ -z "${pid:-}" ] && continue
>   [ "$(etime_to_secs "$etime")" -gt "$threshold" ] || continue
>   [ "$DRY_RUN" = "1" ] && { echo "[dry-run] würde killen: $pid ($etime)"; continue; }
>   kill -9 "$pid" 2>/dev/null
> done < <(ps -Ao pid=,etime=,command= | grep '[G]oogle Chrome')
> ```
> Zeitgesteuert läuft es bei mir per `launchd` alle 15 Minuten; ein Cron-Eintrag `*/15 * * * *` tut dasselbe. Vorher gefahrlos mit `DRY_RUN=1` prüfen, was gekillt werden würde.

Das räumt nur auf, es behebt die Ursache nicht. Die Lösung ist ein wenig brutal, aber für mich ist das Problem gelöst. Für eine Maschine, die rund um die Uhr recherchiert, ist mir das lieber als ein volllaufender Speicher.

## Fazit

Im Prinzip haben wir lediglich den offiziellen `@playwright/mcp` etwas besser verdrahtet. Aber der Gewinn ist spürbar.

Die Recherche wird **zuverlässiger**, weil der Agent öffentliche Seiten tatsächlich zu sehen bekommt und nicht auf Auszüge aus zweiter Hand ausweicht. Sie wird **belegbarer**, weil eine im Volltext gelesene Seite zitierfähig ist. Und die Repositories bleiben **sauber**, weil die Artefakte zentral abgelegt und automatisch aufgeräumt werden.

Was auch hier gilt:

- **Das ist keine Tarnkappe.** Gegen ernsthaftes Bot-Management hilft es nicht, und es soll auch nicht dagegen helfen. Eine harte Sperre ist eine klare Antwort.
- **Es bleibt Handwerk.** Der User-Agent hängt an der installierten Chrome-Version und veraltet mit jedem Update. Deshalb erzeugt das Skript ihn, statt ihn festzuschreiben.
- **Fairness sollte bleiben!** `robots.txt`, Nutzungsbedingungen und eine ruhige Aufruffrequenz sind die Bedingung dafür, dass diese Art zu arbeiten für mich in Ordnung ist.

Am Ende geht es um eine kleine Reparatur mit großer Wirkung: Der Agent gerät nicht mehr in den groben Filter, der ihn nie gemeint hat.

Übrigens läuft dieser Recherche-Browser bei mir dauerhaft auf einer Maschine, die nie ausgeht. Wie diese Bodenstation aufgebaut ist, steht im Begleitartikel [„Agentic Coding rund um die Uhr: Der Mac mini als Bodenstation"](https://agentic.schule/blog/2026-07-agentic-coding-mac-mini).

**Fragen, Feedback, eigene Erfahrungen mit ausgesperrten Agenten?** Immer her damit, ich freue mich über jede Nachricht.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
