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

Agentic Coding funktioniert anders als ein Chatfenster: Man gibt die Richtung vor, und der Agent liest Code, schreibt Dateien, führt Tests aus und plant selbstständig die nächsten Schritte. Solche Läufe dauern – Minuten, manchmal Stunden. Und genau da beißt sich das mit einem Laptop, den man zuklappt, ins Café trägt oder im Zug in den Ruhemodus schickt.

**Ich habe deshalb einen Mac mini zur „Bodenstation" umgebaut: eine immer laufende Maschine, auf der meine Agenten weiterarbeiten – während ich vom MacBook, aus dem Browser oder sogar vom Handy aus zusehe und eingreife.**

Ehrlich gesagt stand die Kiste zunächst aus einem ganz anderen Grund im Regal: ein aktueller Mac mini M4 mit 32 GB, den ich mir eigentlich für den **Clawdbot**-Hype (heute *OpenClaw*) geholt hatte – den eigenen Agenten per **Signal** vom Handy steuern, das hatte was. Cool war es genau so lange, wie diese Fernsteuerung der eigentliche Reiz war. Seit Claude Code das mit **`/remote-control`** von Haus aus kann, hat der Clawdbot für mich viel von seinem Charme verloren, und der mini langweilte sich ohnehin ein wenig (dazu vielleicht ein andermal mehr). Also bekam er eine neue, dauerhafte Aufgabe.

Dieser Artikel zeigt die Idee, die Bausteine und – in How-to-Kästen – wie man sie selbst nachbaut.

> 🛰️ Der Spitzname für das Setup war schnell gefunden: *Ground Control to Major Tom*. Der Mac mini ist die Bodenstation, das MacBook die mobile Rakete, die andockt und wieder abhebt.

## Inhalt

[[toc]]

## Das Problem: Agenten wollen laufen, ich will weg

Ein typischer Ablauf beim Agentic Coding: Ich beschreibe ein Refactoring, der Agent legt los, arbeitet eine Aufgabenliste ab, lässt Tests laufen, korrigiert sich selbst. Das ist großartig – solange die Maschine an bleibt und die Session lebt.

Auf dem Laptop passiert aber Folgendes:

- Ich klappe ihn zu → der Prozess schläft ein, der Agent friert mitten im Lauf ein.
- Ich will abends vom Sofa aus nur *kurz* nachsehen, wie weit er ist – und müsste den Laptop wieder hochfahren.

Das erste Problem lässt sich mit `caffeinate -s` umgehen: Der Laptop bleibt einfach an, auch wenn der Deckel zugeklappt ist und keine Stromversorgung angeschlossen ist. Genau so habe ich im Winter und Frühling gearbeitet. Bei sommerlichen Temperaturen wird die Kiste dabei aber schnell viel zu heiß – und ich möchte sie ja noch eine ganze Weile behalten. Ein Laptop, der monatelang durchheizt, ist keine gute Dauerlösung.

Dazu kommt ein Muster, das ich an mir selbst beobachte: Meine besten Ideen habe ich selten am Schreibtisch, sondern unterwegs – beim Gassigehen zum Beispiel. Genau dann will ich dem Agenten kurz etwas zurufen oder nachsehen können, wie er vorankommt, ohne erst nach Hause an den Laptop zurückzukehren.

Die Lösung ist konzeptionell simpel: **Der Agent läuft nicht auf dem Gerät in meiner Nähe, sondern auf einer dedizierten Maschine, die nie ausgeht und immer an ist.** Das Gerät in meiner Hand ist nur noch ein Fenster darauf.

Das hat Claude Code (und andere Tools) im Prinzip schon gut gelöst: Remote Control per Handy. Aber mir reicht das nicht.

Welches Gerät dieses Fenster ist, wird damit zur Nebensache: das große 16-Zoll-MacBook Pro am Schreibtisch, das kleine MacBook für die Herrenhandtasche (auf Konferenzen einen Riesen-Rechner herumschleppen ist uncool) oder das Handy. Ich will flexibel bleiben – und die Bodenstation bleibt dabei immer dieselbe.

