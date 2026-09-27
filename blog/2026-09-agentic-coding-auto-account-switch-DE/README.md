---
title: 'Agentic Coding rund um die Uhr: Der Tankwechsel im Flug'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-10-07
keywords:
  - Agentic Coding
  - AI Agent
  - KI-Agent
  - Claude Code
  - Claude Max
  - Account Switch
  - Rate Limit
  - Remote Control
  - Supply Chain
  - MITM Proxy
language: de
header: header.jpg
---

**Eine Bodenstation, die nie ausgeht, verbrennt rund um die Uhr Treibstoff. Irgendwann ist der Tank leer. Dieser Artikel zeigt, wie Claude Code im laufenden Betrieb zwischen zwei Max-Abos wechselt, automatisch und ohne `/logout`. Remote Control überlebt den Wechsel. Und er zeigt, warum ich Werkzeugen, die meine Zugangsschlüssel anfassen, keinen Vertrauensvorschuss gebe.**

## Inhalt

[[toc]]

## Das Problem: Ein Tank reicht nicht mehr

Im [ersten Teil](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini) habe ich einen Mac mini zur „Bodenstation" umgebaut: eine Maschine, die immer läuft und auf der meine Agenten weiterarbeiten. Ich sehe vom MacBook, aus dem Browser oder vom Handy aus zu und greife ein. Ganz am Ende stand ein beiläufiger Satz: Weil der Agent jederzeit erreichbar ist, reize ich die großzügigen Limits der Claude-Max-Subscription „inzwischen wirklich gnadenlos aus".

Genau da setzt dieser Teil an. Ein Setup, das immer läuft, hat eine vorhersehbare Nebenwirkung: Es verbraucht mehr. Die Agenten arbeiten nachts weiter, unterwegs werfe ich Aufgaben hinein, mehrere Sessions laufen parallel. Das 5-Stunden-Fenster und vor allem das Wochenlimit der Max-Subscription sind großzügig. Unendlich sind sie nicht.

Die naheliegende Lösung ist ein **zweites Max-Abo**. Zwei Tanks statt einem. Doch Claude Code kennt immer nur *ein* angemeldetes Konto. Wechseln heißt: `/logout`, dann `/login`, dann der OAuth-Flow im Browser. Jedes Mal. Die laufende Arbeit steht still, und der Browser will bedient werden.

Dazu kommt ein zweiter, unangenehmerer Effekt: Ein Kontowechsel trennt die **Remote-Control-Verbindung**. Das ist genau das Feature aus Teil 1, mit dem ich vom Handy aus zusehe. Ein Wechsel, und die Session auf dem Telefon ist weg.

Das Ziel klingt also simpel: **im laufenden Betrieb zwischen zwei Abos umschalten, ohne Abmelden und ohne die Fernsteuerung zu verlieren.**

## Kein Router nötig: Claude Code liest die Credentials neu

Die naheliegende Idee wäre ein Proxy, der die `ANTHROPIC_BASE_URL` umbiegt. So betreibt man Claude Code mit fremden oder lokalen Modellen. Das ist hier aber gar nicht gefragt. Ich will weiterhin die echten Anthropic-Modelle nutzen, nur eben mal über Konto A und mal über Konto B.

