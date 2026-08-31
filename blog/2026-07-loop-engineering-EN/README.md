---
title: 'Loop Engineering: When the Agent Prompts Itself'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe is a trainer and consultant for modern web development. The workshops at <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> and <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> focus on Angular in practice – and increasingly on agentic development with AI agents like Claude Code.'
bioHeading: About the author
published: 2026-07-27
keywords:
  - Loop Engineering
  - Claude Code
  - Agentic Coding
  - AI Agent
  - Automation
  - OpenAI Codex
  - Cursor
  - Prompt Caching
language: en
header: header.jpg
---

How many times a day do you type "keep going" to your agent?

If the answer is "too often", this article is for you. Loop engineering takes that "keep going" off your hands: you write down once what should happen and when it is finished, and a loop takes care of the rest.

**In Claude Code this sits behind `/loop` and `/goal`, and the two work in fundamentally different ways. This article shows what they actually do, what the pauses in between cost you, when a loop is worth it at all, and which other tools are keeping up.**

Up front, to set the scope: I focus mainly on Claude Code here. Other agents have quite different ideas about what a loop should look like; what is right there can be wrong here. I come back to them at the end.

## Contents

[[toc]]

## What loop engineering means

The tightest definition comes from Addy Osmani, who [spelled the term out in an article](https://addyosmani.com/blog/loop-engineering/):

> Loop engineering is replacing yourself as the person who prompts the agent. You design the system that does it instead.

Sounds spectacular. It really isn't. You simply stop being the metronome.

How far that can go is described by Boris Cherny, creator and head of Claude Code at Anthropic. Fortune quotes him [on 11 June 2026](https://fortune.com/2026/06/11/anthropic-claude-boris-cherny-doesnt-write-code-by-hand-anymore/) from the stage of the Brainstorm Tech conference:

> If you look at most Claude Code sessions, it's actually another Claude that does the prompting.

That became the sharper line "I don't prompt Claude anymore." It cannot be sourced, and it should not be taken literally anyway: this is the head of a product promoting his own product. Anyone who actually runs loops intervenes, adjusts and aborts.

The German consultancy codecentric has [placed the term in a useful layering](https://www.codecentric.de/en/knowledge-hub/blog/loop-harness-context-engineering-explained). Context engineering makes sure the right information is in the individual prompt. Harness engineering builds the railing around it: tools, skills, hooks and sandboxes. Loop engineering is the layer on top:

> the system that repeatedly triggers an AI agent, spawns helper agents, verifies results, and feeds itself, without a human prompting turn by turn

The important caveat comes from the same article: every layer inherits the weaknesses of the one below it. A loop around an agent that cannot keep its context straight just goes round in circles faster.

So much for the idea. It is the same for every agent, the implementation is not. The next sections show it on Claude Code, the tool I use the most myself. How other tools solve the same idea comes at the end.

## `/loop`, `/goal` or a hook

In Claude Code there are three ways to keep a session running; `/loop` is only one of them. Anthropic [compares them itself](https://code.claude.com/docs/en/goal):

| Approach | Next turn starts | Stops when |
| --- | --- | --- |
| `/goal` | when the previous turn finishes | a model confirms the condition |
| `/loop` | when a time interval elapses | you stop it, or Claude considers the work done |
| Stop hook | when the previous turn finishes | your own script or prompt decides |

The difference between the first two is the most important thing in this whole topic. `/loop` **waits**. `/goal` starts the next turn immediately.

There is a second difference that is easy to miss. `/goal` checks the completion condition with a model of its own. The documentation puts it like this:

> completion is decided by a fresh model rather than the one doing the work

That is more than a detail. Put the condition into the prompt of a `/loop` and the same model that just did the work decides whether it is finished. With `/goal` a different model looks at it, according to the docs the session's small fast model, Haiku by default. It receives the condition and the conversation so far and returns a yes-or-no decision with a short reason. On a "no", that reason becomes guidance for the next turn. Since Haiku is comparatively weak, by the way, you should [set](https://code.claude.com/docs/en/model-config) this checking model deliberately beforehand.

One limitation belongs with it: this evaluator calls no tools. It judges only what is already visible in the conversation. So the condition has to be phrased so that Claude's own output can demonstrate it. "All tests in `test/auth` pass" works, because Claude runs the tests and the result lands in the transcript.

And one more distinction that causes confusion in practice. The documentation separates two kinds of prompting:

> auto mode removes per-tool prompts, and `/goal` removes per-turn prompts

The agent no longer asking whether it should continue comes from the loop. It not asking about every single tool call comes from the permission mode. Anyone who only sets a loop and then wonders why dialogs keep popping up has mixed the two up. For the loop to really run without you, without hitting Enter all the time, switch to **auto mode**: press `Shift+Tab` to cycle the [permission modes](https://code.claude.com/docs/en/permission-modes) until it shows "auto". A classifier then approves the calls.

That leaves the third way. A stop hook is a script or a prompt in your `settings.json` that fires at the end of every turn, in every session, and can block stopping. `/goal` is essentially such a hook, just boiled down to a single session and condition. How to build one of your own is further down.

> 🔁 **Rule of thumb:** waiting on something outside your session, use `/loop`. Working toward a verifiable end state, use `/goal`. Wanting the same check in every session, use a stop hook.

## What `/loop` actually does

Claude Code's [documentation](https://code.claude.com/docs/en/scheduled-tasks) describes three behaviours, and which one you get depends on what you type.

| Input | Example | Behaviour |
| --- | --- | --- |
| Interval and prompt | `/loop 5m check the deploy` | fixed cadence via cron |
| Prompt only | `/loop check the deploy` | Claude picks the delay itself |
| Interval only, or nothing | `/loop` | built-in maintenance prompt |

In self-paced mode, Claude decides after each iteration how long to wait. The docs describe it like this: short waits while a build is finishing or a pull request is active, longer ones when nothing is pending. As long as something is actually happening the delays stay short. The chosen delay and the reason for it are printed at the end of each iteration.

`/proactive` is an alias, by the way, and does the same thing. A bare `/loop` with nothing else starts a built-in maintenance prompt. It works in a fixed order: first continue unfinished work from the conversation, then tend to the current branch's pull request, meaning review comments, red CI and merge conflicts, and when none of that is pending, run cleanup passes such as bug hunts or simplification. It starts no new initiatives. Irreversible actions such as pushing or deleting only happen when they continue something the transcript already authorized.

You can replace that default. A `.claude/loop.md` file in the project, or `~/.claude/loop.md` for you personally, takes its place. It is plain Markdown with no required structure, written as if you were typing the prompt directly. Edits take effect on the next iteration, so you can sharpen the instructions while the loop is running.

A few limits are worth knowing. The loop lives in the session. A fresh conversation ends it, but a `--resume` brings it back as long as it has not expired. It expires seven days after you created it: it fires one last time and then deletes itself. Esc cancels a pending iteration. And in self-paced mode Claude can call it a day on its own once it considers the work done. If it forgets both, meaning it neither reschedules nor stops, Claude Code schedules a single straggler about twenty minutes later and ends the loop then.

> ⚠️ On Amazon Bedrock, Claude Platform on AWS, Google Cloud's Agent Platform and Microsoft Foundry none of this applies. There, a prompt without an interval runs on a fixed ten-minute schedule, and `loop.md` is not read at all.

## In practice: one condition instead of fifteen "keep going"

Here is what this looks like in my day-to-day work:

```text
/loop implement the feature as planned. You are only finished when
everything matches my requirements, everything is tested, the pull
request is ready and CI is green.
```

The effect is exactly the one you hope for. Normally the agent stops after an intermediate result and asks for confirmation to continue. That does not happen here. Work continues periodically until the goal is reached.

More than once I have seen an agent break out of the loop on its own and ask for a direction. For instance when it found a fundamental flaw in the instruction, where carrying on would have made no sense, or when it hit a security hole. That is reassuring, but I do not want to turn it into a rule. The documentation describes restraint explicitly only for the **built-in** maintenance prompt. With a custom prompt like the one above there is no such promise. What I saw was the model's own judgement, not a safety net you should build on. In theory Claude could just as well carry the instruction out without mercy. That is simply how it goes with non-deterministic software.

Strictly speaking my example mixes both. "Implement and test" would be a case for `/goal`, "CI is green" one for `/loop`. That the loop still works well here comes down to waiting for CI: it sets the pace.

If it comes down to waiting, the [Monitor tool](https://code.claude.com/docs/en/tools-reference#monitor-tool) is worth a look. The documentation itself points out that Claude may reach for Monitor instead during a self-paced loop. It runs a script in the background and streams each output line back, rather than checking in at intervals. Anyone waiting on a log saves the polling entirely.

## What the pause costs

The pauses between iterations feel like a side effect. They are in fact the reason a loop stays bearable for a long time.

For one, it does not hammer the API continuously. That leaves headroom under the server-side rate limits, and you can run several loops in parallel without them throttling each other. For another, the pause is your window to step in: you see what the last iteration did and can adjust or abort before the next one starts.

And on a subscription it is free on top of that. Anthropic extends the prompt cache automatically [when you work on a subscription](https://code.claude.com/docs/en/prompt-caching):

> On a Claude subscription, Claude Code requests the one-hour TTL automatically.

On a subscription the cached context therefore stays warm across any pause a loop can choose. The pause costs you nothing.

Now the catch. As soon as you work past your allowance and start drawing on usage credits, Claude Code drops to five minutes automatically, according to the same page. On an API key and with the cloud providers, five minutes is the default anyway. And then this applies:

> After a long enough gap, the next request recomputes the full input and re-establishes the cache, which is why the first turn back after stepping away can be noticeably slower.

A self-chosen pause of twenty minutes sits far outside that window in this case. Every iteration then begins by reprocessing the entire context. The very pause meant to spare you becomes expensive, and markedly so. While the cache is warm, the large unchanged part of the context costs only a tenth of the normal input price. After a miss that part is written again, at [1.25 times](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#pricing). A tenth turns into more than twelve times, iteration after iteration. Anyone working through the API or Bedrock who wants long loops should therefore either set short fixed intervals or use the `ENABLE_PROMPT_CACHING_1H` environment variable that the same page names for this. Or you just do not care about the tokens you burn. Then YOLO! 😄

## When a loop is not worth it

So far this has been about how loops work. The more important question comes before that: whether you need one at all. Four conditions follow from what is above. Miss one and the loop costs more than it brings in.

**Does the task repeat?** A loop pays for itself across many runs. `/loop` lives in the session and expires after seven days, `/goal` ends with its condition. For a one-off, a well-aimed prompt is faster and cheaper. If you do something once, you do not have a loop problem. You have a script.

**Can anything but the agent say no?** This is the hardest of the four. The `/goal` evaluator calls no tools; it only sees what is in the conversation. Without a hard test, build or linter, the agent ends up grading its own work. Then the loop may keep running happily even when something has long been broken.

And one more thing belongs here: every iteration needs something new to work with. A fresh test result, a new error, your feedback. A bare "read it again and make it better" is not new information; the loop then polishes the same output forever, or, in the best case, simply ends. That is the most common beginner mistake: setting up a loop like "improve the text until it is good" and being surprised that nothing gets better. That a model judging only the finished answer talks itself into approval rather than getting better is what the paper ["More Convincing, Not More Correct"](https://arxiv.org/abs/2607.05904) measured.

**Can your plan absorb it?** A loop re-reads context, tries things and discards them. That burns tokens whether or not anything usable comes out. As described in the previous section, it gets more expensive outside a subscription, because every longer pause breaks the cached context. Loop engineering looks obvious when tokens are effectively free, and reckless when every iteration lands on the bill.

**Can the agent try out what it builds?** Without logs, without a runnable environment, without the ability to execute its own code, the loop iterates blind. It then produces a lot of text quickly that nobody has checked.

My take: loop engineering is worth it, and you should use it once the infrastructure is in place. Without proper test coverage and a CI that objectively says green or red, the loop has nothing to measure against. With that foundation, it pays off. For one-off tasks and anywhere "done" is a pure judgement call, a single well-aimed prompt is still the better choice. And if your bottleneck was review in the first place, a loop only makes the queue longer.

## The overnight run

So much for when a loop is not worth it. There is one case, though, where I love it. Some tasks are simply hard. They need many attempts, again and again against CI, until everything is finally green. That is exactly what I let the agent grind through, all night if that is what it takes.

The stop condition is brutal then:

```text
/loop implement the plan. Everything tested, everything green on CI.
No exceptions, no shortcuts. Do not give up until the goal is reached.
No questions. I am AFK now. You have all night.
```

Whether that last line about the night is really needed, I do not know. But Opus usually wishes me a good night in return and promises everything will be green in the morning. And most of the time it is.

This case hits exactly the conditions that make a loop pay off: CI can say no, the agent can run its own code, and on a subscription the many overnight iterations cost nothing extra. No wonder the loop shines here.

## A look from the inside

Nearly everything up to here was in the public documentation. The rest of this section is not. It comes from my own measurements and from the instructions the model receives at runtime. I read them out of **Claude Code 2.1.220**. Anthropic changes texts like these without notice, so a later version may well say something different.

**With `/loop` the instruction gives the model a tool.** It is called `ScheduleWakeup`; the model does the work and schedules its own next wakeup with it. On the range, its description says plainly:

> Clamped to [60, 3600] by the runtime.

The interesting question is what the model picks within that range. It is given three cases for that. When waiting on something external that the environment cannot report on its own, the delay is supposed to fit the thing:

> A CI run that takes ~8 minutes deserves one ~480s check, not eight 60s ones.

That is exactly what I see. While a CI run is going, the agent waits roughly as long as my CI usually takes. What is notable is that this sentence sits in the program in three versions. Which one the model gets depends on how long its prompt cache holds. With a five-minute lifetime the same text advises twice about 270 seconds instead of eight times 60, because every longer pause would break the cache. So the instruction factors the cache in, exactly the cost that the section "What the pause costs" puts a number on.

For the other two cases: when something else triggers the wakeup anyway, a long fallback heartbeat from 1200 seconds is intended. And when there is nothing specific to watch, the guidance is 1200 to 1800 seconds. Polling for its own sake is explicitly ruled out:

> Do NOT schedule a short-interval wakeup to poll for background work you started, when harness-tracked work finishes, you are re-invoked automatically, so polling is wasted.

That explains why a loop feels brisker in practice than the range suggests. While something is running, the wait is short. The long delays are reserved for the case where nothing is happening.

Time to put it to the test: I deliberately requested a delay far too short, thirty seconds. The reply:

```text
Next wakeup scheduled for 22:41:00 (in 119s)
(clamped to 60s from your requested value)
```

Two things happen here in sequence. First the request is raised to sixty seconds, which is the hard floor. Then the appointment slides to the next full minute, because cron only knows minute granularity. Thirty requested seconds became **119 seconds of actual waiting**. Worth knowing if you plan very short cadences.

The model can also end the loop itself, with the same tool and a call of `stop: true`. That is exactly what I triggered in the test once the question was answered. The response: `Loop stopped, cancelled 1 pending wakeup(s)`. There is a trap in it: that ends only the self-paced loop. One on a fixed interval keeps running and has to be ended via `CronDelete`.

**With `/goal` the instruction gives the model no tool.** The moment you set a goal, this text appears in the context:

> A session-scoped Stop hook is now active with condition: "…". Briefly acknowledge the goal, then immediately start (or continue) working toward it — treat the condition itself as your directive and do not pause to ask the user what to do. The hook will block stopping until the condition holds. It auto-clears once the condition is met — do not tell the user to run `/goal clear` after success; that's only for clearing a goal early.

That is the entire mechanism, in three parts. The condition becomes the work instruction. The model is explicitly told not to ask in between. And a hook will not let it stop while the condition does not hold.

Around it sit a few values that confirm or extend the docs. The constant for the maximum length of the condition is 4000 characters. The status entry is called `goal_status` and comes in several shapes: on setting only with `met` and `condition`, on completion additionally with `reason`, `iterations`, `durationMs` and `tokens`, plus a `failed` field. And there are two error messages missing from the documentation: `/goal` only runs in trusted workspaces, and it refuses to work when hooks are restricted via `disableAllHooks` or `allowManagedHooksOnly`.

Two limits belong with it. A goal can end without being reached: if the checking model considers the condition impossible, the entry is marked as failed and the loop ends. And there is a hard ceiling. According to the changelog, the turn ends with a warning after the stop hook has blocked eight times in a row, adjustable via `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`.

**What applies to both.** Self-pacing hangs on a switch delivered from the server, named `tengu_kairos_loop_dynamic`. The program holds a fallback value for it, but that only applies when the configuration cannot be reached at all. Normally the server decides. The switch controls more than you would think: with it off, `ScheduleWakeup` simply does nothing, and even the help text changes. Only with the switch set does the description of `/loop` carry the sentence "Omit the interval to let the model self-pace."; without it a default of ten minutes is named there.

Structurally the two are different things anyway, and that explains why `/loop` can swallow other slash commands as an argument. `/goal` is a command: a slash command with fixed program logic behind it, here setting the Stop hook. `/loop` is a skill: a bundle of instructions in text form that the model loads and follows itself, registered under the name `loop` with `proactive` as an alias.

For availability, the selected model plays no part in either. `/loop` hangs on an environment variable and a feature switch, `/goal` on interactivity, on the trust status of the working directory and on the hook settings. Whether Opus or Sonnet is running changes nothing there, and the attributes the server uses to target its switches contain no model field at all.

Model-dependent switches do exist in the program, just elsewhere. Web search, for instance, checks on Google Vertex which model is running and disables itself for older ones. In `/loop` itself I found exactly one place where the model comes into play, and it concerns behaviour. For certain models a turn ends immediately when its only tool call was scheduling the next iteration.

## Build your own stop hook

You can set up this third way yourself, and then you have the persistent one: `/loop` and `/goal` live in one session, a stop hook lives in your `settings.json` and is there in every session. That pays off when the same rule should hold everywhere, without you typing it in each time.

The hook fires on the **Stop event**, when the model finishes a turn. It may wave the stop through or block it. If it blocks, the model keeps working, with the reason you passed in as its next task. There are two kinds: a **command hook** is a script whose exit code decides, `2` blocks and `0` allows the stop. A **prompt hook** passes a condition to a model that judges from the course of the conversation, exactly like `/goal`.

Here is how a command hook blocks the stop while the tests are red:

```json
// settings.json
{
  "hooks": {
    "Stop": [
      { "hooks": [ { "type": "command", "command": ".claude/hooks/test-gate.sh" } ] }
    ]
  }
}
```

```bash
#!/bin/bash
# test-gate.sh reads the hook JSON from stdin
input=$(cat)
# without this line the hook blocks forever
[ "$(jq -r '.stop_hook_active' <<< "$input")" = "true" ] && exit 0
npm test --silent || { echo "Tests are red, keep going." >&2; exit 2; }
exit 0
```

The line with `stop_hook_active` is not optional. Without it the hook blocks every stop attempt, and the session spins until the tokens run out. As a net underneath, Claude Code ends the turn after eight blocks in a row with a warning, raisable via `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP`.

Build your own hook when you want the check in **every** session, or when a script should decide objectively instead of a model. The price is a bit more setup, and a persistent hook can surprise you when you forget it is there. The details are in the [hooks documentation](https://code.claude.com/docs/en/hooks).

## Who else runs loops

That leaves the question of whether this is a quirk of Claude Code. Here is an overview of the common tools, each checked against its own docs (as of 27 July 2026):

| Tool | In-session command | What it has instead |
| --- | --- | --- |
| [Claude Code](https://code.claude.com/docs/en/scheduled-tasks) | **`/loop`** | plus `/goal`, Monitor, cloud routines, desktop tasks |
| [OpenAI Codex](https://developers.openai.com/codex/automations) | none | scheduled tasks in the app, including inside a chat |
| [Cursor](https://cursor.com/docs/cloud-agent/automations) | `/automate` | automations as cloud agents, by schedule or event |
| [Amp](https://ampcode.com/news/schedule) | none | agents schedule themselves and wake themselves up |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/cli-reference.md) | none | nothing comparable documented |
| [OpenCode](https://opencode.ai/docs/commands/) | none | nothing comparable documented |
| [GitHub Copilot CLI](https://github.com/github/copilot-cli/blob/main/README.md) | none | Autopilot mode, keeps working until the task is done |

Three observations on that.

**Codex can do it, but elsewhere.** In the CLI, the [documentation](https://learn.chatgpt.com/docs/codex/cli) lists only `/init`, `/status`, `/permissions`, `/model` and `/review`. The scheduling sits in the app. There, however, is something that comes very close to a loop, namely scheduled tasks inside an existing chat. OpenAI describes them with a notable choice of words: "Scheduled tasks in a chat can use minute-based intervals for active follow-up loops." So the word "loop" is there too.

**A request has been sitting in the Codex repository since the end of May.** [Issue #25466](https://github.com/openai/codex/issues/25466) asks for exactly this feature for the CLI and describes it down to the tool names used in Claude Code, including `CronCreate` and `ScheduleWakeup`. The author has already built it on a fork. Opened on 31 May 2026 and still open at the end of July 2026, without a single comment.

**Amp solves it without a command.** No slash command needed there, you simply say it. The [announcement of 21 July 2026](https://ampcode.com/news/schedule) puts it like this:

> Agents in Amp can now set their own schedules and wake themselves up. When a schedule fires, the agent wakes up with its saved prompt and continues right where it left off, with all of its context and history.

Same idea, different interface. And it shows where this is heading: the capability is becoming a given, what differs is how you reach it.

## Conclusion

At its core, loop engineering comes down to a single question: who decides when the work is finished? As long as that is you, you keep typing "keep going". The moment you write it down, you have a loop.

Six things I take away:

- **Infrastructure first, then the loop.** Without test coverage and CI that can say no, the loop has nothing to measure against. With that foundation in place, it is worth using.
- **The completion condition is the real work.** The rest is an invocation with a time interval.
- **`/loop` waits, `/goal` does not.** Waiting on something external like a green CI run, which also sets a good rhythm, take the loop. Working toward an end state, take the goal.
- **If you want the evaluation to come from a fresh context, use `/goal`.** It brings in a model of its own, instead of letting the same one that just did the work decide.
- **Pauses are free on a subscription and expensive through the API.** Depending on the plan and cache behaviour, the cost can be considerable.
- **Breaking out on its own is judgement, not a promise.** Do not rely on the agent stopping by itself when it finds something.

And if you cannot decide between `/loop` and `/goal`, start with `/goal`. A checkable completion condition forces you to think the problem through beforehand anyway.

**How do you handle this?** Do you run loops, and if so with what completion condition? I am glad to hear from you.

---

*Curious about agentic work in practice? In the workshops at [agentic.schule](https://agentic.schule) and [angular.schule](https://angular.schule) we show how modern AI agents are changing everyday development.*
