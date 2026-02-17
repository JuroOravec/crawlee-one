[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneActorInst

# Interface: CrawleeOneActorInst\<T\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:311](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L311)

Context available while creating a Crawlee crawler/actor

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)

## Properties

### config

> **config**: [`PickPartial`](../type-aliases/PickPartial.md)\<[`CrawleeOneActorDef`](CrawleeOneActorDef.md)\<`T`\>, `"io"`\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:355](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L355)

Original config from which this actor context was created

***

### crawler

> **crawler**: `T`\[`"context"`\]\[`"crawler"`\]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:313](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L313)

The Crawlee crawler instance used by this instance of CrawleeOne

***

### input

> **input**: `T`\[`"input"`\] \| `null`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:357](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L357)

Read-only inputs passed to the actor

***

### io

> **io**: `T`\[`"io"`\]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:366](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L366)

Instance managing communication with databases - storage & retrieval
(Dataset, RequestQueue, KeyValueStore).

This is modelled and similar to Apify's `Actor` static class.

***

### log

> **log**: `Log`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:370](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L370)

Crawlee Log instance.

***

### metamorph

> **metamorph**: [`Metamorph`](../type-aliases/Metamorph.md)

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:321](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L321)

Trigger actor metamorph, using actor's inputs as defaults.

***

### proxy?

> `optional` **proxy**: `ProxyConfiguration`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:350](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L350)

***

### pushRequests()

> **pushRequests**: \<`T`\>(`oneOrManyItems`, `options?`) => `Promise`\<`any`[]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:328](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L328)

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

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:352](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L352)

***

### routes

> **routes**: `Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](CrawleeOneRoute.md)\<`T`, [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>\>\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:353](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L353)

***

### runCrawler

> **runCrawler**: [`RunCrawler`](../type-aliases/RunCrawler.md)\<`T`\[`"context"`\]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:319](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L319)

This function wraps `crawler.run(requests, runOtions)` with additional
features:
- Optionally metamorph into another actor after the run finishes

***

### startUrls

> **startUrls**: [`CrawlerUrl`](../type-aliases/CrawlerUrl.md)[]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:348](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L348)

A list of resolved Requests to be scraped.

This list is a combination of 3 Actor inputs:
- `startUrls` - Static list of URLs to scrape.
- `startUrlsFromDataset` - From a specific field from a Dataset (e.g. "dataset123#fieldName" - Dataset: "dataset123", field: "fieldName").
- `startUrlsFromFunction` - A function that is evaulated to generate the Requests.

***

### state

> **state**: `Record`\<`string`, `unknown`\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:359](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L359)

Mutable state that is shared across setup and teardown hooks

***

### telemetry?

> `optional` **telemetry**: `T`\[`"telemetry"`\]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:368](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L368)

Instance managing telemetry like tracking errors.
