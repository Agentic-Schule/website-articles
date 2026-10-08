# Descript Underlord

Jedes Video entsteht in Descript in zwei Schritten. Die Social-Media-Sitzung schreibt für beide Schritte die Anweisungen an Underlord, Johannes gibt sie in Descript ein.

1. **Schnitt.** Underlord löscht nur wörtlich genannte Stellen aus dem Rohtake: abgebrochene Versuche, Versprecher, Doppelungen. Nichts wird umformuliert oder neu eingesprochen. Underlord meldet danach die neue Länge und jeden Schnitt mit Zeitstempel.
2. **Layout.** Erst wenn der Schnitt passt. Die Aufnahme kommt als 3840×2160 und liegt auf der Seite (Kamera hochkant); die Vorlage dreht sie zuerst um 90° im Uhrzeigersinn, gedreht hat sie genau 2160×3840. Dann: Hochformat, Bilder, Untertitel, Audio. Die Anweisung besteht aus der Vorlage unten plus den Angaben für dieses Video (Szenen, Einblendungen, Korrekturen in den Untertiteln).

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

Export in 4K hochkant (2160×3840): Die gedrehte Aufnahme hat genau diese Größe, und die Videobilder werden in dieser Größe gerendert. Alle Pixelangaben stehen deshalb im 4K-Raster, die Untertitel in 140 pt. Den Export stellt Johannes selbst ein, die Anweisung erwähnt ihn nicht. Zwei Szenenarten: Johannes im Vollbild und Split-Screen mit einem Bild oben. Bei der Knobelaufgabe laufen alle Szenen als Split-Screen. Kein Freistellen (Green Screen, Chroma Key): vor der schwarzen Wand wird das Ergebnis fleckig.

```
STEP 2: FULLSCREEN AND SPLIT SCREEN, CAPTIONS, AUDIO

Do not cut or change the spoken content any further. The edit from step 1 is final.

FORMAT
Convert the composition to a vertical video, 2160x3840 (9:16). No logo, no watermark, no borders, no emojis anywhere.
The speaker footage is 3840x2160 and plays sideways, because the camera lies on its side. First rotate the speaker layer by 90 degrees CLOCKWISE (to the right) so the person stands upright, head at the top. The rotated layer is 2160x3840: keep it at 100% so it fills the frame exactly. Apply this to every segment of the speaker clip and confirm for each: person upright, no black bars.

LAYOUT
- Speaker scenes: the rotated speaker video fills the full frame. Head in the upper third, no black bars.
- Image scenes (split screen): top half (y 0–1920) the image, full width. Bottom half (y 1920–3840) the rotated speaker video, scaled to fill the full width, cropped top and bottom. Keep head and shoulders. Eyes at 33–38% of the half's height, measured from the divider down; never lower than 40%. The top of the head may touch the caption line, the face must stay below the captions. Hard edge at y 1920: no line, no border, no rounded corners, no shadow. No cut-out, no Green Screen, no chroma key anywhere.
- Photo and video cutaways: fill the full frame (crop to 9:16, no black bars), no speaker. Static crop only.
- Hard cuts only. No animated zoom, no pan, no transitions.
- Punch-in jump cuts: inside every speaker shot longer than about 4 s, add a hard cut at each sentence end and alternate the crop between 100% and 110% (face stays centered), so the frame changes every 2 to 5 seconds. Apply the same head framing to the 110% crops.
- Nothing important in the top 400px, the bottom 600px or at the right edge (platform overlays).

CAPTIONS
- Burned-in captions for the whole video, centered on the divider at y 1920, in every scene type.
- Font: Manrope, 140 pt, bold, white, with a dark outline.
- One line only, two to three words at a time, never wrapping.
- Highlight the currently spoken word in pink, hex #E90464 (the agentic.schule magenta). All other words stay white.

AUDIO
- Studio Sound at 70% intensity.
- EQ: cut boominess at 50 Hz and 200 Hz, boost warmth at 800 Hz, presence at 3.5 kHz and air at 10 kHz.
- No reverb. The voice stays dry and close.

THIS VIDEO (scene starts at the first word of each line)
<Szenen: welches Bild ab welchem Satz, Vollbild oder Split-Screen>
<Korrekturen in den Untertiteln>

After applying, report the start time and layout of each scene.
```

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
