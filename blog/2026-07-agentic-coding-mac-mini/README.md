---
title: 'Agentic Coding rund um die Uhr: Der Mac mini als Bodenstation'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-07-23
keywords:
  - Agentic Coding
  - AI Agent
  - KI-Agent
  - Claude Code
  - Mac mini
  - Always-on
  - tmux
  - mosh
  - Syncthing
  - colima
  - nginx
  - Remote Development
  - Homelab
language: de
header: header.jpg
---

Agentische KI-Agenten arbeiten anders als ein Chatfenster: Man gibt die Richtung vor, und der Agent liest Code, schreibt Dateien, führt Tests aus und plant selbstständig die nächsten Schritte. Solche Läufe dauern – Minuten, manchmal Stunden. Und genau da beißt sich das mit einem Laptop, den man zuklappt, ins Café trägt oder im Zug in den Ruhemodus schickt.

**Ich habe deshalb einen alten Mac mini zur „Bodenstation" umgebaut: eine immer laufende Maschine, auf der meine Agenten weiterarbeiten – während ich vom MacBook, aus dem Browser oder sogar vom Handy aus zusehe und eingreife.** Dieser Artikel zeigt die Idee, die Bausteine und – in How-to-Kästen – wie man sie selbst nachbaut.

> 🛰️ Der Spitzname für das Setup war schnell gefunden: *Ground Control to Major Tom*. Der Mac mini ist die Bodenstation, das MacBook der mobile Späher, der andockt und wieder abhebt.

## Inhalt

[[toc]]

## Das Problem: Agenten wollen laufen, ich will weg

Ein typischer Ablauf beim Agentic Coding: Ich beschreibe ein Refactoring, der Agent legt los, arbeitet eine Aufgabenliste ab, lässt Tests laufen, korrigiert sich selbst. Das ist großartig – solange die Maschine an bleibt und die Session lebt.

Auf dem Laptop passiert aber Folgendes:

- Ich klappe ihn zu → der Prozess schläft ein, der Agent friert mitten im Lauf ein.
- Ich wechsle das WLAN (Büro → Bahn → Zuhause) → die SSH-Verbindung reißt, das Terminal ist tot.
- Ich will abends vom Sofa aus nur *kurz* nachsehen, wie weit er ist – und müsste den Laptop wieder hochfahren.

Die Lösung ist konzeptionell simpel: **Der Agent läuft nicht auf dem Gerät in meiner Hand, sondern auf einer Maschine, die nie ausgeht.** Das Gerät in meiner Hand ist nur noch ein Fenster darauf.

## Die Architektur: Bodenstation und mobiler Spiegel

Zwei Maschinen, ein gemeinsamer Nenner:

| | **Bodenstation** | **mobiler Spiegel** |
|---|---|---|
| Gerät | Mac mini (Apple Silicon), always-on | MacBook (Apple Silicon) |
| Rolle | Hauptmaschine, hier laufen die Agenten | Späher, dockt von überall an |
| Benutzer | derselbe Account, dasselbe Home | derselbe Account, dasselbe Home |

Der entscheidende Trick: **Beide Rechner nutzen denselben Benutzernamen und damit dasselbe Home-Verzeichnis `/Users/<name>`.** Alle Pfade, alle Repos, alle Keys – und, wie wir gleich sehen, alle Agenten-Sessions – liegen auf beiden Maschinen unter identischen Pfaden. Das macht den Übergang nahtlos: Was auf dem mini gilt, gilt eins zu eins auf dem MacBook.

Der mini steht im Regal, ohne Monitor, ohne Tastatur. Erreichbar ist er nur übers Netzwerk. Das klingt nach Einschränkung, ist aber der halbe Trick: Was headless läuft, läuft auch, wenn niemand eingeloggt ist.

## Sessions, die Verbindungsabbrüche überleben

Das Fundament ist **tmux**, ein Terminal-Multiplexer. Statt meine Programme direkt in der SSH-Sitzung zu starten, laufen sie *innerhalb* von tmux auf dem mini. Reißt die Verbindung, läuft tmux – und alles darin – einfach weiter. Beim nächsten Andocken hänge ich mich wieder an, als wäre nichts gewesen.

Zwei Dinge machen das komfortabel:

- **Auto-attach beim Login:** Jede interaktive Anmeldung landet automatisch in derselben Session (`main`). Ich muss nichts von Hand starten.
- **`tmux-continuum`** speichert das Layout alle 15 Minuten und stellt es nach einem Reboot wieder her.

