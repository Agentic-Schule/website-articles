#!/usr/bin/env python3
"""Wandelt den Instagram-Datenexport in die Eingabedatei des Themen-Fundus um.

Aufruf:
    python3 instagram-export-to-posts.py ~/Shots/your_instagram_activity ~/Shots/instagram-posts.json

Der Export liegt als ZIP im JSON-Format vor und enthält die gespeicherten Posts und die
Likes in getrennten Dateien. Beide sind Arrays aus Einträgen mit einem `timestamp` und
einer Liste `label_values`, in der die eigentlichen Angaben unter deutschen Labels stecken:
"URL", "Untertitel" (die Caption), sowie verschachtelte Blöcke für Hashtags und den
Eigentümer des Beitrags.

Zwei Eigenheiten des Exports behandelt dieses Skript:

1. Die Texte sind doppelt kodiert. UTF-8-Bytes stehen als Latin-1-Zeichen in der Datei,
   aus "wäre" wird "wÃ¤re". `repair` dreht das zurück.
2. Ein Anzeigename steht unter dem Label "Name", das an mehreren Stellen vorkommt
   (Hashtags und Eigentümer). Genommen wird der erste Treffer im Eintrag, weil er je nach
   Beitrag entweder den Kanalnamen oder den Namen des Urhebers liefert. Beides taugt als
   Anzeige im Fundus, die Zuordnung erfolgt ohnehin über die URL.
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

SOURCES = [("saved/saved_posts.json", "saved"), ("likes/liked_posts.json", "liked")]

# Captions laufen bis zu mehreren tausend Zeichen. Für Schlagworte und Kernaussage genügt
# der Anfang, und die gebündelte Übergabe an den Fundus-Agenten bleibt handhabbar.
CAPTION_LIMIT = 800


def repair(text):
    """Dreht die doppelte Kodierung des Exports zurück."""
    if not isinstance(text, str):
        return text
    try:
        return text.encode("latin-1").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return text


def first_label(node, label):
    """Erster Wert zu einem Label, egal wie tief er verschachtelt ist."""
    if isinstance(node, dict):
        if node.get("label") == label:
            return node.get("value")
        for value in node.values():
            found = first_label(value, label)
            if found is not None:
                return found
    elif isinstance(node, list):
        for value in node:
            found = first_label(value, label)
            if found is not None:
                return found
    return None


def convert(export_dir, target):
    posts = []
    for relative, source in SOURCES:
        path = export_dir / relative
        if not path.exists():
            print(f"übersprungen, nicht vorhanden: {path}")
            continue
        for entry in json.loads(path.read_text(encoding="utf-8")):
            url = first_label(entry, "URL")
            if not url:
                continue
            posts.append({
                "source": source,
                "date": datetime.fromtimestamp(entry["timestamp"], timezone.utc).strftime("%Y-%m-%d"),
                "url": url,
                "account": repair(first_label(entry, "Name") or ""),
                "caption": repair(first_label(entry, "Untertitel") or "")[:CAPTION_LIMIT],
            })
    # Neueste zuerst, damit der Fundus die aktuellen Themen oben führt. Die Sortierung ist
    # stabil, gleiche Tage behalten die Reihenfolge des Exports (gespeicherte vor gelikten).
    posts.sort(key=lambda p: p["date"], reverse=True)
    target.write_text(json.dumps(posts, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(posts)} Posts nach {target} geschrieben")
    return posts


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    convert(Path(sys.argv[1]).expanduser(), Path(sys.argv[2]).expanduser())
