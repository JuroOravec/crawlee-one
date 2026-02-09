# Codegen

For projects that manage multiple crawlers (e.g. one Playwright-based, one Cheerio-based), CrawleeOne can generate typed helper functions from a config file. This is similar to `create-react-app` -- define the structure, and the CLI scaffolds the types.

## 1. Define the crawler schema

Create a config file that describes your crawlers and their routes:

```js
// crawlee-one.config.js
module.exports = {
  version: 1,
  schema: {
    crawlers: {
      main: {
        // 'basic', 'http', 'jsdom', 'cheerio', 'playwright', 'puppeteer'
        type: 'playwright',
        routes: ['listingPage', 'detailPage'],
      },
    },
  },
};
```

YAML is also supported:

```yaml
# .crawlee-onerc.yml
version: 1
schema:
  crawlers:
    main:
      type: 'playwright'
      routes: ['listingPage', 'detailPage']
    lightweight:
      type: 'cheerio'
      routes: ['staticPage']
```

CrawleeOne uses [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig) for config loading, so you can use any of:

- `crawlee-one` property in `package.json`
- `.crawlee-onerc` (JSON or YAML)
- `.crawlee-onerc.json`, `.crawlee-onerc.yaml`, `.crawlee-onerc.yml`, `.crawlee-onerc.js`, `.crawlee-onerc.ts`, `.crawlee-onerc.mjs`, `.crawlee-onerc.cjs`
- Files inside `.config/` subdirectory
- `crawlee-one.config.js`, `crawlee-one.config.ts`, `crawlee-one.config.mjs`, `crawlee-one.config.cjs`

## 2. Generate types

```sh
npx crawlee-one generate -o ./src/__generated__/crawler.ts
```

## 3. Use generated types

Import the generated crawler functions and use them with full type safety:

```ts
import { mainCrawler } from './__generated__/crawler';

await mainCrawler({
  routes: {
    listingPage: {
      match: /example\.com\/listing/i,
      handler: (ctx) => {
        // ctx is fully typed for Playwright
        ctx.page.locator('...');
      },
    },
    detailPage: {
      match: /example\.com\/detail/i,
      handler: (ctx) => { /* ... */ },
    },
  },
});
```

## Running multiple crawlers

When some pages need browser automation and others don't, you can define multiple crawlers and run them simultaneously:

```ts
import { mainCrawler, lightweightCrawler } from './__generated__/crawler';

const mainPromise = mainCrawler({
  routes: {
    listingPage: {
      match: /example\.com\/listing/i,
      handler: async (ctx) => {
        ctx.page.locator('...');
        // Send URLs to the Cheerio crawler via a shared queue
        await ctx.pushRequests([{ url: '...' }], { requestQueueId: 'sharedQueue' });
      },
    },
    detailPage: { /* ... */ },
  },
});

const lightweightPromise = lightweightCrawler({
  input: { requestQueueId: 'sharedQueue' },
  routes: {
    staticPage: {
      match: /example\.com\/static/i,
      handler: (ctx) => {
        ctx.parseWithCheerio();
        // ...
      },
    },
  },
});

await Promise.all([mainPromise, lightweightPromise]);
```
