---
title: 'Deep Research: Lass deinen Agenten nicht halluzinieren'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-09-29
keywords:
  - Deep Research
  - Halluzination
  - Claude Code
  - Agentic Coding
  - Faktencheck
  - Playwright
  - MCP
  - Web-Recherche
language: de
header: header.jpg
---

**Ein Agent, der im Netz recherchiert, erfindet gern plausible Details: Config-Pfade, Parameter-Namen, ganze Ursachen. Das klingt überzeugend und ist trotzdem falsch. In diesem Artikel zeige ich, wie du das in den Griff bekommst: mit einer klaren Regel, mit Deep Research, mit einem Werkzeug, das Quellen wirklich liest, und mit einem letzten Durchlauf, der jeden Fakt an der Primärquelle gegenprüft.**

## Inhalt

[[toc]]

## Warum Agenten halluzinieren

Ein Sprachmodell sagt das wahrscheinlichste nächste Wort voraus. Es hat keinen eingebauten Begriff von „wahr". Fehlt ihm eine Information, füllt es die Lücke mit etwas, das plausibel aussieht. Bei einem Recherche-Agenten ist das besonders tückisch. Er bekommt die Aufgabe, etwas im Netz herauszufinden, und meldet am Ende ein sauberes Ergebnis zurück. Ob dieses Ergebnis stimmt, siehst du ihm nicht an.

Das Gefährliche ist nicht offensichtlicher Unsinn. Das Gefährliche sind die kleinen, plausiblen Details: ein Konfigurations-Pfad, der genauso heißen könnte, ein Parameter, den es so geben könnte, eine Begründung nach dem Muster „X passiert, weil Y". Solche Sätze überstehen einen schnellen Blick. Sie landen in der Doku oder im Code, und erst Wochen später merkst du, dass die Hälfte erfunden war.

Dagegen hilft kein einzelner Trick. Es braucht eine Kette von Vorkehrungen. Fangen wir bei der billigsten an.

## Die erste Verteidigung: eine klare Regel

Die günstigste Maßnahme kostet nichts außer ein paar Zeilen Text. In meiner globalen `CLAUDE.md`, die in jeder Sitzung mitläuft, steht eine Regel, die genau dieses Problem adressiert. Hier im exakten Wortlaut:

```markdown
## CRITICAL: Web Research Agents Hallucinate

**Sub-agents that research the web (Task tool with WebSearch/WebFetch) frequently hallucinate technical details.** They confidently fabricate config paths, API behavior, parameter names, and causal explanations that sound plausible but are wrong.

**HARD RULES:**
- **NEVER** write research agent output directly into documentation or code without verifying it
- **ALWAYS** verify claims against actual source code, bundled docs, or observed behavior (read the log, check the output)
- **NEVER** state something as fact unless directly observed — if the cause is unknown, say "unknown"
- **NEVER** invent plausible-sounding explanations to fill gaps in understanding
- The difference between "we observed X" and "X happens because Y" is critical
```

Warum hilft das? Weil die Regel den Agenten zwingt, zwei Dinge auseinanderzuhalten, die er von sich aus gern vermischt: beobachtet und vermutet. „Wir haben X gesehen" ist etwas anderes als „X passiert, weil Y". Die Regel verlangt außerdem, dass Unbekanntes als unbekannt benannt wird, statt die Lücke mit einer schönen Erklärung zu stopfen. Das nimmt dem Modell die Erlaubnis zu raten. Und sie erreicht genau die richtigen: Jeder Recherche-Subagent lädt diese globale `CLAUDE.md` beim Start mit, nicht nur die Hauptkonversation (nur die eingebauten Explore- und Plan-Agenten überspringen sie).

Eine Regel ist aber nur so gut wie ihre Befolgung. Der nächste Schritt ist, die Recherche selbst so zu bauen, dass Prüfen fest eingebaut ist.

## Wie Deep Research funktioniert

