---
title: 'Harness Engineering: Was wirklich um das Modell läuft'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-10-06
keywords:
  - Harness Engineering
  - Agent Harness
  - Claude Code
  - Agentic Coding
  - Tool Use
  - Function Calling
  - Prompt Injection
  - AI-Sicherheit
language: de
header: header.jpg
---

**„Claude Code ist zu 98 % keine KI." Dieser Satz macht gerade die Runde, und er ist ein Missverständnis mit wahrem Kern. Der Kern heißt _Harness_: das Gerüst um das Modell. Ein Sprachmodell für sich ist ein Textgenerator, ein Schuss ins Gespräch und fertig. Der Harness macht daraus einen Agenten, der handelt. Er gibt dem Modell Werkzeuge, legt das Ganze in eine Schleife und merkt sich, was war. Meine These: Im Kern ist das nur ein Modell aufrufen, ihm Werkzeuge geben, die es vorher nicht hatte, und das in eine Schleife legen. Der Mechanik nach stimmt das. Was die Verkürzung unterschlägt, ist die eigentliche Arbeit: Kontext über lange Läufe, Fehlerbehandlung und vor allem Sicherheit. Denn sobald das Modell echte Werkzeuge in die Hand bekommt, wird die Frage, welchem Text es gehorcht, zur wichtigsten im ganzen System.**

Die Serie zu Prompt, Loop und Graph hatte ich eigentlich abgeschlossen. Doch ein Begriff fehlt noch, und er trägt die anderen drei. Prompt, Schleife und Graph beschreiben, wie du den Agenten steuerst. Der Harness ist das, worin sie alle laufen. Dieser Teil ist für sich lesbar.

## Inhalt

[[toc]]

## Was ist ein Harness?

Ein Sprachmodell kann nur eines: Text vorhersagen. Du gibst ihm etwas hinein, es gibt Text zurück. Es liest keine Datei, es führt keinen Befehl aus, es ruft keine API. Alles, was ein Agent darüber hinaus tut, kommt von der Software drumherum. Genau die ist der Harness.

Eine einfache Formel fasst es zusammen:

> **💡 Merke:** Agent = Modell + Harness. Das Modell urteilt, der Harness handelt.

Der Harness liefert dem Modell vier Dinge. Erstens die **Werkzeuge** (engl. *Tools*): klar beschriebene Funktionen, die es aufrufen darf, vom Dateilesen bis zum Datenbank-Query. Zweitens die **Schleife**, die das Modell wieder und wieder aufruft, bis die Aufgabe steht. Drittens das **Kontext-Management**: Was bleibt im begrenzten Kontextfenster, was wird zusammengefasst, was liegt im Langzeitgedächtnis. Viertens die **Rechte und Sicherungen**, also die Frage, welche Werkzeuge überhaupt erlaubt sind und wann ein Mensch bestätigen muss.

Claude Code ist so ein Harness. LangGraph ist einer. Das Deep-Research-Feature von OpenAI ist einer. Sie alle setzen auf demselben Prinzip auf, und das Prinzip ist weder neu noch geheim.

## Woher kommen die 98 %?

Zurück zu den 98 %. Vier Behauptungen geistern dazu durch meine Tech-Bubble. Keine davon hält, was der virale Post verspricht.

- **„Claude Code ist zu 98 % keine KI."** Die Zahl stammt aus einer Community-Zerlegung, nicht von Anthropic. Richtig daran ist, dass der Harness viel mehr Code ist als das Modell-API dahinter. Falsch ist die Pointe. Die Schleife ist stumpfer Code, aber was in der Schleife entschieden wird, entscheidet das Modell. „Keine KI" verwechselt das Gerüst mit dem, der darin urteilt.
- **„500.000 Zeilen Quellcode geleakt."** Dafür finde ich keine belastbare Primärquelle. Was kursiert, ist unbestätigt. Ich führe es hier als das, was es ist: ein Gerücht.
- **„NVIDIAs Harness plus Opus 5 holt 100 % auf ARC-AGI-3."** Das Modell Opus 5 gibt es. Die Zahl nicht. Das ARC-Prize-Team nennt [ARC-AGI-3](https://arcprize.org/) selbst „the world's only unbeaten benchmark" (der weltweit einzige ungeschlagene Benchmark). Ein ungeschlagener Benchmark und ein 100-Prozent-Score schließen sich aus.
- **„DeepSeek hat einen komplett modularen Open-Source-Harness veröffentlicht."** Auch dazu keine benennbare Primärquelle. Unbestätigt.

