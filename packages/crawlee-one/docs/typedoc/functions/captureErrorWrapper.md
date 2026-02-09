[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / captureErrorWrapper

# Function: captureErrorWrapper()

> **captureErrorWrapper**\<`TIO`\>(`fn`, `options`): `Promise`\<`void`\>

Defined in: packages/crawlee-one/src/lib/error/errorHandler.ts:77

Error handling for Crawlers as a function wrapper

By default, error reports are saved to Apify Dataset.

## Type Parameters

### TIO

`TIO` *extends* [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\> = [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>

## Parameters

### fn

(`input`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

### options

[`CrawleeOneErrorHandlerOptions`](../interfaces/CrawleeOneErrorHandlerOptions.md)\<`TIO`\>

## Returns

`Promise`\<`void`\>
