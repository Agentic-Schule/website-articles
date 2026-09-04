---
title: '10 Claude-Code-Befehle, die du kennen solltest'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-09-03
keywords:
  - Claude Code
  - Slash-Befehle
  - Agentic Coding
  - Code-Review
  - Workflows
language: de
header: header.jpg
---

Kennst du `/help`, `/clear` und `/init`? Gut. Und dann?

**Claude Code bringt deutlich mehr Slash-Befehle mit, als die üblichen Einsteiger-Listen zeigen. Hier sind zehn, die ich selbst ständig benutze, jeder mit dem einen Handgriff, der ihn wertvoll macht.**

## Inhalt

[[toc]]

## 1. `/code-review`: der Diff auf dem Prüfstand

Prüft den aktuellen Stand deines Branches auf echte Fehler, wahlweise auch einen PR, einen Branch oder einen Pfad. Den Effort gibst du als erstes Argument mit, etwa `/code-review max`; ohne Angabe gilt der zuletzt getippte Level und sonst der Effort der Sitzung. Je nach Modell und Effort arbeitet der Review seine Blickwinkel nacheinander ab oder fächert sie auf parallele Agenten auf, und mit `ultra` läuft er als Multi-Agenten-Review in der Cloud.

> **💡 Tipp:** `--fix` wendet die Funde direkt im Arbeitsverzeichnis an, `--comment` postet sie als Inline-Kommentare in den PR. Und der Befehl heißt zwar Code-Review, funktioniert aber genauso gut für Texte. Diesen Artikel hier hat er auch gelesen.

## 2. `/security-review`: die Sicherheitsbrille

Macht einen reinen Sicherheits-Review der anstehenden Änderungen auf dem Branch, ganz ohne Argumente. Das Besondere ist die Disziplin dahinter: Mehrere Prüf-Perspektiven suchen Schwachstellen, danach filtert eine eigene Runde die falschen Alarme aus. Gemeldet wird nur, was mit hoher Konfidenz wirklich ausnutzbar wäre.

> **💡 Tipp:** Vor jedem Merge in Richtung Produktion einmal laufen lassen. Ein leerer Bericht ist hier ein gutes Ergebnis und kein enttäuschendes.

## 3. `/deep-research`: die Recherche-Maschine

Der mitgelieferte Workflow für Recherchefragen: fächert Websuchen über mehrere Suchwinkel auf, holt die Quellen, prüft sie gegeneinander und liefert am Ende einen zitierten Bericht statt einer einzelnen Trefferliste.

> **💡 Tipp:** Formuliere die Frage so konkret wie möglich, samt Kontext und Zeitraum. Der Workflow zerlegt sie dann selbst in Suchwinkel. Während er läuft, arbeitest du einfach weiter.

## 4. `/loop`: die Schleife

Wiederholt einen Prompt im festen Intervall (`/loop 5m prüfe den Deploy`) oder lässt Claude selbst takten, wenn du das Intervall weglässt. Damit erledigt der Agent harte Aufgaben in vielen Anläufen, notfalls die ganze Nacht gegen die CI. Was dahintersteckt, habe ich in einem eigenen Artikel auseinandergenommen: [Loop Engineering](https://agentic.schule/blog/2026-07-loop-engineering).

> **💡 Tipp:** Die Abbruchbedingung ist die eigentliche Arbeit. „Bis alles grün ist" funktioniert, „bis es gut ist" dreht sich im Kreis.

## 5. `/goal`: das Ziel statt der Schleife

Setzt eine Abschlussbedingung, und Claude arbeitet ohne Rückfragen weiter, bis sie erfüllt ist. Der Clou: Ob die Bedingung hält, beurteilt nach jedem Zug ein frisches Modell, und nicht dasselbe, das gerade die Arbeit gemacht hat.

> **💡 Tipp:** Formuliere die Bedingung so, dass sie sich am Gesprächsverlauf belegen lässt, etwa „alle Tests in `test/auth` laufen durch". Der Prüfer ruft selbst keine Werkzeuge auf.

## 6. `/simplify`: der Aufräumdienst

Geht über den geänderten Code und räumt auf: Wiederverwendung, Vereinfachung, Effizienz. Die Fixes wendet er direkt an. Bugs jagt er ausdrücklich nicht, dafür ist `/code-review` zuständig.

> **💡 Tipp:** Direkt nach einem größeren Feature laufen lassen, bevor der PR entsteht. Der Diff wird kleiner und lesbarer, ohne dass sich das Verhalten ändert.

## 7. `/model`: mehr als nur Modellwahl

Wählt das Modell der Sitzung, klar. Weniger bekannt: Im selben Dialog steckt auch der Effort-Regler, mit den Pfeiltasten bis hinauf zu `ultracode`. Modell und Denk-Tiefe stellst du also an einer Stelle ein.

> **💡 Tipp:** Welches Modell mit welchem Effort läuft, entscheidet spürbar mit, wie stark Befehle wie `/code-review` parallelisieren. Details dazu im [Graph-Engineering-Artikel](https://agentic.schule/blog/2026-09-graph-engineering).

## 8. `/effort`: die Denk-Tiefe der Sitzung

Stellt ein, wie gründlich Claude arbeitet, von `low` bis `xhigh`, auf entsprechend fähigen Modellen zusätzlich `ultracode`. Damit plant Claude für jede größere Aufgabe von allein einen Workflow, statt zu warten, bis du fragst. Die Wahl wird als Standard für neue Sitzungen gespeichert.

> **💡 Tipp:** `xhigh` für knifflige Aufgaben, danach bewusst wieder herunterschalten. Mehr Effort heißt immer auch mehr Tokens und mehr Wartezeit.

## 9. `/mcp`: der Blick auf die Werkzeugkiste

Öffnet die Übersicht deiner angebundenen MCP-Server, also der externen Werkzeuge, die Claude neben den eingebauten benutzt: Browser-Steuerung, APIs, Datenbanken, was immer du registriert hast.

> **💡 Tipp:** Wenn ein Werkzeug „plötzlich fehlt", ist das der erste Anlaufpunkt: nachsehen, ob der Server läuft und verbunden ist.

## 10. `/remote-control`: die Sitzung in der Hosentasche

Verbindet die laufende Sitzung mit claude.ai/code oder der Claude-App: QR-Code mit dem Handy scannen, und du führst dieselbe Sitzung am Telefon oder im Browser weiter, während sie auf deinem Rechner läuft. Perfekt, um einen langen Lauf vom Sofa aus zu begleiten oder unterwegs eine Rückfrage zu beantworten, statt sie bis zum Feierabend liegen zu lassen.

> **💡 Tipp:** Es gibt auch die große Variante: `claude remote-control` im Terminal läuft als dauerhafter Server und nimmt mehrere Sitzungen gleichzeitig an.

## Fazit

Zehn Befehle, ein Muster: Claude Code kann längst mehr, als die meisten davon abrufen. Die Reviews prüfen, die Schleifen und Ziele halten durch, die Workflows fächern auf, `/model` und `/effort` bestimmen, mit wie viel Hirnschmalz das alles passiert, und per Remote Control schaust du vom Handy aus zu. Nimm dir einen davon pro Tag vor, dann hast du in zwei Wochen ein anderes Werkzeug in der Hand.

**Welcher fehlt dir in der Liste?** Immer her damit, ich freue mich über jede Nachricht.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
