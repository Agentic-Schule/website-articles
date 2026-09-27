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
  - Supply Chain
  - Fork
  - MITM Proxy
  - Syncthing
  - Homelab
language: de
header: header.jpg
---

Im ersten Teil habe ich einen Mac mini zur „Bodenstation" umgebaut: eine immer laufende Maschine, auf der meine Agenten weiterarbeiten, während ich vom MacBook, aus dem Browser oder vom Handy aus zusehe und eingreife. Ganz am Ende stand ein beiläufiger Satz, der sich als Vorbote entpuppte: Weil der Agent jederzeit erreichbar ist, reize ich die großzügigen Limits der Claude-Max-Subscription „inzwischen wirklich gnadenlos aus".

**Genau da setzt dieser Teil an. Wenn die Bodenstation nie ausgeht, verbrennt sie rund um die Uhr Treibstoff — und irgendwann ist der Tank leer.** Dieser Artikel erzählt, wie aus einem zweiten Abo ein *nahtloser Tankwechsel im Flug* wurde: Ground Control schaltet das Konto um, und Major Tom fliegt einfach weiter — ohne es zu merken.

Es ist zugleich eine kleine Geschichte über Vertrauen: über einen MITM-Proxy, den ich selbst gebaut habe, über einen Fork, den ich selbst auditiert habe — und über den Moment, in dem meine eigenen Agenten diesen Proxy für einen Angriff hielten.

> 🛰️ Wer Teil 1 nicht kennt: Der Mac mini ist die Bodenstation, das MacBook die mobile Rakete, die andockt und wieder abhebt. *Ground Control to Major Tom.*

## Inhalt

[[toc]]

## Das Problem: Ein Tank reicht nicht mehr

Ein always-on Setup hat eine unerwartete Nebenwirkung: Man verbraucht mehr. Die Agenten laufen nachts weiter, ich werfe unterwegs Aufgaben rein, mehrere Sessions arbeiten parallel. Das 5-Stunden-Fenster und vor allem das Wochenlimit der Max-Subscription sind großzügig — aber eben nicht unendlich. Irgendwann stand ich mittags vor dem gefürchteten „you've hit your weekly limit".

Die naheliegende Lösung: ein **zweites Max-Abo**. Zwei Tanks statt einem. Nur — Claude Code kennt immer nur *ein* eingeloggtes Konto. Wechseln heißt: `/logout`, dann `/login`, dann der Browser-OAuth-Flow. Jedes Mal. Über den Tag zwanzigmal. Das ist kein Workflow, das ist eine Strafe.

Und schlimmer: Der Wechsel riss mir regelmäßig die **Remote-Control-Verbindung** ab — genau das Feature aus Teil 1, mit dem ich vom Handy aus zusehe. Ein Kontowechsel, und die Session am Telefon war tot.

Was ich wollte, klang simpel: **im laufenden Betrieb zwischen zwei Abos umschalten, ohne ausloggen, ohne die Fernsteuerung zu verlieren.** Ich vermutete, so etwas wie einen „Router" zu brauchen, der die Subscription tauscht.

## Umschalten von Hand killt den Flow

Bevor es um Automatik geht, kurz zum Kern des Schmerzes. Der `/logout`/`/login`-Tanz ist nicht nur lästig, er ist auch *teuer im Kontext*: Jede neue Anmeldung ist ein Bruch, der Browser will interagiert werden, und die laufende Arbeit steht.

Ich habe zuerst geglaubt, ich bräuchte einen dieser Proxys, mit denen man die `ANTHROPIC_BASE_URL` umbiegt, um Claude Code mit fremden oder lokalen Modellen zu betreiben. Wollte ich aber gar nicht. Ich wollte weiterhin die echten Anthropic-Modelle — nur eben mal über Konto A, mal über Konto B.

## Die Entdeckung: Claude Code liest die Credentials live neu

Der Durchbruch war eine Beobachtung, die ich erst nicht glauben wollte: **Claude Code liest sein Zugangs-Token bei jedem API-Aufruf frisch von der Platte.** Auf meinem headless mini liegt es als Datei (`~/.claude/.credentials.json`); auf dem Desktop üblicherweise im Schlüsselbund.

