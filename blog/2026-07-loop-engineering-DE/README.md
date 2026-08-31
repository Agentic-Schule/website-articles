---
title: 'Loop Engineering: Wenn der Agent sich selbst weiterschickt'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-07-27
keywords:
  - Loop Engineering
  - Claude Code
  - Agentic Coding
  - KI-Agent
  - Automatisierung
  - OpenAI Codex
  - Cursor
  - Prompt Caching
language: de
header: header.jpg
---

Wie oft am Tag tippst du deinem Agenten „mach weiter"?

Wenn die Antwort „zu oft" lautet, ist dieser Artikel für dich. Loop Engineering nimmt dir genau dieses „weiter" ab: Du schreibst einmal auf, was passieren soll und wann Schluss ist, und eine Schleife erledigt den Rest.

**In Claude Code steckt das hinter zwei Befehlen, `/loop` und `/goal`, und die beiden arbeiten grundverschieden. Dieser Artikel zeigt, was sie tatsächlich tun, was die Pausen dazwischen kosten, wann sich eine Schleife überhaupt lohnt und welche anderen Werkzeuge mitziehen.**

Vorweg zur Einordnung: Ich beziehe mich hier vor allem auf Claude Code. Andere Agenten haben teils eine ganz andere Vorstellung davon, wie eine Schleife aussehen sollte; was dort richtig ist, kann hier falsch sein. Auf sie komme ich am Ende zurück.

## Inhalt

[[toc]]

## Was Loop Engineering bedeutet

