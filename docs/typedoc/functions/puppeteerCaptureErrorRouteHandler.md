[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / puppeteerCaptureErrorRouteHandler

# Function: puppeteerCaptureErrorRouteHandler()

> **puppeteerCaptureErrorRouteHandler**\<`T`\>(...`args`): [`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`, [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>\>

Defined in: [src/lib/error/errorHandler.ts:138](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/error/errorHandler.ts#L138)

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`PuppeteerCrawlingContext`\<`Dictionary`\>, `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

## Parameters

### args

...\[(`ctx`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>, [`CrawleeOneErrorHandlerOptions`](../interfaces/CrawleeOneErrorHandlerOptions.md)\<`T`\[`"io"`\]\>\]

## Returns

[`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`, [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>\>