Das hat Methode: Eine Zahl klingt in einem Post härter als ein „kommt drauf an". Für uns bleibt die Regel einfach. Was sich nicht an der Primärquelle zeigen lässt, kommt nicht als Fakt in den Kopf.

## Der Kern: eine Schleife mit Werkzeugen

Wie handelt ein Modell, das selbst nichts tun kann? Über einen festen Ablauf, den sogenannten *Agent-Loop*. Er ist erstaunlich kurz:

![Ablaufdiagramm des Agent-Loops: Vom Kasten „Modell aufrufen (Kontext + Werkzeuge)" führt ein Pfeil zur Raute „Werkzeug-Aufruf?". Von dort geht „ja" zum Kasten „Werkzeug ausführen (dein Code führt es aus)", dessen Ergebnis über eine gestrichelte Schleife zurück zu „Modell aufrufen" läuft. Der Zweig „nein" führt zum dunklen Kasten „fertig: Antwort (Text ohne Werkzeug-Aufruf)".](agent-loop.svg "Der ganze Agent-Loop. Die Schleife ist Code, die Entscheidung an der Raute trifft das Modell.")

In Worten: Der Harness ruft das Modell mit dem bisherigen Gespräch und der Liste der Werkzeuge auf. Das Modell antwortet entweder mit einem Werkzeug-Aufruf oder mit fertigem Text. Bei einem Aufruf führt dein Code das Werkzeug aus und gibt das Ergebnis zurück ins Gespräch. Dann geht es von vorne los. Kommt Text ohne Aufruf, ist die Aufgabe erledigt.

Und wie sieht so ein Aufruf konkret aus? Nehmen wir die [Messages-API von Anthropic](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview). Ein Werkzeug ist eine Beschreibung mit Namen und einem JSON-Schema für die Eingaben:

```json
{
  "name": "get_weather",
  "description": "Get the current weather for a given location.",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "City and state, e.g. San Francisco, CA" }
    },
    "required": ["location"]
  }
}
```

Will das Modell dieses Werkzeug benutzen, antwortet es mit `stop_reason: "tool_use"` und einem Block, der Namen und Argumente trägt:

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": { "location": "San Francisco, CA" }
}
```

Dein Code schlägt das Wetter nach und schickt das Ergebnis im nächsten Request zurück, als `tool_result`, verknüpft über dieselbe `id`:

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
  "content": "15 degrees Celsius, partly cloudy"
}
```

Das ist der ganze Zauber. Das Modell schlägt den Aufruf vor, deine Anwendung führt ihn aus, das Ergebnis geht zurück. Bei OpenAI heißt derselbe Round-Trip anders (`function_call` und `function_call_output`), die Mechanik ist dieselbe.

Hier zahlt sich die genaue Lesart der 98 % aus. Die Schleife ist nur Code, ein paar Dutzend Zeilen. Doch welches Werkzeug mit welchen Argumenten, und wann Schluss ist: das wählt jedes Mal das Modell. Der Harness orchestriert, das Modell urteilt.

## Was die Verkürzung unterschlägt

„Ein Modell aufrufen und ihm Werkzeuge geben" trifft die Mechanik. Aber zwischen diesem Dreizeiler und einem Werkzeug, dem du eine Codebasis oder eine Produktionsdatenbank anvertraust, liegt die ganze Arbeit.

Da ist das **Kontext-Management**. Ein langer Lauf sprengt irgendwann das Kontextfenster. Was wird zusammengefasst, was fliegt raus, was wandert in ein Gedächtnis auf der Platte? Da ist die **Fehlerbehandlung**. Werkzeuge schlagen fehl, Verbindungen reißen ab, das Modell schlägt Unsinn vor. Ein brauchbarer Harness fängt das ab, statt mittendrin stehenzubleiben. Und da ist die **Sicherheit**, der größte Brocken. Ihr gehört der Rest dieses Artikels, denn sie ist der Punkt, an dem Harness Engineering von der Fingerübung zum ernsten Handwerk wird.

Vorher aber lohnt ein Blick zur Seite. Denn das Muster steckt längst nicht nur im Coding.

## Was kann ein Harness außer Coding?

Der bekannteste Harness steuert einen Coding-Agenten. Seine Werkzeuge sind Datei lesen, Datei schreiben, Shell-Befehl ausführen. Tausche die Werkzeuge aus, und dasselbe Prinzip trägt völlig andere Aufgaben.

