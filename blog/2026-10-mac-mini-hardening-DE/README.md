---
title: 'Mac mini Hardening: Verschlüsselung, Backups, Boot und Strom'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-10-07
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

**Meine Bodenstation läuft rund um die Uhr und ist von überall erreichbar. Bequem, ja. Aber sie ist auch ein physisches Gerät, das jemand mitnehmen kann, und sie hängt am Strom. Dieser Artikel härtet sie gegen drei Fälle ab: Diebstahl, einen Neustart und einen Stromausfall. Dabei steckt ein Widerspruch im Kern: Ausgerechnet die Verschlüsselung, die bei Diebstahl schützt, sperrt mich beim nächsten Neustart selbst aus, und zwar genau dann, wenn ich nicht davorsitze. Wie ich trotzdem jederzeit an die Maschine komme, zeige ich hier.**

Das hier ist der zweite Teil zur Bodenstation. Im [ersten Artikel](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini) ging es ums Warum und um das Setup. Jetzt geht es ums Absichern. Dieser Teil ist für sich lesbar.

## Inhalt

[[toc]]

## Die Platte verschlüsseln

Der mini steht bei mir im Kabelschrank, neben NAS, Fritzbox und Switch. Er ist klein, er ist leise, und genau das macht ihn auch leicht wegzutragen. Auf der Platte liegt mein halbes Arbeitsleben: Repos, Keys, die Agenten-Sessions aus [Deine Chats sind dein Kapital](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini#deine-chats-sind-dein-kapital). Wer den mini physisch entfernt, hätte ohne Schutz all das in der Hand.

![Metallregal mit der Hardware der Bodenstation: eine schwarze APC-USV mit grün leuchtender Statusleiste, davor ein silberner Mac mini, links unten ein JetKVM mit kleinem Farbdisplay, oben hinten ein NETGEAR-Switch mit grünen Port-LEDs, dazwischen zahlreiche schwarze und weiße Kabel.](bodenstation.jpg "Mini, USV, JetKVM und Switch in voller Pracht. Staub inklusive.")

Deshalb ist meine Festplatte mit **FileVault** verschlüsselt, Apples Festplattenverschlüsselung in macOS. Für mich gehört das zum guten Ton, nicht nur auf einem always-on Rechner. Der Gewinn ist einfach zu erklären: Wird das Gerät im ausgeschalteten oder gesperrten Zustand entwendet, ist die Platte ohne mein Passwort nur Datenmüll. Der Dieb bekommt Hardware, keine Daten.

> **💡 Tipp:** FileVault schaltest du in den Systemeinstellungen unter *Datenschutz & Sicherheit → FileVault* ein. Einmal aktiviert, läuft die Verschlüsselung im Hintergrund, im Alltag merkst du nichts davon.

## Backups: auch verschlüsselt

Verschlüsselung schützt vor fremdem Zugriff. Gegen Datenverlust hilft sie nicht, und Datenverlust hat viele Ursachen: eine sterbende Platte, ein falscher Befehl, ein Agent, der Unsinn baut. Deshalb gehören Backups in jedes professionelle Setup, regelmäßig und automatisch. Sie sind keine Agenten-Spezialität, sie sind Grundhygiene.

Bei mir übernimmt das **[Carbon Copy Cloner](https://bombich.com)** (CCC). Es sichert die Platte auf ein externes Laufwerk, nach Zeitplan, ohne dass ich daran denken muss. **Das Backup-Laufwerk ist genauso verschlüsselt wie die Hauptplatte.** Ein unverschlüsseltes Backup macht die Verschlüsselung der Hauptplatte wertlos. Wer die externe Platte mitgehen lässt, hätte sonst alles, was FileVault auf dem mini schützt.

CCC kann dafür auf ein verschlüsseltes Laufwerk sichern: Du formatierst das externe Laufwerk als verschlüsseltes *APFS* (Apples Dateisystem), und CCC sichert dorthin.

Welche Platte? Ich bevorzuge eine klassische, sich drehende Festplatte, keine SSD. Eine SSD, die lange stromlos im Schrank liegt, kann mit der Zeit Daten verlieren, weil die Ladung in den Speicherzellen wegsickert. Wie schnell das praktisch passiert, ist umstritten, aber für ein Backup, das monatelang unberührt liegt, gehe ich das Risiko nicht ein.

Konkret nehme ich eine 3,5-Zoll-Desktop-Platte mit eigenem Netzteil, etwa die [WD Elements Desktop](https://www.amazon.de/dp/B07FNK6QMT?tag=agentic-21). In diesem Format gibt es die großen Kapazitäten zum besten Preis, genug Platz für volle Backups. Das eigene Netzteil ist dabei kein Nachteil: Eine 3,5-Zoll-Platte braucht mehr Strom, als ein USB-Port liefert. Bei mir hängt sie deshalb an der USV statt am mini, dazu gleich mehr. Western Digital setze ich seit Jahren ein, bisher ist mir keine Platte gestorben. Ob das repräsentativ ist, weiß ich nicht. Die WD Elements gibt es von 4 bis über 20 TB, wähl die Größe passend zu deiner internen Platte.

> **ℹ️ Hinweis:** Amazon-Links in diesem Artikel sind Affiliate-Links. Kaufst du darüber etwas, bekomme ich eine kleine Provision, für dich bleibt der Preis gleich.

CCC spiegelt nicht nur den aktuellen Stand. Über *Snapshots*, Momentaufnahmen des APFS-Dateisystems, hält es auch ältere Versionen vor. Dafür sollte die Platte deutlich größer sein als deine Daten: Bombich empfiehlt rund die doppelte Kapazität der Quelle. Der Gewinn: Zerschießt oder löscht ein Agent eine Datei, holst du sie aus einer früheren Version zurück.

> **💡 Tipp:** Eine externe Platte verschlüsselst du im Festplattendienstprogramm (Format *APFS (verschlüsselt)*) oder per Rechtsklick im Finder. Das Passwort kannst du im Schlüsselbund hinterlegen, dann mountet die Platte für die geplanten Backups automatisch.

## Der Haken: ein Passwort zum ungünstigsten Zeitpunkt

Jetzt kommt die Kehrseite der Verschlüsselung. Nach jedem Neustart hängt der mini im **Pre-Boot-Lock**: Erst wenn das FileVault-Passwort eingegeben ist, entschlüsselt sich die Platte, der Rechner bootet durch und die Dienste starten. Zu diesem Zeitpunkt gibt es noch **kein Netzwerk**. Ein SSH-Login hilft also nicht, und bei einer *headless* Maschine (ohne Monitor und Tastatur) ist man damit ausgesperrt.

Ich brauche einen Bildschirm und eine Tastatur bis hinunter zum Boot-Screen, aus der Ferne. Meine Lösung ist ein **[JetKVM](https://jetkvm.com)**, ein kleines KVM-over-IP-Gerät. KVM steht für *Keyboard, Video, Mouse*: Tastatur, Bild und Maus übers Netzwerk. Es hängt per USB am mini und meldet sich dort als Tastatur an, dazu greift es das Bild per HDMI ab. Bei jedem Neustart tippe ich darüber einmal das FileVault-Passwort ein, und der mini bootet durch. So bleibt die Platte verschlüsselt, und ich komme trotzdem an jeden Boot-Schritt.

Ich habe mich bewusst für den JetKVM entschieden, weil er **quelloffen** ist (GPL-2.0, [Code auf GitHub](https://github.com/jetkvm/kvm)). Viele KVM-over-IP-Geräte sind Closed Source. Bei einem Gerät, das Tastatur und Bildschirm über das Netz überträgt, will ich nachvollziehbaren Code. Zu kaufen gibt es ihn direkt beim Hersteller über [jetkvm.com](https://jetkvm.com), dann aber mit Versand aus China und entsprechend langer Lieferzeit. Schneller geht es über [Amazon](https://www.amazon.de/dp/B0GHQCSN3W?tag=agentic-21): Versand durch Amazon, Lieferung in wenigen Tagen.
Zwei Einstellungen nehmen dem Boot-Thema die Schärfe:

- Für **geplante Neustarts** geht es sogar ohne Passwort: `sudo fdesetup authrestart` entsperrt beim nächsten Reboot automatisch, ohne sich auszusperren.
- `pmset autorestart 1` holt den mini nach einem Stromausfall von selbst wieder hoch. Ohne diese Einstellung bliebe er aus und wartete auf den physischen Startknopf, den du aus der Ferne nicht erreichst. Das FileVault-Passwort per KVM bleibt dann der eine manuelle Schritt.

Gerade aus der Ferne zahlt sich das aus. Ich will im Urlaub nicht bangen, ob der mini nach einem Stromzucken wieder hochkommt, und erst recht keinen Angehörigen bitten müssen, zu meinem Haus zu fahren und den Rechner einzuschalten. Autorestart bringt ihn zurück, das FileVault-Passwort gebe ich per KVM aus dem Bulli-Office ein.

> **💡 Praxis-Tipp:** Zu diesem frühen Boot-Zeitpunkt funktionieren bei mir nur die **vorderen** USB-Anschlüsse des mini, die hinteren kommen erst später. Woran das genau liegt, kann ich nicht sicher sagen. Steck den JetKVM-USB also vorne ein, dann wird die Tastatur schon am Pre-Boot-Screen erkannt. Das Bild per HDMI darf hinten bleiben.

Verschlüsselung und verschlüsselte Backups verlangen beim Booten jeweils ein Passwort, und die KVM lässt mich es aus der Ferne eingeben. Ohne sie wäre eine verschlüsselte, headless Maschine ein Widerspruch in sich.

## Stromversorgung: sauber herunterfahren, bevor der Akku leer ist

Bleibt der dritte Fall, der Stromausfall. Die meisten Entwickler arbeiten heute am Laptop, und damit ist ein altes Schreckgespenst verschwunden: Es gewittert, und man bangt, ob gleich der Strom zuckt. Der Akku trägt über jede Schwankung hinweg, man merkt sie nicht einmal. Beim mini ist das anders. Er hat keinen Akku, er verzeiht dir nichts. Einmal Strom weg, und alles ist weg: die ungespeicherte Arbeit, alle laufenden Agenten, der ganze Zustand. **Brutal!** Danach heißt es: alles wieder hochfahren, Fenster für Fenster, Session für Session (und einmal das FileVault-Passwort per KVM eintippen).

Deshalb hängt der mini an einer USV (unterbrechungsfreie Stromversorgung, engl. *UPS*), einer **[APC Back-UPS BX750MI-GR](https://www.amazon.de/dp/B08G8V85X6?tag=agentic-21)**. Viel Reserve und genug Leistung, um neben dem mini auch den JetKVM und den Switch mitzuversorgen. APC ist bei USVs schlicht der Standard, langweilig im besten Sinn: So ein Gerät kaufst du einmal, dann läuft es jahrelang, ohne dass du dich noch darum kümmerst. Genau mein Ding.

Das Datenkabel der USV geht per USB in einen **vorderen** Port des mini. Aus mir unerklärlichen Gründen war die Verbindung an den hinteren Ports ziemlich unzuverlässig, macOS verlor die USV immer wieder aus den Augen, und damit wurde der Wächter blind. Seit sie vorne steckt, genau wie die Tastatur des JetKVM, meldet `pmset -g batt` die `Back-UPS` stabil. Schick sieht das nicht aus, aber es erfüllt seinen Zweck.

Wichtig ist die ganze Netzwerkkette. An der USV des mini hängen auch der JetKVM und der Switch. Fritzbox und Glasfaseranschluss hängen an einer zweiten USV. Fällt der Strom aus, bleibt so das ganze Netz aktiv: Der mini erreicht die Fritzbox über den Kabelweg mini → Switch → Fritzbox, dahinter die Glasfaser-Box des Anbieters. (Ja, ich habe endlich Glasfaser. 😎) Das Signal vom Anbieter hängt nicht an meinem Hausstrom, ich muss nur meine eigene Glasfaser-Box und den Router am Laufen halten. Genau dafür ist die zweite USV da. So surfe ich weiter, während im Haus sonst alles dunkel ist. Dieser Kabelweg ist die Grundlage dafür, dass auch die Warn-Mails im Ausfall noch rauskommen.

Und wenn der Akku zur Neige geht? Ein kleiner Wächter übernimmt Mail und Abschaltung selbst. Das Skript, dem ich den Namen `ups-notify.sh` gegeben habe, läuft als System-Dienst (LaunchDaemon als root) und fragt alle 20 Sekunden `pmset -g batt` ab:

1. Sobald der mini auf USV-Akku läuft, kommt eine Mail „STROMAUSFALL".
2. Fällt der Akku auf 20 Prozent oder darunter, folgt eine zweite Mail „SHUTDOWN".
3. Danach fährt der mini kontrolliert herunter (`shutdown -h now`).

Kommt der Strom zurück, meldet eine Mail „Strom wieder da". Ein zweiter Wächter mailt, falls die USV ganz vom USB verschwindet, damit der erste nie unbemerkt blind läuft. Die Mails gehen über [Resend](https://resend.com) raus.

Der technisch versierte Leser wird sich jetzt fragen: Kann macOS das nicht von allein? macOS bietet dafür Einstellungen (`pmset -u haltremain/haltlevel/haltafter`), die bei niedrigem USV-Akku herunterfahren sollen. Auf meinem M4-mini hat das im Test aber nicht ausgelöst. Deshalb macht es mein eigenes Skript, und das klappt zuverlässig.

> **💡 Hinweis:** Das Skript fährt bei meiner eigenen Schwelle herunter und schickt mir vorher die Warn-Mails. Vor allem aber kann ich den ganzen Ablauf testen, ohne auf einen echten Stromausfall zu warten. Bei einer eingebauten Einstellung geht das nicht.

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

Die Helfer dazu sind klein genug, dass du dir alles selbst zusammenbauen kannst. `pm_src_of`/`pm_pct_of` lesen Quelle und Akkustand aus `pmset -g batt`, `notify`/`notify_now` verschicken die Mail über [Resend](https://resend.com), immer im Hintergrund, damit ein Netz-Timeout nie den Shutdown blockiert:

```bash
# pmset -g batt parsen: Quelle (AC/UPS) und Akkustand in Prozent
pm_src_of() { case "$1" in *"'AC Power'"*) echo AC ;; *) echo UPS ;; esac; }
pm_pct_of() { printf '%s' "$1" | grep -oE '[0-9]+%' | head -1 | tr -d '%'; }

# Mail über Resend; API-Key, Absender und Empfänger kommen aus dem Environment
_resend_post() {
  curl -s -o /dev/null -w '%{http_code}' --max-time "${3:-15}" \
    -X POST https://api.resend.com/emails \
    -H "Authorization: Bearer ${RESEND_API_KEY}" -H "Content-Type: application/json" \
    -d "{\"from\":\"${RESEND_FROM}\",\"to\":\"${RESEND_TO}\",\"subject\":\"${1}\",\"text\":\"${2}\"}"
}

# blockierend, drei Versuche gegen kurzen Netz-Schluckauf
resend_send()    { for i in 1 2 3; do case "$(_resend_post "$1" "$2" 15)" in 2*) return 0 ;; esac; /bin/sleep 10; done; return 1; }
# einmal, kurzer Timeout, im Hintergrund (für den Shutdown-Pfad)
resend_send_bg() { ( _resend_post "$1" "$2" 5 >/dev/null 2>&1 ) & }

notify()     { resend_send "$1" "$2" & }    # Übergangs-Mail, retryt im Hintergrund
notify_now() { resend_send_bg "$1" "$2"; }  # Shutdown-Mail: einmal, kurz, im Hintergrund
```

Warum der ganze Aufwand? Ein harter Stromausfall kann die gerade aktive Session-`.jsonl` abschneiden, die Datei, in der die laufende Agenten-Session Zeile für Zeile protokolliert wird. Im schlimmsten Fall bleibt sie bei null Bytes. Das ist mir nach abrupten Neustarts schon mehrfach passiert, und zwar immer dann, wenn genau in dem Moment geschrieben wurde. Bei fleißigen Agenten ist das ständig der Fall. Und es bleibt nicht lokal: Der mini spiegelt seine Dateien laufend auf meine anderen Geräte (wie das läuft, steht in [Teil 1](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini)). Diese Spiegelung repliziert dann auch die kaputte Version, und der Schaden landet auf allen Maschinen. Eine saubere Abschaltung mitigiert das.

## Das Setup nachbauen

Die Komponenten, die bei mir im Einsatz sind:

- **USV:** [APC Back-UPS BX750MI-GR](https://www.amazon.de/dp/B08G8V85X6?tag=agentic-21). Hält den mini samt JetKVM und Switch bei Stromausfall am Laufen.
- **KVM-over-IP:** [JetKVM](https://jetkvm.com), quelloffen. Direkt beim Hersteller oder schneller über [Amazon](https://www.amazon.de/dp/B0GHQCSN3W?tag=agentic-21).
- **Backup-Software:** [Carbon Copy Cloner](https://bombich.com). Sichert nach Zeitplan auf ein externes Laufwerk.
- **Backup-Laufwerk:** eine drehende 3,5-Zoll-Festplatte wie die [WD Elements Desktop](https://www.amazon.de/dp/B07FNK6QMT?tag=agentic-21), als verschlüsseltes *APFS* formatiert.
- **Verschlüsselung:** FileVault, in macOS enthalten.

## Fazit

**Diebstahl** entschärft die Verschlüsselung, der Platte und der Backups. Der **Neustart** wird beherrschbar, weil ich das FileVault-Passwort per KVM aus der Ferne eintippe. Den **Stromausfall** fängt die USV ab, und ein kleines Skript fährt rechtzeitig und sauber herunter.

Der Dreh- und Angelpunkt ist dabei die KVM. Verschlüsselung ohne eine Möglichkeit, das Passwort beim Boot einzugeben, wäre auf einer headless Maschine eine Sackgasse. Erst die KVM macht aus „verschlüsselt" und „headless" ein Paar, das zusammenpasst.

Das ist einmal Einrichtungsaufwand und danach Ruhe. Mein Rat: Fang mit der Verschlüsselung an, die ist in zwei Klicks aktiviert und schützt sofort. Den Rest baust du in Ruhe dazu.

Damit endet die Serie zur Bodenstation. Ich hoffe, sie hat dir geholfen, und du hast jetzt eine Basis, auf der deine Agenten rund um die Uhr laufen, abgesichert gegen Diebstahl, Neustart und Stromausfall.

**Fragen, Feedback, dein eigenes Setup?** Immer her damit, ich freue mich über jede Nachricht. Kommen genug offene Fragen zusammen, hänge ich gern einen dritten Teil an.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
