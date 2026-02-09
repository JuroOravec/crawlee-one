[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / httpCaptureErrorRouteHandler

# Function: httpCaptureErrorRouteHandler()

> **httpCaptureErrorRouteHandler**\<`T`\>(...`args`): [`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`, [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>\>

Defined in: [packages/crawlee-one/src/lib/error/errorHandler.ts:134](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/error/errorHandler.ts#L134)

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`HttpCrawlingContext`\<`any`, `any`\>, `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

## Parameters

### args

...\[(`ctx`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>, [`CrawleeOneErrorHandlerOptions`](../interfaces/CrawleeOneErrorHandlerOptions.md)\<`T`\[`"io"`\]\>\]

## Returns

[`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`, [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>\>
