---
title: 'Ungezügelte KI: Ein offenes Modell auf der eigenen Maschine'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-09-26
keywords:
  - Lokale Modelle
  - Qwen
  - Open Weights
  - Abliteration
  - Red Teaming
  - Datenschutz
  - Agentic Coding
language: de
header: header.jpg
---

Im [vorigen Artikel](https://agentic.schule/blog/2026-09-qwen-red-teaming) stand das Dilemma: Der Angreifer arbeitet mit einem lokalen, unbeschränkten Modell, der Verteidiger bleibt an der Cloud-Schranke stehen. Die Konsequenz war klar. Jetzt bauen wir sie.

**Dieser Artikel zeigt, wie du ein offenes Modell lokal aufsetzt, was „unzensiert" technisch wirklich bedeutet, und wo die rechtlichen Grenzen verlaufen. Damit du deine eigene Software prüfen kannst, ohne dass ein Anbieter dir dazwischenfunkt, und ohne dass dein Code den Rechner verlässt.**

## Inhalt

[[toc]]

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

Deshalb der wichtigste Punkt zuerst, ein Detail aus dem Hugging-Face-Vorfall des vorigen Artikels, das leicht übersehen wird: **Das Team hat kein abliteriertes Modell gebraucht.** Es hat ein ganz normales offenes Modell genommen und auf eigener Hardware betrieben. Das hat gereicht, weil der Klassifikator des Anbieters bei einem selbst betriebenen Modell schlicht nicht existiert.

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

Ein offenes Modell auf der eigenen Maschine ist in einer Stunde eingerichtet und kostet dich außer Speicherplatz nichts. Es ist die Antwort auf das Dilemma aus dem [ersten Teil](https://agentic.schule/blog/2026-09-qwen-red-teaming): Es verweigert nicht, und dein Code bleibt, wo er hingehört. „Unzensiert" ist dabei die Ausnahme, nicht der Anfang. Für die allermeiste Sicherheitsarbeit reicht das ganz normale offene Modell, selbst betrieben.

Das Werkzeug allein macht aber noch keinen guten Red-Teamer. Ein Modell, das nichts verweigert, kann auch mehr anrichten, sobald es Werkzeuge in die Hand bekommt. In welchem Rahmen so ein Agent laufen darf, und warum die naheliegende Antwort „läuft doch in einer VM" nur die halbe Miete ist, steht im [nächsten Teil](https://agentic.schule/blog/2026-09-strix-pentest-agent) am Beispiel eines Pentest-Agenten.

**Fang mit einem Repository an, bei dem dir ein gehosteter Assistent zuletzt in die Quere gekommen ist.** Lass dieselbe Frage lokal laufen. Genau dort siehst du den Unterschied in wenigen Minuten.

Wie ist dein lokales Setup? Ich sammle die Aufbauten und schreibe darüber weiter.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
