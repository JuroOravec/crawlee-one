[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / captureError

# Function: captureError()

> **captureError**\<`TIO`\>(`input`, `options`): `Promise`\<`never`\>

Error handling for CrawleeOne crawlers.

By default, error reports are saved to Apify Dataset.

See https://docs.apify.com/academy/node-js/analyzing-pages-and-fixing-errors#error-reporting

## Type parameters

• **TIO** *extends* [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\> = [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>

## Parameters

• **input**: [`CaptureErrorInput`](../type-aliases/CaptureErrorInput.md)

• **options**: [`CrawleeOneErrorHandlerOptions`](../interfaces/CrawleeOneErrorHandlerOptions.md)\<`TIO`\>

## Returns

`Promise`\<`never`\>

## Source

[src/lib/error/errorHandler.ts:33](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/error/errorHandler.ts#L33)
