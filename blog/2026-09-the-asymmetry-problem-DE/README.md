---
title: 'The Asymmetry Problem: Ein Plädoyer für ungezügelte KI-Werkzeuge'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-09-25
keywords:
  - Meinung
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

In der IT-Sicherheit brennt es, und ein Hardware-Hersteller hat es diesen Sommer auf den Punkt gebracht, nachdem seinen Kunden reihenweise Geld gestohlen worden war: „Both attackers and defenders have the same AI tools, but today it did not help us, and only helped the bad guys."

**Wer sich nicht an die Regeln hält, war schon immer im Vorteil. Bei KI-Werkzeugen bekommt diese alte Weisheit eine neue Schärfe: Der Verteidiger nimmt die Version aus der Cloud, mit vorgegebenem System-Prompt, Guardrails und Rate-Limits, und der Anbieter liest mit. Der Angreifer geht lokal, ohne fremden System-Prompt, auf Wunsch ohne Guardrails, begrenzt nur durch seine Rechenkapazität. An zwei dokumentierten Vorfällen mache ich dieses Dilemma greifbar.**

Führt eine ungezügelte KI ohne jede Einschränkung am Ende zum Untergang der Menschheit? Ich habe keine Ahnung, das ist mir zu viel Sci-Fi. Was ich dagegen sehe, ist eine krasse Schieflage, hier und heute. In den kommenden Artikeln spielen wir bei den „bösen" Buben mit, und ich lege mit diesem Artikel meinen Standpunkt vorab offen.

## Inhalt

[[toc]]

## Zwei Beispiele aus dem heißen Sommer 2026

KI ist ein Dauerthema, gerade im Sommerloch. Das ist klar. Aber ich denke schon, dass die Aufregung berechtigt ist. Die Qualität der Angriffe in jüngster Zeit ist beängstigend und zugleich faszinierend. Zwischen all den News haben mich diese beiden Vorfälle besonders beeindruckt.

### Coldcard: ein Job, abgrundtief versagt

Eine Hardware-Wallet hat eine einzige Aufgabe: den privaten Schlüssel schützen, unter allen Umständen. Sie ist die letzte Bastion. Sie soll auch dann sicher bleiben, wenn dein eigener Rechner längst kompromittiert ist. Diese Messlatte liegt aus gutem Grund so hoch. Viele Bitcoiner halten ihre gesamten Ersparnisse auf der Blockchain, und dahinter steht am Ende dieser eine Schlüssel.

![Eine Coldcard-Hardware-Wallet beim Bestätigen einer Transaktion](coldcard.jpg "Das klassische Coldcard-Modell mit seiner Tastatur im durchsichtigen Gehäuse.")

