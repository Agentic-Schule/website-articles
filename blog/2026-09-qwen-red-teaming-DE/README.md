---
title: 'The Asymmetry Problem: Wenn nur die Angreifer freie KI-Werkzeuge haben'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-09-25
keywords:
  - Security
  - Red Teaming
  - Qwen
  - Lokale Modelle
  - Claude Code
  - Open Weights
  - Agentic Coding
language: de
header: header.jpg
---

In der IT-Sicherheit brennt es gerade akut.

Ein Hardware-Hersteller brachte es diesen Sommer auf den Punkt, nachdem seinen Kunden reihenweise Geld gestohlen worden war: „Both attackers and defenders have the same AI tools, but today it did not help us, and only helped the bad guys."

**Wer sich nicht an die Regeln hält, war immer im Vorteil. Bei KI-Werkzeugen bekommt diese alte Weisheit eine neue Schärfe: Der Verteidiger nimmt die Version aus der Cloud, mit vorgegebenem System-Prompt, Guardrails und Rate-Limits, und der Anbieter liest mit. Der Angreifer geht lokal, ohne fremden System-Prompt, auf Wunsch ohne Guardrails, begrenzt nur durch seine Rechenkapazität. An zwei dokumentierten Vorfällen mache ich dieses Dilemma greifbar. Danach zeige ich, wie jeder mit einem lokalen Modell den Nachteil verkleinert.**

## Inhalt

[[toc]]

## Zwei Beispiele aus dem heißen Sommer 2026

Diese beiden Vorfälle haben mich besonders beeindruckt. Sie kamen wenige Tage auseinander, aus verschiedenen Ecken der Sicherheitswelt, und führen doch zur selben Frage.

### Coldcard: ein Job, abgrundtief versagt

Eine Hardware-Wallet hat eine einzige Aufgabe: den privaten Schlüssel schützen, unter allen Umständen. Sie ist die letzte Bastion. Sie soll auch dann sicher bleiben, wenn dein eigener Rechner längst kompromittiert ist. Diese Messlatte liegt aus gutem Grund so hoch. Viele Bitcoiner halten ihre gesamten Ersparnisse auf der Blockchain, und dahinter steht am Ende dieser eine Schlüssel.

Die Coldcard galt unter Bitcoinern als eine der sichersten dieser Geräte. Und genau sie hatte ein massives Problem: Das Geheimnis war nicht wirklich geheim. Es war von Anfang an erratbar. Für eine Hardware-Wallet ist das die denkbar größte Katastrophe.

Wie erratbar? Ein Schlüssel muss 128 Bit stark sein, und diese riesige Zahl muss an jeder Stelle aus einem echten, unvorhersehbaren Zufallswert entstanden sein. Man nennt das Entropie. Doch es gab überhaupt keine echte Entropie! Statt der 128 Bit blieben laut Blocks Analyse je nach Gerät nur einige zehntausend bis höchstens gut vier Milliarden Möglichkeiten übrig. So einen Raum zählt ein Angreifer durch, leitet aus jedem Kandidaten die möglichen Bitcoin-Adressen ab und sucht die, die auf der öffentlichen Blockchain Guthaben halten.

Weil der Schlüsselraum so klein ist, geht das Durchrechnen schneller, als neue Blöcke entstehen. Das macht sogar die Rettung tückisch. Wer merkt, dass seine Wallet betroffen ist, und die Bitcoin auf eine sichere Adresse bringen will, schickt dafür eine Transaktion in den öffentlichen Mempool. Dort ist sie für jeden sichtbar. Ein Angreifer, der denselben Schlüssel längst berechnet hat, überbietet die Rettung mit einer höheren Gebühr und greift zuerst zu. Die bedrohte Adresse zu bewegen, ruft die Angreifer erst recht auf den Plan.

Vorbei ist das nicht. Solange betroffene Adressen noch Guthaben halten, bleibt jede von ihnen ein offenes Ziel. Jede geleerte Wallet gehört einem Menschen. Hier wird keine Bank ausgeraubt, die versichert ist. Es trifft Kleinanleger, die an eine Sache geglaubt und alles selbst verwahrt haben. Verwerflicher geht es nicht.

