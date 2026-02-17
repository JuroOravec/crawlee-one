[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigSchemaCrawler

# Interface: CrawleeOneConfigSchemaCrawler\<TInput\>

Defined in: packages/crawlee-one/src/lib/config/types.ts:235

Part of the schema that defines a single crawler.

## Type Parameters

### TInput

`TInput` = `Record`\<`string`, `unknown`\>

## Properties

### devImportPath?

> `optional` **devImportPath**: `string`

Defined in: packages/crawlee-one/src/lib/config/types.ts:261

Optional path to TS source for `crawlee-one dev` and `crawlee-one run`.

When set, loads from this path (e.g. `./src/index.ts`) so no build is needed.
When omitted, dev/run use `importPath` (built output) — build required.

The module **must** have a default export: the run function matching
`CrawleeOneConfigRun`.

***

### devInput?

> `optional` **devInput**: `TInput`

Defined in: packages/crawlee-one/src/lib/config/types.ts:265

Input overrides for `crawlee-one dev` commands.

***

### importPath?

> `optional` **importPath**: `string`

Defined in: packages/crawlee-one/src/lib/config/types.ts:251

Path to load crawler module. Required for `crawlee-one dev` and `run`.
Typically points to built output (e.g. `./dist/index.js`).

The module **must** have a default export: the run function matching
`CrawleeOneConfigRun`.

***

### input?

> `optional` **input**: `TInput`

Defined in: packages/crawlee-one/src/lib/config/types.ts:269

Input overrides for `crawlee-one run` command.

***

### routes

> **routes**: `string`[]

Defined in: packages/crawlee-one/src/lib/config/types.ts:243

***

### type

> **type**: `"basic"` \| `"http"` \| `"jsdom"` \| `"cheerio"` \| `"playwright"` \| `"adaptive-playwright"` \| `"puppeteer"`

Defined in: packages/crawlee-one/src/lib/config/types.ts:242

Crawler type - Each type is linked to a different Crawlee crawler class.
Different classes may use different technologies / stack for scraping.

E.g. type `cheerio` will use `CheerioCrawler` class.
