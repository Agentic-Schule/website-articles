# Descript Underlord

Jedes Video entsteht in Descript in zwei Schritten. Die Social-Media-Sitzung schreibt für beide Schritte die Anweisungen an Underlord, Johannes gibt sie in Descript ein.

1. **Schnitt.** Underlord löscht nur wörtlich genannte Stellen aus dem Rohtake: abgebrochene Versuche, Versprecher, Doppelungen. Nichts wird umformuliert oder neu eingesprochen. Underlord meldet danach die neue Länge und jeden Schnitt mit Zeitstempel.
2. **Layout.** Erst wenn der Schnitt passt. Die Aufnahme kommt als 3840×2160 und liegt auf der Seite (Kamera hochkant); die Vorlage dreht sie zuerst um 90° im Uhrzeigersinn und skaliert sie dann randlos ins Hochformat. Dann: Hochformat, Bilder, Untertitel, Audio. Die Anweisung besteht aus der Vorlage unten plus den Angaben für dieses Video (Szenen, Einblendungen, Korrekturen in den Untertiteln).

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
The speaker footage is 3840x2160 and plays sideways, because the camera lies on its side. First rotate the speaker layer by 90 degrees CLOCKWISE (to the right) so the person stands upright, head at the top. The rotated layer is 2160x3840: scale it to exactly 50% (1080x1920) so it fills the frame. In split-screen scenes use the same rotated layer, scaled to fill the bottom half and cropped top and bottom, framed as described under LAYOUT. Apply this to every segment of the speaker clip and confirm for each: person upright, no black bars.

LAYOUT (same in every scene)
- Top half (y 0–960): the image for this scene. Fill the full width. Keep the important part in the middle of this area, not at the very top (the platform's progress bar sits there).
- Bottom half (y 960–1920): the rotated speaker video (see FORMAT), scaled to fill the full width, cropped top and bottom. Keep head and shoulders. Eyes at about 40–50% of the half's height, head top just below the caption line at the divider (never under the captions). Apply the same framing to the 110% punch-in crops. No black bars.
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
- Image scenes (split screen): top half (y 0–960) the image, full width. Bottom half (y 960–1920) the full speaker video, full width, cropped to fill. Eyes at about 40–50% of the half's height, head top just below the caption line at the divider (never under the captions). Apply the same framing to the 110% punch-in crops. Hard edge at y 960: no line, no border, no rounded corners, no shadow. No cut-out, no Green Screen, no chroma key anywhere.
- Video cutaways: fill the full frame, no speaker.
- Hard cuts only. No animated zoom, no pan, no transitions.
- Punch-in jump cuts: inside every speaker shot longer than about 4 s, add a hard cut at each sentence end and alternate the crop between 100% and 110% (face stays centered), so the frame changes every 2 to 5 seconds.
- Captions for the whole video centered on the divider at y 960, in every scene type.
```
