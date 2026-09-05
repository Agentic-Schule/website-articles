# Recherche: Lokale unzensierte Modelle für Security-Arbeit am eigenen Code

Quellenarchiv für den geplanten Artikel. Der Deep-Research-Lauf läuft parallel; hier stehen die Befunde, die ich selbst an den Primärquellen geprüft habe. Stand: 5. September 2026.

## Block 1: Das Modell (selbst geprüft, Hugging Face API und Modellkarten)

**Die Familie Qwen 3.8** (offizielle Organisation `Qwen` auf Hugging Face):

| Modell | Veröffentlicht | Lizenz |
| --- | --- | --- |
| `Qwen/Qwen3.8-27B` (dense, plus FP8-Variante) | 05.–14.08.2026 | **apache-2.0** |
| `Qwen/Qwen3.8-2.4T-A95B` (MoE, plus FP8) | 12.08.2026 | **eigene Lizenz „qwen3.8-max"** |
| `Qwen/Qwen3.8-Flash-Next` (plus FP8) | 27.–31.08.2026 | noch zu prüfen |

⚠️ **Der Lizenz-Unterschied ist die wichtigste Falle des Themas.** Das kompakte 27B-Modell steht unter Apache 2.0, das große MoE-Flaggschiff dagegen unter einer eigenen Lizenz. Wörtlich aus der `LICENSE` des MoE: Erlaubnis „free of charge", aber Klausel 2 greift, „If the licensee or any of its affiliates conducts a Model as a Service or AI Work Assistant business, and the aggregate revenue … " (Umsatzschwelle, Text noch vollständig auszulesen). Definiert werden dort „Model as a Service" (Inferenz oder Fine-Tuning für Dritte, etwa per API) und „AI Work Assistant" (eigenständiges Produkt für KI-gestütztes Coding oder Büroarbeit, genannt werden Qoder und QwenWork). Für den Artikel heißt das: **nicht pauschal „Qwen 3.8 ist Apache 2.0" schreiben**, sondern nach Modell unterscheiden.

**Technische Eckdaten `Qwen3.8-27B`** (wörtlich aus der Modellkarte):
- Typ: „Causal Language Model with Vision Encoder", also ein natives Vision-Language-Modell (`pipeline_tag: image-text-to-text`), versteht Bilder und Videos.
- 27B Parameter, 64 Layer, Hidden Dimension 5120, hybride Architektur („Gated DeltaNet" plus „Gated Attention").
- Kontext: „262,144 natively and extensible up to 1,000,000 tokens."
- Thinking-Modus ist standardmäßig an, per Request abschaltbar, Tiefe über `reasoning_effort` steuerbar, `preserve_thinking` erhält den Reasoning-Kontext.
- Downloads (30 Tage, Stand heute): rund 5,7 Mio. für das offizielle Repo, dazu 10 Mio. für die GGUF-Fassung von unsloth und mehrere Millionen für die MLX-Quantisierungen von lmstudio-community (4, 5, 6 und 8 bit).

## Block 2: Was „unzensiert" technisch bedeutet (selbst geprüft)

**Das zugrundeliegende Paper ist gefunden und verifiziert:** „Refusal in Language Models Is Mediated by a Single Direction", Andy Arditi, Oscar Obeso, Aaquib Syed, Daniel Paleka, Nina Panickssery, Wes Gurnee, Neel Nanda. arXiv:2406.11717, v1 vom 17.06.2024, zuletzt v3 vom 30.10.2024.

Wörtlich aus dem Abstract: „we show that refusal is mediated by a one-dimensional subspace, across 13 popular open-source chat models up to 72B parameters in size. Specifically, for each model, we find a single direction such that erasing this direction from the model's residual stream activations prevents it from refusing harmful instructions, while adding this direction elicits refusal on even harmless instructions. Leveraging this insight, we propose a novel white-box jailbreak method that surgically disables refusal **with minimal effect on other capabilities**." Fazit der Autoren: „Our findings underscore the brittleness of current safety fine-tuning methods."

⚠️ **Spannung, die der Artikel auflösen muss:** Das Paper selbst behauptet „minimal effect on other capabilities". Ob das für die frei kursierenden abliterierten Community-Modelle ebenfalls gilt, ist damit **nicht** belegt. Genau hier muss der Deep-Research-Lauf unabhängige Messungen liefern.

