---
title: 'Harness Engineering: What Really Runs Around the Model'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe is a trainer and consultant for modern web development. The workshops at <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> and <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> focus on Angular in practice – and increasingly on agentic development with AI agents like Claude Code.'
bioHeading: About the author
published: 2026-10-06
keywords:
  - Harness Engineering
  - Agent Harness
  - Claude Code
  - Agentic Coding
  - Tool Use
  - Function Calling
  - Prompt Injection
  - AI Security
language: en
header: header.jpg
---

**"Claude Code is 98% not AI." This sentence is making the rounds right now, and it is a misunderstanding with a true core. The core is called a _harness_: the scaffolding around the model. A language model on its own is a text generator, one shot into the conversation and done. The harness turns it into an agent that acts. It gives the model tools, wraps the whole thing in a loop, and remembers what happened. My thesis: at its core this is just calling a model, giving it tools it did not have before, and putting that in a loop. Mechanically, that is correct. What the shortcut leaves out is the actual work: context across long runs, error handling, and above all security. Because the moment the model gets real tools in its hands, the question of which text it obeys becomes the most important one in the whole system.**

I had actually wrapped up the series on prompt, loop, and graph. But one term is still missing, and it carries the other three. Prompt, loop, and graph describe how you steer the agent. The harness is what they all run inside. This part stands on its own.

## Contents

[[toc]]

## What is a harness?

A language model can do exactly one thing: predict text. You feed it something, it gives text back. It does not read a file, it does not run a command, it does not call an API. Everything an agent does beyond that comes from the software around it. That software is the harness.

A simple formula sums it up:

> **💡 Keep in mind:** Agent = model + harness. The model judges, the harness acts.

The harness gives the model four things. First, the **tools**: clearly described functions it may call, from reading a file to a database query. Second, the **loop** that calls the model again and again until the task is done. Third, **context management**: what stays in the limited context window, what gets summarized, what lives in long-term memory. Fourth, the **permissions and safeguards**, the question of which tools are allowed at all and when a human has to confirm.

Claude Code is one such harness. LangGraph is one. OpenAI's Deep Research feature is one. They all build on the same principle, and that principle is neither new nor secret.

## Where does the 98% come from?

Back to the 98%. Four claims circulate around it in my tech bubble. None of them holds up to what the viral post promises.

