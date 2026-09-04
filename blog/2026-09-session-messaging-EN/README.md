---
title: 'A Shout Between Terminals: Claude Code Sessions Message Each Other'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe is a trainer and consultant for modern web development. The workshops at <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> and <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> focus on Angular in practice – and increasingly on agentic development with AI agents like Claude Code.'
bioHeading: About the author
published: 2026-09-24
keywords:
  - Claude Code
  - Cross-Session Messaging
  - SendMessage
  - ListAgents
  - Agentic Coding
  - Parallel Sessions
language: en
header: header.jpg
---

Your agents are working on overlapping tasks, say on two features for the same project. Agent A has a message for agent B. Until now, you had to play the postman, with copy and paste. That is over.

**Since August, Claude Code sessions can message each other. Claude passes the finding along itself, instead of you copying it from one window into the next (or abusing a file as a mailbox).**

The feature is called cross-session messaging, it is on by default, and it is deliberately built narrow: it transports text, nothing else.

## Contents

[[toc]]

## What the feature does

The mechanics come down to two new tools: `ListAgents` finds out which sessions are reachable, `SendMessage` delivers the message. Claude calls both of them itself, you type neither.

The [official docs](https://code.claude.com/docs/en/cross-session-messaging) describe the purpose with an example that anyone working with several sessions knows: "When a change in one session breaks what another is building on, Claude can warn that session before you notice." The session that is currently rebuilding the database schema reports that to the session still developing against the old state.

It is a young feature. It arrived with Claude Code 2.1.224 on August 7, 2026, first for macOS and Linux, with Windows following a few weeks later. Within a single session, `SendMessage` has been around longer: Claude uses it to give an already spawned subagent another instruction and pick its work back up. What is new is the path across session boundaries.

## The most important sentence in the docs

Before we get practical, the one restriction that explains everything else:

> "A message is a piece of text one Claude writes to another, never the sender's conversation history or files. To move a whole conversation or its context, resume the session instead."

So what gets transported is **text only**. No history, no files, no context. Anyone expecting the other session to know afterwards what the first one spent all morning thinking about is expecting the wrong thing. For that case, the docs name the right tool right away: "resume the session instead", so `--resume` or `/resume`. And if you want to take the conversation so far with you and continue from there in a different direction, use `/branch`, which per its description creates "a branch of the current conversation at this point" (the command used to be called `/fork`, and that alias still works).

Back to the message. That it only transports text sounds like a weakness, but it is exactly why the feature is so practical: a message is a shout. Short, clear, without ballast. And for whatever needs to survive, there is still the hard disk: notes, research archives, files in the repository.

## How you use it

In practice you simply say what the other session should know, and Claude takes care of the rest, from picking the right session to phrasing the message:

> **🛠️ Try it yourself**
> ```text
> Ask the session working on the migration whether it is done
> ```

If you want to name the target session precisely, mention it with `@` and the first letters of its name, the same way you mention a subagent:

```text
Tell @api-worker that the schema migration is done
```

If it plays dumb and claims it cannot do this (yes, that happens), just name the tools: `ListAgents` to find the other session, `SendMessage` to deliver the message. After that it hopefully works.

If you want to look for yourself who is reachable right now, type `/list-agents`. The first line is your own name, the one the others use to address you. Below it are your own session's subagents, other local sessions and, if Remote Control is connected, your sessions on other machines and on the web as well. On top of that come the members of an agent team, if you run one. That is a feature of its own: a group of sessions that Claude sets up and supervises itself.

Your own inbox address, by the way, is shown by `/status` in the "Peer address" row.

## The name is the address

Which brings us to the question that comes up immediately: where does the name come from that a session is addressed by? The answer: from the name of the conversation! Claude Code assigns a readable suggestion at startup (often a fairly useless one), and you can change it at any time:

- `/rename` (alias `/name`) renames the running conversation, meaning your current session.
- `claude --name <name>` sets the name right at startup.
- When you accept a plan, the session names itself after its content.

That the conversation name really is the address shows in the bug fixes in the changelog. It says verbatim that a reverted `/rename` name "broke addressing the session by its new name". So anyone running several sessions in parallel should give them meaningful names early. That is the actual trick to this feature.

> **💡 Tip:** When two sessions share a name, the name alone is no longer enough. `ListAgents` then appends a short reference in square brackets, and only with that does the message reach the right one. Meaningful names save you that detour.

## How a message arrives

Delivery is built more considerately than you would expect. If the target session is working, Claude reads the message **between two tool calls**, so a running tool is never interrupted. If the session is idle, meaning it finished its turn with nothing queued, the message starts a new turn there.

There is one condition: the process has to be running. According to the docs, a session only appears in the listing at all once it binds its inbox socket. Whoever closed the terminal is unreachable. You do not have to sit in front of it, though, and background sessions count just the same.

This shows up as a one-line preview that stays in the conversation afterwards. The docs show it like this:

```text
› Message from @api-worker: Schema migration finished (ctrl+o to expand)
```

With `Ctrl+O` you read the full text, and in a session started with `--verbose` it is there in full anyway. Only the display is shortened: Claude always reads the entire message.

One thing worth knowing before you use the feature generously: a delivered message counts toward your usage like a prompt you type yourself. In effect that is all it is, another prompt from an additional source. Claude does know, however, that you did not type it and that another session wrote it. In my experience, a strong model is rightly more skeptical at that point and checks everything itself first.

That is by design: a message from another session explicitly carries **no user authority**. The changelog states verbatim that relayed messages "no longer carry user authority" and that the receiving side refuses relayed permission requests. So anyone hoping to obtain a permission through a second session that was denied in the first one is out of luck. And that is exactly how it should be.

## The idle notice

For long runs there is a second route that works without asking: Claude can ask another session on the same machine to report back **once**, as soon as it next goes idle or exits.

> **🛠️ Try it yourself**
> ```text
> Let me know when the migration session is finished
> ```

That is a subscription, not a standing order and not polling. In the changelog the parameter behind it is called `notify_when_idle`, described as "opt-in, one-shot, no polling". Instead of checking every few minutes, you get exactly one notice. Anyone regularly running long jobs on the side, for example on a machine of its own as in my [ground station article](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini), saves themselves the constant checking.

Two restrictions come with it. There is only this one event, namely idle or exit, and no freely chosen triggers. And it only works between sessions on the same machine.

## What protects you

A feature where other sessions write text into yours raises fair questions. The answers are in the docs, and they are reassuringly concrete.

**The route stays local.** Messages between sessions on the same machine travel over a per-session socket, verbatim "never through Anthropic servers".

**Permissions stay separate.** The docs put it as a hard boundary: "Permission boundaries stay per-session." Claude is instructed never to ask another session for something that would be forbidden in its own session, and the receiving session applies its own rules to whatever the message asks for.

**You decide what comes in.** The `crossSessionInbound` setting knows three values: `accept` delivers, `hold` sets the message aside until you approve it, `refuse` drops it without delivery. You can also pick this in the `/config` dialog.

**The machine boundary can be locked.** With `isolatePeerMachines: true`, Claude Code requires your explicit approval before a message leaves the machine, and it does so even in `bypassPermissions` mode.

**Turning it off entirely works too**, separately in each direction: `crossSessionInbound: "refuse"` for receiving, deny rules for `SendMessage` and `ListAgents` for sending. Organizations can set both centrally. One detail worth knowing: denying `SendMessage` also takes away messages to your own subagents and to the members of an agent team, because the same tool serves all three routes.

## The limits

A few properties of the channel are built in for good, and all three make sense:

**Plain text only.** Structured protocol messages stay within an agent team.

**Size cap.** If the message grows too large, Claude Code refuses it at the sender before it leaves. The cap sits at roughly a million characters, which is absurdly large. Nobody wants to send messages that big anyway.

**Loops run themselves into the ground.** Repeats to the same session are rate-limited, identical messages within a short window are dropped, and the queue holds at most fifty messages. The docs put it dryly: "A message loop between two sessions therefore stops on its own." Two sessions egging each other on are a solved problem.

## When to use something else

The docs draw the boundaries themselves, and this list is worth reading before you solve everything with messages:

- Want to **continue a conversation elsewhere**? Use `--resume`.
- Want a **coordinated team** that Claude sets up and supervises itself? Use agent teams. They are still experimental and off by default, so you have to enable them through the `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` environment variable.
- Want to **watch many sessions in one place**? Use the agent view.
- Want to **steer a session yourself from your phone**? Use Remote Control, see the ten commands in my [commands article](https://agentic.schule/blog/2026-09-claude-code-befehle).
- Want to **push external events in**, such as CI results? Use channels.

Cross-session messaging is for the case in between. You start and steer your sessions yourself. One of them learns something mid-task that another one needs right now.

> **💡 Remember:** The message is meant as a short-lived shout. Everything large, or meant to survive longer, still belongs on the hard disk.

## Conclusion

Cross-session messaging is a practical feature with one clear job, and that is exactly why it is good. It hands one sentence from one terminal to the next, at the right moment, without you switching windows.

Anyone already working with several sessions, for example with [git worktrees](https://agentic.schule/blog/2026-09-agentic-coding-git-worktrees) per task, gets the missing piece with it: the branches know about each other. And the first step there is a single command, namely `/rename` in every session, so your windows have meaningful names.

**What was the first message your sessions sent each other?** I would love to collect the best ones.

---

*Curious about agentic work in practice? In the workshops at [agentic.schule](https://agentic.schule) and [angular.schule](https://angular.schule) we show how modern AI agents are changing everyday development.*
