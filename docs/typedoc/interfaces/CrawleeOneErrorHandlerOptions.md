[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneErrorHandlerOptions

# Interface: CrawleeOneErrorHandlerOptions\<TIO\>

User-configurable options passed to the error handler

## Type parameters

• **TIO** *extends* [`CrawleeOneIO`](CrawleeOneIO.md) = [`CrawleeOneIO`](CrawleeOneIO.md)

## Properties

### allowScreenshot?

> `optional` **allowScreenshot**: `boolean`

#### Source

[src/lib/integrations/types.ts:317](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L317)

***

### io?

> `optional` **io**: `TIO`

#### Source

[src/lib/integrations/types.ts:316](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L316)

***

### onErrorCapture()?

> `optional` **onErrorCapture**: (`input`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Parameters

• **input**

• **input.error**: `Error`

• **input.report**: [`ExtractIOReport`](../type-aliases/ExtractIOReport.md)\<`TIO`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/integrations/types.ts:319](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L319)

***

### reportingDatasetId?

> `optional` **reportingDatasetId**: `string`

#### Source

[src/lib/integrations/types.ts:318](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L318)
