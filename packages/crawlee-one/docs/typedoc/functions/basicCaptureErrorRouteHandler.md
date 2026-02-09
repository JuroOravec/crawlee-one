[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / basicCaptureErrorRouteHandler

# Function: basicCaptureErrorRouteHandler()

> **basicCaptureErrorRouteHandler**\<`T`\>(...`args`): [`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`, [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>\>

Defined in: [packages/crawlee-one/src/lib/error/errorHandler.ts:133](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/error/errorHandler.ts#L133)

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`BasicCrawlingContext`\<`Dictionary`\>, `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

## Parameters

### args

...\[(`ctx`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>, [`CrawleeOneErrorHandlerOptions`](../interfaces/CrawleeOneErrorHandlerOptions.md)\<`T`\[`"io"`\]\>\]

## Returns

[`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`, [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>\>