Wichtig zu verstehen: tmux rettet die **Verbindung**, nicht den Strom. Ein Reboot beendet die laufenden Prozesse trotzdem – aber das Layout und die Fenster kommen zurück, und die Agenten-Session lässt sich fortsetzen (dazu gleich mehr).

> **🛠️ Selbst nachbauen — Auto-attach in `~/.zshrc`**
> ```bash
> # Beim interaktiven Login automatisch in die tmux-Session 'main'
> if [[ -z "$TMUX" && -n "$SSH_CONNECTION" ]]; then
>   tmux attach -t main 2>/dev/null || tmux new -s main
> fi
> ```
> Der wichtigste Reflex danach: mit **`Ctrl-b d`** *detachen* (läuft weiter!), **nie mit `exit`** raus – das killt das Fenster.

## Andocken von überall – bis hin zum Handy

Für den Zugriff nutze ich zwei Ebenen:

- **SSH** im heimischen Netz und über das VPN des Routers (die meisten Consumer-Router können WireGuard). Key-Auth, kein Passwort.
- **mosh** (Mobile Shell) für unterwegs. mosh ist das bessere SSH im Zug: Es übersteht Verbindungswechsel und Latenz, ohne dass die Sitzung einfriert. Netz weg, Netz wieder da – mosh macht einfach weiter.

Und die Kür: **Vom Handy.** Auf Android läuft die Terminal-App *Termux*, darin mosh, darin tmux, darin der Agent. So kann ich auf dem Bahnsteig einen Blick auf einen laufenden Refactoring-Agenten werfen – oder ihm eine Rückfrage beantworten.

> **🛠️ Selbst nachbauen — bequemer SSH-Alias + mosh**
> In `~/.ssh/config` einen Kurznamen anlegen, dann tippt man nur noch `ssh mini`:
> ```ssh-config
> Host mini
>   HostName mac-mini.fritz.box   # oder die feste LAN-IP
>   User deinbenutzer
> ```
> Von unterwegs erst das Router-VPN (WireGuard) aktivieren, dann:
> ```bash
> mosh mini
> ```

> **📱 Handy-Kniff (Termux):** Termux hat keine Strg-Taste. Sie liegt auf **Leiser (Volume-Down)** – also `Vol-Down + C` für `Ctrl-C`, `Vol-Down + R` für `Ctrl-R`. Die Extra-Tastenzeile (ESC/CTRL/TAB/Pfeile) blendet man mit einem Wisch nach oben ein.

## Alles doppelt, immer synchron

Bis hierher könnte ich von überall auf den mini *zugreifen*. Der eigentliche Clou ist aber, dass mein MacBook kein bloßes Terminal ist, sondern ein **echter Spiegel**: Es hat dieselben Dateien und kann jederzeit die Arbeit des mini übernehmen – auch offline.

Dafür sorgt **Syncthing**, ein Peer-to-Peer-Sync ohne Cloud dazwischen. Es spiegelt bidirektional:

- `~/Work` – alle Projekte und Repos
- `~/.claude` – **und hier wird es spannend: die Agenten-Sessions selbst.** Claude Code legt seine Gesprächsprotokolle unter `~/.claude/projects/` ab. Werden die mitgesynct, kann ich eine Session, die ich auf dem mini begonnen habe, auf dem MacBook fortsetzen – Kontext, Verlauf, alles da.
- `~/Shots` – Screenshots (praktisch, gleich mehr dazu)

Gesynct wird **Quellcode, keine Artefakte.** `node_modules`, `dist`, `build`, `target` und Caches stehen in `.stignore` und werden pro Maschine neu gebaut (`npm ci`, `cargo build`). Kompilierte Binaries über Rechner zu kopieren bricht sowieso irgendwann am Library-Linking – lieber sauber neu bauen.

> **🛠️ Selbst nachbauen — Artefakte vom Sync ausschließen (`.stignore`)**
> ```gitignore
> node_modules
> dist
> build
> target
> .angular
> .next
> // Caches nach Bedarf ergänzen
> ```
> Faustregel: Was ein `npm ci` oder `cargo build` in Sekunden wiederherstellt, gehört nicht in den Sync.

**Der Screenshot-Trick als Bonus:** Weil beide Macs dasselbe Home haben, liegt ein Screenshot unter demselben Pfad auf *beiden* Rechnern. Ich stelle den macOS-Screenshot-Ordner auf `~/Shots` (`defaults write com.apple.screencapture location ~/Shots`), mache am MacBook einen Screenshot und ziehe ihn in eine **remote** laufende Agenten-Session auf dem mini. Der Pfad existiert dort dank Sync ebenfalls – der Agent liest das Bild, obwohl es „auf dem anderen Rechner" entstand.

