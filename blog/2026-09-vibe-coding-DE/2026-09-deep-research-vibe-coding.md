# Recherche: Vibe Coding

Quellenarchiv für den Artikel `blog/2026-09-vibe-coding-DE/`. Ergebnis des /deep-research-Laufs vom 4. September 2026 (5 Suchwinkel, 21 Quellen geholt, 102 Claims extrahiert, 25 verifiziert: 24 bestätigt mit 3-0- bzw. 2-1-Votes an den Live-Quellen, 1 widerlegt). Wortlaute tragen jeweils ihr Verifikationsdatum.

## Verifizierte Bausteine

1. **Karpathys Original-Post, der den Begriff prägte** (04.09.2026 per offizieller X-API verifiziert): @karpathy, 2025-02-02, 23:17 UTC, https://x.com/karpathy/status/1886192184808149383 — Volltext:
   „There's a new kind of coding I call "vibe coding", where you fully give in to the vibes, embrace exponentials, and forget that the code even exists. It's possible because the LLMs (e.g. Cursor Composer w Sonnet) are getting too good. Also I just talk to Composer with SuperWhisper so I barely even touch the keyboard. I ask for the dumbest things like "decrease the padding on the sidebar by half" because I'm too lazy to find it. I "Accept All" always, I don't read the diffs anymore. When I get error messages I just copy paste them in with no comment, usually that fixes it. The code grows beyond my usual comprehension, I'd have to really read through it for a while. Sometimes the LLMs can't fix a bug so I just work around it or ask for random changes until it goes away. It's not too bad for throwaway weekend projects, but still quite amusing. I'm building a project or webapp, but it's not really coding - I just see stuff, say stuff, run stuff, and copy paste stuff, and it mostly works."
   Kernbefunde fürs Sezieren des Hypes: Das Original beschreibt ausdrücklich Wegwerf-Wochenendprojekte („throwaway weekend projects"), bewusstes Nicht-Lesen der Diffs („I don't read the diffs anymore"), Code jenseits des eigenen Verständnisses („beyond my usual comprehension") und die Selbst-Einordnung „it's not really coding".

2. **Willisons Abgrenzung** (3-0, Blogposts live gefetcht): Enge Definition „building software with an LLM without reviewing the code it writes". Drei Posts: [„Not all AI-assisted programming is vibe coding"](https://simonwillison.net/2025/Mar/19/vibe-coding/) (19.03.2025), [„Two publishers and three authors fail to understand what 'vibe coding' means"](https://simonwillison.net/2025/May/1/not-vibe-coding/) (01.05.2025), [„Beyond Vibe Coding"](https://simonwillison.net/2025/Sep/4/beyond-vibe-coding/) (04.09.2025). Trennlinie wörtlich (04.09.2026 am Live-HTML nachgeprüft, OHNE den Gedankenstrich, den die Erst-Recherche eingefügt hatte): „If an LLM wrote the code for you, and you then reviewed it, tested it thoroughly and made sure you could explain how it works to someone else that’s not vibe coding, it’s software development. The usage of an LLM to support that activity is immaterial." Definition im selben Post: „When I talk about vibe coding I mean building software with an LLM without reviewing the code it writes." Goldene Regel wörtlich: „My golden rule for production-quality AI-assisted programming is that I won’t commit any code to my repository if I couldn’t explain exactly what it does to somebody else."
3. **Gegenbegriff „AI-assisted engineering"** (3-0): Addy Osmanis Buchseite https://beyond.addy.ie/ definiert eng („It's a specific approach where you don't read the AI's code before running it. […] never meant to describe all AI-assisted coding") und dagegen „AI-assisted engineering": „a more structured approach that combines the creativity of vibe coding with the rigor of traditional engineering practices. It involves specs, rigor and emphasizes collaboration between human developers and AI tools, ensuring that the final product is not only functional but also maintainable and secure." Begriffsgeschichts-Nugget: Das Buch hieß ursprünglich „Vibe Coding: The Future of Programming" und wurde nach Willisons Mai-Kritik umbenannt; Willison: „This title is so much better".
4. **Gegenbegriff „vibe engineering"** (3-0, Tweet per X-API 2025-10-07T14:34:36Z): https://x.com/simonw/status/1975570458683834729 — „Vibe coding is irresponsibly building software through dice rolls, not caring what code is produced. What about when engineers at the top of their game use AI tools responsibly to accelerate their work? I propose 'vibe engineering'!" Blogpost https://simonwillison.net/2025/Oct/7/vibe-engineering/: „different, harder and more sophisticated way of working with AI tools to build production software", ausdrücklich „with my tongue only partially in my cheek" und selbstironisch „Is this a stupid name? Yeah, probably." Wichtig: keine Pauschalverurteilung, Vibe Coding bleibt für Low-Stakes legitim.
5. **Word of the Year** (7 Einzelclaims, alle 3-0, an Collins-Seiten live verifiziert, CNN 06.11.2025 als Korroboration): Collins Dictionary kürte „vibe coding" am **6. November 2025** zum Word of the Year 2025. Wörterbucheintrag (British English, noun, slang): „the use of artificial intelligence prompted by natural language to assist with the writing of computer code", abgeleitet „vibe coder" (noun), „vibe-code" (verb). Begründung im Announcement: „It's programming by vibes, not variables. While tech experts debate whether it's revolutionary or reckless, the term has resonated far beyond Silicon Valley, speaking to a broader cultural shift towards AI-assisted everything in everyday life." Quellen: https://blog.collinsdictionary.com/language-lovers/collins-word-of-the-year-2025-ai-meets-authenticity-as-society-shifts/ und https://www.collinsdictionary.com/us/woty und https://www.collinsdictionary.com/dictionary/english/vibe-coding
6. **Empirie 1 — statische Analyse realen KI-Codes** (3-0, peer-reviewed ICICS 2025 / Springer LNCS, DOI 10.1007/978-981-95-3537-8_9, https://arxiv.org/abs/2510.26103): CodeQL über 7.703 KI-attribuierte GitHub-Dateien; 87,9 % ohne identifizierbare CWE-Schwachstellen, also rund 12,1 % mit Befund; insgesamt 4.241 CWE-Instanzen über 77 Typen. Python 16,18–18,50 % Verwundbarkeitsrate vs. JavaScript 8,66–8,99 % vs. TypeScript 2,50–7,14 %.
7. **Empirie 2 — Sicherheits-Degradation bei autonomer Iteration** (peer-reviewed IEEE ISTAS 2025, DOI 10.1109/ISTAS65609.2025.11269659, https://arxiv.org/abs/2506.11022): Iteratives LLM-Refinement ohne Menschen verschlechtert Sicherheit; Headline „+37,6 % kritische Schwachstellen nach 5 Iterationen" (GPT-4o) votete nur **2-1**. Security-fokussiertes Prompting mildert deutlich (38 Schwachstellen vs. 124 effizienz-, 158 feature-fokussiert), verhindert aber nicht (nur 27 % der Security-Iterationen mit Netto-Verbesserung). Autoren-Empfehlung: max. 3 LLM-only-Iterationen, dann Human Review; Ø 2,1 Schwachstellen/Sample früh vs. Ø 6,2 in Iterationen 8–10.
8. **Empirie 3 — Refactoring-Kollaps** (3-0, GitClear-Report, Vendor mit veröffentlichter Methodik, 211 Mio. Zeilen 2020–2024, https://www.gitclear.com/ai_assistant_code_quality_2025_research): Refactoring-assoziierte („moved") Zeilen von 25 % (2021) auf unter 10 % (2024) gefallen; copy/paste von 8,3 % auf 12,3 % gestiegen — erstmals mehr kopiert als bewegt.

## Nachverifikation vom 04.09.2026 (alle Zitate zeichengenau an den Live-Quellen)

- **Willison Okt 2025 trägt ein Update vom 23.02.2026:** „It looks like the term “Agentic Engineering” is coming out on top for this now. I have a new tag for that and I’m working on a not-quite-a-book." Der Begriff hat sich also weiterentwickelt: vibe engineering → Agentic Engineering.
- **Willison Mai 2026** (https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/, Titel „Vibe coding and agentic engineering are getting closer than I’d like"): „Weirdly though, those things have started to blur for me already, which is quite upsetting." / „If you’re building software for other people, vibe coding is grossly irresponsible because it’s other people’s information. Other people get hurt by your stupid bugs." / „The problem is that as the coding agents get more reliable, I’m not reviewing every line of code that they write anymore, even for my production level stuff." / Team-Analogie (Image-Resize-Service als „semi-black box") / „Claude Code does not have a professional reputation! It can’t take accountability for what it’s done. But it’s been proving itself anyway" / „There’s an element of the normalization of deviance here—every time a model turns out to have written the right code without me monitoring it closely there’s a risk that I’ll trust it at the wrong moment in the future and get burned."
- **Karpathys nanochat-Nachklapp** (per X-API, Antwort im Thread, 2025-10-13T15:27:55Z, https://x.com/karpathy/status/1977758204139331904, gefunden über den HN-Thread https://news.ycombinator.com/item?id=45569350): „Good question, it's basically entirely hand-written (with tab autocomplete). I tried to use claude/codex agents a few times but they just didn't work well enough at all and net unhelpful, possibly the repo is too far off the data distribution."
- **Collins:** Blog-Announcement (06.11.2025) und Eintrag beide bestätigt; kleine interne Inkonsistenz auch in der Definition: Blog „…to write computer code", Eintrag „…to assist with the writing of computer code" — der Eintrag ist kanonisch. Bonus im Blog: „Tired of wrestling with syntax? Just go with the vibes."
- **Osmani-Primärseite** beyond.addy.ie bestätigt (Abschnitt „Important: Vibe Coding ≠ Low Quality"); Bonus-Zitat: „Vibe coding is fun until you start leaking database credentials".
- **Studien:** ICICS-Abstract wörtlich bestätigt (alle Zahlen, plus „documentation generation (39% of collected files)" als Nebenfund; Version of Record LNCS Vol. 16219). ISTAS: 37,6 % steht wörtlich im Abstract; Mitigation wörtlich: „Restrict consecutive LLM-only iterations to 3 maximum … Reset the ”iteration chain” after each human review."; Iterations-Zahlen bestätigt (Ø 2,1 → 4,7 → 6,2); Limitations wörtlich (nur GPT-4o, C/Java, „simulated pure LLM interactions without human intervention"). GitClear wörtlich bestätigt (25 % → unter 10 %, 8,3 % → 12,3 %, „"copy/paste" exceeds "moved" code for first time in history", 211 Mio. Zeilen 2020–2024).
- **Techniken-Block jetzt verifiziert:** Der alte Engineering-Post anthropic.com/engineering/claude-code-best-practices leitet auf die kanonische Seite **https://code.claude.com/docs/en/best-practices** um. Dort wörtlich: „Give Claude a check it can run: tests, a build, a screenshot to compare. It’s the difference between a session you watch and one you walk away from." und „Claude stops when the work looks done. Without a check it can run, “looks done” is the only signal available, and you become the verification loop: every mistake waits for you to notice it. Give Claude something that produces a pass or fail, and the loop closes on its own." Sandboxing-Post (20.10.2025, https://www.anthropic.com/engineering/claude-code-sandboxing): Filesystem- und Netzwerk-Isolation, Prompt-Injection-Risiko, „In our internal usage, we've found that sandboxing safely reduces permission prompts by 84%." (interne Anthropic-Zahl, so attribuieren). Willison Okt 2025 zum Handwerk: „It’s also become clear to me that LLMs actively reward existing top tier software engineering practices" mit Automated testing an erster Stelle („If your project has a robust, comprehensive and stable test suite agentic coding tools can fly with it. Without tests? Your agent might claim something works without having actually tested it at all"; „Test-first development is particularly effective with agents that can iterate in a loop.").
- **Titel Mai-Post bestätigt:** „Two publishers and three authors fail to understand what “vibe coding” means".

## Widerlegt (0-3), NICHT verwenden

- Datumsfalle: „Karpathy prägte den Begriff am **6. Februar 2025**" — kursiert in Sekundärquellen, ist falsch. Das echte Datum ist der 2. Februar 2025, 23:17 UTC (per X-API bestätigt).

## Zwingende Vorbehalte fürs Schreiben

- **Techniken-Block ist NICHT verifiziert:** Die Anthropic-Quellen (claude-code-best-practices, claude-code-sandboxing, code.claude.com/docs/en/best-practices, effective-harnesses-for-long-running-agents) wurden zwar gefetcht, aber kein einziger Claim daraus hat es in die Verifikation geschafft. Vor dem Schreiben zwingend im Volltext an den Live-Seiten verifizieren, nichts aus Agenten-Zusammenfassungen übernehmen. Unverifizierte Leads aus den Fetch-Vorschauen: „In our internal usage, we've found that sandboxing safely reduces permission prompts by 84%" und „Give Claude a check it can run: tests, a build, a screenshot to compare."
- **Collins-Nuancen:** Blog sagt „Coined by AI pioneer Andrej Karpathy", die WOTY-Seite „popularised by" — Collins ist intern inkonsistent; „founding engineer at OpenAI" ist Collins' eigene Charakterisierung. Die WOTY-Seite liefert automatisierten Fetches teils HTTP 403, dann Playwright-MCP nutzen.
- **Empirie generalisiert schlecht:** ICICS-Korpus ist selbst-attribuiert und zu 91,52 % ChatGPT-Code (CodeWhisperer 0,52 %, Tabnine 0,46 %); statische Analyse ist eine Untergrenze; das Sprachranking ist methodenabhängig (Veracode 2025 fand Python mit anderer Methodik am BESTEN). ISTAS: ein Modell (GPT-4o, temp 0.7), nur 10 Basisprogramme C/Java, bewusstes Worst-Case-Design ohne Menschen, 37,6 % nur 2-1 votiert und aus den Body-Tabellen nicht transparent herleitbar — die „max 3 Iterationen"-Regel als Single-Study-Guideline kennzeichnen. GitClear: Vendor, proprietärer Diff-Algorithmus, korrelational. Und: KEINE der Studien misst Vibe Coding im engen Sinn (ungereviewtes Akzeptieren), alle vermessen KI-generierten Code generell — im Artikel sauber trennen.
- **Zeitsensitivität:** Alle Studien analysieren Modelle/Code bis ca. Ende 2024/Mitte 2025; Übertragung auf 2026er-Frontier-Modelle geht über die Datenlage hinaus.

## Offene Fragen vor dem Schreiben

1. Was empfehlen Anthropics offizielle Claude-Code-Quellen konkret? (Best-Practices-Post, Sandboxing, Permissions/Hooks, CI — separat im Volltext verifizieren.)
2. Gibt es Empirie, die ungereviewtes Akzeptieren gezielt gegen reviewtes KI-Coding vergleicht, statt KI-Code pauschal zu vermessen?
3. Karpathys eigene spätere Einordnung primärquellenfest belegen (Verifier erwähnen eine Aussage, nanochat sei handgeschrieben — Primärlink fehlt noch; per X-API jagen).
4. Willisons Post vom Mai 2026 (https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/, „vibe coding and agentic engineering") lesen — taucht in den Quellen auf, war aber nicht im verifizierten Bestand.

## Vorgeschlagene Agenda (aus dem Lauf, noch nicht abgesegnet)

1. Einstieg: Ein Slang-Wort über das Nicht-Lesen von Code wird Word of the Year („revolutionary or reckless"). Plus unser Hook (siehe unten).
2. Was Karpathy wirklich schrieb: Original vom 02.02.2025 wörtlich, „Accept All", „throwaway weekend projects" — nie eine Produktions-Methodik.
3. Die Verwässerung und die Gegenwehr: Willisons drei Posts, Osmanis Buch-Umbenennung, „AI-assisted engineering", „vibe engineering". Kernsatz: Review + Tests + Erklärbarkeit = Software-Entwicklung, egal wer tippt.
4. Was die Empirie zeigt: die drei Studien MIT Methodik-Caveats.
5. Konkrete Techniken: Diffs lesen als Minimalregel (exakte Umkehrung von Karpathys Definition), Iterations-Deckel mit Human Review, Tests/Evals als Netz, Erklärbarkeits-Regel; Anthropic-Quellen ergänzen, sobald verifiziert. Plus Learnly als Praxis-Teil.

## Alle Quellen (für späteres Nachschlagen)

### Primärquellen Begriff
- https://x.com/karpathy/status/1886192184808149383 — Karpathys Original (02.02.2025)
- https://simonwillison.net/2025/Mar/19/vibe-coding/ — Willison: Not all AI-assisted programming is vibe coding
- https://simonwillison.net/2025/May/1/not-vibe-coding/ — Willison: Kritik an Buch-Fehlbenennungen
- https://simonwillison.net/2025/Sep/4/beyond-vibe-coding/ — Willison zu Osmanis Buch
- https://simonwillison.net/2025/Oct/7/vibe-engineering/ — Willison: vibe engineering
- https://x.com/simonw/status/1975570458683834729 — Willisons vibe-engineering-Tweet
- https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/ — Willison 2026 (noch ungelesen)
- https://beyond.addy.ie/ — Osmanis Buchseite (AI-assisted engineering)

### Word of the Year
- https://blog.collinsdictionary.com/language-lovers/collins-word-of-the-year-2025-ai-meets-authenticity-as-society-shifts/ — Collins-Announcement (06.11.2025)
- https://www.collinsdictionary.com/us/woty — WOTY-Seite (403 für Bots, Playwright nutzen)
- https://www.collinsdictionary.com/dictionary/english/vibe-coding — Wörterbucheintrag
- https://www.cnn.com/2025/11/06/tech/vibe-coding-collins-word-year-scli-intl — CNN-Korroboration

### Empirie
- https://arxiv.org/abs/2510.26103 — ICICS 2025: CodeQL-Analyse (12,1 % mit CWE)
- https://arxiv.org/abs/2506.11022 — IEEE ISTAS 2025: Iterations-Degradation
- https://www.gitclear.com/ai_assistant_code_quality_2025_research — GitClear-Report (+ PDF: https://gitclear-public.s3.us-west-2.amazonaws.com/GitClear-AI-Copilot-Code-Quality-2025.pdf)
- https://arxiv.org/pdf/2412.15004 — weitere Empirie-Quelle aus dem Lauf (noch ungelesen)

### Techniken (alle noch zu verifizieren)
- https://www.anthropic.com/engineering/claude-code-best-practices
- https://www.anthropic.com/engineering/claude-code-sandboxing
- https://code.claude.com/docs/en/best-practices
- https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

## Festgehaltene Artikel-Ideen (von Johannes abgesegnet)

- **Hook:** „Ich habe ein ganzes Produkt gevibecodet. Und trotzdem lese ich jeden Diff. Nach der Original-Definition geht das gar nicht zusammen." — Die Spannung: Learnly ist „100 % Vibe Coding" nach heutigem Sprachgebrauch, aber nach Karpathys Original (Nicht-Lesen der Diffs ist konstitutiv) gerade nicht.
- **Titel-/Untertitel-Kandidat:** „Ist das noch Vibe Coding? Oder doch gutes Handwerk?"
- **Kernthese:** Der Begriff hat sich vom Original wegbewegt. Karpathys Version meint Wegwerf-Wochenendprojekte mit bewusstem Kontrollverzicht; was heute alle so nennen, ist „KI schreibt den Code, Mensch steuert und kontrolliert". Für Letzteres braucht es Handwerk: Diffs lesen, Tests, Reviews, Evals, Guardrails — der Technik-Teil des Artikels.

## Eigenes Material (kommt nicht aus der Websuche)

- Learnly als hauseigenes 100-%-Vibe-Coding-Projekt: Eckdaten, Arbeitsweise und die Techniken, die es brauchbar gemacht haben, liefert Johannes für den Praxis-Teil.
