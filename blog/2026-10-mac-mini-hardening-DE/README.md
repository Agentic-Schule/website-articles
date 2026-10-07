---
title: 'Mac mini Hardening: Verschlüsselung, Backups, Boot und Strom'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-10-13
keywords:
  - Mac mini
  - FileVault
  - Festplattenverschlüsselung
  - Backup
  - Carbon Copy Cloner
  - USV
  - Stromausfall
  - JetKVM
  - KVM over IP
  - Agentic Coding
language: de
header: header.jpg
---

Eine Maschine, die nie ausgeht und von überall erreichbar ist, ist bequem. Sie ist aber auch ein physisches Gerät, das jemand mitnehmen kann, und sie hängt am Strom.

**Dieser Artikel härtet die Bodenstation ab (engl. *Hardening*), gegen genau diese drei Fälle: Diebstahl, einen Neustart und einen Stromausfall. Das Werkzeug gegen Diebstahl ist Verschlüsselung, der Platte und der Backups. Der Preis dafür ist ein Passwort, das man genau im unpassendsten Moment eingeben muss: beim Booten, wenn es noch kein Netzwerk gibt. Deshalb ist ein fernbedienbares KVM-Gerät der Dreh- und Angelpunkt des ganzen Konzepts.**

Das hier ist der zweite Teil zur Bodenstation. Im [ersten Artikel](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini) ging es ums Warum und um das Setup. Jetzt geht es ums Absichern. Dieser Teil ist für sich lesbar.

## Inhalt

[[toc]]

## Die Platte verschlüsseln

