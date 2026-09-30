---
title: 'WebMCP in Angular: Tools from Providers and Signal Forms'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe is a trainer and consultant for modern web development. The workshops at <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> and <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> focus on Angular in practice – and increasingly on agentic development with AI agents like Claude Code.'
bioHeading: About the author
published: 2026-10-14
keywords:
  - WebMCP
  - Angular
  - Angular 22
  - Signal Forms
  - Dependency Injection
  - AI Agents
  - Web Model Context Protocol
language: en
header: header.jpg
---

**Angular ships experimental support for WebMCP (Web Model Context Protocol) from version 22 on, and it fits into the existing architecture: tools are providers, their lifetime hangs on the injector, and a Signal Form becomes a finished tool with a single option. In this second part we register such tools, control their lifetime through the injector, and let Angular derive the JSON schema automatically from a form. Everything is marked `experimental` and can change.**

This is part 2 of two. [Part 1](https://agentic.schule/en/blog/2026-10-webmcp) explains in general what WebMCP is, how it relates to the MCP from Claude Code, and who supports it. This part is the Angular practice. It stands on its own, though I assume the concept from part 1 briefly.

## Contents

[[toc]]

## WebMCP in Angular

A reminder from part 1: a WebMCP tool has a name, a description, and a JSON schema for its parameters. An agent reads this contract and calls the tool with structured arguments. Under the hood, Angular uses the imperative browser API `document.modelContext.registerTool()`. The nice thing is: you notice none of that in everyday work. You work with providers and injection context, the way you know it.

Angular offers two ways to register a tool:

- the provider function `provideExperimentalWebMcpTools()`, which you can attach to any injector,
- the function `declareExperimentalWebMcpTool()`, which works directly inside an injection context.

Angular takes care of unregistering itself: when the associated injector is destroyed, the tool disappears too. One rule always applies: tool names must be unique. A duplicate registration causes a runtime error.

> **⚠️ Caution:** WebMCP in Angular is explicitly marked as experimental. The APIs can change even outside of major releases. For prototypes and internal tooling that is fine, for production systems it is not yet.

## A tool as a provider

With `provideExperimentalWebMcpTools()` you define tools as providers. The function takes an array of tool definitions and returns a provider that you attach to any injector. The lifetime of a tool thus matches the lifetime of its injector.

A tool consists of four properties:

- `name`: the unique name under which the agent calls the tool.
- `description`: the natural-language description by which the agent recognizes when to use the tool.
- `inputSchema`: the JSON schema of the expected parameters.
- `execute`: the callback that runs on invocation. It runs in the injection context of the injector, so you can use `inject()` directly.

The `execute` callback returns an object of the form `{ content: [{ type: 'text', text: '…' }] }`. That is the return value the agent gets to see: a list of content blocks, here a single text. The callback may be `async` and return a `Promise`. For a real tool that is the normal case, because it usually talks to a server.

Exactly this last point is the clever bit. We encapsulate the domain logic in a service as usual:

```ts
// book-store.ts
import { Service } from '@angular/core';

@Service()
export class BookStore {
  search(query: string): string { /* ... */ }
}
```

And we define the tool in the app config. In the `execute` callback we grab the `BookStore` via `inject()`:

```ts
// app.config.ts
import { ApplicationConfig, provideExperimentalWebMcpTools, inject } from '@angular/core';
import { BookStore } from './book-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalWebMcpTools([{
      name: 'searchBooks',
      description: 'Searches the book catalog',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search keywords' },
          maxResults: { type: 'number', description: 'Max results to return' },
        },
        required: ['query'],
        additionalProperties: false,
      },
      execute: ({ query, maxResults }) => {
        const store = inject(BookStore);
        return { content: [{ type: 'text', text: store.search(query) }] };
      },
    }]),
  ],
};
```

You describe the parameters in the `inputSchema` following the [JSON Schema format](https://json-schema.org/). Angular derives the TypeScript types for the `execute` callback from it automatically. With `required` you mark mandatory fields, and `additionalProperties: false` forbids anything not in the schema.

> **⚠️ Caution:** Angular does not automatically validate the agent's input against the schema. That is a trap: an agent can send you values that do not fit. So validate the arguments in the `execute` callback yourself before you work with them.

## Where do we register the tools?

Because `provideExperimentalWebMcpTools()` is an ordinary provider, you can attach it to any injector. And the injector decides the validity of the tool.

### Globally at the root

If tools should be available for the entire runtime, you attach them to the app config as above. The root injector lives as long as the application, so the tools are permanently available.

### Per route

Often you only want to offer a tool on a specific route. Then you attach the provider to the route definition:

```ts
import { provideExperimentalWebMcpTools } from '@angular/core';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard-page').then(m => m.DashboardPage),
    providers: [
      provideExperimentalWebMcpTools([{
        name: 'exportDashboardReports',
        description: 'Exports the current dashboard analytics.',
        inputSchema: { type: 'object', properties: {} },
        execute: () => ({
          content: [{ type: 'text', text: 'Dashboard export successfully triggered.' }],
        }),
      }]),
    ],
  },
];
```

There is a trap here: a route's injectors are not destroyed by default when you navigate away. So the tool would stay visible to the agent on other pages too. To have it unregistered cleanly when the route is left, you configure the router with `withAutoCleanupInjectors()`:

```ts
import { provideRouter, withAutoCleanupInjectors } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withAutoCleanupInjectors()),
  ],
};
```

### Per component

The provider works the same way in a component's `providers`:

```ts
import { Component, provideExperimentalWebMcpTools } from '@angular/core';

@Component({
  selector: 'app-book-form',
  providers: [
    provideExperimentalWebMcpTools([/* ... */]),
  ],
  templateUrl: './book-form.html',
})
export class BookForm {}
```

The tool is then registered exactly as long as the component exists. As soon as it is destroyed, Angular unregisters it automatically.

## Registering tools directly in services

For dynamic cases you register a tool with `declareExperimentalWebMcpTool()` directly in an injection context, for example in a service constructor:

```ts
import { Service, declareExperimentalWebMcpTool, signal } from '@angular/core';

@Service()
export class Counter {
  readonly count = signal(0);

  constructor() {
    declareExperimentalWebMcpTool({
      name: 'getCounter',
      description: 'Reads the global counter.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => ({
        content: [{ type: 'text', text: `The count is: ${this.count()}.` }],
      }),
    });
  }
}
```

`declareExperimentalWebMcpTool()` works in any injection context. And from that follows a rule: prefer to use it in root services or in routed components, that is, where the instance is guaranteed to exist only once. If the same declaration lands in a component that appears on the page more than once, you register the same tool name multiple times and run into the runtime error mentioned above.

## Turning a Signal Form into a tool

Now comes the part I like best. A form is essentially already the description of an action: these fields, these mandatory fields, this submit. So why write the JSON schema by hand when the form already knows it?

That is exactly what the `experimentalWebMcpTool` option in the `form()` function does: it connects [Signal Forms](https://angular.dev/essentials/signal-forms) with WebMCP and makes a tool out of a form. Angular derives the JSON schema automatically from the initial value of the form model, including the mandatory fields from the `required()` validators. When the agent calls the tool, Angular writes its values into the same form model that also feeds the visible UI, and then triggers the submission. So the user sees what the agent enters.

First you enable the feature in the app config:

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideExperimentalWebMcpForms } from '@angular/forms/signals';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalWebMcpForms(),
  ],
};
```

Then the `experimentalWebMcpTool` option with a name and description on the `form()` call is enough:

```ts
import { Component, inject, signal } from '@angular/core';
import { form, required, minLength, maxLength } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { BookStore } from './book-store';

