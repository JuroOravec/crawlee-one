[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneErrorHandlerOptions

# Interface: CrawleeOneErrorHandlerOptions\<TIO\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:327](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L327)

User-configurable options passed to the error handler

## Type Parameters

### TIO

`TIO` *extends* [`CrawleeOneIO`](CrawleeOneIO.md) = [`CrawleeOneIO`](CrawleeOneIO.md)

## Properties

### allowScreenshot?

> `optional` **allowScreenshot**: `boolean`

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:329](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L329)

***

### io?

> `optional` **io**: `TIO`

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:328](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L328)

***

### onErrorCapture()?

> `optional` **onErrorCapture**: (`input`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:331](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L331)

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

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:330](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L330)
