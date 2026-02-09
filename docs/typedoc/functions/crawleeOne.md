[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / crawleeOne

# Function: crawleeOne()

> **crawleeOne**\<`TType`, `T`\>(`args`): `Promise`\<`void`\>

Defined in: [src/api.ts:124](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/api.ts#L124)

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
