# Descript Underlord

Jedes Video entsteht in Descript in zwei Schritten. Die Social-Media-Sitzung schreibt für beide Schritte die Anweisungen an Underlord, Johannes gibt sie in Descript ein.

1. **Schnitt.** Underlord löscht nur wörtlich genannte Stellen aus dem Rohtake: abgebrochene Versuche, Versprecher, Doppelungen. Nichts wird umformuliert oder neu eingesprochen. Underlord meldet danach die neue Länge und jeden Schnitt mit Zeitstempel.
2. **Layout.** Erst wenn der Schnitt passt. Die Aufnahme kommt als 3840×2160 und liegt auf der Seite (Kamera hochkant); die Vorlage dreht sie zuerst um 90° im Uhrzeigersinn, gedreht hat sie genau 2160×3840. Dann: Hochformat, Bilder, Untertitel, Audio. Die Anweisung besteht aus der Vorlage unten plus den Angaben für dieses Video (Szenen, Einblendungen, Korrekturen in den Untertiteln).

**Das Modell in Descript steht auf Opus 5.5.** Haiku 4.5 ist für diese Arbeit zu schwach, es manipuliert das Transkript selbst statt nur zu schneiden.

**Bilder und eigene Aufnahmen vor Schritt 2 in das Descript-Projekt importieren,** unter genau den Dateinamen, die die Anweisung nennt. Underlord findet sie nur so. Fehlt eine Datei, setzt Underlord an dieser Stelle einen Platzhalter und arbeitet weiter.

## Vorlage Schritt 1: Schnitt

```
EDIT THIS TAKE: cuts only

Language: German. Do not re-record, regenerate or rephrase anything. Only delete the exact passages listed below, at word boundaries. Keep every other word as spoken. Shorten every pause to max 0.2 s. Hard jump cuts are fine. Do not change layout, captions, images or audio settings yet.

1. Remove filler words ("ähm", "äh") everywhere.
2. Delete exactly these passages (quoted from the transcript):
   <Liste der Stellen, jeweils wörtlich, mit dem Ergebnis danach>
3. Do not delete anything else. In particular keep:
   <die Sätze, die auf keinen Fall fallen dürfen>
4. If a cut sounds unnatural (breath or intonation cut off mid-word), restore it and tell me which one.
5. After cutting, report the new total duration and list each cut with its timestamp.
```

**Ein einziges Pausen-Limit nennen.** Descript legt eine Obergrenze auf alle Lücken und kann Pausen zwischen Sätzen nicht von Pausen innerhalb eines Satzes unterscheiden. Zwei getrennte Werte im Prompt meldet Underlord als nicht umsetzbar zurück und wendet dann den kleineren auf alles an.

## Variante Schritt 1: nur das Gute behalten

Bei einem Rohtake mit mehreren Durchläufen ist die Liste der guten Stellen kürzer als die der schlechten. Dann wird der Prompt umgedreht:

```
Language: German. Do not re-record, regenerate or rephrase anything. Only keep the exact passages listed below, at word boundaries, in this order, and delete everything else. Shorten every pause to max 0.2 s.

The recording contains several attempts. When a sentence was attempted more than once, keep the LAST complete attempt, except where this list says otherwise.

<Liste der Stellen, die bleiben, in der Reihenfolge des fertigen Videos>
```

Bei zwei vollständigen Durchläufen wird der gewünschte benannt, jeweils mit seinem ersten Satz:

```
The recording contains two run-throughs. Run 1 starts with "<erster Satz>". Run 2 starts with "<erster Satz>". Use ONLY run 2.
```

## Schritt 1b: Straffen

Ist der Schnitt inhaltlich richtig, aber zu lang, folgt ein eigener Durchgang mit Zielmarke:

```
TIGHTEN THE CUT: cuts only, target under <mm:ss>

Same rules as before: do not re-record, regenerate or rephrase anything. Delete only the words listed below, at word boundaries.

1. Shorten every pause to max 0.2 s.
2. <weitere Stellen, wörtlich>

If the result is still longer than <mm:ss>, tell me the duration and do not cut anything else.
```

Die letzte Zeile ist wichtig. Ohne sie kürzt Underlord weiter, bis die Marke erreicht ist, und nimmt dafür auch Sätze, die bleiben sollen.

## Vorlage Schritt 2: Layout

