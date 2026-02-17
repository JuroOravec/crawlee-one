[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigRunOptions

# Type Alias: CrawleeOneConfigRunOptions\<TCrawlerType, TInput\>

> **CrawleeOneConfigRunOptions**\<`TCrawlerType`, `TInput`\> = `object`

Defined in: packages/crawlee-one/src/lib/config/types.ts:278

Options passed to the scraper's run function by `crawlee-one run` and `crawlee-one dev`.

## Type Parameters

### TCrawlerType

`TCrawlerType` *extends* [`CrawlerType`](CrawlerType.md) = [`CrawlerType`](CrawlerType.md)

Crawler type (e.g. 'cheerio', 'playwright'); derives `crawlerOptions`.

### TInput

`TInput` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

Actor input shape; types the `input` field.

## Properties

### crawleeOneOptions?

> `optional` **crawleeOneOptions**: [`CrawleeOneOptions`](../interfaces/CrawleeOneOptions.md)

Defined in: packages/crawlee-one/src/lib/config/types.ts:284

***

### crawlerOptions?

> `optional` **crawlerOptions**: [`CrawlerMeta`](CrawlerMeta.md)\<`TCrawlerType`\>\[`"options"`\]

Defined in: packages/crawlee-one/src/lib/config/types.ts:282

***

### input?

> `optional` **input**: `TInput`

Defined in: packages/crawlee-one/src/lib/config/types.ts:283
