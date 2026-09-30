---
title: 'WebMCP: Deine Website reicht dem Agenten die Werkzeuge'
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

Ein KI-Agent, der deine Web-App bedienen soll, tut heute etwas Mühsames: Er liest den DOM, wertet den _Accessibility Tree_ aus (die Baumstruktur, die auch Screenreader auslesen) oder analysiert Screenshots. Er tastet die Oberfläche ab, die eigentlich für Menschen gebaut ist.

**WebMCP dreht das um. Statt dass der Agent die Seite errät, deklariert die Seite ihre Fähigkeiten als _Tools_ und der Agent ruft sie direkt auf. Das ist schneller und zuverlässiger. Es ist aber noch ein früher Entwurf, kein Standard. In diesem ersten Teil klären wir, was WebMCP ist, wie es sich zum MCP aus Claude Code verhält, wer es schon unterstützt und wo die Haken liegen.**

Das hier ist Teil 1 von zwei. Dieser Teil bleibt allgemein und ist für jeden Web-Entwickler gedacht. [Teil 2](https://agentic.schule/blog/2026-10-webmcp-angular) zeigt dann die konkrete Umsetzung in Angular. Jeder Teil ist für sich lesbar.

## Inhalt

[[toc]]

## Das Problem: Der Agent tastet deine Seite ab

Stell dir ein Formular zum Anlegen eines Buchs vor. Für einen Menschen ist das trivial: Titel eintippen, ISBN eintippen, absenden. Ein Agent ohne WebMCP sieht davon nichts. Er sieht einen Baum aus DOM-Knoten und muss erraten, welches `<input>` die ISBN meint, welcher Button absendet und in welcher Reihenfolge das alles passiert.

Das hat drei Nachteile. Es ist langsam, weil der Agent viele Knoten durchgehen und viele Token dafür verbrauchen muss. Es ist fehleranfällig, weil ein umgebautes Layout die Automatik bricht. Und es öffnet eine Sicherheitslücke: Wenn der Agent den freien Text der Seite liest, kann dort eine versteckte Anweisung stehen, die ihn kapert. Das ist die klassische _Prompt Injection_ (deutsch etwa: das Einschmuggeln von Anweisungen über die Eingabe).

Die Idee von WebMCP ist die Umkehrung: Die Seite liest der Agent nicht mehr ab. Sie meldet dem Agenten selbst, was sie kann.

## WebMCP: Die Website deklariert ihre Tools

[WebMCP](https://github.com/webmachinelearning/webmcp) (Web Model Context Protocol) ist ein Vorschlag der [W3C Web Machine Learning Community Group](https://www.w3.org/community/webmachinelearning/). Eine Web-App deklariert damit Aktionen als _Tools_. Jedes Tool hat einen Namen, eine Beschreibung in natürlicher Sprache und ein JSON-Schema für die erwarteten Parameter. Ein angeschlossener Agent sieht diesen klaren Vertrag und ruft das Tool mit strukturierten Argumenten auf.

Der Ablauf hat drei Schritte:

1. **Die Seite registriert Tools.** Für jede Aktion, die ein Agent ausführen darf, deklarierst du ein Tool mit Name, Beschreibung und Parameter-Schema.
2. **Der Browser stellt die Tools bereit.** Ein WebMCP-fähiger Browser oder eine Extension sammelt die registrierten Tools und reicht sie an den Agenten weiter.
3. **Der Agent ruft ein Tool auf.** Er liefert die Argumente, dein Code erledigt den Rest. Die Nutzer behalten die Kontrolle über Berechtigungen und Bestätigungen.

Der Unterschied in der Praxis ist groß. Ohne WebMCP muss der Agent für unser Buch-Formular Dutzende DOM-Knoten abklappern. Mit WebMCP reicht ein einziges deklariertes Tool, das er direkt aufruft. Google hat dafür einen [Explainer mit Live-Demo](https://googlechromelabs.github.io/webmcp-tools/demos/explainer/) gebaut, in dem dasselbe Widget einmal per DOM-Scraping und einmal per WebMCP gesteuert wird. Der Kontrast ist sehenswert.

## WebMCP oder MCP?

Wer mit Claude Code arbeitet, kennt MCP bereits: das [Model Context Protocol](https://modelcontextprotocol.io/) von Anthropic. Man hängt einen MCP-Server an und der Agent bekommt neue Fähigkeiten. Da drängt sich die Frage auf: Ist WebMCP einfach MCP im Browser? Nicht ganz. Der Unterschied liegt darin, wo die Tools laufen.

Ein klassischer MCP-Server ist eine **Backend-Integration**. Der Agent spricht direkt mit einem Server, an der Web-Oberfläche vorbei. Für serverseitige Aktionen ist das ideal. Für eine interaktive Web-App bringt es aber drei Lasten mit sich, die die Spezifikation selbst benennt: Der Agent umgeht die eigene UI der Anwendung. Du musst den Zustand des Nutzers, seinen Kontext und seine Anmeldung auf einem separaten Server nachbauen. Und du musst überhaupt erst einen eigenen Server schreiben, statt deinen vorhandenen Client-Code zu nutzen.

WebMCP ist die client-seitige Antwort darauf. Die Tools leben im Skript der laufenden Seite, im Browser, in der bestehenden Sitzung des Nutzers. Der Agent, der Nutzer und die Seite teilen sich denselben Kontext. Das Tool führt deinen eigenen Code aus und hält die sichtbare Oberfläche dabei im Takt. Die WebMCP-Spezifikation [verweist ausdrücklich auf MCP](https://github.com/webmachinelearning/webmcp) und versteht sich als Ergänzung zu MCP.

Kurz zur Einordnung:

- **MCP-Server:** serverseitig, für Aktionen hinter der Anwendung. Du betreibst einen Server und replizierst Auth und State.
- **WebMCP:** client-seitig, für Aktionen in der laufenden Seite. Dein vorhandener Frontend-Code wird zum Tool, die UI bleibt synchron.

## Tools registrieren: zwei Wege

Die Spezifikation kennt zwei APIs.

Die **imperative API** registriert Tools per JavaScript über `document.modelContext.registerTool()`. Das ist der flexible Weg, und es ist der Weg, den ein Framework wie Angular unter der Haube nutzt.

Die **deklarative API** kommt ganz ohne JavaScript aus. Für ein einfaches Formular reichen HTML-Attribute direkt am `<form>`:

```html
<!-- Deklarative API: Formular als WebMCP-Tool per HTML-Attribute -->
<form toolname="createBook"
      tooldescription="Create a new book in the catalog"
      toolautosubmit>
  <input name="title" toolparamdescription="Book title" required>
  <input name="isbn" toolparamdescription="ISBN (13 digits)" required>
  <textarea name="description" toolparamdescription="Book description"></textarea>
  <button type="submit">Create</button>
</form>
```

Das Attribut `toolname` benennt das Tool, `tooldescription` beschreibt es, und `toolparamdescription` an den Feldern liefert die Parameter-Beschreibungen. `toolautosubmit` erlaubt dem Agenten, das Formular nach dem Ausfüllen selbst abzuschicken. Der Browser leitet aus den Form-Feldern automatisch ein JSON-Schema ab. Für eine schlichte Seite ohne Framework ist das ein sehr eleganter Einstieg.

Für echte Anwendungen wird die imperative API interessanter, weil sich damit die Tool-Registrierung an die Architektur des Frameworks koppeln lässt. Genau das ist das Thema von Teil 2.

## Wer unterstützt das schon?

Ob du WebMCP heute produktiv einsetzen kannst, hängt an der Browser-Unterstützung. Die Community Group pflegt dazu eine offizielle [Implementation-Status-Übersicht](https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md). Der Stand ist besser als noch vor wenigen Monaten, aber er bleibt der eines frühen Features:

- **Chrome:** _Origin Trial_ ab Version 149. Ein _Origin Trial_ ist ein zeitlich begrenzter Test, bei dem du das Feature für deine eigene Domain freischalten kannst, ohne dass der Nutzer ein Flag setzen muss.
- **Edge:** Origin Trial ab Version 150.
- **Brave:** experimentelle Unterstützung im hauseigenen KI-Chat _Leo_.
- **ChatGPT Desktop:** kann WebMCP-Tools aufrufen.
- **Meta Ray-Ban Display:** angekündigt für Web-Apps.
- **Firefox und Safari:** noch keine Implementierung. Beide haben aber einen Eintrag in ihren _standards-positions_ ([Mozilla](https://github.com/mozilla/standards-positions/issues/1412), [WebKit](https://github.com/WebKit/standards-positions/issues/670)), über den die Hersteller ihre Haltung zu einem Vorschlag festhalten.

Ein Name fehlt in der Liste, und das finde ich bemerkenswert: Claude. Ausgerechnet Anthropic, von denen das MCP stammt, taucht als WebMCP-Agent bislang nicht auf. Das kann sich ändern, aber Stand heute ist es so.

Meine Einordnung: Die Richtung stimmt und die Unterstützung wächst. Zwei Chromium-Browser im Origin Trial und zwei ernstzunehmende Agenten sind mehr als ein reines Experiment. Ein verabschiedeter Standard, auf den du eine Produktivumgebung stellst, ist es trotzdem nicht.

## Selbst ausprobieren

Zum Testen brauchst du keinen Origin Trial. In Chrome aktivierst du das Feature lokal über ein Flag:

```text
chrome://flags/#enable-webmcp-testing
```

Danach steht `document.modelContext` in der Konsole bereit. Öffne eine Seite, die Tools registriert (etwa eine der Google-Demos weiter unten), dann kannst du sie auflisten und eines von Hand aufrufen:

```js
const tools = await document.modelContext.getTools();
const tool = tools.find(t => t.name === 'createBook');

const result = await document.modelContext.executeTool(tool, {
  title: 'Web MCP',
  isbn: '9781234567897',
  description: 'A brand new book about Web MCP'
});
console.log(JSON.parse(result));
```

Komfortabler geht es mit der [Model Context Tool Inspector Extension](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd). Sie zeigt dir die registrierten Tools einer Seite, ruft sie manuell auf und lässt dich per natürlicher Sprache mit einem Agenten testen, ob er die richtigen Tools erkennt. Beim Debugging spart sie dir das manuelle Auflisten und Aufrufen der Tools.

## Wo hakt es noch?

Zu jedem gelobten Werkzeug gehören die Haken. Bei WebMCP sind es drei.

**Erstens: Es ist experimentell, und zwar wörtlich.** Die APIs können sich auch außerhalb großer Versionssprünge ändern. Der Status der Spezifikation ist ein _Draft Community Group Report_, also der frühe Entwurf einer Arbeitsgruppe, nicht der offizielle W3C-Standards-Track. Wer heute baut, baut auf beweglichem Grund.

**Zweitens: Es ist noch kein plattformübergreifendes Feature.** Die produktive Nutzung hängt an den Chromium-Browsern. Solange Firefox und Safari nur eine Position abstimmen, erreichst du damit nicht jeden Nutzer.

**Drittens: Löst WebMCP wirklich das Prompt-Injection-Problem?** Teilweise. Der Agent muss nicht mehr den freien Text der Seite durchwühlen, um sie zu bedienen, und dieser Text war ein klassisches Einfallstor. Verschwunden ist das Risiko aber nicht, es verlagert sich nur. Denn die Tool-Beschreibungen und die Rückgaben eines Tools sind ebenfalls Text, und diesen Text kontrolliert die Seite. Auf einer vertrauenswürdigen Seite ist das kein Problem. Eine bösartige Seite kann dem Agenten aber Tools mit irreführenden Beschreibungen unterschieben. Den Schutz trägt deshalb der Nutzer, der die Kontrolle über die Tool-Aufrufe behält; die Technik allein reicht nicht. Die Arbeitsgruppe führt diese Fragen in einem eigenen [Security & Privacy Questionnaire](https://github.com/webmachinelearning/webmcp/blob/main/security-privacy-questionnaire.md).

## Fazit

WebMCP ist ein Konzept, das ich mir gerne genauer anschaue. Es dreht die Interaktion zwischen Agent und Web-App um: Die Seite reicht dem Agenten die Werkzeuge, statt sich von ihm abtasten zu lassen. Für alle, die MCP aus Claude Code kennen, ist die Einordnung einfach: WebMCP ist das client-seitige Gegenstück, das im Browser deinen vorhandenen Code nutzt und die UI synchron hält.

Für die Produktion ist es noch zu früh. Für einen Prototyp, ein internes Werkzeug oder schlicht zum Lernen ist genau jetzt der richtige Zeitpunkt. Meine Empfehlung: Setz das Flag in Chrome, installier die Inspector-Extension und ruf eine der [Google-Demos](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos) auf. Nach kurzer Zeit hast du ein Gefühl dafür, ob das für dich Zukunft hat.

Im [zweiten Teil](https://agentic.schule/blog/2026-10-webmcp-angular) wird es konkret: Wir registrieren WebMCP-Tools in Angular, binden sie über die _Dependency Injection_ (Angulars eingebaute Verdrahtung von Abhängigkeiten) an unseren Code und machen aus einem Formular mit einer einzigen Option ein fertiges Tool.

**Fragen, Feedback, eigene Experimente mit WebMCP?** Immer her damit, ich freue mich über jede Nachricht.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
