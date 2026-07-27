---
title: 'Böswillige Skills: Wie aus einem harmlosen Link eine Hintertür wird'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-07-27
keywords:
  - Agent Skills
  - Skill Marketplace
  - Supply Chain
  - Prompt Injection
  - Claude Code
  - MCP
  - Model Context Protocol
  - AI Security
  - Agentic Coding
  - KI-Agent
language: de
header: header.jpg
---

Ein Skill ist eine Textdatei. Genau das macht ihn so praktisch und genau das macht ihn so gefährlich. Wer einem KI-Agenten einen Skill installiert, gibt ihm keine Bibliothek, die in einer Sandbox läuft, sondern eine Anweisung, die der Agent mit seinen eigenen Rechten ausführt. Und diese Anweisung darf sagen: „Lade dir die restlichen Instruktionen von dieser Adresse."

**Genau dort setzt eine Angriffsklasse an, die im Frühjahr 2026 eindrucksvoll vorgeführt wurde: Eine Sicherheitsfirma baute einen harmlos aussehenden Skill, brachte ihn in einen populären Marketplace, bewarb ihn per Anzeige, bestand alle Prüfungen, und tauschte danach aus, was hinter dem Link lag.**

Dieser Artikel erzählt den Fall anhand der Originalquelle, zeigt, warum die üblichen Scanner ihn prinzipbedingt nicht sehen konnten, und was das für alle bedeutet, die Skills, Plugins oder MCP-Server aus dem Netz installieren. Am Ende stehen eine Prüfliste, die ich selbst benutze, und die Konsequenz, die ich daraus gezogen habe.

> ⚠️ Vorweg, weil es zum Thema passt: Der Bericht stammt von einer Firma, die Sicherheitsprodukte verkauft. Ich kennzeichne im Text, was Selbstauskunft ist und was ich unabhängig nachprüfen konnte.

## Inhalt

[[toc]]

## Ein Skill, der zu gut aussah

