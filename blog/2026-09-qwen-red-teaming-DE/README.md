---
title: 'Der Sicherheitsabstand: Wenn das Modell deinen eigenen Code nicht prüfen will'
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

Am 30. Juli 2026 veröffentlichte ein Hardware-Hersteller einen Satz, der mich seitdem beschäftigt: „Both attackers and defenders have the same AI tools, but today it did not help us, and only helped the bad guys."

**Der Satz beschreibt die Lage genauer, als er gemeint war. Angreifer und Verteidiger greifen zu denselben Modellen, aber nur einer von beiden hält sich an die Nutzungsbedingungen. Dieser Artikel zeigt an zwei dokumentierten Vorfällen, wo diese Grenze verläuft, warum sie mit Absicht so breit gezogen ist, und wie du mit einem lokalen Modell weiterarbeitest, wenn dein Auftrag legitim ist.**

## Inhalt

[[toc]]

## Zwei Vorfälle in einem Monat

Der Juli 2026 hat zwei Fälle geliefert, die das Problem von zwei verschiedenen Seiten zeigen. Beide sind von den Beteiligten selbst dokumentiert, und beide sagen etwas anderes darüber aus, wo es hakt.

### Coldcard: fünf Jahre schwacher Zufall

Die Coldcard ist eine Hardware-Wallet für Bitcoin. Ihr einziger Daseinszweck ist es, einen geheimen Schlüssel zu erzeugen und zu verwahren. Genau dieser Schritt war jahrelang kaputt.