## Die Architektur: Bodenstation und mobiler Spiegel

Zwei Maschinen, ein gemeinsamer Nenner:

| | **Bodenstation** | **mobiler Spiegel** |
|---|---|---|
| Gerät | Mac mini (Apple Silicon), always-on | MacBook Pro 16″ (Apple Silicon) |
| Rolle | Hauptmaschine, hier laufen die Agenten | Rakete, dockt von überall an |
| Benutzer | derselbe Account, dasselbe Home | derselbe Account, dasselbe Home |

Der entscheidende Trick: **Beide Rechner nutzen denselben Benutzernamen und damit dasselbe Home-Verzeichnis `/Users/<name>`.** Alle Pfade, alle Repos, alle Keys – und, wie wir gleich sehen, alle Agenten-Sessions – liegen auf beiden Maschinen unter identischen Pfaden. Das macht den Übergang nahtlos: Was auf dem mini gilt, gilt eins zu eins auf dem MacBook Pro.

Streng genommen kommt eine dritte Rolle dazu: **Geräte, die nur als Terminal arbeiten** – kein eigenes Dev-Environment, keine Datenkopie, nur ein Fenster in die Bodenstation. Das ist einerseits das Handy (per Termux), andererseits ein kleines MacBook, das ich ausschließlich zum Reinmoshen dabeihabe – ich nenne es schlicht **„Mac Terminal"**. Voller Spiegel ist damit nur das große MacBook Pro: Es kann beides – eigenständig arbeiten *oder* bloß als Fenster dienen. Alles andere ist reines Terminal.

Der mini steht ohne Monitor und ohne Tastatur bei meiner übrigen Haustechnik – neben NAS, Fritzbox, dem dicken Switch und dem ganzen Kabelsalat, den man sonst so im Netz hängen hat. Erreichbar ist er nur übers Netzwerk. Das klingt nach Einschränkung, ist aber der halbe Trick: Was headless läuft, läuft auch, wenn niemand eingeloggt ist.

## Sessions, die Verbindungsabbrüche überleben

Der Umzug auf eine entfernte Maschine handelt sich allerdings ein Problem ein, das es lokal nie gab: Die Verbindung dorthin kann abreißen – ein WLAN-Wechsel (Büro → Bahn → Zuhause) genügt, und ein normales SSH-Terminal ist tot. Die Antwort darauf ist **tmux**, ein Terminal-Multiplexer. Statt meine Programme direkt in der SSH-Sitzung zu starten, laufen sie *innerhalb* von tmux auf dem mini. Reißt die Verbindung, läuft tmux – und alles darin – einfach weiter. Beim nächsten Andocken hänge ich mich wieder an, als wäre nichts gewesen. Ehrlich gesagt ist **tmux der Gamechanger** in diesem Setup – erst dadurch überstehen die Agentenläufe alles, was zwischen mir und dem mini passieren kann.

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

Für den Zugriff setze ich durchgehend auf **mosh** (Mobile Shell) – zu Hause wie unterwegs, immer derselbe Befehl. So muss ich nie zwischen `ssh` und `mosh` überlegen oder umschalten.

Und mosh ist wirklich großartig. Es ist das bessere SSH für alles, was nicht am festen Kabel hängt: Wechselt das Netz oder bricht es kurz weg, lebt die Verbindung **roaming-fest** weiter – kein eingefrorenes Terminal, kein „broken pipe". Getippte Zeichen erscheinen sofort per lokalem Echo, auch bei mieser Latenz im ICE. Netz weg, Netz wieder da – mosh macht ohne Neuverbinden einfach weiter. Unterbau ist ein ganz normaler SSH-Login mit Key-Auth, kein Passwort.

