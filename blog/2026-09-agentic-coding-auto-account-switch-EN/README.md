---
title: 'Agentic Coding Around the Clock: Maxing Out Multiple Claude Max Plans Without Interruption'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe is a trainer and consultant for modern web development. The workshops at <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> and <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> focus on Angular in practice – and increasingly on agentic development with AI agents like Claude Code.'
bioHeading: About the author
published: 2026-09-28
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

**Your weekly limit in Claude Code is almost reached? Don't worry, there is a solution. Usage credits and `/limit-reset` are not it. This article shows how Claude Code switches between multiple Max subscriptions instead: automatically, shortly before the limit, without `/logout` and without Remote Control dropping.**

## Contents

[[toc]]

## Weekly Limit Reached: What Helps and What Doesn't

### Check First: `/usage`

`/usage` shows how far along you are. According to the [command reference](https://code.claude.com/docs/en/commands), it shows "session cost, plan usage limits, and activity stats" and breaks down what counts against your plan limits. It even runs while Claude is responding. Know this number before you pick one of the following paths.

### No Usage Credits

The obvious button is `/usage-credits`, formerly `/extra-usage`. It lets you keep working past the limit for a fee. According to the [Help Center](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans), usage credits are billed "at standard API rates", on top of your subscription. Prepaid [bundles](https://support.claude.com/en/articles/14246112-buy-usage-bundles) "save up to 30%", but they remain API prices with a discount.

The subscription plays in a different league. When Anthropic introduced the weekly limits, it wrote itself: "one user consumed tens of thousands in model usage on a $200 plan" ([X, July 28, 2025](https://x.com/AnthropicAI/status/1949898511287226425)). If you regularly hit the weekly limit, in my view there is no constellation in which usage credits come out cheaper than another subscription.

### No `/limit-reset`

For a few weeks now, a command has been showing up that is not in any [command reference](https://code.claude.com/docs/en/commands): `/limit-reset`. It is hidden in the command menu. A look into Claude Code 2.1.283 shows two programs behind it, each unlocked by a feature flag on the server:

- **A weekly reset of the 5-hour limit.** The notice in the program reads "reset your session limit now · uses weekly limit · 1/week", and the success message ends with "your weekly limit still applies". So the weekly limit stays untouched.
- **An allowance of resets with an expiry date.** It refills the limits ("{resets} left · use by {date}"). Anthropic decides who gets it.

Whether you may use a reset is also decided by the server. The code contains rejection reasons, among them `tier`, `tenure` (account age), `other_experiment` and `not_limited`, meaning "not at the limit yet". None of this is shown. In each of these cases the message reads "A session-limit reset isn't available right now." That is exactly what the reports are piling up about, for example in [#95810](https://github.com/anthropics/claude-code/issues/95810) and [#97348](https://github.com/anthropics/claude-code/issues/97348).

Even a working reset only buys you breathing room once. If you hit the limit every week, you will be there again next week.

### Another Max Subscription

That leaves the path that actually holds up: a **second Max subscription**, or a third or fourth if needed. Each one brings its full allowance at the subscription price. According to the [Help Center](https://support.claude.com/en/articles/11049741-what-is-the-max-plan), Max 5x costs $100 and Max 20x $200 per month.

## The Problem: Switching Between Accounts

Claude Code only ever knows *one* signed-in account. Switching means `/logout`, then `/login`, then the OAuth flow in the browser. Until then, the work stands still.

Worse is the moment the limit hits in the middle of the work. On my setup the agents run around the clock on a [Mac mini that never shuts down](https://agentic.schule/en/blog/2026-09-agentic-coding-mac-mini). When an account reaches its limit, running sub-agents stop with "Agent terminated early due to an API error: You've hit your session limit". According to numerous issue reports and painful experience of my own, often only a fragment of their work comes back, and it has to be started again ([#94770](https://github.com/anthropics/claude-code/issues/94770), [#74162](https://github.com/anthropics/claude-code/issues/74162), [#78231](https://github.com/anthropics/claude-code/issues/78231)). In [#94222](https://github.com/anthropics/claude-code/issues/94222) a user analyzed six of their sessions: "449 subagents were cut off, only 8 were resumed by id […] The other 438 were re-dispatched from scratch."

This is especially annoying with a wide fan-out. If you start many agents in parallel with an expensive model, exactly that run pushes your account to the limit. If it breaks off, the work is gone, and a second run costs the tokens all over again. So before every large run, decide which model and which effort the agents start with. With a dynamic workflow, one sentence to the main conversation is enough, for example "run the research agents with Sonnet at medium effort". Claude puts that into the script and starts the agents accordingly. Without such an instruction, according to the [documentation](https://code.claude.com/docs/en/workflows), every agent runs on your session's model. Why such a run costs a lot is explained in the article on [Graph Engineering](https://agentic.schule/en/blog/2026-09-graph-engineering#when-a-graph-is-worth-it-and-when-not).

On top of that, an account switch cuts the **Remote Control connection** that lets me watch from my phone. The same goes for artifacts, the pages Claude Code publishes on claude.ai. They belong to an account as well.

So the goal is: **switch to another subscription automatically before the limit, without signing out, without cancelled agents and without losing remote control.** That takes two tools: one that swaps the sign-in while running, and one that keeps Remote Control on one account while doing so.

## No Router Needed: Claude Code Re-Reads the Credentials

If you want to run Claude Code with other models, you usually reach for a router like [claude-code-router](https://github.com/musistudio/claude-code-router). It hooks in via `ANTHROPIC_BASE_URL`, the API address Claude Code talks to, and forwards every request. That is not what this is about. I still want the real Anthropic models, just sometimes through account A and sometimes through account B.

That doesn't take a router. The key is a detail: **Claude Code re-reads its credentials when they change.** If they live in a file, Claude Code re-reads them after every change, and the *next* message already goes through the new account. That is how the [`claude-swap` documentation](https://github.com/realiti4/claude-swap#tips) describes it, and that is how it behaves on my mini. There the credentials live in a file at `~/.claude/.credentials.json`. Otherwise, on macOS, they live in the Keychain. According to the same source, Claude Code caches them there for about 30 seconds, after which the switch takes effect as well.

In practice this means: whoever swaps this file switches the account. No restart and no `/login`.

## Setting Up Multiple Subscriptions to Switch

The open source tool [`claude-swap`](https://github.com/realiti4/claude-swap) takes care of that (command: `cswap`, MIT license). It stores the credentials for each account and swaps them on demand. It is not limited to two accounts. I work with two; the principle stays the same with three or four. How I install it is shown in the next section. You sign in **once** per subscription, after that this is enough:

```bash
cswap switch 2      # from the next message on, everything runs on subscription 2
cswap switch 1      # back
cswap switch        # rotate to the next account
cswap list          # usage (5h/7d) of all accounts
```

One detail of my setup matters: all sessions share **one** global credential file. A `cswap switch` therefore moves all sessions to the other subscription. That is intended when account A hits its weekly limit.

This is how you register the accounts:

```bash
cswap add            # add the current account as slot 1
# in Claude Code, run /login once with the second account
cswap add            # add the second account as slot 2
# for every further account: /login, then cswap add
cswap switch 1       # back to subscription 1
```

> **⚠️ Warning:** Do not run `/logout` before the second `/login`. According to the [`claude-swap` instructions](https://github.com/realiti4/claude-swap#add-more-accounts), Claude Code may revoke the refresh token of the account you are leaving.

The browser login per account is the only step no tool can take off your hands. After that it's done.

## Trust Is Good, Forking Is Better

`cswap` handles my **OAuth tokens**, the keys to my accounts. Before a tool like that runs on a machine that never shuts down, I want to know what it does. So I read the source code first, before typing `pipx install`.

The most important question: where does network traffic go? The source code only contains Anthropic's own endpoints (`api.anthropic.com`, `platform.claude.com`) and a version check against PyPI. No third-party domain, no telemetry. The package is published through PyPI's *Trusted Publishing* from a GitHub workflow, and the repo comes with an extensive test suite. So far, so trustworthy.

Still, I don't pull a tool that holds my keys via auto-update from someone else's pipeline. The bigger risk is future releases: a malicious update slips in as a casual upgrade. That is a classic *supply chain attack*. What that looks like is shown in the article about [malicious AI skills](https://agentic.schule/en/blog/2026-09-malicious-ai-skills). That's why I take the clean route:

```bash
# fork into your own account and check out the reviewed state locally
gh repo fork realiti4/claude-swap --clone
# ... read the code, then install from your own copy:
pipx install ./claude-swap
# updates only on purpose: fetch upstream, read the diff, reinstall
```

`cswap` comes with its own update command, `cswap upgrade`, which fetches the latest version from PyPI. I don't use it. That way, only code I have read gets to run.

## Remote Control: The Pin Holds the Session

That leaves the second problem: the account switch cuts remote control. The reason is structural. A Remote Control session belongs to the account whose token created it. Swap the account, and phone and web lose the session, while orphaned sessions pile up on the old account. The same goes for artifacts: after a switch, republishing fails.

The solution is called [`cswap-pin`](https://github.com/codeslake/cswap-pin) and comes from Junyong Lee. It is a **local proxy** that does exactly one thing: on Anthropic's routes for Remote Control and artifacts it inserts the token of the *pinned* account. The inference via `/v1/messages` passes through unchanged. It keeps following the switch. Ownership of the cloud objects stays put, the compute load moves.

```bash
cswap pin 1          # Remote Control and artifacts stay on account 1
```

At the time of this article, the integration into `cswap` is an [open pull request](https://github.com/realiti4/claude-swap/pull/210) in the upstream project. Until it is merged, `cswap pin` only exists if you merge the PR into your fork of `claude-swap`. I install the proxy itself from a fork of my own as well and inject it into the same environment:

```bash
gh repo fork codeslake/cswap-pin --clone
pipx inject claude-swap ./cswap-pin
```

What this means technically belongs on the table: the proxy is a *man-in-the-middle* (MITM). It decrypts the HTTPS connection to Anthropic locally. For that it uses its own *Certificate Authority* (CA). It is not installed system-wide. Claude Code is told about it via `NODE_EXTRA_CA_CERTS`. That is the same technique corporate proxies use, and Claude Code supports it [officially](https://code.claude.com/docs/en/network-config) via `HTTPS_PROXY` and `NODE_EXTRA_CA_CERTS`. That means the proxy sees the Anthropic traffic in plain text. I forked and read this one too before it was allowed on the box. So there are two forks in my account. For a tool that sees your traffic, that is mandatory.

## Switching Automatically: `cswap auto` as a Service

Switching by hand is nice. The gain lies in the automation: `cswap auto` checks the usage and switches **on its own** to the subscription with the most headroom as soon as the active account reaches a threshold. By default it sits at 90 percent of the 5-hour or weekly window.

With `--once` the command runs exactly one pass and exits. The tool stores cooldown and state on disk. That fits `launchd`, the service manager of macOS, and no terminal has to stay open. On my machine it runs every minute as a LaunchDaemon, a system service that starts without anyone logging in. The `UserName` key is important: without it, a LaunchDaemon runs as root and swaps the credentials in the wrong home directory. In the example, `YOUR-NAME` stands for your user name.

```xml
<key>ProgramArguments</key>
<array>
  <string>/Users/YOUR-NAME/.local/bin/cswap</string>
  <string>auto</string>
  <string>--once</string>
  <string>--json</string>
</array>
<key>UserName</key>
<string>YOUR-NAME</string>
<key>StartInterval</key>
<integer>60</integer>
```

In daily use the result is unspectacular, and that is how it should be. At some point account 1 reaches the threshold, the service switches to the practically untouched account 2, and I keep working. I don't notice a thing.

## False Alarm: The Agents Suspect an Attack

The best twist came from the agents themselves.

The mini was running a multi-stage editing workflow: research agents check the facts of an article on the web. During that, these agents raised the **alarm**. They considered the fetched content tampered with and cited the proxy environment variables and the foreign CA as evidence of an attack.

That is a feature. The agents had no way of knowing where the proxy came from. From their point of view a man-in-the-middle with its own CA was sitting there, and that *could* have been malware. That is how a vigilant reviewer should react.

Were they right? That can be checked instead of explained away. A request to `example.com` through the proxy comes back with the *real* public certificate. Had the proxy been reading along, it would have been its own. The source code confirms it as well: the proxy decrypts **only** `api.anthropic.com`. It passes every other host through as a blind tunnel.

So the traffic was genuine. Still, the alarm points to a trap: if you set the proxy variables and the CA for Claude Code, every shell an agent starts inherits them. Every command then sees the proxy, and every download goes through it. But the pin only needs the Claude process itself. That's why a single line in `~/.zshenv` removes the variables from every agent shell:

```bash
unset HTTPS_PROXY https_proxy HTTP_PROXY http_proxy ALL_PROXY all_proxy NODE_EXTRA_CA_CERTS
```

On my machine the agents' shell commands run through zsh, and zsh reads `~/.zshenv` on every invocation. The Claude process keeps the pin; the agents no longer see it in their shells.

And here a principle from part 1 returns: **never tell the agents about the pink elephant.** Once a session knows about an exotic setup, it explains every problem with that first. That's why I don't explain to the agents that the proxy is harmless. Instead, the agents don't see the proxy in their shells at all anymore. Only I still know about the elephant.

## A Principle: Never Blindly Hand a Tool Your Keys

**A tool that touches your access keys or your traffic gets no advance trust. Fork it, read the code, install from your copy and only update on purpose.**

The setup confirmed this principle twice. Once deliberately, by forking and reading the tools. And once through the agents, whose alarm asked the right question. In an agentic setup, distrust is hygiene.

## Within the Rules

The setup goes right up to the limits of Anthropic's rules, but deliberately stays within them. Every point where it hooks in is officially intended:

- **Claude Code stays unmodified.** No patch, no tampering with the program. Even for vendors who build Claude Code into their own products, Anthropic draws the line here: "The Claude Code binary must not be modified." ([legal notes](https://code.claude.com/docs/en/legal-and-compliance#can-customers-offer-claude-code-in-their-products))
- **Every sign-in goes through Anthropic's own login.** That is what the [legal notes on Claude Code](https://code.claude.com/docs/en/legal-and-compliance#authentication-and-credential-use) require: "sign-in to a Claude account must complete through Anthropic's own flow". After that, `cswap` only keeps the tokens that Claude Code stores on disk anyway. It automates what you could do by hand: `/logout`, `/login`, keep working.
- **The proxy uses an official path.** According to the [documentation](https://code.claude.com/docs/en/network-config), Claude Code explicitly supports TLS-inspection proxies, via `HTTPS_PROXY` and a custom CA. The proxy sits outside Claude Code and only changes the traffic.
- **These are exclusively my own subscriptions.** Nobody else gets access. The [Consumer Terms](https://www.anthropic.com/legal/consumer-terms) clearly forbid sharing accounts: "You may not share your Account login information […] or make your Account available to anyone else."

## The Fine Print

But for all the joy about the seamless switch: there are a few things you should know.

- **There is no explicit approval.** The rule for third-party developers is broadly worded: "developers may not collect, store, or intermediate Claude.ai credentials or session tokens". Taken literally, it would hit any tool that stores a token. My reading is that it targets products routing other users through their subscriptions. Anthropic reserves the right to enforce measures "without prior notice".
- **Your own forks need maintenance.** With every upstream update: read the diff, reinstall. That is the price of not trusting someone else's auto-update.
- **The proxy sees the Anthropic traffic in plain text.** That is true of every TLS-inspection proxy, including the ones in corporate networks. It is acceptable because I have read the code and its reach is limited to the bare minimum.

## Conclusion

Multiple Max subscriptions, an account switch while running, automatically before a limit kicks in, and Remote Control survives the switch. No more `/logout` and `/login`, no more cancelled agents.

For me the gain clearly outweighs the cost. With two 20x subscriptions I hardly ever hit a weekly limit, and I never have to look at usage credits. The agents' alarm confirms the principle: healthy distrust belongs where tools hold your keys.

If you hit the limit yourself: check with `/usage` how far along you are, and with `cswap list` how much headroom all accounts have together. And read the code before you give it your keys.

By the way, while writing I once again had a Bowie song in my head, just like in [part 1](https://agentic.schule/en/blog/2026-09-agentic-coding-mac-mini). This time it's the sequel to *Space Oddity*, in which Major Tom returns. Here you go, your earworm:

<iframe src="https://www.youtube.com/embed/HyMm4rJemtI" title="David Bowie – Ashes to Ashes (Official Video)" style="width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 8px;" allowfullscreen loading="lazy"></iframe>

<small>If the player doesn't load: [watch directly on YouTube](https://youtu.be/HyMm4rJemtI).</small>

**Questions, feedback, your own tinkering?** Bring it on. And how the Mac mini this all runs on is set up is described in [part 1](https://agentic.schule/en/blog/2026-09-agentic-coding-mac-mini).

<small>**Thanks** to realiti4 for `claude-swap` and to Junyong Lee for `cswap-pin`. Both projects are open, tested and easy to read. That is what makes it possible not to have to trust them blindly.</small>

---

*Curious about agentic work in practice? In the workshops at [agentic.schule](https://agentic.schule) and [angular.schule](https://angular.schule) we show how modern AI agents are changing everyday development.*