Dafür braucht es keinen Router. Der Schlüssel liegt in einem Detail: **Claude Code liest seine Zugangsdaten neu ein, wenn sie sich ändern.** Liegen sie in einer Datei, reagiert Claude Code auf jede Änderung dieser Datei, und die *nächste* Nachricht läuft bereits über das neue Konto. Unter macOS liegen die Credentials normalerweise im Schlüsselbund. Claude Code puffert sie dort laut der [Dokumentation von `claude-swap`](https://github.com/realiti4/claude-swap#tips) etwa 30 Sekunden lang, danach greift auch dort der Wechsel. Auf meinem mini liegen sie als Datei unter `~/.claude/.credentials.json`.

Konkret heißt das: Wer diese Datei austauscht, wechselt das Konto. Ohne Neustart und ohne `/login`.

## Zwei Abos, ein Wechsel im laufenden Betrieb

Genau das macht das Open-Source-Tool [`claude-swap`](https://github.com/realiti4/claude-swap) (Befehl: `cswap`, MIT-Lizenz). Es sichert pro Konto die Credentials und tauscht sie auf Zuruf aus. Du meldest dich **einmal** pro Abo an, danach genügt:

```bash
cswap switch 2      # ab der nächsten Nachricht läuft alles über Abo 2
cswap switch 1      # zurück
cswap list          # Auslastung (5h/7d) aller Konten
```

Ein Detail meines Setups ist wichtig: Alle Sessions teilen sich **eine** globale Credential-Datei. Ein `cswap switch` bewegt darum *die ganze Flotte* auf das andere Abo. Genau das will ich, wenn Konto A ans Wochenlimit stößt.

Die Konten registrierst du so:

```bash
cswap add            # das aktuelle Konto als Slot 1 aufnehmen
# in Claude Code einmal /login mit dem zweiten Konto
cswap add            # das zweite Konto als Slot 2 aufnehmen
cswap switch 1       # zurück auf Abo 1
```

> **⚠️ Achtung:** Vor dem zweiten `/login` kein `/logout` ausführen. Laut der [Anleitung von `claude-swap`](https://github.com/realiti4/claude-swap#add-more-accounts) kann Claude Code dabei den Refresh-Token des Kontos widerrufen, das du gerade verlässt.

Der Browser-Login pro Konto ist der einzige Schritt, den kein Tool abnehmen kann. Danach ist er erledigt.

## Vertrauen ist gut, Forken ist besser

`cswap` fasst meine **OAuth-Tokens** an, also die Schlüssel zu meinen Konten. Bevor so ein Tool auf einem Rechner läuft, der nie ausgeht, will ich wissen, was es tut. Also lese ich zuerst den Quelltext, bevor ich `pipx install` tippe.

Die wichtigste Frage: Wohin geht der Netzwerkverkehr? Im Quelltext stehen nur Anthropics eigene Endpunkte (`api.anthropic.com`, `platform.claude.com`) und ein Versions-Check bei PyPI. Keine fremde Domain, keine Telemetrie. Das Paket wird über PyPIs *Trusted Publishing* aus einem GitHub-Workflow veröffentlicht, und das Repo bringt eine umfangreiche Testsuite mit. So weit, so vertrauenswürdig.

Trotzdem beziehe ich ein Tool, das meine Schlüssel hält, nicht per Auto-Update aus einer fremden Pipeline. Das eigentliche Risiko ist selten der Code von *heute*. Es ist das bösartige Release von *morgen*, das als beiläufiges Upgrade hereinkommt. Wie so etwas aussieht, zeigt der Artikel über [böswillige AI-Skills](https://agentic.schule/blog/2026-09-malicious-ai-skills). Deshalb gehe ich den sauberen Weg:

```bash
# in den eigenen Account forken und den geprüften Stand lokal auschecken
gh repo fork realiti4/claude-swap --clone
# ... Code lesen, dann aus der eigenen Kopie installieren:
pipx install ./claude-swap
# Updates nur bewusst: upstream holen, Diff lesen, neu installieren
```

Ein `cswap upgrade` gibt es bei mir nicht. So läuft nur Code, den ich gelesen habe.

## Remote Control überlebt den Wechsel

Bleibt das zweite Problem: Der Kontowechsel trennt die Fernsteuerung. Der Grund ist strukturell. Eine Remote-Control-Session gehört dem Konto, mit dessen Token sie erstellt wurde. Tauschst du das Konto, verlieren Handy und Web die Session, und auf dem alten Konto stapeln sich verwaiste Sitzungen. Dasselbe gilt für Artefakte: Nach einem Wechsel schlägt das erneute Veröffentlichen fehl.

Die Lösung heißt [`cswap-pin`](https://github.com/codeslake/cswap-pin) und stammt von Junyong Lee. Es ist ein **lokaler Proxy**, der genau eine Sache tut: Auf den Anthropic-Routen für Remote Control und Artefakte setzt er den Token des *gepinnten* Kontos ein. Die eigentliche Inferenz über `/v1/messages` reicht er unverändert durch. Sie folgt also weiter dem Wechsel. Der Besitz der Cloud-Objekte bleibt, die Rechenlast wandert.

```bash
cswap pin 1          # Remote Control und Artefakte bleiben auf Konto 1
```

Die Anbindung an `cswap` liegt zum Zeitpunkt dieses Artikels als [offener Pull Request](https://github.com/realiti4/claude-swap/pull/210) im Upstream-Projekt. Ich habe ihn in meinen Fork übernommen.

Was das technisch bedeutet, gehört offen auf den Tisch: Der Proxy ist ein *Man-in-the-Middle* (MITM). Er terminiert TLS lokal mit einer eigenen Zertifizierungsstelle (engl. *Certificate Authority*, CA), der nur die Claude-Sitzungen vertrauen. Er sieht damit den Anthropic-Verkehr im Klartext. Auch ihn habe ich geforkt und gelesen, bevor er auf die Kiste durfte. Bei einem Werkzeug, das den Datenverkehr sieht, ist das Pflicht.

## Der Autopilot: Ground Control tankt selbst um

Umschalten von Hand ist nett. Der eigentliche Gewinn ist die Automatik: `cswap auto` prüft die Auslastung und schaltet **von selbst** auf das Abo mit dem meisten Spielraum, sobald das aktive Konto eine Schwelle erreicht. Standardmäßig liegt sie bei 90 Prozent des 5-Stunden- oder Wochenfensters.

Mit `--once` macht der Befehl genau einen Durchlauf und beendet sich. Cooldown und Zustand speichert das Tool auf der Platte. Das passt perfekt zu einem Timer von `launchd`, und kein Terminal muss offen bleiben. Bei mir läuft das als LaunchDaemon im Minutentakt:

```xml
<key>ProgramArguments</key>
<array>
  <string>/Users/johanneshoppe/.local/bin/cswap</string>
  <string>auto</string>
  <string>--once</string>
  <string>--json</string>
</array>
<key>StartInterval</key>
<integer>60</integer>
```

Im Alltag ist das Ergebnis völlig unspektakulär, und genau so soll es sein. Irgendwann erreicht Konto 1 die Schwelle, der Dienst schaltet auf Konto 2, und ich arbeite weiter. Ich merke davon nichts.

## Als die eigenen Agenten Alarm schlugen

Die schönste Wendung kam von den Agenten selbst.

Auf der Bodenstation lief ein mehrstufiger Lektorats-Workflow: Recherche-Agenten prüfen die Fakten eines Artikels im Web. Plötzlich schlugen diese Agenten **Alarm**. Sie hielten die abgerufenen Inhalte für manipuliert und führten die Proxy-Umgebungsvariablen und die fremde CA als Beleg für einen Angriff an. Sie sahen einen Man-in-the-Middle und taten genau das, was ein wachsamer Prüfer tun soll.

Das ist ein Feature. Die Agenten konnten nicht wissen, woher der Proxy stammt. Aus ihrer Sicht saß da ein Man-in-the-Middle mit eigener CA, und das *hätte* Malware sein können.

Hatten sie recht? Das lässt sich prüfen, statt zu beschwichtigen. Ein Abruf von `example.com` durch den Proxy kommt mit dem *echten* öffentlichen Zertifikat zurück. Hätte der Proxy hier mitgelesen, wäre es seines gewesen. Auch der Quelltext bestätigt das: Der Proxy entschlüsselt **ausschließlich** `api.anthropic.com`. Jeden anderen Host reicht er als blinden Tunnel durch.

Die Agenten haben sich also in den *Fakten* geirrt, der Verkehr war echt. Im *Instinkt* lagen sie richtig. Denn ihr Alarm zeigt eine Schwäche im Design: Alle Web-Abrufe laufen unnötigerweise durch den Proxy. Der Pin braucht nur die Verbindung zu Anthropic. Also habe ich die Reichweite verkleinert: Ein kleiner Wrapper entfernt die Proxy-Variablen für die Web-Abrufe der Recherche-Agenten. Die gehen jetzt direkt ans Ziel.

Und hier kehrt ein Prinzip aus Teil 1 zurück: **Erzähl den Agenten nie vom rosa Elefanten.** Ich habe den Agenten nicht erklärt, dass der Proxy harmlos ist. Sonst schieben sie ab sofort jedes Problem auf ihn. Stattdessen ist der *Auslöser* verschwunden. Den Elefanten sieht weiterhin nur Ground Control.

## Ein Prinzip: Vertraue keinem Werkzeug blind deine Schlüssel an

Auf einen Satz verdichtet: **Ein Werkzeug, das deine Zugangsschlüssel oder deinen Datenverkehr anfasst, bekommt keinen Vertrauensvorschuss. Forke es, lies den Code, installiere aus deiner Kopie und aktualisiere nur bewusst.**

Das Setup hat dieses Prinzip zweimal bestätigt. Einmal bewusst, durch das Forken und Lesen der Tools. Und einmal spontan durch die Agenten, deren Fehlalarm zwar in der Sache danebenlag, aber die richtige Frage stellte. Misstrauen ist in einem agentischen Setup Hygiene.

## Die Schattenseiten

Doch bei aller Freude über den nahtlosen Wechsel: Das Setup hat seinen Preis.

- **Die Nutzungsbedingungen sind nicht auf so ein Setup zugeschnitten.** Anthropic schreibt in den [Rechtshinweisen zu Claude Code](https://code.claude.com/docs/en/legal-and-compliance#authentication-and-credential-use) über Drittentwickler: „developers may not collect, store, or intermediate Claude.ai credentials or session tokens". `cswap` speichert Tokens, und der Pin-Proxy vermittelt sie. Meine Lesart: Die Regel zielt auf Produkte, die fremde Nutzer über ihre Abos leiten. Ich nutze meine *eigenen* Abos auf meinem *eigenen* Rechner mit dem offiziellen Client, und niemand sonst bekommt Zugang. Das ist aber meine Interpretation und keine Freigabe durch Anthropic. Anthropic behält sich laut derselben Seite vor, Maßnahmen „without prior notice" durchzusetzen. Klar verboten ist in den [Consumer Terms](https://www.anthropic.com/legal/consumer-terms) dagegen das Teilen: „You may not share your Account login information […] or make your Account available to anyone else." Davon also Finger weg.
- **Eigene Forks kosten Pflege.** Bei jedem Upstream-Update heißt es: Diff lesen, neu installieren. Das ist der Preis dafür, keinem fremden Auto-Update zu vertrauen.
- **Ein MITM-Proxy ist ein großes Zugeständnis.** Er sieht den Anthropic-Verkehr im Klartext. Tragbar ist das nur, weil ich den Code gelesen habe und die Reichweite auf das Nötigste beschränkt ist.

## Fazit: Flawless weiterfliegen

Das Ziel ist erreicht: zwei Max-Abos, ein Kontowechsel im laufenden Betrieb, automatisch bevor ein Limit greift, und Remote Control überlebt den Wechsel. Kein `/logout`-`/login`-Tanz mehr, kein Bruch im Flow. Ground Control tankt um, Major Tom fliegt weiter.

Für mich überwiegt der Gewinn klar. Die Bodenstation läuft weiter, egal welcher Tank gerade brennt. Die wichtigste Erkenntnis ist dabei gar nicht technischer Natur, sie kam von den Agenten selbst: Gesundes Misstrauen gehört genau dorthin, wo man Werkzeugen die Schlüssel in die Hand drückt.

Wenn du selbst an ein Limit stößt: Fang mit `cswap list` an und sieh dir an, wie schnell deine Tanks wirklich leer werden. Und lies den Code, bevor du ihm deine Schlüssel gibst.

Übrigens hatte ich beim Schreiben wieder einen Bowie-Song im Ohr. Diesmal ist es die Fortsetzung von *Space Oddity*, in der Major Tom zurückkehrt. Bitte sehr, dein Ohrwurm:

<iframe src="https://www.youtube.com/embed/HyMm4rJemtI" title="David Bowie – Ashes to Ashes (Official Video)" style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 8px;" allowfullscreen loading="lazy"></iframe>

<small>Falls der Player nicht lädt: [direkt auf YouTube ansehen](https://youtu.be/HyMm4rJemtI).</small>

**Fragen, Feedback, eigene Basteleien?** Immer her damit. Und falls du Teil 1 verpasst hast: [Dort steht, wie die Bodenstation entstand.](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini)

<small>**Danke** an realiti4 für `claude-swap` und an Junyong Lee für `cswap-pin`. Beide Projekte sind offen, sauber getestet und gut lesbar. Genau das macht es möglich, ihnen nicht blind vertrauen zu müssen.</small>

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