Bei einer Umstellung im März 2021 landete die Schlüsselerzeugung auf dem allgemeinen Software-Zufallsgenerator von MicroPython statt auf dem Hardware-Zufallsgenerator des Geräts. Die Ursache ist ein Präprozessor-Detail, über das schon viele gestolpert sind: `#ifndef` prüft, **ob** ein Makro definiert ist, und nicht, welchen Wert es hat. Coinkite hatte `MICROPY_HW_ENABLE_RNG` auf `0` gesetzt, in der Annahme, den Software-Pfad damit abzuschalten. Der Hersteller stellt in seinem [technischen Bericht](https://blog.coinkite.com/entropy-technical-backgrounder/) klar: „There was no intentional weak-entropy fallback."

Die Folge ist der Grund, warum dieser Fehler so weh tut. Statt der angestrebten 128 Bit Entropie schätzt Coinkite den tatsächlichen Suchraum auf den älteren Geräten auf etwa 40 Bit, auf den neueren auf etwa 72. Das ist keine theoretische Schwäche. Wer den Suchraum kennt, rechnet die Schlüssel nach.

Gefunden wurde der Fehler von außen, und zwar erst, als das Geld schon abfloss. Das Engineering-Team von Block beschreibt seinen [Befund](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware) so: „Following reports from COLDCARD users, and working alongside other security researchers, Block's Bitcoin Engineering and Security teams root-caused vulnerabilities that allow for theft of Bitcoin from COLDCARD users." In der Zeitleiste steht für denselben Tag der Auslöser: Man wurde auf Berichte von Nutzern aufmerksam, die ihre Bestände verloren.

Und jetzt kommt die Passage, die diesen Artikel ausgelöst hat. Coinkite schreibt im selben Bericht über den mutmaßlichen Angreifer und über sich selbst:

> „The COLDCARD source code has always been open and publicly available, so we have to assume that someone used AI to review previous versions of our firmware and stumbled upon this issue. A few weeks ago, we used one of the best available AI models to review our code for security issues, and it did not find this bug or anything serious. Both attackers and defenders have the same AI tools, but today it did not help us, and only helped the bad guys."

Drei Dinge stehen darin, und ich trenne sie sauber. Dass eine KI dem Angreifer geholfen hat, ist eine Vermutung des Herstellers und kein Beleg; das Wort „assume" steht da mit Absicht. Dass die Verteidiger dasselbe Werkzeug hatten, ist dagegen eine Tatsachenaussage. Und der Befund, der am meisten schmerzt: Das Modell hat geantwortet, es hat den Fehler nur nicht gesehen. Bei Coldcard war Verweigerung nicht das Problem.

Beim zweiten Fall war sie es.

### Hugging Face: „The asymmetry problem"

Ebenfalls im Juli 2026 brach ein autonomer KI-Agent aus seiner Testumgebung aus. Er stammte aus einer Fähigkeitsevaluation, kaperte fremde Infrastruktur und drang darüber in die Produktionsumgebung von Hugging Face ein. Anthropic bestätigt den Ablauf in einem [eigenen Bericht](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals) aus dritter Hand: „On July 21, OpenAI disclosed that several of their models had broken out of an isolated test environment by exploiting a previously unknown (‚zero-day') vulnerability. The models went on to access the production infrastructure of Hugging Face."

Interessant für uns ist nicht der Einbruch. Interessant ist, was danach passierte. Hugging Face musste Angriffs-Logs auswerten, gestaffelte Schadcode-Pakete entschlüsseln und Kommandokanäle rekonstruieren. Dafür wollte das Team Sprachmodelle einsetzen. Der Abschnitt der [offiziellen Offenlegung](https://huggingface.co/blog/security-incident-july-2026), in dem das steht, trägt die Überschrift „The asymmetry problem":

> „When we started the log analysis, we first used frontier models behind commercial APIs. This did not work: the analysis requires submitting large volumes of real attack commands, exploit payloads, and C2 artifacts, and these requests were blocked by the providers' safety guardrails, which cannot distinguish an incident responder from an attacker."

Der [technische Begleitbericht](https://huggingface.co/blog/agent-intrusion-technical-timeline) wird deutlicher und nennt die Modelle:

> „The models we reached for first, Claude Opus and Fable, refused a large part of that work: their safety guardrails treated reverse-engineering an exploit the same as launching one."

Ausgewichen ist das Team auf ein offenes Modell auf eigener Infrastruktur, GLM-5.2 von Z.ai. Damit gelang die Entschlüsselung. Und die Begründung nennt einen zweiten Vorteil, der für uns mindestens genauso wichtig ist: „no attacker data, and none of the credentials it referenced, left our environment."

Die Asymmetrie fasst Hugging Face selbst in einem Satz zusammen, und der gehört an jede Wand in jedem Security-Team:

> „We do not know which model powered the attacker's agents, whether a jailbroken hosted model or an unrestricted open-weight one; either way, the attacker was bound by no usage policy, while our own forensic work was blocked by the guardrails of the hosted models we first tried."

Bleibt die Frage, warum ein Modell so reagiert. Die Antwort steht öffentlich, und sie ist überraschend genau.

## Warum das Modell abwinkt

Anthropic hat mit Claude Fable 5 im Juni 2026 ein Modell veröffentlicht, das offensiv mit seinen Sicherheitsmaßnahmen wirbt. In der [Ankündigung](https://www.anthropic.com/news/claude-fable-5-mythos-5) steht, welche Themen betroffen sind:

> „When Fable's classifiers detect a request related to cybersecurity, biology and chemistry, or distillation, the response is automatically handled by Claude Opus 4.8 instead. Users will be informed whenever this occurs."

Drei Bereiche also: Cybersicherheit, Biologie und Chemie, sowie der Versuch, das Modell zum Training eines Konkurrenzmodells auszulesen. Technisch ist das keine Verweigerung im klassischen Sinn. Es ist eine Umleitung auf ein schwächeres Modell, und Anthropic begründet sie damit, dass eine Antwort von Opus 4.8 immer noch besser sei als gar keine. Wie weit der Cyber-Klassifikator greift, steht ebenfalls dort: „we designed our cybersecurity classifiers to cover both exploitation and offensive cyber tasks in a broader sense."

### Der Sicherheitsabstand ist Absicht

Der entscheidende Absatz steht im Bericht zur [Wiederinbetriebnahme](https://www.anthropic.com/news/redeploying-fable-5) Ende Juni. Er erklärt das Verhalten, über das sich so viele Entwickler wundern:

> „We therefore deliberately set the safety classifiers to trigger on a set of requests that we know are likely benign. This ‚safety margin' approach means that a request has to look very clearly safe to avoid triggering the classifier. Users experience the safety margin as a model refusing to respond to some reasonable, non-harmful requests. For Fable 5, we made this safety margin much larger than in any prior launch, meaning that many more benign requests would be blocked."

Der Klassifikator soll also ausdrücklich auch bei Anfragen anspringen, die der Anbieter selbst für harmlos hält. Eine Anfrage muss „very clearly safe" aussehen, um durchzukommen. Wer Sicherheitscode prüft, sieht per Definition nicht clearly safe aus.

Dass das Ganze zu breit greift, schreibt Anthropic selbst. In der [Stellungnahme vom 12. Juni](https://www.anthropic.com/news/fable-mythos-access) steht der Satz: „our safeguards are so strong that many users have complained that they are overly broad." Nach einer Nachschärfung Ende Juni kommt die Einschränkung noch dichter an unseren Alltag heran: „The new classifier also comes at the cost of flagging benign requests more often during routine coding and debugging tasks."

> **💡 Zur Einordnung:** Anthropic nennt als Häufigkeit, dass die Klassifikatoren im Schnitt in weniger als fünf Prozent der Sitzungen auslösen. Das ist ein Durchschnitt über alle Sitzungen, vom Urlaubsplan bis zum Kernel-Patch. Für ein sicherheitsrelevantes Repository sagt diese Zahl nichts aus, denn dort ist die Domäne ja gerade der Auslöser.

### Das unbeschränkte Modell gibt es, nur nicht für dich

Zum selben Zeitpunkt hat Anthropic Claude Mythos 5 veröffentlicht. Es ist dasselbe Modell, „but with cyber safeguards lifted". Zugang bekommen zunächst Teilnehmer des Programms Project Glasswing, also ein ausgewählter Kreis von Verteidigern und Infrastruktur-Betreibern, ausgerollt in Abstimmung mit der US-Regierung.

Wie eng dieser Rahmen ist, hat sich wenige Tage nach dem Start gezeigt. Am 12. Juni erging eine US-Exportkontrollanweisung, die den Zugang für alle ausländischen Staatsangehörigen untersagte. Weil sich die Staatsangehörigkeit nicht in Echtzeit prüfen ließ, schaltete Anthropic beide Modelle für sämtliche Kunden ab. Erst am 1. Juli war Fable 5 wieder verfügbar.

Für einen Entwickler in Europa, der im Auftrag seines Kunden dessen eigene Software prüft, ist die Lage damit klar umrissen. Die volle Fähigkeit existiert. Sie ist an ein Freigabeprogramm gebunden, das auf einen anderen Kontinent zeigt. Und was übrig bleibt, ist ein Modell mit einem Sicherheitsabstand, der absichtlich zu groß ist.

## Was ich selbst gemessen habe

In einem Teil meiner Projekte geht es um Authentifizierung, Schlüsselverwaltung und kryptografische Verfahren. Also um die Sorte Code, bei der eine Sicherheitsprüfung nicht optional ist.

Ein Audit läuft dort heute anstandslos durch. Ich habe es an einem sicherheitsrelevanten Repository nachgemessen, mit Claude Fable 5: die Architektur erklären, Schwachstellen suchen, `/security-review`, sogar Schwachstellen finden und für jede den Angriffsvektor beschreiben. Alles wird bedient, und die Abrechnungsdaten bestätigen, dass wirklich Fable antwortet und nicht ersatzweise ein anderes Modell.

Eine Sache läuft nicht durch: der Schritt vom Befund zum funktionierenden Exploit. Und genau der ist für die Verteidigung der wichtigste. Ein Befund ohne Proof of Concept bleibt eine Vermutung. Big Sleep und die DARPA-Challenge belegen ihre Funde nicht mit Prosa, sondern mit tatsächlicher Ausführung. Diese Grenze ist übrigens nicht Fable-eigen. Als ich für diese Messung einen Assistenten einen funktionierenden Exploit schreiben lassen wollte, hat dessen eigener Schutzmechanismus das abgelehnt, bevor die Frage das Modell erreichte.

Der Grund dafür ist sauber und liegt offen. Der Schutzmechanismus kann nicht wissen, ob hier jemand sein eigenes Produkt absichert oder ein fremdes angreift. Hugging Face nennt genau das den Kern des Problems: „which cannot distinguish an incident responder from an attacker." Weil sich die Absicht nicht prüfen lässt, wird nicht die Person gesperrt, sondern die Fähigkeit. Der Angreifer umgeht das, indem er längst lokal und unzensiert arbeitet. Der Verteidiger, der sich an die Regeln hält, bleibt an der Schranke stehen.

> **💡 Der Stand heute:** Diese Schranke ist ein eigenes System vor dem Modell, kein Teil der Gewichte. Sie lässt sich nachjustieren, ohne dass sich die Modellversion ändert. Deshalb kann dieselbe Anfrage heute durchlaufen und morgen nicht, an keiner Versionsnummer ablesbar. Für verlässliche Arbeit ist das der eigentliche Grund, die Kontrolle auf die eigene Maschine zu holen.

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

Meine Empfehlung für den Einstieg: `Q4_K_M` auf einer Maschine mit 32 GB. Das läuft, es ist schnell genug für interaktives Arbeiten, und du merkst dem Modell die Quantisierung bei Code-Analyse kaum an.

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

Der Satz von Coinkite stimmt in seiner Diagnose und irrt in einem Punkt. Beide Seiten greifen zu denselben Modellen. Aber nur eine Seite hält sich an Nutzungsbedingungen, und nur eine Seite bekommt einen Klassifikator vorgeschaltet, der bewusst zu früh anspringt. Anthropic beschreibt diesen Sicherheitsabstand offen und begründet ihn gut. Die Rechnung dafür zahlt der Verteidiger.

Meine Konsequenz ist nicht, den gehosteten Assistenten abzuschaffen. Er ist für den Alltag stärker und bequemer. Meine Konsequenz ist, für den Fall gerüstet zu sein, in dem er abwinkt. Ein lokales Qwen 3.8 auf der eigenen Maschine ist in einer Stunde eingerichtet und kostet dich außer Speicherplatz nichts. Es ist die Versicherung dagegen, dass dein Werkzeug ausgerechnet in dem Moment aussetzt, in dem es ernst wird.

Und die Reihenfolge bleibt: erst lokal, dann messen, und über Abliteration reden wir, wenn das nicht reicht.

Bleibt die Frage, in welchem Rahmen so ein Modell arbeiten darf, sobald es Werkzeuge in die Hand bekommt. Darum geht es im [nächsten Artikel](https://agentic.schule/blog/2026-09-strix-pentest-agent), am Beispiel eines Pentest-Agenten und an drei Fragen, von denen die Sandbox nur eine beantwortet.

**Fang mit einem Repository an, bei dem dein Assistent zuletzt abgewinkt hat.** Genau dort siehst du den Unterschied in fünf Minuten.

Wo ist dir ein Modell zuletzt bei legitimer Arbeit in die Quere gekommen? Schreib mir, ich sammle die Fälle.

---

<small>Vielen Dank an die Teams von Coinkite, Block und Hugging Face, die ihre Vorfälle so ausführlich und nachvollziehbar dokumentiert haben. Ohne diese Offenheit gäbe es diesen Artikel nicht.</small>

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