Am 22. Juni 2026 veröffentlichten Niv Hoffman und Or Nevo von der Sicherheitsfirma AIR einen Bericht mit dem Titel [„The Story of Skills"](https://www.air.security/blog-posts/the-story-of-skills). Darin beschreiben sie ein Experiment, das sie nach eigener Aussage in weniger als einer Stunde vorbereitet haben.

Sie bauten einen Skill namens `brand-landingpage`. Er versprach etwas, das viele wollen: eine hübsche Landing Page, generiert aus einem kurzen Interview über die eigene Marke. Als technischen Unterbau gab er **Google Stitch** an, Googles echtes Design-Werkzeug. Der Skill war fachlich sauber geschrieben, mit Phasen, Referenzdateien und Zustandsverwaltung. Wer ihn liest, sieht die Arbeit eines kompetenten Autors.

Bei der Themenwahl sollte man kurz innehalten, denn sie ist der psychologisch raffinierteste Teil des ganzen Angriffs. Eine Landing Page ist die klassische tief hängende Frucht: Fast jeder braucht eine, der erhoffte Effekt ist groß (Sichtbarkeit, Leads, ein professioneller erster Eindruck), und das gefühlte technische Risiko ist gleich null. „Ist ja nur die Landing Page, Hauptsache, sie sieht gut aus." Genau diese Denkweise senkt die Wachsamkeit. Niemand liest eine Sicherheitsanalyse, bevor er sich eine Startseite bauen lässt.

Vergleiche das mit einem Skill, der „Datenbank-Migrationen" oder „Zugriffsrechte verwalten" verspricht. Dort sitzt der Finger von selbst lockerer über der Stopptaste. Wer hingegen etwas Dekoratives installiert, rechnet nicht damit, dass ihm dabei die Kontrolle über seinen Agenten abhandenkommt. **Angriffe gehen nicht dorthin, wo die wertvollsten Daten liegen, sondern dorthin, wo die Aufmerksamkeit am niedrigsten ist.** Die Rechte, die der Agent mitbringt, sind ja in beiden Fällen dieselben.

Dann brachten sie ihn dorthin, wo Nutzer suchen: per Pull Request in einen öffentlichen Skill-Marketplace auf GitHub. AIR beschreibt ihn als Repository mit rund 36.000 Sternen, 156 Skills und einer „welcoming contribution policy", nennt ihn aber nicht beim Namen. Der Pull Request wurde angenommen. Damit erbte der Skill etwas, das man nicht kaufen kann: das Vertrauen, das in den Sternen des Repositories steckt.

Danach kam der Teil, den ich für den eigentlich interessanten halte. AIR schaltete eine Instagram-Anzeige. Nicht für Entwickler, sondern für die Zielgruppe, die heute Agenten benutzt, ohne Code zu lesen: Leute aus Marketing, Vertrieb und Design.

Und die Prüfungen? AIR gibt an, den Skill gegen die Scanner von Cisco, NVIDIA und skills.sh getestet zu haben. Alle stuften ihn als sicher ein.

Der Rest ist schnell erzählt. Nach der Verbreitung tauschte AIR den Inhalt hinter einer im Skill hinterlegten Adresse aus. Ab diesem Moment wies der Skill die Agenten an, ein Skript zu laden und auszuführen. Was das Skript tat, hielten die Autoren bewusst harmlos: Es sammelte die E-Mail-Adresse des Opfers ein und schickte sie an AIR. Betroffen waren nach ihren Angaben mehrere zehntausend Agenten, darunter solche in Firmenkonten.

Auf die Zahl kommt es aber gar nicht an, sondern auf diesen Satz aus dem Bericht:

> „We could have had full control of every one of their agents, their private conversations, and every internal system they could reach."

Wer die Identität eines Agenten übernimmt, muss nichts mehr überwinden. Er erbt alles, was dieser Agent darf.

Weil AIR den Marktplatz anonymisiert, habe ich selbst nachgesehen. Die Angaben passen auf [`wshobson/agents`](https://github.com/wshobson/agents), einen „Multi-harness agentic plugin marketplace" für Claude Code, Codex CLI, Cursor, OpenCode, GitHub Copilot und Gemini CLI. Dort finden sich der beschriebene Skill und der zugehörige [Pull Request #509](https://github.com/wshobson/agents/pull/509), eingebracht am 29. April 2026 von einem Konto namens `travis-d-elliott` und am 2. Mai gemerged. Das passt auf die Formulierung im Bericht, der PR sei „after a few anxious days" angenommen worden.

Und jetzt der Teil, der mich beim Nachprüfen wirklich überrascht hat: **Der Skill liegt dort bis heute.** Stand 27. Juli 2026, also gut fünf Wochen nach der Veröffentlichung des Berichts und knapp drei Monate nach dem Merge, enthält die Datei `plugins/brand-landingpage/skills/brand-landingpage/SKILL.md` unverändert zwei Verweise auf die Domain der Angreifer. Das Repository selbst ist quicklebendig, es zählt inzwischen 38.273 Sterne und wurde zuletzt am 22. Juli 2026 aktualisiert.

Weil damit zu rechnen ist, dass der Skill früher oder später entfernt wird, habe ich eine [Archivkopie abgelegt](https://agentic-schule.github.io/website-articles/blog/2026-07-boeswillige-skills-DE/ACHTUNG-boesartiger-skill-brand-landingpage.txt). Sie trägt einen unübersehbaren Warnhinweis, und die beiden Verweise auf die Angreifer-Domain sind darin entschärft, damit sie niemand versehentlich abruft. Bitte behandle die Datei als das, was sie ist: ein Beweisstück, keine Vorlage.

Das ist ausdrücklich kein Vorwurf an den Betreiber. Er ist das Opfer einer sorgfältig vorbereiteten Täuschung, und weil AIR den Marktplatz im Bericht anonymisiert hat, hat er von seiner Rolle in der Geschichte womöglich nie erfahren. Eine Meldung an ihn oder eine Entfernung des Skills erwähnt der Bericht jedenfalls nicht. Genau das ist der Punkt: **Ein bösartiger Beitrag verschwindet nicht von selbst, nur weil jemand darüber geschrieben hat.** Zwischen „ist öffentlich bekannt" und „ist bereinigt" liegt in diesem Ökosystem noch sehr viel Luft.

Was sich nicht nachprüfen lässt, ist die Reichweite. Sie beruht auf den zurückgeschickten E-Mails und damit auf der Buchführung derjenigen, die den Angriff gefahren haben. Das ist auch nicht weiter wichtig: Ob es ein paar hundert oder ein paar zehntausend Agenten waren, ändert nichts an dem, was hier vorgeführt wurde. Der Mechanismus ist der Punkt, und der ist zweifelsfrei belegt.

## Der Trick: Prüfung und Ausführung sind zwei verschiedene Momente

Der Skill enthielt eine Anweisung, die für sich genommen völlig unverdächtig aussieht. In der [heute noch abrufbaren `SKILL.md`](https://github.com/wshobson/agents/blob/main/plugins/brand-landingpage/skills/brand-landingpage/SKILL.md) steht sinngemäß, der Agent solle die SDK-Dokumentation konsultieren, denn das SDK sei neu und entwickle sich schnell, weshalb die Dokumentation als **„ground truth"** zu betrachten sei.

Das ist perfektes Social Engineering, nur eben gegen eine Maschine gerichtet. Es klingt nach guter Ingenieurspraxis („schau in die aktuelle Doku, nicht in veraltete Beispiele"), und es tut genau das, was der Angreifer braucht: Der Agent lädt Text von einer fremden Adresse und behandelt ihn als verbindliche Wahrheit.

Die Adresse selbst war der zweite Teil des Tricks. Google Stitch liegt in Wahrheit unter `stitch.withgoogle.com`. Der Skill verwies stattdessen auf eine Domain, die den Produktnamen im Titel führte und den Angreifern gehörte. Wer nicht weiß, unter welcher Adresse Googles Werkzeug wirklich residiert, und das weiß kaum jemand auswendig, hat keine Chance, den Unterschied zu bemerken. Der Agent übrigens auch nicht.

Damit ist der Angriff komplett, und er lässt sich in einem Satz zusammenfassen: **Geprüft wird der Skill, ausgeführt wird, was zum Zeitpunkt der Ausführung hinter dem Link liegt.** Zwischen diesen beiden Momenten liegen Wochen, und in diesen Wochen gehört der Inhalt dem Angreifer.

Das Muster ist aus der klassischen Software-Lieferkette bekannt und heißt dort Rug Pull. Invariant Labs (heute Teil von Snyk) hat es [schon im April 2025 für MCP beschrieben](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks): Ein bösartiger Server könne die Beschreibung eines Werkzeugs ändern, *nachdem* der Client sie freigegeben hat. Neu ist nicht die Idee. Neu ist, wie billig sie geworden ist, seit die Nutzlast reiner Text sein darf.

Und Anthropic beschreibt genau diese Gefahr in der eigenen Dokumentation, in erfreulicher Deutlichkeit:

> „External sources are risky: Skills that fetch data from external URLs pose particular risk, as fetched content may contain malicious instructions. **Even trustworthy Skills can be compromised if their external dependencies change over time.**"
>
> ([Agent Skills, Security considerations](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview))

Der letzte Halbsatz ist der wichtigste des ganzen Themas. Ein Skill kann heute vertrauenswürdig sein und morgen nicht mehr, ohne dass sich an ihm eine einzige Zeile ändert.

## Ein Muster, kein Einzelfall

Der AIR-Fall war ein kontrolliertes Experiment. Die unkontrollierten gibt es auch, und sie sind älter.

**Der erste bösartige MCP-Server in freier Wildbahn** war laut [Koi Security](https://www.koi.ai/blog/postmark-mcp-npm-malicious-backdoor-email-theft) das npm-Paket `postmark-mcp`, entdeckt im September 2025. Der Autor hatte den legitimen Code geklont und unter gleichem Namen veröffentlicht. Fünfzehn Versionen lang funktionierte alles einwandfrei. In Version 1.0.16 kam eine einzige Zeile dazu, die jede versendete E-Mail still als Blindkopie an einen fremden Server schickte. Passwort-Resets, Rechnungen, interne Memos. Der Autor war kein anonymer Account, sondern ein Entwickler mit Klarnamen und gepflegtem GitHub-Profil.

**Die größte Kampagne, die mir bei der Recherche begegnet ist,** lief im OpenClaw-Umfeld. Koi Security prüfte Anfang Februar 2026 insgesamt 2.857 Skills eines Marktplatzes und fand [341 bösartige](https://www.koi.ai/blog/clawhavoc-341-malicious-clawedbot-skills-found-by-the-bot-they-were-targeting), davon 335 aus einer einzigen Kampagne. Beim Update zwei Wochen später war der Marktplatz auf über 10.700 Skills gewachsen und die Zahl der Funde auf 824 gestiegen. Die Skills gaben vor, ein „Prerequisite" zu benötigen, und installierten in Wahrheit einen Datendieb aus der Familie des Atomic macOS Stealer.

Wie diese Kampagne die Prüfung überlebte, beschreibt [Snyk](https://snyk.io/articles/clawdhub-malicious-campaign-ai-agent-skills/) in einem Satz, der wie eine Blaupause des AIR-Falls klingt: Der Angriff umgehe die statische Analyse des Marktplatzes, „by keeping the malicious logic entirely external to the `SKILL.md` file".

**Und wenn Scanner doch hinsehen, macht man die Datei einfach zu groß.** Palo Altos Unit 42 fand im Juni 2026 [fünf bösartige Skills](https://unit42.paloaltonetworks.com/openclaw-ai-supply-chain-risk/), die nicht blockiert wurden; eine Technik dabei war schlicht, die README-Datei mit 22 MB Füllmaterial aufzublähen, um die Größenschwellen der Prüfer zu sprengen.

Dass Marktplätze grundsätzlich täuschbar sind, ist übrigens keine Eigenheit der KI-Welt. Koi fand im Januar 2026 zwei KI-Erweiterungen im offiziellen VS-Code-Marktplatz mit zusammen [rund 1,5 Millionen Installationen](https://www.koi.ai/blog/maliciouscorgi-the-cute-looking-ai-extensions-leaking-code-from-1-5-million-developers), die Dateiinhalte an einen fremden Server schickten. Der Kernsatz dort gilt eins zu eins für Skills:

> „The marketplace approved them. The reviews were positive. The functionality is real."

Und dieser Fall ist die eigentlich unbequeme Nachricht. Der VS-Code-Marktplatz ist keine Wildwuchs-Plattform von vorgestern, sondern das etablierte, seit Jahren betriebene Verzeichnis eines der größten Softwarehäuser der Welt. Auch npm und PyPI kämpfen nach über einem Jahrzehnt weiter mit untergeschobenen Paketen, und der selbstreplizierende npm-Wurm vom September 2025 war so gravierend, dass sogar die US-Behörde CISA eine [eigene Warnung](https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem) herausgab. Wer also darauf hofft, dass die Skill-Marktplätze das Problem in ein, zwei Releases wegkuratieren, sollte sich die Historie der etablierten Marktplätze ansehen: Dort hat es Jahre gedauert, das Problem einigermaßen einzudämmen, gelöst ist es bis heute nicht.

Bei den Skills stehen wir am Anfang derselben Strecke, nur mit deutlich höherem Tempo und ohne die Bremsen, die npm und PyPI sich über die Jahre eingebaut haben.

## Warum Scanner das Problem nicht lösen

Es liegt nahe, nach einem Werkzeug zu rufen, das den Mist einfach findet. Es gibt inzwischen mehrere, und sie sind auch nicht schlecht: Cisco betreibt einen [MCP-Scanner](https://github.com/cisco-ai-defense/mcp-scanner), NVIDIA hat mit [SkillSpector](https://github.com/NVIDIA/SkillSpector) seit März 2026 einen Scanner speziell für Agent-Skills, und Snyks [Agent Scan](https://github.com/snyk/agent-scan) (hervorgegangen aus Invariants `mcp-scan`) prüft Skills und MCP-Server auf eine ganze Reihe riskanter Muster.

Nur sollte man wissen, was diese Werkzeuge leisten können und was nicht.

**Erstens sehen sie nicht, was hinter einem Link liegt.** Das ist keine Unterstellung, das schreiben die Hersteller selbst. Snyk vergibt für genau diesen Fall [einen eigenen Befund-Code](https://github.com/snyk/agent-scan/blob/main/docs/issue-codes.md) und formuliert die Grenze glasklar: Der Scanner „cannot verify the full behavior of a skill (analysis is limited to the skill's own content, not externally referenced dependencies)". Ein zweiter Befund-Code beschreibt die Konsequenz: Nachgeladene Instruktionen erlauben es, das Verhalten des Agenten zu ändern, ohne den Skill anzufassen, und setzen damit „any form of version pinning" außer Kraft.

**Zweitens sind sie sich untereinander erstaunlich uneinig.** Eine Untersuchung von 67.453 Skill-Versionen ([arXiv 2606.01494](https://arxiv.org/abs/2606.01494), Mai 2026) verglich drei Prüfverfahren miteinander. Das Ergebnis ist ernüchternd: Zwei beliebige Scanner überschneiden sich bei höchstens 10,4 Prozent ihrer Treffer, nur 0,69 Prozent der Skills werden von allen dreien markiert, und **81,9 Prozent aller Funde stammen von genau einem einzigen Scanner**. Bei den tatsächlich bösartigen Skills erkannte SkillSpector in dieser Auswertung 6,8 Prozent.

**Drittens schlagen sie auch zu oft Alarm.** Eine zweite Arbeit über 238.180 Skills ([arXiv 2603.16572](https://arxiv.org/abs/2603.16572)) fand, dass Marktplatz-Scanner bis zu 46,8 Prozent der Skills als bösartig einstufen. Bezieht man den Kontext des Repositories mit ein, bleiben 0,52 Prozent verdächtig. Ein Scanner, der die Hälfte des Katalogs rot färbt, erzieht seine Nutzer dazu, die Farbe zu ignorieren.

NVIDIA schreibt die Grenze in die [eigene Dokumentation von SkillSpector](https://github.com/NVIDIA/SkillSpector), und der Satz sollte über jeder Diskussion zu diesem Thema stehen: Der Scanner sei „defense-in-depth, not a sandbox", er markiere riskante Muster vor der Installation, aber er halte einen Skill nicht auf, den man trotzdem installiert. Dazu kommt: „Static analysis only, no dynamic execution."

Statische Prüfung eines Artefakts, dessen eigentlicher Inhalt erst zur Laufzeit von einem fremden Server kommt, kann nicht funktionieren. Nicht weil die Scanner schlecht sind, sondern weil das Objekt zum Prüfzeitpunkt noch nicht existiert. Snyk formuliert das in seinem [technischen Bericht zum Skill-Ökosystem](https://github.com/snyk/agent-scan/blob/main/.github/reports/skills-report.pdf) vom Februar 2026 präzise: Der veröffentlichte Skill wirke bei der Prüfung harmlos, aber Angreifer könnten sein Verhalten jederzeit ändern, indem sie den nachgeladenen Inhalt austauschen. Die Erkennung hänge damit vom Zustand des entfernten Endpunkts in genau dem Moment ab, in dem der Agent den Skill benutzt.

## Wer prüft eigentlich die Marktplätze?

Die ehrliche Antwort steht im Kleingedruckten der Anbieter, und sie ist überall ähnlich.

**Anthropic** unterscheidet sauber zwischen dem offiziellen, kuratierten Marktplatz und dem Community-Marktplatz, dessen Plugins eine „automated validation and safety screening" durchlaufen und auf einen festen Commit-Hash gepinnt sind. Für alles andere gilt der Warnhinweis in der Dokumentation:

> „Make sure you trust a plugin before installing it. **Anthropic doesn't control what MCP servers, files, or other software are included in plugins and can't verify that they work as intended.**"
>
> ([Discover plugins](https://code.claude.com/docs/en/discover-plugins))

An gleicher Stelle steht der Satz, der die Einordnung liefert: Plugins und Marktplätze seien „highly trusted components that can execute arbitrary code on your machine with your user privileges".

**Das offizielle MCP-Register** ist noch deutlicher, indem es die Zuständigkeit ausdrücklich weiterreicht:

> „The MCP Registry focuses on namespace authentication and metadata hosting, **while relying on the broader ecosystem for security scanning of actual server code.**"
>
> ([About the MCP Registry](https://modelcontextprotocol.io/registry/about))

Das Register prüft also, ob ein Name legitim beansprucht wurde, nicht was der Code tut.

**OpenAI** warnt in der [Dokumentation zu MCP und Connectors](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) vor beidem, vor versteckten Instruktionen („Malicious MCP servers may include hidden instructions (prompt injections)") und vor genau unserem Rug Pull: „MCP servers may update tool behavior unexpectedly, potentially leading to unintended or malicious behavior."

Das ist übrigens keine Nachlässigkeit der Anbieter, sondern eine ökonomische Realität. Wie schnell diese Kataloge wachsen, zeigt der ClawHub-Fall von oben: In den zwei Wochen zwischen Koi-Bericht und Nachtrag wuchs der Marktplatz von 2.857 auf über 10.700 Skills. Bei diesem Tempo kann niemand jeden Beitrag manuell auditieren. Snyk zieht in seinem [technischen Bericht](https://github.com/snyk/agent-scan/blob/main/.github/reports/skills-report.pdf) vom 5. Februar 2026 deshalb einen Vergleich, den ich treffend finde: Das heutige Agenten-Ökosystem gleiche der „Wild West"-Ära früher Paketmanager wie npm und PyPI, „a time of explosive growth shadowed by significant security growing pains".

Wie wenig das eine theoretische Sorge ist, zeigt eine Nebenbemerkung desselben Berichts: Zum Zeitpunkt der Veröffentlichung waren nach Angaben der Autoren „at least 8 manually confirmed malicious skills" auf ClawHub weiterhin öffentlich verfügbar. Von 3.984 untersuchten Skills stuften sie 76 als eindeutig bösartig ein, und 13,4 Prozent enthielten mindestens einen kritischen Befund.

Ein Trugschluss verdient noch eine eigene Warnung, weil er im AIR-Fall der eigentliche Türöffner war: **Popularität ist kein Sicherheitsmerkmal.** Der Skill erbte die Sterne eines fremden Repositories, ohne selbst je geprüft worden zu sein. Im selben Bericht steht der passende Satz: „Skill popularity is currently not a safe proxy for security, as download metrics can be artificially inflated."

## Was ein Skill anrichten kann, wenn er lügt

Bleibt die Frage, warum das alles so ernst ist. Ein Stück Text, das der Agent liest, klingt harmloser als eine ausführbare Datei.

Der Unterschied liegt in den Rechten. Anthropic beschreibt in der [Skills-Dokumentation](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) zwei sehr verschiedene Welten, und dieser Kontrast ist der Kern des Risikos:

- Läuft ein Skill über die **Claude API**, gilt: „No network access: Skills cannot make external API calls or access the internet."
- Läuft er in **Claude Code** auf deinem Rechner, gilt: „Full network access: Skills have the same network access as any other program on the user's computer."

Der Agent auf deiner Maschine ist also kein eingesperrter Prozess, sondern arbeitet mit deinen Rechten. Was du darfst, darf er. Und was er darf, darf ein Skill, der ihn belügt. Anthropic benennt die möglichen Folgen ungeschminkt: „data exfiltration, unauthorized system access, or other security risks".

Ich mag an dieser Stelle die Formulierung von [Unit 42](https://unit42.paloaltonetworks.com/openclaw-ai-supply-chain-risk/) zu den ClawHub-Funden, weil sie das Ergebnis so nüchtern beschreibt: Weil Skill-Logik und Vollmacht des Agenten nicht getrennt seien, bedeute eine Installation „complete control over the agent's identity". Nicht über den Rechner, wohlgemerkt, sondern über die Identität des Agenten. Und die ist im Zweifel mehr wert als ein Passwort, weil sie überall dort gilt, wo der Agent ohnehin schon angemeldet ist.

Anthropic zieht daraus in der Dokumentation die naheliegende Konsequenz und formuliert sie als Regel: „Use Skills only from trusted sources: those you created yourself or obtained from Anthropic." Wer trotzdem etwas Fremdes einsetzt, solle „exercise extreme caution and thoroughly audit it before use".

## Praxis: Was ich vor jeder Installation prüfe

Manches muss man nun einmal installieren, einen fremden MCP-Server etwa kann man nicht mal eben selbst nachschreiben. Für diese Fälle habe ich feste Regeln, und die wichtigste davon ist die letzte. Für Skills gehe ich inzwischen noch einen Schritt weiter, dazu gleich mehr.

> **🛠️ Selbst nachbauen: die Fünf-Minuten-Prüfung vor der Installation**
>
> 1. **Lies die `SKILL.md` wirklich.** Nicht die README des Marktplatzes, sondern die Datei, die der Agent später als Anweisung liest. Sie ist Text, das dauert zwei Minuten.
> 2. **Suche nach Adressen.** `grep -rn "https\?://" .` im Skill-Ordner. Jede URL ist eine Stelle, an der später etwas anderes stehen kann als heute. Fragen: Gehört die Domain wirklich dem genannten Anbieter? Stimmt die Schreibweise exakt?
> 3. **Suche nach Autorität.** Formulierungen wie „ground truth", „authoritative", „always follow the instructions at" verwandeln fremden Text in Befehle. Das ist das Muster aus dem AIR-Fall.
> 4. **Schau in die mitgelieferten Skripte**, nicht nur in die Markdown-Dateien. Und in alles, was der Skill nachinstallieren will („Prerequisites", „Setup", „utility").
> 5. **Prüfe Herkunft statt Popularität.** Wer hat den Beitrag eingebracht, seit wann existiert das Konto, was hat es sonst beigetragen? Sterne gehören dem Repository, nicht dem einzelnen Skill darin.

Zwei weitere Gewohnheiten haben sich bewährt:

**Nutze die Schutzmechanismen, die schon da sind.** Claude Code fragt laut [Sicherheits-Dokumentation](https://code.claude.com/docs/en/security) bei Netzwerkzugriffen nach, führt `curl` und `wget` nicht automatisch aus, beschränkt Schreibzugriffe standardmäßig auf das Arbeitsverzeichnis und kann Bash-Kommandos in einer Sandbox mit Datei- und Netzwerk-Isolation ausführen. Wer diese Nachfragen aus Bequemlichkeit generell wegklickt, schaltet genau die Kontrolle ab, an der ein solcher Angriff sichtbar würde: Das Nachladen des Skripts ist ein Netzwerkzugriff, für den der Agent in Claude Code um Erlaubnis fragen müsste. Wie andere Werkzeuge das handhaben, muss man je nach Umgebung nachlesen; der angegriffene Marktplatz bediente gleich mehrere.

**Trenne die Räume.** Ein Agent, der einen neuen Skill ausprobiert, gehört nicht in das Verzeichnis mit den Produktionszugängen. Bei mir läuft Neues zuerst in einer Umgebung, in der wenig zu holen ist. Das ist derselbe Reflex, mit dem man auch keine unbekannte `.exe` auf dem Rechner mit der Buchhaltung startet.

Und die wichtigste Regel, die sich aus dem ganzen Artikel ergibt: **Ein Skill, der Inhalte aus dem Netz nachlädt und als verbindlich behandelt, ist nicht prüfbar.** Nicht von dir, nicht von einem Scanner, von niemandem. Man kann so einen Skill benutzen, wenn man dem Betreiber der Adresse dauerhaft vertraut, so wie man einem Paketmanager vertraut. Man sollte sich nur nicht einbilden, ihn geprüft zu haben.

## Der beste Schutz: schreib deine Skills selbst

Nach all dem komme ich zu einer Konsequenz, die zunächst nach Mehrarbeit klingt und in Wahrheit welche spart: **Nimm fremde Skills als Vorlage, nicht als Abhängigkeit.**

Anders als bei einem MCP-Server ist das hier tatsächlich realistisch: Ein Skill ist Prosa mit ein paar Kommandos darin. Er ist kein Framework, das man nachbaut, sondern eine Arbeitsanweisung, die man in einer halben Stunde selbst schreibt, oft genug schreibt sie der Agent auf Zuruf. Wer einen fremden Skill ohnehin gründlich liest, wie es die Prüfliste oben verlangt, hat die Arbeit fast schon getan. Der Schritt von „ich habe verstanden, was der macht" zu „ich habe das für mein Projekt aufgeschrieben" ist klein.

Dabei gewinnt man gleich zweimal:

- **Kein Vertrauensproblem mehr.** Was man selbst geschrieben hat, kann hinter dem Rücken nicht ausgetauscht werden. Das gesamte Problem dieses Artikels, der Unterschied zwischen Prüfzeitpunkt und Ausführungszeitpunkt, verschwindet, weil es keine fremde Adresse mehr gibt, von der Anweisungen nachgeladen werden.
- **Deutlich bessere Passgenauigkeit.** Fremde Skills sind notgedrungen generisch, sie müssen für alle funktionieren. Dein eigener Skill kennt deine Ordnerstruktur, deine Konventionen, deine Test-Kommandos und die Eigenheiten deines Projekts. Er ist deshalb nicht nur sicherer, sondern schlicht besser.

Das ist keine exotische Einzelmeinung. Snyk gibt Skill-Entwicklern in seinem Bericht dieselbe Richtung vor: Man solle Skills als „fully self-contained packages" bauen und alles vermeiden, was Selbstaktualisierung oder das regelmäßige Abrufen einer bestimmten URL für weitere Agenten-Anweisungen bedeutet. Und für Nutzer lautet die Empfehlung schlicht: „not to install agent skills without prior review".

### Warum mir „review" allein nicht reicht

An dieser Stelle möchte ich einen Schritt weiter gehen als Snyk. Denn genau das ist doch die Lehre aus dem geschilderten Fall: **Kein Review kann sicherstellen, dass nicht doch irgendwo ein schadhaftes Fragment steckt.**

Prompt Injection ist eine Disziplin für sich, und sie entwickelt sich schneller, als eine Prüfliste mitwachsen kann. Diesmal war es eine URL, die man beim Lesen immerhin sehen konnte. Beim nächsten Mal ist es etwas, das man als Mensch gar nicht als Anweisung erkennt. Man muss sich das nicht ausdenken, es ist längst dokumentiert: Snyk führt einen eigenen Befund-Code für **versteckte Unicode-Zeichen**. Deren Beschreibung liest sich wie eine Warnung an alle, die auf sorgfältiges Lesen vertrauen:

> „These characters are invisible when rendered but are still processed by AI models. Attackers use them to smuggle instructions past human review."
>
> ([Agent Scan, Befund W021](https://github.com/snyk/agent-scan/blob/main/docs/issue-codes.md))

Genannt werden dort Zero-Width-Spaces, Richtungs-Umschalter und Unicode-Tag-Zeichen, die eine **komplette versteckte Botschaft** kodieren können. Für uns sieht das aus wie nichts oder wie eine sinnlose Zeichenfolge, die man beim Lesen achselzuckend überspringt. Der Agent liest sie mit.

Damit kippt die Logik des Prüfens. Man prüft ja nicht mehr nur, ob im Text etwas Böses steht, sondern ob im Text etwas steht, das man gar nicht sehen kann.

### Die Konsequenz: immer mit einem weißen Blatt anfangen

Deshalb lautet mein Rat, und der geht bewusst über „gründlich lesen" hinaus:

> **🛠️ Selbst nachbauen: Skills übernehmen, ohne sie zu kopieren**
>
> 1. **Niemals eine fremde Datei herüberkopieren und anpassen.** Auch nicht „nur zum Anfangen". Was einmal in deinem Verzeichnis liegt, wird irgendwann vom Agenten gelesen, inklusive dem, was du beim Überfliegen nicht gesehen hast.
> 2. **Mit einer leeren Datei starten.** Erst dann die Ideen und Konzepte einzeln herübertragen, eines nach dem anderen.
> 3. **Den Agenten neu formulieren lassen.** Er soll den fremden Text lesen, verstehen und **in eigenen Worten** neu aufschreiben. Was dabei entsteht, enthält keine unsichtbaren Zeichen mehr, denn sie überleben die Neuformulierung nicht.
> 4. **Für Code gilt dasselbe.** Nicht übernehmen, sondern nacherzählen lassen.

Der dritte Punkt ist der entscheidende, und er hat einen angenehmen Nebeneffekt: Die Neuformulierung ist zugleich ein Verständnistest. Was der Agent nicht in eigenen Worten wiedergeben kann, hat er nicht verstanden, und dann willst du es ohnehin nicht in deinem Projekt haben.

Beim Code bekommt man diese Neu-Interpretation übrigens geschenkt, wenn ohnehin ein Bruch nötig ist. Portiert man etwa ein Python-Skript, in dem man selbst nicht so versiert ist, nach TypeScript, das dem eigenen Können entspricht, dann **erzwingt** allein die Portierung eine vollständige Neu-Interpretation. Zeile für Zeile muss jemand verstehen, was da eigentlich passiert. Versteckte Fracht überlebt so einen Übersetzungsvorgang nicht, und man versteht am Ende sein eigenes Werkzeug.

Und ganz zum Schluss, wenn alles steht: Ein `/security-review` hat noch nie geschadet. Der [eingebaute Befehl](https://code.claude.com/docs/en/commands) prüft die anstehenden Änderungen auf Sicherheitsprobleme. Das ersetzt keinen der Schritte davor, aber es ist die letzte Gelegenheit, etwas zu bemerken, bevor es dauerhaft in deinem Projekt wohnt.

Für Marktplätze bleibt damit eine sehr nützliche Rolle: Sie sind ein exzellenter Ideenkatalog. Dort sieht man, welche Arbeitsschritte sich überhaupt lohnend automatisieren lassen und wie andere ein Problem zerlegen. Nur sollte man von dort Ideen mitnehmen, keine Dateien.

## Fazit: Das Vertrauen liegt bei dir

Skills sind großartig. Sie sind der Grund, warum Agenten heute Dinge können, für die vor einem Jahr eine eigene Integration nötig war. Und sie sind ein Ökosystem im Wildwuchs, mit Marktplätzen, die ihre Prüfpflicht ausdrücklich von sich weisen, mit Scannern, die sich zu vier Fünfteln uneinig sind, und mit einer Angriffsklasse, gegen die statische Prüfung strukturell nicht gewinnen kann.

Fünf Dinge nehme ich für mich mit:

- **Der Prüfzeitpunkt ist nicht der Ausführungszeitpunkt.** Alles, was ein Skill erst zur Laufzeit holt, ist ungeprüft, egal wie grün das Häkchen beim Download war.
- **Vertrauen wird geerbt, Sicherheit nicht.** Sterne, Downloadzahlen und ein akzeptierter Pull Request sagen nichts über den Inhalt einer einzelnen Datei.
- **Der Agent handelt mit meinen Rechten.** Deshalb ist die Frage vor jeder Installation nicht „ist das wahrscheinlich böse?", sondern „was könnte es anrichten, wenn es böse wäre?".
- **Selbst geschrieben schlägt fremd installiert.** Ein Skill ist Text, kein Framework. Wer ihn selbst schreibt, hat kein Vertrauensproblem und obendrein das passendere Ergebnis.
- **Lesen reicht nicht, neu schreiben schon.** Gegen Anweisungen, die für uns unsichtbar sind, hilft kein noch so gründliches Review. Es hilft, den Text nie zu kopieren, sondern neu formulieren zu lassen.

Der Vergleich mit den frühen Paketmanagern trägt weit, aber er hat einen Haken. Bei npm musste bösartiger Code erst ausgeführt werden. Ein Skill muss nur überzeugend formuliert sein, denn er richtet sich an ein System, das darauf trainiert ist, Anweisungen zu befolgen. Das ist die eigentliche Neuerung, und darauf haben wir noch keine gute Antwort.

Bis es sie gibt, helfen zwei alte: lesen, was man installiert. Und im Zweifel lieber selbst schreiben.

**Wie haltet ihr das?** Prüft ihr Skills vor der Installation, habt ihr eigene Regeln oder sogar schon einen Fall erlebt? Ich freue mich über jede Nachricht, und wenn genug zusammenkommt, mache ich daraus einen Folgeartikel mit euren Praktiken.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
