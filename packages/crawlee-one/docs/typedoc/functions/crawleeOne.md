[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / crawleeOne

# Function: crawleeOne()

> **crawleeOne**\<`TType`, `T`\>(`args`, `options?`): `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/api.ts:139](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/api.ts#L139)

## Type Parameters

### TType

`TType` *extends* `"basic"` \| `"http"` \| `"jsdom"` \| `"cheerio"` \| `"playwright"` \| `"adaptive-playwright"` \| `"puppeteer"`

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<[`CrawlerMeta`](../type-aliases/CrawlerMeta.md)\<`TType`\>\[`"context"`\], `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\> = [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<[`CrawlerMeta`](../type-aliases/CrawlerMeta.md)\<`TType`\>\[`"context"`\], `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

## Parameters

### args

[`CrawleeOneArgs`](../interfaces/CrawleeOneArgs.md)\<`TType`, `T`\>

### options?

[`CrawleeOneOptions`](../interfaces/CrawleeOneOptions.md)

## Returns

`Promise`\<`void`\>
