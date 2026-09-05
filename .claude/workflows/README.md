# Vorgehen: aus gesammeltem Material werden Artikel-Themen

Beschreibt die Kette von der Instagram-Aktivität bis zum abarbeitbaren Themen-Fundus. Der Workflow dazu ist `instagram-themen-fundus.js` und wird per `Workflow({ name: 'instagram-themen-fundus', args: { total, chunkSize, runDate } })` gestartet.

## Warum das Ganze

Gespeicherte Reels sind ein Themenspeicher, der sich nicht von selbst erschließt. Ein Reel dauert eine Minute, 248 davon anzusehen kostet einen Arbeitstag. Der Fundus macht daraus eine Liste, die sich nach Themengruppen abarbeiten lässt.

## Die Eingabedatei

`~/Shots/instagram-posts.json` ist ein JSON-Array. Jeder Eintrag hat `source` (`saved` oder `liked`), `date`, `url`, `account` und `caption`. Sie entsteht aus dem offiziellen Instagram-Datenexport, der die gespeicherten Posts und die Likes in getrennten Dateien liefert.

Die Anzahl der Einträge wird als `args.total` übergeben, weil Workflow-Skripte selbst keinen Dateizugriff haben.

## Die beiden Phasen

**Transkribieren.** Ein Agent bearbeitet einen Block von Posts, standardmäßig zwölf. Die Blöcke laufen streng nacheinander, denn alle Agenten teilen sich einen Browser. Dieser Punkt ist der wichtigste am ganzen Aufbau: Parallelität zerstört hier die Sitzung, statt sie zu beschleunigen. Jeder Agent schreibt sein Ergebnis nach `~/Shots/transcripts/chunk-NN.md` und gibt zusätzlich strukturierte Kurzfassungen zurück (Schlagworte und ein bis zwei Sätze Kernaussage je Post).

Die Transkripte holt der Agent über transcript365. Das Eingabefeld ist ein React-Input, bei dem ein einfaches Setzen von `value` wirkungslos bleibt; das erprobte Rezept über den nativen Property-Setter steht im Agenten-Prompt.

**Bündeln.** Ein einzelner Agent gruppiert alle Kurzfassungen nach Inhalt, sortiert die Gruppen nach Größe und schreibt `~/Shots/themen-fundus.md`. Am Ende der Datei steht eine Checkliste der Gruppen mit je einer möglichen Artikel-Idee.

## Modellwahl

Die Transkriptions-Agenten laufen auf dem kleineren Modell. Es ist mechanische Browser-Arbeit nach festem Rezept, und die Hauptsitzung läuft so nicht gegen ihr Nutzungslimit.

> **⚠️ Achtung:** Ohne gesetztes `model` erben Workflow-Agenten das Modell der Sitzung. Bei einem großen Lauf sterben dann alle Agenten gleichzeitig, sobald das Limit dieses Modells erreicht ist.

## Wenn ein Lauf abbricht

Jeder Workflow-Aufruf legt sein Skript unter dem Sitzungsverzeichnis ab und liefert Pfad und `runId` im Ergebnis zurück. Ein Neustart mit `Workflow({ scriptPath, resumeFromRunId })` liefert alle unveränderten `agent()`-Aufrufe sofort aus dem Cache und führt nur die neuen oder geänderten wirklich aus. Wichtig dabei: Die Optionen eines bereits gelaufenen Aufrufs müssen unverändert bleiben, sonst gilt er als geändert und läuft erneut.

## Videos außerhalb von Instagram

Für YouTube-Quellen braucht es diesen Weg nicht. `yt-dlp` liefert die automatischen Untertitel direkt:

```bash
yt-dlp --write-auto-subs --sub-langs "en.*" --sub-format vtt --skip-download <url>
```

Die VTT-Datei enthält jede Zeile mehrfach, weil die Untertitel rollend eingeblendet werden. Ein Durchlauf, der aufeinanderfolgende Dubletten entfernt, macht daraus lesbaren Fließtext.

## Vom Fundus zum Artikel

Die Checkliste am Ende des Fundus ist der Startpunkt. Pro Gruppe:

1. Gruppe auswählen und die Volltranskripte der zugehörigen Posts nachlesen.
2. Recherche über die Primärquellen, niemals über die Aussagen aus den Reels. Ein Reel ist ein Hinweis auf ein Thema und keine Quelle.
3. Rechercheprotokoll neben den Artikel legen, mit den geprüften Zitaten und ausdrücklich auch mit dem, was sich nicht halten ließ.
4. Artikel schreiben, Header rendern, englische Fassung, Squash-Merge.

> **💡 Tipp:** Der Fundus altert. Ein neuer Lauf über die seither hinzugekommenen Posts ist billiger als der Versuch, die alte Datei von Hand fortzuschreiben.
