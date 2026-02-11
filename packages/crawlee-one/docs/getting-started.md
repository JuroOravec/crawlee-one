# Getting Started

This guide walks through the `crawleeOne()` function and its options in detail. For a quick overview, see the [README](../README.md).

## Prerequisites

You should be familiar with:

- [Crawlee](https://crawlee.dev/) -- the underlying web scraping framework.
- [Apify](https://apify.com/) (optional) -- the platform for deploying and managing scrapers.

## Installation

```sh
npm install crawlee-one
```

## How crawleeOne works

When you call `crawleeOne()`, the following happens:

1. The crawler initializes and resolves its input.
2. It processes URLs from the RequestQueue.
3. For each request, it finds the first route whose `match` passes, and calls that route's `handler`.
4. The handler scrapes data and saves it with `pushData`.
5. The handler may discover more URLs and enqueue them with `pushRequests`.
6. When the RequestQueue is empty (and `keepAlive` is not set), the crawler stops.

```ts
import { crawleeOne } from 'crawlee-one';

await crawleeOne({
  type: 'cheerio',
  routes: {
    mainPage: {
      match: /example\.com\/home/i,
      handler: async (ctx) => {
        const { $, pushData, pushRequests } = ctx;
        await pushData([{ title: $('h1').text() }], {
          privacyMask: { author: true },
        });
        await pushRequests([{ url: 'https://example.com/page/2' }]);
      },
    },
  },
});
```

## Full options reference

```ts
import { Actor } from 'apify';
import { crawleeOne, createSentryTelemetry } from 'crawlee-one';
import { apifyIO } from 'crawlee-one/apify';

await crawleeOne({
  // --- Crawler type ---
  // Determines the crawler strategy and the context available in handlers.
  // Available: 'basic', 'http', 'jsdom', 'cheerio', 'playwright', 'puppeteer'
  type: 'cheerio',

  // --- Input ---
  // Configure data transforms, request filtering, caching, and more.
  // See the input reference for all fields:
  // https://github.com/JuroOravec/crawlee-one/blob/main/docs/reference-input.md
  //
  // Use `input` for hardcoded config, `inputDefaults` for overridable defaults.
  input: {
    outputTransform: (item) => {
      /* ... */
    },
  },
  inputDefaults: {
    // Overridable defaults
  },

  // Pass Field objects with embedded Zod schemas for input validation.
  // Input is validated against these schemas before the crawler starts.
  inputFields: {
    myField: createStringField({
      title: 'Target URL',
      type: 'string',
      description: 'URL to scrape',
      editor: 'textfield',
      // Zod schema for this field
      schema: z.string().url(),
    },
  },

  // --- Input merging ---
  // By default, if `input` is set, the end user's input (via Apify platform) is ignored.
  // Set to `true` to merge, or provide a custom merge function.
  // The merge function receives defaults from `inputDefaults`, the input from `input`, and input from `Apify.input()` (Apify platform)
  // mergeInput: ({ defaults, overrides, env }) => ...
  //
  // `true` is equivalent to:
  // mergeInput: ({ defaults, overrides, env }) => ({ ...defaults, ...env, ...overrides }),
  mergeInput: true,

  // --- Crawler config ---
  // Passed directly to the Crawler constructor (e.g. new CheerioCrawler(crawlerConfig)).
  // Use for settings that should not be user-overridable.
  crawlerConfig: {
    maxRequestsPerMinute: 120,
    requestHandlerTimeoutSecs: 180,
  },
  // Same as crawlerConfig, but can be overridden by user input.
  crawlerConfigDefaults: {
    // ...
  },

  // --- Routes ---
  // Each URL is compared against routes.
  // The first matching route handles it.
  routes: {
    mainPage: {
      // Regex, function, or array of both.
      match: /example\.com\/home/i,
      handler: async (ctx) => {
        const { $, request, pushData, pushRequests } = ctx;

        const data = [
          /* scraped items */
        ];
        // pushData applies transforms, filtering, privacy masking, and caching.
        await pushData(data, {
          privacyMask: { author: true },
        });

        // pushRequests applies request filtering and transforms.
        const reqs = ['https://...'].map((url) => ({ url }));
        await pushRequests(reqs);
      },
    },
  },

  // --- Hooks ---
  hooks: {
    // Called after initialization. If provided, you must call actor.runCrawler() yourself.
    onReady: async (actor) => {
      await actor.runCrawler(['https://example.com']);
    },
    // Called before/after each route handler.
    onBeforeHandler: (ctx) => {
      /* ... */
    },
    onAfterHandler: (ctx) => {
      /* ... */
    },
    // Additional user input validation before the crawler starts.
    validateInput: (input) => {
      if (!input?.startUrls?.length) throw new Error('startUrls required');
    },
  },

  // --- Proxy ---
  // Crawlee proxy configuration. Do not set here if you want users to configure
  // proxy via the input field.
  proxy: Actor.createProxyConfiguration({
    /* ... */
  }),

  // --- Telemetry ---
  // Pluggable error tracking. Sentry is supported out of the box.
  telemetry: createSentryTelemetry({
    dsn: 'https://...',
    tracesSampleRate: 1.0,
    serverName: 'myCrawler',
  }),

  // --- IO (storage backend) ---
  // Abstraction over datasets, request queues, and key-value stores.
  // Defaults to Apify (local filesystem when not on Apify platform).
  io: apifyIO,

  // --- Router ---
  // Custom Crawlee Router instance. Optional.
  router: myCustomRouter(),
});
```

For the full TypeScript definitions, see:

- [`crawleeOne`](./typedoc/functions/crawleeOne.md)
- [`CrawleeOneArgs`](./typedoc/interfaces/CrawleeOneArgs.md)
- [`pushData`](./typedoc/functions/pushData.md)
- [`pushRequests`](./typedoc/functions/pushRequests.md)

## Route handler context

Each route handler receives a context object from [Crawlee Router](https://crawlee.dev/api/core/class/Router), extended with CrawleeOne-specific properties:

| Property       | Type                                                                 | Description                                                                  |
| -------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `actor`        | [`CrawleeOneActorInst`](./typedoc/interfaces/CrawleeOneActorInst.md) | The CrawleeOne instance. Access input, state, IO, and more.                  |
| `pushData`     | function                                                             | Save scraped items with transforms, filtering, privacy, and caching applied. |
| `pushRequests` | function                                                             | Enqueue URLs with request filtering and transforms applied.                  |
| `metamorph`    | function                                                             | Trigger a downstream crawler/actor.                                          |

```ts
handler: async (ctx) => {
  // --- Standard Crawlee context ---
  const url = ctx.request.loadedUrl || ctx.request.url;
  const $ = ctx.parseWithCheerio();

  // --- CrawleeOne extensions ---

  // Save scraped data (applies all configured transforms and filters)
  await ctx.pushData(items, { privacyMask: { name: true } });

  // Enqueue more URLs (applies configured request filters)
  await ctx.pushRequests([{ url: 'https://...' }]);

  // Access resolved input
  if (ctx.actor.input.myCustomField) {
    /* ... */
  }

  // Access shared state (available in hooks like outputTransform)
  ctx.actor.state.counter = (ctx.actor.state.counter || 0) + 1;

  // Access storage directly
  const dataset = await ctx.actor.io.openDataset();
  const store = await ctx.actor.io.openKeyValueStore();
};
```

The `actor` object is integral to CrawleeOne. [See the full list of properties](./typedoc/interfaces/CrawleeOneActorInst.md).

## Next steps

- [Features](./features.md) -- full catalog of what CrawleeOne offers.
- [Use cases](./use-cases.md) -- common scraping scenarios with configuration examples.
- [Input reference](./reference-input.md) -- all available input fields.
- [Deploying to Apify](./deploying-to-apify.md) -- step-by-step deployment guide.
- [Codegen](./codegen.md) -- generate typed crawler definitions from config.
- [Integrations](./integrations.md) -- custom telemetry and storage backends.
