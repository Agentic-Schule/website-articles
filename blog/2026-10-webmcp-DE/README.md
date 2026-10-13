---
title: 'WebMCP: Deine bestehende Web-App wird AI-ready'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-10-13
keywords:
  - WebMCP
  - Web Model Context Protocol
  - MCP
  - KI-Agenten
  - Browser API
  - Agentic Web
  - W3C
  - Prompt Injection
language: de
header: header.jpg
---

„Mach da mal was mit KI rein." Der klassische Weg ist ein eigener Chatbot mit eigenem Backend und eigenem Modell. Und du zahlst jeden _Token_ deiner Besucher (die Abrechnungseinheit, in der KI-Modelle rechnen), auch wenn sie den Chatbot für Smalltalk nutzen. Doch es geht auch vollkommen andersherum!

**Mit WebMCP bringt der Besucher seinen eigenen AI-Assistenten mit. Deine Web-App bietet ihm ihre Funktionen als _Tools_ an, und der Agent ruft sie direkt auf, statt sich durch das HTML zu tasten. Du brauchst dafür kein Backend und kein eigenes Modell. Und welche KI die Eingaben verarbeitet, entscheidet der Anwender selbst. So machst du eine bestehende Web-App mit wenig Aufwand _AI-ready_, also fit dafür, dass ein KI-Agent sie bedient.**

