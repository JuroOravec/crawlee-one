[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigRunOptions

# Type Alias: CrawleeOneConfigRunOptions\<TCrawlerType, TInput\>

> **CrawleeOneConfigRunOptions**\<`TCrawlerType`, `TInput`\> = `object`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:314](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L314)

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

> `optional` **crawleeOneOptions**: [`CrawleeOneConfigRunMetaOptions`](../interfaces/CrawleeOneConfigRunMetaOptions.md)

Defined in: [packages/crawlee-one/src/lib/config/types.ts:320](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L320)

***

### crawlerOptions?

> `optional` **crawlerOptions**: [`CrawlerMeta`](CrawlerMeta.md)\<`TCrawlerType`\>\[`"options"`\]

Defined in: [packages/crawlee-one/src/lib/config/types.ts:318](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L318)

***

### input?

> `optional` **input**: `TInput`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:319](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L319)