> **⚠️ Die eine Disziplin:** Vor dem Gerätewechsel „auf grün warten". Wechselt man die Maschine, während Syncthing noch überträgt, riskiert man Konfliktdateien. Kurz prüfen, dass der Sync `idle` ist – dann ist der Übergang sauber.

## Headless-Dienste, die einfach laufen

Ein Agent ist nur so gut wie die Umgebung, in der er arbeiten darf. Auf dem mini soll er einen **vollständigen Dev-Stack** vorfinden – Datenbank, Docker, Browser – und zwar ohne dass sich jemand am Bildschirm anmeldet. Denn der mini hat gar keinen angemeldeten Desktop.

Drei Bausteine:

**FileVault mit Remote-Entsperrung.** Die Platte ist verschlüsselt (soll sie auch sein). Nach einem Neustart hängt der mini im Pre-Boot-Lock, bevor überhaupt Netzwerk da ist. Der Kniff: Ein zweiter Admin-Benutzer mit „SecureToken" darf die Platte per SSH entsperren – danach bootet der mini durch und alle Dienste starten. Für geplante Neustarts gibt es sogar `sudo fdesetup authrestart`: entsperrt beim Reboot automatisch, ohne sich auszusperren. Und `pmset autorestart 1` sorgt dafür, dass der mini nach einem Stromausfall von selbst wieder hochkommt.

**Docker ohne Docker Desktop.** Docker Desktop braucht einen GUI-Login – auf einer headless Maschine ein K.-o.-Kriterium. Stattdessen läuft **colima** als System-Dienst (LaunchDaemon), der schon beim Booten startet. Unter der Haube dieselbe Technik wie Docker Desktop (Apples Virtualization.framework), mit Rosetta für amd64-Images. So bekommt der Agent ein `docker` und `docker compose`, das einfach da ist.

**Ein echter Browser für den Agenten.** Über einen headless Playwright-MCP-Server kann der Agent eine echte Chrome-Instanz fahren – Seiten öffnen, klicken, Formulare ausfüllen, Screenshots machen. „Headless" heißt hier: kein sichtbares Fenster, kein GPU-/Display-Kontext nötig (`--disable-gpu`), damit es auf der monitorlosen Kiste stabil läuft.

> **🛠️ Selbst nachbauen — colima als Autostart-Dienst**
> Einmalig die VM anlegen (schlank halten reicht für die meisten Fälle):
> ```bash
> colima start --vm-type vz --vz-rosetta --cpu 6 --memory 4 --disk 60
> ```
> Damit sie beim Boot ohne Login hochkommt, einen LaunchDaemon unter `/Library/LaunchDaemons/` einrichten, der `colima start` als dein Benutzer ausführt. Container mit `restart: always` in der `docker-compose.yml` starten dann automatisch mit.

> **🛠️ Selbst nachbauen — headless Playwright-MCP für Claude Code**
> ```bash
> claude mcp add playwright --scope user -- \
>   npx @playwright/mcp@latest --headless --browser chrome --isolated
> ```
> `--headless` = kein GUI nötig · `--browser chrome` = nutzt den installierten System-Chrome · `--isolated` = frisches Profil je Lauf. Auf einer monitorlosen Maschine zusätzlich `--disable-gpu` (via Config-Datei), sonst kann Chrome beim Start am fehlenden Display-Kontext scheitern.

## Die Arbeit des Agenten im Browser ansehen

Der Agent hat das Frontend umgebaut – jetzt will ich es *sehen*, in einem echten Browser, von meinem Laptop oder Handy aus. Der Dev-Server läuft aber auf dem mini und lauscht dort brav nur auf `localhost`.

Meine Lösung ist ein **nginx-Reverse-Proxy** auf dem mini, der genau ein Problem elegant löst: Er macht jeden lokalen Dev-Server im Netz sichtbar – **ohne pro Projekt etwas zu konfigurieren.** nginx bindet die LAN-IP des mini und schreibt den `Host`-Header auf `localhost` um. Dadurch greifen die Host-Prüfungen moderner Dev-Server (Angular, Vite) nicht, und ich muss weder `--host 0.0.0.0` setzen noch an `allowedHosts` herumschrauben. Im Browser tippe ich einfach `http://mac-mini.fritz.box:4200` – fertig.

