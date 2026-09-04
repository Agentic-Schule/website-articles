---
title: '10 Claude-Code-Befehle, die du kennen solltest'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-09-23
keywords:
  - Claude Code
  - Slash-Befehle
  - Agentic Coding
  - Code-Review
  - Workflows
language: de
header: header.jpg
---

Der `/Schrägstrich` ist die mächtigste Taste in Claude Code, denn damit startest du einen Slash-Command. Los geht's!

**Claude Code bringt deutlich mehr Slash-Befehle mit, als die üblichen Einsteiger-Listen zeigen. Hier sind zehn, die ich selbst ständig benutze, jeder mit dem einen Handgriff, der ihn wertvoll macht.**

## Inhalt

[[toc]]

## 1. `/code-review`: der Diff auf dem Prüfstand

Prüft den aktuellen Stand deines Branches auf echte Fehler, wahlweise auch einen PR, einen Branch oder einen Pfad. Den Effort gibst du als erstes Argument mit, etwa `/code-review max`; ohne Angabe gilt der zuletzt getippte Level und sonst der Effort der Sitzung. Je nach Modell und Effort arbeitet der Review seine Blickwinkel nacheinander ab oder fächert sie auf parallele Agenten auf, und mit `ultra` läuft er als Multi-Agenten-Review in der Cloud.

> **💡 Tipp:** `--fix` wendet die Funde direkt im Arbeitsverzeichnis an, `--comment` postet sie als Inline-Kommentare in den PR. Und der Befehl heißt zwar Code-Review, funktioniert aber genauso gut für Texte. Diesen Artikel hier hat er auch gelesen.

## 2. `/security-review`: die Sicherheitsbrille

