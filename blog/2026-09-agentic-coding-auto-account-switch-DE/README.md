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

**Dein Wochenlimit in Claude Code ist bald erreicht? Keine Sorge, dafür gibt es eine Lösung. Usage-Credits und `/limit-reset` sind es nicht. Dieser Artikel zeigt, wie du deine Umgebung mit zwei Open-Source-Werkzeugen so einrichtest, dass Claude Code zwischen mehreren Max-Abos wechselt: automatisch, kurz vor dem Limit, ohne manuelles `/login` und ohne dass Remote Control unterbrochen wird.**

## Inhalt

[[toc]]

## Wochenlimit erreicht: Was hilft und was nicht

Das Wochenlimit ist **der** schlimmste Produktivitätskiller.

### Erst nachsehen: `/usage`

Wie weit du bist, zeigt `/usage`. Wie du der [Befehlsübersicht](https://code.claude.com/docs/en/commands) entnehmen kannst, zeigt der Befehl „session cost, plan usage limits, and activity stats" und schlüsselt auf, was gegen die Limits deines Plans zählt. Diesen Wert solltest du kennen, bevor du dich für einen der folgenden Wege entscheidest.

### Modell und Effort bewusst wählen

Der günstigste Hebel kommt vor allen anderen: Nicht jede Aufgabe braucht das stärkste Modell mit dem höchsten *Effort*, also dem Denkaufwand, den das Modell pro Antwort treibt. Das Modell deiner Session gilt laut [Dokumentation](https://code.claude.com/docs/en/workflows) auch für die Agenten deiner Workflows, sofern nichts anderes festgelegt ist. Workflows sind Skripte, mit denen Claude Code viele Subagenten parallel startet. Sag Claude deshalb ausdrücklich, welche Agenten mit welchem Modell und welchem Effort loslegen. Bei einem *Dynamic Workflow*, dessen Skript Claude selbst schreibt, genügt dafür ein Satz an die Hauptunterhaltung, etwa „die Recherche-Agenten mit Sonnet und Effort medium“. Claude übernimmt das in das Workflow-Skript und startet die Agenten entsprechend. Für einfache Arbeit wie das Durchklicken einer Webseite sind ein kleines Modell und niedriger Effort schneller und günstiger. Teures Denken sollte nur dort eingesetzt werden, wo es auch notwendig ist. Wie du Modell und Effort einstellst, steht im Artikel über [10 Claude-Code-Befehle](https://agentic.schule/blog/2026-10-claude-code-commands#7-model-mehr-als-nur-modellwahl), Abschnitt `/model`. Was Workflows sind und was ein Workflow mit vielen Subagenten kostet, erklärt der Artikel über [Graph Engineering](https://agentic.schule/blog/2026-09-graph-engineering#dynamic-workflows-claude-schreibt-das-skript). Dass auch Schleifen ordentlich Tokens verbrauchen, zeigt der Artikel über [Loop Engineering](https://agentic.schule/blog/2026-09-loop-engineering#was-die-pause-kostet).

### Keine Usage-Credits

Der naheliegende Weg ist das Kommando `/usage-credits`, früher `/extra-usage`. Alternativ schaltest du Usage-Credits auf claude.ai unter *Settings → Usage* ein, auf Wunsch mit automatischem Nachkauf (*Auto-reload*). Damit arbeitest du nach dem Limit gegen Bezahlung weiter. Laut [Hilfe-Center](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans) werden Usage-Credits „at standard API rates" abgerechnet, zusätzlich zum Abo. Vorab gekaufte [Bundles](https://support.claude.com/en/articles/14246112-buy-usage-bundles) sparen „up to 30%", bleiben aber API-Preise mit wenig Rabatt.

Das Abo spielt in einer anderen Liga. Anthropic schrieb bei der Einführung der Wochenlimits selbst: „one user consumed tens of thousands in model usage on a $200 plan" ([X, 28.07.2025](https://x.com/AnthropicAI/status/1949898511287226425)). Wer regelmäßig ans Wochenlimit stößt, fährt aus meiner Sicht mit Usage-Credits in keiner Konstellation günstiger als mit einem weiteren Abo.

### Kein `/limit-reset`

In Claude Code gibt es den Befehl `/limit-reset`. Dokumentiert ist er kaum: Er steht in keiner [Befehlsübersicht](https://code.claude.com/docs/en/commands) und in keinem Changelog, im Befehlsmenü ist er versteckt. Limit-Resets selbst bewirbt Anthropic dagegen offensiv auf Social Media. Meine Vermutung: auch deshalb, weil OpenAI dasselbe anbietet. In Codex lassen sich verdiente Resets seit Juni direkt über `/usage` einlösen ([openai/codex#28154](https://github.com/openai/codex/pull/28154)). Einmal „Gehe über Los“ klingt ja auch ziemlich verlockend.

Ein Blick in den Code von Claude Code zeigt, dass sich hinter `/limit-reset` zwei Varianten verbergen, die jeweils ein Feature-Schalter auf dem Server freigibt:

- **Ein wöchentlicher Reset des 5-Stunden-Limits.** Der Hinweis im Programm lautet „reset your session limit now · uses weekly limit · 1/week", die Erfolgsmeldung endet mit „your weekly limit still applies". Das Wochenlimit bleibt also unberührt. Am 5-Stunden-Limit scheitert es bei mir allerdings eher selten. Der Killer ist das Wochenlimit.
- **Ein Kontingent an Resets mit Ablaufdatum.** Es füllt die Limits wieder auf („{resets} left · use by {date}"). Wer es bekommt und welche Magie in der Berechnung steckt, das weiß wie immer nur Anthropic.

Ob du einen Reset nutzen darfst, entscheidet ebenfalls der Server. Im Code sind Ablehnungsgründe hinterlegt, darunter `tier`, `tenure` (Kontoalter), `other_experiment` und `not_at_wall`, also „noch nicht am Limit". Angezeigt wird davon nichts. Die Meldung lautet in jedem dieser Fälle „A session-limit reset isn't available right now." Bei mir hat das erste Max-Abo den Befehl akzeptiert, das zweite nicht, ohne jede Begründung. Nicht sehr transparent. Vermutlich lag es am Kontoalter, also an `tenure`. Über abgelehnte Resets ohne Begründung häufen sich die Berichte: mindestens vier offene Issues seit Anfang September ([#93148](https://github.com/anthropics/claude-code/issues/93148), [#95810](https://github.com/anthropics/claude-code/issues/95810), [#97348](https://github.com/anthropics/claude-code/issues/97348), [#97581](https://github.com/anthropics/claude-code/issues/97581)), keines mit einer Antwort von Anthropic. Nutzer vermuten einen A/B-Test: „I think it's something they're A/B testing" ([#93148](https://github.com/anthropics/claude-code/issues/93148)).

Selbst ein funktionierender Reset verschafft dir nur einmal Luft. Wer jede Woche ans Limit stößt, steht in der nächsten Woche wieder dort. Frust ist hier vorprogrammiert.

### Die ultimative Lösung: ein weiteres Max-Abo

Bleibt der Weg, der wirklich trägt: ein **zweites Max-Abo**, bei Bedarf auch ein drittes oder viertes. Jedes bringt sein volles Kontingent zum Abo-Preis mit.

Wie schnell ein Anbieter die Tür schließen kann, zeigt gerade OpenAI: Seit dem 10. September nimmt es keine neuen Kunden für ChatGPT Pro $200 (Pro 20X) mehr an, Bestandskunden behalten ihr Abo ([OpenAI Help Center](https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers)). Auch Anthropic unterscheidet zwischen neuen und bestehenden Kunden. Im April testete es bei rund 2 % der Neuanmeldungen einen Pro-Plan ohne Claude Code, mit dem Hinweis „Existing Pro and Max subscribers aren't affected" ([X](https://x.com/TheAmolAvasare/status/2046724659039932830)). Und die Gutschrift für die neuen Cloud Sessions ging im September nur an „existing subscribers" ([X](https://x.com/ClaudeDevs/status/2102871550974427462)). Wenn du mit einem weiteren Max-Abo liebäugelst, hol es dir deshalb lieber früher als später. Sonst ärgerst du dich womöglich, dass du kein Bestandskunde bist.

Doch wie wechselst du zwischen den Abos, ohne dass die Arbeit stillsteht? Die Antwort liegt auf deiner Festplatte.

## Der Trick: Deine Chats liegen auf deiner Festplatte

Einer der großen Vorteile von Claude Code: Deine Chats liegen auf deiner Festplatte. Claude Code speichert sie im Klartext unter `~/.claude/projects/`. Ein Blick hinein lohnt sich: Jede Session ist eine JSONL-Datei mit jedem Prompt, jeder Antwort und jedem Tool-Aufruf samt Ergebnis. Codex macht es genauso und legt seine Sitzungen unter `~/.codex` ab. Auch Googles Agenten-IDE Antigravity hat ein lokales Datenverzeichnis unter `~/.gemini/antigravity/`. Anders bei Claude Code im Web: Dort läuft die Session „on cloud infrastructure instead of on your machine" ([Dokumentation](https://code.claude.com/docs/en/claude-code-on-the-web)). Weil ich meine Chats gefälligst jederzeit auf meiner Platte haben will, ist jedes reine Cloud-Angebot für mich ein Showstopper.

Konto und Chats sind also voneinander getrennt. Du kannst dich abmelden, wieder anmelden und mit *deinen* Chats weitermachen, auch mit einem anderen Konto. Das ist der Trick, auf dem alles Weitere beruht.

> **💡 Tipp:** Mach ein Backup deiner Chats, sie sind dein Kapital. Claude Code löscht sie standardmäßig nach 30 Tagen. Und ein harter Shutdown kann einen Chat zerstören. Das kenne ich aus eigener Erfahrung. Wie ich meine Chat-Verläufe sichere und `cleanupPeriodDays` hochsetze, habe ich in [Teil 1 dieser Reihe](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini#alles-doppelt-immer-synchron) beschrieben.

## Das Problem: der Wechsel zwischen den Konten

Da die Chats ohnehin lokal liegen, musst du dich für einen Wechsel also nur frisch anmelden. Und genau so ist es auch richtig. Von Hand ist das aber mühsam: `/logout`, dann `/login`, dann der OAuth-Flow im Browser. Bis dahin steht die Arbeit still. Etwas umständlich, aber damit kann man zur Not leben.

Schlimmer ist der Moment, in dem das Limit mitten in der Arbeit zuschlägt. Bei mir laufen die Agenten rund um die Uhr auf einem Mac mini, der nie ausgeht. Wie er aufgebaut ist, steht in [Teil 1](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini). Erreicht ein Konto sein Limit, brechen laufende Subagenten mit „Agent terminated early due to an API error: You've hit your session limit" ab. Laut zahlreichen Issue-Berichten und nach schmerzhafter eigener Erfahrung kommt von ihrer Arbeit oft nur ein Bruchstück zurück, und sie muss neu angestoßen werden ([#94770](https://github.com/anthropics/claude-code/issues/94770), [#74162](https://github.com/anthropics/claude-code/issues/74162), [#78231](https://github.com/anthropics/claude-code/issues/78231)). In [#94222](https://github.com/anthropics/claude-code/issues/94222) hat ein Nutzer sechs seiner Sessions ausgewertet: „449 subagents were cut off, only 8 were resumed by id […] The other 438 were re-dispatched from scratch."

Das ist besonders ärgerlich, wenn du die Arbeit auf viele Subagenten auffächerst. Startest du viele Agenten parallel mit einem teuren Modell, bringt genau dieser Workflow dein Konto ans Limit. Bricht er ab, ist die Arbeit weg, und ein zweiter Durchlauf kostet die Tokens noch einmal in voller Höhe. Lege deshalb vor jedem großen Workflow fest, mit welchem Modell und welchem Effort die Agenten loslegen, wie oben unter „Modell und Effort bewusst wählen“ beschrieben. Warum so ein Workflow viel kostet, steht im Artikel über [Graph Engineering](https://agentic.schule/blog/2026-09-graph-engineering#wann-sich-ein-graph-lohnt-und-wann-nicht).

Dazu kommt: Ein Kontowechsel trennt die **Remote-Control-Verbindung**, mit der ich vom Handy aus zusehe. Dasselbe gilt für Artefakte, also Seiten, die Claude Code auf claude.ai veröffentlicht. Auch sie gehören einem Konto.

Das Ziel ist also: **rechtzeitig vor dem Limit automatisch auf ein anderes Abo wechseln, ohne Abmelden, möglichst ohne abgebrochene Agenten und ohne die Fernsteuerung zu verlieren.** Dafür braucht es zwei Werkzeuge: eines, das die Anmeldung im laufenden Betrieb tauscht, und eines, das Remote Control dabei auf einem Konto hält.

## Mehrere Abos im Wechsel einrichten

Das erste Werkzeug ist das Open-Source-Tool [`claude-swap`](https://github.com/realiti4/claude-swap) (Befehl: `cswap`, MIT-Lizenz). Es nutzt ein Detail von Claude Code: **Claude Code liest seine Zugangsdaten neu ein, wenn sie sich ändern.** Liegen sie in einer Datei, läuft die *nächste* Nachricht bereits über das neue Konto. So beschreibt es die [Dokumentation von `claude-swap`](https://github.com/realiti4/claude-swap#tips), und so verhält es sich auf meinem mini. Dort liegen die Credentials als Datei unter `~/.claude/.credentials.json`. Sonst liegen sie unter macOS im Schlüsselbund. Claude Code puffert sie dort laut derselben Quelle etwa 30 Sekunden lang, danach greift auch dort der Wechsel.

`cswap` sichert pro Konto die Credentials und tauscht sie auf Zuruf aus, ohne Neustart und ohne `/login`. Es ist nicht auf zwei Konten beschränkt. Ich arbeite mit zwei, das Prinzip bleibt bei drei oder vier gleich. Wie du es sicher installierst, zeigt der nächste Abschnitt. Du meldest dich **einmal** pro Abo an, danach genügt:

```bash
cswap switch 2      # ab der nächsten Nachricht läuft alles über Abo 2
cswap switch 1      # zurück
cswap switch        # reihum zum nächsten Konto
cswap list          # Auslastung (5h/7d) aller Konten
```

Wichtig: Alle Sessions teilen sich **eine** globale Credential-Datei. Ein `cswap switch` bewegt darum alle Sessions auf das andere Abo. Das ist gewollt, wenn Konto A ans Wochenlimit stößt.

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

`cswap` fasst deine **OAuth-Tokens** an, also die Schlüssel zu deinen Konten. Bevor so ein Tool auf einem Rechner läuft, der nie ausgeht, solltest du wissen, was es tut. Lies deshalb zuerst den Quelltext, bevor du `pipx install` tippst.

Die wichtigste Frage: Wohin geht der Netzwerkverkehr? Im Quelltext stehen nur Anthropics eigene Endpunkte (`api.anthropic.com`, `platform.claude.com`) und ein Versions-Check bei PyPI. Keine fremde Domain, keine Telemetrie. Das Paket wird über PyPIs *Trusted Publishing* aus einem GitHub-Workflow veröffentlicht, und das Repo bringt eine umfangreiche Testsuite mit. So weit, so vertrauenswürdig.

Trotzdem solltest du ein Tool, das deine Schlüssel hält, nicht per Auto-Update aus einer fremden Pipeline beziehen. Das größere Risiko sind künftige Releases: Ein bösartiges Update kommt als beiläufiges Upgrade herein. Das ist ein klassischer *Supply-Chain-Angriff*, also ein Angriff über die Lieferkette. Wie so etwas aussieht, zeigt der Artikel über [böswillige AI-Skills](https://agentic.schule/blog/2026-09-malicious-ai-skills). Geh deshalb den sauberen Weg:

```bash
# in den eigenen Account forken und den geprüften Stand lokal auschecken
gh repo fork realiti4/claude-swap --clone
# ... Code lesen, dann aus der eigenen Kopie installieren:
pipx install ./claude-swap
# Updates nur bewusst: upstream holen, Diff lesen, neu installieren
```

`cswap` bringt mit `cswap upgrade` einen eigenen Update-Befehl mit, der die neueste Version von PyPI holt. Den lässt du besser links liegen. So läuft nur Code, den du gelesen hast.

## Remote Control: Der Pin hält die Session

Bleibt das zweite Problem: Der Kontowechsel trennt die Fernsteuerung. Der Grund ist strukturell. Eine Remote-Control-Session gehört dem Konto, mit dessen Token sie erstellt wurde. Tauschst du das Konto, verlieren Handy und Web die Session, und auf dem alten Konto stapeln sich verwaiste Sitzungen (so beschrieben im [README von cswap-pin](https://github.com/codeslake/cswap-pin#the-problem)). Dasselbe gilt für Artefakte: Nach einem Wechsel schlägt das erneute Veröffentlichen fehl.

Die Lösung heißt [`cswap-pin`](https://github.com/codeslake/cswap-pin) und stammt von Junyong Lee. Es ist ein **lokaler Proxy**, der genau eine Sache tut: Auf den Anthropic-Routen für Remote Control und Artefakte setzt er den Token des *gepinnten* Kontos ein. Die Inferenz über `/v1/messages` reicht er unverändert durch. Sie folgt also weiter dem Wechsel. Remote Control und Artefakte bleiben beim gepinnten Konto, abgerechnet wird die Arbeit beim aktiven.

```bash
cswap pin 1          # Remote Control und Artefakte bleiben auf Konto 1
```

Die Anbindung an `cswap` liegt zum Zeitpunkt dieses Artikels als [offener Pull Request](https://github.com/realiti4/claude-swap/pull/210) im Upstream-Projekt. Bis zum Merge gibt es `cswap pin` also nur, wenn du den PR in deinen Fork von `claude-swap` übernimmst. Den Proxy selbst installierst du am besten ebenfalls aus einem eigenen Fork und hängst ihn in dieselbe Umgebung:

```bash
cd claude-swap
gh pr checkout 210 --repo realiti4/claude-swap   # den Pull Request in den Fork holen
pipx install --force .
cd ..
gh repo fork codeslake/cswap-pin --clone
pipx inject claude-swap ./cswap-pin
```

Technisch ist der Proxy ein *Man-in-the-Middle* (MITM). Er entschlüsselt die HTTPS-Verbindung zu Anthropic lokal. Dafür nutzt er eine eigene Zertifizierungsstelle (engl. *Certificate Authority*, CA). Sie ist nicht systemweit installiert. `cswap pin` trägt Proxy-Adresse und CA in den `env`-Block von `~/.claude.json` ein, und Claude Code übernimmt sie in den eigenen Prozess. Das ist dasselbe Verfahren, das Firmen-Proxys nutzen, und Claude Code unterstützt es [offiziell](https://code.claude.com/docs/en/network-config) über `HTTPS_PROXY` und `NODE_EXTRA_CA_CERTS`. Der Proxy sieht damit den Anthropic-Verkehr im Klartext. Auch ihn solltest du forken und lesen, bevor er auf die Kiste darf. Bei einem Werkzeug, das den Datenverkehr sieht, ist das Pflicht. Am Ende liegen also zwei Forks in deinem Account.

## Automatisch wechseln: `cswap auto` als Dienst

Umschalten von Hand ist nett. Der Gewinn liegt in der Automatik: `cswap auto` prüft die Auslastung und schaltet **von selbst** auf das Abo mit dem meisten Spielraum, sobald das aktive Konto eine Schwelle erreicht. Standardmäßig liegt sie bei 90 Prozent des 5-Stunden- oder Wochenfensters.

Mit `--once` macht der Befehl genau einen Durchlauf und beendet sich. Die Mindestpause zwischen zwei Wechseln (*Cooldown*) und den Zustand speichert das Tool auf der Platte, darum reicht ein einzelner Durchlauf pro Minute. Das passt zu `launchd`, dem Dienst-Manager von macOS, und kein Terminal muss offen bleiben. Bei mir läuft das als LaunchDaemon im Minutentakt, also als Systemdienst, der ohne Anmeldung startet. Wichtig ist der Schlüssel `UserName`: Ohne ihn läuft ein LaunchDaemon als root und tauscht die Credentials im falschen Home-Verzeichnis. Die Datei gehört nach `/Library/LaunchDaemons/` und wird mit `sudo launchctl bootstrap system /Library/LaunchDaemons/cswap-auto.plist` geladen. Im Beispiel steht `DEIN-NAME` für deinen Benutzernamen. Es zeigt nur die entscheidenden Schlüssel innerhalb von `<dict>`.

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

Meine Agenten machten gerade einen `/deep-research`, als sie **Alarm** schlugen. Sie hielten die abgerufenen Inhalte für manipuliert und führten die Proxy-Umgebungsvariablen und die fremde CA als Beleg für einen Angriff an.

Das ist kein Bug, sondern ein lobenswertes Verhalten. Meine Subagenten waren misstrauisch, weil da ein komischer Proxy auftauchte. Wild, dass Software heutzutage so reagieren kann. Die Agenten konnten nicht wissen, woher der Proxy stammt. Aus ihrer Sicht saß da ein Man-in-the-Middle mit eigener CA, und das *hätte* Malware sein können. So soll ein wachsamer Prüfer reagieren.

Hatten sie recht? Das lässt sich prüfen. Ein Abruf von `example.com` durch den Proxy kommt mit dem *echten* öffentlichen Zertifikat zurück. Prüfen lässt sich das mit `curl -v --proxy http://127.0.0.1:$(cswap pin --get_port) https://example.com` und einem Blick auf den Aussteller des Zertifikats. Hätte der Proxy hier mitgelesen, wäre es seines gewesen. Auch der Quelltext bestätigt das: Der Proxy entschlüsselt **ausschließlich** `api.anthropic.com`. Jeden anderen Host reicht er als blinden Tunnel durch.

Der Verkehr war also echt. Der Alarm zeigte trotzdem eine Falle auf: Setzt du die Proxy-Variablen und die CA für Claude Code, erbt sie jede Shell, die ein Agent startet. Jeder Befehl sieht dann den Proxy, und jeder Download läuft durch ihn. Der Pin braucht aber nur den Claude-Prozess selbst. Entferne die Variablen deshalb mit einer einzigen Zeile in `~/.zshenv` aus jeder Agenten-Shell:

```bash
unset HTTPS_PROXY https_proxy HTTP_PROXY http_proxy ALL_PROXY all_proxy NODE_EXTRA_CA_CERTS
```

Das wirkt, wenn die Shell-Befehle deiner Agenten über zsh laufen, denn zsh liest `~/.zshenv` bei jedem Aufruf. Der Claude-Prozess behält den Pin, die Agenten sehen ihn in ihren Shells nicht mehr. Die Zeile wirkt allerdings auch in deinen eigenen Terminals. Brauchst du dort einen Firmen-Proxy, setz ihn gezielt nur dort.

Und hier kehrt ein Prinzip aus [Teil 1](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini#ein-prinzip-erzähl-den-agenten-nie-vom-rosa-elefanten) zurück: **Erzähl den Agenten nie vom rosa Elefanten.** Weiß eine Session von einem exotischen Setup, erklärt sie sich jedes Problem zuerst damit. Erklär den Agenten deshalb nicht, dass der Proxy harmlos ist. Sorg lieber dafür, dass sie ihn in ihren Shells gar nicht erst sehen. Von dem Elefanten weißt dann nur du.

## Ein Prinzip: Vertraue keinem Werkzeug blind deine Schlüssel an

**Ein Werkzeug, das deine Zugangsschlüssel oder deinen Datenverkehr anfasst, bekommt keinen Vertrauensvorschuss. Forke es, lies den Code, installiere aus deiner Kopie und aktualisiere nur bewusst.**

So gehe ich bei jedem Werkzeug vor, das an meine Schlüssel kommt. Meine Agenten haben mit ihrem Alarm übrigens genau diese Frage gestellt: Was macht dieser fremde Proxy in meinem Datenverkehr? Misstrauen ist in einem agentischen Setup Hygiene.

Bleibt die Frage, ob Anthropic so ein Setup überhaupt erlaubt.

## Ist das erlaubt?

Das Setup geht bis an die Grenzen von Anthropics Vorgaben, bleibt aber nach meiner Lesart innerhalb. Es setzt nur an Stellen an, die Claude Code offen unterstützt:

- **Claude Code bleibt unverändert.** Kein Patch, kein Eingriff ins Programm. Selbst für Anbieter, die Claude Code in eigene Produkte einbauen, zieht Anthropic hier die Linie: „The Claude Code binary must not be modified." ([Claude-Code-Doku, „Legal and compliance“](https://code.claude.com/docs/en/legal-and-compliance#can-customers-offer-claude-code-in-their-products))
- **Jede Anmeldung läuft über Anthropics eigenen Login.** Das verlangt die Claude-Code-Doku auf der Seite [„Legal and compliance“](https://code.claude.com/docs/en/legal-and-compliance#authentication-and-credential-use): „sign-in to a Claude account must complete through Anthropic's own flow". `cswap` sichert danach nur die Tokens, die Claude Code ohnehin selbst auf der Platte ablegt. Es automatisiert, was du auch von Hand tun könntest: neu anmelden und weiterarbeiten.
- **Der Proxy nutzt einen offiziellen Weg.** Proxys mit TLS-Inspektion unterstützt Claude Code laut [Dokumentation](https://code.claude.com/docs/en/network-config) ausdrücklich, über `HTTPS_PROXY` und eine eigene CA. Der Proxy sitzt außerhalb von Claude Code und ändert nur den Datenverkehr.
- **Es sind ausschließlich meine eigenen Abos.** Niemand sonst bekommt Zugang. Das Teilen von Konten verbieten die [Consumer Terms](https://www.anthropic.com/legal/consumer-terms) klar: „You may not share your Account login information […] or make your Account available to anyone else."

## Das Kleingedruckte: Grenzen und Trade-offs

Doch bei aller Freude über den nahtlosen Wechsel: Ein paar Punkte solltest du kennen.

- **Eine ausdrückliche Freigabe gibt es nicht.** Die Regel für Drittentwickler ist weit gefasst: „developers may not collect, store, or intermediate Claude.ai credentials or session tokens" ([Claude-Code-Doku, „Legal and compliance“](https://code.claude.com/docs/en/legal-and-compliance#authentication-and-credential-use)). Wörtlich genommen träfe sie jedes Tool, das einen Token speichert. Gemeint sind nach meiner Lesart Produkte, die fremde Nutzer über ihre Abos leiten. Anthropic behält sich vor, Maßnahmen „without prior notice" durchzusetzen.
- **Mehr Konten heißt nicht unendlich.** Sind alle Konten an der Schwelle, findet `cswap auto` kein Ziel mehr und meldet das laut `cswap auto --help` mit Exit-Code 3 („no viable target / all exhausted“). Und jedes weitere Abo kostet seinen vollen Preis.
- **Der Pin hängt an einem offenen Pull Request.** Bis PR #210 gemergt ist, läuft `cswap pin` nur aus dem eigenen Fork.
- **Eigene Forks kosten Pflege.** Bei jedem Upstream-Update heißt es: Diff lesen, neu installieren. Das ist der Preis dafür, keinem fremden Auto-Update zu vertrauen.
- **Der Proxy sieht den Anthropic-Verkehr im Klartext.** Das gilt für jeden Proxy mit TLS-Inspektion, auch für die in Firmennetzen. Tragbar ist das nur, wenn du den Code gelesen hast und die Reichweite auf das Nötigste beschränkt ist.

## Fazit

Mehrere Max-Abos, ein Kontowechsel im laufenden Betrieb, automatisch bevor ein Limit greift, und Remote Control überlebt den Wechsel. Kein `/logout` und `/login` mehr, und in der Regel keine abgebrochenen Agenten.

Für mich überwiegt der Gewinn klar. Mit zwei 20x-Abos stoße ich kaum noch an ein Wochenlimit, und auf Usage-Credits muss ich nie schauen.

Wenn du selbst ans Limit stößt: Sieh mit `/usage` nach, wie weit du bist, und mit `cswap list`, wie viel Spielraum alle Konten zusammen haben. Leg vor jedem großen Workflow fest, mit welchem Modell und welchem Effort deine Agenten loslegen. Und lies den Code, bevor du ihm deine Schlüssel gibst.

**Fragen, Feedback, eigene Basteleien?** Immer her damit. Und wie der Mac mini aufgebaut ist, auf dem das alles läuft, steht in [Teil 1](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini).

<small>**Danke** an realiti4 für `claude-swap` und an Junyong Lee für `cswap-pin`. Beide Projekte sind offen, getestet und gut lesbar. Das macht es möglich, ihnen nicht blind vertrauen zu müssen.</small>

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
