[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / captureErrorRouteHandler

# Function: captureErrorRouteHandler()

> **captureErrorRouteHandler**\<`T`\>(`handler`, `options`): [`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`, [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>\>

Defined in: [packages/crawlee-one/src/lib/error/errorHandler.ts:110](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/error/errorHandler.ts#L110)

Drop-in replacement for regular request handler callback for Crawlee route
that automatically tracks errors.

By default, error reports are saved to Apify Dataset.

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`CrawlingContext`\<`JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler` \| `BasicCrawler`\<`BasicCrawlingContext`\<`Dictionary`\>\> \| `HttpCrawler`\<`InternalHttpCrawlingContext`\<`any`, `any`, `HttpCrawler`\<`any`\>\>\>, `Dictionary`\>, `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

## Parameters

### handler

(`ctx`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

### options

[`CrawleeOneErrorHandlerOptions`](../interfaces/CrawleeOneErrorHandlerOptions.md)\<`T`\[`"io"`\]\>

## Returns

[`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`, [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>\>

## Example

```ts
router.addDefaultHandler(
 captureErrorRouteHandler(async (ctx) => {
   const { page, crawler } = ctx;
   const url = page.url();
   ...
 })
);
```