In diesem ersten Teil klären wir, was WebMCP ist, wie es sich zum MCP aus Claude Code verhält, was heute schon real funktioniert und wo die Haken liegen. Das hier ist Teil 1 von zwei, gedacht für jeden Web-Entwickler. [Teil 2](https://agentic.schule/blog/2026-10-webmcp-angular) zeigt dann die konkrete Umsetzung in Angular. Jeder Teil ist für sich lesbar.

## Inhalt

[[toc]]

## Das Problem: Der Agent tastet deine Seite ab

Stell dir ein Kontaktformular vor, über das ein Besucher ein Vorgespräch anfragt. Für einen Menschen ist das trivial: Name eintippen, E-Mail eintippen, absenden. Ein Agent ohne WebMCP sieht davon nichts. Er sieht einen Baum aus DOM-Knoten und muss erraten, welches `<input>` die E-Mail meint, welcher Button absendet und in welcher Reihenfolge das alles passiert.

Das hat drei Nachteile. Es ist langsam, weil der Agent viele Knoten durchgehen und viele Token dafür verbrauchen muss. Es ist fehleranfällig, weil ein umgebautes Layout die Automatik bricht. Und es öffnet eine Sicherheitslücke: Wenn der Agent den freien Text der Seite liest, kann dort eine versteckte Anweisung stehen, die ihn kapert. Das ist die klassische _Prompt Injection_ (deutsch etwa: das Einschmuggeln von Anweisungen über die Eingabe).

Die Idee von WebMCP ist die Umkehrung: Die Seite liest der Agent nicht mehr ab. Sie meldet dem Agenten selbst, was sie kann.

## WebMCP: Die Website deklariert ihre Tools

[WebMCP](https://github.com/webmachinelearning/webmcp) (Web Model Context Protocol) ist ein Vorschlag der [W3C Web Machine Learning Community Group](https://www.w3.org/community/webmachinelearning/). Eine Web-App deklariert damit Aktionen als _Tools_. Jedes Tool hat einen Namen, eine Beschreibung in natürlicher Sprache und ein JSON-Schema für die erwarteten Parameter. Ein angeschlossener Agent sieht diesen klaren Vertrag und ruft das Tool mit strukturierten Argumenten auf.

Der Ablauf hat drei Schritte:

1. **Die Seite registriert Tools.** Für jede Aktion, die ein Agent ausführen darf, deklarierst du ein Tool mit Name, Beschreibung und Parameter-Schema.
2. **Der Browser stellt die Tools bereit.** Ein WebMCP-fähiger Browser oder eine Extension sammelt die registrierten Tools und reicht sie an den Agenten weiter.
3. **Der Agent ruft ein Tool auf.** Er liefert die Argumente, dein Code erledigt den Rest. Die Nutzer behalten die Kontrolle über Berechtigungen und Bestätigungen.

Der Unterschied in der Praxis ist groß. Ohne WebMCP muss der Agent für so ein Formular Dutzende DOM-Knoten abklappern. Mit WebMCP reicht ein einziges deklariertes Tool, das er direkt aufruft. Google hat dafür einen [Explainer mit Live-Demo](https://googlechromelabs.github.io/webmcp-tools/demos/explainer/) gebaut, in dem dasselbe Widget einmal per DOM-Scraping und einmal per WebMCP gesteuert wird. Der Kontrast ist sehenswert.

## WebMCP oder MCP?

Wer mit Claude Code arbeitet, kennt MCP bereits: das [Model Context Protocol](https://modelcontextprotocol.io/) von Anthropic. Man hängt einen MCP-Server an und der Agent bekommt neue Fähigkeiten. Da drängt sich die Frage auf: Ist WebMCP einfach MCP im Browser? Nicht ganz. Der Unterschied liegt darin, wo die Tools laufen.

Ein klassischer MCP-Server ist eine **Backend-Integration**. Der Agent spricht direkt mit einem Server, an der Web-Oberfläche vorbei. Für serverseitige Aktionen ist das ideal. Für eine interaktive Web-App bringt es aber drei Lasten mit sich, die die Spezifikation selbst benennt: Der Agent umgeht die eigene UI der Anwendung. Du musst den Zustand des Nutzers, seinen Kontext und seine Anmeldung auf einem separaten Server nachbauen. Und du musst überhaupt erst einen eigenen Server schreiben, statt deinen vorhandenen Client-Code zu nutzen.

WebMCP ist die client-seitige Antwort darauf. Die Tools leben im Skript der laufenden Seite, im Browser, in der bestehenden Sitzung des Nutzers. Der Agent, der Nutzer und die Seite teilen sich denselben Kontext. Das Tool führt deinen eigenen Code aus und hält die sichtbare Oberfläche dabei im Takt. Die WebMCP-Spezifikation [verweist ausdrücklich auf MCP](https://github.com/webmachinelearning/webmcp) und versteht sich als Ergänzung zu MCP.

### Wer bringt den Assistenten mit?

Hier steckt der Perspektivwechsel, an dem WebMCP klick macht. Ein klassischer Chatbot gehört dem Betreiber: Er baut das Widget, betreibt im Hintergrund ein Modell und zahlt für jeden Token, den ein Besucher verbraucht. Bei WebMCP läuft es andersherum. Der Besucher bringt seinen eigenen Assistenten mit, zum Beispiel ChatGPT im eingebauten Browser der Desktop-App, und dieser Assistent macht die Inferenz auf Kosten des Besuchers. Die Seite steuert nur die Tools bei. Sie braucht kein eigenes Modell, keinen Chat-Server, keine API-Rechnung. Sie stellt nur die Fähigkeiten bereit; die Rechenzeit trägt der Besucher.

|  | Klassischer Chatbot | WebMCP |
| --- | --- | --- |
| Modell betreibt | der Website-Betreiber | der Besucher (sein Assistent) |
| Tokens zahlt | der Betreiber | der Besucher |
| Datenschutz | der Betreiber entscheidet, welche KI die Eingaben verarbeitet | der Besucher entscheidet, welche KI seine Eingaben verarbeitet |
| Backend nötig | ja: Server plus Modell | kein KI-Backend; die Tool-Aktion läuft gegen deinen vorhandenen App-Code |
| Kontext des Assistenten | nur, was der Betreiber ihm gibt | der ganze Kontext des Besuchers |
| Andere Tools | keine | die des Besuchers, frei kombinierbar |

Die letzte Zeile wiegt schwerer, als sie aussieht. Der Assistent des Besuchers kennt mehr als diese eine Seite. Er hat seinen eigenen Kontext und seine eigenen Tools: den Kalender, das Postfach, andere verbundene Dienste. Und er kann das Tool deiner Seite mit alldem verketten. Ein Beispiel: „Finde die günstigste Workshop-Variante auf agentic.schule, dann einen freien Termin in meinem Kalender, und schlage ihnen über ihr Vorgespräch-Formular einen konkreten Termin vor." Der Assistent vergleicht die Angebote auf der Seite, liest den Kalender selbst, wählt einen Termin und ruft dann das Vorgespräch-Tool `introCall` auf. Ein klassischer Chatbot auf der Website sieht den Kalender des Besuchers nie und könnte diese Kette nicht schließen.

Für den Betreiber löst das nebenbei ein leidiges Problem. Ein klassischer Chatbot auf der Website ist ein offenes LLM, das der Betreiber bezahlt. Und Besucher nutzen das gern für alles Mögliche, was mit der Seite nichts zu tun hat, vom Gedicht bis zur Hausaufgabe. Man kann viele Gegenmaßnahmen fahren, wirklich dicht bekommt man es nie. Bei WebMCP stellt sich die Frage gar nicht: Es gibt kein Modell des Betreibers, das jemand abgreifen könnte. Wer den Assistenten nutzt, zahlt ihn auch.

Und der Technik-Stack schrumpft. Kein Chat-Backend, kein gehostetes Modell, keine Missbrauchs-Abwehr drumherum. Es bleiben die Tool-Deklarationen im Frontend, mehr braucht es nicht.

So verschiebt WebMCP, wer die KI bezahlt und wer sie steuert: weg vom Betreiber, hin zum Besucher und seinem Agenten. Der Betreiber gewinnt dabei einen Assistenten, der oft mehr kann als alles, was er selbst je in ein Chat-Widget gebaut hätte.

## Tools registrieren: zwei Wege

Die Spezifikation kennt zwei APIs.

Die **imperative API** registriert Tools per JavaScript über `document.modelContext.registerTool()`. Das ist der flexible Weg, und es ist der Weg, den ein Framework wie Angular unter der Haube nutzt.

Die **deklarative API** kommt ganz ohne JavaScript aus. Für ein einfaches Formular reichen HTML-Attribute direkt am `<form>`:

```html
<!-- Deklarative API: Formular als WebMCP-Tool per HTML-Attribute -->
<form toolname="introCall"
      tooldescription="Request an intro call with the agentic.schule team"
      toolautosubmit>
  <input name="name" toolparamdescription="Your name" required>
  <input name="mail" type="email" toolparamdescription="Email address" required>
  <textarea name="note" toolparamdescription="What is it about?"></textarea>
  <button type="submit">Request</button>
</form>
```

Das Attribut `toolname` benennt das Tool, `tooldescription` beschreibt es, und `toolparamdescription` an den Feldern liefert die Parameter-Beschreibungen. `toolautosubmit` erlaubt dem Agenten, das Formular nach dem Ausfüllen selbst abzuschicken. Der Browser leitet aus den Form-Feldern automatisch ein JSON-Schema ab. Für eine schlichte Seite ohne Framework ist das ein sehr eleganter Einstieg.

> **⚠️ Achtung:** Der heute wichtigste Konsument, der eingebaute Browser von ChatGPT Desktop, unterstützt nur einen Teil der Spezifikation. Konkret nicht erkannt werden: die deklarative Variante, also Tools über die HTML-Attribute `toolname`, `tooldescription` und `toolparamdescription`, und Tools, die in einem `<iframe>` registriert sind (auch aus derselben Quelle). Es zählen nur per JavaScript auf der obersten Seite registrierte Tools. Für breite Reichweite ist die imperative API also die sichere Wahl.

Für echte Anwendungen wird die imperative API interessanter, weil sich damit die Tool-Registrierung an die Architektur des Frameworks koppeln lässt. Genau das ist das Thema von Teil 2.

## Was funktioniert heute schon?

WebMCP braucht zwei Seiten: eine Web-App, die Tools deklariert, und einen Assistenten, der sie aufruft. Über die zweite Seite entscheidet sich, ob du heute wirklich etwas davon hast. Die Community Group pflegt dazu eine offizielle [Implementation-Status-Übersicht](https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md). Mein Stand heute:

**Assistenten, die Tools aufrufen können:**

- **ChatGPT Desktop:** der konkreteste Weg für echte Besucher. Im eingebauten Browser der Desktop-App entdecken und nutzen die beiden Assistenten ChatGPT Work (die Arbeitsplatz-Variante) und Codex (OpenAIs Coding-Agent) die Tools der offenen Seite. OpenAI nennt das „Site tools". Dafür braucht es ein von OpenAI unterstütztes Modell (aktuell aus der Sol-Reihe; die Luna-Variante hat WebMCP derzeit deaktiviert); welche Modelle das sind, steht in [OpenAIs Site-tools-Doku](https://learn.chatgpt.com/docs/webmcp). Die Verfügbarkeit hängt zusätzlich am Rollout und in Firmen-Workspaces an einer Freigabe, und jeder Tool-Aufruf durchläuft vorher einen Sicherheits-Check.
- **Brave:** experimentelle Unterstützung im hauseigenen KI-Chat _Leo_. Der Beleg ist ein offenes Issue, kein fertiges Feature.
- **Meta Ray-Ban Display:** angekündigt („coming soon"), standardmäßig aus, pro Gerät zu aktivieren.

**Browser mit Origin Trial (für Seitenbetreiber):**

- **Chrome:** _Origin Trial_ ab Version 149. Ein _Origin Trial_ ist ein zeitlich begrenzter Test, bei dem du das Feature für deine eigene Domain freischaltest, ohne dass der Nutzer ein Flag setzen muss.
- **Edge:** Origin Trial ab Version 150.

**Zum Entwickeln:** die [Model Context Tool Inspector Extension](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd) simuliert einen Agenten und ruft deine Tools auf. Ein Debug-Werkzeug, kein Weg für echte Besucher.

**Noch nicht dabei:** Firefox und Safari haben keine Implementierung, nur je einen Eintrag in ihren _standards-positions_ ([Mozilla](https://github.com/mozilla/standards-positions/issues/1412), [WebKit](https://github.com/WebKit/standards-positions/issues/670)). Und ein Name fehlt ganz, das finde ich bemerkenswert: Claude. Ausgerechnet Anthropic, von denen das MCP stammt, taucht als WebMCP-Agent bislang nicht auf.

Ein Punkt bringt mich zum Schmunzeln: WebMCP kommt maßgeblich von Google, und ausgerechnet Googles eigener Browser kann es für normale Besucher noch nicht. Chrome hat den Origin Trial, aber der einzige interaktive Weg ist die Debug-Extension, deren Agent laut Chrome-Doku ausdrücklich „separate from the Gemini in Chrome features" ist. Wer einen Standard vorschlägt, sollte ihn meiner Meinung nach im eigenen Browser ab Tag 0 vorzeigen können. Dass den ersten echten Endnutzer-Weg stattdessen ChatGPT Desktop liefert, hat Ironie.

Meine Einordnung bleibt: Die Richtung stimmt und die Unterstützung wächst. Für einen produktiven Einsatz, auf den du dich verlässt, ist es aber zu früh.

## Selbst ausprobieren

Am ehesten erlebst du WebMCP heute so: Öffne im eingebauten Browser von ChatGPT Desktop eine Seite mit Tools und bitte den Assistenten um eine Aufgabe, mit einem Sol-Modell wie oben beschrieben. Erkennt er ein passendes Tool, ruft er es auf, statt die Seite abzutasten.

Zum Entwickeln brauchst du das nicht. In Chrome aktivierst du das Feature lokal über ein Flag:

```text
chrome://flags/#enable-webmcp-testing
```

Setz das Flag auf „Enabled" und starte Chrome über den Relaunch-Button neu. Danach steht `document.modelContext` in der Konsole bereit. Öffne eine Seite, die Tools registriert. agentic.schule registriert für sein Vorgespräch-Formular zum Beispiel das Tool `introCall`, sobald WebMCP im Browser aktiv ist. Dann kannst du es auflisten und von Hand aufrufen:

```js
const tools = await document.modelContext.getTools();
const tool = tools.find(t => t.name === 'introCall');

const result = await document.modelContext.executeTool(tool, {
  name: 'Ada Lovelace',
  mail: 'ada@example.com',
  note: 'Interesse an einem Team-Workshop.'
});
console.log(JSON.parse(result));
```

Komfortabler geht es mit der [Model Context Tool Inspector Extension](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd). Sie zeigt dir die registrierten Tools einer Seite, ruft sie manuell auf und lässt dich per natürlicher Sprache mit einem Agenten testen, ob er die richtigen Tools erkennt. Beim Debugging spart sie dir das manuelle Auflisten und Aufrufen der Tools.

## Wo hakt es noch?

Zu jedem gelobten Werkzeug gehören die Haken. Bei WebMCP sind es vier.

**Erstens: Es ist experimentell, und zwar wörtlich.** Die APIs können sich auch außerhalb großer Versionssprünge ändern. Der Status der Spezifikation ist ein _Draft Community Group Report_, also der frühe Entwurf einer Arbeitsgruppe, nicht der offizielle W3C-Standards-Track. Wer heute baut, muss mit Änderungen rechnen.

**Zweitens: Es ist noch kein plattformübergreifendes Feature.** Die produktive Nutzung hängt an den Chromium-Browsern. Solange Firefox und Safari nur eine Position abstimmen, erreichst du damit nicht jeden Nutzer. Und die realen Wege sind heute allesamt Desktop: ChatGPT Desktop, das Chrome-Flag, die Origin Trials und die Inspector-Extension. Einen mobilen Zugang gibt es noch nicht.

**Drittens: Löst WebMCP wirklich das Prompt-Injection-Problem?** Teilweise. Der Agent muss nicht mehr den freien Text der Seite durchwühlen, um sie zu bedienen, und dieser Text war ein klassisches Einfallstor. Verschwunden ist das Risiko aber nicht, es verlagert sich nur. Denn die Tool-Beschreibungen und die Rückgaben eines Tools sind ebenfalls Text, und diesen Text kontrolliert die Seite. Auf einer vertrauenswürdigen Seite ist das kein Problem. Eine bösartige Seite kann dem Agenten aber Tools mit irreführenden Beschreibungen unterschieben. Dieselbe Verkettung, die den Reiz ausmacht, ist dabei die Kehrseite: Über den mitgebrachten Assistenten kann eine bösartige Seite an dessen Kalender oder Postfach gelangen. Den Schutz trägt deshalb der Nutzer, der die Kontrolle über die Tool-Aufrufe behält; die Technik allein reicht nicht. Die Arbeitsgruppe führt diese Fragen in einem eigenen [Security & Privacy Questionnaire](https://github.com/webmachinelearning/webmcp/blob/main/security-privacy-questionnaire.md).

**Viertens: Du gibst Kontrolle ab.** Der Datenschutz-Vorteil aus der Tabelle hat für dich als Betreiber eine Kehrseite: Du bestimmst nicht mehr, welches Modell die Eingaben deiner Nutzer verarbeitet. Und jedes registrierte Tool steht jedem Assistenten offen, den ein Besucher mitbringt, auch mutierende wie ein Mailversand. Klassische Formulare schützt du mit Turnstile und Co. gegen Bots. WebMCP lädt Bots aber ausdrücklich zum Tool-Aufruf ein, und einen Spam-Schutz, der gute Bots durchlässt und böse aufhält, gibt es meiner Kenntnis nach noch nicht.

## Fazit

WebMCP ist ein Konzept, das ich mir gerne genauer anschaue. Es dreht die Interaktion zwischen Agent und Web-App um: Die Seite reicht dem Agenten die Werkzeuge, statt sich von ihm abtasten zu lassen. Für alle, die MCP aus Claude Code kennen, ist die Einordnung einfach: WebMCP ist das client-seitige Gegenstück, das im Browser deinen vorhandenen Code nutzt und die UI synchron hält.

Was mich daran am meisten überzeugt: WebMCP ist der einfachste Weg, AI in eine bestehende Web-Anwendung zu bringen. Die App steht ja schon. Du hängst deine vorhandene Client-Logik als Tools daran, und praktisch jede Anwendung wird AI-ready. Dafür muss man sich erst klarmachen, wie aufwändig der bisherige Weg ist: eigenes Backend, eigenes Modell, eigene Missbrauchs-Abwehr. Der Ansatz „bring deinen eigenen Assistenten mit" räumt das alles weg. Das ist für mich der Punkt, der den Ausschlag gibt.

Für die Produktion ist es noch zu früh. Für einen Prototyp, ein internes Werkzeug oder schlicht zum Lernen ist genau jetzt der richtige Zeitpunkt. Meine Empfehlung: Probier es von beiden Seiten. Als Besucher öffnest du eine Seite mit Tools im eingebauten Browser von ChatGPT Desktop und lässt den Assistenten sie bedienen. Als Entwickler setzt du das Chrome-Flag und rufst deine Tools über die Inspector-Extension oder eine der [Google-Demos](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos) auf. Nach kurzer Zeit hast du ein Gefühl dafür, ob das für dich Zukunft hat.

Im [zweiten Teil](https://agentic.schule/blog/2026-10-webmcp-angular) wird es konkret: Wir registrieren WebMCP-Tools in Angular, binden sie über die _Dependency Injection_ (Angulars eingebaute Verdrahtung von Abhängigkeiten) an unseren Code und machen aus einem Formular mit einer einzigen Option ein fertiges Tool.

**Fragen, Feedback, eigene Experimente mit WebMCP?** Immer her damit, ich freue mich über jede Nachricht.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
