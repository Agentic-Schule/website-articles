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

An AI agent that is supposed to operate your web app does something tedious today: it reads the DOM, evaluates the accessibility tree, or analyzes screenshots. It feels its way across an interface that was built for humans.

**WebMCP turns that around. Instead of the agent guessing the page, the page declares its capabilities as _tools_ and the agent calls them directly. That is faster and more reliable. But it is still an early draft, not a standard. In this first part we clarify what WebMCP is, how it relates to the MCP you know from Claude Code, who already supports it, and where the catches are.**

This is part 1 of two. This part stays general and is meant for any web developer. [Part 2](https://agentic.schule/en/blog/2026-10-webmcp-angular) then shows the concrete implementation in Angular. Each part stands on its own.

## Contents

[[toc]]

## The problem: the agent feels its way across your page

Picture a form for adding a book. For a human it is trivial: type the title, type the ISBN, submit. An agent without WebMCP sees none of that. It sees a tree of DOM nodes and has to guess which `<input>` means the ISBN, which button submits, and in what order all of that happens.

That has three downsides. It is slow, because the agent has to walk many nodes and burn many tokens doing it. It is brittle, because a reworked layout breaks the automation. And it opens a security hole: when the agent reads the free text of the page, a hidden instruction can sit there and hijack it. That is the classic _prompt injection_, smuggling instructions in through the input.

The idea of WebMCP is the reversal: the agent no longer reads the page. The page tells the agent itself what it can do.

## WebMCP: the website declares its tools

[WebMCP](https://github.com/webmachinelearning/webmcp) (Web Model Context Protocol) is a proposal from the [W3C Web Machine Learning Community Group](https://www.w3.org/community/webmachinelearning/). A web app uses it to declare actions as _tools_. Each tool has a name, a description in natural language, and a JSON schema for the expected parameters. A connected agent sees this clear contract and calls the tool with structured arguments.

The flow has three steps:

1. **The page registers tools.** For every action an agent may perform, you declare a tool with a name, description, and parameter schema.
2. **The browser exposes the tools.** A WebMCP-capable browser or an extension collects the registered tools and passes them to the agent.
3. **The agent calls a tool.** It supplies the arguments, your code does the rest. Users keep control over permissions and confirmations.

The difference in practice is large. Without WebMCP the agent has to work through dozens of DOM nodes for our book form. With WebMCP a single declared tool it calls directly is enough. Google built an [explainer with a live demo](https://googlechromelabs.github.io/webmcp-tools/demos/explainer/) for this, where the same widget is driven once via DOM scraping and once via WebMCP. The contrast is worth seeing.

## WebMCP or MCP?

Anyone who works with Claude Code already knows MCP: Anthropic's [Model Context Protocol](https://modelcontextprotocol.io/). You attach an MCP server and the agent gains new capabilities. So the question suggests itself: is WebMCP simply MCP in the browser? Not quite. The difference lies in where the tools run.

A classic MCP server is a **backend integration**. The agent talks directly to a server, bypassing the web interface. For server-side actions that is ideal. For an interactive web app it brings three burdens that the specification itself names: the agent bypasses the application's own UI. You have to rebuild the user's state, their context, and their authentication on a separate server. And you have to write a dedicated server in the first place, instead of reusing your existing client code.

WebMCP is the client-side answer to that. The tools live in the script of the running page, in the browser, in the user's existing session. The agent, the user, and the page share the same context. The tool runs your own code and keeps the visible interface in sync. The WebMCP specification [explicitly references MCP](https://github.com/webmachinelearning/webmcp) and sees itself as a complement to MCP.

A short summary:

- **MCP server:** server-side, for actions behind the application. You run a server and replicate auth and state.
- **WebMCP:** client-side, for actions in the running page. Your existing frontend code becomes the tool, the UI stays in sync.

## Registering a tool: two ways

The specification knows two APIs.

The **imperative API** registers tools via JavaScript through `document.modelContext.registerTool()`. That is the flexible way, and it is the way a framework like Angular uses under the hood.

The **declarative API** needs no JavaScript at all. For a simple form, HTML attributes right on the `<form>` are enough:

```html
<!-- Declarative API: a form as a WebMCP tool via HTML attributes -->
<form toolname="createBook"
      tooldescription="Create a new book in the catalog"
      toolautosubmit>
  <input name="title" toolparamdescription="Book title" required>
  <input name="isbn" toolparamdescription="ISBN (13 digits)" required>
  <textarea name="description" toolparamdescription="Book description"></textarea>
  <button type="submit">Create</button>
</form>
```

The `toolname` attribute names the tool, `tooldescription` describes it, and `toolparamdescription` on the fields supplies the parameter descriptions. `toolautosubmit` lets the agent submit the form itself once it is filled. The browser derives a JSON schema from the form fields automatically. For a plain page without a framework this is a very elegant entry point.

For real applications the imperative API gets more interesting, because it lets you couple tool registration to the framework's architecture. That is exactly the subject of part 2.

## Who already supports this?

This is the question that decides between talking and building. The Community Group maintains an official [implementation status overview](https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md) for it. The state is better than it was a few months ago, but it is clearly that of an early feature:

- **Chrome:** _Origin Trial_ from version 149. An _Origin Trial_ is a time-limited test in which you can enable the feature for your own domain, without the user having to set a flag.
- **Edge:** Origin Trial from version 150.
- **Brave:** experimental support in its own AI chat, _Leo_.
- **ChatGPT Desktop:** can call WebMCP tools.
- **Meta Ray-Ban Display:** announced for web apps.
- **Firefox and Safari:** no implementation yet. Both do have an entry in their _standards-positions_ ([Mozilla](https://github.com/mozilla/standards-positions/issues/1412), [WebKit](https://github.com/WebKit/standards-positions/issues/670)), where the vendors record their stance on a proposal.

One name is missing from the list, and I find that notable: Claude. Of all vendors, Anthropic, who created MCP, does not yet appear as a WebMCP agent. That may change, but as of today that is how it is.

My take: the direction is right and support is growing. Two Chromium browsers in an Origin Trial and two serious agents are more than a pure experiment. A ratified standard you would base a production system on it is not, though.

## Try it yourself

You do not need an Origin Trial to test. In Chrome you enable the feature locally through a flag:

```text
chrome://flags/#enable-webmcp-testing
```

After that, `document.modelContext` is available in the console. Open a page that registers tools (for example one of the Google demos below), then you can list them and call one by hand:

```js
const tools = await document.modelContext.getTools();
const tool = tools.find(t => t.name === 'createBook');

const result = await document.modelContext.executeTool(tool, {
  title: 'Web MCP',
  isbn: '9781234567897',
  description: 'A brand new book about Web MCP'
});
console.log(JSON.parse(result));
```

It gets more comfortable with the [Model Context Tool Inspector Extension](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd). It shows you the registered tools of a page, calls them manually, and lets you test in natural language whether an agent picks the right tools. When debugging, it saves you the manual listing and calling of tools.

## Where does it still snag?

Every praised tool has its catches. With WebMCP there are three.

**First: it is experimental, literally so.** The APIs can change even outside of major version jumps. The status of the specification is a _Draft Community Group Report_, that is the early draft of a working group, not the official W3C standards track. Whoever builds today builds on shifting ground.

**Second: it is not yet a cross-platform feature.** Productive use hangs on the Chromium browsers. As long as Firefox and Safari only record a position, you will not reach every user with it.

**Third: does WebMCP really solve the prompt injection problem?** Partly. The agent no longer has to sift through the free text of the page to operate it, and that text was a classic entry point. But the risk has not vanished, it only shifts. Because the tool descriptions and a tool's return values are text as well, and the page controls that text. On a trustworthy page that is no problem. A malicious page, though, can slip the agent tools with misleading descriptions. The protection is therefore carried by the user, who keeps control over the tool calls; the technology alone is not enough. The working group tracks these questions in a dedicated [Security & Privacy Questionnaire](https://github.com/webmachinelearning/webmcp/blob/main/security-privacy-questionnaire.md).

## Conclusion

WebMCP is a concept I am happy to look at more closely. It reverses the interaction between agent and web app: the page hands the agent the tools, instead of letting itself be felt out. For anyone who knows MCP from Claude Code, the classification is easy: WebMCP is the client-side counterpart that uses your existing code in the browser and keeps the UI in sync.

For production it is still too early. For a prototype, an internal tool, or simply for learning, right now is the right time. My recommendation: set the flag in Chrome, install the Inspector extension, and open one of the [Google demos](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos). After a short while you will have a feel for whether this is a future for you.

In the [second part](https://agentic.schule/en/blog/2026-10-webmcp-angular) it gets concrete: we register WebMCP tools in Angular, bind them to the code through _dependency injection_ (Angular's built-in wiring of dependencies), and turn a form into a finished tool with a single option.

**Questions, feedback, your own experiments with WebMCP?** Always welcome, I look forward to every message.

---

*Curious about agentic work in practice? In the workshops at [agentic.schule](https://agentic.schule) and [angular.schule](https://angular.schule) we show how modern AI agents are changing everyday development.*
