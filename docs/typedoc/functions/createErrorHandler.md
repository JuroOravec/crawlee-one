[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / createErrorHandler

# Function: createErrorHandler()

> **createErrorHandler**\<`T`\>(`options`): `ErrorHandler`\<`T`\[`"context"`\]\>

Create an `ErrorHandler` function that can be assigned to
`failedRequestHandler` option of `BasicCrawlerOptions`.

The function saves error to a Dataset, and optionally forwards it to Sentry.

By default, error reports are saved to Apify Dataset.

## Type parameters

• **T** *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`CrawlingContext`\<`JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler` \| `BasicCrawler`\<`BasicCrawlingContext`\<`Dictionary`\>\> \| `HttpCrawler`\<`InternalHttpCrawlingContext`\<`any`, `any`, `HttpCrawler`\<`any`\>\>\>, `Dictionary`\>, `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

## Parameters

• **options**: [`CrawleeOneErrorHandlerOptions`](../interfaces/CrawleeOneErrorHandlerOptions.md)\<`T`\[`"io"`\]\> & `object`

## Returns

`ErrorHandler`\<`T`\[`"context"`\]\>

## Source

[src/lib/error/errorHandler.ts:148](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/error/errorHandler.ts#L148)