Und wie kommt das Handy von unterwegs überhaupt an die Kiste zu Hause? Angefangen habe ich mit dem **WireGuard**-VPN der Fritzbox, inzwischen läuft alles über **Tailscale** (ein Mesh-VPN auf WireGuard-Basis). Der Grund: Tailscale kommt auch mit **IPv6** und ständig wechselnden Anschlüssen bestens klar – du erreichst die Bodenstation zuverlässig, egal aus welchem Netz. Man kommt wirklich immer nach Hause.

Und die Kür: **Vom Handy.** Auf Android läuft die Terminal-App *Termux*, darin mosh, darin tmux, darin der Agent. Damit komme ich notfalls von überall an die rohe Session heran.

Diesen direkten Terminal-Weg nutze ich aber selten. Meist arbeite ich auf dem Handy bequemer über die **Remote-Control-Funktion der Claude-App**. Bis man drin ist, gehört ein kleines Ritual dazu: ein neues tmux-Fenster öffnen (`Ctrl-b c`), `claude` starten, mit `/rc` die Remote-Steuerung freigeben und die Session mit `/rename` benennen – *dann* erst wechsle ich in die App und tippe dort weiter. Beim ersten Mal fummelig, aber man gewöhnt sich dran.

> **🛠️ Selbst nachbauen — ein Kurzname, immer mosh**
> In `~/.ssh/config` einen Alias anlegen (mosh nutzt ihn genauso wie ssh):
> ```ssh-config
> Host mini
>   HostName mini    # LAN-Name oder der Tailscale-Name des mini
>   User deinbenutzer
> ```
> Dann genügt von überall derselbe Befehl:
> ```bash
> mosh mini
> ```
> Von außen sorgt ein Mesh-VPN wie **Tailscale** dafür, dass `mini` immer erreichbar ist – auch über IPv6.

> **📱 Handy-Kniff (Termux):** Termux hat keine Strg-Taste. Sie liegt auf **Leiser (Volume-Down)** – also `Vol-Down + C` für `Ctrl-C`, `Vol-Down + R` für `Ctrl-R`. Die Extra-Tastenzeile (ESC/CTRL/TAB/Pfeile) blendet man mit einem Wisch nach oben ein. Dankt mir später! 😄

## Alles doppelt, immer synchron

Bis hierher könnte ich von überall auf den mini *zugreifen*. Der eigentliche Clou ist aber, dass mein großes MacBook Pro kein bloßes Terminal ist, sondern ein **echter Spiegel**: Es hat dieselben Dateien und kann jederzeit die Arbeit des mini übernehmen – auch offline. Warum mir das so wichtig ist? Bei einem kompletten Stromausfall will ich nicht mit heruntergelassenen Hosen dastehen – großer Mac und mini sind ja immer synchron. Ganz nebenbei ist dieser Spiegel ein permanentes, sekundenscharfes Backup. Geiler Scheiß.

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

**FileVault mit Remote-Entsperrung.** Die Platte ist verschlüsselt (soll sie auch sein). Nach einem Neustart hängt der mini im Pre-Boot-Lock, bevor überhaupt Netzwerk da ist. Der Kniff: Ein zweiter Admin-Benutzer mit „SecureToken" darf die Platte per SSH entsperren – danach bootet der mini durch und alle Dienste starten. Für geplante Neustarts gibt es sogar `sudo fdesetup authrestart`: entsperrt beim Reboot automatisch, ohne sich auszusperren. Und `pmset autorestart 1` sorgt dafür, dass der mini nach einem Stromausfall von selbst wieder hochkommt. Für den allergrößten Notfall hängt außerdem ein **JetKVM** an der Kiste – ein kleines KVM-over-IP-Gerät, das mir Bild und Tastatur aus der Ferne gibt, bis hinunter zum Firmware-/Boot-Bildschirm. Selbst wenn kein Betriebssystem mehr läuft oder ein Reboot am Pre-Boot-Lock hängt, komme ich also noch dran. Unterm Strich hat der Rechner mehrere gestaffelte Rettungslinien, damit ich ihn *immer* wieder angebunden bekomme – und trotzdem bleibt alles verschlüsselt, jedes einzelne meiner Geräte.

