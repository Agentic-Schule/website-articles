# Banner (Artikel-Header) — Markenvorgaben und Anleitung

Jeder Artikel hat ein Header-Bild im agentic.schule-Look: tiefes Lila-Schwarz, ein Verlauf von Lila nach Magenta, das Logo oben links und rechts eine schlichte, artikel-eigene Illustration. Dieses Dokument beschreibt die Marke und den Weg zu einem fertigen Banner, sodass sich jedes neue Banner von Grund auf bauen lässt. Die knappe Render-Notiz steht auch in der `README.md`; die verbindlichen Farb- und Gestaltungsregeln stehen hier.

## Die Pipeline

Ein Banner entsteht aus einer `header.src.html` im Artikel-Ordner und wird zentral zu einer JPEG gerendert:

```bash
node tools/render-header.mjs blog/<artikel-ordner>
```

- Quelle: `header.src.html`, Bühne **1200×675**, Assets relativ daneben.
- Ergebnis: `header.jpg`, **2400×1350** (JPEG q92, `deviceScaleFactor: 2`).
- Voraussetzung: einmalig `cd tools && npm install` (holt `playwright-core`) und ein installierter Google Chrome.
- Der Renderer wartet auf `networkidle`, lädt also auch per CSS referenzierte Assets (Masken, Schriften). Für den Mac-mini-Artikel gibt es eine Sonderbehandlung: liegt `mac-mini-m4.svg` im Ordner und existiert ein `<div class="mini">`, wird das SVG zur Render-Zeit injiziert.

> **⚠️ Achtung:** Der Site-Build kopiert den kompletten Artikel-Ordner nach `dist/` (nur `README.md` wird entfernt, Bilder werden zu WebP). Die Quelldateien (`header.src.html`, Logo, SVGs) werden also mitveröffentlicht. Das ist harmlos, aber gut zu wissen.

## Markenfarben (CI)

Grundlage ist der Signatur-Verlauf der Website: **tiefes Lila-Schwarz → Lila → Magenta**. Diese Farben gelten verbindlich für alle Banner.

| Rolle | Wert |
| --- | --- |
| Basis dunkel (Verlauf) | `#241a33` → `#1b1525` → `#0d0913` |
| Lila (kräftig) | `#6226B0` |
| Lila hell / mittel | `#9a6cff`, `#b98cff`, `#c3a3ff`, `#7a2ec9` |
| Magenta (Primär-Akzent) | `#E90464` |
| Magenta tief | `#a80248` |
| Kartenfläche auf Dunkel | `#211830` |
| Titel-Akzent-Verlauf | `linear-gradient(92deg,#a06bff 0%,#e90464 100%)` |
| Untertitel | `#c4b8d6` |
| Byline / Byline fett | `#8f84a6` / `#cfc3e6` |

**Farb-Semantik in der Illustration:** Lila steht für das Normale, Neutrale, Erwartbare. Magenta (`#E90464`) markiert den Kern der Sache — die Gefahr, den Bruch, die Pointe des Artikels. Diese Trennung führt das Auge und sollte in jeder Illustration konsequent durchgehalten werden.

**Warme Töne austauschen:** Enthält eine kopierte Vorlage orangene oder braune Farbwerte (z. B. `#d97757` und Verwandte), ersetze sie durch die Werte aus der Tabelle oben. Orange und warme Braun-Schwarz-Töne gehören nicht in die CI.

## Aufbau eines Banners

Feste Bestandteile, gleiche DNA über die ganze Serie:

- **Hintergrund:** der dunkle Verlauf plus zwei radiale Scheine (lila oben rechts, Magenta-Hauch unten links) und ein dezentes, weiches Punkt-Grid.
- **Logo oben links:** `logo-agentic-schule.png`, absolut positioniert mit Abstand zur Ecke (`top:60px; left:78px; height:56px`), nicht in die Ecke geklemmt. Es ersetzt eine frühere Text-Zeile („agentic.schule" in Versalien).
- **Textblock links,** vertikal zentriert: Titel (`h1`, 60px, fett, ein betonter Teil im Lila-Magenta-Verlauf), ein Untertitel-Satz, darunter „von **Johannes Hoppe**".
- **Illustration rechts:** eine schlichte, artikel-eigene SVG (520×675), die das Thema in wenigen Formen erzählt. Kein Stockmaterial, keine Deko.

### Das Logo

- Datei: `docs/logo-agentic-schule.png` (Dunkelgrund-Variante: „Agentic." in Weiß, „Schule" und die A-Marke in Magenta, 550×206). Sie ist für dunkle Hintergründe gemacht und damit die richtige Wahl fürs Banner.
- Für ein neues Banner die Datei aus `docs/` in den Artikel-Ordner kopieren und als `logo-agentic-schule.png` referenzieren.
- Die helle Ecke des Logos ist Weiß; auf dem dunklen Verlauf steht es sauber. Auf keinen hellen Flächen platzieren.

### Ein neues Banner von Grund auf

1. `docs/banner-template.src.html` als `header.src.html` in den Artikel-Ordner kopieren.
2. `docs/logo-agentic-schule.png` in denselben Ordner kopieren.
3. Im Template Titel, betonten Teil (`<span class="accent">`), Untertitel und ggf. die Byline setzen.
4. Die rechte Illustration bauen: eine eigene SVG, die das Thema trägt. Farb-Semantik einhalten (Lila = normal, Magenta = der Punkt). Als Ausgangspunkt dient der Platzhalter im Template.
5. Rendern: `node tools/render-header.mjs blog/<artikel-ordner>`.
6. Das erzeugte `header.jpg` sichten und auf 2400×1350 prüfen.

Im Frontmatter der `README.md` bleibt `header: header.jpg`.

## Fallstricke

- **Assets relativ referenzieren** (`src="logo-agentic-schule.png"`, `mask:url("claude.svg")`), immer aus dem Artikel-Ordner. Absolute Pfade rendern lokal nicht.
- **Titel-Akzent als Verlauf** braucht `-webkit-background-clip:text` und `color:transparent`; ohne beides bleibt der Text unsichtbar oder einfarbig.
- **Bühne exakt 1200×675** halten. Der Renderer schießt genau diesen Ausschnitt; ragt Inhalt hinaus, wird er beschnitten.
- **Warme Farbwerte** in einer kopierten Vorlage (Orange, Braun) vor dem Rendern gegen die CI-Farben oben tauschen, sonst fällt das Banner aus der Reihe.
