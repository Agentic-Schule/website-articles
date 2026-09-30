---
title: 'WebMCP in Angular: Tools aus Providern und Signal Forms'
author: Johannes Hoppe
mail: johannes.hoppe@haushoppe-its.de
bio: '<a href="https://agentic.schule"><img src="/img/logo-agentic-schule.png" alt="agentic.schule Logo" style="float: right; margin-left: 30px; margin-top: -10px; margin-right: 30px; max-width: 220px;"></a>Johannes Hoppe ist Trainer und Berater für moderne Web-Entwicklung. In den Workshops von <a href="https://angular.schule" style="text-decoration: underline;"><b>angular.schule</b></a> und <a href="https://agentic.schule" style="text-decoration: underline;"><b>agentic.schule</b></a> geht es praxisnah um Angular – und zunehmend um agentische Entwicklung mit KI-Agenten wie Claude Code.'
bioHeading: Über den Autor
published: 2026-10-14
keywords:
  - WebMCP
  - Angular
  - Angular 22
  - Signal Forms
  - Dependency Injection
  - KI-Agenten
  - Web Model Context Protocol
language: de
header: header.jpg
---

**Angular bringt ab Version 22 experimentelle Unterstützung für WebMCP (Web Model Context Protocol) mit, und sie fügt sich in die bestehende Architektur ein: Tools sind Provider, ihre Lebensdauer hängt am Injector, und aus einem Signal Form wird mit einer einzigen Option ein fertiges Tool. In diesem zweiten Teil registrieren wir solche Tools, steuern über den Injector ihre Lebensdauer und lassen Angular das JSON-Schema automatisch aus einem Formular ableiten. Alles ist als `experimental` markiert und kann sich ändern.**