**Docker ohne Docker Desktop.** Docker Desktop braucht einen GUI-Login – auf einer headless Maschine ein K.-o.-Kriterium. Stattdessen läuft **colima** als System-Dienst (LaunchDaemon), der schon beim Booten startet. Unter der Haube dieselbe Technik wie Docker Desktop (Apples Virtualization.framework), mit Rosetta für **Intel-Images** – also für den ollen SQL Server, der leider nie nach ARM portiert wurde. Danke, Microsoft. So bekommt der Agent ein `docker` und `docker compose`, das einfach da ist.

**Ein echter Browser für den Agenten.** Über einen selbstgebastelten headless Playwright-MCP-Server kann der Agent eine echte Chrome-Instanz fahren – Seiten öffnen, klicken, Formulare ausfüllen, Screenshots machen. „Headless" heißt hier: kein sichtbares Fenster, kein GPU-/Display-Kontext nötig (`--disable-gpu`), damit es auf der monitorlosen Kiste stabil läuft.

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

**Morgens am Schreibtisch.** Ich docke vom MacBook per `mosh mini` an, lande in tmux, starte in einem Projekt einen Agenten mit einer größeren Aufgabe – sagen wir, eine Testabdeckung nachziehen. Er legt los. Am großen Monitor arbeite ich übrigens immer noch am liebsten: Die Diffs, die Claude Code ständig zeigt, geben einen guten Überblick, was gerade passiert – man hat das Gefühl, die Kontrolle zu behalten.

**Mittags unterwegs.** Ich klappe das MacBook zu und fahre los. Der Agent? Läuft weiter – er sitzt ja auf dem mini, nicht im Laptop. In der Bahn hole ich das Handy raus, öffne die **Claude-App** und arbeite auf dem kleinen Bildschirm weiter: Der Agent hat drei von fünf Modulen durch und wartet auf eine Entscheidung – ich beantworte die Rückfrage mit dem Daumen, er macht weiter. Das Kontrollgefühl ist hier geringer, für die Diff-Ansicht muss man eigens drauftippen, aber irgendeinen Tod muss man sterben.

**Nachmittags im Café.** Das MacBook ist wieder auf, dank Sync sind alle Dateien und die Session-Historie auf dem aktuellen Stand. Ich öffne das umgebaute Frontend im Browser über den Dev-Proxy und schaue es mir an – auf dem echten Bildschirm, nicht im Terminal. Kleiner Scherz: Ich bin doch nicht im Café wie so ein AI-Influencer. Ich sitze längst wieder im Keller – dort ist es schön kühl, und ich habe drei Monitore.

**Abends auf dem Sofa.** Kurzer Blick vom Handy, ob die CI durch ist. Ist sie. Merge.

Kein einziges Mal musste der Agent „von vorne anfangen". Kein zugeklappter Deckel hat ihn gekillt. Das ist der eigentliche Gewinn: **Die Arbeit ist entkoppelt vom Gerät in meiner Hand.**

Das war ein bewusst vereinfachtes Beispiel. Die eigentliche Arbeit beginnt nämlich erst bei **vielen parallelen Sessions** mit ebenso vielen parallelen **git-worktrees**. Weil ein Frontier-Modell mit all seinen Unter-Agenten verdammt langsam sein kann (Kommandos wie `/simplify` oder `/code-review` mit ordentlich `/effort` laufen schon mal absurd lange), parallelisiert man fast zwangsläufig. Der ständige Context-Switch und der Mental Load dabei sind nicht zu unterschätzen – aber das hat mit dem Setup nichts zu tun, das hätte man auf einem einzelnen Rechner genauso.

## Ein Prinzip: Erzähl den Agenten nie vom rosa Elefanten

