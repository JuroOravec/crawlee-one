# CrawleeOne

**Production-ready web scraping. Out of the box.**

CrawleeOne wraps [Crawlee](https://crawlee.dev/) with everything production scrapers need -- data transforms, privacy compliance, error tracking, caching, and more -- in a single function call. Write the extraction logic. CrawleeOne handles the rest.

Works seamlessly with [Apify](https://apify.com/), but the storage backend is pluggable -- you're not locked in.

```sh
npm install crawlee-one
```

## Quick start

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
    otherPage: {
      match: (url, ctx) => url.startsWith('/') && ctx.$('.author').length > 0,
      handler: async (ctx) => {
        /* ... */
      },
    },
  },
});
```

That's it. No `Actor.main()` boilerplate, no manual router setup, no input wiring. CrawleeOne handles initialization, routing, input resolution, error handling, and teardown.

## Why CrawleeOne?

### One function. Full crawler.

Replace 100+ lines of Actor + Router + input boilerplate with a single `crawleeOne()` call.

### Switch strategies, not code.

Go from `cheerio` to `playwright` by changing one prop. Your route handlers stay the same.

### Reshape output without touching scraper code.

Users filter, transform, rename, and limit results via input config -- no code changes needed.

```json
{
  "outputPickFields": ["name", "email"],
  "outputRenameFields": { "photo": "media.photos[0].url" },
  "outputMaxEntries": 500,
  "outputFilter": "(entry) => entry.rating > 4.0"
}
```

### Fully typed out of the box.

Route handlers and context objects are typed based on your crawler type. TypeScript knows whether you have `ctx.page` or `ctx.$` -- no extra setup.

### Privacy compliance, built in.

Mark fields as personal data. CrawleeOne redacts them automatically when `includePersonalData` is off.

### Incremental scraping.

Only process entries you haven't seen before. Built-in cache with KeyValueStore tracks what's been scraped across runs.

### Errors captured, not lost.

Failed requests are saved to a dataset automatically. Plug in Sentry with one line, or implement your own telemetry.

### Match routes by URL or content.

Regex, functions, or both. CrawleeOne auto-routes unlabeled requests to the right handler.

[See all features](./docs/features.md)

## Before and after

<details>
<summary>What CrawleeOne replaces (click to expand)</summary>

**With CrawleeOne:**

```ts
await crawleeOne({
  type: 'cheerio',
  routes: {
    mainPage: {
      match: /example\.com\/home/i,
      handler: async (ctx) => {
        const data = [
          /* ... */
        ];
        await ctx.pushData(data, { privacyMask: { author: true } });
        await ctx.pushRequests([{ url: 'https://...' }]);
      },
    },
  },
});
```

**Without CrawleeOne (vanilla Crawlee + Apify):**

```ts
import { Actor } from 'apify';
import { CheerioCrawler, createCheerioRouter } from 'crawlee';