Deep Research klingt nach Magie, ist aber ein nüchterner Ablauf. Im Kern ist es eine Schleife aus Suchen, Lesen und Prüfen, bevor am Ende etwas zusammengefasst wird. In Claude Code genügt dafür ein Befehl: `/deep-research <deine Frage>`. Diesen Befehl habe ich mir selbst angelegt, und zwar so, dass nur ich ihn auslöse und nicht das Modell nebenbei. Eine tiefe Recherche kostet Zeit und Tokens, das entscheide ich bewusst. Dahinter läuft mein Workflow in fünf Stufen:

1. **Zerlegen:** Die Frage wird in fünf Teilfragen aufgespalten, fünf verschiedene Blickwinkel.
2. **Suchen:** Pro Blickwinkel läuft ein eigener Such-Agent, alle fünf parallel.
3. **Holen:** Die Treffer werden entdoppelt, dann holt für jede Quelle ein eigener Agent die Seite und zieht die überprüfbaren Einzelbehauptungen heraus, bis zu fünfzehn Quellen, jede in ihrem eigenen Kontext. So steckt eine schwache Quelle die anderen nicht an.
4. **Prüfen:** Jede Behauptung bekommt drei unabhängige Prüfer, die sie *adversarial* angehen (gegnerisch, mit dem Ziel zu widerlegen). Erst wenn zwei von dreien sie widerlegen, fliegt sie raus.
5. **Zusammenfassen:** Nur was die Prüfung übersteht, wird zusammengeführt, nach Vertrauen sortiert und mit Quellen belegt.

![Diagramm im agentic.schule-Look: Von einem Lupen-Symbol für die Suche führen drei gepunktete Linien zu drei Agenten-Symbolen, jedes mit einer eigenen Linie zu einem eigenen Dokument. Text: EIN AGENT. EINE QUELLE.](ein-agent.jpg "Deep Research fächert auf: pro Quelle ein eigener Agent, jeder in seinem eigenen Kontext.")

Auf die vierte Stufe kommt es an. Eine Recherche ohne Prüfung ist nur eine längere, selbstbewusstere Vermutung. Der ganze Aufwand dient einem Zweck: Behauptungen sollen scheitern dürfen, bevor sie es in die Antwort schaffen.

## Der Playwright-MCP: Quellen wirklich lesen

Eine Prüfung ist nur so gut wie der Zugriff auf die Quelle. Und genau hier klemmt es oft. Viele Seiten blocken automatisierte Zugriffe, ein direkter Abruf läuft in eine Bot-Erkennung oder in eine leere Seite. Was macht ein ausgesperrter Agent dann? Im harmlosen Fall nimmt er den *Snippet*-Text der Suchmaschine, einen kurzen Auszug. Der ist kein Beleg, und oft nicht einmal aktuell: Jedes Suchergebnis trägt ein Alter mit (`page_age`), der Auszug kann also einen älteren Stand zeigen, nicht die Seite, die der Agent eigentlich prüfen soll. Besser ist da die zweite Möglichkeit: Er meldet zurück, dass der Abruf nicht geklappt hat. Damit kann ich arbeiten. Der schlechteste Fall aber ist, dass er die Sperre verschweigt und die Antwort einfach frei erfindet. Genau das passiert nach meiner Beobachtung immer wieder.

