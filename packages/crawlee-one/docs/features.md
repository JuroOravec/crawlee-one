# Features

CrawleeOne extends [Crawlee](https://crawlee.dev/) with production-ready capabilities that you would otherwise build yourself. Here is the full catalog.

## Extract data with AI.

When you come across custom layouts or inconsistent markup, use an LLM to extract structured data from HTML. Use `extractWithLLM()` inside your scraper. Configure LLM with the `llmApiKey`, `llmProvider`, and `llmModel` actor inputs.

```ts
handler: async (ctx) => {
  const { pushData, extractWithLLM } = ctx;
  const result = await extractWithLLM({
    schema: jobOfferSchema,
    systemPrompt: 'Extract job details from this HTML. Use null for missing values.',
  });
  if (result == null) return;  // result not yet ready
  await pushData(result.object);
}
```

See the [LLM extraction guide](./llm-extraction-guide.md).

**LLM model comparison** — Compare multiple models (gpt-4o, gpt-5-mini, claude, etc.) on the same URLs to find the best accuracy, cost, and speed. See the [LLM compare guide](./llm-compare-guide.md).

## One function. Full crawler.

Replace 100+ lines of Actor + Router + input boilerplate with a single `crawleeOne()` call. CrawleeOne handles initialization, input resolution, routing, error handling, and teardown.

```ts
import { crawleeOne } from 'crawlee-one';

await crawleeOne({
  type: 'cheerio',
  routes: {
    mainPage: {
      match: /example\.com\/home/i,
      handler: async (ctx) => {
        const { $, pushData, addRequests } = ctx;
        await pushData([{ title: $('h1').text() }], { privacyMask: { author: true } });
        await addRequests([{ url: 'https://example.com/page/2' }]);
      },
    },
  },
});
```

## Switch strategies, not code.

Go from `cheerio` to `playwright` by changing one prop. Your route handlers stay the same.

```ts
// HTTP-only scraping
await crawleeOne({
  type: 'cheerio',
  routes: {
    /* ... */
  },
});

// Need JavaScript rendering? Change one line:
await crawleeOne({
  type: 'playwright',
  routes: {
    /* ... */
  },
});
```

Available types: `basic`, `http`, `jsdom`, `cheerio`, `playwright`, `puppeteer`.

## Reshape output without touching scraper code.

End users (via Apify platform) can filter, transform, rename, and limit results via input config -- no code changes needed. This covers most common ETL needs directly inside the scraper.

**Simple transforms** -- select, rename, and limit fields:

```json
{
  "outputPickFields": ["name", "email", "profileUrl"],
  "outputRenameFields": { "photoUrl": "media.photos[0].data.photoUrl" },
  "outputMaxEntries": 500
}
```

**Advanced transforms** -- custom functions for enrichment, aggregation, and more:

```json
{
  "outputTransform": "async (entry, { sendRequest }) => { const enriched = await sendRequest.get('https://api.example.com/' + entry.id).json(); return { ...entry, ...enriched }; }"
}
```

**Filtering** -- include or exclude entries based on conditions:

```json
{
  "outputFilter": "(entry) => entry.rating > 4.0"
}
```

See the [use cases](./use-cases.md) for detailed examples.

## Match routes by URL or content.

Regex, functions, or both. CrawleeOne auto-routes unlabeled requests to the right handler -- no manual label assignment needed.

```ts
routes: {
  listingPage: {
    match: /example\.com\/listing/i,
    handler: async (ctx) => { /* ... */ },
  },
  detailPage: {
    match: (url, ctx) => url.includes('/detail/') && ctx.$('.product').length > 0,
    handler: async (ctx) => { /* ... */ },
  },
}
```

Matchers can be async and receive the full crawler context, so you can match based on page content, not just URLs.

## Privacy compliance, built in.

Mark fields as personal data. CrawleeOne redacts them automatically when `includePersonalData` is off. This is designed to help with GDPR compliance from the start.

```ts
await pushData(data, {
  privacyMask: { name: true, email: true },
});
```

When `includePersonalData` is `false`, the output becomes:

```json
{
  "name": "<Redacted property \"name\">",
  "email": "<Redacted property \"email\">",
  "category": "electronics"
}
```

## Incremental scraping.

Only process entries you haven't seen before. Built-in cache with KeyValueStore tracks what's been scraped across runs.

```json
{
  "outputCacheStoreId": "my-cache",
  "outputCachePrimaryKeys": ["id"],
  "outputCacheActionOnResult": "add"
}
```

Combine with request filtering to stop scraping entirely once you hit previously-seen entries -- ideal for time-sensitive data like job listings or classifieds.

## Errors captured, not lost.

Failed requests are saved to a dataset automatically. Errors from multiple scrapers can be pooled into a single dataset for centralized monitoring.

```json
{
  "errorReportingDatasetId": "REPORTING"
}
```

Plug in Sentry for telemetry with one line:

```ts
import { createSentryTelemetry } from 'crawlee-one/sentry';

await crawleeOne({
  telemetry: createSentryTelemetry({ dsn: '...' }),
  // ...
});
```

Or implement the `CrawleeOneTelemetry` interface for any other error tracking service.

## Fully typed out of the box.

Route handlers, context objects, `pushData`, and `addRequests` are all fully typed based on the crawler `type` you choose. No extra setup needed -- TypeScript knows whether you have `ctx.page` (Playwright) or `ctx.$` (Cheerio).

```ts
await crawleeOne({
  type: 'playwright',
  routes: {
    detailPage: {
      match: /example\.com\/detail/i,
      handler: async (ctx) => {
        // ctx is typed as PlaywrightCrawlingContext + CrawleeOne extensions
        await ctx.page.locator('.title').textContent();
        await ctx.pushData(
          [
            {
              /* ... */
            },
          ],
          { privacyMask: { name: true } }
        );
      },
    },
  },
});
```

## Request filtering and transformation.

Control what gets scraped before scraping it. Filter and transform requests to avoid wasting time and money on unwanted pages.

```json
{
  "requestFilter": "(request, { state }) => state.requestCount++ < 20",
  "requestMaxEntries": 100
}
```

## Remote input and config.

Load starting URLs from databases or Apify Datasets. Import scraper configuration from source control or remote endpoints.

```json
{
  "startUrlsFromDataset": "AmazonBooks2024#url",
  "inputExtendUrl": "https://raw.githubusercontent.com/org/project/main/scraper-config.json"
}
```

Or use custom functions for full control:

```json
{
  "startUrlsFromFunction": "async ({ Actor }) => { const ds = await Actor.openDataset('products'); const data = await ds.getData(); return data.items.map(item => item.url); }"
}
```

## Data pipelines with metamorph.

Chain scrapers together. When one finishes, it triggers the next -- with shared access to the same datasets.

```json
{
  "metamorphActorId": "org/data-uploader",
  "metamorphActorBuild": "latest",
  "metamorphActorInput": { "targetDb": "production" }
}
```

## Pluggable storage backend.

CrawleeOne uses Apify by default, but the `CrawleeOneIO` interface lets you swap in any storage backend -- send data to your own API, a database, or any other service.

```ts
await crawleeOne({
  io: createCustomIO('https://my-api.example.com'),
  // ...
});
```

## Zod-powered input validation.

Embed Zod schemas directly on your Field objects and pass them as `inputFields`. CrawleeOne validates actor input automatically before the crawler starts -- no manual validation boilerplate needed.

```ts
import { z } from 'zod';
import { createStringField } from 'apify-actor-config';

const inputFields = {
  targetUrl: createStringField({
    title: 'Target URL',
    type: 'string',
    description: 'URL to scrape',
    editor: 'textfield',
    schema: z.string().url(),
  }),
};

await crawleeOne({
  inputFields,
  // ...
});
```

## Multi-crawler orchestration.

Run multiple crawlers side-by-side in a single process until all their queues drain. Use this when crawlers exchange work between each other. Focus on the business logic and let CrawleeOne handle the orchestration.

**Use `orchestrate` inside the `onReady` callback** so it runs when the crawler would normally start. 

Simply define individual crawlers and pass them to the `orchestrate()` function:

```ts
import { crawleeOne, orchestrate, createLlmCrawler, type OrchestratedCrawler } from 'crawlee-one';

await crawleeOne(
  {
    type: 'cheerio',
    routes: { ... },
  },
  async (context) => {
    // Define cralwers to run side by side
    const llmCrawler = await createLlmCrawler({
      requestQueueId: context.input?.llmRequestQueueId ?? 'llm',
      keyValueStoreId: context.input?.llmKeyValueStoreId ?? 'llm',
      keepAlive: true,
    });

    // Main crawler - pass startUrls on first run
    let urlsToPass = context.startUrls;
    const mainRun = async () => {
      await context.crawler.run(context.startUrls);
      urlsToPass = [];
    };

    const crawlers: OrchestratedCrawler[] = [
      {
        // Runs until all requests are processed, then stops by itself.
        crawler: { run: mainRun, stop: () => {} },
        queueId: context.input?.requestQueueId,
        isKeepAlive: false,
      },
      {
        // Never stops, even when there are no requests in the queue.
        crawler: llmCrawler,
        queueId: 'llm',
        isKeepAlive: true,
      },
    ];

    await orchestrate({ context, crawlers, checkIntervalMs: 5000 });
  }
);
```

CrawleeOne wires this pattern automatically when LLM extraction is configured (`llmApiKey`, `llmProvider`, `llmModel`), so you typically use `orchestrate` only for custom multi-crawler setups.

## Hook system.

Extend the crawler lifecycle with hooks: `onBeforeHandler`, `onAfterHandler`, `validateInput`. Pass `onReady` as the second argument to `crawleeOne()` for custom initialization.

```ts
await crawleeOne({
  hooks: {
    validateInput: (input) => {
      if (input?.mode === 'full' && !input?.apiKey) {
        throw new Error('apiKey is required in full mode');
      }
    },
    onBeforeHandler: (ctx) => {
      ctx.log.info('Processing:', ctx.request.url);
    },
    onAfterHandler: (ctx) => {
      /* cleanup */
    },
  },
  // ...
});
```

## Crawler settings exposed as input.

Concurrency, retries, timeouts, rate limits -- all configurable via input without code changes. Users can tune performance without redeploying.

```json
{
  "minConcurrency": 1,
  "maxConcurrency": 10,
  "maxRequestRetries": 5,
  "requestHandlerTimeoutSecs": 3600
}
```

## Request batching.

For browser-based crawlers (Playwright, Puppeteer), process multiple requests in a single browser instance to reduce overhead.

```json
{
  "batchSize": 20,
  "batchWaitSecs": 1.5
}
```

## Unified code generation.

A single `crawlee-one gen` command generates everything you need for an Apify scraper -- `actor.json`, `actorspec.json`, `README.md`, and TS types.

Everything is generated from `crawlee-one.config.ts`. Each section is optional.

```ts
// crawlee-one.config.ts
import { defineConfig, defineCrawler } from 'crawlee-one';
import type { ActorInput } from './src/config.js';

import actorSpec from './src/metadata.js';
import actorConfig from './src/config.js';
import { readmeInput, readmeRenderer } from './src/readme.js';

export default defineConfig({
  version: 1,
  schema: {
    crawlers: {
      amazon: defineCrawler<Partial<ActorInput>>({
        type: 'playwright',
        routes: ['main', 'productList', 'product'],
      }),
    },
  },
  generate: {
    // Generates TS shims
    types: {
      outFile: './src/__generated__/crawler.ts',
    },
    // Generates Apify's `actor.json`
    actor: {
      config: actorConfig,
      outFile: '.actor/actor.json',
    },
    // Generates crawler metadata `actorspec.json`
    actorspec: {
      config: actorSpec,
      outFile: '.actor/actorspec.json',
    },
    // Generates README for the scraper's Apify page
    readme: {
      actorSpec,
      renderer: renderer,
      input: readmeRenderer,
    },
  },
});
```

To use the TypeScript types, import them like this:

```ts
// Import as [name]Crawler
import { amazonCrawler } from './__generated__/crawler';

// amazonCrawler is automatically typed to use Playwright
// in the route handlers
await amazonCrawler({
  routes: {
    // amazonCrawler allows only recognized
    // routes - main, productList, product
    productList: {
      match: /amazon\.com\/listing/i,
      handler: (ctx) => {
        ctx.page.locator('...');
      },
    },
    product: {
      /* ... */
    },
  },
});
```

See the [codegen guide](./codegen.md) for details.

## Testing utilities.

// TODO REVIEW AND ADD ACTUAL EXAMPLES.

Mock the Apify Actor environment for unit and integration tests. Includes helpers for mock datasets, request queues, and key-value stores.

```ts
import { setupMockApifyActor, runCrawlerTest } from 'crawlee-one';
```
