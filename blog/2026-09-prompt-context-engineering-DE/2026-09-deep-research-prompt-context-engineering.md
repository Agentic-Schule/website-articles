# Recherche: Prompt Engineering und Context Engineering

Ergebnis des /deep-research-Laufs vom 3. September 2026 (5 Suchwinkel, 21 Quellen geholt, 101 Claims extrahiert, 25 verifiziert: 24 bestätigt mit 3-0-Votes wörtlich an den Live-Quellen, 1 widerlegt). Diese Datei ist das Quellenarchiv für den Artikel `blog/2026-09-prompt-context-engineering-DE/`.

## Die zwölf verifizierten Bausteine

1. **Prompt Engineering ist eine empirische, iterative Disziplin.** Voraussetzungen laut Anthropic-Doku: klare Erfolgskriterien, empirische Tests dagegen, ein erster Entwurf. Der Zyklus Testfälle → vorläufiger Prompt → Verfeinerung → Validierung → Ship ist wörtlich „central to prompt engineering". Eval-Prinzip: „More questions with slightly lower signal automated grading is better than fewer questions with high-quality human hand-graded evals." Evals messen die Performance gegen die Erfolgskriterien („designing evaluations to measure performance against them. This cycle is central to prompt engineering."); Grading-Methoden laut Seite (04.09.2026 wörtlich verifiziert): Code-based grading („Exact match: output == golden_answer", „String match: key_phrase in output"), Human grading („Most flexible and high quality, but slow and expensive. Avoid if possible."), LLM-based grading („Fast and flexible, scalable and suitable for complex judgment.").
   Quellen: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview und https://platform.claude.com/docs/en/test-and-evaluate/develop-tests
2. **Grenzen:** „Not every success criteria or failing eval is best solved by prompt engineering. For example, you can sometimes improve latency and cost more easily by selecting a different model." (Overview-Seite, Abschnitt „When to prompt engineer")
3. **Die eine Technik-Referenz:** Alle Techniken (Klarheit, Beispiele, XML, Rolle, Thinking, Chaining) stehen konsolidiert auf „Prompting best practices", von der Doku selbst „the living reference" genannt.
   Quelle: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
4. **Grundprinzipien:** Explizit anfordern statt ableiten lassen („If you want 'above and beyond' behavior, explicitly request it") und das Warum mitliefern („Claude is smart enough to generalize from the explanation").
5. **Beispiele/Few-Shot:** „Examples are one of the most reliable ways to steer Claude's output format, tone, and structure." Tipp (keine harte Regel): „Include 3–5 examples for best results", Kriterien relevant/divers/strukturiert, eingebettet in `<example>`-Tags.
6. **XML-Struktur:** Tags wie `<instructions>`, `<context>`, `<input>` helfen, komplexe Prompts eindeutig zu parsen, und reduzieren Fehlinterpretationen.
7. **Long-Context-Anordnung:** Langform-Dokumente an den Anfang, Frage ans Ende. „Queries at the end can improve response quality by up to 30 percent in tests" — Anthropic-interne Messung, im Artikel zwingend attribuieren („laut Anthropic, in Tests").
8. **Historischer Kasten (optional):** Long-Context-Forschung 2023 (Claude-2-Ära): Zitate-Extraktion (Scratchpad) plus kontextbezogene Beispiele hoben die Genauigkeit von 0.939 auf 0.961, von Anthropic als „36% reduction in errors" gerahmt. Als datierten historischen Datenpunkt kennzeichnen; die Quote-Technik lebt in „Ground responses in quotes" weiter.
   Quelle: https://www.anthropic.com/news/prompting-long-context (23.09.2023)
9. **Brücke zu Context Engineering:** Anthropics Definition: „the set of strategies for curating and maintaining the optimal set of tokens (information) during LLM inference", ausdrücklich „the natural progression of prompt engineering". Ankündigungs-Tweet des verifizierten @AnthropicAI-Accounts: „Most developers have heard of prompt engineering. But to get the most out of AI agents, you need context engineering." Vendor-Framing, kein Industriestandard — so kennzeichnen.
   Quellen: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents (29.09.2025) und https://x.com/AnthropicAI/status/1973098580060631341
