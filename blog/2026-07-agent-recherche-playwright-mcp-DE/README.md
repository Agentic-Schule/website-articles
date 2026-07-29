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

Mein Agent sollte für einen Artikel ein paar Behauptungen prüfen. Ganz normale Hersteller-Dokumentation, öffentlich, jede Seite im Browser mit einem Klick erreichbar. Was zurückkam, waren leere Seiten, Weiterleitungen und ein „Access Denied". Der Agent tat daraufhin das, was Agenten in so einer Lage tun: Er behalf sich mit Suchmaschinen-Auszügen und schrieb aus zweiter Hand. Genau das will ich nicht, denn Auszüge sind älter als die Seite und manchmal schlicht falsch.

**Die Ursache liegt selten bei der Seite und fast immer beim Browser des Agenten: Ein Playwright-Standardstart sieht für jeden simplen Bot-Check aus wie eine kaputte Maschine. Die Lösung ist ein eigener, dediziert eingerichteter Playwright-MCP, der sich so normal verhält wie ein Browser von Hand.**

Dieser Artikel zeigt, woran ein Default-Headless-Browser erkannt wird (mit gemessenen Werten), wie ein eigener MCP update-fest eingerichtet wird, wo die ehrliche Grenze dieser Übung liegt und wie man verhindert, dass der Browser seine Dateien mitten in die Repos kippt.

## Inhalt

[[toc]]

## Das Problem: höflich angeklopft, trotzdem ausgesperrt

Die Ausgangslage ist harmlos. Ein Agent liest ein paar Doku-Seiten, um Aussagen zu prüfen, ein Dutzend Aufrufe über eine halbe Stunde verteilt. Kein Scraping, keine Last, nichts, was ein Mensch mit derselben Absicht nicht auch täte. Trotzdem kommt nichts Brauchbares zurück:

- Statt Inhalt erscheint „Access Denied" oder „Checking your browser…".
- Die Seite lädt, ist aber leer, weil das Frontend abbricht.
- Die Startseite kommt, jede Unterseite verweigert.

Was jetzt passiert, ist schlimmer als der Fehlschlag selbst: Der Agent weicht aus, statt aufzugeben. Er nimmt die Suchmaschinen-Vorschau, den Cache, ein Zitat aus einem fremden Blog. Das liest sich im Ergebnis genauso souverän wie eine echte Quelle. Mir ist das beim letzten Artikel passiert, und erst der zweite Blick zeigte, dass mehrere Doku-Seiten inzwischen ganz anders formulieren, als die Auszüge behaupteten. Wer mit Agenten arbeitet, kennt das Muster: Eine blockierte Quelle wird lautlos zu einer schlechteren Quelle.

## Warum das passiert: der Browser sieht kaputt aus

Ein frisch gestarteter Playwright-Browser trägt drei Merkmale, die kein Handbrowser hat. Die folgenden Werte stammen aus einer Messung auf meiner Maschine, einmal im Standardzustand und einmal mit der Konfiguration, um die es gleich geht:

| Merkmal | Playwright im Standardzustand | mit eigener Konfiguration |
|---|---|---|
| `navigator.userAgent` | `…HeadlessChrome/150.0.0.0…` | `…Chrome/150.0.0.0…` |
| `navigator.webdriver` | `true` | `undefined` |
| `navigator.languages` | `["en-US","en"]` | `["de-DE","de","en-US","en"]` |
| `window.chrome` | vorhanden | vorhanden |
| Anzahl Plugins | 5 | 5 |

Die ersten drei Zeilen sind das Problem. Das Wort **HeadlessChrome** steht im User-Agent und geht in jedem einzelnen Request an den Server. Dafür braucht es keine Analyse, ein Textvergleich genügt. **`navigator.webdriver`** ist ein standardisiertes Flag, das der Browser selbst setzt, wenn er ferngesteuert wird, drei Zeilen JavaScript im Frontend reichen zum Auslesen. Und eine Sprachliste, die exakt `["en-US","en"]` lautet, ist der Fingerabdruck einer Maschine, denn echte Browser tragen die Sprachen ihres Besitzers.

