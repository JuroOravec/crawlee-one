[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / captureError

# Function: captureError()

> **captureError**\<`TIO`\>(`input`, `options`): `Promise`\<`never`\>

Defined in: [packages/crawlee-one/src/lib/error/errorHandler.ts:33](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/error/errorHandler.ts#L33)

Error handling for CrawleeOne crawlers.

By default, error reports are saved to Apify Dataset.

See https://docs.apify.com/academy/node-js/analyzing-pages-and-fixing-errors#error-reporting

## Type Parameters

### TIO

`TIO` *extends* [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\> = [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>

## Parameters

### input

[`CaptureErrorInput`](../type-aliases/CaptureErrorInput.md)

### options

[`CrawleeOneErrorHandlerOptions`](../interfaces/CrawleeOneErrorHandlerOptions.md)\<`TIO`\>

## Returns

`Promise`\<`never`\>