10. **Warum nötig — Context Rot:** „as the number of tokens in the context window increases, the model's ability to accurately recall information from that context decreases." Unabhängig gestützt (Chroma-Report, „Lost in the Middle"); Ausmaß variiert nach Task-Komplexität.
11. **Context Awareness:** Sonnet 5, Sonnet 4.6, Sonnet 4.5 und Haiku 4.5 verfolgen ihr verbleibendes Token-Budget (`<budget:token_budget>`-Tags). Gilt exakt für diese vier Modelle, Opus/Fable nicht.
    Quelle: https://platform.claude.com/docs/en/build-with-claude/context-windows#context-awareness
12. **Just-in-time-Kontext und agentische Suche** (Abschnitt „Context retrieval and agentic search" des Context-Engineering-Beitrags, am 03.09.2026 wörtlich am Live-Text verifiziert): Agenten halten „lightweight identifiers (file paths, stored queries, web links, etc.)" und laden Inhalte erst zur Laufzeit über Tools. Metadaten als Signal: „the presence of a file named test_utils.py in a tests folder implies a different purpose than a file with the same name located in src/core_logic/", „Folder hierarchies, naming conventions, and timestamps all provide important signals". Progressive disclosure: Agenten entdecken Kontext schrittweise beim Erkunden. Trade-off: Laufzeit-Erkundung ist langsamer, ohne Führung Verschwendung („misusing tools, chasing dead-ends"). Hybrid-Strategie mit Claude Code als Beispiel: „CLAUDE.md files are naively dropped into context up front, while primitives like glob and grep allow it to navigate its environment and retrieve files just-in-time". Wichtig: Just-in-Time-Retrieval gehört zu diesem Abschnitt, NICHT zur Long-Horizon-Dreierliste (siehe Widerlegung unten).
13. **Verbote und Negativbeispiele** (Prompting best practices, am 03.09.2026 wörtlich am Live-Text verifiziert): Offizielle Regel im Abschnitt „Control the format of responses": „Tell Claude what to do instead of what not to do" — Instead of: „Do not use markdown in your response" / Try: „Your response should be composed of smoothly flowing prose paragraphs." Gleichzeitig nutzen Anthropics eigene Beispiel-Prompts auf derselben Seite massiv Verbote, stets mit Alternative oder Ausnahmebedingung daneben: „DO NOT use ordered lists (1. ...) or unordered lists (*) unless: …", „NEVER output a series of overly short bullet points.", „Avoid generic fonts like Arial and Inter; opt instead for distinctive choices". Der Frontend-Aesthetics-Beispiel-Prompt enthält sogar eine Liste konkreter Negativbeispiele („Overused font families (Inter, Roboto, Arial, system fonts)", „Clichéd color schemes (particularly purple gradients on white backgrounds)"). Für Few-Shot-Beispiele empfiehlt die Doku KEINE Negativbeispiele; Kriterien dort: „Relevant: Mirror your actual use case closely. / Diverse: Cover edge cases and vary enough that Claude doesn't pick up unintended patterns. / Structured: Wrap examples in <example> tags".
14. **Wissenschaftlicher Rahmen:** „The Prompt Report" (Schulhoff et al., arXiv:2406.06608, v6 Feb 2025): Taxonomie von 58 textbasierten Prompting-Techniken, 33 Vokabular-Begriffe, 40 Techniken für andere Modalitäten. arXiv-Preprint, als herstellerunabhängige Einordnung zitierbar.

## Zwingende Vorbehalte fürs Schreiben

- **URL-Hygiene:** Alle docs.anthropic.com-Pfade sind nur noch 301-Redirects. Im Artikel ausschließlich die kanonischen platform.claude.com-URLs zitieren.
- **Selbstmessungen:** „bis zu 30 %" und „36 % Fehlerreduktion" sind Anthropic-interne Tests ohne veröffentlichte Methodik — nur attribuiert, nie als unabhängiger Fakt.
- **Zeitbezug:** Die Long-Context-Experimente sind von 2023 (Claude 2); aktuelle Modelle sättigen simple NIAH-Tests fast vollständig.
- **Vendor-Perspektive:** Die Context-Engineering-Definition ist Anthropics Framing (Engineering-Blog), kein Standard.
- **WIDERLEGT (0-3), NICHT verwenden:** Der Vierer-Katalog „Compaction, Note-Taking, Sub-Agents, Just-in-Time-Retrieval" als Anthropic-Empfehlung für Long-Horizon-Agenten. Was der Blogpost tatsächlich für Agenten empfiehlt, muss direkt am Original nachgelesen und zitiert werden.
- **Einseitigkeit:** Kernaussagen stammen fast alle von Anthropic plus einem Preprint; für Balance die Vergleichsquellen unten heranziehen.

## Offene Fragen vor dem Schreiben

1. Welche Agent-Techniken empfiehlt der Context-Engineering-Blogpost wirklich? (Original lesen, wörtlich zitieren.)
2. Gibt es unabhängige aktuelle Benchmarks zu Context Rot für die heutige Modellgeneration (z. B. Chroma)?
3. Wie rahmen OpenAI/Google/Microsoft das Verhältnis der beiden Begriffe? Lohnt ein Vergleichsabschnitt?
4. Wie belastbar ist die 30-%-Angabe methodisch? (Keine veröffentlichte Methodik.)

## Alle Quellen (für späteres Nachschlagen)

### Anthropic (Primärquellen)
- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview — Prompt engineering overview (Kanon-Einstieg, Voraussetzungen, „When to prompt engineer")
- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices — Prompting best practices („the living reference": Klarheit, Beispiele, XML, Rolle, Thinking, Chaining, Long Context)
- https://platform.claude.com/docs/en/test-and-evaluate/develop-tests — Erfolgskriterien und Evals (die frühere eval-tool-Seite leitet hierauf um)
- https://platform.claude.com/cookbook/misc-building-evals — Evals-Cookbook (04.09.2026 verifiziert: „Evals typically have four parts": input prompt, output, golden answer, score; Beispiel-Code für code-/human-/LLM-graded Evals)
- https://github.com/angular/web-codegen-scorer — Web Codegen Scorer vom Angular-Team (04.09.2026 per gh verifiziert: „a tool for evaluating the quality of web code generated by LLMs"; Use Cases wörtlich „Iterate on a system prompt to find most effective instructions for your project", „Compare the code quality of code produced by different models"; Built-in checks „build success, runtime errors, accessibility, security, LLM rating, and coding best practices"; Haupt-Contributor devversion und crisbeto)
- https://platform.claude.com/docs/en/build-with-claude/context-windows#context-awareness — Context Awareness (Token-Budget-Tracking)
- https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents — Effective context engineering for AI agents (29.09.2025; Definition, Context Rot, Agent-Techniken)
- https://www.anthropic.com/news/prompting-long-context — Prompting long context (23.09.2023; historisch, Claude-2-Ära)
- https://x.com/AnthropicAI/status/1973098580060631341 — Ankündigungs-Tweet zum Context-Engineering-Post (30.09.2025)

### Begriffsdebatte
- https://x.com/karpathy/status/1937902205765607626 — Karpathy, Juni 2025: „+1 for 'context engineering' over 'prompt engineering'" (Ursprung der Debatte)
- https://spectrum.ieee.org/prompt-engineering-is-dead — IEEE Spectrum: „Prompt Engineering is Dead" (Kritik-Perspektive, sekundär)
- https://fedi.simonwillison.net/@simon/114757992443676572 — Simon Willison zur Begriffsverschiebung
- https://www.langchain.com/blog/context-engineering-for-agents — LangChain: Context Engineering for Agents (Blog, Vergleichsrahmung)

### Akademisch
- https://arxiv.org/abs/2406.06608 — The Prompt Report (Schulhoff et al.): Taxonomie von 58 Prompting-Techniken
- https://arxiv.org/abs/2507.13334 — Context-Engineering-Survey (formale Definition als Disziplin)
- https://arxiv.org/abs/2402.07927 — Prompt-Engineering-Survey (41 Techniken nach Anwendungsgebiet)
- https://arxiv.org/abs/2307.03172 — Lost in the Middle (U-Kurve: Anfang/Ende gut, Mitte schlecht)
- https://arxiv.org/abs/2201.11903 — Chain-of-Thought Prompting (Wei et al.)

### Herstellervergleich
- https://developers.openai.com/api/docs/guides/prompt-engineering — OpenAI Prompt engineering guide
- https://ai.google.dev/gemini-api/docs/prompting-strategies — Google Gemini Prompting strategies
- https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/prompt-engineering — Microsoft Azure Prompt engineering
- https://github.com/openai/openai-cookbook/blob/main/examples/gpt-5/gpt-5_prompting_guide.ipynb — OpenAI GPT-5 Prompting Guide (Cookbook)