await Actor.main(async () => {
  const rawInput = await Actor.getInput();
  const input = {
    ...rawInput,
    ...(await fetchInput(rawInput.inputFromUrl)),
    ...(await runFunc(rawInput.inputFromFunc)),
  };

  const router = createCheerioRouter();

  router.addHandler('mainPage', async (ctx) => {
    await onBeforeHandler(ctx);
    const data = [
      /* ... */
    ];
    const finalData = await transformAndFilterData(data, ctx, input);
    const dataset = await Actor.openDataset(input.datasetId);
    await dataset.pushData(data);
    const reqs = ['https://...'].map((url) => ({ url }));
    const finalReqs = await transformAndFilterReqs(reqs, ctx, input);
    const queue = await Actor.openRequestQueue(input.requestQueueId);
    await queue.addRequests(finalReqs);
    await onAfterHandler(ctx);
  });

  router.addDefaultHandler(async (ctx) => {
    await onBeforeHandler(ctx);
    const url = ctx.request.loadedUrl || ctx.request.url;
    if (url.match(/example\.com\/home/i)) {
      const req = { url, userData: { label: 'mainPage' } };
      const finalReqs = await transformAndFilterReqs([req], ctx, input);
      const queue = await Actor.openRequestQueue(input.requestQueueId);
      await queue.addRequests(finalReqs);
    }
    await onAfterHandler(ctx);
  });

  const crawler = new CheerioCrawler({ ...input, requestHandler: router });
  crawler.run(['https://...']);
});
```

And that's far from everything -- the vanilla version still doesn't include data transforms, privacy masking, error tracking, caching, or input validation.

</details>

## Common use cases

CrawleeOne scrapers support these out of the box, all configurable via input:

| Use case                                                                  | What it does                                                    |
| ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **[Import URLs](./docs/playbook-01-import-urls.md)**                      | Load URLs from databases, datasets, or custom functions.        |
| **[Data transforms](./docs/playbook-03-results-mapping-simple.md)**       | Rename, select, limit, and reshape output without code changes. |
| **[Request filtering](./docs/playbook-06-requests-mapping-filtering.md)** | Control what gets scraped to save time and money.               |
| **[Caching](./docs/playbook-07-caching.md)**                              | Incremental scraping -- only process new entries.               |
| **[Privacy compliance](./docs/playbook-10-privacy-compliance.md)**        | Redact personal data with a single toggle.                      |
| **[Error capture](./docs/playbook-11-errors.md)**                         | Centralized error tracking across scrapers.                     |

[See all 12 use cases](./docs/use-cases.md)

## Getting started

### Installation

```sh
npm install crawlee-one
```

### For scraper developers

1. Read the [getting started guide](./docs/getting-started.md) for a full walkthrough of `crawleeOne()` and its options.
2. See [example projects](#example-projects) for real-world usage.
3. Managing multiple crawlers in one project? Use [codegen](./docs/codegen.md) to generate typed helper functions from a config file.

### For end users

Scrapers built with CrawleeOne are configurable by the end users (via Apify platform). Transform, filter, limit, and reshape scraped data and requests -- all through input fields, no code changes needed.

[User guide](./docs/user-guide.md)

![Apify actor input page](./docs/user-guide-input-ui-open.png)

## Documentation

| Document                                                        | Description                                                 |
| --------------------------------------------------------------- | ----------------------------------------------------------- |
| [Getting started](./docs/getting-started.md)                    | Developer guide with full `crawleeOne()` options reference. |
| [Features](./docs/features.md)                                  | Complete feature catalog with code examples.                |
| [Use cases](./docs/use-cases.md)                                | All 12 use cases with links to detailed guides.             |
| [Input reference](./docs/reference-input.md)                    | All available input fields.                                 |
| [Deploying to Apify](./docs/deploying-to-apify.md)              | Step-by-step Apify deployment guide.                        |
| [Codegen](./docs/codegen.md)                                    | Generate typed crawler definitions from config.             |
| [Integrations](./docs/integrations.md)                          | Custom telemetry and storage backends.                      |
| [User guide](./docs/user-guide.md)                              | Guide for end users of CrawleeOne scrapers.                 |
| [API reference](./docs/typedoc/globals.md)                      | Auto-generated TypeScript API docs.                         |
| [Crawlee & Apify overview](./docs/scraping-workflow-summary.md) | Background on how Crawlee and Apify work.                   |

## Example projects

- [SKCRIS Scraper](https://github.com/JuroOravec/apify-actor-skcris) -- Slovak research database scraper.
- [Profesia.sk Scraper](https://github.com/JuroOravec/apify-actor-profesia-sk) -- Slovak job board scraper.

## Contributing

Found a bug or have a feature request? Please [open an issue](https://github.com/jurooravec/crawlee-one/issues).

When contributing code, please fork the repo and submit a pull request.

## Supporting CrawleeOne

CrawleeOne is a labour of love. If you find it useful, you can support the project on [Buy Me a Coffee](https://www.buymeacoffee.com/jurooravec).
