# Code Generation

A single `crawlee-one gen` command generates everything you need for an Apify scraper -- `actor.json`, `actorspec.json`, `README.md`, and TS types.

Everything is generated from `crawlee-one.config.ts`. Each section is optional.

- **TypeScript types** -- typed crawler helpers and route definitions
- **actor.json** -- Apify actor configuration
- **actorspec.json** -- actor specification metadata
- **README.md** -- rendered README from a pluggable renderer

## 1. Define the config

Create a `crawlee-one.config.ts` file. Use `defineConfig()` for type hints:

```ts
// crawlee-one.config.ts
import { defineConfig } from 'crawlee-one';

export default defineConfig({
  version: 1,
  schema: {
    crawlers: {
      main: {
        // One of:
        // - 'basic'
        // - 'http'
        // - 'jsdom
        // - 'cheerio'
        // - 'playwright'
        // - 'puppeteer'
        type: 'playwright',
        // Routes that your scraper defines
        routes: [
          'main',
          'productList',
          'product',
        ],
      },
    },
  },
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
});
```

For Apify actors, you can also generate `actor.json`, `actorspec.json`, and a README:

```ts
import { defineConfig } from 'crawlee-one';
import { renderApifyReadme } from './src/readme.js';
import actorSpec from './src/actorspec.js';
import actorConfig from './src/config.js';

export default defineConfig({
  version: 1,
  schema: {
    crawlers: {
      /* ... */
    },
  },
  types: { outFile: './src/__generated__/crawler.ts' },
  actor: {
    config: actorConfig, // ActorConfig object
    outFile: '.actor/actor.json',
  },
  actorspec: {
    config: actorSpec, // ActorSpec object
    outFile: '.actor/actorspec.json',
  },
  readme: {
    outFile: '.actor/README.md',
    actorSpec,
    renderer: renderApifyReadme,
    input: {
      templates: {
        /* ... renderer-specific templates */
      },
    },
  },
});
```

YAML and other formats are also supported via [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig):

- `crawlee-one` property in `package.json`
- `.crawlee-onerc` (JSON or YAML)
- `.crawlee-onerc.json`, `.crawlee-onerc.yaml`, `.crawlee-onerc.yml`, `.crawlee-onerc.js`, `.crawlee-onerc.ts`, `.crawlee-onerc.mjs`, `.crawlee-onerc.cjs`
- Files inside `.config/` subdirectory
- `crawlee-one.config.js`, `crawlee-one.config.ts`, `crawlee-one.config.mjs`, `crawlee-one.config.cjs`

## 2. Generate

```sh
npx crawlee-one gen
```

With explicit config path:

```sh
npx crawlee-one gen -c ./path/to/config.ts
```

Each section (`types`, `actor`, `actorspec`, `readme`) is optional. Only the configured sections are generated.

If `outFile` is omitted, the output defaults to `.actor/` (if the directory exists) or the current directory.

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
      handler: (ctx) => {
        /* ... */
      },
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
    detailPage: {
      /* ... */
    },
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