> **🛠️ Selbst nachbauen — nginx-Dev-Proxy (Kern)**
> ```nginx
> server {
>   listen 192.168.178.50:4200;     # LAN-IP des mini : Dev-Port
>   location / {
>     proxy_pass http://127.0.0.1:$server_port$request_uri;
>     proxy_set_header Host localhost:$server_port;   # <- entscheidend: 'localhost', nicht die IP!
>     proxy_http_version 1.1;
>     proxy_set_header Upgrade $http_upgrade;         # HMR-WebSockets
>     proxy_set_header Connection upgrade;
>     # Fallback für Dev-Server, die nur auf IPv6 (::1) lauschen (Node 24 / Angular 22):
>     proxy_intercept_errors on;
>     error_page 502 504 = @ipv6;
>   }
>   location @ipv6 { proxy_pass http://[::1]:$server_port$request_uri; proxy_set_header Host localhost:$server_port; }
> }
> ```
> Zwei Fallen aus der Praxis: Es muss **`localhost`** im Host-Header stehen (Vite lehnt die nackte IP mit HTTP 400 ab), und neuere Dev-Server binden `localhost` manchmal nur auf IPv6 (`::1`) – daher der `@ipv6`-Fallback.

Manche Apps rufen ihr Backend allerdings **fest auf `http://localhost:PORT`** – aus dem Browser heraus zeigt „localhost" dann auf *mein Gerät*, nicht auf den mini, und die API-Calls laufen ins Leere. Für diesen Sonderfall gibt es keinen Proxy-Zauber, aber einen sauberen Trick: einen SSH-Tunnel, der die betreffenden Ports auf den mini spiegelt. Dann stimmt die `localhost`-Annahme der App wieder.

> **🛠️ Selbst nachbauen — App mit hartcodiertem `localhost`-Backend**
> ```bash
> # Frontend (4200) UND Backend (5001) auf den mini tunneln, dann per localhost öffnen
> ssh -N -L 4200:localhost:4200 -L 5001:localhost:5001 mini
> # Browser: http://localhost:4200  (nicht die Hostname-Variante)
> ```
> Aus Sicht des Browsers ist dann alles `localhost` – genau wie es die App erwartet.

## Ein Tag mit der Bodenstation

Wie fühlt sich das im Alltag an? Ungefähr so:

**Morgens am Schreibtisch.** Ich docke vom MacBook per `ssh mini` an, lande in tmux, starte in einem Projekt einen Agenten mit einer größeren Aufgabe – sagen wir, eine Testabdeckung nachziehen. Er legt los.

**Mittags unterwegs.** Ich klappe das MacBook zu und fahre los. Der Agent? Läuft weiter – er sitzt ja auf dem mini, nicht im Laptop. In der Bahn hole ich das Handy raus, `mosh mini`, hänge mich an dieselbe tmux-Session und sehe: Er hat drei von fünf Modulen durch und wartet auf eine Entscheidung. Ich beantworte die Rückfrage mit dem Daumen, er macht weiter.

**Nachmittags im Café.** Das MacBook ist wieder auf, dank Sync sind alle Dateien und die Session-Historie auf dem aktuellen Stand. Ich öffne das umgebaute Frontend im Browser über den Dev-Proxy und schaue es mir an – auf dem echten Bildschirm, nicht im Terminal.

**Abends auf dem Sofa.** Kurzer Blick vom Handy, ob die CI durch ist. Ist sie. Merge.

Kein einziges Mal musste der Agent „von vorne anfangen". Kein zugeklappter Deckel hat ihn gekillt. Das ist der eigentliche Gewinn: **Die Arbeit ist entkoppelt vom Gerät in meiner Hand.**

## Fazit: Lohnt sich das?

Ein alter Mac mini, ein bisschen Unix-Handwerk – und plötzlich hat man eine persönliche, immer laufende Basis für agentisches Arbeiten, die man von überall bedient. Die Bausteine sind alle Standard und quelloffen: tmux, mosh, Syncthing, colima, nginx. Nichts davon ist exotisch; das Besondere ist die Kombination.

Ehrlich bleiben will ich auch:

- **Es braucht Pflege.** Headless-Betrieb, FileVault-Remote-Unlock, Autostart-Dienste – das ist einmal Einrichtungsaufwand und gelegentlich Debugging.
- **Sicherheit ist Pflicht, kein Bonus.** Zugriff ausschließlich übers VPN, Key-Auth, FileVault an. Ein always-on Rechner ist nur so vertrauenswürdig wie sein Zugang.
- **Reboots kosten laufende Prozesse.** tmux rettet das Layout, nicht den Zustand mitten im Lauf. Für lange Läufe plane ich Neustarts entsprechend.

Für mich überwiegt der Gewinn deutlich: Agenten, die weiterarbeiten, während ich lebe, mich bewege, das Gerät wechsle. Die Bodenstation steht, der Späher dockt an und ab. *Ground Control to Major Tom* – und der Bodenkontakt reißt nie ab.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
