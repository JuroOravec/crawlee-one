[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / captureErrorWrapper

# Function: captureErrorWrapper()

> **captureErrorWrapper**\<`TIO`\>(`fn`, `options`): `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/lib/error/errorHandler.ts:77](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/error/errorHandler.ts#L77)

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
