---
title: 'Deep Research: Don''t Let Your Agent Hallucinate'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe is a trainer and consultant for modern web development. The workshops at <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> and <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> focus on Angular in practice – and increasingly on agentic development with AI agents like Claude Code.'
bioHeading: About the author
published: 2026-09-29
keywords:
  - Deep Research
  - Hallucination
  - Claude Code
  - Agentic Coding
  - Fact-check
  - Playwright
  - MCP
  - Web research
language: en
header: header.jpg
---

**Decent research with AI sounds easy: fire off a command, pick up the result. I use Claude Code and the `/deep-research` command for it, and in principle it works the same in any agent environment (a *harness*). And in every one of them, there is plenty of hallucinating. This article shows why that happens and what helps against it: a clear rule, a tool that really reads the source, a fact-check at the primary source, and in the end the author himself.**

## Contents

[[toc]]

## How does the research work?

You tell your main conversation: research something on a topic. That can be a library for programming or a fact for an article. You want the AI to take some work off your hands.

For that, the main conversation starts a workflow. In Claude Code a single command is enough: `/deep-research <your question>`. It's Claude Code's only bundled workflow, and it runs only when I trigger it myself, not when the model takes it up on the side. Deep research costs time and tokens; I decide that deliberately. Which other Claude Code commands are worth knowing, I collected in [10 Claude Code Commands You Should Know](https://agentic.schule/en/blog/2026-10-claude-code-commands).

The basis is the results of a search engine: for each hit an address and a small search preview. The subagents are then tasked with actually reading the pages. So far a human would do it the same way. Claude Code's workflow runs in five stages:

1. **Decompose:** The question is split into five sub-questions, five different angles.
2. **Search:** For each angle a separate search agent runs, all five in parallel.
3. **Fetch:** The hits are de-duplicated, then for each source a separate agent retrieves the page and pulls out the verifiable individual claims, up to fifteen sources, each in its own context. That way the agents stay isolated from one another while reading.
4. **Verify:** Every claim gets three independent reviewers who approach it *adversarially* (in an opposing manner, with the goal of refuting it). Only when two of three refute it does it fly out.
5. **Synthesize:** Only what survives the check is merged, ranked by confidence, and backed with sources.

![Diagram in the agentic.schule style: from a magnifying-glass icon for the search, three dotted lines lead to three agent icons, each connected by its own line to its own document. Text: ONE AGENT. ONE SOURCE.](ein-agent.jpg "In Deep Research, the reading of each source is always done by a single agent, isolated from the others.")

## Where does the hallucination come from?

This works as long as the pages can be read. Only lately more and more websites block crawlers, and with them your bot. Then the agent simply sees nothing. Now several things can happen:

![Graphic in the agentic.schule style with three rows: green check „REPORTS BACK", orange minus „CUTS CORNERS", magenta cross „HALLUCINATES".](drei-faelle.jpg "Three reactions to a block. Only the first is usable; the third is the dangerous one.")

In the best case it reports back: I couldn't read this source. Then the main conversation knows. But it can also happen that it simply takes the search preview and thinks up the rest, half cutting corners, half hallucinating. And the preview need not even be current: every search result carries an age (`page_age`), so it can show an older state. The worst case: it invents the answer completely. None of it is true.

That is in the nature of LLMs. They don't deliver secured knowledge. They produce text that sounds plausible. You always have to keep that in mind: it can also be complete nonsense. The results come back, and you have a problem.

## The first countermeasure: a clear rule

So that I don't have to say "please check all of this yourself" on every research run, I've put down a global rule that sows distrust from the start. In my global `CLAUDE.md`, which runs along in every session, it reads, in its exact wording:

```markdown
## CRITICAL: Web Research Agents Hallucinate

**Sub-agents that research the web (Task tool with WebSearch/WebFetch) frequently hallucinate technical details.** They confidently fabricate config paths, API behavior, parameter names, and causal explanations that sound plausible but are wrong.

**HARD RULES:**
- **NEVER** write research agent output directly into documentation or code without verifying it
- **ALWAYS** verify claims against actual source code, bundled docs, or observed behavior (read the log, check the output)
- **NEVER** state something as fact unless directly observed — if the cause is unknown, say "unknown"
- **NEVER** invent plausible-sounding explanations to fill gaps in understanding
- The difference between "we observed X" and "X happens because Y" is critical
```

The rule demands two things: keep observed and assumed apart, and name the unknown as unknown instead of plugging the gap with a nice explanation. That takes away the model's permission to guess. And it reaches exactly the right ones: every research subagent loads this global `CLAUDE.md` at startup, not just the main conversation.

That helps a lot. You'll see: a great deal comes to light that would otherwise have slipped through.

## Not getting locked out: the Playwright MCP

Against the lockout itself, something can be done too. I gave Claude its own Playwright MCP that disguises itself as well as possible. It is no longer recognizable from afar as an automated tool, because the telltale browser flags are deactivated, and so it gets through most sites. That eases the problem considerably, but it doesn't solve it. How exactly that works, I described in a separate article: [Give your agent its own, unobtrusive Playwright MCP](https://agentic.schule/en/blog/2026-09-agent-research-playwright-mcp).

The payoff: the agent then reads the page like a human and quotes the exact wording of the source instead of a second-hand summary. Even so, a gap remains. The findings flow up to the main conversation, and it has to check every source itself before it adopts it. That is exactly what the rule from above handles, without my having to say it each time.

## The fact-check: every claim against the source

Once a body of facts finally stands, another workflow comes in that I built myself: a fact-check pass. The three reviewers in the research work per source, in isolation. This pass takes on the finished, merged text, quotes included, and checks it against the primary sources. It looks for claims, for alleged facts, and for alleged quotes, and checks each one against the source. Default stance of doubt: a claim counts as secured only when the source covers it word for word, not already when it sounds plausible.

The quotes especially: often they aren't quoted exactly, just summarized. Then the follow-up applies: is that a quote? Then show me the exact spot. And again you find that some things slipped through. You can run this pass several times, until what stands there actually matches reality.

This is not a theoretical example. In this article it first said the search previews came from the cache of DuckDuckGo or Google. The true core holds: an excerpt can go stale, and Anthropic's [web search docs](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/web-search-tool) list a `page_age` for every hit. But the concrete mechanism, a cache of DuckDuckGo or Google, was nowhere in there and was made up. The fact-check cut it. That's how hallucination sneaks in: a correct core, wrapped in invented details.

## The most important insight: the author checks it himself

You still can't fully trust it. When Claude has done the rough work for an article, I read all the sources myself once more, crosswise, in the end. I check whether what is claimed there as a fact actually appears that way in the source. Only then do I release the text for reading.

In the end, then, the author still has the job of checking the whole thing for plausibility. The final editing is done by the human, the *Human in the Loop* (the human who stays in the process). If you follow all of this, it's a great relief for the work, and in my opinion you get well-founded results. If you leave it out, in the end it's glorious *AI slop* (unverified, low-quality AI output), and you know that one well enough already.

## Conclusion

A single measure isn't enough against hallucinations. Four layers work together. A **rule** takes away the model's permission to guess. A **disguised Playwright MCP** makes sure the source is really read and not a preview. A **fact-check** verifies every claim against the primary source. And the **author** reads it over himself at the end. Together they keep the agent close to the truth, and the last word belongs to the human anyway.

My advice: start with the rule; it's in your `CLAUDE.md` in five minutes and works immediately. The rest you add bit by bit. And this article here? It's hopefully hallucination-free. 😅

**Questions, feedback, your own setup?** Always welcome, I'm glad about every message.

---

*Curious about agentic work in practice? In the workshops at [agentic.schule](https://agentic.schule) and [angular.schule](https://angular.schule) we show how modern AI agents change everyday development.*
