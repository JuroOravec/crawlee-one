[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneActorInst

# Interface: CrawleeOneActorInst\<T\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:298](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L298)

Context available while creating a Crawlee crawler/actor

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)

## Properties

### config

> **config**: [`PickPartial`](../type-aliases/PickPartial.md)\<[`CrawleeOneActorDef`](CrawleeOneActorDef.md)\<`T`\>, `"io"`\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:346](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L346)

Original config from which this actor context was created

***

### crawler

> **crawler**: `T`\[`"context"`\]\[`"crawler"`\]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:300](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L300)

The Crawlee crawler instance used by this instance of CrawleeOne

***

### handlerCtx

> **handlerCtx**: `Omit`\<`T`\[`"context"`\] & [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>, `"request"`\> & `object` \| `null`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:362](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L362)

***

### input

> **input**: `T`\[`"input"`\] \| `null`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:348](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L348)

Read-only inputs passed to the actor

***

### io

> **io**: `T`\[`"io"`\]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:357](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L357)

Instance managing communication with databases - storage & retrieval
(Dataset, RequestQueue, KeyValueStore).

This is modelled and similar to Apify's `Actor` static class.

***

### log

> **log**: `Log`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:361](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L361)

Crawlee Log instance.

***

### metamorph

> **metamorph**: [`Metamorph`](../type-aliases/Metamorph.md)

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:308](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L308)

Trigger actor metamorph, using actor's inputs as defaults.

***

### proxy?

> `optional` **proxy**: `ProxyConfiguration`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:341](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L341)

***

### pushData()

> **pushData**: \<`T`\>(`oneOrManyItems`, `options`) => `Promise`\<`any`[]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:317](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L317)

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

[`PushDataOptions`](PushDataOptions.md)\<`T`\>

#### Returns

`Promise`\<`any`[]\>

***

### pushRequests()

> **pushRequests**: \<`T`\>(`oneOrManyItems`, `options?`) => `Promise`\<`any`[]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:327](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L327)

Similar to `Actor.openRequestQueue().addRequests`, but with extra features:

- Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit.
- Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue.

#### Type Parameters

##### T

`T` *extends* `Source`

#### Parameters

##### oneOrManyItems

`T` | `T`[]

##### options?

[`PushRequestsOptions`](PushRequestsOptions.md)\<`T`\>

#### Returns

`Promise`\<`any`[]\>

***

### router

> **router**: `RouterHandler`\<`T`\[`"context"`\]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:343](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L343)

***

### routes

> **routes**: `Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](CrawleeOneRoute.md)\<`T`, [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>\>\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:344](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L344)

***

### runCrawler

> **runCrawler**: [`RunCrawler`](../type-aliases/RunCrawler.md)\<`T`\[`"context"`\]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:306](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L306)

This function wraps `crawler.run(requests, runOtions)` with additional
features:
- Optionally metamorph into another actor after the run finishes

***

### startUrls

> **startUrls**: [`CrawlerUrl`](../type-aliases/CrawlerUrl.md)[]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:339](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L339)

A list of resolved Requests to be scraped.

This list is a combination of 3 Actor inputs:
- `startUrls` - Static list of URLs to scrape.
- `startUrlsFromDataset` - From a specific field from a Dataset (e.g. "dataset123#fieldName" - Dataset: "dataset123", field: "fieldName").
- `startUrlsFromFunction` - A function that is evaulated to generate the Requests.

***

### state

> **state**: `Record`\<`string`, `unknown`\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:350](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L350)

Mutable state that is shared across setup and teardown hooks

***

### telemetry?

> `optional` **telemetry**: `T`\[`"telemetry"`\]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:359](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L359)

Instance managing telemetry like tracking errors.
