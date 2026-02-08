[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / captureErrorWrapper

# Function: captureErrorWrapper()

> **captureErrorWrapper**\<`TIO`\>(`fn`, `options`): `Promise`\<`void`\>

Error handling for Crawlers as a function wrapper

By default, error reports are saved to Apify Dataset.

## Type parameters

• **TIO** *extends* [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\> = [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>

## Parameters

• **fn**

• **options**: [`CrawleeOneErrorHandlerOptions`](../interfaces/CrawleeOneErrorHandlerOptions.md)\<`TIO`\>

## Returns

`Promise`\<`void`\>

## Source

[src/lib/error/errorHandler.ts:77](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/error/errorHandler.ts#L77)
