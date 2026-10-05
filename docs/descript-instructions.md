# Descript Underlord

Jedes Video entsteht in Descript in zwei Schritten. Die Social-Media-Sitzung schreibt für beide Schritte die Anweisungen an Underlord, Johannes gibt sie in Descript ein.

1. **Schnitt.** Underlord löscht nur wörtlich genannte Stellen aus dem Rohtake: abgebrochene Versuche, Versprecher, Doppelungen. Nichts wird umformuliert oder neu eingesprochen. Underlord meldet danach die neue Länge und jeden Schnitt mit Zeitstempel.
2. **Layout.** Erst wenn der Schnitt passt. Die Aufnahme kommt als 3840×2160 mit dem Hochkant-Bild mittig zwischen schwarzen Balken; die Vorlage skaliert sie randlos ins Hochformat, gedreht wird nichts. Dann: Hochformat, Bilder, Untertitel, Audio. Die Anweisung besteht aus der Vorlage unten plus den Angaben für dieses Video (Szenen, Einblendungen, Korrekturen in den Untertiteln).

## Vorlage Schritt 1: Schnitt

```
EDIT THIS TAKE: cuts only

Language: German. Do not re-record, regenerate or rephrase anything. Only delete the exact passages listed below, at word boundaries. Keep every other word as spoken. Keep natural breathing pauses short (max 0.4 s). Hard jump cuts are fine. Do not change layout, captions, images or audio settings yet.

1. Remove filler words ("ähm", "äh") everywhere.
2. Delete exactly these passages (quoted from the transcript):
   <Liste der Stellen, jeweils wörtlich, mit dem Ergebnis danach>
3. Do not delete anything else. In particular keep:
   <die Sätze, die auf keinen Fall fallen dürfen>
4. After cutting, report the new total duration and list each cut with its timestamp.
```

## Vorlage Schritt 2: Layout

```
STEP 2: VERTICAL LAYOUT, IMAGES, CAPTIONS, AUDIO

Do not cut or change the spoken content any further. The edit from step 1 is final.

FORMAT
Convert the composition to a vertical video, 1080x1920 (9:16). No logo, no watermark, no borders, no emojis anywhere.
The speaker footage is 3840x2160 with the upright portrait image in the center and black pillarbox bars left and right. Do not rotate it. Scale the speaker layer so that its height is exactly 1920 px (about 3413x1920), horizontally centered: the portrait image then fills the full 1080 px width and the bars fall outside the frame. In split-screen scenes use the same centered portrait image, scaled to fill the bottom half and cropped top and bottom. Confirm for every segment: no black bars, person upright.

LAYOUT (same in every scene)
- Top half (y 0–960): the image for this scene. Fill the full width. Keep the important part in the middle of this area, not at the very top (the platform's progress bar sits there).
- Bottom half (y 960–1920): the speaker video. The source is landscape 16:9: crop it to the center (cut left and right), keep head and shoulders, place the face in the upper part of this half. Fill the full width, no black bars.
- Punch-in jump cuts: inside the speaker video, add a hard cut at each sentence end and alternate the crop between 100% and 110% (face stays centered), so the frame changes every 2 to 5 seconds. No animated zoom.
- Divider at y 960: an invisible boundary, NOT a drawn element. No line, no border, no frame, no bar, no shadow between the two halves; the image and the speaker video simply meet there. This is where all text goes. Nothing important in the bottom 300px (platform caption and username cover it) or at the right edge (buttons).

CAPTIONS
- Burned-in captions from the transcript, centered on the divider, for the whole video.
- Font: Manrope, 70 pt, bold, white, with a dark outline or dark background box.
- One line only. Show a few words at a time so the line never wraps.
- Highlight the currently spoken word in pink, hex #E90464 (the agentic.schule magenta). All other words stay white.

AUDIO
- Studio Sound at 70% intensity.
- EQ: cut boominess at 50 Hz and 200 Hz, boost warmth at 800 Hz, presence at 3.5 kHz and air at 10 kHz.
- No reverb. The voice stays dry and close.

THIS VIDEO
<Szenen: welches Bild ab welchem Satz, harte Schnitte, kein Zoom, kein Schwenk>
<Einblendungen auf der Trennlinie, z. B. Hook in den ersten 3 Sekunden, "agentic.schule" in den letzten 5 Sekunden>
<Korrekturen in den Untertiteln>

After applying, report the start time of each scene.
```

## Variante: Wechsel zwischen Vollbild und Split-Screen

Ersetzt in der Vorlage für Schritt 2 den Block LAYOUT; die Untertitel stehen wie dort an der Trennlinie. Kein Freistellen (Green Screen, Chroma Key): vor der schwarzen Wand wird das Ergebnis fleckig.

```
LAYOUT
- Speaker scenes: the speaker video fills the full frame. Head in the upper third, no black bars.
- Image scenes (split screen): top half (y 0–960) the image, full width. Bottom half (y 960–1920) the full speaker video, full width, cropped to fill, face in the upper part of this half. Hard edge at y 960: no line, no border, no rounded corners, no shadow. No cut-out, no Green Screen, no chroma key anywhere.
- Video cutaways: fill the full frame, no speaker.
- Hard cuts only. No animated zoom, no pan, no transitions.
- Punch-in jump cuts: inside every speaker shot longer than about 4 s, add a hard cut at each sentence end and alternate the crop between 100% and 110% (face stays centered), so the frame changes every 2 to 5 seconds.
- Captions for the whole video centered on the divider at y 960, in every scene type.
```