Export in 4K hochkant (2160×3840): Die gedrehte Aufnahme hat genau diese Größe, und die Videobilder werden in dieser Größe gerendert. Alle Pixelangaben stehen deshalb im 4K-Raster, die Untertitel in 140 pt. Den Export stellt Johannes selbst ein, die Anweisung erwähnt ihn nicht. Zwei Szenenarten: Johannes im Vollbild und Split-Screen mit einem Bild oben. Bei der Knobelaufgabe laufen alle Szenen als Split-Screen. Kein Freistellen (Green Screen, Chroma Key): vor der schwarzen Wand wird das Ergebnis fleckig.

```
STEP 2: FULLSCREEN AND SPLIT SCREEN, CAPTIONS, AUDIO

Do not cut or change the spoken content any further. The edit from step 1 is final.

FORMAT
Convert the composition to a vertical video, 2160x3840 (9:16). No logo, no watermark, no borders, no emojis anywhere.
The speaker footage is 3840x2160 and plays sideways, because the camera lies on its side. First rotate the speaker layer by 90 degrees CLOCKWISE (to the right) so the person stands upright, head at the top. The rotated layer is 2160x3840: keep it at 100% so it fills the frame exactly. Apply this to every segment of the speaker clip and confirm for each: person upright, no black bars.

LAYOUT
- Speaker scenes: the rotated speaker video fills the full frame. Head in the upper third, no black bars.
- Image scenes (split screen): top half (y 0–1920) shows the top half of the image, full width, aligned to the top. Bottom half (y 1920–3840) the rotated speaker video, scaled to fill the full width, cropped top and bottom. Keep head and shoulders. Eyes at 33–38% of the half's height, measured from the divider down; never lower than 40%. The top of the head may touch the caption line, the face must stay below the captions. Hard edge at y 1920: no line, no border, no rounded corners, no shadow. No cut-out, no Green Screen, no chroma key anywhere.
- Photo, video and screen-recording cutaways: fill the full frame (crop to 9:16, no black bars), no speaker. Static crop only.
- Hard cuts only. No animated zoom, no pan, no transitions.
- Punch-in jump cuts: inside every speaker shot longer than about 4 s, add a hard cut at each sentence end and alternate the crop between 100% and 110% (face stays centered), so the frame changes every 2 to 5 seconds. Apply the same head framing to the 110% crops.
- Nothing important in the top 400px, the bottom 600px or at the right edge (platform overlays).

CAPTIONS
- Burned-in captions for the whole video, centered on the divider at y 1920, in every scene type.
- Font: Manrope, 140 pt, bold, white, with a dark outline.
- One line only, two to three words at a time, never wrapping.
- Highlight the currently spoken word in pink, hex #E90464 (the agentic.schule magenta). All other words stay white.

CAPTION CORRECTIONS (text only, never regenerate audio)
<Schreibweisen, die der Transkriptionsfehler trifft, je Zeile eine>

AUDIO
- Studio Sound at 70% intensity.
- EQ: -4 dB at 50 Hz, -3 dB at 200 Hz, +2 dB at 800 Hz, +3 dB at 3.5 kHz, +2 dB at 10 kHz.
- No reverb. The voice stays dry and close.

THIS VIDEO (scene starts at the first word of each line)
<Szenen: welches Bild ab welchem Satz, Vollbild oder Split-Screen>

After applying, report the start time and layout of each scene.
```

**Die Gain-Werte im EQ-Block gehören in die Anweisung.** Stehen dort nur die Frequenzen, wählt Underlord die Verstärkung selbst und nennt sie erst im Bericht.

**Soll ein dichtes Bild kurz stehen,** gehört die Standzeit in den THIS-VIDEO-Block, zusammen mit dem Verbot, sie zu verlängern: `ONLY for about 2 seconds` und `The images in scenes 4 and 7 are dense on purpose: viewers should have to pause to read them. Do not extend them.`

## Die Drehung nachfassen

