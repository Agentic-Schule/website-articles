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

**An agent that researches the web is happy to invent plausible details: config paths, parameter names, whole causes. It sounds convincing and is wrong all the same. In this article I show how you get this under control: with a clear rule, with Deep Research, with a tool that really reads the source, and with a final pass that checks every fact against the primary source.**

## Contents

[[toc]]

## Why agents hallucinate

A language model predicts the most likely next word. It has no built-in notion of "true". When it lacks a piece of information, it fills the gap with something that looks plausible. With a research agent that is especially treacherous. It gets the task of finding something out on the web and, in the end, reports back a tidy result. Whether that result is correct, you can't tell by looking at it.

The dangerous part isn't obvious nonsense. The dangerous part is the small, plausible details: a config path that could just as well be named that way, a parameter that could exist like that, a reason along the lines of "X happens because Y". Such sentences survive a quick glance. They land in the docs or in the code, and only weeks later do you notice that half of it was made up.

No single trick helps against this. It takes a chain of precautions. Let's start with the cheapest one.

## The first line of defense: a clear rule

The cheapest measure costs nothing but a few lines of text. In my global `CLAUDE.md`, which runs along in every session, there is a rule that addresses exactly this problem. Here in its exact wording:

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

Why does this help? Because the rule forces the agent to keep two things apart that it likes to blur on its own: observed and assumed. "We saw X" is something different from "X happens because Y". The rule also demands that the unknown be named as unknown, instead of plugging the gap with a nice explanation. That takes away the model's permission to guess. And it reaches exactly the right ones: every research subagent loads this global `CLAUDE.md` at startup, not just the main conversation (only the built-in Explore and Plan agents skip it).

But a rule is only as good as its observance. The next step is to build the research itself so that checking is baked in.

## How Deep Research works

Deep Research sounds like magic, but it is a sober procedure. At its core it is a loop of searching, reading, and checking before anything gets summarized at the end. In Claude Code a single command is enough: `/deep-research <your question>`. I set this command up myself, and in such a way that only I trigger it, not the model on the side. Deep research costs time and tokens; I decide that deliberately. Behind it runs my workflow in five stages:

1. **Decompose:** The question is split into several sub-questions, typically a handful of different angles.
2. **Search:** For each angle a separate search runs, in parallel rather than one after another.
3. **Fetch:** The hits are de-duplicated, the most promising sources are actually retrieved, and verifiable individual claims are pulled out of them.
4. **Verify:** Every claim is checked *adversarially* (in an opposing manner, with the goal of refuting it). Several independent reviewers approach it with a default stance of doubt. If a claim doesn't hold up, it's out.
5. **Synthesize:** Only what survives the check is merged, ranked by confidence, and backed with sources.

The fourth stage is what counts. Research without checking is just a longer, more confident guess. The whole effort serves one purpose: claims should be allowed to fail before they make it into the answer.

## The Playwright MCP: actually reading the source

A check is only as good as the access to the source. And this is exactly where it often gets stuck. Many sites block automated access; a direct fetch runs into bot detection or into an empty page. What does a locked-out agent do then? In the harmless case it takes the search engine's *snippet* text, a short excerpt. That is no proof, and often not even current: such an excerpt can show an older state, not the page the agent is actually supposed to check. Better is the second option: it reports back that the fetch didn't work. I can work with that. The worst case, though, is that it conceals the block and simply invents the answer. That, in my observation, happens again and again.

My solution for this is my own, unobtrusive Playwright MCP. It drives a real browser, opens the page like a human, and reads out the actual page text. That way the agent quotes the exact wording of the source instead of a second-hand summary. How the whole thing is built, I described in a separate article: [Give your agent its own, unobtrusive Playwright MCP](https://agentic.schule/en/blog/2026-09-agent-research-playwright-mcp).

But even with the best tool a gap remains. The research agents hand their findings up to the main conversation, and these findings can be hallucinated. That's why the most important instruction applies to the main conversation itself: check every source again before you write it down. Don't rely on the sub-agent's summary, open the source. If you leave that out, hallucinated fragments keep sneaking into the research result. This one sentence in the order to the orchestrating session prevents, in my experience, especially many false facts.

## Finally: check every fact

That leaves a last pass, once the text already stands. Before anything is published, a dedicated fact-check goes through the finished version, pulls out every factual claim, and checks each one against the primary source. Here too with the default stance of doubt: a claim counts as secured only when the source covers it word for word, not already when it sounds plausible.

It's the same adversarial approach as in the research, just at the other end of the chain. The research filters before anything is written. The fact-check filters before anything is published. What slipped through the first stage, the second one catches. You can use this pass for any content an agent produced for you, not just for articles.

And at the very end stands a human. The final editing is still done by the author, the *Human in the Loop* (the human who stays in the process). He is the last *Quality Gate*, the final quality control. I read all the sources once more, crosswise, before anything appears under my name, so that I can stand behind every sentence I wrote with the help of my agents. That makes the big difference. Whoever just passes *AI slop* (unverified, low-quality AI output) through shouldn't be surprised when, in the end, nothing is technically correct.

## Conclusion

A single measure isn't enough against hallucinations. Four layers work together. A **rule** takes away the model's permission to guess. **Deep Research** with built-in checking lets claims fail before they enter the answer. A **tool like the Playwright MCP** makes sure the source is really read and not a snippet. And a **fact-check** at the end verifies every remaining fact against the primary source. No layer alone is enough. Together they keep the agent close to the truth, and the last word belongs to the human anyway.

My advice: start with the rule; it's in your `CLAUDE.md` in five minutes and works immediately. The rest you add bit by bit.

**Questions, feedback, your own setup?** Always welcome, I'm glad about every message.

---

*Curious about agentic work in practice? In the workshops at [agentic.schule](https://agentic.schule) and [angular.schule](https://angular.schule) we show how modern AI agents change everyday development.*
