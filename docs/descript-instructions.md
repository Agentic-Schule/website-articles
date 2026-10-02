# Descript Underlord

Jedes Video entsteht in Descript in zwei Schritten. Die Social-Media-Sitzung schreibt für beide Schritte die Anweisungen an Underlord, Johannes gibt sie in Descript ein.

1. **Schnitt.** Underlord löscht nur wörtlich genannte Stellen aus dem Rohtake: abgebrochene Versuche, Versprecher, Doppelungen. Nichts wird umformuliert oder neu eingesprochen. Underlord meldet danach die neue Länge und jeden Schnitt mit Zeitstempel.
2. **Layout.** Erst wenn der Schnitt passt: Hochformat, Bilder, Untertitel, Audio. Die Anweisung besteht aus der Vorlage unten plus den Angaben für dieses Video (Szenen, Einblendungen, Korrekturen in den Untertiteln).

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

LAYOUT (same in every scene)
- Top half (y 0–960): the image for this scene. Fill the full width. Keep the important part in the middle of this area, not at the very top (the platform's progress bar sits there).
- Bottom half (y 960–1920): the speaker video. The source is landscape 16:9: crop it to the center (cut left and right), keep head and shoulders, place the face in the upper part of this half. Fill the full width, no black bars.
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