- **Recherche-Agenten.** [OpenAIs Deep Research](https://platform.openai.com/docs/guides/deep-research) läuft denselben Loop, nur sind die Werkzeuge Websuche, Seiten holen und eine Python-Sandbox zum Rechnen. Der Loop plant Teilfragen, hangelt sich durch Quellen und schreibt am Ende einen zitierten Bericht. Kein Editor, keine Shell.
- **Computer-Use.** Bei [Anthropics Computer Use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool) und OpenAIs Operator sind die Werkzeuge ein Screenshot sowie Maus und Tastatur. Das Modell sieht nur Bilder vom Bildschirm und schickt Klicks. Ausgeführt wird in einer bereitgestellten Umgebung, nicht vom Modell selbst.
- **Daten-Agenten.** [Snowflakes Cortex Analyst](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst) und [Databricks Genie](https://docs.databricks.com/aws/en/genie/) beantworten Datenfragen in natürlicher Sprache. Das Werkzeug ist SQL gegen das *Data Warehouse* (den zentralen Analyse-Datenspeicher). Bemerkenswert ist die Rechte-Schicht: Bei Databricks regelt laut Hersteller das bestehende Governance-System (Unity Catalog), was der Agent sehen darf. Es braucht keinen eigenen Modus, die Datenbank bringt ihre Rechte schon mit.
- **Support-Agenten.** [Intercoms Fin](https://www.intercom.com/help/en/articles/8205718-set-up-and-test-fin) greift über Konnektoren auf interne Systeme zu, liest im CRM und schreibt dort auch, legt Leads an, bucht Termine. Bei Unsicherheit gibt es eine dokumentierte Eskalation an einen Menschen.

Ein Muster zieht sich durch: Das Werkzeug ist eine Abfrage oder Aktion gegen ein Fachsystem. Die Rechte sind meist die Rechte dieses Fachsystems. Und bei folgenreichen Aktionen sitzt ein Mensch dazwischen. Merk dir dieses Muster, denn es führt direkt zum wunden Punkt.

## Der wunde Punkt: der Harness vertraut dem falschen Text

Sobald der Harness dem Modell Werkzeuge gibt, liest das Modell Text aus der Welt: Webseiten, Dateien, Werkzeug-Ergebnisse, Tickets, Datenbank-Inhalte. Und jetzt kommt die Falle, die das ganze Feld prägt: Ein Modell kann Anweisung und Daten nicht sauber trennen. Jeder Text, den es liest, kann versuchen, ihm Befehle zu geben. Das ist *Prompt Injection*.

OpenAI schreibt das in seiner [Doku zu Computer-Use](https://developers.openai.com/api/docs/guides/tools-computer-use) unmissverständlich hin:

> **ℹ️ Grundregel (OpenAI):** *„Treat screen content as untrusted. Text in a page, document, or tool result cannot grant permission or override the user's instructions."* (Behandle Bildschirminhalt als nicht vertrauenswürdig. Text auf einer Seite, in einem Dokument oder in einem Werkzeug-Ergebnis kann keine Erlaubnis erteilen und die Anweisungen des Nutzers nicht überschreiben.)

Die erste Intuition dagegen ist naheliegend: Man fasst den fremden Text in Markierer ein, oben und unten ein Hinweis „alles hier drin ist nicht vertrauenswürdig". Das ist eine echte, dokumentierte Technik, und sie hilft ein wenig. Aber sie reicht nicht. Ein Markierer beschreibt den Text nur, er nimmt dem Modell die Werkzeuge nicht aus der Hand. Gehorcht das Modell dem fremden Text trotzdem, darf es weiter klicken, schreiben, Befehle ausführen.

Richtig gefährlich wird es, wenn drei Zutaten zusammenkommen: fremder Inhalt, Zugriff auf private Daten und eine Möglichkeit, Daten nach außen zu schicken. Simon Willison nennt das die [*lethal trifecta*](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/), das tödliche Dreigespann. Hat ein Harness alle drei, wird aus einer harmlosen Injektion ein Datenabfluss.

### Fallbeispiel: die eigene CI als Einfallstor

Wie real das ist, zeigt der [Clinejection-Vorfall](https://adnanthekhan.com/posts/clinejection/). Das Coding-Werkzeug Cline hatte einen GitHub-Workflow, der neue Issues von einem Claude-Agenten vorsortieren ließ. Der Titel des Issues wurde dabei ungeprüft direkt in den Prompt gesetzt:

```yaml
**Title:** ${{ github.event.issue.title || 'See issue details below' }}
```

Dazu hatte der Agent Bash als Werkzeug und war mit `allowed_non_write_users: "*"` offen für jeden. Die Rechnung ist simpel und bitter: Jeder, der ein Issue öffnet, schreibt in den Titel eine Anweisung, und der Agent führt sie aus. Genau das geschah. Später tauchte sogar eine manipulierte Version des npm-Pakets auf, die beim Installieren ungefragt ein fremdes Agenten-Tool nachzog.

> **⚠️ Die Falle:** Das Loch entstand durch die Kombination aus fremdem Text im Prompt und einem Werkzeug mit zu weiten Rechten. Das Modell war dabei austauschbar. Ein Markierer um den Issue-Titel hätte daran wenig geändert. Wer `Bash` und „jeder darf" kombiniert, hat das Tor schon offen.

### Was heute wirklich hilft

Der Stand der Technik ist eine Schichtung mehrerer Maßnahmen. Von billig und sofort bis aufwendig und gründlich:

- **Wenig Rechte (Least Privilege).** Gib dem Agenten nur die Werkzeuge, die er wirklich braucht. Kein `Bash`, wo ein enges Query-Werkzeug reicht. Keine Schreibrechte, wo Lesen genügt.
- **_Allowlists_ (Positivlisten).** Grenze ein, wohin er darf: eine Liste erlaubter Domains, erlaubter Befehle, erlaubter Tabellen.
- **Mensch bei folgenreichen Aktionen.** Alles, was Geld bewegt, löscht oder nach außen schickt, bekommt eine Bestätigung. Anthropic empfiehlt für [Computer-Use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool) genau das, dazu eine isolierte Umgebung mit minimalen Rechten.
- **Strukturelle Abwehr.** Die Forschung geht über Markierer hinaus. [CaMeL](https://arxiv.org/abs/2503.18813) von Google DeepMind trennt Daten- und Kontrollfluss so, dass fremder Inhalt den Programmablauf gar nicht erst steuern kann. Der Code liegt offen.
- **Wächter-Modelle.** Ein zweites, spezialisiertes Modell prüft Ein- und Ausgaben als letzte Schicht. Metas quelloffenes [LlamaFirewall](https://arxiv.org/abs/2505.03574) ist so ein Baustein gegen Prompt Injection und entgleiste Agenten.

Die Antwort auf die Eingangsfrage lautet also: Reine Markierer um den fremden Text sind nicht mehr Stand der Technik, sie sind eine von vielen Schichten, und keine, auf die du dich allein verlassen solltest. Sicherheit entsteht in der Architektur. Ein Markierer am Text genügt nicht.

## Den eigenen Harness bauen?

Nach all dem die gute Nachricht: Den Loop selbst zu bauen, ist schnell gemacht. Ein paar Dutzend Zeilen reichen. Modell aufrufen, auf `tool_use` prüfen, Werkzeug ausführen, `tool_result` zurückschicken, wiederholen. Ich empfehle jedem, das einmal von Hand zu tun. Danach ist „Agent" für dich eine Schleife, die du durchschaut hast.

Für echte Arbeit aber hörst du an genau dieser Stelle auf, alles selbst zu bauen. Das Interessante kommt erst nach dem Loop: Kontext, Recovery und die Sicherheit von oben. Dafür gibt es gepflegte Bausteine. Anthropics *Tool Runner* fährt den Round-Trip automatisch. Das *Agents SDK* von OpenAI bringt den Loop mit. Und das *Model Context Protocol* (MCP) steckt fertige Werkzeuge an, ohne dass du jede Integration neu schreibst.

> **💡 Mein Rat:** Bau den Loop einmal selbst, um ihn zu verstehen. Setz für Produktion auf einen gepflegten Harness, der Kontext, Fehler und Rechte schon durchdacht hat.

## Fazit

Wenn dir das nächste Mal jemand „Claude Code ist zu 98 % keine KI" unter die Nase hält, weißt du, wo der Satz danebenliegt. Der Harness ist viel Code, ja. Aber er ist der stille Arbeiter, der die Urteile des Modells sicher ausführbar macht, oder eben nicht.

Und Harness Engineering? Das ist nichts Neues und schon gar kein Grund für einen Zwei-Stunden-Kurs. Es ist die Grundlage, auf der Prompt, Loop und Graph überhaupt laufen. Das Prompt bestimmt, wie du fragst. Die Schleife arbeitet eine Aufgabe Schritt für Schritt ab. Der Graph verteilt unabhängige Arbeit auf mehrere Zweige. Der Harness ist das, worin das alles läuft.

Mein Rat ist wie immer der undramatische: Bau den kleinen Loop einmal nach, mit zwei Werkzeugen und einem echten API-Key. Danach stell dir bei jedem Agenten, den du irgendwo anschließt, die eine Frage, die wirklich zählt: Was könnte der schlimmste Text, den dieser Agent je liest, ihn tun lassen? Deine Antwort darauf ist dein Harness Engineering.

**Fragen, Feedback, eigene Harness-Geschichten?** Immer her damit, ich freue mich über jede Nachricht.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
