[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneConfigSchemaCrawler

# Interface: CrawleeOneConfigSchemaCrawler\<TInput\>

Defined in: [packages/crawlee-one/src/lib/config/types.ts:260](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L260)

Part of the schema that defines a single crawler.

## Type Parameters

### TInput

`TInput` = `Record`\<`string`, `unknown`\>

## Properties

### devImportPath?

> `optional` **devImportPath**: `string`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:286](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L286)

Optional path to TS source for `crawlee-one dev` and `crawlee-one run`.

When set, loads from this path (e.g. `./src/index.ts`) so no build is needed.
When omitted, dev/run use `importPath` (built output) — build required.

The module **must** have a default export: the run function matching
`CrawleeOneConfigRun`.

---

### devInput?

> `optional` **devInput**: `TInput`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:290](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L290)

Input overrides for `crawlee-one dev` commands.

---

### importPath?

> `optional` **importPath**: `string`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:276](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L276)

Path to load crawler module. Required for `crawlee-one dev` and `run`.
Typically points to built output (e.g. `./dist/index.js`).

The module **must** have a default export: the run function matching
`CrawleeOneConfigRun`.

---

### input?

> `optional` **input**: `TInput`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:294](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L294)

Input overrides for `crawlee-one run` command.

---

### routes

> **routes**: `string`[]

Defined in: [packages/crawlee-one/src/lib/config/types.ts:268](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L268)

---

### type

> **type**: `"basic"` \| `"http"` \| `"jsdom"` \| `"cheerio"` \| `"playwright"` \| `"adaptive-playwright"` \| `"puppeteer"`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:267](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L267)

Crawler type - Each type is linked to a different Crawlee crawler class.
Different classes may use different technologies / stack for scraping.

E.g. type `cheerio` will use `CheerioCrawler` class.