Underlord diagnostiziert die seitlich liegende Aufnahme gern als Hochformat mit schwarzen Balken links und rechts („pillarboxed"). Das ist falsch, und darauf aufgebaute Anweisungen führen zu einem verzerrten Bild. Die Gegenanweisung:

```
CORRECTION: the speaker footage is NOT pillarboxed. The camera lies on its side, so the 3840x2160 clip plays sideways.
1. Set the composition to 2160x3840 (9:16 portrait).
2. Rotate the speaker layer by 90 degrees CLOCKWISE (to the right) so the person stands upright, head at the top.
3. The rotated layer is 2160x3840. Keep it at 100% so it fills the frame. No black bars.
4. Apply this to every segment of the speaker clip. Check each segment: person upright, no black bars. Fix any that are not.
```

Steht die Person danach auf dem Kopf, war die Richtung falsch, dann heißt es `COUNTERCLOCKWISE`. Dreht Underlord nur einen Teil der Szenen, wird der Block wiederholt, mit dem Zusatz `Check every segment again and fix any that are still sideways`.

Zuverlässiger ist es, den Rohtake vor Descript zu drehen, dann bleibt für Underlord nichts zu drehen:

```bash
ffmpeg -i take.mp4 -vf "transpose=1" -c:v h264_videotoolbox -b:v 20M -c:a copy take-hochkant.mp4
```

Der Haken dabei: Der Schnitt aus Schritt 1 hängt an der quer liegenden Datei. Ob Descripts „Replace" die Schnitte bei gleicher Länge erhält, ist ungeprüft. Von Hand geht die Drehung auch im Eigenschaftenfeld des Clips, Feld Drehung auf 90.

## Was Underlord nicht leistet

Diese Grenzen meldet Underlord selbst in seinen Berichten. Sie gehören in die Nachkontrolle, nicht in den Prompt.

- **Geschnittene Stellen werden stummgeschaltet, nicht gelöscht.** Sie stehen weiter im Transkript und lassen sich wiederherstellen. Für den Export ist das gleichgültig.
- **Übergänge prüft Underlord nur im Transkript, nicht per Gehör.** Ob eine Naht klingt, hört nur Johannes.
- **Das Layout prüft Underlord in Stichproben,** nach eigener Angabe etwa ein Dutzend Bilder im ganzen Video. Jede Szene selbst ansehen.
- **Die Kopfhöhe im Split-Screen rutscht trotz Vorgabe zu tief.** Nachfassen mit `move my head a bit more upper, in scenes where it's super low`.
- **Füllwort-Erkennung trifft echte Wörter.** „genau" in „wenn man genau nachschaut" ist keins; Underlord fragt in solchen Fällen nach oder behält es.
- **Stille am Anfang und Ende fällt mit den Pausen weg,** ohne dass sie in der Liste steht.

## Descript über MCP

Descript bietet einen MCP-Server unter `https://api.descript.com/v2/mcp` ([Doku](https://help.descript.com/api-and-mcp/mcp)). Er ist hier **nicht eingerichtet**, und das bleibt so, bis Johannes zustimmt. Zwei Punkte sprechen dagegen: Importe und Underlord-Bearbeitungen verbrauchen laut Descript auch über MCP Medienminuten und AI-Credits, und ein fertiges Video lässt sich über die Verbindung nicht herunterladen, ohne es zu veröffentlichen. Der Export bleibt also ohnehin in der App.

## Sonderfall: „Wellis raus"

Nur wenn Johannes „Wellis raus" sagt: Seine Wellensittiche sind im Hintergrund zu hören. Ihre Rufe liegen laut Studien (Tu 2011, Farabaugh 1998) fast ausschließlich bei 2–4 kHz, also im Bereich, der der Stimme ihre Klarheit gibt. Deshalb dort nur sanft absenken und die Klarheit knapp darüber bei 5,5 kHz zurückholen. Ersetzt in Schritt 2 den Block AUDIO:

```
AUDIO
- There are budgies chirping in the background (mainly 2–4 kHz). Keep the voice clear:
- Studio Sound at 85% intensity.
- EQ: cut boominess at 50 Hz and 200 Hz, cut -2 dB at 350 Hz (medium Q) against muddiness, boost warmth at 800 Hz.
- Gentle wide cut of -1.5 dB centered at 3 kHz (wide Q, roughly 2–4 kHz). No presence boost at 3.5 kHz.
- Presence boost of +3 dB at 5.5 kHz (medium Q), above the birds' range.
- Air boost of +2 dB at 10 kHz.
- In the pauses between sentences, where only the birds are audible, lower the background to silence.
- No reverb. The voice stays dry and close.
```

Studio Sound auf 100 % isoliert die Stimme am stärksten, nimmt ihr aber die Klarheit. 85 % mit der Anhebung bei 5,5 kHz ist der Arbeitspunkt. Kommen die Vogelrufe dabei deutlich zurück, geht die 5,5-kHz-Anhebung auf +2 dB.