Der mini steht bei mir im Kabelschrank, neben NAS, Fritzbox und Switch. Er ist klein, er ist leise, und genau das macht ihn auch leicht wegzutragen. Auf der Platte liegt mein halbes Arbeitsleben: Repos, Keys, die Agenten-Sessions aus [Deine Chats sind dein Kapital](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini#deine-chats-sind-dein-kapital). Wer die Kiste mitnimmt, hätte ohne Schutz all das in der Hand.

Deshalb ist die Platte mit **FileVault** verschlüsselt, Apples Festplattenverschlüsselung in macOS. Für mich gehört das zum guten Ton, nicht nur auf einem always-on Rechner. Der Gewinn ist einfach zu erklären: Wird das Gerät im ausgeschalteten oder gesperrten Zustand entwendet, ist die Platte ohne mein Passwort nur Datenmüll. Der Dieb bekommt Hardware, keine Daten.

> **💡 Tipp:** FileVault schaltest du in den Systemeinstellungen unter *Datenschutz & Sicherheit → FileVault* ein. Einmal aktiviert, läuft die Verschlüsselung im Hintergrund, im Alltag merkst du nichts davon.

## Backups, und zwar auch verschlüsselt

Verschlüsselung schützt vor fremdem Zugriff. Sie schützt nicht davor, dass eine Platte stirbt oder ein Agent Unsinn baut. Dafür braucht es Backups, regelmäßig und automatisch.

Bei mir übernimmt das **[Carbon Copy Cloner](https://bombich.com)** (CCC). Es sichert die Platte auf ein externes Laufwerk, nach Zeitplan, ohne dass ich daran denken muss. Entscheidend ist der zweite Teil: **Das Backup-Laufwerk ist genauso verschlüsselt wie die Hauptplatte.** Ein unverschlüsseltes Backup macht die Verschlüsselung der Hauptplatte wertlos. Wer die externe Platte mitgehen lässt, hätte sonst alles, was FileVault auf dem mini schützt.

Das geht sauber zusammen: CCC ist laut Hersteller *„fully qualified for use with FileVault-protected volumes"*, also für FileVault-verschlüsselte Ziellaufwerke freigegeben (APFS, verschlüsselt). Du formatierst das Backup-Laufwerk als verschlüsseltes APFS, und CCC sichert dorthin. Platte weg, Backup weg: beide ohne Passwort wertlos.

> **💡 Tipp:** Eine externe Platte verschlüsselst du im Festplattendienstprogramm (Format *APFS (verschlüsselt)*) oder per Rechtsklick im Finder. Das Passwort kannst du im Schlüsselbund hinterlegen, dann mountet die Platte für die geplanten Backups automatisch.

## Der Haken: ein Passwort zum ungünstigsten Zeitpunkt

Jetzt kommt die Kehrseite der Verschlüsselung. Nach jedem Neustart hängt der mini im **Pre-Boot-Lock**: Erst wenn das FileVault-Passwort eingegeben ist, entschlüsselt sich die Platte, der Rechner bootet durch und die Dienste starten. Zu diesem Zeitpunkt gibt es noch **kein Netzwerk**. Ein SSH-Login hilft also nicht, und bei einer headless Maschine ohne Monitor und Tastatur ist man damit ausgesperrt.

Genau hier wird aus einer Nebensache das zentrale Element. Ich brauche ein Bild und eine Tastatur bis hinunter zum Boot-Screen, aus der Ferne. Meine Lösung ist ein **[JetKVM](https://jetkvm.com)**, ein kleines KVM-over-IP-Gerät (Tastatur, Bild und Maus übers Netzwerk). Es hängt per USB am mini und meldet sich dort als Tastatur an, dazu greift es das Bild per HDMI ab. Bei jedem Neustart tippe ich darüber einmal das FileVault-Passwort ein, und der mini bootet durch. So bleibt die Platte verschlüsselt, und ich komme trotzdem an jeden Boot-Schritt.

Ich habe mich bewusst für den JetKVM entschieden, weil er **quelloffen** ist (GPL-2.0, [Code auf GitHub](https://github.com/jetkvm/kvm)). Viele KVM-over-IP-Geräte sind Closed Source. Bei einem Gerät, das Tastatur und Bildschirm über das Netz überträgt, will ich nachvollziehbaren Code. Zu kaufen gibt es ihn direkt beim Hersteller über [jetkvm.com](https://jetkvm.com), dann aber mit Versand aus China und entsprechend langer Lieferzeit. Schneller geht es über [Amazon](https://www.amazon.de/dp/B0GHQCSN3W?tag=agentic-21): Versand durch Amazon, Lieferung in wenigen Tagen.

> **ℹ️ Hinweis:** Amazon-Links in diesem Artikel sind Affiliate-Links. Kaufst du darüber etwas, bekomme ich eine kleine Provision, für dich bleibt der Preis gleich.

Zwei Einstellungen nehmen dem Boot-Thema die Schärfe:

- Für **geplante Neustarts** geht es sogar ohne Passwort: `sudo fdesetup authrestart` entsperrt beim nächsten Reboot automatisch, ohne sich auszusperren.
- `pmset autorestart 1` holt den mini nach einem Stromausfall von selbst wieder hoch (die Passwort-Eingabe per KVM bleibt dann der eine manuelle Schritt).

> **💡 Praxis-Tipp:** Zu diesem frühen Boot-Zeitpunkt funktionieren nur die **vorderen** USB-Anschlüsse des mini, die hinteren kommen erst später. Meine Vermutung: Hinten sitzen die Thunderbolt-Ports, deren Controller am Pre-Boot-Screen noch nicht aktiv ist, sodass eine darüber emulierte USB-Tastatur dort nicht erkannt wird. Steck den JetKVM-USB also vorne ein. Das Bild per HDMI darf hinten bleiben.

Damit ist der rote Faden gelegt: Verschlüsselung und verschlüsselte Backups kosten jeweils ein Passwort beim Boot, und die KVM ist das, was mich dieses Passwort aus der Ferne eingeben lässt. Ohne sie wäre eine verschlüsselte, headless Maschine ein Widerspruch in sich.

## Stromversorgung: sauber herunterfahren, bevor der Akku leer ist

Bleibt der dritte Fall, der Stromausfall. Der mini ist kein Laptop, den ein Akku über eine Stromschwankung trägt. Einmal Strom weg, und alles ist weg: die ungespeicherte Arbeit, alle laufenden Agenten, der ganze Zustand. Danach heißt es: alles wieder hochfahren, Fenster für Fenster, Session für Session (und einmal das FileVault-Passwort per KVM eintippen).

Deshalb hängt der mini an einer USV (unterbrechungsfreie Stromversorgung, engl. *UPS*), einer **[APC Back-UPS BX750MI-GR](https://www.amazon.de/dp/B08G8V85X6?tag=agentic-21)**. Viel Reserve und genug Leistung, um neben dem mini auch den JetKVM und den Switch mitzuversorgen.

Das Datenkabel der USV geht per USB in einen **vorderen** Port des mini. Aus mir unerklärlichen Gründen war die Verbindung an den hinteren Ports ziemlich unzuverlässig, macOS verlor die USV immer wieder aus den Augen, und damit wurde der Wächter blind. Seit sie vorne steckt, genau wie die Tastatur des JetKVM, meldet `pmset -g batt` die `Back-UPS` stabil. Schick sieht das nicht aus, aber es erfüllt seinen Zweck.

Wichtig ist die ganze Netzwerkkette. An der USV des mini hängen auch der JetKVM und der Switch, der Switch über ein Verlängerungskabel. Fritzbox und Glasfaseranschluss hängen an einer zweiten USV. Fällt der Strom aus, bleibt so das ganze Netz aktiv: Die Fritzbox hält ihr WLAN, der mini erreicht sie über den Kabelweg mini → Switch → Fritzbox, und ich habe durchgehend Internet. Meine SSH-Sitzung läuft einfach weiter. Dieser Kabelweg ist die Grundlage dafür, dass auch die Warn-Mails im Ausfall noch rauskommen.

Und wenn der Akku zur Neige geht? Ein kleiner Wächter übernimmt Mail und Abschaltung selbst. Das Skript `ups-notify.sh` läuft als System-Dienst (LaunchDaemon als root) und fragt alle 20 Sekunden `pmset -g batt` ab:

1. Sobald der mini auf USV-Akku läuft, kommt eine Mail „STROMAUSFALL".
2. Fällt der Akku auf 20 Prozent oder darunter, folgt eine zweite Mail „SHUTDOWN".
3. Danach fährt der mini kontrolliert herunter (`shutdown -h now`).

Kommt der Strom zurück, meldet eine Mail „Strom wieder da". Ein zweiter Wächter mailt, falls die USV ganz vom USB verschwindet, damit der erste nie unbemerkt blind läuft. Die Mails gehen über [Resend](https://resend.com) raus.

Warum trotzdem ein eigenes Skript?

> **💡 Hinweis:** macOS kann bei niedrigem USV-Akku auch von selbst herunterfahren (`pmset -u haltremain/haltlevel/haltafter`). Ich fahre den mini trotzdem selbst herunter, bei meiner eigenen Schwelle. So warte ich nicht erst ab, bis das Betriebssystem reagiert; der mini ist schon vorher sauber unten. Dazu bekomme ich die Warn-Mails und einen Ablauf, den ich testen kann.

Der Kern ist eine kurze Schleife. Die drei Stufen von oben stehen direkt darin:

```bash
HALT_PCT="${HALT_PCT:-20}"   # bei <= X % USV-Akku sauber herunterfahren
POLL="${POLL:-20}"           # Sekunden zwischen den Checks

state="init"                 # init | AC | UPS
while :; do
  batt="$(pmset -g batt)"
  src="$(pm_src_of "$batt")" # "AC" oder "UPS"
  pct="$(pm_pct_of "$batt")" # Akkustand in Prozent

  # Mail nur beim echten Wechsel, im Hintergrund (die Schleife darf nie auf einer Mail hängen)
  if [ "$state" != "init" ] && [ "$src" != "$state" ]; then
    if [ "$src" = "UPS" ]; then
      notify "STROMAUSFALL - $HOST auf USV-Akku" "Läuft jetzt auf Akku (${pct}%). Fährt bei <= ${HALT_PCT}% herunter."
    else
      notify "Strom wieder da - $HOST" "Läuft wieder am Netzstrom (${pct}%)."
    fi
  fi
  state="$src"

  # Low Battery -> sauberes Shutdown. Doppelt abgesichert: nur auf USV UND Akku niedrig.
  if [ "$src" = "UPS" ] && [ -n "$pct" ] && [ "$pct" -le "$HALT_PCT" ]; then
    notify_now "SHUTDOWN - $HOST (Akku ${pct}%)" "Fährt jetzt kontrolliert herunter."
    /bin/sleep 2
    /sbin/shutdown -h now "USV-Akku niedrig (${pct}%)"
    exit 0
  fi

  /bin/sleep "$POLL"
done
```

Zwei kleine Helfer sind ausgelagert: `pm_src_of`/`pm_pct_of` lesen Quelle und Akkustand aus `pmset -g batt`, `notify`/`notify_now` schicken die Mail über Resend, immer im Hintergrund, damit ein Netz-Timeout nie den Shutdown blockiert. Die Secrets (Resend-Key, Absender, Empfänger) liegen in einer `resend.env` mit `chmod 600`, nicht im Skript.

Warum der ganze Aufwand? Ein harter Stromausfall kann die gerade aktive Session-`.jsonl` abschneiden, im schlimmsten Fall auf null Bytes. Und weil der Sync eine bidirektionale Spiegelung ist, repliziert er die kaputte Version brav auf die andere Maschine. Das ist die eigentliche Gefahr: Der Sync trägt den Schaden auf alle Geräte. Eine saubere Abschaltung verhindert genau das.

## Fazit

Drei Risiken, drei Antworten, und ein gemeinsamer Nenner. **Diebstahl** entschärft die Verschlüsselung, der Platte und der Backups. Der **Neustart** wird beherrschbar, weil ich das FileVault-Passwort per KVM aus der Ferne eintippe. Den **Stromausfall** fängt die USV ab, und ein kleines Skript fährt rechtzeitig und sauber herunter.

Der Dreh- und Angelpunkt ist dabei die KVM. Verschlüsselung ohne eine Möglichkeit, das Passwort beim Boot einzugeben, wäre auf einer headless Maschine eine Sackgasse. Erst die KVM macht aus „verschlüsselt" und „headless" ein Paar, das zusammenpasst.

Das ist einmal Einrichtungsaufwand und danach Ruhe. Mein Rat: Fang mit der Verschlüsselung an, die ist in zwei Klicks aktiviert und schützt sofort. Den Rest baust du in Ruhe dazu.

**Fragen, Feedback, dein eigenes Setup?** Immer her damit, ich freue mich über jede Nachricht.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