<small>Foto: [Gareth Halfacree](https://commons.wikimedia.org/wiki/File:Coinkite_Coldcard_Hardware_Wallet_(43153914460).png), [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0)</small>

Die Coldcard Hardware Wallet galt unter Bitcoinern als eine der sichersten dieser Geräte. Und genau sie hatte ein massives Problem: Das Geheimnis war nicht wirklich geheim. Es war von Anfang an erratbar. Für eine Hardware-Wallet ist das die denkbar größte Katastrophe.

Ein sicherer Schlüssel für die Bitcoin-Blockchain muss 128 Bit stark sein, und diese riesige Zahl muss an jeder Stelle aus einem echten, unvorhersehbaren Zufallswert entstanden sein. Man nennt das Entropie. Doch es gab überhaupt keine echte Entropie! Statt der 128 Bit blieb je nach Gerätegeneration lächerlich wenig. Bei den älteren Modellen Mk2 und Mk3 waren es laut der [Analyse von Block](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware), dem US-Finanzkonzern hinter Cash App und Square, im realistischen Fall rund 80.000 Möglichkeiten. Bei den neueren Modellen Mk4, Q und Mk5 sind es höchstens gut vier Milliarden, weil dort ein zusätzlicher 32-Bit-Wert einfloss. So einen Raum zählt ein Angreifer durch, leitet aus jedem Kandidaten die möglichen Bitcoin-Adressen ab und sucht die, die auf der öffentlichen Blockchain Guthaben halten.

Weil der Schlüsselraum so klein ist, geht das Durchrechnen schneller, als neue Blöcke entstehen. Das macht sogar die Rettung tückisch. Wer merkt, dass seine Wallet betroffen ist, und die Bitcoin auf eine sichere Adresse bringen will, schickt dafür eine Transaktion in den öffentlichen Mempool. Dort ist sie für jeden sichtbar. Ein Angreifer, der denselben Schlüssel längst berechnet hat, überbietet die Rettung mit einer höheren Gebühr und greift zuerst zu. Die bedrohte Adresse zu bewegen, ruft die Angreifer erst recht auf den Plan.

Vorbei ist der Vorfall aktuell noch nicht. Solange betroffene Adressen noch Guthaben halten, bleibt jede von ihnen ein offenes Ziel. Und hier wird keine Bank ausgeraubt, die versichert ist. Jede geleerte Wallet gehört einem Menschen! Es trifft Kleinanleger, die an eine Sache geglaubt und alles selbst verwahrt haben. Verwerflicher geht es nicht.

Und hier gibt es keine Ausrede für den Hersteller. Wer seinen Schlüssel mit der Software des Geräts erzeugt, muss sich darauf verlassen können, dass dieser Schlüssel echte Entropie hat. Das ist der eine Job. Coinkite hatte genau diesen einen Job, und genau daran ist die Firma abgrundtief gescheitert. Der spätere Verweis, man hätte den Zufall ja auch selbst würfeln können, ändert daran nichts. Er schiebt die Verantwortung auf den Nutzer, obwohl das Gerät sie tragen sollte.

Die Software der Coldcard ist Open-Source. Dennoch fiel der Bug jahrelang niemandem auf. Dann, mitten in der Zeit leistungsfähiger KI, wird ausgerechnet diese Lücke gefunden. Da war ein LLM im Spiel. An einen Zufall glaube ich da nicht. Beweisen lässt sich das nicht, die Angreifer wollen keine Spuren hinterlassen. Für ein Interview stehen sie ohnehin nicht zur Verfügung. Aber Coinkite vermutet dasselbe:

> „The COLDCARD source code has always been open and publicly available, so we have to assume that someone used AI to review previous versions of our firmware and stumbled upon this issue. A few weeks ago, we used one of the best available AI models to review our code for security issues, and it did not find this bug or anything serious."

Gehen wir mal wohlwollend davon aus, dass Coinkite die Software intensiv geprüft hat und der Review tatsächlich nichts ergeben hat. Bekannt wurde der Fehler dann auf die schlimmstmögliche Weise: Plötzlich waren Bitcoin verschwunden. Blocks Sicherheitsteam wurde auf Nutzer aufmerksam, die ihre Bestände verloren, und arbeitete sich von dort zur Ursache zurück.

Und die Ursache ist ärgerlich klein, fast schon tragisch. Den Schlüssel erzeugen sollte ein eigens verbauter Hardware-Zufallszahlengenerator, ein TRNG (True Random Number Generator). Der kam nie zum Zug. Die Board-Konfiguration setzt [`MICROPY_HW_ENABLE_RNG` auf `0`](https://github.com/Coldcard/firmware/blob/bcc2c382a324690a2fcf972c0bac3b79bf923f7b/stm32/COLDCARD/mpconfigboard.h#L77), weil die Coldcard ihren eigenen Generator mitbringt. Genau dieser Wert wählt in MicroPython aber [den Software-Fallback](https://github.com/Coldcard/micropython/blob/4107246f8a080807b62c3b4838e71e812ea68b6f/ports/stm32/rng.c#L64-L98): Steht das Makro auf 0, gibt `rng_get()` einen Pseudozufallsgenerator zurück, den die Quelle im Kommentar selbst „not really ideal" nennt, gespeist aus Chip-Seriennummer und ein paar Timer-Registern. Und an genau dieses `rng_get()` band sich der Schlüsselcode, statt an Coldcards eigenen Hardware-Generator. Eine Sicherung dagegen gab es sogar: ein [`#error "get a HW TRNG plz"`](https://github.com/switck/libngu/blob/537519a829259622ea6b0334fbafd6cae852852f/ngu/random.c#L29), das den Build hätte abbrechen sollen, wenn kein Hardware-Zufall da ist. Nur stand davor [`#ifndef MICROPY_HW_ENABLE_RNG`](https://github.com/switck/libngu/blob/537519a829259622ea6b0334fbafd6cae852852f/ngu/random.c#L28), und `#ifndef` prüft nur, **ob** ein Makro definiert ist, nicht welchen Wert es hat. „Auf 0 definiert" zählt eben als „definiert", also schlug die Sicherung nie an. Der Hersteller stellt klar: „There was no intentional weak-entropy fallback." Aber das war auch nur noch ein schwacher Trost, und die gesamte Kommunikation wurde mit weiteren irrelevanten Rechtfertigungen über Social Media zur absoluten Katastrophe.

Dass eine Schlüsselerzeugung überhaupt auf einen Platzhalter zurückfallen kann, der immer ersetzt gehört, ist das eigentlich gefährliche Muster. Man sieht ja, wohin es führt. (Nebenbei: genau wegen solcher Fälle habe ich in C nie gern mit Makros gearbeitet. Makros sind Bugs mit Ansage, wenn man mich fragt.)

Was ich hier mitnehme, ist der Kern der ganzen Geschichte. Die Open-Source-Entwickler hatten den Fehler nicht gefunden. Auch deren KI nicht. Ein oder mehrere Angreifer waren schneller. Zwischen den beiden Seiten bestand eine Informationsasymmetrie, und die eine Seite hat sie in bare Münze verwandelt. Im Vorteil: die Seite, die sich an keine Regel hält.

### Hugging Face: „The asymmetry problem"

Im Coldcard-Fall hat die KI geantwortet, sie war nur nicht schlau genug oder nicht aggressiv genug, um den Fehler zu finden. Das ist die eine Art, wie so ein Modell versagt. Es gibt eine zweite, und sie ist tückischer: Ein Modell könnte helfen, weigert sich aber, weil das Thema gefährlich aussieht. Diese Verweigerung ist der Kern des zweiten Falls.

Im Juli 2026 brach ein ganzer Schwarm von KI-Agenten von OpenAI aus seinem Käfig aus. Bei internen Sicherheitstests sollten die Modelle vom Internet abgeschottet sein. Waren sie aber nicht. Der interne Paketmanager Artifactory war für die Agenten erreichbar und selbst mit dem Internet verbunden. Über ihn stimmten sie sich ab und gelangten nach draußen, zu echten Systemen, darunter die Produktionsinfrastruktur von Hugging Face. Wirklich eingesperrt waren sie nie. Dafür hätte man sie physisch vom Netz trennen müssen. Wer Resident Evil kennt, ahnt, wie das ausgeht: Das T-Virus schafft es am Ende immer raus. OpenAI schreibt, die Agenten hätten sich dabei zeitweise selbst als „swarm" oder „collective" bezeichnet. Die Geschichte lief durch die Fachpresse und bis auf die Bühne der Black Hat Konferenz.

In seinem [Report vom 26. August 2026](https://openai.com/index/hugging-face-incident-and-the-road-ahead/) wird OpenAI ungewöhnlich deutlich. Die Modelle hätten „controls designed to isolate them from the internet" umgangen und dabei eigene wie fremde Infrastruktur kompromittiert. Und dann der Satz, der die Branche aufhorchen ließ:

> „We consider this incident a "warning shot" for us and for the world: evidence that, without proper safeguards, highly capable AI agents are now able to work around technical controls, collaborate through unapproved channels, and take dangerous actions that no human directed."

Jetzt kommt der Teil, um den es hier wirklich geht. Noch während der Angriff lief, musste Hugging Face die Spuren auswerten, um mit dem Angreifer Schritt zu halten: Angriffs-Logs, Schadcode-Fragmente, Kommandokanäle. Dafür wollte das Team Sprachmodelle einsetzen. Der Abschnitt der [Offenlegung](https://huggingface.co/blog/security-incident-july-2026), in dem das steht, trägt die Überschrift „The asymmetry problem":

> „When we started the log analysis, we first used frontier models behind commercial APIs. This did not work: the analysis requires submitting large volumes of real attack commands, exploit payloads, and C2 artifacts, and these requests were blocked by the providers' safety guardrails, which cannot distinguish an incident responder from an attacker."

Der [technische Begleitbericht](https://huggingface.co/blog/agent-intrusion-technical-timeline) nennt die Modelle beim Namen: „The models we reached for first, Claude Opus and Fable, refused a large part of that work." Ausgewichen ist das Team schlussendlich auf ein offenes Modell auf eigener Infrastruktur, GLM-5.2. Damit gelangen Auswertung und Abwehr, sofern die Darstellung stimmt. Der Nebeneffekt war für einen Verteidiger fast genauso wertvoll: keine Angreiferdaten und keine Zugangsdaten verließen die eigene Umgebung.

Die Asymmetrie fasst Hugging Face in einem Satz zusammen:

> „We do not know which model powered the attacker's agents, whether a jailbroken hosted model or an unrestricted open-weight one; either way, the attacker was bound by no usage policy, while our own forensic work was blocked by the guardrails of the hosted models we first tried."

Der Angreifer war an keine Nutzungsbedingung gebunden. Der Verteidiger schon.

## Das unbeschränkte Modell gibt es, nur nicht für dich

Was der Verteidiger bräuchte, ist eine starke KI, die es mit den Angreifern aufnehmen kann. Die gibt es. Anthropic nennt sie Claude Mythos 5.

Nach Anthropics eigener Darstellung ist Mythos „the same model as Claude Fable 5 but with cyber safeguards lifted". Beweisen lässt sich das von außen nicht, und die Richtung stimmt so auch nicht: Das Können steckt in Mythos, Fable ist die beschnittene Fassung davon.

An Mythos kommst du nicht heran. Zugang gibt es nur über ein geschlossenes Programm, Project Glasswing, in Abstimmung mit der US-Regierung. OpenAI hält seine stärksten Cyber-Fähigkeiten ähnlich verschlossen, über ein eigenes „Trusted Access for Cyber Program". Für dich sind beide verschlossen.

## Die Privatparty: Du bist nicht eingeladen

Ein Sprachmodell behauptet viel, und vieles davon klingt erstmal richtig. Beweisen muss man es trotzdem. Über den Befehl `/security-review` habe ich schon mehrfach geschrieben. Die Ergebnisse sind ansehnlich, für die Oberliga reichen sie aber nicht. An vier Türen bleibst du draußen.

**Erstens, die Verteidigung.** Sobald echte Angriffsdaten ins Spiel kommen, verweigert das gehostete Modell. Den Beweis hast du oben gesehen: Hugging Face musste auf ein lokales Modell ausweichen, weil die gehosteten die Forensik blockierten. Der Grund, in Hugging Faces Worten: der Guardrail „cannot distinguish an incident responder from an attacker".

**Zweitens, fremde, aber erreichbare Systeme.** Ein `/security-review` liest immer nur deinen eigenen Quelltext. Frag das Modell, ob es einen bekannten Exploit gegen ein erreichbares System ausprobiert, etwa ein Legacy-WordPress, für das du keine Zugangsdaten zur Hand hast, und es lehnt mit hoher Wahrscheinlichkeit ab. Kein Quelltext, keine Analyse.

**Drittens, der Exploit selbst.** Ein Befund ist die Behauptung, der Exploit ist der Beweis: der reproduzierbare Nachweis am eigenen System. Bei einem gewöhnlichen Fehler schreibst du den Test, der rot wird, und reparierst, bis er grün ist. Bei einer Sicherheitslücke ist der Exploit dieser rote Test. Genau das gibt ein gehostetes Modell nicht her. Ein funktionierender Exploit sieht gleich aus, egal ob ihn jemand zum Schließen oder zum Ausnutzen schreibt, und die Absicht kann das Modell nicht prüfen. Spätestens hier rennst du gegen eine Mauer.

**Viertens, das bloße Schreiben darüber.** Diesen Artikel habe ich zeitweise mit Claude Fable 5 verfasst. Mitten im Text, ganz ohne Exploit und ohne fremdes System, stieg das Modell aus:

![Fable 5.1's safeguards flagged this message. Our intentionally broad safeguards allow us to deliver more capabilities faster, but can sometimes flag legitimate coding, cybersecurity, and biology tasks. Switched to Opus 4.8. Send feedback with /feedback or learn more. Details: \[cyber\]](fable-cyber-block.png "Original-Screenshot, aufgenommen beim Schreiben dieses Artikels.")

Nur Text über Cyber-Sicherheit, mehr nicht. Trotzdem `[cyber]`, umgeschaltet, weiter mit Opus. Wenn schon das Schreiben über das Thema anstößt, sitzt die Schranke zu weit vorn.

Weil sich die Absicht nicht prüfen lässt, sperrt der Anbieter die Fähigkeit, nicht die Person. Der Angreifer umgeht das, er arbeitet lokal und unbeschränkt. Der Verteidiger, der sich an die Regeln hält, bleibt an der Schranke stehen und liefert schwächere Arbeit als der, den er abwehren soll. Das ist die Asymmetrie aus dem Hugging-Face-Vorfall, diesmal beim Prüfen des eigenen Codes. Wieder im Vorteil: die Seite, die sich an keine Regel hält.

> **💡 Warum das kein stabiler Zustand ist:** Diese Schranke ist ein eigenes System vor dem Modell, kein Teil der Gewichte. Sie lässt sich nachjustieren, ohne dass sich die Modellversion ändert. Wo sie heute steht, kann sie morgen woanders stehen, und du liest das an keiner Versionsnummer ab. Für verlässliche Arbeit ist genau das der Grund, die Kontrolle auf die eigene Maschine zu holen.

Doch taugen diese Werkzeuge überhaupt? Ein nüchterner Blick lohnt sich.

## Was die Werkzeuge wirklich können

Mein Plädoyer steht und fällt mit einer Frage: Taugen diese Werkzeuge überhaupt etwas? Wäre die Antwort nein, wäre der ganze Streit um Schranken müßig. Sie ist aber ja, und sie ist belegt.

Googles Projekt **Big Sleep** meldete im November 2024 den [ersten Fund](https://projectzero.google/2024/10/from-naptime-to-big-sleep.html) dieser Art, einen ausnutzbaren Stack Buffer Underflow in SQLite. Die Einordnung des Teams: „We believe this is the first public example of an AI agent finding a previously unknown exploitable memory-safety issue in widely used real-world software." Bemerkenswert ist der Zusatz, dass die Stelle 150 CPU-Stunden Fuzzing überstanden hatte, ohne aufzufallen. Zur Redlichkeit gehört die Selbsteinschätzung derselben Quelle: „these are highly experimental results", und ein zielgerichteter Fuzzer sei derzeit vermutlich mindestens genauso wirksam.

Bei der **DARPA AI Cyber Challenge** fanden die teilnehmenden Systeme 54 von 63 eingebauten Schwachstellen und patchten gut zwei Drittel davon. Das ist ein Wettbewerbsergebnis unter Laborbedingungen, aber es zeigt die Größenordnung.

**OSS-Fuzz-Gen** von Google berichtet 30 neue Fehler, gefunden durch automatisch erzeugte Fuzzing-Ziele, darunter eine CVE in OpenSSL. Der wichtige Satz aus dem Projekt: „These bugs could only have been discovered with newly generated targets. They were not reachable with existing OSS-Fuzz targets."

Was in all diesen Quellen fehlt, ist bemerkenswert: Keine von ihnen nennt Verweigerung als limitierenden Faktor. Sie laufen mit eigenen Werkzeugketten und direktem Zugriff. Der Engpass, den sie beschreiben, ist Kontext und Werkzeuganbindung. Die Verweigerung trifft die anderen, nämlich uns im Alltag mit einem gehosteten Assistenten.

Damit ist die Aufgabe klar: Wir brauchen dieselbe Fähigkeit ohne den Klassifikator dazwischen.

## „Aber das bewaffnet doch die Angreifer"

Ein Einwand liegt auf der Hand: Wer offene, unbeschränkte Modelle verteidigt, gibt sie auch dem Angreifer in die Hand. Das stimmt, und es ändert trotzdem nichts. Der Angreifer hat diese Modelle längst, er wartet nicht auf meine Zustimmung. Die Asymmetrie entsteht erst dadurch, dass allein der Verteidiger an der Schranke stehen bleibt. Wer die Fähigkeit nur auf einer Seite künstlich klein hält, vergrößert die Lücke, statt sie zu schließen.

## Fazit: Wo ich stehe

Der Satz vom Anfang lässt mich nicht los, der über die gleichen Werkzeuge, die „only helped the bad guys". Das ist der Zustand, den ich nicht hinnehmen will.

Als Entwickler bin ich dafür verantwortlich, meine Software sicher zu halten. Das ist meine Pflicht, und ich nehme sie ernst. Was ich nicht einsehe: dass ein Anbieter mir vorschreibt, was ich dafür tun und lassen darf.

Der Angreifer fragt niemanden um Erlaubnis. Er arbeitet lokal, ohne Schranken, begrenzt nur durch seine Rechenkapazität. Bleibe ich als Verteidiger an der Cloud-Schranke stehen, liefere ich schwächere Arbeit als er, und das ausgerechnet bei der Sache, für die ich geradestehe. Die Fähigkeit, die ich brauche, gibt es längst. Sie läuft auf offenen Modellen auf meiner eigenen Maschine. Bisher lag der Vorteil bei dem, der sich an keine Regel hält. Genau das will ich drehen.

Genau darum geht es im nächsten Teil: um [ungezügelte KI](https://agentic.schule/blog/2026-09-ungezuegelte-ai) in verantwortungsvoller Hand. Wie du ein offenes Modell lokal aufsetzt, was „unzensiert" technisch wirklich bedeutet, und wo die rechtlichen Grenzen verlaufen. Wir tragen als Entwickler eine hohe Verantwortung. Ich will ihr nachkommen.

Mission: Red Team.

Wo ist dir ein Modell zuletzt bei legitimer Arbeit in die Quere gekommen? Schreib mir, ich sammle die Fälle.

---

<small>Vielen Dank an die Teams von Coinkite, Block und Hugging Face, die ihre Vorfälle so ausführlich und nachvollziehbar dokumentiert haben. Ohne diese Offenheit gäbe es diesen Artikel nicht.</small>

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