Macht einen reinen Sicherheits-Review der anstehenden Änderungen auf dem Branch, ganz ohne Argumente. Das Besondere ist die Disziplin dahinter: Mehrere Prüf-Perspektiven suchen Schwachstellen, danach filtert eine eigene Runde die falschen Alarme aus. Gemeldet wird nur, was mit hoher Konfidenz wirklich ausnutzbar wäre. Zusammen mit `/code-review` gehören die beiden zu den wichtigsten Leitplanken, wenn die KI den Code schreibt, siehe dazu meinen [Vibe-Coding-Artikel](https://agentic.schule/blog/2026-09-vibe-coding).

> **💡 Tipp:** Vor jedem Merge in Richtung Produktion einmal laufen lassen. Ein leerer Bericht ist hier ein gutes Ergebnis und kein enttäuschendes.

## 3. `/deep-research`: die Recherche-Maschine

Der einzige mitgelieferte Workflow, und ein Schaustück dafür, was Claude Code an Orchestrierung kann: Er fächert Websuchen über mehrere Suchwinkel auf, holt die Quellen, prüft die Behauptungen gegeneinander und liefert am Ende einen zitierten Bericht statt einer Trefferliste. Wie so ein Workflow aufgebaut ist, steht im [Graph-Artikel](https://agentic.schule/blog/2026-09-graph-engineering).

> **💡 Tipp:** Formuliere die Frage so konkret wie möglich, samt Kontext und Zeitraum. Der Workflow zerlegt sie dann selbst in Suchwinkel. Während er läuft, arbeitest du einfach weiter.

## 4. `/loop`: die Schleife

Wiederholt einen Prompt im festen Intervall (`/loop 5m prüfe den Deploy`) oder lässt Claude selbst takten, wenn du das Intervall weglässt. Damit erledigt der Agent harte Aufgaben in vielen Anläufen, notfalls die ganze Nacht gegen die CI. Was dahintersteckt, habe ich in einem eigenen Artikel auseinandergenommen: [Loop Engineering](https://agentic.schule/blog/2026-09-loop-engineering).

> **💡 Tipp:** Die Abbruchbedingung ist die eigentliche Arbeit. „Bis die CI wieder grün ist" funktioniert, „bis es gut ist" dreht sich im Kreis.

## 5. `/goal`: das Ziel statt der Schleife

Setzt eine Abschlussbedingung, und Claude arbeitet ohne Rückfragen weiter, bis sie erfüllt ist. Der Clou steckt in der Kontrolle: Nach jedem Zug entscheidet laut Beschreibung „a separate evaluator", ob die Bedingung hält, und nicht die Instanz, die gerade selbst gearbeitet hat.

> **💡 Tipp:** Formuliere die Bedingung so, dass sie sich am Gesprächsverlauf belegen lässt, etwa „alle Tests in `test/auth` laufen durch". Was der Prüfer nicht sehen kann, kann er auch nicht abnehmen.

## 6. `/simplify`: der Aufräumdienst

Geht über den geänderten Code und räumt auf: Wiederverwendung, Vereinfachung, Effizienz und die richtige Flughöhe der Abstraktionen. Die Fixes wendet er direkt an. Bugs jagt er ausdrücklich nicht, in der eigenen Beschreibung steht wörtlich „it does not hunt for bugs; use /code-review for that".

> **💡 Tipp:** Direkt nach einem größeren Feature laufen lassen, bevor der PR entsteht. Der Diff wird kleiner und lesbarer, ohne dass sich das Verhalten ändert. Der Agent führt bei mir gerne eine Deduplizierung durch und entfernt doppelten Code. Feine Sache.

## 7. `/model`: mehr als nur Modellwahl

Wählt das Modell der Sitzung, klar. Weniger bekannt: Im selben Dialog steckt auch der Effort-Regler, mit den Pfeiltasten bis hinauf zu `ultracode`. Modell und Denk-Tiefe stellst du also an einer Stelle ein.

Noch weniger bekannt: Dein aktuelles Modell wird an die Subagenten deiner dynamischen Workflows vererbt, sofern das Workflow-Skript nichts anderes vorgibt. Wenn du also nicht dein gesamtes Fable-5-Limit in einer einzigen Sitzung verschleudern willst, stell hier ein Modell wie Opus oder sogar Sonnet ein, sobald die Aufgabe einfach genug ist. Im Skript selbst lässt sich beides pro Agent erzwingen, Modell und Effort. Für zwanzig Agenten, die stumpf eine Webseite bedienen, gehört genau das ins Skript: kleines Modell, niedriger Effort, teures Denken nur dort, wo es zählt.

> **💡 Tipp:** Welches Modell mit welchem Effort läuft, entscheidet spürbar mit, wie stark Befehle wie `/code-review` parallelisieren. Details dazu im [Graph-Engineering-Artikel](https://agentic.schule/blog/2026-09-graph-engineering).

## 8. `/effort`: die Denk-Tiefe der Sitzung

Stellt ein, wie gründlich Claude arbeitet, von `low` bis `xhigh`, dazu `auto` für die Voreinstellung des Modells. Auf entsprechend fähigen Modellen kommt `ultracode` obendrauf: laut Beschreibung „xhigh + dynamic workflow orchestration". Damit plant Claude für größere Aufgaben von allein einen Workflow, statt zu warten, bis du fragst.

> **💡 Tipp:** Die normalen Stufen bleiben als Standard für neue Sitzungen gespeichert, `ultracode` gilt ausdrücklich nur für die laufende Sitzung. Praktisch: Du kannst dich für eine harte Aufgabe hochschalten, ohne zu vergessen, danach wieder herunterzugehen. Und mehr Effort heißt immer auch mehr Tokens und mehr Wartezeit.

## 9. `/mcp`: der Blick auf die Werkzeugkiste

Öffnet die Übersicht deiner angebundenen MCP-Server, also der externen Werkzeuge, die Claude neben den eingebauten benutzt: Browser-Steuerung, APIs, Datenbanken, was immer du registriert hast.

> **💡 Tipp:** Wenn ein Werkzeug „plötzlich fehlt", ist das der erste Anlaufpunkt: nachsehen, ob der Server läuft und verbunden ist.

## 10. `/remote-control`: die Sitzung in der Hosentasche

Verbindet die laufende Sitzung mit claude.ai/code oder der Claude-App: QR-Code mit dem Handy scannen, und du führst dieselbe Sitzung am Telefon oder im Browser weiter, während sie auf deinem Rechner läuft. Perfekt, um einen langen Lauf vom Sofa aus zu begleiten oder unterwegs eine Rückfrage zu beantworten, statt sie bis zum Feierabend liegen zu lassen. Meine Bodenstation, den Mac mini, steuere ich genau so ([mehr dazu hier](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini)).

> **💡 Tipp:** Zum Tippen reicht `/rc`, das ist der offizielle Alias.

Daneben gibt es den gleichnamigen CLI-Befehl `claude remote-control`, und der macht etwas anderes: Der Slash-Befehl hängt die eine Sitzung ans Handy, die gerade vor dir läuft. Der CLI-Befehl startet stattdessen einen Host, bei dem du vom Handy aus **neue** Sitzungen aufmachst. Die Hilfe (`claude remote-control --help`) zeigt, wie weit das geht: `--spawn` wählt zwischen `same-dir`, `worktree` und `session`, jede neue Sitzung bekommt im Worktree-Modus also ihren eigenen Git-Arbeitsbereich, `--capacity` deckelt die gleichzeitigen Sitzungen (Standard 32), `--permission-mode` legt die Rechte der so gestarteten Sitzungen fest, und `--continue` hängt sich wieder an den zuletzt hier genutzten Host. Wer nur seine laufende Sitzung aufs Sofa mitnehmen will, bleibt bei `/rc`. Und wer seine Sitzungen lieber lokal im Terminal nebeneinander hat (also ich), jede in einem eigenen tmux-Window, dem nützt der Host leider ebenfalls nichts.

## Fazit

Zehn Befehle, ein Muster: Claude Code kann längst mehr, als die meisten davon abrufen. Die Reviews prüfen, die Schleifen und Ziele halten durch, die Workflows fächern auf, `/model` und `/effort` bestimmen, mit wie viel Hirnschmalz das alles passiert, und per Remote Control schaust du vom Handy aus zu. Drück beim nächsten Start einfach den Schrägstrich und lies die Liste einmal von oben nach unten. Diese zehn sind meine Auswahl, deine sieht am Ende bestimmt anders aus. Und wenn du sie lieber gemeinsam durchgehst, statt allein: Genau das machen wir im Kurs der [agentic.schule](https://agentic.schule/build-with-ai/online), am eigenen Projekt.

> **💡 Bonus, und heute selbst gelernt:** `/usage` zeigt Kosten, Plan-Verbrauch und was gerade auf deine Limits einzahlt. Es hört auch auf `/cost` und `/stats`. Wer viel mit Agenten arbeitet, sollte da öfter draufschauen, als ich es heute getan habe. 😅

**Welcher fehlt dir in der Liste?** Immer her damit, ich freue mich über jede Nachricht.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
