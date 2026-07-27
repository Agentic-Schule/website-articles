---
title: 'Ein Stamm, viele Äste: git worktrees für parallele KI-Agenten'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-07-26
keywords:
  - git worktree
  - Agentic Coding
  - AI Agent
  - KI-Agent
  - Claude Code
  - Parallelisierung
  - Multi-Repo
  - Monorepo
  - GitHub Copilot
  - Cursor
  - Antigravity
  - Kendo UI
language: de
header: header.jpg
---

In der klassischen Softwareentwicklung gab es Isolation gratis: ein Entwickler, ein persönlicher Rechner, ein Checkout. Jeder Coding-Agent geht heute genauso selbstverständlich davon aus, dass ihm das Arbeitsverzeichnis allein gehört: Er liest Dateien, ändert sie, lässt Builds und Tests laufen, und seine Subagenten tun parallel das Gleiche. Na gut, ob das jeder Agent so macht, weiß ich natürlich nicht. Aber zumindest mein Claude Code ist ohne Etikette ein kleiner Rambo. Jetzt tummeln sich aber viele solcher agentischen Entwickler gleichzeitig auf demselben Computer, und sobald zwei von ihnen dasselbe Verzeichnis für sich beanspruchen, gibt es ein Kuddelmuddel: Zwei Agenten editieren dieselben Dateien, Tests prüfen Stände, die es so nie gegeben hat, und am Ende weiß niemand mehr, welcher Diff von wem stammt.

**Die Lösung ist ein unscheinbares git-Bordmittel, das inzwischen quer durch die agentischen Tools im Einsatz ist: git worktrees. Jeder Agent bekommt ein eigenes Arbeitsverzeichnis auf einem eigenen Branch, die Alleinbesitz-Annahme stimmt wieder, und plötzlich laufen beliebig viele Sessions parallel, ohne sich in die Quere zu kommen.**

Dieser Artikel zeigt die Technik dahinter, den eingebauten Worktree-Support der agentischen Tools und den Init-Command, mit dem ich einen Feature-Branch samt Worktrees über zwei Repos aufspanne.

## Inhalt

[[toc]]

## Das Problem: Ein Agent belegt das ganze Repo

Stellen wir uns folgenden Vormittag vor: Claude Code arbeitet an einem größeren Refactoring und lässt dabei immer wieder die Tests laufen. So ein Lauf zieht sich. Mittendrin kommt ein Bug-Report rein. Produktion. Sollte heute noch raus.

Mit einem klassischen Einzel-Checkout haben wir jetzt drei schlechte Optionen:

- **Warten.** Der Bugfix wartet auf einen Agenten, der mit ihm gar nichts zu tun hat.
- **Den Agenten abbrechen.** Die halbe Arbeit ist getan, der Kontext aufgebaut, alles für die Tonne.
- **`git stash` und Branch wechseln, während der Agent läuft.** Bitte nicht. Der Agent liest und schreibt in genau diesem Verzeichnis. Wechseln wir darunter den Branch, editiert er ab sofort fremde Dateistände, und die Tests prüfen einen Zustand, den es so nie gegeben hat.

Selbst ohne Notfall nervt der klassische Context-Switch: stash, checkout, `npm install`, weil der andere Branch andere Abhängigkeiten hat, die IDE indexiert neu. Wer so arbeitet, hat wenig Komfort.

Dazu kommt ein Luxusproblem: Frontier-Modelle mit ordentlich Reasoning sind gründlich, aber gemächlich. Kommandos wie `/code-review` laufen bei mir schon mal absurd lange. Die natürliche Reaktion: parallelisieren. Während Session eins das Review fährt, soll Session zwei das nächste Feature anfangen. Nur: Bei zwei Agenten im selben Arbeitsverzeichnis wird aus der erhofften Parallelität ein Wettrennen um dieselben Dateien. Obendrein schließen sich manche Features gegenseitig aus und andere dürfen nur in einer bestimmten Reihenfolge einfließen. Zwei halbfertige Features im selben Verzeichnis ergeben einen Mischzustand, den es im fertigen Produkt nie geben wird. Und ausgerechnet dagegen laufen dann Builds und Tests.