@Component({
  selector: 'app-book-create-page',
  templateUrl: './book-create-page.html',
})
export class BookCreatePage {
  #bookStore = inject(BookStore);
  #router = inject(Router);

  readonly #bookFormData = signal({
    isbn: '',
    title: '',
    subtitle: '',
    authors: [''],
    description: '',
    imageUrl: '',
  });

  protected readonly bookForm = form(
    this.#bookFormData,
    (path) => {
      required(path.title, { message: 'Title is required.' });
      required(path.isbn, { message: 'ISBN is required.' });
      minLength(path.isbn, 13, { message: 'ISBN must have 13 digits.' });
      maxLength(path.isbn, 13, { message: 'ISBN must have 13 digits.' });
      required(path.description, { message: 'Description is required.' });
    },
    {
      experimentalWebMcpTool: {
        name: 'createBook',
        description: 'Create a new book',
      },
      submission: {
        action: async (bookForm) => {
          const value = bookForm().value();
          const newBook = { ...value, createdAt: new Date().toISOString() };
          const created = await this.#bookStore.create(newBook);
          await this.#router.navigate(['/books', 'details', created.isbn]);
        },
      },
    },
  );
}
```

From this single option a complete tool emerges:

- The fields `isbn`, `title`, `subtitle`, `authors`, `description`, and `imageUrl` are derived together with their types from the initial value of the signal.
- `title`, `isbn`, and `description` are marked `required`, because they have a `required()` validator.
- When the agent calls the tool, Angular validates the input and returns errors. The agent sees its error, corrects itself, and tries again.
- On successful validation the `submission.action` runs automatically.

This last point is strong: the agent gets the same validation errors as a human and can correct itself. You write not a single extra line for it.

### What to watch out for in the form model

So that Angular can derive the schema cleanly, the same requirements apply as for Signal Forms anyway:

- Fields must **not** start with `null` or `undefined`. Angular cannot derive a type from either. Use concrete initial values like `''`, `0`, or `false`.
- Arrays need **at least one entry**, otherwise the element type cannot be recognized. That is why it says `authors: ['']` above and not `authors: []`.

Specific to WebMCP, one restriction is added: async validators do not run on the tool call. Uniqueness checks against the server therefore belong in the `submission.action`, not in an async validator.

## Testing

For manual testing in the browser you set the flag `chrome://flags/#enable-webmcp-testing` and use the Inspector extension. I described both in [part 1](https://agentic.schule/en/blog/2026-10-webmcp).