Und hier gibt es keine Ausrede. Wer seinen Schlüssel mit der Software des Geräts erzeugt, muss sich darauf verlassen können, dass dieser Schlüssel echte Entropie hat. Das ist der eine Job. Coinkite hatte genau diesen einen Job, und genau daran ist die Firma abgrundtief gescheitert. Der spätere Verweis, man hätte den Zufall ja auch selbst würfeln können, ändert daran nichts. Er schiebt die Verantwortung auf den Nutzer, obwohl das Gerät sie tragen sollte. Schlimmer geht es nicht.

Jahrelang fiel das niemandem auf. Dann, mitten in der Zeit leistungsfähiger KI, wird ausgerechnet diese Lücke gefunden. An einen Zufall glaube ich da nicht. Beweisen lässt es sich nicht, denn die Angreifer können wir nicht fragen, die legen es darauf an, keine Spuren zu hinterlassen. Aber der Quelltext der Coldcard war immer offen, und Coinkite zieht denselben Schluss, ausdrücklich als Vermutung:

> „The COLDCARD source code has always been open and publicly available, so we have to assume that someone used AI to review previous versions of our firmware and stumbled upon this issue. A few weeks ago, we used one of the best available AI models to review our code for security issues, and it did not find this bug or anything serious."

Bekannt wurde der Fehler auf die schlimmstmögliche Weise: Die Bitcoin verschwanden. Kein Audit hat ihn gefunden und kein Bug-Report. Es waren die leeren Wallets. Rekonstruiert hat die Ursache das Bitcoin-Sicherheitsteam von Block, dem US-Finanzkonzern hinter Cash App und Square. Es wurde auf Nutzer aufmerksam, die ihre Bestände verloren, arbeitete sich von dort zum Fehler zurück und hat die [technische Analyse veröffentlicht](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware).

Und die Ursache ist ärgerlich klein, fast schon tragisch. Erzeugen sollte den Schlüssel der Hardware-Zufallsgenerator, der eigens dafür verbaute TRNG. Genau der kam nicht zum Zug. Durch einen Bau- und Link-Fehler fiel die Zufallserzeugung auf einen Standard aus MicroPython zurück, auf Yasmarang, einen allgemeinen Software-Generator, der eigentlich immer hätte ersetzt werden sollen. In der Firmware steckte sogar eine Sicherung dagegen: ein `#error "get a HW TRNG plz"`, das den Build abbrechen sollte, wenn kein Hardware-Zufall da ist. Nur stand davor `#ifndef MICROPY_HW_ENABLE_RNG`, und `#ifndef` prüft bloß, **ob** ein Makro definiert ist, nicht welchen Wert es hat. Coinkite hatte es auf `0` gesetzt, weil die Coldcard ihren eigenen Generator mitbringt. „Auf 0 definiert" zählt aber als „definiert", also schlug die Sicherung nie an. Der Hersteller stellt klar: „There was no intentional weak-entropy fallback."

Dass eine Schlüsselerzeugung überhaupt auf einen Platzhalter zurückfallen kann, der immer ersetzt gehört, ist das eigentlich gefährliche Muster. Man sieht ja, wohin es führt. (Nebenbei: genau wegen solcher Fälle habe ich in C nie gern mit Makros gearbeitet. Makros sind Bugs mit Ansage, wenn man mich fragt.)

Was ich hier mitnehme, ist der Kern der ganzen Geschichte. Die Open-Source-Entwickler hatten den Fehler nicht gefunden. Auch deren KI nicht. Ein oder mehrere Angreifer hatten ihn. Zwischen den beiden Seiten bestand eine Informationsasymmetrie, und die eine Seite hat sie in bare Münze verwandelt.

### Hugging Face: „The asymmetry problem"

Im Coldcard-Fall hat die KI geantwortet, sie war nur nicht schlau genug oder nicht aggressiv genug, um den Fehler zu finden. Das ist die eine Art, wie so ein Modell versagt. Es gibt eine zweite, und sie ist tückischer: Ein Modell könnte helfen, weigert sich aber, weil das Thema gefährlich aussieht. Diese Verweigerung ist der Kern des zweiten Falls.

