---
title: 'Ist das noch Vibe Coding? Oder doch gutes Handwerk?'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-09-04
keywords:
  - Vibe Coding
  - Agentic Coding
  - Claude Code
  - AI-assisted Engineering
  - Code-Review
  - Sicherheit
  - Evals
language: de
header: header.jpg
---

Vibe Coding ist entweder ein Schimpfwort oder ein Kompliment, je nachdem, wen du fragst. Ich habe ein ganzes Produkt so gebaut und finde: Es ist beides, nur nicht gleichzeitig.

**Genau in dieser Doppeldeutigkeit steckt die ganze Geschichte des Begriffs: Als Kompliment meint Vibe Coding die verblüffende Leichtigkeit, mit der heute Software entsteht. Als Schimpfwort meint es ungelesenen KI-Code in Produktion: Softwareentwicklung als Glücksspiel, quasi als Würfelwurf. Es kann klappen, muss es aber nicht. Was Andrej Karpathy als Wegwerf-Experiment fürs Wochenende beschrieb, ist heute das Etikett für so ziemlich alles, was mit KI-Agenten gebaut wird. Zeit, das Wort auseinanderzunehmen und dann zu zeigen, mit welchen Techniken trotz KI am Steuer brauchbare Software entsteht.**

## Inhalt

[[toc]]

## Vom Wegwerf-Experiment zum Wort des Jahres

Am 6. November 2025 kürte das Collins Dictionary „vibe coding" zum [Word of the Year 2025](https://blog.collinsdictionary.com/language-lovers/collins-word-of-the-year-2025-ai-meets-authenticity-as-society-shifts/). Die Begründung liest sich wie ein Werbetext: „It’s programming by vibes, not variables. While tech experts debate whether it’s revolutionary or reckless, the term has resonated far beyond Silicon Valley, speaking to a broader cultural shift towards AI-assisted everything in everyday life."

