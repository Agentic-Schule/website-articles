---
title: 'Agentic Coding rund um die Uhr: Mehrere Claude-Max-Abos ausreizen, ohne Unterbrechung'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-09-28
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
  - MITM-Proxy
language: de
header: header.jpg
---

**Dein Wochenlimit in Claude Code ist bald erreicht? Keine Sorge, dafür gibt es eine Lösung. Usage-Credits und `/limit-reset` sind es nicht. Dieser Artikel zeigt, wie Claude Code stattdessen zwischen mehreren Max-Abos wechselt: automatisch, kurz vor dem Limit, ohne `/logout` und ohne dass Remote Control, die Fernsteuerung vom Handy, abreißt.**

## Inhalt

[[toc]]

## Wochenlimit erreicht: Was hilft und was nicht

### Erst nachsehen: `/usage`

Wie weit du bist, zeigt `/usage`. Laut [Befehlsübersicht](https://code.claude.com/docs/en/commands) zeigt der Befehl „session cost, plan usage limits, and activity stats" und schlüsselt auf, was gegen die Limits deines Plans zählt. Er läuft sogar, während Claude gerade antwortet. Diesen Wert solltest du kennen, bevor du dich für einen der folgenden Wege entscheidest.

### Modell und Effort bewusst wählen

Der günstigste Hebel kommt vor allen anderen: Nicht jede Aufgabe braucht das stärkste Modell mit dem höchsten *Effort*, also dem Denkaufwand, den das Modell pro Antwort treibt. Das Modell deiner Session gilt laut [Dokumentation](https://code.claude.com/docs/en/workflows) auch für die Agenten deiner Workflows, sofern nichts anderes festgelegt ist. Workflows sind Skripte, mit denen Claude Code viele Sub-Agenten parallel startet. Sag Claude deshalb ausdrücklich, welche Agenten mit welchem Modell und welchem Effort loslegen. Bei einem *Dynamic Workflow*, dessen Skript Claude selbst schreibt, genügt dafür ein Satz an die Hauptunterhaltung, etwa „die Recherche-Agenten mit Sonnet und Effort medium“. Claude übernimmt das in das Workflow-Skript und startet die Agenten entsprechend. Einfache Arbeit wie das Durchklicken einer Webseite läuft mit einem kleinen Modell und niedrigem Effort. Teures Denken bleibt dort, wo es zählt. Details stehen im Artikel über [10 Claude-Code-Befehle](https://agentic.schule/blog/2026-10-claude-code-commands#7-model-mehr-als-nur-modellwahl), Abschnitt `/model`.

### Keine Usage-Credits

Der naheliegende Knopf heißt `/usage-credits`, früher `/extra-usage`. Damit arbeitest du nach dem Limit gegen Bezahlung weiter. Laut [Hilfe-Center](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans) werden Usage-Credits „at standard API rates" abgerechnet, zusätzlich zum Abo. Vorab gekaufte [Bundles](https://support.claude.com/en/articles/14246112-buy-usage-bundles) sparen „up to 30%", bleiben aber API-Preise mit Rabatt.

Das Abo spielt in einer anderen Liga. Anthropic schrieb bei der Einführung der Wochenlimits selbst: „one user consumed tens of thousands in model usage on a $200 plan" ([X, 28.07.2025](https://x.com/AnthropicAI/status/1949898511287226425)). Wer regelmäßig ans Wochenlimit stößt, fährt aus meiner Sicht mit Usage-Credits in keiner Konstellation günstiger als mit einem weiteren Abo.

### Kein `/limit-reset`

Seit September taucht in Claude Code ein Befehl auf, der in keiner [Befehlsübersicht](https://code.claude.com/docs/en/commands) und in keinem Changelog steht: `/limit-reset`. Er ist im Befehlsmenü versteckt. Ein Blick in Claude Code 2.1.283 zeigt, dass sich dahinter zwei Programme verbergen, die jeweils ein Feature-Schalter auf dem Server freigibt:

- **Ein wöchentlicher Reset des 5-Stunden-Limits.** Der Hinweis im Programm lautet „reset your session limit now · uses weekly limit · 1/week", die Erfolgsmeldung endet mit „your weekly limit still applies". Das Wochenlimit bleibt also unberührt.
- **Ein Kontingent an Resets mit Ablaufdatum.** Es füllt die Limits wieder auf („{resets} left · use by {date}"). Wer es bekommt, entscheidet Anthropic.

Ob du einen Reset nutzen darfst, entscheidet ebenfalls der Server. Im Code sind Ablehnungsgründe hinterlegt, darunter `tier`, `tenure` (Kontoalter), `other_experiment` und `not_at_wall`, also „noch nicht am Limit". Angezeigt wird davon nichts. Die Meldung lautet in jedem dieser Fälle „A session-limit reset isn't available right now." Genau darüber häufen sich die Berichte: mindestens vier offene Issues seit Anfang September ([#93148](https://github.com/anthropics/claude-code/issues/93148), [#95810](https://github.com/anthropics/claude-code/issues/95810), [#97348](https://github.com/anthropics/claude-code/issues/97348), [#97581](https://github.com/anthropics/claude-code/issues/97581)), keines mit einer Antwort von Anthropic. Nutzer vermuten einen A/B-Test: „I think it's something they're A/B testing" ([#93148](https://github.com/anthropics/claude-code/issues/93148)).

Offiziell gibt es dagegen etwas anderes: Am 22. September hat Anthropic allen Pro-, Max- und Team-Kunden einen einmaligen Reset geschenkt, einlösbar bis zum 22. Oktober unter *Settings → Usage* ([X](https://x.com/ClaudeDevs/status/2102438803013333469)). Laut [Hilfe-Center](https://support.claude.com/en/articles/17007452-what-is-a-limit-reset) setzt er je nach Angebot das 5-Stunden- oder das Wochenlimit zurück. Einlösen lässt er sich nur im Browser oder in Claude Desktop, denn der Knopf „isn’t currently available on Claude Mobile or in Claude Code in your terminal or IDE". Hast du einen, nimm ihn mit.

Selbst ein funktionierender Reset verschafft dir aber nur einmal Luft. Wer jede Woche ans Limit stößt, steht in der nächsten Woche wieder dort.

### Ein weiteres Max-Abo

Bleibt der Weg, der wirklich trägt: ein **zweites Max-Abo**, bei Bedarf auch ein drittes oder viertes. Jedes bringt sein volles Kontingent zum Abo-Preis mit. Laut [Hilfe-Center](https://support.claude.com/en/articles/11049741-what-is-the-max-plan) kostet Max 5x 100 Dollar und Max 20x 200 Dollar im Monat.

## Das Problem: der Wechsel zwischen den Konten

Claude Code kennt immer nur *ein* angemeldetes Konto. Wechseln heißt `/logout`, dann `/login`, dann der OAuth-Flow im Browser. Bis dahin steht die Arbeit still.

Schlimmer ist der Moment, in dem das Limit mitten in der Arbeit zuschlägt. Bei mir laufen die Agenten rund um die Uhr auf einem Mac mini, der nie ausgeht. Wie er aufgebaut ist, steht in [Teil 1 dieser Reihe](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini). Erreicht ein Konto sein Limit, brechen laufende Sub-Agenten mit „Agent terminated early due to an API error: You've hit your session limit" ab. Laut zahlreichen Issue-Berichten und nach schmerzhafter eigener Erfahrung kommt von ihrer Arbeit oft nur ein Bruchstück zurück, und sie muss neu angestoßen werden ([#94770](https://github.com/anthropics/claude-code/issues/94770), [#74162](https://github.com/anthropics/claude-code/issues/74162), [#78231](https://github.com/anthropics/claude-code/issues/78231)). In [#94222](https://github.com/anthropics/claude-code/issues/94222) hat ein Nutzer sechs seiner Sessions ausgewertet: „449 subagents were cut off, only 8 were resumed by id […] The other 438 were re-dispatched from scratch."

Das ist besonders ärgerlich bei einem breiten Fächer. Startest du viele Agenten parallel mit einem teuren Modell, bringt genau dieser Lauf dein Konto ans Limit. Bricht er ab, ist die Arbeit weg, und ein zweiter Lauf kostet die Tokens noch einmal in voller Höhe. Lege deshalb vor jedem großen Lauf fest, mit welchem Modell und welchem Effort die Agenten loslegen, wie oben unter „Modell und Effort bewusst wählen“ beschrieben. Warum so ein Lauf viel kostet, steht im Artikel über [Graph Engineering](https://agentic.schule/blog/2026-09-graph-engineering#wann-sich-ein-graph-lohnt-und-wann-nicht).

Dazu kommt: Ein Kontowechsel trennt die **Remote-Control-Verbindung**, mit der ich vom Handy aus zusehe. Dasselbe gilt für Artefakte, also Seiten, die Claude Code auf claude.ai veröffentlicht. Auch sie gehören einem Konto.

Das Ziel ist also: **rechtzeitig vor dem Limit automatisch auf ein anderes Abo wechseln, ohne Abmelden, möglichst ohne abgebrochene Agenten und ohne die Fernsteuerung zu verlieren.** Dafür braucht es zwei Werkzeuge: eines, das die Anmeldung im laufenden Betrieb tauscht, und eines, das Remote Control dabei auf einem Konto hält.

## Kein Router nötig: Claude Code liest die Credentials neu

Wer Claude Code mit anderen Modellen betreiben will, greift meist zu einem Router wie [claude-code-router](https://github.com/musistudio/claude-code-router). Er hängt sich über `ANTHROPIC_BASE_URL` dazwischen, also die API-Adresse, die Claude Code anspricht, und leitet jede Anfrage weiter. Das ist hier nicht gefragt. Ich will weiterhin die echten Anthropic-Modelle nutzen, nur eben mal über Konto A und mal über Konto B.

Dafür braucht es keinen Router. Der Schlüssel liegt in einem Detail: **Claude Code liest seine Zugangsdaten neu ein, wenn sie sich ändern.** Liegen sie in einer Datei, liest Claude Code sie nach jeder Änderung neu, und die *nächste* Nachricht läuft bereits über das neue Konto. So beschreibt es die [Dokumentation von `claude-swap`](https://github.com/realiti4/claude-swap#tips), und so verhält es sich auf meinem mini. Dort liegen die Credentials als Datei unter `~/.claude/.credentials.json`. Sonst liegen sie unter macOS im Schlüsselbund. Claude Code puffert sie dort laut derselben Quelle etwa 30 Sekunden lang, danach greift auch dort der Wechsel.

Konkret heißt das: Wer diese Datei austauscht, wechselt das Konto. Ohne Neustart und ohne `/login`.

## Mehrere Abos im Wechsel einrichten

Das erledigt das Open-Source-Tool [`claude-swap`](https://github.com/realiti4/claude-swap) (Befehl: `cswap`, MIT-Lizenz). Es sichert pro Konto die Credentials und tauscht sie auf Zuruf aus. Es ist nicht auf zwei Konten beschränkt. Ich arbeite mit zwei, das Prinzip bleibt bei drei oder vier gleich. Wie ich es installiere, zeigt der nächste Abschnitt. Du meldest dich **einmal** pro Abo an, danach genügt:

```bash
cswap switch 2      # ab der nächsten Nachricht läuft alles über Abo 2
cswap switch 1      # zurück
cswap switch        # reihum zum nächsten Konto
cswap list          # Auslastung (5h/7d) aller Konten
```

Ein Detail meines Setups ist wichtig: Alle Sessions teilen sich **eine** globale Credential-Datei. Ein `cswap switch` bewegt darum alle Sessions auf das andere Abo. Das ist gewollt, wenn Konto A ans Wochenlimit stößt.

Die Konten registrierst du so:

```bash
cswap add            # das aktuelle Konto als Slot 1 aufnehmen
# in Claude Code einmal /login mit dem zweiten Konto
cswap add            # das zweite Konto als Slot 2 aufnehmen
# für jedes weitere Konto: /login, dann cswap add
cswap switch 1       # zurück auf Abo 1
```

> **⚠️ Achtung:** Vor dem zweiten `/login` kein `/logout` ausführen. Laut der [Anleitung von `claude-swap`](https://github.com/realiti4/claude-swap#add-more-accounts) kann Claude Code dabei den Refresh-Token des Kontos widerrufen, das du gerade verlässt. Mit diesem Token erneuert Claude Code abgelaufene Zugangsdaten, ohne ihn wäre der gesicherte Slot wertlos.

Der Browser-Login pro Konto ist der einzige Schritt, den kein Tool abnehmen kann. Danach ist er erledigt.

## Vertrauen ist gut, Forken ist besser

`cswap` fasst meine **OAuth-Tokens** an, also die Schlüssel zu meinen Konten. Bevor so ein Tool auf einem Rechner läuft, der nie ausgeht, will ich wissen, was es tut. Also lese ich zuerst den Quelltext, bevor ich `pipx install` tippe.

Die wichtigste Frage: Wohin geht der Netzwerkverkehr? Im Quelltext stehen nur Anthropics eigene Endpunkte (`api.anthropic.com`, `platform.claude.com`) und ein Versions-Check bei PyPI. Keine fremde Domain, keine Telemetrie. Das Paket wird über PyPIs *Trusted Publishing* aus einem GitHub-Workflow veröffentlicht, und das Repo bringt eine umfangreiche Testsuite mit. So weit, so vertrauenswürdig.

Trotzdem beziehe ich ein Tool, das meine Schlüssel hält, nicht per Auto-Update aus einer fremden Pipeline. Das größere Risiko sind künftige Releases: Ein bösartiges Update kommt als beiläufiges Upgrade herein. Das ist ein klassischer *Supply-Chain-Angriff*, also ein Angriff über die Lieferkette. Wie so etwas aussieht, zeigt der Artikel über [böswillige AI-Skills](https://agentic.schule/blog/2026-09-malicious-ai-skills). Deshalb gehe ich den sauberen Weg:

```bash
# in den eigenen Account forken und den geprüften Stand lokal auschecken
gh repo fork realiti4/claude-swap --clone
# ... Code lesen, dann aus der eigenen Kopie installieren:
pipx install ./claude-swap
# Updates nur bewusst: upstream holen, Diff lesen, neu installieren
```

`cswap` bringt mit `cswap upgrade` einen eigenen Update-Befehl mit, der die neueste Version von PyPI holt. Den nutze ich nicht. So läuft nur Code, den ich gelesen habe.

## Remote Control: Der Pin hält die Session

Bleibt das zweite Problem: Der Kontowechsel trennt die Fernsteuerung. Der Grund ist strukturell. Eine Remote-Control-Session gehört dem Konto, mit dessen Token sie erstellt wurde. Tauschst du das Konto, verlieren Handy und Web die Session, und auf dem alten Konto stapeln sich verwaiste Sitzungen (so beschrieben im [README von cswap-pin](https://github.com/codeslake/cswap-pin#the-problem)). Dasselbe gilt für Artefakte: Nach einem Wechsel schlägt das erneute Veröffentlichen fehl.

Die Lösung heißt [`cswap-pin`](https://github.com/codeslake/cswap-pin) und stammt von Junyong Lee. Es ist ein **lokaler Proxy**, der genau eine Sache tut: Auf den Anthropic-Routen für Remote Control und Artefakte setzt er den Token des *gepinnten* Kontos ein. Die Inferenz über `/v1/messages` reicht er unverändert durch. Sie folgt also weiter dem Wechsel. Der Besitz der Cloud-Objekte bleibt, die Rechenlast wandert.

```bash
cswap pin 1          # Remote Control und Artefakte bleiben auf Konto 1
```

Die Anbindung an `cswap` liegt zum Zeitpunkt dieses Artikels als [offener Pull Request](https://github.com/realiti4/claude-swap/pull/210) im Upstream-Projekt. Bis zum Merge gibt es `cswap pin` also nur, wenn du den PR in deinen Fork von `claude-swap` übernimmst. Den Proxy selbst installiere ich ebenfalls aus einem eigenen Fork und hänge ihn in dieselbe Umgebung:

```bash
cd claude-swap
gh pr checkout 210 --repo realiti4/claude-swap   # den Pull Request in den Fork holen
pipx install --force .
cd ..
gh repo fork codeslake/cswap-pin --clone
pipx inject claude-swap ./cswap-pin
```

Technisch ist der Proxy ein *Man-in-the-Middle* (MITM). Er entschlüsselt die HTTPS-Verbindung zu Anthropic lokal. Dafür nutzt er eine eigene Zertifizierungsstelle (engl. *Certificate Authority*, CA). Sie ist nicht systemweit installiert. `cswap pin` trägt Proxy-Adresse und CA in den `env`-Block von `~/.claude.json` ein, und Claude Code übernimmt sie in den eigenen Prozess. Das ist dasselbe Verfahren, das Firmen-Proxys nutzen, und Claude Code unterstützt es [offiziell](https://code.claude.com/docs/en/network-config) über `HTTPS_PROXY` und `NODE_EXTRA_CA_CERTS`. Der Proxy sieht damit den Anthropic-Verkehr im Klartext. Auch ihn habe ich geforkt und gelesen, bevor er auf die Kiste durfte. Es sind also zwei Forks in meinem Account. Bei einem Werkzeug, das den Datenverkehr sieht, ist das Pflicht.

## Automatisch wechseln: `cswap auto` als Dienst

Umschalten von Hand ist nett. Der Gewinn liegt in der Automatik: `cswap auto` prüft die Auslastung und schaltet **von selbst** auf das Abo mit dem meisten Spielraum, sobald das aktive Konto eine Schwelle erreicht. Standardmäßig liegt sie bei 90 Prozent des 5-Stunden- oder Wochenfensters.

Mit `--once` macht der Befehl genau einen Durchlauf und beendet sich. Die Mindestpause zwischen zwei Wechseln (*Cooldown*) und den Zustand speichert das Tool auf der Platte, darum reicht ein einzelner Durchlauf pro Minute. Das passt zu `launchd`, dem Dienst-Manager von macOS, und kein Terminal muss offen bleiben. Bei mir läuft das als LaunchDaemon im Minutentakt, also als Systemdienst, der ohne Anmeldung startet. Wichtig ist der Schlüssel `UserName`: Ohne ihn läuft ein LaunchDaemon als root und tauscht die Credentials im falschen Home-Verzeichnis. Die Datei gehört nach `/Library/LaunchDaemons/` und wird mit `sudo launchctl bootstrap system /Library/LaunchDaemons/cswap-auto.plist` geladen. Im Beispiel steht `DEIN-NAME` für deinen Benutzernamen.

```xml
<key>Label</key>
<string>cswap-auto</string>
<key>ProgramArguments</key>
<array>
  <string>/Users/DEIN-NAME/.local/bin/cswap</string>
  <string>auto</string>
  <string>--once</string>
  <string>--json</string>
</array>
<key>UserName</key>
<string>DEIN-NAME</string>
<key>StartInterval</key>
<integer>60</integer>
```

Im Alltag ist das Ergebnis unspektakulär, und so soll es sein. Irgendwann erreicht Konto 1 die Schwelle, der Dienst schaltet auf das praktisch unberührte Konto 2, und ich arbeite weiter. Ich merke davon nichts.

## Fehlalarm: Die Agenten wittern einen Angriff

Auf dem mini lief ein mehrstufiger Lektorats-Workflow: Recherche-Agenten prüfen die Fakten eines Artikels im Web. Dabei schlugen diese Agenten **Alarm**. Sie hielten die abgerufenen Inhalte für manipuliert und führten die Proxy-Umgebungsvariablen und die fremde CA als Beleg für einen Angriff an.

Das ist ein Feature. Die Agenten konnten nicht wissen, woher der Proxy stammt. Aus ihrer Sicht saß da ein Man-in-the-Middle mit eigener CA, und das *hätte* Malware sein können. So soll ein wachsamer Prüfer reagieren.

Hatten sie recht? Das lässt sich prüfen. Ein Abruf von `example.com` durch den Proxy kommt mit dem *echten* öffentlichen Zertifikat zurück. Hätte der Proxy hier mitgelesen, wäre es seines gewesen. Auch der Quelltext bestätigt das: Der Proxy entschlüsselt **ausschließlich** `api.anthropic.com`. Jeden anderen Host reicht er als blinden Tunnel durch.

Der Verkehr war also echt. Der Alarm zeigt trotzdem eine Falle: Setzt du die Proxy-Variablen und die CA für Claude Code, erbt sie jede Shell, die ein Agent startet. Jeder Befehl sieht dann den Proxy, und jeder Download läuft durch ihn. Der Pin braucht aber nur den Claude-Prozess selbst. Darum entfernt eine einzige Zeile in `~/.zshenv` die Variablen aus jeder Agenten-Shell:

```bash
unset HTTPS_PROXY https_proxy HTTP_PROXY http_proxy ALL_PROXY all_proxy NODE_EXTRA_CA_CERTS
```

Die Shell-Befehle der Agenten laufen bei mir über zsh, und zsh liest `~/.zshenv` bei jedem Aufruf. Der Claude-Prozess behält den Pin, die Agenten sehen ihn in ihren Shells nicht mehr.

Und hier kehrt ein Prinzip aus [Teil 1](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini#ein-prinzip-erzähl-den-agenten-nie-vom-rosa-elefanten) zurück: **Erzähl den Agenten nie vom rosa Elefanten.** Weiß eine Session von einem exotischen Setup, erklärt sie sich jedes Problem zuerst damit. Darum erkläre ich den Agenten nicht, dass der Proxy harmlos ist. Stattdessen sehen die Agenten in ihren Shells den Proxy gar nicht mehr. Von dem Elefanten weiß weiterhin nur ich.

## Ein Prinzip: Vertraue keinem Werkzeug blind deine Schlüssel an

**Ein Werkzeug, das deine Zugangsschlüssel oder deinen Datenverkehr anfasst, bekommt keinen Vertrauensvorschuss. Forke es, lies den Code, installiere aus deiner Kopie und aktualisiere nur bewusst.**

Das Setup hat dieses Prinzip zweimal bestätigt. Einmal bewusst, durch das Forken und Lesen der Tools. Und einmal durch die Agenten, deren Alarm die richtige Frage stellte. Misstrauen ist in einem agentischen Setup Hygiene.

Bleibt die Frage, ob Anthropic so ein Setup überhaupt erlaubt.

## Ist das erlaubt?

Das Setup geht bis an die Grenzen von Anthropics Vorgaben, bleibt aber nach meiner Lesart innerhalb. Es setzt nur an Stellen an, die Claude Code offen unterstützt:

- **Claude Code bleibt unverändert.** Kein Patch, kein Eingriff ins Programm. Selbst für Anbieter, die Claude Code in eigene Produkte einbauen, zieht Anthropic hier die Linie: „The Claude Code binary must not be modified." ([Rechtshinweise](https://code.claude.com/docs/en/legal-and-compliance#can-customers-offer-claude-code-in-their-products))
- **Jede Anmeldung läuft über Anthropics eigenen Login.** Das verlangen die [Rechtshinweise zu Claude Code](https://code.claude.com/docs/en/legal-and-compliance#authentication-and-credential-use): „sign-in to a Claude account must complete through Anthropic's own flow". `cswap` sichert danach nur die Tokens, die Claude Code ohnehin selbst auf der Platte ablegt. Es automatisiert, was du auch von Hand tun könntest: `/logout`, `/login`, weiterarbeiten.
- **Der Proxy nutzt einen offiziellen Weg.** Proxys mit TLS-Inspektion unterstützt Claude Code laut [Dokumentation](https://code.claude.com/docs/en/network-config) ausdrücklich, über `HTTPS_PROXY` und eine eigene CA. Der Proxy sitzt außerhalb von Claude Code und ändert nur den Datenverkehr.
- **Es sind ausschließlich meine eigenen Abos.** Niemand sonst bekommt Zugang. Das Teilen von Konten verbieten die [Consumer Terms](https://www.anthropic.com/legal/consumer-terms) klar: „You may not share your Account login information […] or make your Account available to anyone else."

## Das Kleingedruckte: Grenzen und Trade-offs

Doch bei aller Freude über den nahtlosen Wechsel: Ein paar Punkte solltest du kennen.

- **Eine ausdrückliche Freigabe gibt es nicht.** Die Regel für Drittentwickler ist weit gefasst: „developers may not collect, store, or intermediate Claude.ai credentials or session tokens". Wörtlich genommen träfe sie jedes Tool, das einen Token speichert. Gemeint sind nach meiner Lesart Produkte, die fremde Nutzer über ihre Abos leiten. Anthropic behält sich vor, Maßnahmen „without prior notice" durchzusetzen.
- **Mehr Konten heißt nicht unendlich.** Sind alle Konten an der Schwelle, findet `cswap auto` kein Ziel mehr und meldet das mit Exit-Code 3 („no viable target / all exhausted“). Und jedes weitere Abo kostet seinen vollen Preis.
- **Der Pin hängt an einem offenen Pull Request.** Bis PR #210 gemergt ist, läuft `cswap pin` nur aus dem eigenen Fork.
- **Eigene Forks kosten Pflege.** Bei jedem Upstream-Update heißt es: Diff lesen, neu installieren. Das ist der Preis dafür, keinem fremden Auto-Update zu vertrauen.
- **Der Proxy sieht den Anthropic-Verkehr im Klartext.** Das gilt für jeden Proxy mit TLS-Inspektion, auch für die in Firmennetzen. Tragbar ist das, weil ich den Code gelesen habe und die Reichweite auf das Nötigste beschränkt ist.

## Fazit

Mehrere Max-Abos, ein Kontowechsel im laufenden Betrieb, automatisch bevor ein Limit greift, und Remote Control überlebt den Wechsel. Kein `/logout` und `/login` mehr, und in der Regel keine abgebrochenen Agenten.

Für mich überwiegt der Gewinn klar. Mit zwei 20x-Abos stoße ich kaum noch an ein Wochenlimit, und auf Usage-Credits muss ich nie schauen.

Wenn du selbst ans Limit stößt: Sieh mit `/usage` nach, wie weit du bist, und mit `cswap list`, wie viel Spielraum alle Konten zusammen haben. Leg vor jedem großen Lauf fest, mit welchem Modell und welchem Effort deine Agenten loslegen. Und lies den Code, bevor du ihm deine Schlüssel gibst.

Übrigens hatte ich beim Schreiben wieder einen Bowie-Song im Ohr, wie schon bei [Teil 1](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini). Diesmal ist es die Fortsetzung von *Space Oddity*, in der Major Tom zurückkehrt. Bitte sehr, dein Ohrwurm:

<iframe src="https://www.youtube.com/embed/HyMm4rJemtI" title="David Bowie – Ashes to Ashes (Official Video)" style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 8px;" allowfullscreen loading="lazy"></iframe>

<small>Falls der Player nicht lädt: [direkt auf YouTube ansehen](https://youtu.be/HyMm4rJemtI).</small>

**Fragen, Feedback, eigene Basteleien?** Immer her damit. Und wie der Mac mini aufgebaut ist, auf dem das alles läuft, steht in [Teil 1](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini).

<small>**Danke** an realiti4 für `claude-swap` und an Junyong Lee für `cswap-pin`. Beide Projekte sind offen, getestet und gut lesbar. Das macht es möglich, ihnen nicht blind vertrauen zu müssen.</small>

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