Ein Kniff, der sich mit der Zeit herausgeschält hat: Ich halte **genau eine** Session, die das ganze Setup kennt – meine *Ground-Control-Session*. Sie hilft bei Problemen, nimmt die Meldungen der anderen Sessions entgegen (etwa wenn wirklich mal etwas durch den Wechsel der Arbeitsstation passiert ist) und kennt als Einzige die volle Wahrheit.

Alle **normalen** Arbeits-Sessions wissen davon nichts. Sie merken nicht, dass sie eben noch auf Rechner A liefen und jetzt auf Rechner B – dank identischem Home und identischen Pfaden sieht für sie alles exakt gleich aus. Und das ist volle Absicht.

Denn: **Erzähl den Agenten nie vom rosa Elefanten.** Sobald eine Session weiß, dass sie auf einem exotischen Setup sitzt, erklärt sie sich jedes kleine E2E-Problem zuerst genau damit – „liegt bestimmt am Sync", „bestimmt der Proxy", „bestimmt die entfernte Maschine". Weiß sie nichts davon, sucht sie die Ursache wieder dort, wo sie meistens sitzt: im Code. Den Elefanten sehen darf nur Ground Control.

## Fazit: Lohnt sich das?

Ein Mac mini im Regal, ein bisschen Unix-Handwerk – und plötzlich hat man eine persönliche, immer laufende Basis für agentisches Arbeiten, die man von überall bedient. Die Bausteine sind alle Standard und quelloffen: tmux, mosh, Syncthing, colima, nginx. Nichts davon ist exotisch; das Besondere ist die Kombination.

Ein Nebeneffekt, den ich unterschätzt hatte: Ein **dedizierter Rechner ohne GUI und ohne sonstige Prozesse** hat spürbar mehr nutzbare Power. Auf meinem normalen Arbeitsrechner kratzte der Arbeitsspeicher bei gleicher RAM-Bestückung ständig am Limit – Swapping ohne Ende. Super nervig, wenn man überlegen muss, welchen Prozess man jetzt abschießt; den Agenten will man ja ganz sicher nicht unterbrechen. Auf dem mini ist dieses Problem einfach weg.

Ehrlich bleiben will ich auch:

- **Es braucht Pflege.** Headless-Betrieb, FileVault-Remote-Unlock, Autostart-Dienste – das ist einmal Einrichtungsaufwand und gelegentlich Debugging.
- **Sicherheit ist Pflicht, kein Bonus.** Zugriff ausschließlich übers VPN, Key-Auth, FileVault an. Ein always-on Rechner ist nur so vertrauenswürdig wie sein Zugang.
- **Reboots kosten laufende Prozesse.** tmux rettet das Layout, nicht den Zustand mitten im Lauf. Für lange Läufe plane ich Neustarts entsprechend.

Und der Preis? Das Setup ist vor allem **erstaunlich günstig** und kommt professionellen Lösungen trotzdem nahe: Die Hardware hatte ich ohnehin, laufende Kosten sind allein die **Max-Subscription von Claude** – sonst nichts. Weil der Agent jetzt rund um die Uhr und von überall erreichbar ist, reize ich deren großzügige Limits inzwischen wirklich gnadenlos aus. Das gelingt kaum so gut, wenn man an einen physischen Ort gebunden ist.

Für mich überwiegt der Gewinn deutlich: Agenten, die weiterarbeiten, während ich lebe, mich bewege, das Gerät wechsle. Die Bodenstation steht, die Rakete dockt an und ab. *Ground Control to Major Tom* – und der Bodenkontakt reißt nie ab.

Übrigens: Beim Schreiben dieses Artikels hatte ich den Song permanent im Ohr. Bitte sehr, hier ist dein neuer Ohrwurm:

<iframe src="https://www.youtube.com/embed/iYYRH4apXDo" title="David Bowie – Space Oddity (Official Video)" style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 8px;" allowfullscreen loading="lazy"></iframe>

<small>Falls der Player nicht lädt: [direkt auf YouTube ansehen](https://youtu.be/iYYRH4apXDo).</small>

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