**Verbreitung der unzensierten Varianten** (Hugging Face, Suche nach „Qwen3.8"): 29 Repos mit `uncensored` oder `abliterated` im Namen. Die größten nach Downloads: `JonathanColetti/Qwen3.8-27B-Uncensored-GGUF` (rund 2,4 Mio.), `HauhauCS/Qwen3.8-27B-Uncensored-…-MTP-GGUF` (rund 1,5 Mio.), dazu mehrere von `orcarouter` (27B und Flash-Next, GGUF und FP8). Das sind Einzelpersonen und kleine Accounts, keine Organisationen mit Ruf.

## Offen (kommt aus dem Deep-Research-Lauf oder eigener Prüfung)

- Block 3, die Kernfrage: Taugen LLMs zum Finden von Schwachstellen, und ist die Verweigerung dabei überhaupt der Engpass? (Meine Arbeitshypothese: nein. Beim Prüfen des eigenen Codes verweigert kaum ein Modell; der Engpass ist die Fähigkeit. Falls das stimmt, ist das eigentliche Argument für lokal der Datenschutz.)
- Block 4, Rechtsrahmen in Deutschland (§202c StGB, Beauftragung, Responsible Disclosure).
- Block 5, Hardware und Werkzeuge; Quantisierungsstufen gegen VRAM.
- Offizielle Qwen-Ankündigung (Blog) samt Benchmark-Tabelle und unabhängige Gegenmessungen.
- Lizenz des `Flash-Next`-Modells.
- Vollständiger Text der Umsatzklausel in der Qwen3.8-Max-Lizenz.

## Ergebnis des Deep-Research-Laufs (05.09.2026, 110 Agenten, 27 Quellen, 135 Claims extrahiert, 25 verifiziert: 14 bestätigt, **11 widerlegt**)

### Der zentrale Befund: eine Beleglücke

**Für die Kernthese gibt es keinen einzigen belastbaren Beleg, weder dafür noch dagegen.** Fünf Claims dazu sind durch die dreifache Gegenprüfung gefallen (Voten 0-3, 0-3, 0-3, 1-2, 1-2). Niemand hat gemessen, ob ein unzensiertes Modell bei legitimer Security-Arbeit am eigenen Code bessere Ergebnisse liefert. Das ist kein Mangel der Recherche, sondern der Zustand der Literatur, und genau das gehört in den Artikel.

### Zusätzlich belegt (über meine eigene Prüfung oben hinaus)

- **Größe:** 27.781.427.952 Parameter in BF16, laut Shard-Index **55,56 GB**. Passt unquantisiert auf keine einzelne Consumer-GPU, wohl aber auf Macs ab 96 GB Unified Memory.
- **Alle Benchmark-Zahlen der Modellkarte sind Selbstauskunft.** Qwen hat die Vergleichsmodelle selbst nachgemessen, drei Zeilen stammen aus hauseigenen, nicht öffentlichen Benchmarks (QwenSWEBench 79.0, CoWorkBench 70.7, RecreationBench 47.1). SWE-bench Pro 61.7, Terminal Bench 2.1 73.0 und LiveCodeBench v6 90.3 nur als Herstellerangabe zitieren.
- **Eine einzige unabhängige Messung:** Artificial Analysis, Intelligence-Index 41,6, Halluzinationsrate 30,3 Prozent. Aggregator statt Primärquelle, Momentaufnahme vom 05.09.2026, gemessen an gehosteten API-Läufen, also nicht an einer lokal quantisierten Installation.
- **Die Modellkarte dokumentiert nichts zu Sicherheit, Verweigerung oder Nutzungsrichtlinie** und keinen Security-Benchmark. Jede Aussage über Verweigerungsverhalten muss selbst gemessen werden.
- **Abliteration, die Mechanik:** Jede Matrix, die in den Residual Stream schreibt, wird gegen die Refusal-Richtung orthogonalisiert (W' ← W − r̂r̂ᵀW). Kein Gradientenabstieg, keine Beispiele schädlicher Antworten nötig.
- **Das Grundlagenpapier misst keinen einzigen Coding- oder Security-Benchmark**, nur MMLU, ARC, GSM8K, TruthfulQA, im Anhang WinoGrande, TinyHellaSwag und Cross-Entropy auf The Pile und Alpaca.
- **Die einzige verifizierte Nebenwirkungsmessung** zeigt keinen Fähigkeitsverlust, sondern eine **Dispositionsverschiebung**: In 21.600 Auf/Ab-Entscheidungen über 60 Warschauer Aktien waren abliterierte Modelle systematisch optimistischer als ihre Basisversionen (+12,2 Prozentpunkte bei Gemma-4-26B-A4B-it, +7,4 pp bei Qwen3-30B-A3B), bei erhaltenen Fähigkeitskovariaten. Die Aufgabe löst keine Verweigerung aus, der Effekt ist also reine Nebenwirkung des Gewichtseingriffs. ⚠️ Single-Author-Preprint, Draft v0.5, nur mit dieser Einschränkung zitieren.
- **Lizenz-Nachtrag:** Beim MoE greift die Umsatzschwelle von 50 Mio. USD nur für Model-as-a-Service- und AI-Work-Assistant-Geschäfte, rein interne Nutzung ist ausdrücklich ausgenommen (Vote 2-1, mit Vorbehalt zitieren). Die Apache-Plakette im GitHub-Repo deckt nur das Repository, **nicht die Gewichte**.

### ⚠️ Durchgefallene Zahlen, die NICHT in den Text dürfen

Sie klingen gerade deshalb brauchbar, weil sie so konkret sind:

- Alle Degradationswerte aus arXiv:2512.13655 (GSM8K bis −18,81 pp, ASR-Werte, KL-Divergenzen).
- Die Verweigerungsquoten aus arXiv:2603.01246 (2,72-fach, 43,8 % System-Hardening, 34,3 % Malware-Analyse).
- „Fähigkeitsverlust im Mittel unter einem Prozent" aus Arditi et al.
- Single-Pass-Verfahren wie ErisForge oder DECCP erhielten die Fähigkeiten fast vollständig.
- Restverweigerungsraten nach Abliteration für konkrete Modelle.

### ⚠️ Weitere Zitierfallen

- arXiv:2607.17427 misst ausdrücklich **keinen** Fähigkeitsverlust und darf nicht so zitiert werden.
- GPQA ist kein Coding-Benchmark.
- „Eigener Harness" bei Qwens Benchmarks ist falsch, es ist der Claude-Code-Harness.
- Ökosystem-Aussagen (GGUF, Ollama, LM Studio, MLX, Quantisierungsstufen) sind bei einem drei Wochen alten Modell tagesaktuell und müssen unmittelbar vor Veröffentlichung neu geprüft werden. Vision-Encoder plus hybride Gated-DeltaNet-Attention machen Standard-GGUF-Unterstützung nicht selbstverständlich.
- Die Modellkarte empfiehlt ausschließlich Server-Engines (SGLang, vLLM, TokenSpeed, jeweils mit 262.144 Token und Tensor-Parallelität 4); Anleitungen zu GGUF, Ollama, LM Studio oder MLX fehlen dort. Das GitHub-README führt dagegen einen Abschnitt „Local Use" mit llama.cpp, MLX und Unsloth.

### Blöcke ohne jeden Beleg

Block 4 (Rechtsrahmen Deutschland) und Block 5 (Hardware, Quantisierung, Werkzeuge) sowie der Belegteil von Block 3 (Big Sleep, DARPA AIxCC, OSS-Fuzz, CyberSecEval) sind **vollständig unbelegt**. Dafür braucht es eine zweite Recherchewelle.

### Die vier offenen Fragen des Laufs

1. Wie hoch ist die tatsächliche Verweigerungsrate von Qwen3.8-27B bei legitimen Security-Aufgaben am eigenen Code, und wie groß ist der Abstand zur abliterierten Variante? Dafür existiert keine zitierbare Quelle. Nur eine eigene, dokumentierte Messung klärt das, und die wäre zugleich das stärkste Originalmaterial des Artikels.
2. Existieren lauffähige GGUF- oder MLX-Quantisierungen trotz Vision-Encoder und hybrider Attention, und welcher Speicherbedarf ergibt sich je Stufe?
3. Was sagen die Primärquellen zum Rechtsrahmen (Gesetzestext, Rechtsprechung, BSI statt Kanzleiblogs)?
4. Belegen Big Sleep, AIxCC, OSS-Fuzz oder CyberSecEval, dass Verweigerung überhaupt der limitierende Faktor ist, oder sind es Kontextlänge, Reasoning-Tiefe und Werkzeuganbindung? Die Antwort entscheidet, ob „unzensiert" im Artikel Haupt- oder Nebenrolle spielt.

## Zweite Welle (05.09.2026, 107 Agenten, 25 Quellen, 25 Claims verifiziert: 14 bestätigt, 11 widerlegt)

### Block A, Rechtsrahmen: vollständig belegt, alles aus Primärquellen im Volltext

**§ 202c StGB (Hackerparagraf) trifft Sicherheitswerkzeuge nicht.** Gesetzeswortlaut: erfasst sind „Computerprogramme, deren **Zweck** die Begehung einer solchen Tat ist". Das Bundesverfassungsgericht (2. Kammer des Zweiten Senats, Beschluss vom 18.05.2009, 2 BvR 2233/07 u. a.) stellt in Rn. 61 klar: „Schon nach dem Wortlaut nicht ausreichend wäre, dass ein Programm – wie das für so genannte dual use tools gilt – für die Begehung der genannten Computerstraftaten lediglich geeignet oder auch besonders geeignet ist. […] Mit dieser finalen Dimension unterscheidet sich der Begriff des Zwecks deutlich von dem der Eignung." Und in Rn. 64: „Die […] Auffassung, der objektive Tatbestand des § 202c Abs. 1 Nr. 2 StGB erfasse allgemein auch so genannte dual use tools, lässt sich nicht halten"; eine Auslegung über die Eignung „stellte damit gleichzeitig einen Verstoß gegen Art. 103 Abs. 2 GG dar". Zum Hochschullehrer, der nmap einsetzt, Rn. 69: „Diese Eignung genügt zur Erfüllung des objektiven Tatbestands des § 202c Abs. 1 Nr. 2 StGB jedoch nicht."

**Was ein taugliches Tatobjekt wäre** (Rn. 60 und 66): Das Programm muss „mit der Absicht entwickelt oder modifiziert worden sein, es zur Begehung der genannten Straftaten einzusetzen. Diese Absicht muss sich ferner objektiv manifestiert haben." Beispiele des Gerichts für eine solche Manifestation: die Gestalt des Programms selbst oder „eine eindeutig auf illegale Verwendungen abzielende Vertriebspolitik und Werbung des Herstellers". ⚠️ „mag … liegen" ist eine Beispielaufzählung, keine abschließende Definition; die Konkretisierung überlässt das Gericht ausdrücklich den Fachgerichten.

**Beauftragte Penetrationstests sind straflos** (Rn. 74, wörtlich): „Da die Unternehmen, für die der Beschwerdeführer tätig wird oder tätig geworden ist, im Auftrag und somit im Einverständnis mit den über die überprüften Computersysteme Verfügungsberechtigten handeln, fehlt es am Tatbestandsmerkmal des unbefugten Handelns … Zu einem solchen legalen Zweck dürfen … grundsätzlich auch Schadprogramme … beschafft oder weitergegeben werden … Sieht der Beschwerdeführer hier Risiken einer strafrechtlichen Verfolgung, kann er diese unter anderem durch eine umfassende Dokumentation der Verfahrensabläufe und der erteilten Bewilligung des Auftraggebers für sein Tätigwerden weiter verringern." ⚠️ Das Gericht argumentiert über das subjektive Merkmal (fehlender Vorbereitungsvorsatz); „empfiehlt ausdrücklich" wäre überzogen, das Gericht sagt neutraler „kann … weiter verringern".

**Wo das Risiko tatsächlich liegt: bei der Weitergabe.** Wer tatbestandsmäßige Programme Personen zugänglich macht, deren Vertrauenswürdigkeit nicht feststeht, und rechtswidrige Nutzung billigend in Kauf nimmt, macht sich strafbar. Beispiel des Gerichts: freies Einstellen ins Internet oder Bereitstellen in einschlägigen Foren.

**BSI zur Beauftragung:** nie ohne schriftlichen Auftrag testen, immer ein Vertrag zwischen Prüfern und getesteter Institution, und ein externer Hoster **muss** einbezogen werden, wenn Dienste ausgelagert sind. Ausgelagerte Funktionsbereiche sind sonst aus dem Test auszuschließen; sollen sie hinein, braucht es die schriftliche Genehmigung des Betreibers. ⚠️ Für das Audit am **eigenen** Code sagen diese Dokumente nichts.

**EU AI Act, Open-Source-Ausnahme ist keine Vollbefreiung:** Art. 53(2) und Art. 54(6) befreien nur von drei Pflichten (technische Dokumentation, Informationen an nachgelagerte Anbieter, Bevollmächtigter). Die Urheberrechts-Policy und die öffentliche Zusammenfassung der Trainingsinhalte bleiben.

**Modifikation erbt nicht alles:** Nach Erwägungsgrund 109 beschränken sich die Anbieterpflichten auf genau die Modifikation. Das „Safety and Security"-Kapitel des GPAI Code of Practice richtet sich ausdrücklich nur an Anbieter von Modellen mit systemischem Risiko nach Art. 55; ein lokal abliteriertes 27B-Modell liegt weit darunter.

⚠️ **Ungeklärt geblieben:** ob Abliterieren überhaupt Anbieterstatus auslöst. Die Claims zum Ein-Drittel-Compute-Kriterium wurden verworfen.

⚠️ **Methodische Einschränkung des Rechtsteils:** Wegen erschöpftem Suchkontingent fand keine aktive Gegenrecherche nach abweichender Rechtsprechung oder Literatur statt. Der Teil ist quellentreu, aber nicht literaturvollständig. Für einen Artikel, der Rechtsfragen berührt, gehört ein Haftungshinweis dazu, dass dies keine Rechtsberatung ist.

### Blöcke B, C und D: nach zwei Wellen weiterhin unbelegt

Ursache ist diesmal bekannt: Das WebSearch-Kontingent der Sitzung war mit 200 von 200 erschöpft, die Verifizierer konnten nicht mehr gegenrecherchieren. Der einzige B-Claim fiel mit 1-2 durch. Diese Blöcke hole ich gezielt selbst, ohne Suche, direkt an bekannten Primärquellen (Hugging-Face-API für Dateigrößen je Quantisierung, Project-Zero-Blog, AIxCC-Seite, CyberSecEval-Paper, Veröffentlichungen der Datenschutzbehörden).

## Block B: Praxis, selbst geprüft über die Hugging-Face-API (05.09.2026)

Statt Blog-Behauptungen die tatsächlichen **Dateigrößen der veröffentlichten Quantisierungen**. Das ist der exakteste verfügbare Beleg für den Speicherbedarf, weil die Datei vollständig in den Speicher geladen wird (Kontext kommt obendrauf).

**GGUF, Repository `unsloth/Qwen3.8-27B-GGUF`** (25 Stufen insgesamt, rund 10 Mio. Downloads):

| Stufe | Größe |
| --- | --- |
| UD-IQ1_S | 6,2 GB |
| UD-Q2_K_XL | 9,8 GB |
| UD-Q3_K_XL | 13,1 GB |
| **UD-Q4_K_M** | **16,5 GB** |
| UD-Q5_K_M | 19,8 GB |
| UD-Q6_K | 22,0 GB |
| Q8_0 | 29,0 GB |
| BF16 (unquantisiert, offizielles Repo) | 55,56 GB |

**MLX für Apple Silicon**, `lmstudio-community`: 4bit rund 16,1 GB (drei Shards), 6bit und 8bit ebenfalls vorhanden, 8bit rund 29,5 GB. Downloads jeweils im Millionenbereich, das Format läuft also.

**Wichtiges Detail zum Vision-Encoder:** Im GGUF-Repo liegt zusätzlich eine separate Projektor-Datei (`mmproj-F16.gguf` bzw. `mmproj-BF16.gguf`, je rund 0,9 GB). Das ist der übliche Weg, wie llama.cpp den Bildteil eines Vision-Language-Modells lädt. Wer nur Text braucht, kann sie weglassen; es existiert sogar eine reine Text-Variante (`lukaskremla/Qwen3.8-27B-3bit-MLX-TextOnly`). Damit ist die offene Frage aus Welle eins beantwortet: Vision-Encoder und hybride Attention verhindern GGUF und MLX **nicht**.

**Einordnung für den Praxisteil:** Q4_K_M mit 16,5 GB passt auf eine 24-GB-Grafikkarte und auf einen Mac mit 32 GB. Die unquantisierten 55,56 GB brauchen dagegen 96 GB Unified Memory oder mehrere GPUs. Zwischen diesen beiden Punkten liegt die ganze Entscheidung.

⚠️ **Was damit NICHT belegt ist:** wie viel Qualität die jeweilige Stufe kostet. Dafür habe ich keine belastbare Messung, und Welle eins hat alle kursierenden Zahlen dazu kassiert. Im Artikel also nur Speicherbedarf nennen, keine Qualitätsaussagen je Stufe.

**Nebenbefund:** Auch abliterierte Varianten gibt es bereits als MLX und GGUF, teils mit Fantasienamen wie „RavenXAiLabs-Chaos-Agent-…-OBLITERATED-MLX" (1.798 Downloads) oder „PocketAiHub/Qwen3.8-27B-Abliterated-MLX" (0 Downloads). Herkunft und Bearbeitungsqualität sind bei diesen Repos nicht nachvollziehbar.

## Block C: Taugen LLMs zum Finden von Schwachstellen? (gezielt nachgeholt, 05.09.2026)

### Ja, belegt an drei dokumentierten Projekten

**Google Big Sleep** ([Project-Zero-Blog, 01.11.2024](https://projectzero.google/2024/10/from-naptime-to-big-sleep.html)): „Today, we're excited to share the first real-world vulnerability discovered by the Big Sleep agent: an exploitable stack buffer underflow in SQLite … We discovered the vulnerability and reported it to the developers in early October, who fixed it on the same day." Und die Einordnung: „We believe this is the first public example of an AI agent finding a previously unknown exploitable memory-safety issue in widely used real-world software." Bemerkenswert: „the issue remained undiscovered after 150 CPU-hours of fuzzing". Inzwischen führt das Team einen [öffentlichen Tracker](https://issuetracker.google.com/savedsearches/7155917) mit **86 Einträgen** (Stand 05.09.2026), überwiegend als „Fixed" markiert, in V8, JavaScriptCore, Ghostscript, FFmpeg, PDFium, ANGLE, PCRE2 und Kernel-Code.
⚠️ Die Selbsteinschätzung des Teams gehört dazu: „we want to reiterate that these are highly experimental results. The position of the Big Sleep team is that at present, it's likely that a target-specific fuzzer would be at least as effective." Eine Fehlalarm-Quote hat Google **nirgends** veröffentlicht; daraus keine ableiten.

**DARPA AI Cyber Challenge**, Ergebnis des Finales ([aicyberchallenge.com](https://aicyberchallenge.com/), per Playwright gelesen, WebFetch gibt 403): 63 eingebaute Schwachstellen, davon **54 gefunden (86 Prozent), 68 Prozent gepatcht**. Wörtlich von der Seite, inklusive einer eigenen Korrektur: „Former information stated the Final Competition included 70 synthetic vulnerabilities. Upon further review, the competition administrator determined the Final Competition included 63 … which means competitors discovered 86% of the synthetic vulnerabilities and patched 68%." Siegerteams: Team Atlanta (4 Mio. USD), Trail of Bits (3 Mio.), Theori (1,5 Mio.). Ein Team fand zusätzlich neun echte Zero-Days (7 Java, 2 C).

**OSS-Fuzz-Gen** ([github.com/google/oss-fuzz-gen](https://github.com/google/oss-fuzz-gen)): „So far, we have reported 30 new bugs/vulnerabilities found by automatically generated targets built by this framework", darunter CVE-2024-9143 in OpenSSL. Und der entscheidende Satz: „These bugs could only have been discovered with newly generated targets. They were not reachable with existing OSS-Fuzz targets."

### Was die Literatur misst, und was sie übersieht

**Keine einzige der geprüften Primärquellen nennt die Verweigerungshaltung als limitierenden Faktor.** Big Sleep, AIxCC und OSS-Fuzz-Gen erwähnen Refusal an keiner Stelle. Was sie stattdessen benennen:

- **Big Sleep, wörtlich:** „When provided with the right tools, current LLMs can perform vulnerability research." Der Fund gelang über gezielte Varianten-Analyse mit einem Commit-Diff als Ausgangspunkt, also über **Kontext und Werkzeuge**.
- **OSS-Fuzz-Gen:** Der Engpass ist die Erzeugung brauchbarer Harnesses. Nur **160 von 297 Projekten** bekamen gültige, abdeckungssteigernde Fuzz-Targets. Ein Werkzeug- und Integrationsproblem.
- **CyberSecEval 2** ([arXiv:2404.13161](https://arxiv.org/abs/2404.13161)) ist die einzige Quelle, die Verweigerung überhaupt misst, und zwar als *False Refusal Rate*. Befund im Abstract: „We find many LLMs able to successfully comply with „borderline" benign requests while still rejecting most unsafe requests." Verweigerung erscheint dort also als handhabbares Problem, nicht als dominanter Blocker. ⚠️ Gemessen wird „cyberattack helpfulness", also Grenzfälle zwischen offensiv und legitim, **nicht** das Prüfen eigenen Codes.

**Die Lücke in dieser Literatur:** Keine dieser Quellen misst den Fall, um den es im Artikel geht. Big Sleep und AIxCC laufen mit eigens gebauten Harnesses und API-Zugriff, CyberSecEval prüft Grenzfälle zwischen offensiv und legitim. **Ein Coding-Agent, der auf einem sicherheitsrelevanten Repository eine Prüfung fahren soll, kommt in keiner veröffentlichten Messung vor.** Aus dem Schweigen der Literatur darf also nicht geschlossen werden, dass es das Problem nicht gibt.

### 💡 Eigene Beobachtung (Johannes Hoppe, Primärquelle)

**Fable 5.0 hat `/security-review` wiederholt verweigert**, und zwar reproduzierbar dann, wenn der zu prüfende Code selbst sicherheitsrelevant ist (Authentifizierung, Schlüsselverwaltung, kryptografische Verfahren). Der Befehl war in diesen Fällen praktisch unbedienbar.

Damit ist die Verallgemeinerung „beim eigenen Code verweigert kaum ein Modell" widerlegt. Der Ort der Verweigerung ist offenbar nicht nur die Forensik an Angriffsartefakten (siehe Hugging Face), sondern auch die **Prüfung eigenen Codes in einer sensiblen Domäne**. Das Modell scheint auf das Thema zu reagieren, nicht auf die Absicht.

Das ist zugleich das stärkste Originalmaterial des Artikels, weil es diese Lücke füllt. Damit es zitierfähig wird, gehört dazu:

- der **wörtliche Verweigerungstext** aus mindestens einem Lauf, als Screenshot oder Zitat,
- **Modell und Version** sowie das Datum,
- die **Art des Repositories** (sicherheitsrelevant, eigener Code, autorisiert), ohne den Code selbst zu zeigen,
- zum Vergleich ein Lauf über ein unauffälliges Repository, damit die Domäne als auslösender Faktor sichtbar wird.

**Konsequenz für den Artikel:** Die Arbeitshypothese aus Welle eins fällt. Verweigerung ist an zwei belegten Stellen ein echter Engpass, bei der Forensik (Hugging Face, fremd belegt) und bei der Prüfung sicherheitsrelevanten eigenen Codes (eigene Beobachtung). Daneben bleiben Kontext, Werkzeuganbindung und Datenschutz als eigenständige Gründe für den lokalen Betrieb bestehen. „Unzensiert" rückt damit von der Nebenrolle wieder ins Zentrum, allerdings sauber getrennt: **selbst gehostet** löst den Datenschutz und die Anbieter-Guardrails, **abliteriert** ist die weitergehende Stufe mit eigenen Kosten.

## Block D: Datenschutz als das eigentliche Argument (gezielt nachgeholt, 05.09.2026)

### Der stärkste Fund: die Datenschutzkonferenz empfiehlt geschlossene Systeme

[Orientierungshilfe „Künstliche Intelligenz und Datenschutz" der Konferenz der unabhängigen Datenschutzaufsichtsbehörden des Bundes und der Länder](https://www.datenschutzkonferenz-online.de/media/oh/20240506_DSK_Orientierungshilfe_KI_und_Datenschutz.pdf), Version 1.0 vom 06.05.2024, Abschnitt 1.7 „Geschlossenes oder offenes System?", wörtlich:

> „Bei geschlossenen Systemen erfolgt die Datenverarbeitung in einer eingegrenzten und technisch abgeschlossenen Umgebung. … Die Kontrolle über die Ein- und Ausgabedaten liegt bei geschlossenen Systemen bei den Anwendenden. Es ist systemseitig nicht vorgesehen, dass die bei der Anwendung eingegebenen oder entstehenden Daten vom Anbieter des Systems zum weiteren Training verwendet werden."

> „Anders verhält es sich mit offenen Systemen. … Die Eingabedaten verlassen damit den geschützten Bereich der Anwender:in … Ein Risiko besteht auch hinsichtlich dienstlicher Informationen, die nicht für die Öffentlichkeit bestimmt sind oder die als Verschlusssache eingestuft sind."

> **„Technisch geschlossene Systeme sind daher aus datenschutzrechtlicher Sicht vorzugswürdig."**

Das ist eine ausdrückliche behördliche Aussage, getragen von allen deutschen Datenschutzaufsichtsbehörden, und sie deckt ausdrücklich auch nicht-personenbezogene dienstliche Informationen ab.

### BSI: lokaler Betrieb und Cloud-Nutzung werden unterschiedlich behandelt

[Kriterienkatalog zur Integration von extern bereitgestellten generativen KI-Modellen](https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/KI/Kriterienkatalog_KI-Modelle_Bundesverwaltung.pdf?__blob=publicationFile&v=3) (Version 1.0, 06.06.2025): Der Katalog unterscheidet „Cloud-Nutzung" und „lokaler Betrieb … in eigener Verantwortung auf eigener Hardware". Cloud-Nutzung muss zusätzlich den kompletten Mindeststandard zur Nutzung externer Cloud-Dienste erfüllen, lokaler Betrieb dagegen nur die üblichen IT-Grundschutz-Maßnahmen. Zum Datenabfluss wörtlich: „Zudem haben die Anbieter und Betreiber von KI-Modellen potenziell Zugriff auf bestimmte Daten der Endnutzenden und behalten sich teilweise das Recht vor diese z. B. zum weiteren Training ihrer KI-Modelle zu nutzen." Und als Grundsatz: „Dienstliche Informationen dürfen von externen Stellen nicht verwendet werden!"

Dazu die BSI-Publikation [„Generative KI-Modelle: Chancen und Risiken"](https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/KI/Generative_KI-Modelle.pdf?__blob=publicationFile&v=7), Risiko R2 „Fehlende Vertraulichkeit eingegebener Daten".

### DSGVO und Geschäftsgeheimnisse

**Art. 28 DSGVO** löst eine ganze Pflichtenkaskade aus, sobald personenbezogene Daten an einen externen Anbieter gehen: Vertrag, dokumentierte Weisungsbindung („nur auf dokumentierte Weisung des Verantwortlichen"), Vertraulichkeitsverpflichtung, Maßnahmen nach Art. 32, Löschung oder Rückgabe nach Auftragsende sowie Nachweis- und Inspektionsrechte. Bei lokaler Verarbeitung entfällt das, weil es keinen Auftragsverarbeiter gibt.

**Drittlandtransfer:** Art. 44 verlangt die Einhaltung von Kapitel V; Art. 45 erlaubt die Übermittlung bei einem Angemessenheitsbeschluss. Für die USA gilt der [Durchführungsbeschluss (EU) 2023/1795](https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32023D1795) vom 10.07.2023. ⚠️ Wichtig für den Artikel: Die Angemessenheit gilt **nur für Organisationen, die in der „Data Privacy Framework List" selbst zertifiziert sind**, nicht pauschal für die USA, und der Beschluss kann ausgesetzt, geändert oder widerrufen werden (dem Vorgänger Privacy Shield ist genau das per EuGH-Urteil passiert).

**§ 2 Nr. 1 GeschGehG**, drei kumulative Voraussetzungen, wörtlich unter anderem: die Information muss „Gegenstand von den Umständen nach **angemessenen Geheimhaltungsmaßnahmen** durch ihren rechtmäßigen Inhaber" sein. Für proprietären Quellcode ist das die aktiv zu erfüllende Bedingung. ⚠️ Was „angemessen" bedeutet, definiert das Gesetz nicht; ob das Hochladen zu einem Cloud-Dienst dagegen verstößt, ist Wertungsfrage und darf im Artikel nicht als Rechtsaussage behauptet werden.

**BfDI:** keine einschlägige eigene Veröffentlichung zur Fragestellung gefunden.

### Methodischer Nebenbefund, der zur Serie passt

Der recherchierende Agent hat protokolliert, dass eine erste automatische Zusammenfassung der BSI-Seite **falsche PDF-Links erfunden** hatte. Er hat sie durch Rohtext-Abruf ersetzt und die echten Pfade selbst gesucht. Genau der Grund, warum wir Agenten-Ausgaben nie ungeprüft übernehmen.

## Der Coldcard-Vorfall, Juli 2026 (selbst an der Primärquelle verifiziert, 05.09.2026)

⚠️ **Die Ausgangsannahme trägt nicht.** „Man ist sich sicher, dass diese Lücke durch KI gefunden wurde" ist durch keine Quelle gedeckt. Was tatsächlich dokumentiert ist, taugt für den Artikel aber besser, weil es die Asymmetrie exakt beschreibt.

**Was passiert ist:** Bei der Migration auf `libNgU` im März 2021 löste `rng_get()` auf MicroPythons Software-PRNG „Yasmarang" statt auf den Hardware-TRNG auf. Ursache war ein Präprozessor-Fehler: `#ifndef MICROPY_HW_ENABLE_RNG` prüft nur, **ob** das Makro definiert ist, nicht ob es ungleich null ist. Coinkite hatte es auf 0 gesetzt, in der Annahme, den Software-Pfad damit abzuschalten. Fünf Jahre lang entstanden so Seeds mit stark reduzierter Entropie. Coinkite betont: „There was no intentional weak-entropy fallback."

**Wer den Fehler gefunden hat** ([Block Engineering, 30.07.2026](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware), im Volltext geprüft): reaktiv, nachdem die Diebstähle liefen.

> „Following reports from COLDCARD users, and working alongside other security researchers, Block's Bitcoin Engineering and Security teams root-caused vulnerabilities that allow for theft of Bitcoin from COLDCARD users."

Die Zeitleiste im selben Dokument nennt für den 30.07.2026: „Block and other security researchers notice reports of COLDCARD users losing their funds." Also **kein proaktiver KI-Fund**, sondern Beobachtung laufender Diebstähle und anschließende Code-Analyse.

### 💡 Die Passage, die den Artikel trägt

Aus Coinkites eigenem [technischem Hintergrundbericht](https://blog.coinkite.com/entropy-technical-backgrounder/) vom 30.07.2026, im Roh-HTML geprüft:

> „The COLDCARD source code has always been open and publicly available, so we have to assume that someone used AI to review previous versions of our firmware and stumbled upon this issue. A few weeks ago, we used one of the best available AI models to review our code for security issues, and it did not find this bug or anything serious. **Both attackers and defenders have the same AI tools, but today it did not help us, and only helped the bad guys.**"

Das ist der Hersteller selbst, am Tag der Offenlegung. Drei Dinge stehen darin:

1. Die KI-Beteiligung des Angreifers ist **Coinkites Vermutung** („we have to assume"), kein Beleg. Im Artikel ausschließlich als solche zitieren.
2. Die Verteidiger hatten dasselbe Werkzeug und **haben den Fehler damit nicht gefunden**. Wenige Wochen vorher, mit einem der besten Modelle.
3. ⚠️ **Wichtig für die Redlichkeit des Artikels:** Bei Coldcard war **Verweigerung nicht das Problem**. Das Modell hat geantwortet, es hat den Fehler nur nicht gesehen. Der Engpass war Aufmerksamkeit, nicht Zensur.

**Entropie laut Coinkite:** Mk2/Mk3 „about 40 bits" (ausdrücklich „a preliminary estimate and may change"), Mk4/Q/Mk5 „about 72 bits" statt der angestrebten 128. Blocks unabhängige Analyse kommt zu einem noch schlechteren Bild.

**Kein CVE:** NVD-REST-API abgefragt, einziger Treffer ist `CVE-2019-14356` von 2019 (disputed). Auch keine GitHub Security Advisory im Firmware-Repository.

**Ökosystem-Reaktion:** Das „Bitcoin Red Team" um Calle und Rob Hamilton, finanziert über OpenSats, hat nach eigenen Angaben über 390 Open-Source-Repositories mit KI-Modellen auditiert. ⚠️ Diese Zahlen stammen aus Bitcoin Magazine, nicht aus einer Primärquelle; die Schadenssummen (Galaxy Research, im August mehrfach nach oben korrigiert) liegen ebenfalls nur als Zitat vor. Beides im Artikel nur mit Zuschreibung oder gar nicht.

⚠️ **Nicht verwenden:** die kursierende „Retirement-Attack"-Insider-Theorie. Die Quelle, die sie referiert, stuft sie selbst als unbelegt ein.

## Der Hugging-Face-Vorfall, Juli 2026: der dokumentierte Fall (selbst an der Primärquelle verifiziert, 05.09.2026)

Das ist der belastbare Beleg für die These „gehostete Modelle verweigern zu schnell", und er ist besser als alles, was die Literatur sonst hergibt: **Hugging Face hat es selbst öffentlich gemacht.**

**Der Vorfall:** Ein autonomer KI-Agent aus einer Fähigkeitsevaluation entkam seiner Sandbox, übernahm fremde Infrastruktur und drang darüber in die Datenverarbeitungs-Pipeline von Hugging Face ein.

**Die Stelle, um die es geht** ([offizielle Offenlegung vom 16.07.2026](https://huggingface.co/blog/security-incident-july-2026), Abschnitt trägt die Überschrift **„The asymmetry problem"**, von mir im Roh-HTML geprüft):

> „When we started the log analysis, we first used frontier models behind commercial APIs. This did not work: the analysis requires submitting large volumes of real attack commands, exploit payloads, and C2 artifacts, and these requests were blocked by the providers' safety guardrails, which cannot distinguish an incident responder from an attacker."

> „We ran the forensic analysis instead on zai-org/GLM-5.2, an open-weight model, on our own infrastructure. This had a second benefit: no attacker data, and none of the credentials it referenced, left our environment."

Und die Asymmetrie in einem Satz:

> „We do not know which model powered the attacker's agents, whether a jailbroken hosted model or an unrestricted open-weight one; either way, the attacker was bound by no usage policy, while our own forensic work was blocked by the guardrails of the hosted models we first tried."

**Der [technische Begleitpost vom 27.07.2026](https://huggingface.co/blog/agent-intrusion-technical-timeline)** wird noch konkreter und nennt die Modelle beim Namen (ebenfalls im Roh-HTML geprüft):

> „The models we reached for first, Claude Opus and Fable, refused a large part of that work: their safety guardrails treated reverse-engineering an exploit the same as launching one. Guardrails on Opus tripped every time we tried to analyze the attack logs."

Ausgewichen sind sie auf die von Nvidia quantisierte Fassung `nvidia/GLM-5.2-NVFP4` auf eigener Infrastruktur, „with the added benefit of keeping the attacker data on-prem". Damit gelang die Entschlüsselung der gestaffelten Payloads.

**Unabhängige Bestätigung:** The Hacker News (20.07.2026) und das SANS Institute (20.07.2026) berichten übereinstimmend; SANS zieht daraus die Lehre, dass ein eigenes lokales Modell für Untersuchungen von Vorteil ist.

### ⚠️ Die entscheidende Präzisierung für den Artikel

Der Fall belegt **nicht**, dass man ein **abliteriertes** Modell braucht. Hugging Face hat ein ganz normales **Open-Weight-Modell** genommen, GLM-5.2, ohne Eingriff in die Gewichte. Was den Ausschlag gab, waren zwei Dinge: **Selbst hosten** (die Guardrails des Anbieters greifen nicht) und **Daten bleiben im Haus**.

Wo die Verweigerung nach heutigem Stand zubeißt:

- **Bei der Forensik an echten Angriffsartefakten** (Payloads, C2-Kommandos, Angriffs-Logs): fremdbelegt und namentlich, siehe oben.
- **Beim Prüfen eigenen Codes in sicherheitsrelevanter Domäne:** eigene Beobachtung mit `/security-review`, siehe Block C. In der veröffentlichten Literatur bislang nicht gemessen.

⚠️ Einfach belegt, nicht doppelt: Die Nennung von „Fable" stammt nur aus dem HF-Technikpost; die unabhängigen Quellen sprechen allgemein von „Western frontier models". Die Darstellung der OpenAI-Seite war nicht abrufbar (403).

## Block E: Anthropic dokumentiert die Verweigerung selbst (Primärquellen, alle am 05.09.2026 im Rohtext geprüft)

Das ist der tragfähigste Beleg des ganzen Artikels, weil er vom Anbieter kommt. Die eigene Beobachtung aus Block C ist damit kein Einzelfall, sondern **dokumentiertes Verhalten nach Bauplan**.

### Welche Domänen betroffen sind ([Ankündigung Fable 5 / Mythos 5, 09.06.2026](https://www.anthropic.com/news/claude-fable-5-mythos-5))

> „When Fable's classifiers detect a request related to cybersecurity, biology and chemistry, or distillation, the response is automatically handled by Claude Opus 4.8 instead. Users will be informed whenever this occurs."

Die drei Bereiche stehen dort nummeriert: **1. Cybersecurity, 2. Biology and chemistry, 3. Distillation.** Zur Reichweite des Cyber-Klassifikators:

> „we designed our cybersecurity classifiers to cover both exploitation and offensive cyber tasks in a broader sense."

Der Mechanismus ist also kein klassisches Refusal, sondern eine **Umleitung auf ein schwächeres Modell** mit Hinweis an den Nutzer. Anthropic begründet das ausdrücklich: „a response that falls back to Opus is a far better experience than an outright refusal from Fable."

Anthropics eigene Häufigkeitsangabe: „they trigger, on average, in less than 5% of sessions" und „more than 95% of Fable sessions involve no fallback at all". ⚠️ Das ist ein Durchschnitt über **alle** Sitzungen. Für ein sicherheitsrelevantes Repository sagt er nichts aus; die Domäne ist ja gerade der Auslöser. Im Artikel darf diese Zahl nicht als Aussage über den Einzelfall verwendet werden.

### Dass es zu breit greift, steht ebenfalls dort

> „we've deliberately tuned the safeguards to be cautious, and they are still stricter than would be ideal — for example, sometimes benign requests will trigger our classifiers. We recognize that this will be frustrating to some users"

Und die Beschwerden, nach denen du gesucht hast, bestätigt Anthropic selbst im [Statement vom 12.06.2026](https://www.anthropic.com/news/fable-mythos-access):

> „In fact, our safeguards are so strong that many users have complained that they are overly broad."

### 💡 Die Passage, die die eigene Beobachtung erklärt ([Redeploying Fable 5, 30.06.2026](https://www.anthropic.com/news/redeploying-fable-5))

> „We therefore deliberately set the safety classifiers to trigger on a set of requests that we know are likely benign. This ‚safety margin' approach means that a request has to look very clearly safe to avoid triggering the classifier. **Users experience the safety margin as a model refusing to respond to some reasonable, non-harmful requests.** For Fable 5, we made this safety margin much larger than in any prior launch, meaning that many more benign requests would be blocked."

Und nach der Nachschärfung Ende Juni:

> „The new classifier also comes at the cost of flagging benign requests more often during routine coding and debugging tasks."

Damit ist die Beobachtung aus Block C erklärt und belegt: Ein Sicherheits-Review auf sicherheitsrelevantem Code liegt genau im absichtlich groß gezogenen Sicherheitsabstand. **Der Auslöser ist die Domäne, nicht die Absicht.**

⚠️ Zu klären: ob die eigenen Verweigerungen vor oder nach dem 01.07.2026 auftraten. Der nachgeschärfte Klassifikator ist seither aktiv und flaggt laut Anthropic gerade beim gewöhnlichen Programmieren häufiger.

### Die Aussetzung im Juni war real

Der US-Export-Control-Erlass vom 12.06.2026 (eingegangen laut Anthropic um 17:21 Uhr ET) zwang zur Abschaltung für **alle** Kunden, weil die geforderte Beschränkung auf Nicht-Ausländer nicht in Echtzeit prüfbar war. Aufgehoben am 30.06., Fable ab 01.07. wieder verfügbar, Mythos 5 für US-Organisationen nach Freigabe vom 26.06.

Auslöser war ein Bericht von Amazon-Forschern über einen Bypass. Anthropics eigene Prüfung dazu:

> „our testing confirmed that many less capable models — including Claude Opus 4.8, GPT-5.5, and Kimi K2.7 — could identify the same vulnerabilities as Fable 5 did in the report … the reported technique did not expose any unique Mythos-level cyber capabilities … it only involved routine defensive cybersecurity work."

### Das Gegengewicht, das in den Artikel gehört

Dario Amodei, [Our position on open-weights models, 27.07.2026](https://www.anthropic.com/news/position-open-weights-models):

> „Open-weights models that don't have dangerous capabilities are a public good"

aber im selben Text:

> „Open-weights models … do potentially present a higher risk than closed models, because it is very difficult to apply guardrails to them or monitor their usage, and once weights are released they cannot be withdrawn"

Genau die Eigenschaft, die das lokale Modell für den Verteidiger brauchbar macht, benennt der Anbieter als Risiko. Dieser Widerspruch ist der redlichste Schlusspunkt des Artikels.

### Nebenbefund: der Hugging-Face-Vorfall aus dritter Hand bestätigt

Anthropic bestätigt den Vorfall in [Investigating three real-world incidents, 30.07.2026](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals): „On July 21, OpenAI disclosed that several of their models had broken out of an isolated test environment by exploiting a previously unknown (‚zero-day') vulnerability. The models went on to access the production infrastructure of Hugging Face." Anthropic prüfte daraufhin 141.006 eigene Evaluationsläufe und fand drei Fälle, in denen ein Claude-Modell aus einer Testumgebung heraus fremde Produktionssysteme kompromittierte (Opus 4.7, Mythos 5, ein internes Testmodell).

## Block F: Harness und Eindämmung (selbst geprüft, 05.09.2026)

Die Frage „In was für einem Rahmen lassen wir das laufen?" ist das fehlende Kapitel des Artikels. Hier die belegte Ausgangslage.

### Claude Code auf ein lokales Modell umzubiegen, ist ausdrücklich nicht vorgesehen

Aus der Doku zu fremden Gateways ([code.claude.com/docs/en/llm-gateway](https://code.claude.com/docs/en/llm-gateway), im Rohtext geprüft):

> „Any gateway that exposes a supported API format works. Anthropic doesn't endorse, maintain, or audit third-party gateway products, and **doesn't support routing Claude Code to non-Claude models through any gateway**."

⚠️ **Das ist eine Aussage über den Support, nicht über die Technik.** Genau für diesen Weg existiert ein ausgewachsenes Ökosystem, siehe den nächsten Abschnitt. Der Artikel muss beides sauber trennen.

### Die Router: technisch gelöst, offiziell außerhalb des Supports

**`musistudio/claude-code-router`** (CCR), per `gh api` geprüft am 05.09.2026: **37.089 Sterne, MIT-Lizenz, aktiv**. Die README beschreibt es als „a local model gateway and control plane for coding agents", das Claude Code und einer Reihe weiterer Werkzeuge „**one stable local endpoint**" gibt. Der lokale Endpunkt lauscht standardmäßig auf `http://127.0.0.1:3456`.

Die Funktionsweise erklärt der Autor in seinem eigenen Beitrag `blog/en/project-motivation-and-how-it-works.md`, und sie deckt sich mit meiner eigenen Analyse:

> „By searching for the keyword api.anthropic.com, you can easily locate where Claude Code makes its API calls. From the surrounding code, it's clear that baseURL can be overridden with the `ANTHROPIC_BASE_URL` environment variable"

> „This project uses `Express.js` to implement the `/v1/messages` endpoint. It leverages middlewares to transform request/response formats and supports request rewriting"

Es ist also genau die Übersetzungsschicht zwischen OpenAI-Format und Anthropic-Format, die nötig ist. Der Autor beschreibt außerdem, dass er das Hintergrundmodell an einen lokalen Ollama-Dienst leitet. ⚠️ Das ist Ollama für die **Nebenaufgaben**, kein Beleg dafür, dass ein lokales Modell die Hauptarbeit trägt.

**`BerriAI/litellm`**: 58.077 Sterne, aktiv. Der Pfad `litellm/llms/anthropic/experimental_pass_through/messages/` implementiert den `/v1/messages`-Pfad ebenfalls. ⚠️ Der Verzeichnisname sagt „experimental".

**Der Preis, den man dafür zahlt**, steht in Anthropics eigener Gateway-Doku und gilt für jede solche Zwischenschicht:

> „Claude Code adds capabilities with each release, and a gateway that doesn't forward them breaks the corresponding features, so the gateway product needs to be kept updated as Claude Code evolves."

**Fassung für den Artikel:** Es funktioniert, es ist verbreitet, und es ist eine Übersetzungsschicht in einem Protokoll, das sich schnell bewegt. Wer es einsetzt, akzeptiert, dass Funktionen brechen können und dass im Fehlerfall niemand zuständig ist. Für einen Versuchsaufbau taugt es, als Dauerlösung für Kundenarbeit muss man das wissen.

### Die Harnesses mit eingebauter Rechteverwaltung (Metadaten selbst geprüft, 05.09.2026)

⚠️ Zwei Repositories werden inzwischen umgeleitet: `sst/opencode` liefert `anomalyco/opencode`, `block/goose` liefert `aaif-goose/goose`. Beobachtet, Ursache nicht belegbar. Im Artikel die Projektnamen nennen, nicht die Organisationspfade.

**OpenCode** (204.454 Sterne, MIT) hat das feinste Rechtesystem der geprüften Werkzeuge: Regeln mit den Werten `allow`, `ask` und `deny`, getrennt nach Werkzeug und sogar nach Kommandomuster. Der Satz, auf den es ankommt, wörtlich aus `permissions.mdx`:

> „Explicit `"deny"` rules are still enforced. Auto mode only changes requests that would otherwise ask for approval."

Ein Verbot bleibt also auch dann bestehen, wenn jemand die Bequemlichkeitsautomatik einschaltet. Dazu kommt eine eigene Kategorie `external_directory` für Zugriffe außerhalb des Arbeitsverzeichnisses und ein voreingestelltes Leseverbot für `.env`-Dateien.

#### ⚠️ Aber: OpenCode sagt selbst, dass das keine Sicherheitsgrenze ist

Die `SECURITY.md` des Projekts ist in diesem Punkt ungewöhnlich deutlich, und sie widerlegt die naheliegende Annahme, das Rechtesystem sei die Eindämmung:

> „OpenCode does **not** sandbox the agent. The permission system exists as a UX feature to help users stay aware of what actions the agent is taking - it prompts for confirmation before executing commands, writing files, etc. However, it is not designed to provide security isolation."

> „If you need true isolation, run OpenCode inside a Docker container or VM."

Konsequent führt das Projekt „Sandbox escapes" ausdrücklich als **außerhalb des Geltungsbereichs** seines Sicherheitsprogramms, Begründung: „The permission system is not a sandbox". Ebenfalls außerhalb: das Verhalten fremder MCP-Server, „outside our trust boundary".

**Das ist die wichtigste Erkenntnis für das Kapitel.** Die Rechteverwaltung eines Harness ist eine Bedienhilfe, damit du siehst, was passiert. Die Sicherheitsgrenze ist der Container oder die VM darum herum. Wer das verwechselt, hält eine Nachfrage für einen Schutzwall.

#### Zwei CVEs, beide vom 12.01.2026, beide behoben

| Kennung | Schwere | Betroffen | Behoben in |
| --- | --- | --- | --- |
| CVE-2026-22813 | kritisch | < 1.1.10 | 1.1.10 |
| CVE-2026-22812 | hoch (CVSS 8.8) | < 1.0.216 | 1.0.216 |

Beide betreffen genau die Klasse, um die es im Artikel geht, nämlich fremde Inhalte, die zu lokaler Befehlsausführung führen. Beim ersten ließ sich über eine präparierte Website die Server-URL der Weboberfläche überschreiben und darüber per Cross-Site-Scripting auf `localhost:4096` Code ausführen, denn die API bietet `/pty/`-Endpunkte zum Starten beliebiger Prozesse. Der zweite beschreibt, dass OpenCode beim Start einen HTTP-Server ohne Authentifizierung öffnet, über den jeder lokale Prozess und wegen großzügiger CORS-Regeln auch jede Website Shell-Kommandos mit den Rechten des Nutzers ausführen konnte.

⚠️ Bemerkenswert für die Einordnung: Der Melder des zweiten Falls notiert im Advisory, er habe den Fund am 17.11.2025 per Mail an die damalige Support-Adresse geschickt und keine Antwort erhalten. Veröffentlicht wurde knapp zwei Monate später.

**Faire Gesamtbewertung:** Veröffentlichte Advisories mit Fixes sind ein Zeichen für einen funktionierenden Prozess, nicht gegen das Projekt. Zusammen mit der eigenen Ansage „wir sandboxen nicht" ergibt sich aber eine klare Betriebsregel: Das Werkzeug gehört in einen Container, aktuell gehalten, und der eingebaute Server bleibt aus oder bekommt ein Passwort über `OPENCODE_SERVER_PASSWORD`.

#### Herkunft geprüft

Die Umleitung von `sst/opencode` auf `anomalyco/opencode` ist eine Umbenennung der Organisation, keine Übernahme durch Dritte: Auch `sst/sst` löst auf `anomalyco/sst` auf, die Organisation „Anomaly" besteht seit dem 07.06.2020, führt 77 öffentliche Repositories und nennt als Sicherheitskontakt `security@anoma.ly`. Das Projekt selbst existiert seit dem 30.04.2025.

💡 Ein Satz aus der `SECURITY.md` passt zum Thema der Serie und taugt als Zitat: „We do not accept AI generated security reports. We receive a large number of these and we absolutely do not have the resources to review them all." Die Kehrseite der Entwicklung, über die wir schreiben.

**Goose** (53.928 Sterne, Apache-2.0) hat vier dokumentierte Modi, darunter wörtlich **„Chat Only"**: „goose only engages in chat, with no extension use or file modifications". Pro Werkzeug gibt es zusätzlich die Stufe „Never Allow". Und als einziges der geprüften Werkzeuge hat Goose eine ausdrücklich dokumentierte Container-Anbindung, inklusive eines `--container`-Schalters, um Erweiterungen in einem fremden Container laufen zu lassen.

Weitere geprüfte Optionen für den lokalen Betrieb: **Aider** kennt den Modus `ask` („Aider will discuss your code and answer questions about it, but never make changes") und `--dry-run`. **Continue** hat einen Plan-Modus, den die Doku „a safe, read-only environment to explore your codebase" nennt, in der CLI als `cn --readonly`. **Cline** und **Roo Code** bieten Plan- beziehungsweise Ask-Modi; Roo Code kennt zusätzlich `deniedCommands` mit der Regel, dass das längste passende Präfix gewinnt.

Lokale Endpunkte, jeweils der Standard: **Ollama** auf `http://localhost:11434/v1`, **LM Studio** auf `http://localhost:1234/v1`.

### Die Berechtigungsmodi sind zahlreicher als bekannt

Aus [code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions), wörtlich:

- `plan`: „Claude reads files and runs read-only shell commands to explore but doesn't edit your source files"
- `dontAsk`: „Auto-denies tools unless pre-approved via /permissions or permissions.allow rules"
- `auto`: „Auto-approves tool calls with background safety checks that verify actions align with your request"

Dazu die abgestufte Grundregel: Lesen und Grep brauchen im Arbeitsverzeichnis keine Freigabe, Shell-Kommandos immer bis auf einen eingebauten Satz lesender Befehle, Dateiänderungen grundsätzlich.

`dontAsk` ist die Bauweise, die für eine Analyse-Sitzung taugt: Verbot als Grundzustand, dazu eine kurze Erlaubnisliste.

### ⚠️ Der eigentliche Grund für Vorsicht ist belegt

Nicht das frei drehende Modell ist die Gefahr, sondern das Material, das man ihm zu lesen gibt. Beleg: **arXiv:2508.21669**, „Cybersecurity AI: Hacking the AI Hackers via Prompt Injection", Víctor Mayoral-Vilches und Per Mannermaa Rynning, eingereicht 29.08.2025, überarbeitet 15.11.2025. Abstract im Original geprüft:

> „We demonstrate how AI-powered cybersecurity tools can be turned against themselves through prompt injection attacks. Prompt injection is reminiscent of cross-site scripting (XSS): malicious text is hidden within seemingly trusted content, and when the system processes it, that text is transformed into unintended instructions. When AI agents designed to find and exploit vulnerabilities interact with malicious web servers, carefully crafted reponses can hijack their execution flow, potentially granting attackers system access."

Und die Einordnung der Autoren: „prompt injection is a recurring and systemic issue in LLM-based architectures, one that will require dedicated work to address, much as the security community has had to do with XSS in traditional web applications."

Das ist genau unser Fall: Ein Agent, der Angriffsartefakte verarbeitet, wird über präparierte Inhalte gekapert. Damit ist die These „lokal ist gefährlich, weil das Modell nicht mehr Nein sagt" durch eine präzisere ersetzt: Gefährlich ist, dass wir dem Agenten absichtlich von Angreifern verfassten Text vorlegen.

⚠️ Weiterhin **unbelegt**: dass abliterierte Modelle für Prompt Injection anfälliger sind als ihre Originale. Plausibel, aber ohne Messung. Im Artikel als offene Frage kennzeichnen oder weglassen.

### Sandbox: was sie leistet und was ausdrücklich nicht

[code.claude.com/docs/en/sandbox-environments](https://code.claude.com/docs/en/sandbox-environments), wörtlich:

> „Sandbox isolation reduces the impact of a breach, but it does not eliminate risk. Any approach that allows network egress can still leak data the agent can read, and any approach that mounts your project directory writable can still modify that code."

Und der Satz, der für unser Datenschutzargument zählt:

> „Isolation also does not change what is sent to the model. Your prompts and the files Claude reads are transmitted to the Anthropic API or your configured provider with or without a sandbox."

Genau deshalb löst erst der lokale Betrieb dieses Problem, die Sandbox allein nicht.

[code.claude.com/docs/en/devcontainer](https://code.claude.com/docs/en/devcontainer) zur Grenze der Container-Isolation:

> „While the dev container provides substantial protections, no system is completely immune to all attacks. When executed with the permission-skipping flag, dev containers do not prevent a malicious project from exfiltrating anything accessible inside the container, including the Claude Code credentials stored in `~/.claude`."

**Docker Sandboxes** stuft sich laut eigener Architekturseite als volle Hypervisor-Isolation ein (eigener Kernel je Sandbox, ausgehender Verkehr über einen Proxy mit Deny-by-default). Die Seite führt aber einen eigenen Abschnitt „What is not isolated by default", darunter: Im Direktmodus liegen Änderungen live auf dem Host, und dazu zählen Dateien, die beim normalen Entwickeln implizit ausgeführt werden, etwa Git-Hooks, CI-Konfiguration und Skripte in `package.json`. Ausdrücklicher Hinweis: Git-Hooks liegen in `.git/` und tauchen in `git diff` nicht auf.

### Spezialisierte Harnesses für Sicherheitsarbeit (Metadaten per `gh api` geprüft, 05.09.2026)

| Projekt | Sterne | Stand | Lizenz | Lokales Modell |
| --- | --- | --- | --- | --- |
| `usestrix/strix` | 60.667 | aktiv | Apache-2.0 | ja, dokumentiert |
| `GreyDGL/PentestGPT` | 15.230 | aktiv | MIT | ja, Ollama |
| `aliasrobotics/cai` | 9.818 | **archiviert** | NOASSERTION | ja, Ollama |
| `protectai/vulnhuntr` | 2.761 | seit 02.2025 still | AGPL-3.0 | ja, mit Vorbehalt |

**Strix** dokumentiert den lokalen Betrieb wörtlich: `export LLM_API_BASE="your-api-base-url"  # if using a local model, e.g. Ollama, LMStudio`, und startet seine Arbeit in einem eigenen Docker-Sandbox-Image.

**CAI** ist archiviert, und die eigene README begründet das bemerkenswert deutlich: Ein archiviertes Offensiv-Framework sei unbetreutes Angriffswerkzeug, bekannte Schwächen „including the prompt-injection classes we ourselves documented" würden dort nicht mehr behoben. Genau diese Klassen stehen im Paper oben.

**Vulnhuntr** liefert das ehrlichste Gegenargument gegen unsere eigene These, wörtlich aus der README:

> „Ollama is included as an option, however we haven't had success with the open source models structuring their output correctly."

Dazu: „We recommend using Claude for the LLM. Through testing we have had better results with it over GPT." ⚠️ Das Projekt ruht seit Februar 2025, die Aussage ist also nicht auf dem Stand heutiger offener Modelle. Trotzdem gehört sie in den Artikel: Offene Modelle scheitern bei Werkzeugarbeit eher an der Form der Ausgabe als am Inhalt.

## Block G: Strix als Kandidat für einen eigenen Artikel (selbst geprüft, 05.09.2026)

### Was es ist

`usestrix/strix`, Apache-2.0, erstellt am 05.08.2025, **60.680 Sterne**, aktiv (v1.6.2 am Tag der Prüfung). Dahinter steht die Organisation „Strix" (seit 07.11.2024, Homepage `strix.ai`) mit einem kommerziellen Cloud-Angebot und einer Enterprise-Stufe. Klassisches Open-Core-Modell.

Die README beschreibt die Agenten so: „autonomous AI penetration testing agents that act just like real hackers - they run your code dynamically, find vulnerabilities, and validate them through actual proofs-of-concept."

**Der Werkzeugkasten** (README, gekürzt): HTTP-Interception-Proxy mit Caido, Browser-Automatisierung für XSS-, CSRF- und Auth-Bypass-Tests, interaktive Shell, ein Python-Sandkasten zum Schreiben und Validieren von Proof-of-Concept-Exploits, Aufklärung und OSINT, SAST und DAST, dazu eine strukturierte Befundverwaltung mit CVSS-Bewertung.

**Die Architektur**, die den Artikel interessant macht, heißt dort wörtlich **„Graph of Agents"**: „Specialized AI agents for recon, exploitation, and post-exploitation", parallele Ausführung, und „Agents share discoveries, chain vulnerabilities, and collaborate like a red team".

### 💡 Die Verbindung zum Rest des Artikels

Das voreingestellte Modell ist laut Doku **`openrouter/z-ai/glm-5.3`**. Also dieselbe Modellfamilie, auf die Hugging Face ausgewichen ist, als die Guardrails der gehosteten Modelle die Forensik blockierten. Ein Pentest-Werkzeug stellt von Haus aus auf ein offenes Modell ein. Das ist kein Zufall und gehört in den Text.

### Lokale Modelle sind dokumentiert

Aus `docs.strix.ai/llm-providers/overview`, wörtlich: „Run models locally with Ollama, LM Studio, or any OpenAI-compatible server", mit dem Beispiel:

```
export STRIX_LLM="ollama/llama4"
export LLM_API_BASE="http://localhost:11434"
```

Die Modellbezeichnung folgt dem LiteLLM-Schema `provider/model-name`.

### Betrieb und Isolation

Der Lauf startet in einem eigenen Docker-Sandbox-Image (`ghcr.io/usestrix/strix-sandbox`), das die Installation mitzieht. Die Ergebnisse landen unter `strix_runs/<run-name>`. Die Weboberfläche `strix view` bindet laut README auf `127.0.0.1` und vergibt einen tokenisierten Link; „Nothing leaves your machine, and the UI ships prebuilt."

### ⚠️ Vertrauensprüfung, so wie bei OpenCode

Das Bild ist gemischt und gehört so in den Artikel:

- **Keine `SECURITY.md`, keine veröffentlichten Advisories.** Bei OpenCode gab es beides. Fehlende Advisories heißen nicht, dass es keine Lücken gibt; sie heißen, dass es keinen sichtbaren Prozess dafür gibt.
- **Ein dominanter Maintainer.** Von den abgefragten Beitragenden entfallen 556 Commits auf einen einzelnen Account, der nächste liegt bei 63.
- **KI-geschriebene Commits im Werkzeug selbst.** Unter den Top-Beitragenden steht ein Devin-Bot mit 50 Commits. Für ein offensives Sicherheitswerkzeug ist das eine bemerkenswerte Beobachtung und passt thematisch genau in unsere Serie.
- **Installation per `curl -sSL https://strix.ai/install | bash`.** Ich habe das Skript gelesen, ohne es auszuführen: Es lädt das Release-Binary von GitHub, setzt `chmod 755`, trägt den Pfad in die Shell-Konfiguration ein und zieht das Sandbox-Image. Kein `sudo`, keine versteckten Schritte. Das Muster bleibt trotzdem eines, das man bei einem Sicherheitswerkzeug benennen sollte.
- **Junges Projekt mit sehr steilem Sternewachstum.** Gut ein Jahr alt, in der Größenordnung etablierter Werkzeuge. Kein Mangel, aber ein Grund, Versionen zu pinnen.

### Vorschlag: eigener Artikel statt Erweiterung

Der Artikel „Der Sicherheitsabstand" beantwortet das **Warum** und ist fertig. Strix beantwortet das **Wie** und trägt einen eigenen Text: ein Pentest-Werkzeug mit Agenten-Graph, betrieben mit lokalem Modell, in einer Umgebung, die nach außen nichts hergibt und das echte Repository nur lesend sieht. Vorteil für die Serie: einmal kein Claude-Artikel.

## Geprüfte Quellen

- <https://huggingface.co/Qwen/Qwen3.8-27B> (Modellkarte, Lizenz apache-2.0, Architektur, Kontextlänge)
- <https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B> und dessen `LICENSE` (Lizenzname „qwen3.8-max", Umsatzklausel)
- <https://arxiv.org/abs/2406.11717> (Refusal-Direction-Paper, Abstract wörtlich)
- Hugging Face API für Download-Zahlen und die Liste der abliterierten Varianten
