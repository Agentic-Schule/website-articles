---
title: 'Zuruf zwischen Terminals: Claude-Code-Sitzungen schreiben sich Nachrichten'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-09-24
keywords:
  - Claude Code
  - Cross-Session Messaging
  - SendMessage
  - ListAgents
  - Agentic Coding
  - Parallele Sitzungen
language: de
header: header.jpg
---

Deine Agenten arbeiten an überschneidenden Aufgaben, etwa an zwei Features für dasselbe Projekt. Agent A hat eine Nachricht für Agent B. Bisher musstest du dabei den Postboten spielen, mit Kopieren und Einfügen. Damit ist jetzt Schluss.

**Seit August können sich Claude-Code-Sitzungen gegenseitig Nachrichten schicken. Claude reicht die Erkenntnis selbst weiter, statt dass du sie von einem Fenster ins nächste kopierst (oder eine Datei als Briefkasten missbrauchst: schreib nach `/tmp/nachricht.md`, lies aus `/tmp/nachricht.md`, was am Ende derselbe Botengang ist). Das Feature heißt Cross-Session Messaging, es ist standardmäßig an, und es ist bewusst schmal gebaut: Es überträgt Text, sonst nichts.**

## Inhalt

[[toc]]

## Was das Feature tut

Zwei neue Werkzeuge stecken dahinter. `ListAgents` findet heraus, welche Sitzungen erreichbar sind, `SendMessage` stellt die Nachricht zu. Beide ruft Claude selbst auf, du tippst keines davon.

