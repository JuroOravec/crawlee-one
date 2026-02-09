[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / captureErrorWrapper

# Function: captureErrorWrapper()

> **captureErrorWrapper**\<`TIO`\>(`fn`, `options`): `Promise`\<`void`\>

Defined in: [src/lib/error/errorHandler.ts:77](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/error/errorHandler.ts#L77)

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
