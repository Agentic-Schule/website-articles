---
title: 'Prompt Engineering und Context Engineering: das Handwerk hinter den Buzzwords'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-09-03
keywords:
  - Prompt Engineering
  - Context Engineering
  - Claude Code
  - Agentic Coding
  - Kontextfenster
  - Evals
  - LLM
language: de
header: header.jpg
---

Erst hieß es, Prompt Engineering sei der Job der Zukunft. Jetzt heißt es, Context Engineering löse es ab. Was ist dran?

**Beides sind Hype-Begriffe, und hinter beiden steckt trotzdem echtes Handwerk. Prompt Engineering: Formuliere die Anweisung klar, belege sie mit Beispielen und miss das Ergebnis. Context Engineering: Kuratiere alles, was das Modell zu sehen bekommt, denn das Kontextfenster ist eine endliche Ressource. Das eine schreibt die Anweisung, das andere bewirtschaftet das Fenster drumherum. Einen Kurs brauchst du für keins von beiden, die Primärquellen sind frei zugänglich.**

Das hier ist der Auftakt der kleinen Serie über die Engineering-Begriffe der Agenten-Welt. Die beiden anderen Teile sind schon erschienen: die Schleife ([Loop Engineering](https://agentic.schule/blog/2026-07-loop-engineering)) und der Graph ([Graph Engineering](https://agentic.schule/blog/2026-09-graph-engineering)). Jeder Teil ist für sich lesbar.

## Inhalt

[[toc]]

## Woher die Begriffe kommen

Prompt Engineering ist der ältere der beiden Begriffe und längst etabliert: Jeder große Anbieter pflegt eine eigene Anleitung dazu, [Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) genauso wie [OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering) und [Google](https://ai.google.dev/gemini-api/docs/prompting-strategies). Wer es akademisch mag: Der Survey [„The Prompt Report"](https://arxiv.org/abs/2406.06608) katalogisiert allein für Text eine Taxonomie von 58 Prompting-Techniken.

Context Engineering ist dagegen jung, und seine Herkunft lässt sich auf die Woche genau datieren. Am 19. Juni 2025 schreibt Shopify-Chef Tobi Lütke [auf X](https://x.com/tobi/status/1935533422589399127): „I really like the term “context engineering” over prompt engineering. It describes the core skill better: the art of providing all the context for the task to be plausibly solvable by the LLM." Sechs Tage später legt Andrej Karpathy [mit seinem „+1"](https://x.com/karpathy/status/1937902205765607626) nach und definiert: „context engineering is the delicate art and science of filling the context window with just the right information for the next step". Im September zieht Anthropic mit einem eigenen [Engineering-Beitrag](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) nach und erklärt den Begriff zur offiziellen Linie: „At Anthropic, we view context engineering as the natural progression of prompt engineering."

Zur Einordnung: Das ist Anthropics Rahmung, kein Industriestandard. Es ist aber die brauchbarste Definition, die es derzeit gibt, und an ihr arbeite ich mich in diesem Artikel entlang.

## Prompt Engineering: Handwerk mit Messschieber

Die Anthropic-Doku beschreibt Prompt Engineering als empirische, iterative Disziplin. Bevor du überhaupt am Prompt feilst, brauchst du laut [Overview-Seite](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) drei Dinge: klare Erfolgskriterien, eine Möglichkeit, empirisch dagegen zu testen, und einen ersten Entwurf. Dann läuft der Zyklus: Testfälle schreiben, Prompt bauen, gegen die Tests verfeinern, validieren, ausliefern. Die Doku nennt diesen Kreislauf wörtlich „central to prompt engineering".

Das klingt unspektakulär, und genau das ist der Punkt: Prompt Engineering ist in erster Linie Messarbeit. Beim Testdesign empfiehlt Anthropic ausdrücklich Masse mit automatischer Bewertung: „More questions with slightly lower signal automated grading is better than fewer questions with high-quality human hand-graded evals."

Und die Doku zieht selbst die Grenze: „Not every success criteria or failing eval is best solved by prompt engineering." Latenz und Kosten verbesserst du oft leichter über die Modellwahl als über den Prompt. Ein Werkzeug, das seine eigenen Grenzen benennt, ist ein gutes Zeichen für die Quelle.

## Die Techniken, die tragen

Anthropic pflegt alle Techniken auf einer einzigen Seite, den [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), von der Doku selbst „the living reference" genannt. Der Kern in vier Regeln:

- **Sei explizit.** Gewünschtes Verhalten ausdrücklich anfordern, statt es das Modell aus vagen Formulierungen raten zu lassen: „If you want "above and beyond" behavior, explicitly request it".
- **Liefere das Warum mit.** Eine Anweisung mit Begründung trifft besser, denn „Claude is smart enough to generalize from the explanation".
- **Zeige Beispiele.** Wenige gut gewählte Beispiele (*Few-Shot-Prompting*) sind laut Doku eine der zuverlässigsten Methoden, Format, Ton und Struktur zu steuern. Der Tipp dort: drei bis fünf Stück, relevant und divers, eingepackt in `<example>`-Tags.
- **Strukturiere mit XML-Tags.** `<instructions>`, `<context>`, `<input>`: Wenn ein Prompt Anweisungen, Kontext, Beispiele und variable Eingaben mischt, verhindern Tags, dass das Modell sie durcheinanderwirft.

Dazu eine Anordnung, die kaum jemand kennt: Bei langen Eingaben gehören die Dokumente an den Anfang und die Frage ans Ende. Laut Anthropic verbessert die Frage am Ende die Antwortqualität in internen Tests um bis zu 30 Prozent, gerade bei mehreren Dokumenten. Die Methodik dahinter ist nicht veröffentlicht, die Richtung deckt sich aber mit der Forschung: Das Paper [„Lost in the Middle"](https://arxiv.org/abs/2307.03172) zeigt, dass Modelle Informationen am Anfang und am Ende des Kontexts deutlich besser abrufen als in der Mitte.

> **💡 Historischer Fußabdruck:** Schon im September 2023, zu Zeiten von Claude 2, hat Anthropic [Long-Context-Prompting vermessen](https://www.anthropic.com/news/prompting-long-context). Zwei Techniken halfen: das Modell erst relevante Zitate herausschreiben lassen, dann antworten, plus kontextbezogene Beispiele. Anthropic rahmte den Effekt damals als „36% reduction in errors". Ein datierter Datenpunkt aus einer früheren Modell-Ära, aber die Zitate-Technik lebt in den heutigen Best Practices weiter.

## Context Engineering: die Fortsetzung

Warum reicht der gute Prompt nicht mehr? Weil ein Agent nicht nur einen Prompt sieht. In seinem Kontextfenster stapeln sich System-Prompt, Werkzeug-Beschreibungen, Dateiinhalte, Suchergebnisse und der gesamte bisherige Verlauf. Anthropic definiert Context Engineering deshalb als „the set of strategies for curating and maintaining the optimal set of tokens (information) during LLM inference".

Der Gegenspieler hat auch einen Namen: *Context Rot*. „as the number of tokens in the context window increases, the model’s ability to accurately recall information from that context decreases", so der Beitrag. Mehr Kontext ist also nicht automatisch besser, ab einem Punkt wird er schlechter.

Daraus folgt das Leitprinzip, und es ist herrlich unbequem: „finding the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome". Drei Konsequenzen aus dem Beitrag:

- **System-Prompts auf der richtigen Flughöhe.** Zwischen zwei Fehlerbildern: hart verdrahtete Wenn-dann-Logik, die bei jeder Änderung bricht, und vages Blabla, das keine Signale gibt. Gesucht ist die Mitte, spezifisch genug zum Steuern, flexibel genug zum Denken.
- **Weniger Werkzeuge, klar getrennt.** Aufgeblähte Tool-Sammlungen mit überlappenden Zuständigkeiten sind laut Anthropic eines der häufigsten Fehlerbilder: „If a human engineer can't definitively say which tool should be used in a given situation, an AI agent can't be expected to do better."
- **Beispiele statt Regelkataloge.** Wenige kanonische Beispiele steuern das Verhalten besser als eine Litanei aus Edge Cases. Die Doku bringt es auf die schönste Formel des ganzen Themas: „For an LLM, examples are the “pictures” worth a thousand words."

Nebenbei ist das Thema inzwischen im Modell selbst angekommen: Claude Sonnet 5, Sonnet 4.6, Sonnet 4.5 und Haiku 4.5 verfolgen laut [Doku](https://platform.claude.com/docs/en/build-with-claude/context-windows#context-awareness) ihr verbleibendes Token-Budget während der Konversation, *Context Awareness* genannt. Das Modell weiß also, wie voll sein eigenes Fenster ist.

## Für lange Strecken: drei Techniken

Für Agenten, die über Stunden arbeiten, reicht auch das beste Kuratieren irgendwann nicht mehr, das Fenster läuft trotzdem voll. Der Anthropic-Beitrag nennt für diesen Fall genau drei Techniken: „compaction, structured note-taking, and multi-agent architectures".

**Compaction:** Läuft das Fenster voll, wird der Verlauf zusammengefasst und ein frisches Fenster mit der Zusammenfassung gestartet. Claude Code macht genau das, es erhält dabei laut Beitrag Architektur-Entscheidungen, offene Bugs und Implementierungsdetails und verwirft redundante Werkzeug-Ausgaben, dazu kommen die fünf zuletzt benutzten Dateien.

**Structured Note-Taking:** Der Agent schreibt Notizen außerhalb des Kontextfensters und liest sie später wieder ein, eine To-do-Liste, eine `NOTES.md`. Anthropics Anschauungsbeispiel: Claude spielt Pokémon und hält über Tausende Spielschritte Karten, Ziele und Kampfstrategien in eigenen Notizen fest, die jeden Kontext-Reset überleben.

**Multi-Agent-Architekturen:** Statt dass ein Agent alles im eigenen Fenster hält, erledigen Sub-Agenten fokussierte Teilaufgaben mit frischem Fenster und geben nur eine destillierte Zusammenfassung zurück. Das ist exakt das Muster aus dem [Graph-Artikel](https://agentic.schule/blog/2026-09-graph-engineering).

## Du machst das längst

Falls dir das alles bekannt vorkommt: Claude Code setzt diese Techniken im Alltag um, und du benutzt sie mit. Die `CLAUDE.md` ist kuratierter Dauer-Kontext, genau das „smallest set of high-signal tokens" für dein Projekt. Die Kompaktierung springt automatisch an, wenn das Fenster voll läuft, und mit `/compact` stößt du sie selbst an. Die To-do-Listen des Agenten sind Note-Taking. Und Subagenten samt Workflows sind die Multi-Agent-Architektur.

> **💡 Merke:** Wenn der nächste Prompt zäh läuft, füge nicht als Erstes mehr Worte hinzu. Prüfe zuerst, was das Modell gerade alles sieht. Meist ist das Fenster das Problem, und dann hilft Kuratieren mehr als Formulieren.

## Fazit

Zwei Buzzwords, ein Handwerk. Prompt Engineering heißt: klare Anweisung, Beispiele, gemessen an Tests. Context Engineering heißt: Das Fenster ist endlich, also kuratiere, was hineinkommt, knapp und informativ. Beides steht frei zugänglich in den Primärquellen, und keines von beiden braucht einen bezahlten Kurs. (Außer bei der [agentic.schule](https://agentic.schule)! 😉)

Dieser Artikel ist der erste Teil der Serie: **Prompt und Kontext** bestimmen, was das Modell sieht. Weiter geht es mit der **Schleife**, die eine Linie in die Tiefe treibt, bis das Ziel steht ([Loop Engineering](https://agentic.schule/blog/2026-07-loop-engineering)), und dem **Graphen**, der unabhängige Arbeit in die Breite fächert ([Graph Engineering](https://agentic.schule/blog/2026-09-graph-engineering)). Drei Werkzeuge, drei Formen von Arbeit, und alle drei fangen mit derselben Frage an: Was muss das Modell wissen, um den nächsten Schritt gut zu machen?

**Fragen, Feedback, eigene Prompt-Rezepte?** Immer her damit, ich freue mich über jede Nachricht.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
