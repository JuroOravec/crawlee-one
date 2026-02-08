[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneActorRouterCtx

# Type alias: CrawleeOneActorRouterCtx\<T\>

> **CrawleeOneActorRouterCtx**\<`T`\>: `object`

Context passed from actor to route handlers

## Type parameters

• **T** *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

## Type declaration

### actor

> **actor**: [`CrawleeOneActorInst`](../interfaces/CrawleeOneActorInst.md)\<`T`\>

### metamorph

> **metamorph**: [`Metamorph`](Metamorph.md)

Trigger actor metamorph, using actor's inputs as defaults.

### pushData()

> **pushData**: \<`T`\>(`oneOrManyItems`, `options`) => `Promise`\<`any`[]\>

`Actor.pushData` with extra optional features:

- Limit the number of entries pushed to the Dataset based on the Actor input
- Transform and filter entries via Actor input.
- Add metadata to entries before they are pushed to Dataset.
- Set which (nested) properties are personal data optionally redact them for privacy compliance.

#### Type parameters

• **T** *extends* `Record`\<`any`, `any`\> = `Record`\<`any`, `any`\>

#### Parameters

• **oneOrManyItems**: `T` \| `T`[]

• **options**: [`PushDataOptions`](../interfaces/PushDataOptions.md)\<`T`\>

#### Returns

`Promise`\<`any`[]\>

### pushRequests()

> **pushRequests**: \<`T`\>(`oneOrManyItems`, `options`?) => `Promise`\<`any`[]\>

Similar to `Actor.openRequestQueue().addRequests`, but with extra features:

- Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit.
- Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue.

#### Type parameters

• **T** *extends* `Exclude`\<[`CrawlerUrl`](CrawlerUrl.md), `string`\>

#### Parameters

• **oneOrManyItems**: `T` \| `T`[]

• **options?**: [`PushRequestsOptions`](../interfaces/PushRequestsOptions.md)\<`T`\>

#### Returns

`Promise`\<`any`[]\>

## Source

[src/lib/actor/types.ts:75](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L75)
