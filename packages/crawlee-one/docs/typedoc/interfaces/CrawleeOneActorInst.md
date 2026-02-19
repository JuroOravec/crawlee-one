[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneActorInst

# Interface: CrawleeOneActorInst\<T\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:316](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L316)

Context available while creating a Crawlee crawler/actor

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)

## Properties

### config

> **config**: [`PickPartial`](../type-aliases/PickPartial.md)\<[`CrawleeOneActorDef`](CrawleeOneActorDef.md)\<`T`\>, `"io"`\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:360](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L360)

Original config from which this actor context was created

***

### crawler

> **crawler**: `T`\[`"context"`\]\[`"crawler"`\]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:318](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L318)

The Crawlee crawler instance used by this instance of CrawleeOne

***

### input

> **input**: `T`\[`"input"`\] \| `null`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:362](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L362)

Read-only inputs passed to the actor

***

### io

> **io**: `T`\[`"io"`\]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:371](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L371)

Instance managing communication with databases - storage & retrieval
(Dataset, RequestQueue, KeyValueStore).

This is modelled and similar to Apify's `Actor` static class.

***

### log

> **log**: `Log`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:375](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L375)

Crawlee Log instance.

***

### metamorph

> **metamorph**: [`Metamorph`](../type-aliases/Metamorph.md)

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:326](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L326)

Trigger actor metamorph, using actor's inputs as defaults.

***

### proxy?

> `optional` **proxy**: `ProxyConfiguration`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:355](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L355)

***

### pushRequests()

> **pushRequests**: \<`T`\>(`oneOrManyItems`, `options?`) => `Promise`\<`any`[]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:333](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L333)

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

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:357](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L357)

***

### routes

> **routes**: `Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](CrawleeOneRoute.md)\<`T`, [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>\>\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:358](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L358)

***

### runCrawler

> **runCrawler**: [`RunCrawler`](../type-aliases/RunCrawler.md)\<`T`\[`"context"`\]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:324](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L324)

This function wraps `crawler.run(requests, runOtions)` with additional
features:
- Optionally metamorph into another actor after the run finishes

***

### startUrls

> **startUrls**: [`CrawlerUrl`](../type-aliases/CrawlerUrl.md)[]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:353](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L353)

A list of resolved Requests to be scraped.

This list is a combination of 3 Actor inputs:
- `startUrls` - Static list of URLs to scrape.
- `startUrlsFromDataset` - From a specific field from a Dataset (e.g. "dataset123#fieldName" - Dataset: "dataset123", field: "fieldName").
- `startUrlsFromFunction` - A function that is evaulated to generate the Requests.

***

### state

> **state**: `Record`\<`string`, `unknown`\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:364](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L364)

Mutable state that is shared across setup and teardown hooks

***

### telemetry?

> `optional` **telemetry**: `T`\[`"telemetry"`\]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:373](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L373)

Instance managing telemetry like tracking errors.
