[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / crawleeOne

# Function: crawleeOne()

> **crawleeOne**\<`TType`, `T`\>(`args`): `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/api.ts:128](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/api.ts#L128)

## Type Parameters

### TType

`TType` *extends* `"basic"` \| `"http"` \| `"jsdom"` \| `"cheerio"` \| `"playwright"` \| `"adaptive-playwright"` \| `"puppeteer"`

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`CrawlerMeta`\<`TType`\>\[`"context"`\], `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\> = [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`CrawlerMeta`\<`TType`\>\[`"context"`\], `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

## Parameters

### args

[`CrawleeOneArgs`](../interfaces/CrawleeOneArgs.md)\<`TType`, `T`\>

## Returns

`Promise`\<`void`\>
