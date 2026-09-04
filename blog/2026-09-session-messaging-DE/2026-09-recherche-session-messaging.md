# Recherche: Sitzungen schreiben einander Nachrichten

Quellenarchiv für den Artikel `blog/2026-09-session-messaging-DE/`. Alles am 4. September 2026 an den Primärquellen geprüft: offizielle Doku (Volltext per Playwright), Changelog des Claude-Code-Repos (per `gh api`), Release-Daten (npm), Binary 2.1.260 (`strings`).

## Wie das Feature heißt

**Cross-Session Messaging.** Offizielle Doku-Seite: <https://code.claude.com/docs/en/cross-session-messaging>, Titel „Message your other Claude Code sessions", einsortiert unter „Agents and parallel work". Zwei Werkzeuge: `ListAgents` zum Finden, `SendMessage` zum Zustellen. Im Binary heißen sie `ListAgentsTool` und `SendMessageTool`; `ListAgents` trägt intern zusätzlich den Namen `ListPeers`. Slash-Befehl zum Nachsehen: `/list-agents`.

## Seit wann es das gibt (Changelog + npm-Release-Daten)

| Version | Datum | Was |
| --- | --- | --- |
| 2.1.77 | 16.03.2026 | `SendMessage` existiert bereits, aber nur innerhalb einer Sitzung: „The Agent tool no longer accepts a `resume` parameter — use `SendMessage({to: agentId})` to continue a previously spawned agent" |
| **2.1.224** | **07.08.2026** | **Die Geburtsstunde:** „Added cross-session `SendMessage`: Claude Code sessions can now message each other, on any of your machines, with `ListAgents` to discover them (macOS and Linux)". Im selben Release: die Einstellungen `crossSessionInbound` und `dialogExpiry` |
| 2.1.239 | 21.08.2026 | Windows dazu (Changelog-Wortlaut); außerdem: „`ListAgents` now tells a session its own name" und Teammates erscheinen erstmals in der Liste |
| 2.1.248 | 27.08.2026 | Auch auf Bedrock, Vertex und Foundry sowie bei abgeschalteter Telemetrie |
| 2.1.260 | 03.09.2026 | Aktuelle Fassung, u. a. Fix gegen Doppel-Einträge in `ListAgents` |

⚠️ **Abweichung, die im Artikel nicht behauptet werden darf:** Die Doku nennt für natives Windows **v2.1.234**, der Changelog führt Windows dagegen unter **2.1.239**. Beide Quellen sind offiziell. Im Zweifel die Doku-Angabe zitieren und die Changelog-Zeile nicht als Datum dagegenstellen.

Weitere versionierte Details aus der Doku: `@`-Erwähnung der Ziel-Sitzung ab 2.1.232, `notify_when_idle` ab 2.1.236 (in beiden Sitzungen), einzeilige Vorschau statt Volltext ab 2.1.247, `@`-Erwähnungen in Nachrichten hängen seit 2.1.251 keine Dateien mehr an.

## Was die Doku sagt (wörtlich)

