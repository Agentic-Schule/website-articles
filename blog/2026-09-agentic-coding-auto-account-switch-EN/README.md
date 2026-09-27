---
title: 'Agentic Coding Around the Clock: Refueling in Mid-Flight'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe is a trainer and consultant for modern web development. The workshops at <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> and <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> focus on Angular in practice – and increasingly on agentic development with AI agents like Claude Code.'
bioHeading: About the author
published: 2026-10-07
keywords:
  - Agentic Coding
  - AI Agent
  - Claude Code
  - Claude Max
  - Account Switch
  - Rate Limit
  - Remote Control
  - Supply Chain
  - MITM Proxy
language: en
header: header.jpg
---

**A ground station that never shuts down burns fuel around the clock. Sooner or later the tank runs dry. This article shows how Claude Code switches between two Max subscriptions while it keeps running, automatically and without `/logout`. Remote Control survives the switch. And it shows why I give no advance trust to tools that handle my access keys.**

## Contents

[[toc]]

## The Problem: One Tank Is No Longer Enough

In the [first part](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini) I turned a Mac mini into a "ground station": a machine that is always on and on which my agents keep working. I watch and step in from the MacBook, the browser or my phone. At the very end there was a casual sentence: because the agent is reachable at any time, I've been "ruthlessly maxing out" the generous limits of the Claude Max subscription.

This part picks up right there. A setup that is always on has a predictable side effect: it uses more. The agents keep working at night, I throw in tasks while on the road, several sessions run in parallel. The 5-hour window and above all the weekly limit of the Max subscription are generous. They are not infinite.

The obvious solution is a **second Max subscription**. Two tanks instead of one. But Claude Code only ever knows *one* signed-in account. Switching means `/logout`, then `/login`, then the OAuth flow in the browser. Every single time. The running work stands still, and the browser wants attention.

On top of that comes a second, more annoying effect: an account switch cuts the **Remote Control connection**. That is exactly the feature from part 1 that lets me watch from my phone. One switch, and the session on the phone is gone.

So the goal sounds simple: **switch between two subscriptions while running, without signing out and without losing remote control.**

## No Router Needed: Claude Code Re-Reads the Credentials

The obvious idea would be a proxy that redirects `ANTHROPIC_BASE_URL`. That is how people run Claude Code against third-party or local models. But that is not what this is about. I still want the real Anthropic models, just sometimes through account A and sometimes through account B.

That doesn't take a router. The key is a detail: **Claude Code re-reads its credentials when they change.** If they live in a file, Claude Code reacts to every change of that file, and the *next* message already goes through the new account. On macOS the credentials usually live in the Keychain. According to the [`claude-swap` documentation](https://github.com/realiti4/claude-swap#tips), Claude Code caches them there for about 30 seconds, after which the switch takes effect as well. On my mini they live in a file at `~/.claude/.credentials.json`.

In practice this means: whoever swaps this file switches the account. No restart and no `/login`.

## Two Subscriptions, One Switch While Running