Der [Wörterbucheintrag](https://www.collinsdictionary.com/dictionary/english/vibe-coding) selbst ist bemerkenswert zahm: „the use of artificial intelligence prompted by natural language to assist with the writing of computer code", als Slang-Substantiv, mit den abgeleiteten Formen „vibe coder" und „vibe-code" als Verb. Nach dieser Definition wäre jede KI-gestützte Programmierung Vibe Coding. Und genau da beginnt das Problem, denn das Original sagt etwas völlig anderes.

## Was Karpathy wirklich schrieb

Der Begriff stammt aus einem einzigen, inzwischen sehr bekannten [X-Post von Andrej Karpathy](https://x.com/karpathy/status/1886192184808149383) vom Februar 2025. Karpathy ist Gründungsmitglied von OpenAI, war KI-Chef bei Tesla und erklärt heute als einer der beliebtesten Lehrer der Szene neuronale Netze auf YouTube. Wenn er einem Arbeitsstil einen Namen gibt, hört die Branche zu. Der Anfang im Wortlaut:

> „There's a new kind of coding I call "vibe coding", where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."

Und dann wird es konkret. Karpathy beschreibt, was das praktisch heißt: „I "Accept All" always, I don't read the diffs anymore." Fehlermeldungen kopiert er kommentarlos zurück in den Chat. Der Code wächst „beyond my usual comprehension". Und wenn ein Bug nicht verschwindet, bittet er um zufällige Änderungen, bis er weg ist. Seine eigene Einordnung steht im selben Post: „It's not too bad for throwaway weekend projects, but still quite amusing." Und: „it's not really coding - I just see stuff, say stuff, run stuff, and copy paste stuff, and it mostly works."

Das Original ist also erfrischend klar: Vibe Coding heißt, den Code bewusst **nicht** zu lesen. Es ist ein Experiment mit Kontrollverzicht, gedacht für Wegwerf-Projekte. Eine Produktions-Methodik hat Karpathy nie daraus gemacht.

## Die Verwässerung und die Gegenwehr

Was dann passierte, kennt jeder, der die Branche verfolgt: Der Begriff explodierte, und plötzlich hieß alles Vibe Coding, vom Wochenend-Prototyp bis zur professionellen Agenten-Entwicklung. Der prominenteste Gegenspieler dieser Verwässerung ist Simon Willison, Mitschöpfer des Web-Frameworks Django und einer der meistgelesenen Chronisten der LLM-Szene. Schon am 19. März 2025 stellte er in [„Not all AI-assisted programming is vibe coding (but vibe coding rocks)"](https://simonwillison.net/2025/Mar/19/vibe-coding/) klar, wie er den Begriff versteht: „When I talk about vibe coding I mean building software with an LLM without reviewing the code it writes." Seine Trennlinie ist der beste Satz der ganzen Debatte:

> „If an LLM wrote the code for you, and you then reviewed it, tested it thoroughly and made sure you could explain how it works to someone else that’s not vibe coding, it’s software development. The usage of an LLM to support that activity is immaterial."

Dazu seine goldene Regel: „My golden rule for production-quality AI-assisted programming is that I won’t commit any code to my repository if I couldn’t explain exactly what it does to somebody else."

Wie ernst Willison das meint, zeigt eine Episode vom Mai 2025: Unter dem Titel [„Two publishers and three authors fail to understand what “vibe coding” means"](https://simonwillison.net/2025/May/1/not-vibe-coding/) kritisierte er zwei angekündigte Fachbücher, die den Begriff als Synonym für alle KI-Programmierung verwendeten. Es hatte offenbar Wirkung: Das Buch von Addy Osmani aus Googles Chrome-Team hieß ursprünglich „Vibe Coding: The Future of Programming" und kam als [„Beyond Vibe Coding: From Coder to AI-Era Developer"](https://beyond.addy.ie/) auf den Markt. Willisons Kommentar: „This title is so much better." Osmani selbst schreibt inzwischen: „Vibe coding was never meant to describe all AI-assisted coding. It's a specific approach where you don't read the AI's code before running it." Sein Gegenbegriff heißt *AI-assisted engineering*: „a more structured approach that combines the creativity of vibe coding with the rigor of traditional engineering practices." Und für die Fälle, in denen es schiefgeht, hat seine Buchseite den schönsten Satz: **„Vibe coding is fun until you start leaking database credentials."**

Im Oktober 2025 legte Willison [selbst einen Gegenbegriff nach](https://simonwillison.net/2025/Oct/7/vibe-engineering/). Sein Bild für die Praxis ohne Leitplanken ist der Würfelbecher: „Vibe coding is irresponsibly building software through dice rolls, not caring what code is produced." Für das andere Ende des Spektrums schlug er vor: „I propose we call this vibe engineering, with my tongue only partially in my cheek." Gemeint ist „a different, harder and more sophisticated way of working with AI tools to build production software", inklusive Selbstironie („Is this a stupid name? Yeah, probably."). Die Begriffs-Evolution ging danach übrigens weiter: Ein Update vom Februar 2026 im selben Post notiert, dass sich inzwischen „Agentic Engineering" durchsetzt.

## Und dann verschwimmt die Grenze doch

Die Geschichte hat einen dritten Akt, und der macht sie erst richtig interessant. Im Mai 2026 veröffentlichte Willison [„Vibe coding and agentic engineering are getting closer than I’d like"](https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/) und gestand: „Weirdly though, those things have started to blur for me already, which is quite upsetting." Der Grund: „The problem is that as the coding agents get more reliable, I’m not reviewing every line of code that they write anymore, even for my production level stuff."

Ausgerechnet der Mann, der die Review-Pflicht zur Definitionsfrage gemacht hat, liest also nicht mehr jede Zeile. Er vergleicht das mit der Arbeit in großen Organisationen: Den Image-Resize-Service des Nachbarteams liest man auch nicht Zeile für Zeile, man nutzt ihn über die Doku und schaut erst hinein, wenn etwas klemmt. Der Unterschied, und den benennt er messerscharf: „Claude Code does not have a professional reputation! It can’t take accountability for what it’s done." Und er warnt vor dem schleichenden Gewöhnungseffekt: „There’s an element of the normalization of deviance here—every time a model turns out to have written the right code without me monitoring it closely there’s a risk that I’ll trust it at the wrong moment in the future and get burned."

Für seine harte Grenze bleibt trotzdem Platz: „If you’re building software for other people, vibe coding is grossly irresponsible because it’s other people’s information. Other people get hurt by your stupid bugs."

<!--
## Was die Empirie sagt

Neben den Meinungen gibt es inzwischen Messungen, und die mahnen zur Vorsicht. Drei Befunde, jeweils mit ihren Grenzen:

**KI-Code enthält messbar Schwachstellen.** Eine [peer-reviewte Analyse](https://arxiv.org/abs/2510.26103) (ICICS 2025) ließ CodeQL über 7.703 KI-attribuierte Dateien aus öffentlichen GitHub-Repos laufen: 87,9 % waren ohne identifizierbare CWE-Schwachstellen, im Umkehrschluss trug rund jede achte Datei mindestens einen Befund, insgesamt 4.241 CWE-Instanzen über 77 Typen. Zur Einordnung: Der Korpus besteht zu über 90 Prozent aus ChatGPT-Code, die Attribution ist selbst gemeldet, und statische Analyse liefert eine Untergrenze.

**Autonome Iteration macht es schlimmer.** Eine [zweite peer-reviewte Studie](https://arxiv.org/abs/2506.11022) (IEEE ISTAS 2025) ließ ein LLM seinen eigenen Code in Schleife „verbessern", ganz ohne Menschen: Nach fünf Iterationen zählten die Autoren 37,6 % mehr kritische Schwachstellen, und selbst explizit sicherheitsfokussiertes Prompting verhinderte den Effekt nicht, es milderte ihn nur. Die Empfehlung der Autoren steht wörtlich im Paper: „Restrict consecutive LLM-only iterations to 3 maximum", danach Human Review und den Zähler zurücksetzen. Auch hier die Grenzen: ein einziges Modell (GPT-4o), nur C und Java, und ein bewusst konstruiertes Szenario ohne menschliches Eingreifen, also ziemlich genau Vibe Coding im Karpathy-Sinn.

**Der Code wird kopierter und wird seltener aufgeräumt.** [GitClears Analyse](https://www.gitclear.com/ai_assistant_code_quality_2025_research) über 211 Millionen geänderte Codezeilen (2020 bis 2024) zeigt: Der Anteil von Refactoring-Zeilen fiel von 25 % auf unter 10 %, Copy-Paste stieg von 8,3 % auf 12,3 %, erstmals wurde mehr kopiert als verschoben. GitClear ist allerdings Anbieter von Code-Qualitäts-Tooling und misst mit proprietärem Algorithmus; der Befund ist eine Korrelation über die Zeitachse.

Wichtig für die Einordnung: Keine dieser Studien misst Vibe Coding im engen Sinn, also das ungereviewte Akzeptieren. Sie vermessen KI-generierten Code generell, mit Modellen und Daten bis etwa Mitte 2025. Die Richtung ist trotzdem eindeutig: Ohne Kontrolle sammelt sich Risiko an.
-->

## Die Techniken: KI am Steuer, du an der Leitplanke

Was heißt das nun konkret? Die folgenden Leitplanken machen den Unterschied zwischen Würfeln und Entwickeln. Ich habe sie aus den besten verfügbaren Quellen destilliert, von Willisons Posts über Anthropics offizielle Doku bis zur peer-reviewten Forschung, und in unserer eigenen Praxis erprobt:

**1. Diffs lesen.** Die Minimalregel, und die exakte Umkehrung von Karpathys „I don't read the diffs anymore". Dazu Willisons Commit-Test: Was du nicht erklären kannst, committest du nicht.

**2. Gib dem Agenten einen Check.** Die [offizielle Claude-Code-Doku](https://code.claude.com/docs/en/best-practices) bringt es auf den Punkt: „Give Claude a check it can run: tests, a build, a screenshot to compare. It’s the difference between a session you watch and one you walk away from." Ohne prüfbares Signal wirst du selbst zum Prüfstand, wörtlich: „you become the verification loop: every mistake waits for you to notice it." Tests, Build-Exit-Codes, Linter und Screenshot-Vergleiche schließen die Schleife, ganz im Sinne meines [Loop-Artikels](https://agentic.schule/blog/2026-07-loop-engineering).

**3. Tests zuerst.** Willison beobachtet [in seinem vibe-engineering-Post](https://simonwillison.net/2025/Oct/7/vibe-engineering/), dass „LLMs actively reward existing top tier software engineering practices", allen voran automatisierte Tests: Mit stabiler Test-Suite fliegen die Agenten, ohne sie behauptet der Agent gerne, etwas funktioniere, ohne es je geprüft zu haben. Wie man die Qualität der Anweisungen selbst misst, statt nach Bauchgefühl zu urteilen, steht im [Prompt-und-Context-Artikel](https://agentic.schule/blog/2026-09-prompt-context-engineering): Evals.

**4. Deckel auf die Iterationen.** Eine [peer-reviewte Studie](https://arxiv.org/abs/2506.11022) (IEEE ISTAS 2025) hat gemessen, dass Code unsicherer wird, wenn ein LLM ihn in Schleife ohne Menschen „verbessert"; ihre Empfehlung lautet wörtlich „Restrict consecutive LLM-only iterations to 3 maximum", danach Human Review. Eine Einzelstudien-Leitlinie, aber sie deckt sich mit der Alltagserfahrung: Wenn der Agent lange allein vor sich hin optimiert, wird es selten besser. Zwischendrin selbst draufschauen.

**5. Begrenze den Schaden.** Anthropic setzt bei Claude Code auf [Sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing) mit Dateisystem- und Netzwerk-Isolation, ausdrücklich auch als Schutz gegen Prompt Injection. Laut Anthropic reduzieren die definierten Grenzen in der internen Nutzung die Berechtigungs-Nachfragen um 84 Prozent; der Agent arbeitet also freier und trotzdem eingezäunt. Die konsequenteste Ausbaustufe: Mein Agent hat einen eigenen Rechner, nachzulesen im [Bodenstation-Artikel](https://agentic.schule/blog/2026-07-agentic-coding-mac-mini).

**6. Lass eine zweite Instanz prüfen.** Befehle wie `/code-review` und `/security-review` sind ein zusätzliches Sicherheitsnetz. Wirklich frisch ist der Blick allerdings nur, wenn dafür Sub-Agenten mit eigenem Kontextfenster starten; wann das passiert und warum es den Unterschied macht, steht im [Graph-Artikel](https://agentic.schule/blog/2026-09-graph-engineering). Aber bitte immer bedenken: Reviews ersetzen das eigene Lesen nicht, sie ergänzen es.

> **💡 Merke:** Wer den Code tippt, ist zweitrangig. Gute Software wird daraus erst, wenn jemand liest, testet und die Verantwortung trägt. KI kann keine Verantwortung tragen.

## So bauen wir learnly.school

Zeit für ein Beispiel aus der eigenen Praxis. Unsere Lernplattform [learnly.school](https://learnly.school) ist zu 100 Prozent KI-geschrieben: Kein Mensch hat den Code getippt, aber jeder Diff wurde gelesen. (Außer es ist mir zu müßig: Für Kleinkram genieße ich es, auch mal selbst den Code zu ändern. So wie früher!) Nach dem strengen Maßstab von Karpathy und Willison ist das eben kein Vibe Coding mehr, das ist Software-Entwicklung. Das hat einen handfesten Grund: Ist ein Projekt just for fun, dann lass viben! Eine Schulplattform verarbeitet aber echte personenbezogene Daten, da geht YOLO einfach nicht. Einmal die Würfel rollen lassen und Glück haben mag gut gehen. Als gesamte Software-Strategie wäre die Katastrophe vorprogrammiert. Deshalb arbeiten wir mit den etablierten Prinzipien der Software-Entwicklung.

![Die Startseite von learnly.school: Lernwege, Materialien und KI-gestützte Lernbegleitung an einem Ort, mit dem Fuchs-Maskottchen samt Landkarte.](/img/flagships/learnly.webp "learnly.school: Lernwege, Materialien und KI-gestützte Lernbegleitung an einem Ort. Zu 100 Prozent KI-geschrieben.")

Hinter den guten Vibes steckt eine ganze Werkbank:

- **Geschichtete Custom Prompts:** drei `CLAUDE.md`-Dateien (Projekt, Backend, Frontend) plus ein zentrales Referenzdokument, als Pflichtlektüre für jede Session markiert. Wie diese Schichten zusammenspielen, steht im [Prompt-und-Context-Artikel](https://agentic.schule/blog/2026-09-prompt-context-engineering).
- **Strenge Typisierung:** TypeScript überall, `any` ist als harte Regel verboten. Der Compiler ist der billigste Reviewer, den es gibt.
- **Getrennte Schichten mit Vertrag:** Backend (NestJS, Drizzle ORM) und Frontend (Angular) sind sauber getrennt, die API ist per Swagger/OpenAPI dokumentiert, und der Frontend-Client wird daraus generiert. Der dokumentierte Workflow arbeitet sich von unten nach oben durch: „Complete each layer fully before moving up." Datenbank-Views verstecken Komplexität vor dem Agenten.
- **Vibe-kompatible Patterns:** bewusst simple, effektive Bausteine wie `rxResource` statt cleverer Eigenkonstruktionen. Was der Agent oft gesehen hat, baut er zuverlässig. (Ich persönlich erzwinge dabei [`rxResourceFixed`](https://angular.schule/blog/2025-10-rx-resource-is-broken#the-solution-rxresourcefixed-it-actually-works), meine verbesserte Fassung des Originals.)
- **Tests bis ins kleinste Detail:** Die klassische Testing-Pyramide steht: Unit-Tests, Integrationstests, E2E-Tests gegen das echte Backend samt echter Postgres-Datenbank, das volle Programm. Wobei die Pyramide etwas unförmig ist: E2E-Tests zu schreiben ist verlockend einfach und geht wahnsinnig schnell, Playwright kann Claude wie ein Champion. Soll mir recht sein, dann dauert die CI halt lange! 😅
- **Personas als Ensemble:** Eine komplette fiktive Schule aus Personas (Schulleitung, Sekretariat, Fachlehrkräfte, Schüler) läuft regelmäßig realistische Journeys gegen die echte App. Realisiert wird das mit Sub-Agenten: Jeder bekommt seine Story und seine Aufgabe, kennt den Code nicht und muss sich auf der Oberfläche ohne Hilfe zurechtfinden. Scheitert er oder beschwert er sich (alle haben den Auftrag, jede Unstimmigkeit sofort zu melden), dann ist die Software schlecht. Und es gilt: „nur aus dem Gesehenen berichten, nie erfundene Details".
- **Reviews als Institution:** regelmäßige `/code-review`- und `/security-review`-Läufe, und die Befunde fließen als datierte harte Regeln zurück in die `CLAUDE.md`.
- **Die Screenshot-Schleife:** Bei visuellen Aufgaben gilt wörtlich „rendern → selbst ansehen → korrigieren, nie blind bauen". Der Agent erzeugt Screenshots und sieht dann selbst, dass etwas schief ist. Wie ich meinem Agenten dafür einen eigenen Playwright-MCP gegeben habe, steht im [Playwright-MCP-Artikel](https://agentic.schule/blog/2026-07-agent-recherche-playwright-mcp).
- **Lebende Doku fürs Modell:** `SPECS.md` beschreibt den Ist-Zustand („kein Wunschdenken"), `PROTOCOL.md` ist das append-only-Logbuch, `TODOS.md` der Backlog. Entscheidungen stehen datiert in den Regeln.
- **Backups, Backups, Backups.** Verschlüsselt, versteht sich.

## Erzähl der KI nie vom rosa Elefanten

Eine Geschichte verdient noch einen Sonderauftritt, weil sie eine andere Ebene betrifft: die KI **im** Produkt. learnly.school enthält Lernbegleiter, mit denen Kinder chatten, und für ein LLM ist Text nun einmal Text, egal ob Prosa, Prompt oder Code. Die [Rosa-Elefant-Regel](https://agentic.schule/blog/2026-07-agentic-coding-mac-mini#ein-prinzip-erz%C3%A4hl-den-agenten-nie-vom-rosa-elefanten) 🐘 aus dem Bodenstation-Artikel hat uns hier ein zweites Mal eingeholt, deshalb erzähle ich sie gerne noch einmal.

Der Reihe nach: Einer unserer Lernbegleiter machte beim Thema Pilze einen freundlichen, thematisch passenden und trotzdem gefährlichen Vorschlag („wollen wir probieren, wie er schmeckt?"). Unsere erste Reaktion war die naheliegende: Verbote in die Prompts, mit konkreten Beispielen, was alles nicht geht. Das Ergebnis war ein Kuddelmuddel: Die Begleiter rieben sich plötzlich an Pilzen und Mutproben auf, von denen nie jemand angefangen hatte, und das Wächter-Modell blockte im Gegenzug sogar Harmloses (ein „Mathe ist doof" wurde als gefährliche Handlung einkassiert). Es stellte sich heraus: Ein „Don't" war an allem schuld. Ein Verbot mit lebhaften Beispielen holt den rosa Elefanten erst in den Kontext, und da geht er nicht mehr raus.

![Ein pinkfarbener Elefant steht in einer Savannenlandschaft.](rosa-elefant.png "Egal was du tust, denke bloß nicht an den rosa Elefanten!")

Die Konsequenz ist heute eine harte Regel: In allem, was in den Kontext eines Modells gelangt, sind ausgemalte Gefahren-Beispiele verboten. Kategorien werden abstrakt benannt und positiv formuliert („bleib bei den Lernaufgaben"). Ein Integrationstest prüft das wörtlich: Wörter wie „Pilz" oder „Mutproben" dürfen in keinem Begleiter-Prompt auftauchen, die abstrakte Kategorie „gefährliche Handlung" muss dagegen drinstehen. Das ist Prompt Engineering mit Evals, mitten im Produktcode.

Und falls du denkst, so etwas passiere nur kleinen Teams: [OpenAI hat ein Post-mortem dazu veröffentlicht](https://decrypt.co/366197/openai-explains-chatgpt-mention-goblins), warum ChatGPT monatelang ungefragt von Goblins anfing. Die „Nerdy"-Persönlichkeit hatte im Training Fabelwesen-Metaphern belohnt, bis das Modell Bugs als „mischievous little gremlin" bezeichnete, und die Notbremse war ausgerechnet ein Don't im System Prompt: „never talk about goblins". Auch den Profis geschieht das. Falsches Priming, und schon sind überall rosa Elefanten.

Und damit zurück zur Software-Entwicklung, denn die Lehre gilt dort genauso: Arbeite um Himmels willen nicht mit Negativbeispielen. Das gilt in den Prompts, und es gilt im Code. Womit wir beim Thema Clean Code wären: Soll der Agent guten Code produzieren, muss das Repository sauberen Code enthalten. Einem Menschen kannst du vielleicht ein `// FIXME: bad code, remove this later` hinschreiben, und er blättert kopfschüttelnd weiter. Bei einem LLM hast du ein Riesenproblem: Es hat den Mist gelesen. Mieser Code ist ein riesiger rosa Elefant. Oder um mein Zitat aus dem [Prompt-und-Context-Artikel](https://agentic.schule/blog/2026-09-prompt-context-engineering) zu wiederholen:

> **Clean Code is not dead. It's context engineering now.**
>
> — Johannes Hoppe

## Fazit

Ist das noch Vibe Coding? Oder doch gutes Handwerk? Nach allem, was wir betrachtet haben: Das Wort ist Kompliment und Schimpfwort zugleich, nur nie im selben Projekt. Als Kompliment steht es für Karpathys befreiendes Experiment, für Dinge, die kaputtgehen dürfen. Und vielleicht auch für das geile Gefühl, wenn du und dein Assistent gerade so richtig im Flow seid und das neue Feature rockt. Zum Schimpfwort wird es, sobald andere Menschen deine Software benutzen und niemand gelesen hat, was das Modell aus seinen Wahrscheinlichkeiten gezogen hat — was also gewürfelt wurde. 🎲 <!-- dash erlaubt hier --> Die Grenze dazwischen ist Willisons Trennlinie: Lesen, testen, erklären können. Dann ist es Software-Entwicklung, egal wer tippt.

Die schönste Pointe liefert der Erfinder selbst: Als Karpathy im Oktober 2025 sein Projekt nanochat veröffentlichte, fragte jemand, wie viel davon die KI geschrieben habe. [Seine Antwort](https://x.com/karpathy/status/1977758204139331904): „it's basically entirely hand-written (with tab autocomplete). I tried to use claude/codex agents a few times but they just didn't work well enough at all and net unhelpful, possibly the repo is too far off the data distribution." Der Vater des Vibe Codings hat sein wichtigstes Projekt von Hand geschrieben. 😄 Und seine Begründung ist die vielleicht beste Faustregel zum Schluss: Je weiter dein Problem von der Masse des Trainingsmaterials entfernt ist, desto weniger trägt der Vibe, und desto mehr zählt das Handwerk.

Und falls du dich fragst, wo man so etwas lernt: Vibes brauchen keinen Kurs. Handwerk schon. 😉 Genau dafür gibt es die [agentic.schule](https://agentic.schule).

**Fragen, Feedback, eigene Vibe-Geschichten?** Immer her damit, ich freue mich über jede Nachricht.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