Der naive Ausweg wäre, das Repo einfach mehrfach zu klonen. Das funktioniert, ist aber verschwenderisch (jede Kopie schleppt ihr eigenes `.git` mit, und gefetcht wird auch mehrfach) und vor allem unnötig: git hat für genau diesen Fall seit Jahren ein Bordmittel.

## Was sind git worktrees?

Ein [git worktree](https://git-scm.com/docs/git-worktree) ist ein zusätzliches Arbeitsverzeichnis desselben Repositories. Die git-Doku nennt den Checkout, den man beim Klonen bekommt, den *main worktree*. Alles, was man mit `git worktree add` dazustellt, sind *linked worktrees*. Alle teilen sich dasselbe `.git`, also die komplette Historie, alle Branches, alle Remotes und die Objektdatenbank. Eigenständig ist an jedem Worktree genau das, was den Arbeitszustand ausmacht: die ausgecheckten Dateien, ein eigener `HEAD` und ein eigener Index.

Das hat drei angenehme Konsequenzen. Erstens ist ein Worktree in Sekunden angelegt und ebenso schnell wieder entsorgt, es entsteht ja nur ein frischer Checkout und kein zweites Repository. Zweitens sehen sich die Worktrees gegenseitig: Ein Commit auf Ast A ist auf Ast B sofort im Log sichtbar, ein `git fetch` versorgt alle gemeinsam. Und drittens, für mich der wichtigste Punkt gegen mehrfach geklonte Repos: Es gibt **garantierte Exklusivität auf jedem lokalen Branch-Namen.** In zwei unabhängigen Klonen kann man denselben Branch versehentlich doppelt anlegen.

> **🛠️ Selbst nachbauen: die vier Kommandos, die man braucht**
> ```bash
> # Neues Arbeitsverzeichnis als Nachbarordner anlegen, mit neuem Branch
> git worktree add ../app-frontend-checkout -b feature/checkout
>
> # Oder einen existierenden Branch auschecken
> git worktree add ../app-frontend-hotfix hotfix/prices
>
> git worktree list      # was liegt wo, auf welchem Branch?
> git worktree remove ../app-frontend-checkout
> git worktree prune
> ```
> Die letzten beiden verwechselt man leicht: `remove` ist der saubere Rückbau, es entsorgt das Verzeichnis mitsamt der internen Verwaltungsdaten. `prune` repariert dagegen nur: Wer einen Worktree-Ordner einfach per `rm -rf` löscht, hinterlässt im Repository verwaiste Verwaltungsdaten, und die räumt `prune` ab.

Eine Regel muss man kennen: **Ein Branch kann immer nur in einem Worktree ausgecheckt sein.** Versucht man denselben Branch in zwei Worktrees zu öffnen, verweigert git das Kommando (wer es mit `--force` erzwingt, weiß hoffentlich, was er tut). Die Regel hat einen guten Grund: Zwei Checkouts desselben Branches würden sich gegenseitig Commits und Index zerschießen. Für unser Agenten-Szenario ist die Regel sogar ein Feature, denn sie erzwingt exakt das Modell, das wir wollen: ein Worktree, ein Branch, ein Agent.

Zwei Dinge sollte man außerdem wissen:

- **Geteilt wird auch, was man nicht sofort sieht.** Hooks (`.git/hooks`) und die lokale Repo-Konfiguration gelten für alle Worktrees gemeinsam. Ein pre-commit-Hook wirkt also überall.
- **Nicht geteilt wird alles, was gitignored ist.** `node_modules`, `.env`, Build-Caches: Ein frischer Worktree ist ein frischer Checkout, all das fehlt dort erst einmal. Das ist Fluch (Installation pro Worktree, dazu später mehr) und Segen zugleich (keine halb gebauten Artefakte vom falschen Branch).

Worktrees gab es lange vor den KI-Agenten. Klassisch nutzt man sie für den Hotfix neben dem laufenden Feature oder um einen Pull Request auszuchecken, ohne den eigenen Stand anzufassen. Mit Agenten kommt ein neuer Dauerzustand dazu: Der persönliche Rechner beherbergt auf einmal ein ganzes Team, und jedes Teammitglied braucht seinen eigenen Checkout.

## Was die Tools daraus machen

Anthropic, Microsoft, Google, OpenAI, Cursor und Cognition haben das längst erkannt. **Lokal heißt Isolation git worktree, in der Cloud heißt sie eigene VM oder eigener Container.**

| Tool | Paralleles Arbeiten | Isolation |
|---|---|---|
| [Cursor](https://cursor.com/docs/configuration/worktrees) | bis zu acht Agenten auf einen Prompt | automatisch verwaltete git worktrees oder Remote-Maschinen |
| [GitHub Copilot](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) | parallele Cloud-Sessions, je ein Draft-PR | ephemere GitHub-Actions-Umgebung pro Session |
| [VS Code](https://code.visualstudio.com/docs/copilot/agents/background-agents) | Background-Agents (Copilot CLI, Claude, Codex) | automatisch ein git worktree pro Session |
| [Windsurf](https://docs.windsurf.com/windsurf/cascade/worktrees) | Worktree-Modus pro Chat, Merge-Button zurück | git worktrees unter `~/.windsurf/worktrees/` |
| [Google Antigravity](https://antigravity.google/docs/projects) | Agent Manager für viele parallele Agenten | „New Worktree Mode" pro Konversation, optional pro Subagent |
| [OpenAI Codex](https://developers.openai.com/codex/app/worktrees) | mehrere Chats pro Projekt, Cloud-Tasks parallel | git worktrees „under the hood", Cloud: Container pro Task |
| [Devin](https://docs.devin.ai/onboard-devin/environment) | viele Sessions, „MultiDevin"-Orchestrierung | eigene VM pro Session, gebootet aus einem Snapshot |
| [Google Jules](https://jules.google/docs/environment/) | parallele Tasks, Limit je nach Plan | frische VM pro Task |
| [Aider](https://aider.chat/docs/faq.html) | offiziell keine Parallel-Story | Community-Praxis: von Hand ein Worktree pro Instanz |

(Stand: Juli 2026. Die Feature-Lage ändert sich in diesem Feld gefühlt wöchentlich, die Links führen jeweils zur offiziellen Doku.)

Zwei Schulen also: Die lokalen Tools setzen auf Worktrees, die Cloud-Dienste auf Wegwerf-VMs. Der gemeinsame Nenner ist wichtiger als der Unterschied: **Kein ernstzunehmendes Tool lässt zwei Agenten unbeaufsichtigt im selben Verzeichnis arbeiten.** Isolation pro Agent ist keine Kür, sie ist die Eintrittskarte in die Parallelität. Zeit, sich das beim Werkzeug meiner Wahl im Detail anzusehen.

## Der Claude-Code-Weg

[Claude Code](https://claude.com/claude-code) hat Worktrees inzwischen fest eingebaut und ihnen eine [eigene Doku-Seite](https://code.claude.com/docs/en/worktrees) spendiert. Der wichtigste Einstieg ist ein CLI-Flag:

```bash
claude --worktree feature-auth     # kurz: claude -w feature-auth
```

Das legt unterhalb des Repos einen Worktree `.claude/worktrees/feature-auth/` auf einem neuen Branch `worktree-feature-auth` an und startet Claude direkt darin. Im zweiten Terminal dasselbe mit anderem Namen, und schon laufen [zwei sauber isolierte Sessions](https://code.claude.com/docs/en/common-workflows#run-parallel-sessions-with-worktrees). Lässt man den Namen weg, würfelt Claude selbst einen, etwa `bright-running-fox`. Beim Beenden räumt Claude auf: Einen unveränderten Worktree einer unbenannten Session entfernt er automatisch, sonst fragt er nach, ob Verzeichnis und Branch bleiben sollen.

Genauso gut geht es mitten in der Session: Auf die Bitte „arbeite dafür bitte in einem Worktree" legt Claude selbst einen an und wechselt hinein (hinter den Kulissen erledigt das ein Tool namens `EnterWorktree`).

Richtig elegant wird es bei [Subagenten](https://code.claude.com/docs/en/sub-agents), also den Helfer-Agenten, an die Claude Teilaufgaben delegiert:

> **🛠️ Selbst nachbauen: Subagenten automatisch isolieren**
> Eine Datei `.claude/agents/refactorer.md` mit `isolation: worktree` im Frontmatter genügt, und jeder Lauf dieses Subagenten bekommt einen eigenen, temporären Worktree:
> ```markdown
> ---
> name: refactorer
> description: Wendet mechanische Refactorings über viele Dateien an
> isolation: worktree
> ---
>
> Führe das gewünschte Refactoring über alle betroffenen Dateien aus,
> lass danach die Tests laufen und berichte das Ergebnis.
> ```
> Endet der Subagent ohne Änderungen, entfernt Claude Code den Worktree automatisch. Mit Änderungen bleibt er liegen, bis ein periodischer Sweep ihn abräumen kann, ohne Arbeit zu verlieren.

Ein Detail aus der Praxis: Weil ein frischer Worktree ohne die gitignorierten Dateien startet, `.env` zum Beispiel, gibt es `.worktreeinclude`, eine Datei im Projektstamm in `.gitignore`-Syntax. Was dort steht und selbst gitignored ist, kopiert Claude Code beim Anlegen automatisch in jeden neuen Worktree (getrackte Dateien dupliziert es bewusst nie).

In der Desktop-App ist das Prinzip übrigens schon Standard: Dort bekommt jede neue parallele Session automatisch ihren eigenen Worktree. Und falls du wie ich zuerst danach suchst: Einen Slash-Command `/worktree` gibt es nicht, das Flag beim Start und der Zuruf in der Session decken alles ab.

## Und wenn das Feature zwei Repos berührt?

So weit die heile Welt der Ein-Repo-Demos. Die Realität in gewachsenen Systemlandschaften sieht anders aus: Ein System verteilt sich auf diverse Repositories. Frontend hier, Backend dort, dazu ein paar Services. Der Monorepo-Ansatz löst das auf dem Papier, ist aber längst nicht immer umsetzbar: getrennte Teams und Berechtigungen, unterschiedliche Build- und Deploy-Welten, gewachsene Historie. Man arbeitet mit dem Schnitt, den man hat.

Nehmen wir ein neutrales Beispiel: ein Angular-Frontend im Repo `app-frontend`, eine .NET-API im Repo `app-backend`. Das Feature „Checkout" braucht neue Endpunkte **und** neue Komponenten. Der Branch soll in beiden Repos gleich heißen, bei uns nach dem Ticket, sagen wir `shop-4711-checkout`. So finden Review, CI und alle Beteiligten die zusammengehörigen Stände auf einen Blick.

Und jetzt die Preisfrage: Was macht `claude --worktree` daraus? Genau, **einen** Worktree, im aktuellen Repo. Fast alle eingebauten Worktree-Features denken in einem Repository. Die rühmliche Ausnahme ist Antigravity, dessen „New Worktree Mode" Worktrees für alle Git-Checkouts eines Projects anlegt, aber ohne frei wählbaren gemeinsamen Branch-Namen und ohne alles, was nach dem Auschecken kommt: Abhängigkeiten, Lizenzen, Projektregeln.

Für meinen Workflow heißt das: selbst bauen. Zum Glück ist das in Claude Code erstaunlich wenig Arbeit.

## Mein Init-Command: ein Kommando, zwei Repos, zwei Worktrees

Eigene [Slash-Commands](https://code.claude.com/docs/en/skills) sind in Claude Code schlicht Markdown-Dateien: Eine Datei `~/.claude/commands/feature-init.md` erzeugt den Command `/feature-init`. Der Inhalt ist eine Arbeitsanweisung an den Agenten: Prosa mit ein paar Kommandos darin. So ein Command legt bei mir die Worktree-Paare an. Der Ablauf, den er erzwingt:

1. **Feature-Name abfragen.** Er wird der Branch-Name, identisch in beiden Repos.
2. **Beide Repos aktualisieren und prüfen, ob der Branch schon existiert**, lokal oder remote. Wo ja, wird er ausgecheckt (vielleicht hat gestern schon jemand angefangen). Wo nein, entsteht er frisch vom neuesten `origin/main`.
3. **Pro Repo ein Worktree**, als Nachbarordner mit sprechendem Namen: `app-frontend-shop-4711-checkout/` neben `app-frontend/`.
4. **Abhängigkeiten installieren und Kendo-Lizenz aktivieren**, pro Worktree: `npm install` im Frontend, `dotnet restore` im Backend (zur Lizenz gleich mehr).
5. **Projektregeln einlesen:** die `CLAUDE.md` beider Worktrees.
6. **Die eiserne Regel:** Gearbeitet wird ausschließlich in den Worktrees. Die Hauptverzeichnisse bleiben unangetastet.

**🛠️ Selbst nachbauen: die komplette Command-Datei `~/.claude/commands/feature-init.md`.** Sie ist absichtlich Prosa statt Shell-Skript und absichtlich laut. Warum, erklären die drei Anmerkungen im Anschluss; wer den Ablauf oben schon hat, springt direkt dorthin.

````markdown
# Feature-Worktrees für Frontend und Backend anlegen

## Feature-Name erfragen

Frage den Benutzer nach dem Namen des neuen Features (z. B. `shop-4711-checkout`).
Dieser Name wird als Branch-Name für BEIDE Repos verwendet.

## Worktrees anlegen

Hole zuerst in beiden Repos den neuesten Stand:

```bash
git -C ~/Work/shop/app-backend fetch origin
git -C ~/Work/shop/app-frontend fetch origin
```

Prüfe dann in BEIDEN Repos, ob der Branch bereits existiert (lokal oder remote):

```bash
git -C ~/Work/shop/app-backend  branch --list <feature-name>
git -C ~/Work/shop/app-backend  branch --list -r "origin/<feature-name>"
git -C ~/Work/shop/app-frontend branch --list <feature-name>
git -C ~/Work/shop/app-frontend branch --list -r "origin/<feature-name>"
```

Entscheide PRO Repo (die Fälle können sich unterscheiden, etwa wenn bisher
nur in einem der beiden Repos gearbeitet wurde):

**Branch existiert in diesem Repo NICHT:** neuen Branch vom neuesten `origin/main` erstellen:

```bash
git -C ~/Work/shop/app-backend worktree add \
  ~/Work/shop/app-backend-<feature-name> -b <feature-name> origin/main
git -C ~/Work/shop/app-frontend worktree add \
  ~/Work/shop/app-frontend-<feature-name> -b <feature-name> origin/main
```

**Branch existiert in diesem Repo bereits** (lokal oder remote): vorhandenen Branch auschecken:

```bash
git -C ~/Work/shop/app-backend worktree add \
  ~/Work/shop/app-backend-<feature-name> <feature-name>
git -C ~/Work/shop/app-frontend worktree add \
  ~/Work/shop/app-frontend-<feature-name> <feature-name>
```

## Abhängigkeiten installieren

Direkt nach dem Anlegen der Worktrees:

- **Backend:** `dotnet restore` im Backend-Worktree ausführen.
- **Frontend:** `npm install` im Frontend-Worktree ausführen.
- **Frontend, Kendo-Lizenz:** nach `npm install` einmalig `npm run kendo-license-activate`
  im Frontend-Worktree ausführen. Die Aktivierung patcht Dateien unter
  `node_modules/@progress/kendo-licensing/` und ist daher PRO Worktree nötig.
  Ohne Aktivierung rendern die Komponenten mit Wasserzeichen und Lizenz-Warnung.

## PFLICHT: Projektregeln einlesen

Vor jeder Arbeit MÜSSEN folgende Dateien gelesen und berücksichtigt werden:

- `~/Work/shop/app-backend-<feature-name>/CLAUDE.md`
- `~/Work/shop/app-frontend-<feature-name>/CLAUDE.md`

## ABSOLUTE REGEL: Immer in den Worktrees arbeiten!

NIEMALS Dateien in den Hauptverzeichnissen bearbeiten. Alle Dateioperationen
(Read, Edit, Write, Bash) MÜSSEN auf die Worktree-Pfade zeigen:

- `~/Work/shop/app-backend-<feature-name>/`
- `~/Work/shop/app-frontend-<feature-name>/`

Die Hauptrepos (`app-backend/` und `app-frontend/`) dürfen NICHT verändert werden.
````

Drei Anmerkungen dazu:

- **Warum Prosa statt Shell-Skript?** Weil ein Agent auf Überraschungen reagieren kann: ein halb existierender Branch, ein schon belegter Ordnername, eine fehlgeschlagene Installation. Ein Bash-Skript scheitert an der ersten Abweichung oder überfährt sie. Der Agent liest die Situation und entscheidet im Sinne der Anweisung.
- **Warum die Großbuchstaben?** Die Regeln sehen dramatisch aus, aber der Nachdruck wirkt. Vor allem die letzte Regel ist wichtig: Die Hauptverzeichnisse bleiben dauerhaft sauber auf `main` und dienen nur noch als Basis für `fetch` und `worktree add`. Damit können sich zwei Sessions niemals versehentlich ein Arbeitsverzeichnis teilen.
- **Die Regel „ein Branch, ein Worktree" arbeitet hier für uns:** Versucht eine zweite Session dasselbe Feature zu initialisieren, verweigert git das Anlegen des zweiten Worktrees. Doppelarbeit am selben Feature fällt sofort auf, statt still zu kollidieren.

## Ports, Lizenzen, Datenbanken: die Fallstricke der Parallelität

Die Worktrees stehen, zwei Agenten arbeiten auf zwei Ästen. Bleiben die Kollisionen, die nicht im Dateisystem passieren, denn auch mit getrennten Verzeichnissen teilen sich alle Agenten weiterhin einen Computer: seine Ports, seine Datenbanken, seine Lizenzen.

### Abhängigkeiten sind pro Worktree fällig

`node_modules` im Frontend, `bin/` und `obj/` im Backend: alles gitignored, also überall neu. Das kostet ein paar Minuten und ordentlich Plattenplatz. Der Lohn dafür: Jeder Ast hat exakt die Abhängigkeiten seines Branches und nichts leakt zwischen den Features.

### Kommerzielle Lizenzen, die node_modules patchen

Der Fallstrick, der uns wirklich erwischt hat: [Kendo UI](https://www.telerik.com/kendo-angular-ui) legt seine Lizenz-Aktivierung als gepatchte Dateien unter `node_modules/@progress/kendo-licensing/` ab. Die Aktivierung lebt also im Installationsartefakt statt im Repo und ein frischer Worktree beginnt bei null. Fairerweise: Findet Telerik den Key von selbst (als `telerik-license.txt` oder Umgebungsvariable), erledigt ein Postinstall-Script das gleich beim `npm install`. Bei uns kapselt ihn ein eigenes npm-Script, also heißt es: nach jedem `npm install` in jedem Worktree neu aktivieren, sonst rendern die Komponenten mit Wasserzeichen und Lizenz-Warnung. Die Lehre verallgemeinert sich gut: Was ein frisches `npm install` überschreibt oder vergisst, muss der Init-Command pro Worktree wiederherstellen.

### Eigene Ports für jeden Ast

Spätestens wenn zwei Äste gleichzeitig *in Betrieb* sind, wird es eng: Beide Angular-Dev-Server wollen Port 4200, beide APIs denselben Port, beide Datenbank-Container sowieso. Meine Lösung ist unspektakulär, ein festes Port-Schema pro Ast:

| Dienst | Hauptrepo | Ast 1 | Ast 2 |
|---|---|---|---|
| Angular Dev-Server | 4200 | 4201 | 4202 |
| Backend-API | 5001 | 5011 | 5021 |
| Datenbank | 1433 | 1434 | 1435 |

Technisch ist das schnell verdrahtet: beim Frontend `ng serve --port 4201`, beim Backend die URL per Umgebungsvariable (`ASPNETCORE_URLS`), beim Datenbank-Container das Port-Mapping im Compose-File. Wichtig ist nur Konsequenz: Das Frontend eines Astes muss auch auf die API **desselben** Astes zeigen (Proxy-Konfiguration beziehungsweise environment-Datei), sonst testet man fröhlich gegen das falsche Backend und wundert sich über Geisterdaten.

### Parallele E2E-Läufe

Die Königsdisziplin. Zwei Testläufe auf einer gemeinsamen Datenbank sabotieren sich gegenseitig: Der eine räumt gerade die Testdaten ab, auf die der andere wartet. Wer parallel testen will, braucht getrennte Datenbank-Instanzen pro Ast, oder wenigstens sauber getrennte Daten-Buckets innerhalb einer Instanz. Mit dem Port-Schema von oben ist die getrennte Instanz meist der einfachere Weg: zweiten Container hochziehen, Port eintragen, fertig.

> **⚠️ Aufräumen ohne Angst:** `git worktree remove` verweigert den Dienst, solange im Worktree uncommittete Änderungen oder unversionierte Dateien liegen (erst `--force` überstimmt das). Und committete Arbeit hängt nicht am Worktree: Der Branch samt aller Commits, auch ungepushter, lebt im gemeinsamen Repo weiter. Verlieren kann man beim Aufräumen also nur, was nie committet wurde: vor dem `remove` kurz committen oder bewusst verwerfen, dann weg mit dem Ast.

## Ein Vormittag auf drei Ästen

Zurück zu dem Vormittag vom Anfang, diesmal mit Worktrees:

**Neun Uhr.** Claude Code startet das große Refactoring auf Ast 1, im Worktree `app-frontend-shop-4708-refactor`. Die Tests laufen mit, der Lauf wird dauern.

**Zehn nach neun.** Der Bug-Report: Produktion, falsche Preise im Warenkorb, sollte heute noch raus. Früher der Moment der drei schlechten Optionen. Heute tippe ich in einem neuen Terminal `/feature-init`, nenne das Feature `shop-4711-hotfix-prices`, und ein paar Minuten später stehen zwei frische Worktrees samt Abhängigkeiten und Lizenz bereit. Eine zweite Session bekommt den Bug. Ast 1 merkt davon nichts.

**Kurz vor zehn.** Der Fix ist da, die Tests sind grün, kurzer Blick auf Port 4202: Die Preise stimmen wieder. Commit, Push, Review, Merge. Das Refactoring auf Ast 1 läuft immer noch, ungestört.

**Halb elf.** Das Refactoring ist durch, holt sich den gemergten Preis-Fix per Rebase dazu und wartet auf Review. Ich könnte jetzt auf einem dritten Ast das nächste Feature starten. Ehrlicherweise lese ich stattdessen erst einmal Diffs: Äste austreiben ist billig geworden, Äste verantworten nicht.

## Fazit: Isolation ist die Eintrittskarte

Rückblickend ist die Erkenntnis fast banal: **Parallelität beginnt beim Arbeitsverzeichnis.** Die klassische Entwicklung hat dieses Problem kaum gekannt, die Isolation kam mit dem persönlichen Rechner gratis. Mit vielen Agenten auf einer Maschine muss man sie explizit herstellen, denn solange sich zwei Sessions einen Checkout teilen, ist alles andere Kosmetik. git worktrees lösen das mit Bordmitteln in Sekunden, und die gesamte Branche hat es erkannt: lokal per Worktree, in der Cloud per Wegwerf-VM.

Wo die eingebauten Features enden, nämlich an der Repo-Grenze, fängt ein selbstgebauter Init-Command an: ein Kommando, zwei Repos, ein Branch-Name, zwei Äste, Abhängigkeiten und Lizenz inklusive. Das Ganze ist eine simple Markdown-Datei. Aber sie verwandelt den lästigsten Teil des Multi-Repo-Alltags in eine einzige Frage: „Wie heißt das Feature?"

Ehrlich bleiben will ich auch diesmal:

- **Parallelität ist kein Selbstzweck.** Drei Agenten erzeugen dreimal so viele Diffs, und irgendwer (ich) muss sie alle lesen. Dazu vertragen sich nicht alle Features: Manche schließen sich gegenseitig aus, andere müssen in einer festen Reihenfolge einfließen. Worktrees halten die Stände sauber auseinander, aber was wann gemergt wird, bleibt Kopfarbeit. Der Flaschenhals ist das Review.
- **Der Mental Load bleibt.** Von Ast zu Ast springen ist im Kopf anstrengender als auf der Platte. Mehr als zwei, drei Äste gleichzeitig gönne ich mir deshalb selten. Die Technik gäbe locker mehr her. Mein Kopf kommt beim Review vorher an seine Grenze.
- **Disziplin gehört dazu.** Deps installieren, Lizenz aktivieren, Ports zuweisen, am Ende aufräumen. Deshalb steckt all das im Init-Command statt in meinem Gedächtnis.

**Fragen, Feedback, eigene Worktree-Tricks?** Immer her damit, ich freue mich über jede Nachricht. Und wenn dir der Init-Command gefällt: Bau ihn nach. Er ist absichtlich so generisch gehalten, dass er in jedes Zwei-Repo-Setup passt.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