For automated unit tests the Angular documentation recommends the package [`@mcp-b/webmcp-polyfill`](https://www.npmjs.com/package/@mcp-b/webmcp-polyfill). It provides a mock implementation of the browser API, so your tests can call the tools without a real browser with the flag enabled having to run.

## Conclusion

Angular makes getting started with WebMCP easy. Tools are providers, their lifetime hangs on the injector, and the Signal Forms integration takes the schema writing off your hands entirely. It fits into the existing architecture so well that it already feels familiar.

Two things I keep in mind. First the `experimental` in the name: these APIs are deliberately marked as moving, and for production systems the time has not come yet. Second the traps that WebMCP brings, not Angular: the unique tool names and the missing automatic validation of the agent's input. Both are easy to handle once you know about them.

My advice: build yourself a small tool on a real form of your app. Set the flag, open the Inspector extension, and let an agent fill in the form. The moment it corrects itself after a validation error is the one where the concept clicks.

All the details are in the official [Angular WebMCP Guide](https://angular.dev/ai/webmcp). And the big picture, WebMCP versus MCP and the state of the browsers, is in [part 1](https://agentic.schule/en/blog/2026-10-webmcp).

**Questions, feedback, your own WebMCP tools in Angular?** Always welcome, I look forward to every message.

---

*Curious about agentic work in practice? In the workshops at [agentic.schule](https://agentic.schule) and [angular.schule](https://angular.schule) we show how modern AI agents are changing everyday development.*