Das heißt: Wenn man diese Datei austauscht, läuft die *nächste* Nachricht bereits auf dem anderen Konto — **ohne Neustart, ohne `/login`.** Kein Router, der Requests umbiegt, ist nötig. Ein simpler Datei-Tausch genügt. Diese Erkenntnis war die halbe Miete.

## Zwei Abos, ein Switch im laufenden Betrieb

Genau das macht das Open-Source-Tool [`claude-swap`](https://github.com/realiti4/claude-swap) (CLI-Name `cswap`): Es sichert pro Konto die Credentials und tauscht sie atomar aus. Man loggt sich **einmal** pro Abo ein, danach nur noch:

```bash
cswap switch 2      # ab der nächsten Nachricht läuft alles auf Abo 2
cswap switch 1      # zurück
cswap list          # Live-Auslastung (5h/7d) beider Konten
```

Ein wichtiges Detail meines Setups: Ich habe **eine** globale Credential-Datei, die sich alle Sessions teilen. Ein `cswap switch` bewegt darum *die ganze Flotte* auf das andere Abo — und genau das will ich, wenn Konto A ans Wochenlimit stößt.

> **🛠️ Selbst nachbauen — Konten registrieren**
> ```bash
> cswap add            # aktuelles Konto als Slot 1 aufnehmen
> # danach in Claude Code einmal /login mit dem ZWEITEN Konto (NICHT /logout!)
> cswap add            # das zweite Konto als Slot 2 aufnehmen
> cswap switch 1       # Standard zurück auf Abo 1
> ```
> Der einzige nicht automatisierbare Schritt ist der Browser-Login je Konto — den kann kein Tool skripten. Danach nie wieder.

## Vertrauen ist gut, selber bauen ist besser

Und hier wurde ich hellhörig. `cswap` fasst meine **OAuth-Tokens** an — also die Schlüssel zu meinen Konten. Bevor so ein Tool auf meinem always-on Rechner läuft, will ich wissen, was es tut.

Also habe ich mir den Quelltext angesehen, statt blind `pip install` zu tippen: Wohin geht Netzwerkverkehr? Nur zu Anthropics eigenen Endpunkten plus ein Versions-Check bei PyPI — keine fremde Domain, keine Telemetrie, kein `eval`. Der Autor ist ein langjähriger, real existierender Entwickler, das Paket wird über PyPIs „Trusted Publishing" veröffentlicht, es hat eine große Testsuite. So weit, so vertrauenswürdig.

Trotzdem: Ein Tool, das meine Schlüssel hält, will ich nicht per Auto-Update aus einer fremden Pipeline beziehen. Das eigentliche Risiko ist nie der Code von *heute*, sondern das bösartige Release von *morgen*, das als beiläufiges Upgrade hereinkommt. Deshalb habe ich den sauberen Weg gewählt:

> **🛠️ Selbst nachbauen — Fork statt Vertrauensvorschuss**
> ```bash
> # in die eigene Org forken, exakten Stand pinnen, aus der Quelle bauen
> gh repo fork realiti4/claude-swap
> # ... auditieren, dann lokal installieren (kein PyPI-Auto-Upgrade):
> pipx install ~/src/claude-swap
> # Updates nur bewusst: git fetch upstream -> Diff lesen -> neu bauen. NIE 'cswap upgrade'.
> ```
> So läuft nur Code, den *ich* gelesen und gebaut habe. Der Vertrauens-Vorschuss geht nur noch an mich selbst.

## Remote Control überlebt den Wechsel

Blieb das zweite Problem: Der Kontowechsel killte die Fernsteuerung. Der Grund ist strukturell — eine Remote-Control-Session „gehört" dem Konto, das sie erstellt hat. Tauscht man das Konto, verliert Handy und Web die Session, und auf dem alten Konto stapeln sich Geister-Sitzungen.

Die Lösung ist ein **lokaler Proxy**, der genau eine Sache tut: Auf den Anthropic-Routen für Remote Control und Artefakte behält er das *gepinnte* Konto bei, während die eigentliche Inferenz dem Wechsel folgt. Nur diese eine Trennung — Besitz der Cloud-Assets bleibt, Rechenlast wandert.

Ehrlich muss man sagen, was das technisch bedeutet: Der Proxy terminiert dafür TLS lokal (eine eigene CA, die nur der Claude-Prozess kennt). Ich habe auch ihn geforkt, auditiert und selbst gebaut, bevor er auf die Kiste durfte — bei einem Werkzeug, das den Datenverkehr sieht, ist das Pflicht, kein Bonus.

## Der Autopilot: Ground Control tankt selbst um

Manuell umschalten ist nett, aber der eigentliche Gewinn ist die Automatik. Ein kleiner Dienst prüft im Minutentakt die Auslastung und schaltet **von selbst** auf das frische Abo, bevor das aktive ans Limit läuft.

> **🛠️ Selbst nachbauen — Auto-Switch als Dienst (kein offener Shell nötig)**
> ```bash
> # ein LaunchDaemon, der alle 60s einen Tick macht:
> cswap auto --once     # prüft Auslastung, schaltet ggf., beendet sich
> ```
> Cooldown und Zustand persistiert das Tool auf der Platte — perfekt für einen `launchd`-Timer. Kein Terminal muss offen bleiben.

Der Lohn kam ein paar Tage später, ganz unspektakulär. Mittags, ich arbeitete ahnungslos weiter, sprang der Autopilot: Konto 1 hatte 90 % des Wochenlimits erreicht, der Dienst schaltete auf Konto 2 (das bei 9 % stand). Ich habe es **nicht gemerkt** — ich konnte einfach flawless weiterarbeiten. Genau das war das Ziel.

## Als die eigenen Agenten Alarm schlugen

Und dann kam die schönste Wendung der ganzen Geschichte — eine, die mich zuerst erschreckte und dann stolz machte.

Ich hatte einen mehrstufigen Lektorats-Workflow laufen: Recherche-Agenten prüfen die Fakten eines Artikels im Web. Plötzlich meldeten diese Fact-Check-Agenten **Alarm**. Sie hielten die aus dem Web geholten Inhalte für gefälscht, zitierten die Proxy-Umgebungsvariablen und die selbstsignierte CA als „Quellen-Manipulation" und „Angriff". Sie sahen einen MITM-Proxy — und taten genau das, was ein wachsamer Prüfer tun soll: **Sie schlugen Alarm.**

Mein erster Gedanke: *Großartig.* Denn sie konnten ja nicht wissen, dass ich den Proxy selbst gebaut hatte. Aus ihrer Sicht saß da ein Man-in-the-Middle mit eigener CA — das *hätte* Malware sein können. Dass die Agenten misstrauisch wurden, ist ein Feature, kein Bug.

Der zweite Gedanke war die Pflicht zur Ehrlichkeit: **Hatten sie recht?** Also habe ich empirisch geprüft, statt zu beschwichtigen. Ein Abruf von `example.com` durch den Proxy kam mit dem *echten* öffentlichen Zertifikat zurück, nicht mit meiner Proxy-CA — hätte der Proxy hier mitgelesen, wäre das Zertifikat seines gewesen und die Prüfung fehlgeschlagen. Die Hugging-Face-API lieferte echte Daten. Und das „401 statt 404", das ein Agent als Manipulation wertete, ist schlicht das normale Verhalten von Hugging Face. Auch im Quelltext bestätigt: Der Proxy entschlüsselt **ausschließlich** die Anthropic-Hosts; alles andere wird unangetastet durchgetunnelt.

Ergebnis: Die Agenten hatten sich in den *Fakten* geirrt (der Verkehr war echt) — aber im *Instinkt* recht behalten. Denn ihr Alarm brachte eine echte Design-Schwäche ans Licht: **Es war völlig unnötig, überhaupt allen Verkehr durch den Proxy zu schicken.** Der Pin braucht nur die Anthropic-Verbindung. Also habe ich die Reichweite eingedampft: Ein winziger Wrapper streicht die Proxy-Variablen für alle Web-Abrufe der Recherche-Agenten — die gehen jetzt direkt ans Ziel.

Und hier kommt ein Prinzip aus Teil 1 zurück, nur invers angewendet: Ich habe die Agenten **nicht** darüber aufgeklärt, dass der Proxy harmlos ist. Täte ich das, würden sie fortan jedes Problem darauf schieben. Stattdessen habe ich den *Auslöser* unsichtbar gemacht. Der Elefant bleibt im Nebenzimmer — nur Ground Control kennt ihn.

## Ein Prinzip: Vertraue keinem Werkzeug blind deine Schlüssel an

Wenn ich diesen ganzen Umweg auf einen Satz eindampfe, dann diesen: **Ein Werkzeug, das deine Zugangsschlüssel oder deinen Datenverkehr anfasst, verdient keinen Vertrauensvorschuss — forke es, lies den Code, bau es selbst, und friere die Version ein.**

Das Schöne war, dass mein Setup dieses Prinzip zweimal validiert hat. Einmal von mir, bewusst: durch das Forken und Auditieren der Tools. Und einmal von den Agenten, spontan: durch ihren Fehlalarm, der zwar in der Sache daneben lag, aber die richtige Frage stellte. Misstrauen ist in einem agentischen Setup keine Paranoia, sondern Hygiene.

## Fazit: Flawless weiterfliegen

Das Ziel ist erreicht: zwei Max-Abos, ein Konto-Wechsel im laufenden Betrieb, automatisch bevor ein Limit greift, und Remote Control überlebt den Wechsel. Kein `/logout`/`/login`-Tanz mehr, kein Bruch im Flow. Ground Control tankt um, Major Tom fliegt weiter.

Ehrlich bleiben will ich auch hier:

- **Es ist eine Grauzone-nahe Bastelei — aber der akzeptierte Teil davon.** Es sind meine *eigenen* Abos, gewechselt über den *offiziellen* Client. Was Anthropic verbietet, ist das Gegenteil: Tokens durch fremde Relay-Server pumpen, Konten teilen oder weiterverkaufen. Davon Finger weg.
- **Selber bauen kostet Pflege.** Bei jedem Upstream-Update heißt es: Diff lesen, neu auditieren, neu bauen. Kein `cswap upgrade`. Das ist der Preis dafür, keinem fremden Auto-Update zu vertrauen.
- **Ein MITM-Proxy ist ein großes Vertrauens-Zugeständnis** — er sieht allen Anthropic-Verkehr im Klartext. Tragbar nur, weil selbst gebaut und auditiert, und auf das Nötigste reduziert.

Für mich überwiegt der Gewinn klar: Die Bodenstation läuft weiter, egal welcher Tank gerade brennt. Und die vielleicht wichtigste Lektion war gar nicht technischer Natur, sondern kam von den Agenten selbst — dass gesundes Misstrauen genau dort ansetzt, wo man Werkzeugen die Schlüssel in die Hand drückt.

Beim Schreiben hatte ich, wie sollte es anders sein, wieder einen Bowie-Song im Ohr — diesmal die offizielle Fortsetzung von *Space Oddity*, in der Major Tom zurückkehrt. Bitte sehr, dein Ohrwurm:

<!-- TODO: Video-ID für "Ashes to Ashes" (offizielles Video) verifizieren und unten einsetzen -->
<iframe src="https://www.youtube.com/embed/CMThz7eQ6K0" title="David Bowie – Ashes to Ashes (Official Video)" style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 8px;" allowfullscreen loading="lazy"></iframe>

<small>Falls der Player nicht lädt: [auf YouTube suchen: David Bowie – Ashes to Ashes](https://www.youtube.com/results?search_query=david+bowie+ashes+to+ashes+official+video).</small>

**Fragen, Feedback, eigene Basteleien?** Immer her damit. Und falls du Teil 1 verpasst hast: Dort steht, wie die Bodenstation überhaupt entstand.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
