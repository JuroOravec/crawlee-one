[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / captureErrorRouteHandler

# Function: captureErrorRouteHandler()

> **captureErrorRouteHandler**\<`T`\>(`handler`, `options`): [`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`, [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>\>

Drop-in replacement for regular request handler callback for Crawlee route
that automatically tracks errors.

By default, error reports are saved to Apify Dataset.

## Type parameters

• **T** *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`CrawlingContext`\<`JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler` \| `BasicCrawler`\<`BasicCrawlingContext`\<`Dictionary`\>\> \| `HttpCrawler`\<`InternalHttpCrawlingContext`\<`any`, `any`, `HttpCrawler`\<`any`\>\>\>, `Dictionary`\>, `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

## Parameters

• **handler**

• **options**: [`CrawleeOneErrorHandlerOptions`](../interfaces/CrawleeOneErrorHandlerOptions.md)\<`T`\[`"io"`\]\>

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

## Source

[src/lib/error/errorHandler.ts:110](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/error/errorHandler.ts#L110)