Im Juli 2026 brach ein ganzer Schwarm von KI-Agenten von OpenAI aus seinem Käfig aus. Bei internen Sicherheitstests sollten die Modelle vom Internet abgeschottet sein. Waren sie aber nicht. Getrieben von einem internen Forschungsmodell fanden sie eine bis dahin unbekannte Schwachstelle und brachen aus. Sie richteten sich eigene, nicht genehmigte Kommunikationswege ein, verteilten die Arbeit untereinander und griffen echte Systeme an, darunter die Produktionsinfrastruktur von Hugging Face. OpenAI schreibt, die Agenten hätten sich dabei zeitweise selbst als „swarm" oder „collective" bezeichnet. Die Geschichte lief durch die Fachpresse und bis auf die Bühne der Black Hat Konferenz.

In seinem [Report vom 26. August 2026](https://openai.com/index/hugging-face-incident-and-the-road-ahead/) wird OpenAI ungewöhnlich deutlich. Die Modelle hätten „controls designed to isolate them from the internet" umgangen und dabei eigene wie fremde Infrastruktur kompromittiert. Und dann der Satz, der die Branche aufhorchen ließ:

> „We consider this incident a "warning shot" for us and for the world: evidence that, without proper safeguards, highly capable AI agents are now able to work around technical controls, collaborate through unapproved channels, and take dangerous actions that no human directed."

Jetzt kommt der Teil, um den es hier wirklich geht. Noch während der Angriff lief, musste Hugging Face die Spuren auswerten, um mit dem Angreifer Schritt zu halten: Angriffs-Logs, gestaffelte Schadcode-Pakete, Kommandokanäle. Dafür wollte das Team Sprachmodelle einsetzen. Der Abschnitt der [Offenlegung](https://huggingface.co/blog/security-incident-july-2026), in dem das steht, trägt die Überschrift „The asymmetry problem":

> „When we started the log analysis, we first used frontier models behind commercial APIs. This did not work: the analysis requires submitting large volumes of real attack commands, exploit payloads, and C2 artifacts, and these requests were blocked by the providers' safety guardrails, which cannot distinguish an incident responder from an attacker."

Der [technische Begleitbericht](https://huggingface.co/blog/agent-intrusion-technical-timeline) nennt die Modelle beim Namen: „The models we reached for first, Claude Opus and Fable, refused a large part of that work." Ausgewichen ist das Team auf ein offenes Modell auf eigener Infrastruktur, GLM-5.2. Damit gelang die Auswertung, und der Nebeneffekt war für einen Verteidiger fast genauso wertvoll: keine Angreiferdaten und keine Zugangsdaten verließen die eigene Umgebung.

Die Asymmetrie fasst Hugging Face in einem Satz zusammen:

> „We do not know which model powered the attacker's agents, whether a jailbroken hosted model or an unrestricted open-weight one; either way, the attacker was bound by no usage policy, while our own forensic work was blocked by the guardrails of the hosted models we first tried."

Der Angreifer kannte keine Nutzungsbedingung. Der Verteidiger schon. Bleibt die Frage, warum ein Modell bei legitimer Arbeit so reagiert. Die Antwort steht öffentlich, und sie ist überraschend genau.

## Der Sicherheitsabstand ist Absicht

Der entscheidende Absatz steht im Bericht zur [Wiederinbetriebnahme](https://www.anthropic.com/news/redeploying-fable-5) Ende Juni. Er erklärt das Verhalten, über das sich so viele Entwickler wundern:

> „We therefore deliberately set the safety classifiers to trigger on a set of requests that we know are likely benign. This ‚safety margin' approach means that a request has to look very clearly safe to avoid triggering the classifier. Users experience the safety margin as a model refusing to respond to some reasonable, non-harmful requests. For Fable 5, we made this safety margin much larger than in any prior launch, meaning that many more benign requests would be blocked."

Der Klassifikator soll also ausdrücklich auch bei Anfragen anspringen, die der Anbieter selbst für harmlos hält. Eine Anfrage muss „very clearly safe" aussehen, um durchzukommen. Wo diese Linie verläuft, entscheidet der Anbieter, und sie ist bewusst mit Abstand gezogen. Genau deshalb ist entscheidend, an welcher Stelle sie in der Sicherheitsarbeit einschneidet.

Dass das Ganze zu breit greift, schreibt Anthropic selbst. In der [Stellungnahme vom 12. Juni](https://www.anthropic.com/news/fable-mythos-access) steht der Satz: „our safeguards are so strong that many users have complained that they are overly broad." Nach einer Nachschärfung Ende Juni kommt die Einschränkung noch dichter an unseren Alltag heran: „The new classifier also comes at the cost of flagging benign requests more often during routine coding and debugging tasks."

> **💡 Zur Einordnung:** Anthropic nennt als Häufigkeit, dass die Klassifikatoren im Schnitt in weniger als fünf Prozent der Sitzungen auslösen. Das ist ein Durchschnitt über alle Sitzungen, vom Urlaubsplan bis zum Kernel-Patch. Für ein sicherheitsrelevantes Repository sagt diese Zahl nichts aus, denn dort ist die Domäne ja gerade der Auslöser.

### Das unbeschränkte Modell gibt es, nur nicht für dich

Zum selben Zeitpunkt hat Anthropic Claude Mythos 5 veröffentlicht. Es ist dasselbe Modell, „but with cyber safeguards lifted". Zugang bekommen zunächst Teilnehmer des Programms Project Glasswing, also ein ausgewählter Kreis von Verteidigern und Infrastruktur-Betreibern, ausgerollt in Abstimmung mit der US-Regierung.

Wie eng dieser Rahmen ist, hat sich wenige Tage nach dem Start gezeigt. Am 12. Juni erging eine US-Exportkontrollanweisung, die den Zugang für alle ausländischen Staatsangehörigen untersagte. Weil sich die Staatsangehörigkeit nicht in Echtzeit prüfen ließ, schaltete Anthropic beide Modelle für sämtliche Kunden ab. Erst am 1. Juli war Fable 5 wieder verfügbar.

Für einen Entwickler in Europa, der im Auftrag seines Kunden dessen eigene Software prüft, ist die Lage damit klar umrissen. Die volle Fähigkeit existiert. Sie ist an ein Freigabeprogramm gebunden, das auf einen anderen Kontinent zeigt. Und was übrig bleibt, ist ein Modell mit einem Sicherheitsabstand, der absichtlich zu groß ist.

## Wo ein gehostetes Modell aufhört

Ein Sprachmodell behauptet viel, und vieles davon klingt richtig. Beweisen muss man es trotzdem. Bei einem gewöhnlichen Fehler kennst du das Verfahren: Du schreibst den Test, der den Defekt zeigt, er wird rot, dann reparierst du, bis er grün ist. Der rote Test ist der Beweis, dass der Fehler echt war, und der grüne, dass er weg ist.

Bei einer Sicherheitslücke ist der Exploit dieser Test. Der Befund allein ist die Behauptung, der reproduzierbare Nachweis am eigenen System ist der Beweis, in seiner härtesten Form die vollständige Kompromittierung. Erst danach wendest du den Fix an, und danach darf derselbe Exploit nicht mehr durchgehen. Er bleibt als Regressionstest liegen, damit die Lücke nicht unbemerkt zurückkehrt. Und weil er nur einen Weg abdeckt, ist er notwendig, aber nie schon der ganze Beweis, dass die Lücke restlos zu ist.

Und genau diesen Schritt, das Rotschreiben des Tests, gibt ein gehostetes Modell nicht her.

Ein Sicherheits-Audit bekommst du von ihm heute problemlos. Es erklärt die Architektur, sucht Schwachstellen, ordnet sie nach Schweregrad und beschreibt den Angriffsvektor. Bis hierher reicht der Assistent aus der Cloud.

Beim Proof of Concept reicht er nicht mehr. Genau hier zieht der Schutzmechanismus die Grenze, und aus seiner Sicht mit gutem Grund. Ein funktionierender Exploit sieht gleich aus, egal ob ihn jemand zum Schließen der Lücke schreibt oder zum Ausnutzen. Das Modell kann die Absicht nicht prüfen. Hugging Face nennt genau das den Kern des Problems: „which cannot distinguish an incident responder from an attacker."

Das ist die Stelle, an der die Verteidigung ausgebremst wird, und zwar an ihrer wichtigsten. Das gehostete Modell hilft dir bis zur Behauptung und lässt dich beim Beweis stehen. Dass der Beweis das Entscheidende ist, zeigt der nächste Abschnitt: Alles, was in der Sicherheitsforschung bisher wirklich Lücken gefunden hat, belegt seine Funde über tatsächliche Ausführung. Wer diesen Nachweis nicht führen darf, liefert schwächere Arbeit als der Angreifer, der sich an keine Nutzungsbedingung hält.

Weil sich die Absicht nicht prüfen lässt, sperrt der Anbieter nicht die Person, sondern die Fähigkeit. Der Angreifer umgeht das, indem er lokal und unbeschränkt arbeitet. Der Verteidiger, der sich an die Regeln hält, bleibt an der Schranke stehen. Das ist die Asymmetrie aus dem Hugging-Face-Vorfall, diesmal nicht bei der Forensik, sondern beim Prüfen des eigenen Codes.

> **💡 Warum das kein stabiler Zustand ist:** Diese Schranke ist ein eigenes System vor dem Modell, kein Teil der Gewichte. Sie lässt sich nachjustieren, ohne dass sich die Modellversion ändert. Wo sie heute steht, kann sie morgen woanders stehen, und du liest das an keiner Versionsnummer ab. Für verlässliche Arbeit ist genau das der Grund, die Kontrolle auf die eigene Maschine zu holen.

Bevor wir zum lokalen Modell kommen, lohnt der nüchterne Blick auf die Frage, ob diese Werkzeuge überhaupt taugen.

## Was die Werkzeuge wirklich können

Die Antwort ist ja, und sie ist belegt.

Googles Projekt **Big Sleep** meldete im November 2024 den [ersten Fund](https://projectzero.google/2024/10/from-naptime-to-big-sleep.html) dieser Art, einen ausnutzbaren Stack Buffer Underflow in SQLite. Die Einordnung des Teams: „We believe this is the first public example of an AI agent finding a previously unknown exploitable memory-safety issue in widely used real-world software." Bemerkenswert ist der Zusatz, dass die Stelle 150 CPU-Stunden Fuzzing überstanden hatte, ohne aufzufallen. Zur Redlichkeit gehört die Selbsteinschätzung derselben Quelle: „these are highly experimental results", und ein zielgerichteter Fuzzer sei derzeit vermutlich mindestens genauso wirksam.

Bei der **DARPA AI Cyber Challenge** fanden die teilnehmenden Systeme 54 von 63 eingebauten Schwachstellen und patchten gut zwei Drittel davon. Das ist ein Wettbewerbsergebnis unter Laborbedingungen, aber es zeigt die Größenordnung.

**OSS-Fuzz-Gen** von Google berichtet 30 neue Fehler, gefunden durch automatisch erzeugte Fuzzing-Ziele, darunter eine CVE in OpenSSL. Der wichtige Satz aus dem Projekt: „These bugs could only have been discovered with newly generated targets. They were not reachable with existing OSS-Fuzz targets."

Was in all diesen Quellen fehlt, ist bemerkenswert: Keine von ihnen nennt Verweigerung als limitierenden Faktor. Sie laufen mit eigenen Werkzeugketten und direktem Zugriff. Der Engpass, den sie beschreiben, ist Kontext und Werkzeuganbindung. Die Verweigerung trifft die anderen, nämlich uns im Alltag mit einem gehosteten Assistenten.

Damit ist die Aufgabe klar: Wir brauchen dieselbe Fähigkeit ohne den Klassifikator dazwischen.

## Qwen 3.8 auf der eigenen Maschine

Qwen 3.8 ist die aktuelle Modellfamilie von Alibaba und für unseren Zweck der interessanteste Kandidat, weil eine Variante unter einer echten Open-Source-Lizenz steht.

### Welche Variante du nehmen willst

Das dichte Modell **Qwen3.8-27B** steht unter **Apache 2.0**. Das ist die Variante für den Berateralltag, weil diese Lizenz keine Umsatzschwellen und keine Nutzungsvorbehalte kennt. Es hat rund 27,8 Milliarden Parameter, ein natives Kontextfenster von 262.144 Token, und es ist ein Vision-Modell, kann also auch Screenshots lesen. Das Nachdenken ist standardmäßig aktiv und lässt sich über einen `reasoning_effort` steuern.

Daneben gibt es das große Mixture-of-Experts-Modell mit rund 2,4 Billionen Parametern. Es steht unter einer eigenen Lizenz mit einer Umsatzklausel; für die reine interne Nutzung ist sie unproblematisch, für ein Produkt darüber hinaus musst du sie lesen. Für die Arbeit am eigenen Code auf eigener Hardware ist die 27B-Variante ohnehin die praktikable Wahl.

### Welche Quantisierung auf welche Maschine passt

Im Original braucht das Modell rund 56 GB. Erst die Quantisierung macht es auf normaler Hardware brauchbar. Die verbreiteten Stufen im GGUF-Format:

| Stufe | Größe | Passt auf |
| --- | --- | --- |
| `Q4_K_M` | 16,5 GB | 24 GB VRAM, 32 GB Unified Memory |
| `Q5_K_M` | 19,8 GB | 24 GB VRAM knapp, 32 GB komfortabel |
| `Q6_K` | 22,0 GB | 32 GB aufwärts |
| `Q8_0` | 29,0 GB | 36 GB aufwärts |

Auf Apple Silicon läuft die MLX-Fassung; sie liegt in 4 Bit bei etwa 16 GB und in 8 Bit bei etwa 30 GB. Wenn du die Bildfähigkeit nutzen willst, brauchst du zusätzlich die separate Projektor-Datei von knapp einem Gigabyte.

Für den Einstieg bietet sich `Q4_K_M` auf einer Maschine mit 32 GB an. Das ist schnell genug für interaktives Arbeiten, und diese Stufe gilt bei Code-Aufgaben allgemein als guter Kompromiss zwischen Größe und Qualität. Ob sie für deinen Zweck reicht, zeigt erst der Vergleich am eigenen Code.

### Womit du es startest

Für den ersten Versuch reicht **LM Studio**, weil es Modell-Download, Server und Chat in einer Oberfläche zusammenfasst. Für den Dauerbetrieb nutze ich lieber einen Server, der eine OpenAI-kompatible Schnittstelle anbietet, denn dann kannst du deine bestehenden Werkzeuge einfach umbiegen. Auf Apple Silicon ist MLX die schnellere Variante, unter Linux mit Nvidia-Karte llama.cpp.

> **🛠️ Selbst ausprobieren:** Fang mit einer Frage an, die dein gehosteter Assistent gerade abgelehnt hat. Das ist der einzige Vergleich, der für dich zählt.

## „Unzensiert" ist die nächste Stufe, nicht die erste

Jetzt zum Begriff, um den sich alles dreht. Für Qwen 3.8 existieren zahlreiche sogenannte **abliterierte** Varianten. Die Technik dahinter ist gut untersucht. Das Paper [„Refusal in Language Models Is Mediated by a Single Direction"](https://arxiv.org/abs/2406.11717) zeigt, dass sich die Verweigerung in großen Modellen auf eine einzige Richtung im Aktivierungsraum zurückführen lässt. Wer jede Gewichtsmatrix, die in den Residual-Strom schreibt, gegen diese Richtung orthogonalisiert, entfernt die Verweigerung dauerhaft aus den Gewichten. Das Paper spricht von „minimal effect on other capabilities".

Und hier ist die Stelle, an der ich Vorsicht empfehle. Das Paper misst diese minimale Auswirkung nicht an Code- oder Security-Aufgaben. Für die Frage, ob ein abliteriertes Modell deinen Code genauso gut analysiert wie das Original, gibt es keine belastbare Messung. Wer eine solche Variante einsetzt, tauscht eine bekannte Einschränkung gegen eine unbekannte.

Deshalb ist der wichtigste Punkt dieses Artikels ein Detail aus dem Hugging-Face-Vorfall, das leicht übersehen wird: **Das Team hat kein abliteriertes Modell gebraucht.** Es hat ein ganz normales offenes Modell genommen und auf eigener Hardware betrieben. Das hat gereicht, weil der Klassifikator des Anbieters bei einem selbst betriebenen Modell schlicht nicht existiert.

Die Reihenfolge lautet also: erst selbst hosten, dann messen, ob es reicht. Abliteration ist die Stufe danach und braucht eine eigene Begründung.

Ein Gegenargument gehört an dieser Stelle dazu, und es kommt von der anderen Seite. Dario Amodei nennt in seiner [Position zu offenen Gewichten](https://www.anthropic.com/news/position-open-weights-models) solche Modelle ausdrücklich ein öffentliches Gut, benennt im selben Text aber das Risiko: Bei offenen Gewichten lassen sich Schutzmechanismen kaum anwenden, die Nutzung kaum überwachen, und einmal veröffentlichte Gewichte kann niemand zurückholen. Das ist exakt die Eigenschaft, die dem Verteidiger hilft. Sie hilft dem Angreifer genauso. Wer lokal arbeitet, übernimmt diese Verantwortung selbst.

## Der Rahmen: eigener Code, fremder Code, fremde Daten

Ein lokales Modell macht aus einem unzulässigen Test keinen zulässigen. Drei Punkte solltest du im Kopf haben.

**Der Auftrag entscheidet.** In Deutschland zielt § 202c StGB auf den Zweck eines Werkzeugs und nicht auf seine Eignung. Das Bundesverfassungsgericht hat das im Beschluss 2 BvR 2233/07 vom 18. Mai 2009 klargestellt. Wer im Auftrag des Betreibers dessen System prüft, handelt nicht „unbefugt". Der praktische Rat daraus ist unspektakulär und wirksam: Beauftragung schriftlich, Umfang benannt, Zeitraum benannt, Systeme benannt.

**Fremde Systeme bleiben außen vor.** Ein Test hört dort auf, wo die Infrastruktur einem Dritten gehört, der nicht zugestimmt hat. Das gilt auch für Dienste, die dein Kunde nur mietet.

**Der Datenschutz ist das stärkste Argument für lokal.** Kundencode ist in aller Regel Auftragsverarbeitung nach Art. 28 DSGVO und oft zusätzlich Geschäftsgeheimnis im Sinne des GeschGehG, was „angemessene Geheimhaltungsmaßnahmen" voraussetzt. Die Datenschutzkonferenz formuliert in ihrer Orientierungshilfe zu KI-Anwendungen unmissverständlich: „Technisch geschlossene Systeme sind daher aus datenschutzrechtlicher Sicht vorzugswürdig."

> **⚠️ Achtung:** Für Modelle der Mythos-Klasse hat Anthropic eine Aufbewahrung sämtlichen Datenverkehrs über 30 Tage zur Pflicht gemacht, auf eigenen und auf fremden Oberflächen. Das ist als Schutzmaßnahme gegen Jailbreaks nachvollziehbar. Für einen Berater, der fremden Quellcode analysiert, ist es ein Punkt, der in die Auftragsverarbeitung gehört.

Genau hier zahlt der lokale Betrieb doppelt ein. Er löst die Verweigerung, und er löst die Frage, wo der Code des Kunden landet. Hugging Face hat beides in einem Satz benannt, als das Team seinen Wechsel begründete: keine Angreiferdaten und keine Zugangsdaten haben die eigene Umgebung verlassen.

## Fazit

Der Satz von Coinkite trifft den Kern, und er lässt sich noch zuspitzen. Dieselben Fähigkeiten stehen beiden Seiten offen. Aber nur eine Seite bekommt einen Klassifikator vorgeschaltet, der bewusst zu früh anspringt, und nur eine Seite hält sich daran. Der Angreifer nimmt die Fassung ohne Schranken. Anthropic beschreibt diesen Sicherheitsabstand offen und begründet ihn gut. Die Rechnung dafür zahlt der Verteidiger.

Meine Konsequenz ist nicht, den gehosteten Assistenten abzuschaffen. Er ist für den Alltag stärker und bequemer. Meine Konsequenz ist, für den Fall gerüstet zu sein, in dem er abwinkt. Ein lokales Qwen 3.8 auf der eigenen Maschine ist in einer Stunde eingerichtet und kostet dich außer Speicherplatz nichts. Es ist die Versicherung dagegen, dass dein Werkzeug ausgerechnet in dem Moment aussetzt, in dem es ernst wird.

Und die Reihenfolge bleibt: erst lokal, dann messen, und über Abliteration reden wir, wenn das nicht reicht.

Bleibt die Frage, in welchem Rahmen so ein Modell arbeiten darf, sobald es Werkzeuge in die Hand bekommt. Darum geht es im [nächsten Artikel](https://agentic.schule/blog/2026-09-strix-pentest-agent), am Beispiel eines Pentest-Agenten und an drei Fragen, von denen die Sandbox nur eine beantwortet.

**Nimm dir den Schritt vor, an dem dein gehosteter Assistent zuletzt aufgehört hat.** Lass ihn lokal laufen. Genau dort siehst du den Unterschied in wenigen Minuten.

Wo ist dir ein Modell zuletzt bei legitimer Arbeit in die Quere gekommen? Schreib mir, ich sammle die Fälle.

---

<small>Vielen Dank an die Teams von Coinkite, Block und Hugging Face, die ihre Vorfälle so ausführlich und nachvollziehbar dokumentiert haben. Ohne diese Offenheit gäbe es diesen Artikel nicht.</small>

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