Die [offizielle Doku](https://code.claude.com/docs/en/cross-session-messaging) beschreibt den Zweck mit einem Beispiel, das jeder kennt, der mit mehreren Fenstern arbeitet: „When a change in one session breaks what another is building on, Claude can warn that session before you notice." Wer gerade das Datenbankschema umbaut, gibt dem Kollegen im anderen Fenster Bescheid, der noch auf dem alten Stand entwickelt.

Es ist ein junges Feature. Eingeführt wurde es mit Claude Code 2.1.224 am 7. August 2026, zunächst für macOS und Linux, Windows folgte wenige Wochen später. Innerhalb einer Sitzung gab es `SendMessage` schon länger, um Subagenten weiterzureichen. Neu ist der Weg über Sitzungsgrenzen hinweg.

## Der wichtigste Satz der Doku

Bevor es praktisch wird, die eine Einschränkung, die alles andere erklärt:

> „A message is a piece of text one Claude writes to another, never the sender's conversation history or files. To move a whole conversation or its context, resume the session instead."

Übertragen wird also **nur Text**. Keine Historie, keine Dateien, kein Kontext. Wer erwartet, dass die andere Sitzung anschließend weiß, worüber die erste den ganzen Vormittag nachgedacht hat, erwartet das Falsche. Wenn du eine ganze Konversation woanders fortsetzen willst, ist `--resume` das richtige Werkzeug.

Das klingt nach einer Schwäche, ist aber genau der Grund, warum das Feature im Alltag funktioniert: Eine Nachricht ist ein Zuruf. Kurz, klar, ohne Ballast. Und für das, was überleben soll, gibt es weiterhin die Platte: Notizen, Recherche-Archive, Dateien im Repository.

## So benutzt du es

In der Praxis sagst du einfach, was die andere Sitzung wissen soll, und Claude kümmert sich um den Rest, vom Heraussuchen der richtigen Sitzung bis zum Formulieren der Nachricht:

> **🛠️ Selbst ausprobieren**
> ```text
> Frag die Sitzung in meinem anderen Terminal, ob die Migration durch ist
> ```

Willst du die Ziel-Sitzung genau benennen, erwähnst du sie mit `@` und den ersten Buchstaben ihres Namens, so wie du einen Subagenten erwähnst:

```text
Sag @api-worker, dass die Schema-Migration durch ist
```

Stellt er sich dumm und behauptet, er könne das nicht (ja, das kommt vor), nenn ihm einfach die Werkzeuge beim Namen: `ListAgents`, um die andere Sitzung zu finden, `SendMessage`, um die Nachricht zuzustellen. Danach klappt es hoffentlich.

Wer selbst nachsehen will, wer gerade erreichbar ist, tippt `/list-agents`. Die erste Zeile ist der eigene Name, also der, unter dem dich die anderen ansprechen. Darunter stehen die Subagenten der eigenen Sitzung, andere lokale Sitzungen und, sofern Remote Control verbunden ist, auch deine Sitzungen auf anderen Rechnern und im Web. Dazu kommen die Mitglieder eines Agenten-Teams, falls du eines betreibst. Das ist ein eigenes Feature: eine Gruppe von Sitzungen, die Claude selbst aufsetzt und beaufsichtigt.

Die eigene Inbox-Adresse zeigt übrigens `/status` in der Zeile „Peer address".

## Der Name ist die Adresse

Damit zur Frage, die sich sofort stellt: Woher kommt der Name, unter dem eine Sitzung angesprochen wird? Die Antwort: aus dem Namen der Konversation! Claude Code vergibt beim Start einen lesbaren Vorschlag, und du kannst ihn jederzeit ändern:

- `/rename` (Alias `/name`) benennt die laufende Konversation um, also deine aktuelle Sitzung.
- `claude --name <name>` setzt den Namen schon beim Start.
- Nimmst du einen Plan an, benennt sich die Sitzung automatisch nach dessen Inhalt.

Dass der Konversationsname wirklich die Adresse ist, sieht man an den Fehlerbehebungen im Changelog. Dort steht wörtlich, dass ein zurückgesetzter `/rename`-Name „broke addressing the session by its new name". Wer also mehrere Sitzungen parallel fährt, sollte ihnen früh sprechende Namen geben. Das ist der eigentliche Trick an dem Feature.

> **💡 Tipp:** Heißen zwei Sitzungen gleich, reicht der Name nicht mehr. `ListAgents` hängt in dem Fall ein kurzes Kürzel in eckigen Klammern an, und erst damit landet die Nachricht bei der richtigen. Sprechende Namen sparen dir diesen Umweg.

## Wie eine Nachricht ankommt

Die Zustellung ist rücksichtsvoller gebaut, als man erwartet. Arbeitet die Ziel-Sitzung gerade, liest Claude die Nachricht **zwischen zwei Werkzeug-Aufrufen**, ein laufendes Werkzeug wird also nie unterbrochen. Ist die Sitzung im Leerlauf, hat also ihre Runde beendet und nichts in der Warteschlange, startet die Nachricht dort eine neue Runde.

Eine Bedingung gibt es: Der Prozess muss laufen. Eine Sitzung taucht laut Doku überhaupt erst in der Liste auf, wenn sie ihren Inbox-Socket hält. Wer das Terminal geschlossen hat, ist nicht erreichbar. Davorsitzen musst du allerdings nicht, und Hintergrund-Sitzungen zählen genauso.

Sichtbar wird das als einzeilige Vorschau in der Konversation, etwa so:

```text
› Message from @api-worker: Schema migration finished (ctrl+o to expand)
```

Mit `Ctrl+O` liest du den vollen Text, in einer Sitzung mit `--verbose` steht er ohnehin komplett da. Verkürzt wird nur die Anzeige: Claude liest immer die ganze Nachricht.

Eine Sache, die man wissen sollte, bevor man das Feature großzügig einsetzt: Eine zugestellte Nachricht zählt aufs Kontingent wie ein Prompt, den du selbst tippst. Im Endeffekt ist es auch nichts anderes, nämlich ein weiterer Prompt aus einer zusätzlichen Quelle. Claude weiß dabei allerdings, dass nicht du ihn getippt hast, sondern eine andere Sitzung. Erfahrungsgemäß ist ein starkes Modell an dieser Stelle zu Recht skeptischer und prüft erst einmal alles selbst nach.

Das ist so gewollt: Eine Nachricht aus einer anderen Sitzung trägt ausdrücklich **keine Nutzer-Autorität**. Im Changelog steht dazu wörtlich, dass weitergereichte Nachrichten „no longer carry user authority" und die empfangende Seite weitergereichte Rechte-Anfragen ablehnt. Wer also hofft, sich über eine zweite Sitzung eine Genehmigung zu erschleichen, die in der ersten verweigert wurde, hat schlechte Karten. Genau so gehört es sich auch.

## Der Idle-Melder

Für lange Läufe gibt es einen zweiten Weg, der ohne Nachfragen auskommt: Claude kann eine andere Sitzung auf derselben Maschine bitten, sich **einmalig** zu melden, sobald sie das nächste Mal in den Leerlauf geht oder endet.

> **🛠️ Selbst ausprobieren**
> ```text
> Sag mir Bescheid, wenn die Migrations-Sitzung fertig ist
> ```

Das ist eine Anmeldung, kein Dauerabo und kein Polling. Im Changelog heißt der Parameter dahinter `notify_when_idle`, beschrieben als „opt-in, one-shot, no polling". Statt alle paar Minuten nachzuschauen, bekommst du genau eine Rückmeldung. Wer regelmäßig lange Läufe nebenher fährt, etwa auf einer eigenen Maschine wie in meinem [Bodenstation-Artikel](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini), spart sich damit das ständige Kontrollieren.

Zwei Einschränkungen gehören dazu. Es gibt nur dieses eine Ereignis, nämlich Leerlauf oder Ende, und keine frei wählbaren Auslöser. Und es funktioniert nur zwischen Sitzungen auf derselben Maschine. Wer auf etwas Fachliches warten will, etwa auf grüne Tests, trägt das der anderen Sitzung stattdessen als ganz normale Nachricht auf. Dann meldet sie sich, wenn es so weit ist.

## Was dich schützt

Ein Feature, bei dem andere Sitzungen Text in deine schreiben, wirft berechtigte Fragen auf. Die Antworten stehen in der Doku, und sie sind beruhigend konkret.

**Der Weg bleibt lokal.** Nachrichten zwischen Sitzungen auf derselben Maschine laufen über einen Socket pro Sitzung, wörtlich „never through Anthropic servers".

**Rechte bleiben getrennt.** Die Doku formuliert es als harte Grenze: „Permission boundaries stay per-session." Claude ist angewiesen, keine andere Sitzung um etwas zu bitten, das in der eigenen Sitzung verboten wäre, und die empfangende Sitzung wendet ihre eigenen Regeln auf alles an, worum die Nachricht bittet.

**Du bestimmst, was hereinkommt.** Die Einstellung `crossSessionInbound` kennt drei Werte: `accept` stellt zu, `hold` legt die Nachricht beiseite, bis du sie freigibst, `refuse` verwirft sie ohne Zustellung. Wählen kannst du das auch im `/config`-Dialog.

**Die Maschinengrenze lässt sich verriegeln.** Mit `isolatePeerMachines: true` verlangt Claude Code deine ausdrückliche Zustimmung, bevor eine Nachricht den Rechner verlässt, und zwar selbst im `bypassPermissions`-Modus.

**Ganz abschalten geht auch**, in beide Richtungen getrennt: `crossSessionInbound: "refuse"` fürs Empfangen, Deny-Regeln für `SendMessage` und `ListAgents` fürs Senden. Für Organisationen lässt sich beides zentral setzen. Ein Detail, das man dabei kennen sollte: Wer `SendMessage` verbietet, nimmt sich auch die Nachrichten an die eigenen Subagenten und an die Mitglieder eines Agenten-Teams, weil dasselbe Werkzeug alle drei Wege bedient.

## Die Grenzen

Ein paar Eigenschaften des Kanals sind fest eingebaut, und alle drei ergeben Sinn:

**Nur Klartext.** Strukturierte Protokoll-Nachrichten bleiben innerhalb eines Agenten-Teams.

**Größenlimit.** Wird die Nachricht zu groß, weist Claude Code sie schon beim Absender ab, bevor sie losgeht. Die Obergrenze liegt bei rund einer Million Zeichen, du wirst sie im Alltag nicht sehen.

**Schleifen laufen sich tot.** Wiederholungen an dieselbe Sitzung werden gedrosselt, identische Nachrichten innerhalb kurzer Zeit verworfen, und die Warteschlange fasst höchstens fünfzig Nachrichten. Die Doku sagt trocken: „A message loop between two sessions therefore stops on its own." Zwei Sitzungen, die sich gegenseitig hochschaukeln, sind also ein gelöstes Problem.

## Wann du etwas anderes nehmen solltest

Die Doku grenzt das Feature selbst ab, und diese Liste ist es wert, gelesen zu werden, bevor man alles mit Nachrichten löst:

- Willst du **eine Konversation woanders fortsetzen**, nimm `--resume`.
- Willst du ein **koordiniertes Team**, das Claude selbst aufsetzt und beaufsichtigt, nimm Agent Teams. Die sind allerdings noch experimentell und standardmäßig aus, du musst sie über die Umgebungsvariable `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` einschalten. Ein eigener Artikel dazu ist in Arbeit.
- Willst du **viele Sitzungen an einem Ort beobachten**, nimm die Agent View.
- Willst du **selbst vom Handy steuern**, nimm Remote Control, siehe dazu die zehn Befehle in meinem [Befehle-Artikel](https://agentic.schule/blog/2026-09-claude-code-befehle).
- Willst du **externe Ereignisse hineinreichen**, etwa CI-Ergebnisse, nimm Channels.

Cross-Session Messaging ist für den Fall dazwischen: unabhängige Sitzungen, die du selbst gestartet hast und selbst steuerst, und von denen eine mitten in der Arbeit etwas erfährt, das eine andere braucht.

> **💡 Merke:** Die Nachricht ist der Zuruf, die Datei ist das Ergebnis. Alles, was groß ist oder überleben soll, gehört weiterhin auf die Platte.

## Fazit

Cross-Session Messaging ist ein kleines Feature mit einer klaren Aufgabe, und es ist genau deshalb gut. Es kopiert keine Kontexte, es synchronisiert keine Zustände, es baut kein verteiltes System. Es reicht einen Satz von einem Terminal ins nächste, im richtigen Moment, ohne dass du zwischen Fenstern wechselst.

Wer ohnehin mit mehreren Sitzungen arbeitet, etwa mit [git worktrees](https://agentic.schule/blog/2026-09-agentic-coding-git-worktrees) pro Aufgabe, bekommt damit das fehlende Stück: Die Zweige wissen voneinander. Und der erste Schritt dorthin ist ein einziger Befehl, nämlich `/rename` in jeder Sitzung, damit deine Fenster sprechende Namen haben.

**Was war die erste Nachricht, die deine Sitzungen einander geschickt haben?** Ich sammle die schönsten.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