Der entscheidende Punkt: **Diese Merkmale sagen nichts über Absicht.** Sie sagen nur „hier läuft Automatisierung". Wer grob filtert, sperrt damit den freundlichen Leser genauso aus wie den Massen-Scraper. Die unteren beiden Zeilen der Tabelle zeigen übrigens, warum es sinnvoll ist, den echten installierten Chrome zu verwenden statt eines mitgelieferten Testbrowsers: `window.chrome` und die Plugin-Liste sind dann schon von Haus aus normal.

## Die Lösung: ein eigener, dedizierter Playwright-MCP

Claude Code kann Playwright über einen [MCP-Server](https://code.claude.com/docs/en/mcp) ansprechen, und es gibt dafür ein fertiges Plugin. Ich habe das Plugin abgeschaltet und den Server selbst registriert. Dafür gibt es zwei Gründe.

**Erstens Haltbarkeit.** Die Plugin-Definition liegt im Plugin-Cache, und dieser Cache wird bei Updates neu geschrieben. Jede Anpassung dort ist nach dem nächsten Update weg, was bei mir zweimal passiert ist, bevor ich die Ursache verstanden hatte. Ein selbst registrierter Server liegt woanders: Laut [MCP-Dokumentation](https://code.claude.com/docs/en/mcp-quickstart) landet er bei `--scope user` in `~/.claude.json` unter dem Schlüssel `mcpServers` und gilt dann für alle Projekte. Dass Updates diese Datei nicht anfassen, ist meine Beobachtung aus mehreren Update-Zyklen und steht so nicht in der Doku.

Praktischerweise gewinnt der eigene Server ohnehin: Die Dokumentation nennt als Reihenfolge Local, Project, User, danach erst Plugins, und stellt klar, dass immer genau ein Eintrag gewinnt („The entire server entry from that source is used; fields are not merged across scopes"). Ein eigener `playwright` sticht das Plugin also. Ich schalte das Plugin trotzdem ab, weil zwei Definitionen für dieselbe Sache eine Einladung zum Rätselraten sind.

**Zweitens Übersichtlichkeit.** Alle Einstellungen stehen in einer Konfigurationsdatei statt in einer wachsenden Kette von Kommandozeilen-Schaltern. Das ist keine Geschmacksfrage: Zusätzliche Chrome-Argumente (gleich mehr dazu) lassen sich **nur** über die Konfiguration setzen, ein passendes CLI-Flag gibt es nicht. Eine Datei, eine Wahrheit.

> **🛠️ Selbst nachbauen: den Server registrieren**
> ```bash
> claude mcp add playwright --scope user -- \
>   npx @playwright/mcp@latest --config ~/.config/playwright-mcp/config.json
> ```
> Alles nach dem `--` ist der Startbefehl des Servers. Das mitgelieferte Plugin schaltet man in `~/.claude/settings.json` ab:
> ```json
> { "enabledPlugins": { "playwright@claude-plugins-official": false } }
> ```
> Danach zeigt `claude mcp list` den eigenen Server, im Idealfall mit `✔ Connected`.

## Unauffällig ist nicht unsichtbar

Jetzt der Teil, den ich am wichtigsten finde. Was hier passiert, ist **Reparatur, keine Tarnkappe**. Zwei Handgriffe genügen, um die drei Verräter loszuwerden.

Der User-Agent wird auf einen normalen Chrome-String gesetzt. Entscheidend ist dabei die Versionsnummer: Sie muss zum tatsächlich installierten Chrome passen. Ein User-Agent, der Version 130 behauptet, während der Browser sich in jedem anderen Detail wie Version 150 verhält, ist selbst wieder ein Widerspruch. Deshalb liest mein Setup-Skript die Version aus dem installierten Chrome aus, statt sie fest einzutragen.

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

**Und jetzt die Grenze, die in jeden Text dieser Art gehört:** Gegen echtes Bot-Management hilft das nicht. Systeme wie Cloudflare Turnstile oder DataDome schauen sich den TLS-Fingerabdruck an, messen Mausbewegungen und Timings und stellen aktive Rechenaufgaben. Zwei Zeilen JavaScript beeindrucken sie nicht, und das ist auch gut so. Wer eine solche Wand vor sich hat, hat eine klare Antwort bekommen: Diese Seite möchte nicht automatisiert gelesen werden. Dann ist Schluss, unabhängig davon, was technisch ginge.

Dazu gehört ein zweiter Punkt, der nichts kostet und alles entscheidet: **Fair bleiben.** `robots.txt` und Nutzungsbedingungen respektieren. Ein Dutzend Seiten in Ruhe lesen, statt zu hämmern. Keine Zugangs- oder Zahlschranken umgehen. Der Anspruch ist, dass der eigene Browser sich so verhält wie ein Mensch mit derselben Absicht, und keinen Deut darüber hinaus.

## Headless auf einer Maschine ohne Bildschirm

Mein Agenten-Rechner ist ein [Mac mini ohne Monitor](https://agentic.schule/blog/2026-07-agentic-coding-mac-mini), an dem sich niemand grafisch anmeldet. Genau dort zeigte der echte Chrome eine Eigenart: Er stürzte beim Start gelegentlich ab, mit `CVDisplayLink failed` und einem SIGTRAP. Gelegentlich heißt: nicht reproduzierbar, mal ging es tagelang gut, dann wieder nicht.

Die Erklärung ist unspektakulär. Chrome baut beim Start einen Grafik- und Display-Kontext auf. Auf einer Maschine ohne aktives Display gibt es diesen Kontext nicht, und je nach Zustand des Systems (Bildschirm schlafend, gesperrt, gar keine Sitzung) geht das schief. Die Lösung ist ein einziges Chrome-Argument:

```json
"args": ["--disable-gpu"]
```

Ohne GPU-Prozess wird der Display-Kontext nie angefasst, und der Absturz ist strukturell unmöglich statt nur unwahrscheinlich. WebGL funktioniert weiterhin, weil Chrome dann in Software rendert (SwiftShader). Das kostet einen kleinen Rest Unauffälligkeit, denn der WebGL-Renderer heißt jetzt „SwiftShader" statt nach einer echten Grafikkarte. Diesen Preis zahle ich gern, ein zuverlässiger Browser ist mir mehr wert als ein perfekter Fingerabdruck.

Und hier zeigt sich, warum die Konfigurationsdatei nötig ist: Für zusätzliche Chrome-Argumente gibt es keinen Kommandozeilen-Schalter, `launchOptions.args` existiert ausschließlich in der Konfiguration.

## Hygiene: wohin mit den Dateien?

Ein Detail, das mich echten Ärger gekostet hat. Der Playwright-MCP legt Dateien an, Snapshots der Seitenstruktur, Screenshots, Konsolenprotokolle. Standardmäßig landen sie in einem Ordner `.playwright-mcp` **im aktuellen Arbeitsverzeichnis**, und das ist bei einem Coding-Agenten nun einmal das Repository. So sieht die Zuständigkeit im Quelltext von `@playwright/mcp` aus (Version 0.0.78):

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

Ohne `outputDir` schreibt der Server also mitten in das Projekt, an dem gerade gearbeitet wird. Bei mir tauchten die Dateien prompt in einem Commit auf, und in einem anderen Projekt wuchs der Ordner unbemerkt auf über 800 MB.

Der zweite Teil des Problems ist die Aufräumfunktion. Es gibt sie, aber sie tut standardmäßig nichts:

```js
async _enforceOutputBudget() {
  const maxSize = this._context.config.outputMaxSize;
  if (!maxSize)
    return;
  // … ältere Dateien löschen, bis das Budget wieder passt
}
```

Die erste Bedingung erklärt die 800 MB vollständig. Ohne gesetztes Budget kehrt die Funktion sofort zurück und löscht nie etwas. Ist ein Budget gesetzt, sortiert sie nach Änderungsdatum und entfernt die ältesten Dateien zuerst.

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
>       "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36"
>     },
>     "initScript": ["/pfad/zu/pw-stealth.js"]
>   }
> }
> ```
> `outputDir` lenkt die Dateien zentral nach `/tmp`, `outputMaxSize` (hier 200 MB) schaltet das Aufräumen überhaupt erst ein. `channel: chrome` nutzt den installierten Chrome statt eines Testbrowsers, `isolated: true` gibt jeder Sitzung ein frisches Profil im Arbeitsspeicher, was Sperrkonflikte bei parallelen Sessions vermeidet.

> **⚠️ Beim Debuggen daran denken:** Die Konfiguration wird beim Start des Servers gelesen. Wer sie ändert und sich wundert, dass nichts passiert, debuggt gegen einen Prozess von vorgestern. Beim Schreiben dieses Artikels ist mir das passiert: Der Ordner tauchte wieder im Repository auf, obwohl die Einstellung längst richtig war. Nach einem Neuverbinden des Servers war Ruhe.

## Einrichtung: ein Skript pro Maschine

Die Konfiguration ist bewusst maschinen-lokal. Sie enthält die Chrome-Version dieses Rechners und Pfade dieses Rechners, sie gehört also nicht in einen Sync-Ordner und auch nicht ins Repository. Für neue Maschinen gibt es stattdessen ein Skript, das die Konfiguration erzeugt und den Server registriert. Es ist idempotent, mehrfaches Ausführen schadet also nicht.

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

## Fazit

Der Aufwand ist überschaubar: eine Konfigurationsdatei, ein zweizeiliges Skript, ein Registrierungsbefehl. Der Gewinn ist größer, als es zunächst klingt.

Die Recherche wird **zuverlässiger**, weil der Agent öffentliche Seiten tatsächlich zu sehen bekommt und nicht auf Auszüge aus zweiter Hand ausweicht. Sie wird **belegbarer**, weil eine im Volltext gelesene Seite zitierfähig ist. Und die Repositories bleiben **sauber**, weil die Artefakte zentral abgelegt und automatisch aufgeräumt werden.

Ehrlich bleiben will ich auch hier:

- **Das ist keine Tarnkappe.** Gegen ernsthaftes Bot-Management hilft es nicht, und es soll auch nicht dagegen helfen. Eine Wand ist eine Antwort.
- **Es bleibt Handwerk.** Der User-Agent hängt an der installierten Chrome-Version und veraltet mit jedem Update. Deshalb erzeugt das Skript ihn, statt ihn festzuschreiben.
- **Fairness ist kein Beiwerk.** `robots.txt`, Nutzungsbedingungen und eine ruhige Aufruffrequenz sind die Bedingung dafür, dass diese Art zu arbeiten in Ordnung ist.

Am Ende geht es um eine kleine Reparatur mit großer Wirkung: Der Browser des Agenten soll sich so verhalten wie der Browser eines Menschen, der dieselbe Seite lesen möchte. Nicht besser, nicht unsichtbarer. Nur normal.

Übrigens läuft dieser Recherche-Browser bei mir dauerhaft auf einer Maschine, die nie ausgeht. Wie diese Bodenstation aufgebaut ist, steht im Begleitartikel [„Agentic Coding rund um die Uhr: Der Mac mini als Bodenstation"](https://agentic.schule/blog/2026-07-agentic-coding-mac-mini).

**Fragen, Feedback, eigene Erfahrungen mit ausgesperrten Agenten?** Immer her damit, ich freue mich über jede Nachricht.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
