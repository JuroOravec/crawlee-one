[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneRouteHandlerCtxExtras

# Type Alias: CrawleeOneRouteHandlerCtxExtras\<T\>

> **CrawleeOneRouteHandlerCtxExtras**\<`T`\> = `object`

Defined in: [packages/crawlee-one/src/lib/context/types.ts:78](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L78)

Context passed from CrawleeOne to route handlers

## Type Parameters

### T

`T` _extends_ [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md)

## Properties

### \_addRequests()

> **\_addRequests**: (`requestsLike`, `options?`) => `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:85](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L85)

Crawlee's original addRequests. Use when you need raw behavior without transforms/filters.

#### Parameters

##### requestsLike

(`string` \| `object`)[]

##### options?

`object`

#### Returns

`Promise`\<`void`\>

---

### \_pushData()

> **\_pushData**: (`data`, `datasetIdOrName?`) => `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:83](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L83)

Crawlee's original pushData. Use when you need raw behavior without transforms/privacy.

#### Parameters

##### data

`object` | `object`[]

##### datasetIdOrName?

`string`

#### Returns

`Promise`\<`void`\>

---

### addRequests()

> **addRequests**: \<`T`\>(`oneOrManyItems`, `options?`) => `Promise`\<`any`[]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:104](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L104)

Similar to `Actor.openRequestQueue().addRequests`, but with extra features:

- Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit.
- Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue.

#### Type Parameters

##### T

`T` _extends_ `Exclude`\<[`CrawlerUrl`](CrawlerUrl.md), `string`\>

#### Parameters

##### oneOrManyItems

`T` | `T`[]

##### options?

[`AddRequestsOptions`](../interfaces/AddRequestsOptions.md)\<`T`\>

#### Returns

`Promise`\<`any`[]\>

---

### extractWithLLM()

> **extractWithLLM**: \<`T`\>(`opts`) => `Promise`\<[`LlmExtractionResult`](../interfaces/LlmExtractionResult.md)\<`T`\> \| `null`\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:115](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L115)

Two-phase LLM extraction:

- First pass defers to LLM queue and reclaims;
- Second pass returns the extracted object from KVS.

Returns `null` on first pass (caller should return). Returns the result on second pass.

#### Type Parameters

##### T

`T`

#### Parameters

##### opts

[`ExtractWithLlmAsyncOptions`](../interfaces/ExtractWithLlmAsyncOptions.md)\<`T`\>

#### Returns

`Promise`\<[`LlmExtractionResult`](../interfaces/LlmExtractionResult.md)\<`T`\> \| `null`\>

---

### extractWithLLMSync()

> **extractWithLLMSync**: \<`T`\>(`opts`) => `Promise`\<[`LlmExtractionResult`](../interfaces/LlmExtractionResult.md)\<`T`\>\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:123](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L123)

Call LLM directly (no queue/KVS). Blocks until extraction completes.

Use when deferral is not needed (e.g. few URLs, dev flows).

#### Type Parameters

##### T

`T`

#### Parameters

##### opts

[`ExtractWithLlmSyncOptions`](../interfaces/ExtractWithLlmSyncOptions.md)\<`T`\>

#### Returns

`Promise`\<[`LlmExtractionResult`](../interfaces/LlmExtractionResult.md)\<`T`\>\>

---

### metamorph

> **metamorph**: [`Metamorph`](Metamorph.md)

Defined in: [packages/crawlee-one/src/lib/context/types.ts:81](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L81)

Trigger actor metamorph, using actor's inputs as defaults.

---

### one

> **one**: [`CrawleeOneContext`](../interfaces/CrawleeOneContext.md)\<`T`\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:79](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L79)

---

### pushData()

> **pushData**: \<`T`\>(`oneOrManyItems`, `options`) => `Promise`\<`any`[]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:94](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L94)

`Actor.pushData` with extra optional features:

- Limit the number of entries pushed to the Dataset based on the Actor input
- Transform and filter entries via Actor input.
- Add metadata to entries before they are pushed to Dataset.
- Set which (nested) properties are personal data optionally redact them for privacy compliance.

#### Type Parameters

##### T

`T` _extends_ `Record`\<`any`, `any`\> = `Record`\<`any`, `any`\>

#### Parameters

##### oneOrManyItems

`T` | `T`[]

##### options

[`PushDataOptions`](../interfaces/PushDataOptions.md)\<`T`\>

#### Returns

`Promise`\<`any`[]\>
