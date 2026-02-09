[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneActorRouterCtx

# Type Alias: CrawleeOneActorRouterCtx\<T\>

> **CrawleeOneActorRouterCtx**\<`T`\> = `object`

Defined in: packages/crawlee-one/src/lib/actor/types.ts:75

Context passed from actor to route handlers

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

## Properties

### actor

> **actor**: [`CrawleeOneActorInst`](../interfaces/CrawleeOneActorInst.md)\<`T`\>

Defined in: packages/crawlee-one/src/lib/actor/types.ts:76

***

### metamorph

> **metamorph**: [`Metamorph`](Metamorph.md)

Defined in: packages/crawlee-one/src/lib/actor/types.ts:78

Trigger actor metamorph, using actor's inputs as defaults.

***

### pushData()

> **pushData**: \<`T`\>(`oneOrManyItems`, `options`) => `Promise`\<`any`[]\>

Defined in: packages/crawlee-one/src/lib/actor/types.ts:87

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

***

### pushRequests()

> **pushRequests**: \<`T`\>(`oneOrManyItems`, `options?`) => `Promise`\<`any`[]\>

Defined in: packages/crawlee-one/src/lib/actor/types.ts:97

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

[`PushRequestsOptions`](../interfaces/PushRequestsOptions.md)\<`T`\>

#### Returns

`Promise`\<`any`[]\>