That is exactly what the open source tool [`claude-swap`](https://github.com/realiti4/claude-swap) does (command: `cswap`, MIT license). It stores the credentials for each account and swaps them on demand. You sign in **once** per subscription, after that this is enough:

```bash
cswap switch 2      # from the next message on, everything runs on subscription 2
cswap switch 1      # back
cswap list          # usage (5h/7d) of all accounts
```

One detail of my setup matters: all sessions share **one** global credential file. A `cswap switch` therefore moves *the whole fleet* to the other subscription. That is exactly what I want when account A hits its weekly limit.

This is how you register the accounts:

```bash
cswap add            # add the current account as slot 1
# in Claude Code, run /login once with the second account
cswap add            # add the second account as slot 2
cswap switch 1       # back to subscription 1
```

> **⚠️ Warning:** Do not run `/logout` before the second `/login`. According to the [`claude-swap` instructions](https://github.com/realiti4/claude-swap#add-more-accounts), Claude Code may revoke the refresh token of the account you are leaving.

The browser login per account is the only step no tool can take off your hands. After that it's done.

## Trust Is Good, Forking Is Better

`cswap` handles my **OAuth tokens**, the keys to my accounts. Before a tool like that runs on a machine that never shuts down, I want to know what it does. So I read the source code first, before typing `pipx install`.

The most important question: where does network traffic go? The source code only contains Anthropic's own endpoints (`api.anthropic.com`, `platform.claude.com`) and a version check against PyPI. No third-party domain, no telemetry. The package is published through PyPI's *Trusted Publishing* from a GitHub workflow, and the repo comes with an extensive test suite. So far, so trustworthy.

Still, I don't pull a tool that holds my keys via auto-update from someone else's pipeline. The real risk is rarely *today's* code. It is *tomorrow's* malicious release that slips in as a casual upgrade. What that looks like is shown in the article about [malicious AI skills](https://agentic.schule/blog/2026-09-malicious-ai-skills). That's why I take the clean route:

```bash
# fork into your own account and check out the reviewed state locally
gh repo fork realiti4/claude-swap --clone
# ... read the code, then install from your own copy:
pipx install ./claude-swap
# updates only on purpose: fetch upstream, read the diff, reinstall
```

There is no `cswap upgrade` on my machine. That way, only code I have read gets to run.

## Remote Control Survives the Switch

That leaves the second problem: the account switch cuts remote control. The reason is structural. A Remote Control session belongs to the account whose token created it. Swap the account, and phone and web lose the session, while orphaned sessions pile up on the old account. The same goes for artifacts: after a switch, republishing fails.

The solution is called [`cswap-pin`](https://github.com/codeslake/cswap-pin) and comes from Junyong Lee. It is a **local proxy** that does exactly one thing: on Anthropic's routes for Remote Control and artifacts it inserts the token of the *pinned* account. The actual inference via `/v1/messages` passes through unchanged. It keeps following the switch. Ownership of the cloud objects stays put, the compute load moves.

```bash
cswap pin 1          # Remote Control and artifacts stay on account 1
```

At the time of this article, the integration into `cswap` is an [open pull request](https://github.com/realiti4/claude-swap/pull/210) in the upstream project. I merged it into my fork.

What this means technically belongs on the table: the proxy is a *man-in-the-middle* (MITM). It terminates TLS locally with its own *Certificate Authority* (CA), which only the Claude sessions trust. That means it sees the Anthropic traffic in plain text. I forked and read this one too before it was allowed on the box. For a tool that sees your traffic, that is mandatory.

## The Autopilot: Ground Control Refuels on Its Own

Switching by hand is nice. The real gain is the automation: `cswap auto` checks the usage and switches **on its own** to the subscription with the most headroom as soon as the active account reaches a threshold. By default it sits at 90 percent of the 5-hour or weekly window.

With `--once` the command runs exactly one pass and exits. The tool stores cooldown and state on disk. That fits a `launchd` timer perfectly, and no terminal has to stay open. On my machine it runs as a LaunchDaemon every minute:

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

In daily use the result is completely unspectacular, and that is exactly how it should be. At some point account 1 reaches the threshold, the service switches to account 2, and I keep working. I don't notice a thing.

## When My Own Agents Raised the Alarm

The best twist came from the agents themselves.

The ground station was running a multi-stage editing workflow: research agents check the facts of an article on the web. Suddenly these agents raised the **alarm**. They considered the fetched content tampered with and cited the proxy environment variables and the foreign CA as evidence of an attack. They saw a man-in-the-middle and did exactly what a vigilant reviewer is supposed to do.

That is a feature. The agents had no way of knowing where the proxy came from. From their point of view a man-in-the-middle with its own CA was sitting there, and that *could* have been malware.

Were they right? That can be checked instead of explained away. A request to `example.com` through the proxy comes back with the *real* public certificate. Had the proxy been reading along, it would have been its own. The source code confirms it as well: the proxy decrypts **only** `api.anthropic.com`. It passes every other host through as a blind tunnel.

So the agents were wrong about the *facts*; the traffic was genuine. Their *instinct* was right. Because their alarm points to a weakness in the design: all web requests go through the proxy for no reason. The pin only needs the connection to Anthropic. So I narrowed the reach: a small wrapper removes the proxy variables for the research agents' web requests. Those now go straight to their destination.

And here a principle from part 1 returns: **never tell the agents about the pink elephant.** I did not explain to the agents that the proxy is harmless. Otherwise they would blame every problem on it from then on. Instead, the *trigger* is gone. Only Ground Control still sees the elephant.

## A Principle: Never Blindly Hand a Tool Your Keys

Condensed into one sentence: **A tool that touches your access keys or your traffic gets no advance trust. Fork it, read the code, install from your copy and only update on purpose.**

The setup confirmed this principle twice. Once deliberately, by forking and reading the tools. And once spontaneously through the agents, whose false alarm missed on the facts but asked the right question. In an agentic setup, distrust is hygiene.

## The Downsides

But for all the joy about the seamless switch: the setup comes at a price.

- **The terms of use are not tailored to a setup like this.** In the [legal notes on Claude Code](https://code.claude.com/docs/en/legal-and-compliance#authentication-and-credential-use), Anthropic writes about third-party developers: "developers may not collect, store, or intermediate Claude.ai credentials or session tokens". `cswap` stores tokens, and the pin proxy intermediates them. My reading: the rule targets products that route other users through their subscriptions. I use my *own* subscriptions on my *own* machine with the official client, and nobody else gets access. That is my interpretation, though, not an approval from Anthropic. According to the same page, Anthropic reserves the right to enforce measures "without prior notice". What the [Consumer Terms](https://www.anthropic.com/legal/consumer-terms) clearly forbid is sharing: "You may not share your Account login information […] or make your Account available to anyone else." So keep your hands off that.
- **Your own forks need maintenance.** With every upstream update: read the diff, reinstall. That is the price of not trusting someone else's auto-update.
- **A MITM proxy is a big concession.** It sees the Anthropic traffic in plain text. That is only acceptable because I have read the code and its reach is limited to the bare minimum.

## Conclusion: Flying On Flawlessly

The goal is reached: two Max subscriptions, an account switch while running, automatically before a limit kicks in, and Remote Control survives the switch. No more `/logout`-`/login` dance, no break in the flow. Ground Control refuels, Major Tom flies on.

For me the gain clearly outweighs the cost. The ground station keeps running, no matter which tank is burning right now. The most important insight isn't even technical; it came from the agents themselves: healthy distrust belongs exactly where you hand tools your keys.

If you hit a limit yourself: start with `cswap list` and see how fast your tanks really run dry. And read the code before you give it your keys.

By the way, while writing I once again had a Bowie song in my head. This time it's the sequel to *Space Oddity*, in which Major Tom returns. Here you go, your earworm:

<iframe src="https://www.youtube.com/embed/HyMm4rJemtI" title="David Bowie – Ashes to Ashes (Official Video)" style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 8px;" allowfullscreen loading="lazy"></iframe>

<small>If the player doesn't load: [watch directly on YouTube](https://youtu.be/HyMm4rJemtI).</small>

**Questions, feedback, your own tinkering?** Bring it on. And in case you missed part 1: [that's where the ground station was built.](https://agentic.schule/blog/2026-09-agentic-coding-mac-mini)

<small>**Thanks** to realiti4 for `claude-swap` and to Junyong Lee for `cswap-pin`. Both projects are open, well tested and easy to read. That is exactly what makes it possible not to have to trust them blindly.</small>

---

*Curious about agentic work in practice? In the workshops at [agentic.schule](https://agentic.schule) and [angular.schule](https://angular.schule) we show how modern AI agents are changing everyday development.*
