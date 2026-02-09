[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneActorInst

# Interface: CrawleeOneActorInst\<T\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:289](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L289)

Context available while creating a Crawlee crawler/actor

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)

## Properties

### config

> **config**: [`PickPartial`](../type-aliases/PickPartial.md)\<[`CrawleeOneActorDef`](CrawleeOneActorDef.md)\<`T`\>, `"io"`\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:337](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L337)

Original config from which this actor context was created

***

### crawler

> **crawler**: `T`\[`"context"`\]\[`"crawler"`\]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:291](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L291)

The Crawlee crawler instance used by this instance of CrawleeOne

***

### handlerCtx

> **handlerCtx**: `Omit`\<`T`\[`"context"`\] & [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>, `"request"`\> & `object` \| `null`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:353](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L353)

***

### input

> **input**: `T`\[`"input"`\] \| `null`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:339](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L339)

Read-only inputs passed to the actor

***

### io

> **io**: `T`\[`"io"`\]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:348](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L348)

Instance managing communication with databases - storage & retrieval
(Dataset, RequestQueue, KeyValueStore).

This is modelled and similar to Apify's `Actor` static class.

***

### log

> **log**: `Log`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:352](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L352)

Crawlee Log instance.

***

### metamorph

> **metamorph**: [`Metamorph`](../type-aliases/Metamorph.md)

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:299](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L299)

Trigger actor metamorph, using actor's inputs as defaults.

***

### proxy?

> `optional` **proxy**: `ProxyConfiguration`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:332](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L332)

***

### pushData()

> **pushData**: \<`T`\>(`oneOrManyItems`, `options`) => `Promise`\<`any`[]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:308](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L308)

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

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:318](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L318)

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

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:334](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L334)

***

### routes

> **routes**: `Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](CrawleeOneRoute.md)\<`T`, [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>\>\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:335](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L335)

***

### runCrawler

> **runCrawler**: [`RunCrawler`](../type-aliases/RunCrawler.md)\<`T`\[`"context"`\]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:297](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L297)

This function wraps `crawler.run(requests, runOtions)` with additional
features:
- Optionally metamorph into another actor after the run finishes

***

### startUrls

> **startUrls**: [`CrawlerUrl`](../type-aliases/CrawlerUrl.md)[]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:330](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L330)

A list of resolved Requests to be scraped.

This list is a combination of 3 Actor inputs:
- `startUrls` - Static list of URLs to scrape.
- `startUrlsFromDataset` - From a specific field from a Dataset (e.g. "dataset123#fieldName" - Dataset: "dataset123", field: "fieldName").
- `startUrlsFromFunction` - A function that is evaulated to generate the Requests.

***

### state

> **state**: `Record`\<`string`, `unknown`\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:341](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L341)

Mutable state that is shared across setup and teardown hooks

***

### telemetry?

> `optional` **telemetry**: `T`\[`"telemetry"`\]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:350](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L350)

Instance managing telemetry like tracking errors.