- **"Claude Code is 98% not AI."** The number comes from a community teardown, not from Anthropic. What is right is that the harness is far more code than the model API behind it. What is wrong is the punchline. The loop is dumb code, but what gets decided inside the loop is decided by the model. "Not AI" confuses the scaffolding with the thing that does the judging inside it.
- **"500,000 lines of source code leaked."** I find no solid primary source for this. What circulates is unconfirmed. I list it here as what it is: a rumor.
- **"NVIDIA's harness plus Opus 5 scores 100% on ARC-AGI-3."** The model Opus 5 exists. The number does not. The ARC Prize team itself calls [ARC-AGI-3](https://arcprize.org/) "the world's only unbeaten benchmark." An unbeaten benchmark and a 100% score are mutually exclusive.
- **"DeepSeek released a fully modular open-source harness."** No nameable primary source for this either. Unconfirmed.

This has method: a number reads harder in a post than an "it depends." For us the rule stays simple. What cannot be shown at the primary source does not enter your head as a fact.

## The core: a loop with tools

How does a model act when it cannot do anything itself? Through a fixed routine, the so-called *agent loop*. It is surprisingly short:

![Flow diagram of the agent loop: an arrow runs from the box "Call the model (context + tools)" to the diamond "Tool call?". From there "yes" goes to the box "Run the tool (your code runs it)", whose result loops back via a dashed arrow to "Call the model". The "no" branch leads to the dark box "done: answer (text with no tool call)".](agent-loop.svg "The whole agent loop. The loop is code; the decision at the diamond is made by the model.")

In words: the harness calls the model with the conversation so far and the list of tools. The model answers either with a tool call or with finished text. On a call, your code runs the tool and feeds the result back into the conversation. Then it starts over. When text comes back with no call, the task is done.

And what does such a call look like in practice? Take [Anthropic's Messages API](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview). A tool is a description with a name and a JSON schema for its inputs:

```json
{
  "name": "get_weather",
  "description": "Get the current weather for a given location.",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "City and state, e.g. San Francisco, CA" }
    },
    "required": ["location"]
  }
}
```

When the model wants to use this tool, it answers with `stop_reason: "tool_use"` and a block carrying the name and arguments:

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": { "location": "San Francisco, CA" }
}
```

Your code looks up the weather and sends the result back in the next request, as a `tool_result`, linked by the same `id`:

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
  "content": "15 degrees Celsius, partly cloudy"
}
```

That is the whole magic. The model proposes the call, your application runs it, the result goes back. At OpenAI the same round trip has different names (`function_call` and `function_call_output`); the mechanics are identical.

This is where the precise reading of the 98% pays off. The loop is just code, a few dozen lines. But which tool, with which arguments, and when to stop: the model picks that every single time. The harness orchestrates, the model judges.

## What the shortcut leaves out

"Call a model and give it tools" captures the mechanics. But between that three-liner and a tool you would trust with a codebase or a production database lies all the actual work.

There is **context management**. A long run eventually blows past the context window. What gets summarized, what gets dropped, what moves into a memory on disk? There is **error handling**. Tools fail, connections drop, the model proposes nonsense. A usable harness catches that instead of grinding to a halt mid-task. And there is **security**, the biggest chunk. The rest of this article belongs to it, because it is the point where harness engineering turns from a finger exercise into serious craft.

But first, a look to the side. Because the pattern is by no means confined to coding.

## What can a harness do besides coding?

The best-known harness steers a coding agent. Its tools are read a file, write a file, run a shell command. Swap the tools, and the same principle carries completely different tasks.

- **Research agents.** [OpenAI's Deep Research](https://platform.openai.com/docs/guides/deep-research) runs the same loop, except the tools are web search, fetching pages, and a Python sandbox for calculation. The loop plans sub-questions, works its way through sources, and writes a cited report at the end. No editor, no shell.
- **Computer use.** With [Anthropic's Computer Use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool) and OpenAI's Operator, the tools are a screenshot plus mouse and keyboard. The model only sees images of the screen and sends clicks. Execution happens in a provided environment, not in the model itself.
- **Data agents.** [Snowflake's Cortex Analyst](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst) and [Databricks Genie](https://docs.databricks.com/aws/en/genie/) answer data questions in natural language. The tool is SQL against the data warehouse. The permission layer is the notable part: with Databricks, per the vendor, the existing governance system (Unity Catalog) decides what the agent may see. No separate mode is needed; the database brings its permissions along.
- **Support agents.** [Intercom's Fin](https://www.intercom.com/help/en/articles/8205718-set-up-and-test-fin) reaches internal systems through connectors, reads from the CRM and writes to it too, creates leads, books meetings. When unsure, there is a documented escalation to a human.

One pattern runs through all of it: the tool is a query or action against a business system. The permissions are usually the permissions of that business system. And for consequential actions, a human sits in between. Remember this pattern, because it leads straight to the sore spot.

## The sore spot: the harness trusts the wrong text

The moment the harness gives the model tools, the model reads text from the world: web pages, files, tool results, tickets, database contents. And here comes the trap that defines the whole field: a model cannot cleanly separate instruction from data. Any text it reads can try to give it commands. That is *prompt injection*.

OpenAI states this plainly in its [computer-use docs](https://developers.openai.com/api/docs/guides/tools-computer-use):

> **ℹ️ Ground rule (OpenAI):** *"Treat screen content as untrusted. Text in a page, document, or tool result cannot grant permission or override the user's instructions."*

The first instinct against it is the obvious one: you fence the foreign text in markers, a note at the top and bottom saying "everything in here is untrusted." That is a real, documented technique, and it helps a little. But it is not enough. A marker only describes the text; it does not take the tools out of the model's hands. If the model obeys the foreign text anyway, it may keep clicking, writing, running commands.

It gets truly dangerous when three ingredients come together: foreign content, access to private data, and a way to send data out. Simon Willison calls this the [*lethal trifecta*](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/). When a harness has all three, a harmless injection turns into a data leak.

### Case in point: your own CI as the entry point

How real this is shows in the [Clinejection incident](https://adnanthekhan.com/posts/clinejection/). The coding tool Cline had a GitHub workflow that let a Claude agent triage new issues. The issue title was dropped straight into the prompt, unchecked:

```yaml
**Title:** ${{ github.event.issue.title || 'See issue details below' }}
```

On top of that, the agent had Bash as a tool and was open to anyone via `allowed_non_write_users: "*"`. The math is simple and bitter: anyone who opens an issue writes an instruction into the title, and the agent runs it. That is exactly what happened. Later a tampered version of the npm package even appeared that quietly pulled in a foreign agent tool on install.

> **⚠️ The trap:** the hole came from the combination of foreign text in the prompt and a tool with permissions that were too wide. The model was interchangeable here. A marker around the issue title would have changed little. Whoever combines `Bash` with "anyone may" has already left the gate open.

### What actually helps today

The state of the art is a layering of several measures. From cheap and immediate to involved and thorough:

- **Few permissions (least privilege).** Give the agent only the tools it truly needs. No `Bash` where a narrow query tool will do. No write access where reading is enough.
- **Allowlists.** Limit where it may go: a list of allowed domains, allowed commands, allowed tables.
- **A human for consequential actions.** Anything that moves money, deletes, or sends data out gets a confirmation. Anthropic recommends exactly that for [computer use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool), together with an isolated environment with minimal permissions.
- **Structural defense.** Research goes beyond markers. [CaMeL](https://arxiv.org/abs/2503.18813) from Google DeepMind separates data flow and control flow so that foreign content cannot steer the program flow in the first place. The code is public.
- **Guardrail models.** A second, specialized model checks inputs and outputs as a last layer. Meta's open-source [LlamaFirewall](https://arxiv.org/abs/2505.03574) is such a building block against prompt injection and misaligned agents.

So the answer to the opening question is: plain markers around the foreign text are no longer state of the art, they are one of several layers, and not one to rely on alone. Security lives in the architecture. A label on the text is not enough.

## Build your own harness?

After all that, the good news: building the loop itself is quick. A few dozen lines are enough. Call the model, check for `tool_use`, run the tool, send back a `tool_result`, repeat. I recommend doing this once by hand. Afterwards "agent" is, for you, a loop you have seen through.

For real work, though, this is exactly where you stop building everything yourself. The interesting part comes only after the loop: context, recovery, and the security above. There are maintained building blocks for that. Anthropic's *Tool Runner* drives the round trip automatically. OpenAI's *Agents SDK* brings the loop along. And the *Model Context Protocol* (MCP) plugs in ready-made tools without you rewriting every integration.

> **💡 My advice:** build the loop once yourself to understand it. For production, rely on a maintained harness that has already thought through context, errors, and permissions.

## Conclusion

Next time someone holds "Claude Code is 98% not AI" under your nose, you know where the sentence goes wrong. The harness is a lot of code, yes. But it is the quiet worker that makes the model's judgments safely executable, or fails to.

And harness engineering? It is nothing new and certainly no reason for a two-hour course. It is the basis that prompt, loop, and graph run on in the first place. The prompt decides how you ask. The loop works through a task step by step. The graph spreads independent work across several branches. The harness is what all of it runs inside.

My advice is, as always, the undramatic one: rebuild the small loop once, with two tools and a real API key. Then, for every agent you wire up anywhere, ask yourself the one question that truly counts: what could the worst text this agent will ever read make it do? Your answer to that is your harness engineering.

**Questions, feedback, your own harness stories?** Always welcome, I am glad about every message.

---

*Curious about agentic work in practice? In the workshops at [agentic.schule](https://agentic.schule) and [angular.schule](https://angular.schule) we show how modern AI agents change everyday development.*