Das hier ist Teil 2 von zwei. [Teil 1](https://agentic.schule/blog/2026-10-webmcp) klärt allgemein, was WebMCP ist, wie es sich zum MCP aus Claude Code verhält und wer es unterstützt. Dieser Teil ist die Angular-Praxis. Er ist für sich lesbar, das Konzept aus Teil 1 setze ich aber knapp voraus.

## Inhalt

[[toc]]

## WebMCP in Angular

Zur Erinnerung aus Teil 1: Ein WebMCP-Tool hat einen Namen, eine Beschreibung und ein JSON-Schema für seine Parameter. Ein Agent liest diesen Vertrag und ruft das Tool mit strukturierten Argumenten auf. Unter der Haube nutzt Angular die imperative Browser-API `document.modelContext.registerTool()`. Das Schöne ist: Davon merkst du im Alltag nichts. Du arbeitest mit Providern und Injection Context, so wie du es kennst.

Angular bietet zwei Wege, ein Tool zu registrieren:

- die Provider-Funktion `provideExperimentalWebMcpTools()`, die du an jeden Injector hängen kannst,
- die Funktion `declareExperimentalWebMcpTool()`, die direkt in einem Injection Context arbeitet.

Um das Abmelden kümmert sich Angular selbst: Wird der zugehörige Injector zerstört, verschwindet auch das Tool. Eine Regel gilt dabei immer: Tool-Namen müssen eindeutig sein. Eine doppelte Registrierung führt zu einem Laufzeitfehler.

> **⚠️ Achtung:** WebMCP in Angular ist ausdrücklich als experimentell markiert. Die APIs können sich auch außerhalb von Major-Releases ändern. Für Prototypen und internes Werkzeug ist das in Ordnung, für Produktivsysteme noch nicht.

## Ein Tool als Provider

Mit `provideExperimentalWebMcpTools()` definierst du Tools als Provider. Die Funktion nimmt ein Array von Tool-Definitionen und liefert einen Provider zurück, den du an einen beliebigen Injector hängst. Damit entspricht die Lebensdauer eines Tools der Lebensdauer seines Injectors.

Ein Tool besteht aus vier Eigenschaften:

- `name`: der eindeutige Name, unter dem der Agent das Tool aufruft.
- `description`: die Beschreibung in natürlicher Sprache, an der der Agent erkennt, wann er das Tool nutzt.
- `inputSchema`: das JSON-Schema der erwarteten Parameter.
- `execute`: der Callback, der beim Aufruf läuft. Er läuft im Injection Context des Injectors, du kannst also direkt `inject()` verwenden.

Der `execute`-Callback gibt ein Objekt der Form `{ content: [{ type: 'text', text: '…' }] }` zurück. Das ist die Rückgabe, die der Agent zu sehen bekommt: eine Liste von Inhaltsblöcken, hier ein einzelner Text. Der Callback darf `async` sein und ein `Promise` liefern. Für ein echtes Tool ist das der Normalfall, weil es meist einen Server anspricht.

Genau dieser letzte Punkt ist der Clou. Wir kapseln die Fachlichkeit wie gewohnt in einem Service:

```ts
// book-store.ts
import { Service } from '@angular/core';

@Service()
export class BookStore {
  search(query: string): string { /* ... */ }
}
```

Und definieren das Tool in der App-Config. Im `execute`-Callback holen wir uns den `BookStore` per `inject()`:

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

Die Parameter beschreibst du im `inputSchema` nach dem [JSON-Schema-Format](https://json-schema.org/). Angular leitet daraus automatisch die TypeScript-Typen fürs `execute`-Callback ab. Mit `required` markierst du Pflichtfelder, und `additionalProperties: false` verbietet alles, was nicht im Schema steht.

> **⚠️ Achtung:** Angular prüft die Eingaben des Agenten nicht automatisch gegen das Schema. Das ist eine Falle: Ein Agent kann dir Werte schicken, die nicht passen. Prüf die Argumente im `execute`-Callback also selbst, bevor du damit arbeitest.

## Wo registrieren wir die Tools?

Weil `provideExperimentalWebMcpTools()` ein gewöhnlicher Provider ist, kannst du ihn an jeden Injector hängen. Und der Injector entscheidet über die Gültigkeit des Tools.

### Global im Root

Sollen Tools über die gesamte Laufzeit verfügbar sein, hängst du sie wie oben in die App-Config. Der Root-Injector lebt so lange wie die Anwendung, die Tools sind also dauerhaft da.

### Pro Route

Oft willst du ein Tool nur auf einer bestimmten Route anbieten. Dann hängst du den Provider in die Route-Definition:

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

Hier lauert eine Falle: Die Injectoren einer Route werden standardmäßig nicht zerstört, wenn du wegnavigierst. Das Tool bliebe also auch auf anderen Seiten für den Agenten sichtbar. Damit es beim Verlassen der Route sauber abgemeldet wird, konfigurierst du den Router mit `withAutoCleanupInjectors()`:

```ts
import { provideRouter, withAutoCleanupInjectors } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withAutoCleanupInjectors()),
  ],
};
```

### Pro Komponente

Genauso funktioniert der Provider in den `providers` einer Komponente:

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

Das Tool ist dann genau so lange registriert, wie die Komponente existiert. Sobald sie zerstört wird, meldet Angular es automatisch ab.

## Tools direkt in Services

Für dynamische Fälle registrierst du ein Tool mit `declareExperimentalWebMcpTool()` direkt in einem Injection Context, etwa im Konstruktor eines Service:

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

`declareExperimentalWebMcpTool()` funktioniert in jedem Injection Context. Und genau daraus folgt eine Regel: Setz es bevorzugt in Root-Services oder in gerouteten Komponenten ein, also dort, wo die Instanz garantiert nur einmal existiert. Landet dieselbe Deklaration in einer Komponente, die mehrfach auf der Seite steht, registrierst du denselben Tool-Namen mehrfach und läufst in den erwähnten Laufzeitfehler.

## Ein Signal Form zum Tool machen

Jetzt kommt der Teil, der mir am besten gefällt. Ein Formular ist im Grunde schon die Beschreibung einer Aktion: Diese Felder, diese Pflichtfelder, dieses Absenden. Warum also das JSON-Schema von Hand schreiben, wenn das Formular es schon kennt?

Genau das leistet die Option `experimentalWebMcpTool` in der Funktion `form()`: Sie verbindet [Signal Forms](https://angular.dev/essentials/signal-forms) mit WebMCP und macht aus einem Formular ein Tool. Angular leitet das JSON-Schema automatisch aus dem initialen Wert des Form-Models ab, inklusive der Pflichtfelder aus den `required()`-Validatoren. Ruft der Agent das Tool auf, schreibt Angular seine Werte in dasselbe Form-Model, das auch die sichtbare UI speist, und löst dann das Absenden aus. Der Nutzer sieht also, was der Agent einträgt.

Zuerst schaltest du das Feature in der App-Config frei:

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

Danach genügt beim `form()`-Aufruf die Option `experimentalWebMcpTool` mit Name und Beschreibung:

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

Aus dieser einen Option entsteht ein vollständiges Tool:

- Die Felder `isbn`, `title`, `subtitle`, `authors`, `description` und `imageUrl` werden mitsamt ihren Typen aus dem initialen Wert des Signals abgeleitet.
- `title`, `isbn` und `description` werden als `required` markiert, weil sie einen `required()`-Validator haben.
- Ruft der Agent das Tool auf, validiert Angular die Eingaben und gibt Fehler zurück. Der Agent sieht seinen Fehler, korrigiert sich und versucht es erneut.
- Ist die Validierung erfolgreich, läuft automatisch die `submission.action`.

Dieser letzte Punkt ist stark: Der Agent bekommt dieselben Validierungsfehler wie ein Mensch und kann sich selbst korrigieren. Du schreibst dafür keine Zeile extra.

### Was du beim Form-Model beachten musst

Damit Angular das Schema sauber ableiten kann, gelten dieselben Anforderungen wie bei Signal Forms ohnehin:

- Felder dürfen **nicht** mit `null` oder `undefined` starten. Aus beidem kann Angular keinen Typ ableiten. Nimm konkrete Startwerte wie `''`, `0` oder `false`.
- Arrays brauchen **mindestens einen Eintrag**, sonst ist der Elementtyp nicht erkennbar. Deshalb steht oben `authors: ['']` und nicht `authors: []`.

Speziell für WebMCP kommt eine Einschränkung dazu: Asynchrone Validatoren laufen beim Tool-Aufruf nicht mit. Eindeutigkeitsprüfungen gegen den Server gehören also in die `submission.action`, nicht in einen Async-Validator.

## Testen

Zum manuellen Testen im Browser setzt du das Flag `chrome://flags/#enable-webmcp-testing` und nutzt die Inspector-Extension. Beide habe ich in [Teil 1](https://agentic.schule/blog/2026-10-webmcp) beschrieben.

Für automatisierte Unit-Tests empfiehlt die Angular-Dokumentation das Paket [`@mcp-b/webmcp-polyfill`](https://www.npmjs.com/package/@mcp-b/webmcp-polyfill). Es liefert eine Mock-Implementierung der Browser-API, sodass deine Tests die Tools aufrufen können, ohne dass ein echter Browser mit aktiviertem Flag laufen muss.

## Fazit

Angular macht den Einstieg in WebMCP einfach. Tools sind Provider, ihre Lebensdauer hängt am Injector, und die Signal-Forms-Integration nimmt dir das Schema-Schreiben komplett ab. Das passt so gut in die bestehende Architektur, dass es sich fast schon vertraut anfühlt.

Zwei Dinge behalte ich im Kopf. Erstens das `experimental` im Namen: Diese APIs sind bewusst als beweglich markiert, und für Produktivsysteme ist der Zeitpunkt noch nicht gekommen. Zweitens die Fallen, die WebMCP mitbringt und nicht Angular: die eindeutigen Tool-Namen und die fehlende automatische Validierung der Agent-Eingaben. Beides ist leicht zu handhaben, wenn man es weiß.

Mein Rat: Bau dir ein kleines Tool an einem echten Formular deiner App. Setz das Flag, öffne die Inspector-Extension und lass einen Agenten das Formular ausfüllen. Der Moment, in dem er sich nach einem Validierungsfehler selbst korrigiert, ist der, in dem das Konzept klick macht.

Alle Details stehen im offiziellen [Angular WebMCP Guide](https://angular.dev/ai/webmcp). Und das große Bild, WebMCP gegen MCP und der Stand der Browser, steht in [Teil 1](https://agentic.schule/blog/2026-10-webmcp).

**Fragen, Feedback, eigene WebMCP-Tools in Angular?** Immer her damit, ich freue mich über jede Nachricht.

---

*Neugierig auf agentisches Arbeiten in der Praxis? In den Workshops von [agentic.schule](https://agentic.schule) und [angular.schule](https://angular.schule) zeigen wir, wie moderne KI-Agenten die tägliche Entwicklung verändern.*
