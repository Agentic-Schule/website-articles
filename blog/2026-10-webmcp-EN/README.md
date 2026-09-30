---
title: 'WebMCP: The Website Hands the Agent Its Tools'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe is a trainer and consultant for modern web development. The workshops at <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> and <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> focus on Angular in practice – and increasingly on agentic development with AI agents like Claude Code.'
bioHeading: About the author
published: 2026-10-13
keywords:
  - WebMCP
  - Web Model Context Protocol
  - MCP
  - AI Agents
  - Browser API
  - Agentic Web
  - W3C
  - Prompt Injection
language: en
header: header.jpg
---

There is a new technology that lets you make existing web applications _AI-ready_ with little effort, meaning ready to be operated by an AI agent. It's called WebMCP, and in this article we try it out together. Don't worry: you need no new backend and no model of your own for it.

**The trick is a reversal. A classic AI chatbot belongs to the operator: their own backend, their own model, and the operator pays for every _token_ (the unit AI models bill in). WebMCP turns that around. The visitor brings their own assistant, for example ChatGPT, and you only register your existing client logic as tools. That makes practically any app AI-ready. This is the low-hanging fruit for AI in existing applications, and that is exactly what excites me about it.**

In this first part we clarify what WebMCP is, how it relates to the MCP from Claude Code, what already works today, and where the catches are. This is part 1 of two, meant for any web developer. [Part 2](https://agentic.schule/en/blog/2026-10-webmcp-angular) then shows the concrete implementation in Angular. Each part stands on its own.

## Contents

[[toc]]

## The problem: the agent feels its way across your page

Picture a contact form a visitor uses to request an intro call. For a human it is trivial: type the name, type the email, submit. An agent without WebMCP sees none of that. It sees a tree of DOM nodes and has to guess which `<input>` means the email, which button submits, and in what order all of that happens.

That has three downsides. It is slow, because the agent has to walk many nodes and burn many tokens doing it. It is brittle, because a reworked layout breaks the automation. And it opens a security hole: when the agent reads the free text of the page, a hidden instruction can sit there and hijack it. That is the classic _prompt injection_, smuggling instructions in through the input.

The idea of WebMCP is the reversal: the agent no longer reads the page. The page tells the agent itself what it can do.

## WebMCP: the website declares its tools

[WebMCP](https://github.com/webmachinelearning/webmcp) (Web Model Context Protocol) is a proposal from the [W3C Web Machine Learning Community Group](https://www.w3.org/community/webmachinelearning/). A web app uses it to declare actions as _tools_. Each tool has a name, a description in natural language, and a JSON schema for the expected parameters. A connected agent sees this clear contract and calls the tool with structured arguments.

The flow has three steps:

1. **The page registers tools.** For every action an agent may perform, you declare a tool with a name, description, and parameter schema.
2. **The browser exposes the tools.** A WebMCP-capable browser or an extension collects the registered tools and passes them to the agent.
3. **The agent calls a tool.** It supplies the arguments, your code does the rest. Users keep control over permissions and confirmations.

The difference in practice is large. Without WebMCP the agent has to work through dozens of DOM nodes for such a form. With WebMCP a single declared tool it calls directly is enough. Google built an [explainer with a live demo](https://googlechromelabs.github.io/webmcp-tools/demos/explainer/) for this, where the same widget is driven once via DOM scraping and once via WebMCP. The contrast is worth seeing.

## WebMCP or MCP?

Anyone who works with Claude Code already knows MCP: Anthropic's [Model Context Protocol](https://modelcontextprotocol.io/). You attach an MCP server and the agent gains new capabilities. So the question suggests itself: is WebMCP simply MCP in the browser? Not quite. The difference lies in where the tools run.

A classic MCP server is a **backend integration**. The agent talks directly to a server, bypassing the web interface. For server-side actions that is ideal. For an interactive web app it brings three burdens that the specification itself names: the agent bypasses the application's own UI. You have to rebuild the user's state, their context, and their authentication on a separate server. And you have to write a dedicated server in the first place, instead of reusing your existing client code.

WebMCP is the client-side answer to that. The tools live in the script of the running page, in the browser, in the user's existing session. The agent, the user, and the page share the same context. The tool runs your own code and keeps the visible interface in sync. The WebMCP specification [explicitly references MCP](https://github.com/webmachinelearning/webmcp) and sees itself as a complement to MCP.

### Who brings the assistant?

Here is the shift in perspective at which WebMCP clicks. A classic chatbot belongs to the operator: they build the widget, run a model in the background, and pay for every token a visitor consumes. With WebMCP it works the other way around. The visitor brings their own assistant, for example ChatGPT in the built-in browser of the desktop app, and that assistant does the inference at the visitor's expense. The site only contributes the tools. It needs no model of its own, no chat server, no API bill. It only provides the capabilities; the compute time is the visitor's.

|  | Classic chatbot | WebMCP |
| --- | --- | --- |
| Runs the model | the website operator | the visitor (their assistant) |
| Pays the tokens | the operator | the visitor |
| Data protection | the operator decides which AI processes the input | the visitor decides which AI processes their input |
| Backend needed | yes: server plus model | no AI backend; the tool action runs against your existing app code |
| Assistant's context | only what the operator gives it | the visitor's full context |
| Other tools | none | the visitor's, freely combined |

The last row weighs more than it looks. The visitor's assistant knows more than this one page. It has its own context and its own tools: the calendar, the inbox, other connected services. And it can chain your site's tool with all of that. An example: "Find the cheapest workshop option on agentic.schule, then a free slot in my calendar, and propose a concrete date to them through their intro-call form." The assistant compares the offers on the page, reads the calendar itself, picks a date, and then calls the intro-call tool `introCall`. A classic chatbot on the website never sees the visitor's calendar and could not close that chain.

For the operator this solves a nagging problem along the way. A classic chatbot on the website is an open LLM that the operator pays for. And visitors happily use it for all sorts of things that have nothing to do with the site, from a poem to their homework. You can run many countermeasures; you never really close the gap. With WebMCP the question does not even arise: there is no operator model that anyone could siphon off. Whoever uses the assistant also pays for it.

And the tech stack shrinks. No chat backend, no hosted model, no abuse defense around it. What remains are the tool declarations in the frontend, and that is all it takes.

So WebMCP shifts who pays for the AI and who controls it: away from the operator, toward the visitor and their agent. The operator gains an assistant that can often do more than anything they would ever have built into a chat widget.

## Registering a tool: two ways

The specification knows two APIs.

The **imperative API** registers tools via JavaScript through `document.modelContext.registerTool()`. That is the flexible way, and it is the way a framework like Angular uses under the hood.

The **declarative API** needs no JavaScript at all. For a simple form, HTML attributes right on the `<form>` are enough:

```html
<!-- Declarative API: a form as a WebMCP tool via HTML attributes -->
<form toolname="introCall"
      tooldescription="Request an intro call with the agentic.schule team"
      toolautosubmit>
  <input name="name" toolparamdescription="Your name" required>
  <input name="mail" type="email" toolparamdescription="Email address" required>
  <textarea name="note" toolparamdescription="What is it about?"></textarea>
  <button type="submit">Request</button>
</form>
```

The `toolname` attribute names the tool, `tooldescription` describes it, and `toolparamdescription` on the fields supplies the parameter descriptions. `toolautosubmit` lets the agent submit the form itself once it is filled. The browser derives a JSON schema from the form fields automatically. For a plain page without a framework this is a very elegant entry point.

> **⚠️ Caution:** The most important consumer today, the built-in browser of ChatGPT Desktop, supports only part of the specification. Specifically not recognized: the declarative variant, meaning tools via the HTML attributes `toolname`, `tooldescription`, and `toolparamdescription`, and tools registered inside an `<iframe>` (even same-origin). Only tools registered via JavaScript on the top-level page count. For broad reach the imperative API is therefore the safe choice.

For real applications the imperative API gets more interesting, because it lets you couple tool registration to the framework's architecture. That is exactly the subject of part 2.

## What already works today?

WebMCP needs two sides: a web app that declares tools, and an assistant that calls them. The second side decides whether you actually get anything out of it today. The Community Group maintains an official [implementation status overview](https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md) for it. My picture today:

**Assistants that can call tools:**

- **ChatGPT Desktop:** the most concrete path for real visitors. In the built-in browser of the desktop app, the two assistants ChatGPT Work (the workplace variant) and Codex (OpenAI's coding agent) discover and use the tools of the open page. OpenAI calls it "Site tools". It needs a model that OpenAI supports for this (currently from the Sol line; the Luna variant has WebMCP disabled); which models these are is in [OpenAI's Site tools docs](https://learn.chatgpt.com/docs/webmcp). Availability also depends on rollout and, in enterprise workspaces, on an admin approval, and every tool invocation goes through a safety check first.
- **Brave:** experimental support in its own AI chat, _Leo_. The evidence is an open issue, not a finished feature.
- **Meta Ray-Ban Display:** announced ("coming soon"), off by default, to be enabled per device.

**Browsers with an origin trial (for site operators):**

- **Chrome:** _Origin Trial_ from version 149. An _Origin Trial_ is a time-limited test in which you enable the feature for your own domain, without the user having to set a flag.
- **Edge:** Origin Trial from version 150.

**For development:** the [Model Context Tool Inspector Extension](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd) simulates an agent and calls your tools. A debug tool, not a path for real visitors.

**Not on board yet:** Firefox and Safari have no implementation, only one entry each in their _standards-positions_ ([Mozilla](https://github.com/mozilla/standards-positions/issues/1412), [WebKit](https://github.com/WebKit/standards-positions/issues/670)). And one name is missing entirely, which I find notable: Claude. Of all vendors, Anthropic, who created MCP, does not yet appear as a WebMCP agent.

One point makes me smile: WebMCP comes largely from Google, and of all browsers Google's own can't do it for normal visitors yet. Chrome has the origin trial, but the only interactive path is the debug extension, whose agent, per the Chrome docs, is explicitly "separate from the Gemini in Chrome features". Whoever proposes a standard should, in my opinion, be able to show it off in their own browser from day 0. That the first real end-user path comes from ChatGPT Desktop instead has its irony.

My assessment stands: the direction is right and support is growing. For a productive use you rely on, though, it is too early.

## Try it yourself

The way you are most likely to experience WebMCP today: open a page with tools in the built-in browser of ChatGPT Desktop and ask the assistant for a task, with a Sol model as described above. If it recognizes a matching tool, it calls it instead of feeling its way across the page.

For development you don't need that. In Chrome you enable the feature locally through a flag:

```text
chrome://flags/#enable-webmcp-testing
```

Set the flag to "Enabled" and restart Chrome via the relaunch button. After that, `document.modelContext` is available in the console. Open a page that registers tools. agentic.schule, for example, registers the tool `introCall` for its intro-call form once WebMCP is active in the browser. Then you can list it and call it by hand:

```js
const tools = await document.modelContext.getTools();
const tool = tools.find(t => t.name === 'introCall');

const result = await document.modelContext.executeTool(tool, {
  name: 'Ada Lovelace',
  mail: 'ada@example.com',
  note: 'Interested in a team workshop.'
});
console.log(JSON.parse(result));
```

It gets more comfortable with the [Model Context Tool Inspector Extension](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd). It shows you the registered tools of a page, calls them manually, and lets you test in natural language whether an agent picks the right tools. When debugging, it saves you the manual listing and calling of tools.

## Where does it still snag?

Every praised tool has its catches. With WebMCP there are four.

**First: it is experimental, literally so.** The APIs can change even outside of major version jumps. The status of the specification is a _Draft Community Group Report_, that is the early draft of a working group, not the official W3C standards track. Whoever builds today has to expect changes.

**Second: it is not yet a cross-platform feature.** Productive use hangs on the Chromium browsers. As long as Firefox and Safari only record a position, you will not reach every user with it. And the real paths today are all desktop: ChatGPT Desktop, the Chrome flag, the origin trials, and the Inspector extension. There is no mobile access yet.

**Third: does WebMCP really solve the prompt injection problem?** Partly. The agent no longer has to sift through the free text of the page to operate it, and that text was a classic entry point. But the risk has not vanished, it only shifts. Because the tool descriptions and a tool's return values are text as well, and the page controls that text. On a trustworthy page that is no problem. A malicious page, though, can slip the agent tools with misleading descriptions. And the very chaining that makes it appealing is the flip side: through the assistant the visitor brought along, a malicious page can reach that assistant's calendar or inbox. The protection is therefore carried by the user, who keeps control over the tool calls; the technology alone is not enough. The working group tracks these questions in a dedicated [Security & Privacy Questionnaire](https://github.com/webmachinelearning/webmcp/blob/main/security-privacy-questionnaire.md).

**Fourth: you give up control.** The data-protection advantage from the table has a flip side for you as the operator: you no longer decide which model processes your users' input. And every registered tool is open to whatever assistant a visitor brings along, including mutating ones like sending mail. Classic forms you protect against bots with Turnstile and the like. WebMCP, though, explicitly invites bots to call tools, and a spam protection that lets good bots through while stopping bad ones does not, to my knowledge, exist yet.

## Conclusion

WebMCP is a concept I am happy to look at more closely. It reverses the interaction between agent and web app: the page hands the agent the tools, instead of letting itself be felt out. For anyone who knows MCP from Claude Code, the classification is easy: WebMCP is the client-side counterpart that uses your existing code in the browser and keeps the UI in sync.

What convinces me most about it: WebMCP is the easiest way to bring AI into an existing web application. The app is already there. You attach your existing client logic to it as tools, and practically any application becomes AI-ready. For that you first have to realize how much effort the previous path takes: your own backend, your own model, your own abuse defense. The "bring your own assistant" approach clears all of that away. That, for me, is the decisive point.

For production it is still too early. For a prototype, an internal tool, or simply for learning, right now is the right time. My recommendation: try it from both sides. As a visitor, open a page with tools in the built-in browser of ChatGPT Desktop and let the assistant operate it. As a developer, set the Chrome flag and call your tools through the Inspector extension or one of the [Google demos](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos). After a short while you will have a feel for whether this is a future for you.

In the [second part](https://agentic.schule/en/blog/2026-10-webmcp-angular) it gets concrete: we register WebMCP tools in Angular, bind them to our code through _dependency injection_ (Angular's built-in wiring of dependencies), and turn a form into a finished tool with a single option.

**Questions, feedback, your own experiments with WebMCP?** Always welcome, I look forward to every message.

---

*Curious about agentic work in practice? In the workshops at [agentic.schule](https://agentic.schule) and [angular.schule](https://angular.schule) we show how modern AI agents are changing everyday development.*
