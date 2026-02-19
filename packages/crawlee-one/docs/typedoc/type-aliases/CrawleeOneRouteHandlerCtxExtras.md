[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneRouteHandlerCtxExtras

# Type Alias: CrawleeOneRouteHandlerCtxExtras\<T\>

> **CrawleeOneRouteHandlerCtxExtras**\<`T`\> = `object`

Defined in: [packages/crawlee-one/src/lib/context/types.ts:77](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L77)

Context passed from CrawleeOne to route handlers

## Type Parameters

### T

`T` *extends* [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md)

## Properties

### \_addRequests()

> **\_addRequests**: (`requestsLike`, `options?`) => `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:84](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L84)

Crawlee's original addRequests. Use when you need raw behavior without transforms/filters.

#### Parameters

##### requestsLike

(`string` \| `object`)[]

##### options?

`object`

#### Returns

`Promise`\<`void`\>

***

### \_pushData()

> **\_pushData**: (`data`, `datasetIdOrName?`) => `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:82](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L82)

Crawlee's original pushData. Use when you need raw behavior without transforms/privacy.

#### Parameters

##### data

`object` | `object`[]

##### datasetIdOrName?

`string`

#### Returns

`Promise`\<`void`\>

***

### addRequests()

> **addRequests**: \<`T`\>(`oneOrManyItems`, `options?`) => `Promise`\<`any`[]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:103](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L103)

Similar to `Actor.openRequestQueue().addRequests`, but with extra features:

- Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit.
- Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue.

#### Type Parameters

##### T

`T` *extends* `Exclude`\<[`CrawlerUrl`](CrawlerUrl.md), `string`\>

#### Parameters

##### oneOrManyItems

`T` | `T`[]

##### options?

[`AddRequestsOptions`](../interfaces/AddRequestsOptions.md)\<`T`\>

#### Returns

`Promise`\<`any`[]\>

***

### extractWithLLM()

> **extractWithLLM**: \<`T`\>(`opts`) => `Promise`\<[`LlmExtractionResult`](../interfaces/LlmExtractionResult.md)\<`T`\> \| `null`\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:114](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L114)

Two-phase LLM extraction:
- First pass defers to LLM queue and reclaims;
- Second pass returns the extracted object from KVS.

Returns `null` on first pass (caller should return). Returns the result on second pass.

#### Type Parameters

##### T

`T`

#### Parameters

##### opts

[`ExtractWithLlmScopedOptions`](../interfaces/ExtractWithLlmScopedOptions.md)\<`T`\>

#### Returns

`Promise`\<[`LlmExtractionResult`](../interfaces/LlmExtractionResult.md)\<`T`\> \| `null`\>

***

### metamorph

> **metamorph**: [`Metamorph`](Metamorph.md)

Defined in: [packages/crawlee-one/src/lib/context/types.ts:80](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L80)

Trigger actor metamorph, using actor's inputs as defaults.

***

### one

> **one**: [`CrawleeOneContext`](../interfaces/CrawleeOneContext.md)\<`T`\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:78](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L78)

***

### pushData()

> **pushData**: \<`T`\>(`oneOrManyItems`, `options`) => `Promise`\<`any`[]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:93](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L93)

`Actor.pushData` with extra optional features:

- Limit the number of entries pushed to the Dataset based on the Actor input
- Transform and filter entries via Actor input.
- Add metadata to entries before they are pushed to Dataset.
- Set which (nested) properties are personal data optionally redact them for privacy compliance.

#### Type Parameters

##### T

`T` *extends* `Record`\<`any`, `any`\> = `Record`\<`any`, `any`\>

#### Parameters

##### oneOrManyItems

`T` | `T`[]

##### options

[`PushDataOptions`](../interfaces/PushDataOptions.md)\<`T`\>

#### Returns

`Promise`\<`any`[]\>