Die knappste Definition stammt von Addy Osmani, der den Begriff [in einem Artikel ausbuchstabiert hat](https://addyosmani.com/blog/loop-engineering/):

> Loop engineering is replacing yourself as the person who prompts the agent. You design the system that does it instead.

Klingt spektakulär. Ist es aber eigentlich nicht. Du hörst schlicht auf, der Taktgeber zu sein.

Wie weit das gehen kann, beschreibt Boris Cherny, Erfinder und Chef von Claude Code bei Anthropic. Fortune zitiert ihn [am 11. Juni 2026](https://fortune.com/2026/06/11/anthropic-claude-boris-cherny-doesnt-write-code-by-hand-anymore/) von der Bühne der Konferenz Brainstorm Tech:

> If you look at most Claude Code sessions, it's actually another Claude that does the prompting.

Daraus wurde der zugespitzte Satz „I don't prompt Claude anymore." Belegen lässt er sich nicht, und wörtlich nehmen sollte man ihn ohnehin nicht: Hier bewirbt der Chef sein eigenes Produkt. Wer selbst Schleifen laufen lässt, greift sehr wohl ein, justiert nach und bricht ab.

Die deutschsprachige codecentric hat den Begriff [in eine brauchbare Schichtung eingeordnet](https://www.codecentric.de/en/knowledge-hub/blog/loop-harness-context-engineering-explained). Context Engineering sorgt dafür, dass im einzelnen Prompt die richtigen Informationen stehen. Harness Engineering baut das Geländer drumherum, also Werkzeuge, Skills, Hooks und Sandboxes. Loop Engineering ist die Schicht darüber:

> the system that repeatedly triggers an AI agent, spawns helper agents, verifies results, and feeds itself, without a human prompting turn by turn

Wichtig ist der Zusatz aus demselben Artikel: Jede Schicht erbt die Schwächen der darunter. Eine Schleife um einen Agenten, der seinen Kontext nicht im Griff hat, dreht nur schneller im Kreis.

So viel zur Idee. Sie ist für jeden Agenten dieselbe, die Umsetzung ist es nicht. Die nächsten Abschnitte zeigen sie an Claude Code, dem Werkzeug, das ich selbst am meisten einsetze. Wie andere Werkzeuge dieselbe Idee lösen, kommt am Ende.

## `/loop`, `/goal` oder Hook

In Claude Code gibt es drei Wege, eine Sitzung weiterlaufen zu lassen; `/loop` ist nur einer davon. Anthropic stellt sie [selbst gegenüber](https://code.claude.com/docs/en/goal):

| Ansatz | Nächster Zug startet | Endet |
| --- | --- | --- |
| `/goal` | sobald der vorige Zug fertig ist | ein Modell bestätigt die Bedingung |
| `/loop` | wenn ein Zeitintervall verstrichen ist | du stoppst, oder Claude hält die Arbeit für erledigt |
| Stop-Hook | sobald der vorige Zug fertig ist | dein eigenes Skript oder dein Prompt entscheidet |

Der Unterschied zwischen den ersten beiden ist der wichtigste im ganzen Thema. `/loop` **wartet**. `/goal` startet den nächsten Zug sofort.

Dazu kommt ein zweiter Unterschied, der leicht übersehen wird. `/goal` prüft die Abbruchbedingung mit einem eigenen Modell. In der Dokumentation steht es so:

> completion is decided by a fresh model rather than the one doing the work

Das ist mehr als ein Detail. Wer die Bedingung in den Prompt einer `/loop` schreibt, lässt dasselbe Modell entscheiden, ob es fertig ist, das gerade die Arbeit gemacht hat. Bei `/goal` schaut ein anderes Modell drauf, laut Doku das kleine schnelle Modell der Sitzung, standardmäßig Haiku. Es bekommt die Bedingung und das bisherige Gespräch und gibt eine Ja-Nein-Entscheidung samt kurzer Begründung zurück. Bei einem Nein wird diese Begründung zur Wegweisung für den nächsten Zug.

Eine Einschränkung gehört dazu: Dieser Prüfer ruft keine Werkzeuge auf. Er urteilt nur über das, was im Gespräch schon sichtbar ist. Die Bedingung muss also so formuliert sein, dass Claudes eigene Ausgabe sie belegen kann. „Alle Tests in `test/auth` laufen durch" funktioniert, weil Claude die Tests ausführt und das Ergebnis im Transkript landet.

Und noch eine Unterscheidung, die in der Praxis für Verwirrung sorgt. Die Dokumentation trennt zwei Sorten von Rückfragen:

> auto mode removes per-tool prompts, and `/goal` removes per-turn prompts

Dass der Agent aufhört zu fragen „soll ich weitermachen", kommt von der Schleife. Dass er nicht bei jedem einzelnen Werkzeugaufruf nachfragt, kommt vom Berechtigungsmodus. Wer nur eine Schleife setzt und sich wundert, dass trotzdem ständig Dialoge aufpoppen, hat die beiden verwechselt. Willst du auch diese Werkzeug-Dialoge los, wechsle in den **Auto Mode**: Im Terminal schaltest du mit `Shift+Tab` durch die [Berechtigungsmodi](https://code.claude.com/docs/en/permission-modes), bis „auto" dasteht. Dann gibt ein Klassifizierer die Aufrufe frei, statt bei jedem nachzufragen.

> 🔁 **Merke:** Wartest du auf etwas außerhalb deiner Sitzung, nimm `/loop`. Arbeitest du auf einen prüfbaren Endzustand hin, nimm `/goal`. Willst du dieselbe Prüfung in jeder Sitzung, nimm einen Stop-Hook.

## Was `/loop` tatsächlich tut

Die [Dokumentation von Claude Code](https://code.claude.com/docs/en/scheduled-tasks) beschreibt drei Verhaltensweisen, und welche du bekommst, hängt davon ab, was du eingibst.

| Eingabe | Beispiel | Verhalten |
| --- | --- | --- |
| Intervall und Prompt | `/loop 5m check the deploy` | fester Takt per Cron |
| nur Prompt | `/loop check the deploy` | Claude wählt den Abstand selbst |
| nur Intervall oder nichts | `/loop` | eingebauter Wartungs-Prompt |

Im selbstgetakteten Modus entscheidet Claude nach jedem Durchlauf selbst, wie lange er wartet. Die Doku beschreibt das so: kurze Abstände, solange ein Build läuft oder ein Pull Request in Bewegung ist, längere, wenn nichts ansteht. Solange tatsächlich etwas passiert, bleiben die Abstände kurz. Der gewählte Abstand und die Begründung dafür werden am Ende jedes Durchlaufs ausgegeben.

`/proactive` ist übrigens ein Alias und tut dasselbe. Ein bloßes `/loop` ohne alles startet einen eingebauten Wartungs-Prompt. Der arbeitet in fester Reihenfolge: erst unerledigte Arbeit aus dem Gespräch fortsetzen, dann den Pull Request des aktuellen Branch pflegen, also Review-Kommentare, rote CI und Merge-Konflikte, und wenn nichts davon ansteht, Aufräumdurchgänge wie Bug-Jagd oder Vereinfachung. Neue Initiativen startet er nicht. Irreversible Aktionen wie Pushen oder Löschen führt er nur aus, wenn sie etwas fortsetzen, das im Transkript schon genehmigt wurde.

Diesen Standard kannst du ersetzen. Eine Datei `.claude/loop.md` im Projekt oder `~/.claude/loop.md` für dich persönlich tritt an seine Stelle. Das ist einfaches Markdown ohne vorgeschriebene Struktur, geschrieben so, als würdest du den Prompt direkt eintippen. Änderungen daran greifen beim nächsten Durchlauf, du kannst also nachschärfen, während die Schleife läuft.

Ein paar Grenzen solltest du kennen. Die Schleife lebt in der Sitzung und endet mit ihr. Ein `--resume` holt sie zurück, aber nach sieben Tagen verfällt sie endgültig. Esc bricht einen wartenden Durchlauf ab. Und im selbstgetakteten Modus kann Claude von sich aus Schluss machen, wenn er die Arbeit für erledigt hält. Vergisst er beides, also weder neu planen noch stoppen, plant Claude Code einen einzigen Nachzügler nach etwa zwanzig Minuten und beendet die Schleife dann.

> ⚠️ Auf Amazon Bedrock, Claude Platform on AWS, Google Clouds Agent Platform und Microsoft Foundry gilt das nicht. Dort läuft ein Prompt ohne Intervall in einem festen Zehn-Minuten-Takt, und `loop.md` wird gar nicht erst gelesen.

## Praxis: eine Bedingung statt fünfzehnmal „weiter"

So sieht das bei mir im Alltag aus:

```text
/loop implementiere das Feature wie besprochen. Du bist erst fertig,
wenn alles meinen Vorgaben entspricht, alles durchgetestet ist, der
Pull Request bereit ist und die CI grün ist.
```

Der Effekt ist genau der erhoffte. Normalerweise bleibt der Agent nach einem Zwischenstand stehen und bittet um Bestätigung, weiterzumachen. Das passiert hier nicht. Es wird periodisch weitergearbeitet, bis das Ziel erreicht ist.

Mehr als einmal habe ich erlebt, dass ein Agent von sich aus aus der Schleife ausgebrochen ist und um eine Richtungsentscheidung gebeten hat. Etwa als er einen fundamentalen Fehler in der Anweisung entdeckte, bei dem weiteres Abarbeiten keinen Sinn ergeben hätte, oder als er auf eine Sicherheitslücke stieß. Das beruhigt, aber ich möchte es nicht zur Regel erklären. Die Dokumentation beschreibt Zurückhaltung ausdrücklich nur für den **eingebauten** Wartungs-Prompt. Bei einem eigenen Prompt wie oben gibt es diese Zusage nicht. Was ich gesehen habe, war Ermessen des Modells und kein Sicherheitsnetz, auf das du bauen solltest. Theoretisch könnte Claude die Anweisung genauso gnadenlos durchziehen. So ist das halt bei nicht-deterministischer Software.

Streng genommen ist mein Beispiel ein Mischfall, und deshalb ist es lehrreich. „Implementieren und durchtesten" ist Arbeit ohne Wartezeit, dafür wäre `/goal` gebaut. „CI ist grün" ist Warten auf etwas Fremdes, dafür ist `/loop` gebaut. Beides in einer Bedingung ergibt einen Auftrag, der von beiden Werkzeugen etwas will. In der Praxis funktioniert die Schleife hier gut, weil das Warten auf die CI den Takt ohnehin vorgibt.

Wenn es beim Warten bleibt, lohnt noch ein Blick auf das [Monitor-Werkzeug](https://code.claude.com/docs/en/tools-reference#monitor-tool). Die Dokumentation weist selbst darauf hin, dass Claude bei einer selbstgetakteten Schleife stattdessen zu Monitor greifen kann. Das lässt ein Skript im Hintergrund laufen und reicht jede Ausgabezeile durch, statt in Abständen nachzuschauen. Wer auf ein Log wartet, spart sich damit das Pollen komplett.

## Was die Pause kostet

Die Pausen zwischen den Durchläufen fühlen sich nach einem Nebeneffekt an. Sie sind aber der Grund, warum eine Schleife lange erträglich bleibt, und sie haben einen Haken, den du kennen solltest.

Erst der angenehme Teil. Anthropic verlängert den Prompt-Cache automatisch, [wenn du über ein Abo arbeitest](https://code.claude.com/docs/en/prompt-caching):

> On a Claude subscription, Claude Code requests the one-hour TTL automatically.

Im Abo bleibt der zwischengespeicherte Kontext damit über jede Pause hinweg warm, die eine Schleife überhaupt wählen kann. Die Pause kostet dich nichts.

Jetzt der Haken. Sobald du über dein Kontingent hinaus arbeitest und Usage Credits verbrauchst, schaltet Claude Code laut derselben Seite automatisch auf fünf Minuten herunter. Auf einem API-Schlüssel und bei den Cloud-Anbietern sind fünf Minuten ohnehin der Standard. Und dann gilt:

> After a long enough gap, the next request recomputes the full input and re-establishes the cache, which is why the first turn back after stepping away can be noticeably slower.

Eine selbstgewählte Pause von zwanzig Minuten liegt in diesem Fall weit jenseits des Fensters. Jeder Durchlauf beginnt dann damit, den kompletten Kontext neu zu verarbeiten. Genau die Pause, die dich schonen sollte, wird dadurch teuer. Und zwar deutlich: Solange der Cache warm ist, kostet der große, unveränderte Teil des Kontexts nur ein Zehntel des normalen Input-Preises. Nach einem Miss wird genau dieser Teil neu geschrieben, zum [1,25-fachen](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#pricing). Aus einem Zehntel wird so mehr als das Zwölffache, und das Durchlauf für Durchlauf. Wer per API oder über Bedrock arbeitet und lange Schleifen fahren will, sollte deshalb entweder feste kurze Intervalle setzen oder die Umgebungsvariable `ENABLE_PROMPT_CACHING_1H` benutzen, die dieselbe Seite dafür nennt. Oder dir sind die verbrauchten Tokens egal. Dann YOLO! 😄

## Wann sich eine Schleife nicht lohnt

Bis hierhin ging es darum, wie Schleifen funktionieren. Die wichtigere Frage steht davor: ob du überhaupt eine brauchst. Aus dem, was oben steht, ergeben sich vier Bedingungen. Fehlt eine davon, kostet die Schleife mehr, als sie einbringt.

**Wiederholt sich die Aufgabe?** Eine Schleife rechnet sich über viele Durchläufe. `/loop` lebt in der Sitzung und verfällt nach sieben Tagen, `/goal` endet mit der Bedingung. Für eine einmalige Sache ist ein gut gezielter Prompt schneller und billiger. Wer etwas einmal macht, hat kein Schleifenproblem. Er hat ein Skript.

**Kann etwas außer dem Agenten Nein sagen?** Das ist die härteste der vier. Der Prüfer von `/goal` ruft keine Werkzeuge auf, er sieht nur, was im Gespräch steht. Fehlt ein harter Test, Build oder Linter, benotet der Agent am Ende seine eigene Arbeit. Dann läuft die Schleife munter weiter, auch wenn längst etwas kaputt ist.

Und noch etwas gehört dazu: Jeder Durchlauf braucht etwas Neues zum Arbeiten. Ein frisches Testergebnis, einen neuen Fehler, dein Feedback. Ein bloßes „lies es nochmal und mach es besser" ist keine neue Information; dann poliert die Schleife endlos dieselbe Ausgabe, oder sie endet im Idealfall einfach. Das ist der häufigste Anfängerfehler: eine Schleife wie „verbessere den Text, bis er gut ist" ansetzen und sich wundern, dass nichts besser wird. Dass ein Modell, das nur die fertige Antwort beurteilt, sich damit eher selbst überzeugt als besser wird, hat das Paper [„More Convincing, Not More Correct"](https://arxiv.org/abs/2607.05904) gemessen.

**Trägt dein Tarif das?** Eine Schleife liest Kontext neu, probiert Dinge aus und verwirft sie. Das kostet Tokens, ob am Ende etwas Brauchbares herauskommt oder nicht. Wie im Abschnitt davor beschrieben, wird es außerhalb eines Abos zusätzlich teuer, weil jede längere Pause den zwischengespeicherten Kontext reißt. Loop Engineering wirkt selbstverständlich, wenn Tokens praktisch nichts kosten, und rücksichtslos, wenn jeder Durchlauf auf der Rechnung steht.

**Kann der Agent ausprobieren, was er baut?** Ohne Logs, ohne lauffähige Umgebung, ohne die Möglichkeit, den eigenen Code auszuführen, iteriert die Schleife blind. Sie produziert dann schnell viel Text, den niemand geprüft hat.

Meine ehrliche Einschätzung dazu: Loop Engineering ist eine echte Technik, und die meisten brauchen sie heute noch nicht. Für einmalige Aufgaben, für Erkundungen und überall dort, wo „fertig" eine Ermessensfrage ist, gewinnt weiterhin ein einzelner, gut gezielter Prompt. Und wenn dein Engpass ohnehin das Review ist, macht eine Schleife die Warteschlange nur länger.

## Der Nachtlauf

So viel dazu, wann sich eine Schleife nicht lohnt. Es gibt aber einen Fall, für den ich sie liebe. Manche Aufgaben sind schlicht hart. Sie brauchen viele Anläufe, immer wieder gegen die CI, bis endlich alles grün ist. Genau dafür lasse ich den Agenten grinden, notfalls die ganze Nacht.

Die Abbruchbedingung ist dann knallhart:

```text
/loop implementiere den Plan. Alles durchgetestet, alles auf CI grün.
Keine Ausnahmen, keine Abkürzungen. Gib nicht auf, bis das Ziel erreicht
ist. Keine Rückfragen. Ich bin jetzt AFK und habe die ganze Nacht Zeit.
```

Ob der letzte Satz mit der Nacht wirklich nötig ist, weiß ich nicht. Aber Opus wünscht mir daraufhin meist eine gute Nacht und verspricht, dass morgens alles grün ist. Und meistens ist es das dann auch.

Dieser Fall trifft genau die Bedingungen, die eine Schleife lohnend machen: Die CI kann Nein sagen, der Agent kann seinen Code ausführen, und im Abo kosten die vielen Nachtdurchläufe nichts extra. Kein Wunder, dass die Schleife hier glänzt.

## Ein Blick von innen

Bis hierhin stand weitgehend alles in der öffentlichen Dokumentation. Der Rest dieses Abschnitts nicht. Er stammt aus eigenen Messungen und aus den Anweisungen, die das Modell zur Laufzeit bekommt. Ausgelesen habe ich sie aus **Claude Code 2.1.220**. Anthropic ändert solche Texte ohne Ankündigung, in einer späteren Version kann dort also etwas anderes stehen.

**Bei `/loop` ist es ein Werkzeug.** Die Selbsttaktung ist kein Automatismus im Programm. Das Modell bekommt ein Werkzeug namens `ScheduleWakeup` und setzt den nächsten Aufwachzeitpunkt selbst. Zur Spanne steht in dessen Beschreibung schlicht:

> Clamped to [60, 3600] by the runtime.

Die interessante Frage ist, wonach das Modell innerhalb dieser Spanne wählt. Dazu bekommt es drei Fälle vorgegeben. Beim Warten auf etwas Fremdes, das die Umgebung nicht von sich aus melden kann, soll der Abstand zur Sache passen:

> A CI run that takes ~8 minutes deserves one ~480s check, not eight 60s ones.

Genau so erlebe ich es auch. Bei einem laufenden CI-Durchlauf wartet der Agent ungefähr so lange, wie mein CI üblicherweise braucht. Bemerkenswert ist, dass dieser Satz in drei Fassungen im Programm liegt. Welche das Modell zu sehen bekommt, hängt davon ab, wie lange sein Prompt-Cache hält. Bei fünf Minuten Haltbarkeit rät derselbe Text zu zweimal rund 270 Sekunden statt achtmal 60, weil jede längere Pause den Cache reißen würde. Die Anweisung rechnet den Cache also mit ein, genau die Kosten, die der Abschnitt „Was die Pause kostet" beziffert.

Für die beiden anderen Fälle gilt: Wenn ohnehin etwas anderes das Aufwachen auslöst, ist ein langer Sicherungs-Herzschlag ab 1200 Sekunden vorgesehen. Und wenn es gar nichts Bestimmtes zu beobachten gibt, lautet die Vorgabe 1200 bis 1800 Sekunden. Ausdrücklich verboten ist das Pollen um des Pollens willen:

> Do NOT schedule a short-interval wakeup to poll for background work you started, when harness-tracked work finishes, you are re-invoked automatically, so polling is wasted.

Das erklärt, warum sich eine Schleife im Alltag flotter anfühlt, als die Spanne vermuten lässt. Solange etwas läuft, wird kurz gewartet. Die langen Abstände sind für den Fall reserviert, dass gerade nichts passiert.

Dann habe ich nachgemessen und bewusst einen zu kurzen Abstand angefordert, nämlich dreißig Sekunden. Die Antwort:

```text
Next wakeup scheduled for 22:41:00 (in 119s)
(clamped to 60s from your requested value)
```

Zwei Dinge passieren hier nacheinander. Erst wird der Wunsch auf sechzig Sekunden hochgesetzt, das ist die harte Untergrenze. Dann rutscht der Termin auf die nächste volle Minute, weil Cron nur Minutengranularität kennt. Aus dreißig angeforderten Sekunden wurden so **119 Sekunden echte Wartezeit**. Wer sehr kurze Takte plant, sollte das wissen.

Beenden kann das Modell die Schleife ebenfalls selbst, mit demselben Werkzeug und dem Aufruf `stop: true`. Genau das habe ich im Test ausgelöst, als die Frage beantwortet war, und bekam `Loop stopped, cancelled 1 pending wakeup(s)` zurück. Eine Falle steckt darin: Das beendet nur die selbstgetaktete Schleife. Eine mit festem Intervall läuft weiter und muss über `CronDelete` weg.

**Bei `/goal` ist es eine Anweisung.** Dort bekomme ich kein Werkzeug in die Hand. Sobald du ein Ziel setzt, erscheint dieser Text in meinem Kontext:

> A session-scoped Stop hook is now active with condition: "…". Briefly acknowledge the goal, then immediately start (or continue) working toward it — treat the condition itself as your directive and do not pause to ask the user what to do. The hook will block stopping until the condition holds. It auto-clears once the condition is met — do not tell the user to run `/goal clear` after success; that's only for clearing a goal early.

Das ist der ganze Mechanismus, in drei Teilen. Die Bedingung wird zur Arbeitsanweisung. Ich soll ausdrücklich nicht zwischendurch nachfragen. Und ein Hook lässt mich nicht anhalten, solange die Bedingung nicht hält.

Drumherum liegen ein paar Werte, die die Doku bestätigen oder ergänzen. Die Konstante für die maximale Länge der Bedingung steht auf 4000 Zeichen. Der Statuseintrag heißt `goal_status` und tritt in mehreren Ausprägungen auf: beim Setzen nur mit `met` und `condition`, beim Abschluss zusätzlich mit `reason`, `iterations`, `durationMs` und `tokens`, dazu ein Feld `failed`. Und es gibt zwei Fehlermeldungen, die in der Dokumentation fehlen: `/goal` läuft nur in vertrauenswürdigen Arbeitsverzeichnissen, und es verweigert den Dienst, wenn Hooks per `disableAllHooks` oder `allowManagedHooksOnly` eingeschränkt sind.

Vergeblich gesucht habe ich nach einem eigenen Bewertungs-Prompt für das prüfende Modell. Den gibt es offenbar nicht, was zur Doku passt, die `/goal` als „a wrapper around a session-scoped prompt-based Stop hook" beschreibt. Deine Bedingung selbst ist der Prompt, mit dem geprüft wird. Deshalb lohnt es sich, sie so zu formulieren, dass ein Außenstehender sie am Gesprächsverlauf beurteilen kann.

Zwei Grenzen gehören dazu. Ein Ziel kann enden, ohne erreicht zu sein: Hält das prüfende Modell die Bedingung für unmöglich, wird der Eintrag als gescheitert markiert und die Schleife endet. Und es gibt eine harte Obergrenze. Laut Changelog endet der Zug mit einer Warnung, nachdem der Stop-Hook achtmal hintereinander blockiert hat, einstellbar über `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`.

**Was für beide gilt.** Die Selbsttaktung hängt an einem serverseitig ausgespielten Schalter namens `tengu_kairos_loop_dynamic`. Im Programm steht dazu ein Rückfallwert, der aber nur greift, wenn die Konfiguration vom Server gar nicht erreichbar ist. Im Normalfall entscheidet der Server. Der Schalter steuert dabei mehr als man denkt: Ist er aus, tut `ScheduleWakeup` schlicht nichts, und schon der Hilfetext ändert sich. Nur mit gesetztem Schalter trägt die Beschreibung von `/loop` den Zusatz „Omit the interval to let the model self-pace." Ohne den Schalter nennt sie dort einen Vorgabewert von zehn Minuten.

Strukturell sind die beiden ohnehin verschiedene Dinge, und das erklärt, warum `/loop` andere Slash-Befehle als Argument schlucken kann. `/goal` ist ein Befehl. `/loop` ist ein Skill, registriert unter dem Namen `loop` mit `proactive` als Alias.

Für die Verfügbarkeit spielt das gewählte Modell bei beiden keine Rolle. `/loop` hängt an einer Umgebungsvariablen und einem Feature-Schalter, `/goal` an Interaktivität, am Vertrauensstatus des Arbeitsverzeichnisses und an den Hook-Einstellungen. Ob Opus oder Sonnet läuft, ändert daran nichts, und die Merkmale, nach denen der Server seine Schalter ausspielt, enthalten überhaupt kein Modellfeld.

Modellabhängige Schalter gibt es im Programm aber sehr wohl, nur an anderer Stelle. Die Websuche etwa prüft auf Google Vertex, welches Modell läuft, und schaltet sich für ältere Modelle ab. Bei `/loop` selbst habe ich genau eine Stelle gefunden, an der das Modell hineinspielt, und die betrifft das Verhalten. Für bestimmte Modelle endet ein Zug sofort, wenn sein einziger Werkzeugaufruf das Einplanen des nächsten Durchlaufs war.

Diese Unterscheidung verdanke ich einem Gegenleser. Meine erste Fassung behauptete, kein einziger Aktivierungs-Ausdruck im Programm nehme Bezug auf ein Modell. Das war falsch, weil ich nur eine von mehreren Schreibweisen durchsucht hatte. Es sind 91 in der einen Form, 42 in einer zweiten und 101 weitere unter anderem Namen, und in den übersehenen sitzen die Modellprüfungen.

Damit steht der Unterschied zwischen den beiden auch technisch da. Bei `/loop` bekomme ich ein Werkzeug und entscheide selbst über den Takt. Bei `/goal` bekomme ich eine Anweisung und einen Türsteher.

## Wer sonst Schleifen dreht

Bleibt die Frage, ob das eine Eigenheit von Claude Code ist. Hier ist eine Übersicht der gängigen Werkzeuge, jeweils an ihrer eigenen Doku geprüft (Stand 27. Juli 2026):

| Werkzeug | Befehl in der Sitzung | Was es stattdessen gibt |
| --- | --- | --- |
| [Claude Code](https://code.claude.com/docs/en/scheduled-tasks) | **`/loop`** | dazu `/goal`, Monitor, Routines in der Cloud, Desktop-Aufgaben |
| [OpenAI Codex](https://developers.openai.com/codex/automations) | keiner | geplante Aufgaben in der App, auch innerhalb eines Chats |
| [Cursor](https://cursor.com/docs/cloud-agent/automations) | `/automate` | Automations als Cloud-Agenten, per Zeitplan oder Ereignis |
| [Amp](https://ampcode.com/news/schedule) | keiner | Agenten planen sich selbst und wecken sich auf |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/cli-reference.md) | keiner | nichts Vergleichbares dokumentiert |
| [OpenCode](https://opencode.ai/docs/commands/) | keiner | nichts Vergleichbares dokumentiert |
| [GitHub Copilot CLI](https://github.com/github/copilot-cli/blob/main/README.md) | keiner | nichts Vergleichbares dokumentiert |

Drei Beobachtungen dazu.

**Codex kann es, aber woanders.** Im CLI sind laut [Dokumentation](https://learn.chatgpt.com/docs/codex/cli) nur `/init`, `/status`, `/permissions`, `/model` und `/review` vorgesehen. Die Zeitplanung sitzt in der App. Dort gibt es allerdings etwas, das der Schleife sehr nahe kommt, nämlich geplante Aufgaben innerhalb eines bestehenden Chats. OpenAI beschreibt sie mit einer bemerkenswerten Wortwahl: „Scheduled tasks in a chat can use minute-based intervals for active follow-up loops." Das Wort steht also auch dort.

**Im Codex-Repository liegt seit Ende Mai ein Wunsch.** [Issue #25466](https://github.com/openai/codex/issues/25466) fordert genau diese Funktion für das CLI und beschreibt sie bis in die Werkzeugnamen hinein wie bei Claude Code, inklusive `CronCreate` und `ScheduleWakeup`. Der Autor hat sie auf einem Fork bereits gebaut. Eröffnet am 31. Mai 2026, Stand heute offen, ohne einen einzigen Kommentar.

**Amp löst es ohne Befehl.** Dort braucht es keinen Slash-Befehl, man sagt es einfach. Die [Ankündigung vom 21. Juli 2026](https://ampcode.com/news/schedule) formuliert es so:

> Agents in Amp can now set their own schedules and wake themselves up. When a schedule fires, the agent wakes up with its saved prompt and continues right where it left off, with all of its context and history.

Das ist dieselbe Idee mit einer anderen Bedienoberfläche. Und es zeigt, wohin das läuft: Die Fähigkeit wird zur Selbstverständlichkeit, der Zugang dazu unterscheidet sich.

## Fazit

Im Kern läuft Loop Engineering auf eine einzige Frage hinaus: Wer entscheidet, wann Schluss ist? Solange du das bist, tippst du „weiter". Sobald du es aufschreibst, hast du eine Schleife.

Sechs Dinge nehme ich mit:

- **Die meisten brauchen noch keine Schleife.** Wiederholt sich die Aufgabe nicht, oder kann niemand außer dem Agenten Nein sagen, gewinnt weiterhin ein einzelner guter Prompt.
- **Die Abbruchbedingung ist die eigentliche Arbeit.** Der Rest ist ein Befehl mit einem Zeitintervall.
- **`/loop` wartet, `/goal` nicht.** Wartest du auf etwas Fremdes wie den grünen CI-Run, der gleich einen guten Takt vorgibt, nimm die Schleife. Arbeitest du auf einen Endzustand hin, nimm das Ziel.
- **Lass nicht dasselbe Modell prüfen, das gearbeitet hat.** `/goal` holt dafür ein eigenes Modell dazu.
- **Pausen sind im Abo gratis und per API teuer.** Ein Cache, der eine Stunde hält, gegen einen, der nach fünf Minuten kalt ist.
- **Selbstständiges Abbrechen ist Ermessen, keine Zusage.** Verlasse dich nicht darauf, dass der Agent bei einem Fund von allein innehält.

Und wenn du dich zwischen den beiden Befehlen nicht entscheiden magst, fang mit `/goal` an. Eine prüfbare Abbruchbedingung zwingt dich ohnehin dazu, das Problem vorher zu Ende zu denken.

**Wie haltet ihr das?** Lasst ihr Schleifen laufen, und wenn ja, mit welcher Abbruchbedingung? Ich freue mich über jede Nachricht.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
