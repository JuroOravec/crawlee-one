[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneContext

# Interface: CrawleeOneContext\<T\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:335](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L335)

CrawleeOne context — input, state, crawler, IO, and more.

Available in route handlers as `ctx.one` and in `onReady(context)`.

## Example

```ts
crawleeOne(config, async (context) => {
  await context.crawler.run([]);
});
```

## Type Parameters

### T

`T` _extends_ [`CrawleeOneTypes`](CrawleeOneTypes.md)

## Properties

### addRequests()

> **addRequests**: \<`T`\>(`oneOrManyItems`, `options?`) => `Promise`\<`any`[]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:351](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L351)

Similar to `Actor.openRequestQueue().addRequests`, but with extra features:

- Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit.
- Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue.

#### Type Parameters

##### T

`T` _extends_ `Source`

#### Parameters

##### oneOrManyItems

`T` | `T`[]

##### options?

[`AddRequestsOptions`](AddRequestsOptions.md)\<`T`\>

#### Returns

`Promise`\<`any`[]\>

---

### config

> **config**: [`PickPartial`](../type-aliases/PickPartial.md)\<[`CrawleeOneInternalOptions`](CrawleeOneInternalOptions.md)\<`T`\>, `"io"`\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:378](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L378)

Original config from which this CrawleeOne context was created

---

### crawler

> **crawler**: `T`\[`"context"`\]\[`"crawler"`\]

Defined in: [packages/crawlee-one/src/lib/context/types.ts:342](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L342)

The Crawlee crawler instance. Its `run()` method is wrapped with additional
features (metamorph, transform/filter hooks, output cache).

Call `context.crawler.run(requests?, options?)` to start crawling.

---

### input

> **input**: `T`\[`"input"`\] \| `null`

Defined in: [packages/crawlee-one/src/lib/context/types.ts:380](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L380)

Read-only inputs passed to the CrawleeOne instance

---

### io

> **io**: `T`\[`"io"`\]

Defined in: [packages/crawlee-one/src/lib/context/types.ts:389](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L389)

Instance managing communication with databases - storage & retrieval
(Dataset, RequestQueue, KeyValueStore).

Modelled and similar to Apify's `Actor` static class.

---

### log

> **log**: `Log`

Defined in: [packages/crawlee-one/src/lib/context/types.ts:393](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L393)

Crawlee Log instance.

---

### metamorph

> **metamorph**: [`Metamorph`](../type-aliases/Metamorph.md)

Defined in: [packages/crawlee-one/src/lib/context/types.ts:344](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L344)

Trigger actor metamorph, using actor's inputs as defaults.

---

### proxy?

> `optional` **proxy**: `ProxyConfiguration`

Defined in: [packages/crawlee-one/src/lib/context/types.ts:373](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L373)

---

### router

> **router**: `RouterHandler`\<`T`\[`"context"`\]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:375](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L375)

---

### routes

> **routes**: `Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](CrawleeOneRoute.md)\<`T`\>\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:376](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L376)

---

### startUrls

> **startUrls**: [`CrawlerUrl`](../type-aliases/CrawlerUrl.md)[]

Defined in: [packages/crawlee-one/src/lib/context/types.ts:371](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L371)

A list of resolved Requests to be scraped.

This list is a combination of 3 Actor inputs:

- `startUrls` - Static list of URLs to scrape.
- `startUrlsFromDataset` - From a specific field from a Dataset (e.g. "dataset123#fieldName" - Dataset: "dataset123", field: "fieldName").
- `startUrlsFromFunction` - A function that is evaulated to generate the Requests.

---

### state

> **state**: `Record`\<`string`, `unknown`\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:382](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L382)

Mutable state that is shared across setup and teardown hooks

---

### telemetry?

> `optional` **telemetry**: `T`\[`"telemetry"`\]

Defined in: [packages/crawlee-one/src/lib/context/types.ts:391](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L391)

Instance managing telemetry like tracking errors.