![Grafik im agentic.schule-Look mit drei Zeilen: grünes Häkchen „MELDET ZURÜCK", orangefarbenes Minus „SCHUMMELT", magentafarbenes Kreuz „HALLUZINIERT".](drei-faelle.jpg "Drei Reaktionen auf eine Sperre. Nur die erste ist brauchbar, die dritte ist die gefährliche.")

Meine Lösung dafür ist ein eigener, unauffälliger Playwright-MCP. Er steuert einen echten Browser, ruft die Seite wie ein Mensch auf und liest den tatsächlichen Seitentext aus. So zitiert der Agent den exakten Wortlaut der Quelle, statt eine Zusammenfassung aus zweiter Hand. Wie das Ganze aufgebaut ist, habe ich in einem eigenen Artikel beschrieben: [Gib deinem Agenten einen eigenen, unauffälligen Playwright-MCP](https://agentic.schule/blog/2026-09-agent-research-playwright-mcp).

Doch auch mit dem besten Werkzeug bleibt eine Lücke. Die Recherche-Agenten reichen ihre Funde nach oben an die Hauptunterhaltung weiter, und diese Funde können halluziniert sein. Deshalb gilt die wichtigste Anweisung der Hauptunterhaltung selbst: Prüfe jede Quelle noch einmal nach, bevor du sie aufschreibst. Verlass dich nicht auf die Zusammenfassung des Unter-Agenten, öffne die Quelle. Lässt du das weg, schummeln sich immer wieder halluzinierte Fragmente in das Rechercheergebnis. Dieser eine Satz im Auftrag an die orchestrierende Sitzung verhindert nach meiner Erfahrung besonders viele falsche Fakten.

So sieht der Auftrag konkret aus:

```text
Recherchiere Thema X. Wirst du ausgesperrt, nutze den Playwright-MCP.
Prüfe jede Quelle selbst am Original nach, bevor du sie übernimmst.
Was du dort nicht belegen kannst, markierst du als unbestätigt.
```

## Jeden Fakt gegenprüfen

Wenn der Text steht, kommt ein letzter Durchlauf. Ein eigener Faktencheck geht durch die fertige Fassung, zieht jede Tatsachenbehauptung heraus und prüft sie einzeln an der Primärquelle. Grundhaltung Zweifel: Eine Behauptung gilt erst als gesichert, wenn die Quelle sie wörtlich deckt, nicht schon, wenn sie plausibel klingt.

Das ist kein theoretisches Beispiel. In diesem Artikel stand zuerst, die Such-Snippets kämen aus dem Cache von DuckDuckGo oder Google. Der wahre Kern stimmt: Ein Auszug kann veralten, Anthropics [Websuche-Doku](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/web-search-tool) weist zu jedem Treffer ein `page_age` aus. Der konkrete Mechanismus aber, ein Cache von DuckDuckGo oder Google, stand dort nirgends und war frei erfunden. Der Faktencheck hat ihn gestrichen. So schleicht sich Halluzination ein: ein richtiger Kern, umwickelt mit erfundenen Details.

Es ist derselbe adversariale Ansatz wie in der Recherche, nur am anderen Ende der Kette: Die Recherche filtert vor dem Schreiben, der Faktencheck vor dem Veröffentlichen. Diesen Durchlauf kannst du für jeden Inhalt einsetzen, den ein Agent für dich erzeugt hat.

Und ganz am Ende steht ein Mensch. Das finale Lektorat macht immer noch der Autor, der *Human in the Loop* (der Mensch, der im Prozess bleibt). Er ist das letzte *Quality Gate*, die abschließende Qualitätskontrolle. Ich lese alle Quellen noch einmal quer, bevor etwas unter meinem Namen erscheint, damit ich für jeden Satz geradestehen kann, den ich mit Hilfe meiner Agenten geschrieben habe. Wer *AI-Slop* (ungeprüften, minderwertigen KI-Output) nur durchreicht, darf sich nicht wundern, wenn am Ende fachlich nichts stimmt.

## Fazit

Eine einzelne Maßnahme reicht gegen Halluzinationen nicht. Vier Schichten wirken zusammen. Eine **Regel** nimmt dem Modell die Erlaubnis zu raten. **Deep Research** mit eingebauter Prüfung lässt Behauptungen scheitern, bevor sie in die Antwort kommen. Ein **Werkzeug wie der Playwright-MCP** sorgt dafür, dass wirklich die Quelle gelesen wird und nicht ein Snippet. Und ein **Faktencheck** am Schluss prüft jeden verbliebenen Fakt gegen die Primärquelle. Zusammen halten sie den Agenten bei der Wahrheit, und das letzte Wort hat ohnehin der Mensch.

Mein Rat: Fang mit der Regel an, die ist in fünf Minuten in deiner `CLAUDE.md` und wirkt sofort. Den Rest baust du nach und nach dazu.

**Fragen, Feedback, dein eigenes Setup?** Immer her damit, ich freue mich über jede Nachricht.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
