[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneErrorHandlerOptions

# Interface: CrawleeOneErrorHandlerOptions\<TIO\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:315](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L315)

User-configurable options passed to the error handler

## Type Parameters

### TIO

`TIO` *extends* [`CrawleeOneIO`](CrawleeOneIO.md) = [`CrawleeOneIO`](CrawleeOneIO.md)

## Properties

### allowScreenshot?

> `optional` **allowScreenshot**: `boolean`

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:317](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L317)

***

### io?

> `optional` **io**: `TIO`

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:316](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L316)

***

### onErrorCapture()?

> `optional` **onErrorCapture**: (`input`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:319](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L319)

#### Parameters

##### input

###### error

`Error`

###### report

[`ExtractIOReport`](../type-aliases/ExtractIOReport.md)\<`TIO`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### reportingDatasetId?

> `optional` **reportingDatasetId**: `string`

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:318](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L318)
