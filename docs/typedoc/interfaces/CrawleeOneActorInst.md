[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneActorInst

# Interface: CrawleeOneActorInst\<T\>

Context available while creating a Crawlee crawler/actor

## Type parameters

• **T** *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)

## Properties

### config

> **config**: [`PickPartial`](../type-aliases/PickPartial.md)\<[`CrawleeOneActorDef`](CrawleeOneActorDef.md)\<`T`\>, `"io"`\>

Original config from which this actor context was created

#### Source

[src/lib/actor/types.ts:337](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L337)

***

### crawler

> **crawler**: `T`\[`"context"`\]\[`"crawler"`\]

The Crawlee crawler instance used by this instance of CrawleeOne

#### Source

[src/lib/actor/types.ts:291](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L291)

***

### handlerCtx

> **handlerCtx**: `null` \| `Omit`\<`T`\[`"context"`\] & [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>, `"request"`\> & `object`

#### Source

[src/lib/actor/types.ts:353](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L353)

***

### input

> **input**: `null` \| `T`\[`"input"`\]

Read-only inputs passed to the actor

#### Source

[src/lib/actor/types.ts:339](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L339)

***

### io

> **io**: `T`\[`"io"`\]

Instance managing communication with databases - storage & retrieval
(Dataset, RequestQueue, KeyValueStore).

This is modelled and similar to Apify's `Actor` static class.

#### Source

[src/lib/actor/types.ts:348](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L348)

***

### log

> **log**: `Log`

Crawlee Log instance.

#### Source

[src/lib/actor/types.ts:352](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L352)

***

### metamorph

> **metamorph**: [`Metamorph`](../type-aliases/Metamorph.md)

Trigger actor metamorph, using actor's inputs as defaults.

#### Source

[src/lib/actor/types.ts:299](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L299)

***

### proxy?

> `optional` **proxy**: `ProxyConfiguration`

#### Source

[src/lib/actor/types.ts:332](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L332)

***

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

• **options**: [`PushDataOptions`](PushDataOptions.md)\<`T`\>

#### Returns

`Promise`\<`any`[]\>

#### Source

[src/lib/actor/types.ts:308](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L308)

***

### pushRequests()

> **pushRequests**: \<`T`\>(`oneOrManyItems`, `options`?) => `Promise`\<`any`[]\>

Similar to `Actor.openRequestQueue().addRequests`, but with extra features:

- Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit.
- Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue.

#### Type parameters

• **T** *extends* `Source`

#### Parameters

• **oneOrManyItems**: `T` \| `T`[]

• **options?**: [`PushRequestsOptions`](PushRequestsOptions.md)\<`T`\>

#### Returns

`Promise`\<`any`[]\>

#### Source

[src/lib/actor/types.ts:318](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L318)

***

### router

> **router**: `RouterHandler`\<`T`\[`"context"`\]\>

#### Source

[src/lib/actor/types.ts:334](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L334)

***

### routes

> **routes**: `Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](CrawleeOneRoute.md)\<`T`, [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>\>\>

#### Source

[src/lib/actor/types.ts:335](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L335)

***

### runCrawler

> **runCrawler**: [`RunCrawler`](../type-aliases/RunCrawler.md)\<`T`\[`"context"`\]\>

This function wraps `crawler.run(requests, runOtions)` with additional
features:
- Optionally metamorph into another actor after the run finishes

#### Source

[src/lib/actor/types.ts:297](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L297)

***

### startUrls

> **startUrls**: [`CrawlerUrl`](../type-aliases/CrawlerUrl.md)[]

A list of resolved Requests to be scraped.

This list is a combination of 3 Actor inputs:
- `startUrls` - Static list of URLs to scrape.
- `startUrlsFromDataset` - From a specific field from a Dataset (e.g. "dataset123#fieldName" - Dataset: "dataset123", field: "fieldName").
- `startUrlsFromFunction` - A function that is evaulated to generate the Requests.

#### Source

[src/lib/actor/types.ts:330](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L330)

***

### state

> **state**: `Record`\<`string`, `unknown`\>

Mutable state that is shared across setup and teardown hooks

#### Source

[src/lib/actor/types.ts:341](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L341)

***

### telemetry?

> `optional` **telemetry**: `T`\[`"telemetry"`\]

Instance managing telemetry like tracking errors.

#### Source

[src/lib/actor/types.ts:350](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L350)