- Zweck: „Cross-session messaging lets Claude deliver a message from one of your Claude Code sessions to another. When a change in one session breaks what another is building on, Claude can warn that session before you notice."
- Was übertragen wird: „A message is a piece of text one Claude writes to another, never the sender's conversation history or files. To move a whole conversation or its context, resume the session instead."
- Zustellung: „The receiving Claude reads the message between tool calls during an active turn, so a running tool is never interrupted. When the receiving session is idle, Claude Code starts a new turn with the message."
- Kosten: „Once delivered, the message counts toward usage like a prompt you type."
- Rechte: „Permission boundaries stay per-session. Claude is instructed never to ask another session for an action that was denied or blocked in its own session … and to route that work back to you instead."
- Anzeige: einzeilige Vorschau, Beispiel aus der Doku: `› Message from @api-worker: Schema migration finished (ctrl+o to expand)`, Volltext per Ctrl+O oder mit `--verbose`.
- Drei Zustände einer ankommenden Nachricht: **Delivered**, **Held**, **Refused** (Einstellung `crossSessionInbound` mit `accept`, `hold`, `refuse`; auch über die `/config`-Zeile „Messages f…" wählbar).
- Grenzen: nur Klartext; Größenlimit rund eine Million Zeichen; Bursts werden beim Absender abgewiesen; Schleifen werden gedrosselt (Ratenlimit pro Absender, identische Wiederholungen innerhalb kurzer Zeit verworfen, höchstens 50 Nachrichten in der Warteschlange), „A message loop between two sessions therefore stops on its own."
- Abgrenzung laut Doku: für eine fortgesetzte Konversation `--resume`, für ein koordiniertes Team die Agent Teams, für viele Sitzungen an einem Ort die Agent View, fürs Steuern vom Handy Remote Control, für externe Ereignisse die Channels.
- Abschalten: `crossSessionInbound: "refuse"` fürs Empfangen, Deny-Regeln für `SendMessage` und `ListAgents` fürs Senden; beides auch per Managed Settings für eine Organisation. Achtung laut Doku: „Denying SendMessage also removes messaging to subagents and agent-team teammates, since the same tool serves both."
- Maschinen-Grenze: `isolatePeerMachines: true` verlangt ausdrückliche Zustimmung, bevor eine Nachricht die Maschine verlässt, „even in bypassPermissions mode".
- Transportweg: „Claude Code delivers these messages over a per-session socket on your machine, never through Anthropic servers." Die eigene Adresse zeigt `/status` in der Zeile „Peer address".
- Sitzungen jenseits der Maschine (Cloud, andere Rechner) brauchen Remote Control mit claude.ai-Anmeldung; mit API-Key, Bedrock, Vertex oder Foundry findet Claude sie nicht. Cloud-Sitzungen können empfangen, aber nicht zurückschreiben.

## Wörtlich aus dem Binary 2.1.260

`ListAgents`-Beschreibung: „Lists agents you can SendMessage to — in-process subagents you spawned, the teammates on your team, other local Claude sessions on this machine, your Claude sessions running in the cloud (when this session has cloud access; a cloud session receives your message but cannot message any session back yet — do not ask it to reply, read its answer in its own transcript), and (when Remote Control is connected here) your account's other sessions — Remote Control sessions on other machines and cloud sessions, each row labeled by kind. Names are the address: send with `SendMessage({to: "<name>", message: "..."})`, copying the name exactly as a row prints it. Append a row's ` [ref]` only when the bare name is not enough — two rows share it, or an error asks you to disambiguate."

## Eigene Beobachtung aus dieser Sitzung (4. September 2026)

Ein Fork dieser Sitzung hat den Slogan an die Website-Sitzung geschickt. Belege dafür, was im Artikel als Erfahrung taugt:

- `ListAgents` zeigte hier **86 erreichbare Peers** plus die Remote-Control-Einträge.
- **Namensgleichheit ist der Stolperstein:** Drei Sitzungen hießen `agentic.schule`. Erst mit dem Ref `[5355cb]` ging die Nachricht an die richtige, nämlich die aktive lokale. Die beiden Remote-Control-Namensvettern waren seit Tagen offline.
- Antworten der Empfängerin landen **nicht** beim Fork, sondern in der Hauptkonversation. Deckt sich mit der Changelog-Zeile zu 2.1.x: „Changed `SendMessage` from a subagent to another session: the result now notes that any reply is delivered to the parent session's conversation, not to the subagent."
- Niemand musste vor der Empfängerin sitzen; die Antwort kam später und von selbst in die Hauptkonversation. ⚠️ „Wach" ist als Begriff untauglich: Bedingung ist laut Doku allein, dass der Prozess läuft und seinen Inbox-Socket hält („A session appears only when it binds an inbox socket"). Im Leerlauf startet die Nachricht eine neue Runde, mitten in der Arbeit wird sie zwischen zwei Werkzeug-Aufrufen gelesen. Keine Magie, eine Zustellung in die laufende Konversation.

## Quellen

- <https://code.claude.com/docs/en/cross-session-messaging> (Volltext gelesen)
- Changelog: `gh api repos/anthropics/claude-code/contents/CHANGELOG.md`, Einträge zu 2.1.224, 2.1.239, 2.1.248, 2.1.260
- Release-Daten: `npm view @anthropic-ai/claude-code time`
- Binary: `~/.local/share/claude/versions/2.1.260`, Strings zu `ListAgentsTool`, `SendMessageTool`, `ListPeers`, `notify_when_idle`, `isolatePeerMachines`
