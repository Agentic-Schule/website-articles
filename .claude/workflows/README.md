# Vorgehen: aus gesammeltem Material werden Artikel-Themen

Beschreibt die Kette von der Instagram-Aktivität bis zum abarbeitbaren Themen-Fundus. Die Umwandlung des Exports übernimmt `instagram-export-to-posts.py`, den Rest der Workflow `instagram-themen-fundus.js`, gestartet per `Workflow({ name: 'instagram-themen-fundus', args: { total, chunkSize, runDate } })` gestartet.

## Warum das Ganze

Gespeicherte Reels sind ein Themenspeicher, der sich nicht von selbst erschließt. Ein Reel dauert eine Minute, 248 davon anzusehen kostet einen Arbeitstag. Der Fundus macht daraus eine Liste, die sich nach Themengruppen abarbeiten lässt.

## Schritt 1: die Eingabedatei erzeugen

Der Ausgangspunkt ist der offizielle Instagram-Datenexport. Anfordern lässt er sich in der App unter „Deine Aktivität" über „Deine Informationen herunterladen"; wichtig ist die Wahl **JSON** als Format, denn die HTML-Variante ist für diesen Zweck unbrauchbar. Instagram schickt das Archiv per Mail.

Aus dem entpackten Archiv wird nur ein Verzeichnis gebraucht:

```
your_instagram_activity/
  saved/saved_posts.json     gespeicherte Beiträge
  likes/liked_posts.json     gelikte Beiträge
```

Beide Dateien sind Arrays. Jeder Eintrag hat einen `timestamp` und eine Liste `label_values`, in der die Angaben unter deutschen Labels stecken: „URL", „Untertitel" für die Caption, dazu verschachtelte Blöcke für Hashtags und den Eigentümer des Beitrags.

Die Umwandlung übernimmt `instagram-export-to-posts.py`:

```bash
python3 .claude/workflows/instagram-export-to-posts.py ~/Shots/your_instagram_activity ~/Shots/instagram-posts.json
```

Das Ergebnis ist ein flaches Array mit `source` (`saved` oder `liked`), `date`, `url`, `account` und `caption`, sortiert nach Datum absteigend. Drei Eigenheiten des Exports behandelt das Skript, und jede davon kostet sonst Zeit:

- **Die Texte sind doppelt kodiert.** UTF-8-Bytes stehen als Latin-1-Zeichen in der Datei, aus „wäre" wird „wÃ¤re". Ohne die Reparatur landet der Zeichensalat später im Fundus.
- **Die Zeitstempel werden in UTC ausgewertet.** Bei Ortszeit rutschen Beiträge vom späten Abend auf den Folgetag.
- **Die Captions werden bei 800 Zeichen gekappt.** Für Schlagworte und Kernaussage genügt der Anfang, und die gebündelte Übergabe an den Fundus-Agenten bleibt handhabbar.

Der Anzeigename unter `account` stammt aus dem ersten Feld „Name" im Eintrag. Je nach Beitrag ist das der Kanalname oder der Name des Urhebers. Beides taugt als Anzeige im Fundus, die Zuordnung läuft ohnehin über die URL.

Die Anzahl der Einträge, die das Skript ausgibt, wird anschließend als `args.total` an den Workflow übergeben, denn Workflow-Skripte haben selbst keinen Dateizugriff.

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
