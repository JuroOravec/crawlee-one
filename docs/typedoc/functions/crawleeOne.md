[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / crawleeOne

# Function: crawleeOne()

> **crawleeOne**\<`TType`, `T`\>(`args`): `Promise`\<`void`\>

## Type parameters

• **TType** *extends* `"basic"` \| `"http"` \| `"jsdom"` \| `"cheerio"` \| `"playwright"` \| `"adaptive-playwright"` \| `"puppeteer"`

• **T** *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`CrawlerMeta`\<`TType`\>\[`"context"`\], `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\> = [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`CrawlerMeta`\<`TType`\>\[`"context"`\], `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

## Parameters

• **args**: [`CrawleeOneArgs`](../interfaces/CrawleeOneArgs.md)\<`TType`, `T`\>

## Returns

`Promise`\<`void`\>

## Source

[src/api.ts:124](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/api.ts#L124)
