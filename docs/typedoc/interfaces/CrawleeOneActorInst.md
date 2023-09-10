[crawlee-one](../README.md) / [Exports](../modules.md) / CrawleeOneActorInst

# Interface: CrawleeOneActorInst<T\>

Context available while creating a Crawlee crawler/actor

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](CrawleeOneCtx.md) |

## Table of contents

### Properties

- [config](CrawleeOneActorInst.md#config)
- [crawler](CrawleeOneActorInst.md#crawler)
- [handlerCtx](CrawleeOneActorInst.md#handlerctx)
- [input](CrawleeOneActorInst.md#input)
- [io](CrawleeOneActorInst.md#io)
- [log](CrawleeOneActorInst.md#log)
- [metamorph](CrawleeOneActorInst.md#metamorph)
- [proxy](CrawleeOneActorInst.md#proxy)
- [pushData](CrawleeOneActorInst.md#pushdata)
- [pushRequests](CrawleeOneActorInst.md#pushrequests)
- [router](CrawleeOneActorInst.md#router)
- [routes](CrawleeOneActorInst.md#routes)
- [runCrawler](CrawleeOneActorInst.md#runcrawler)
- [startUrls](CrawleeOneActorInst.md#starturls)
- [state](CrawleeOneActorInst.md#state)
- [telemetry](CrawleeOneActorInst.md#telemetry)

## Properties

### config

• **config**: [`PickPartial`](../modules.md#pickpartial)<[`CrawleeOneActorDef`](CrawleeOneActorDef.md)<`T`\>, ``"io"``\>

Original config from which this actor context was created

#### Defined in

[src/lib/actor/types.ts:337](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L337)

___

### crawler

• **crawler**: `T`[``"context"``][``"crawler"``]

The Crawlee crawler instance used by this instance of CrawleeOne

#### Defined in

[src/lib/actor/types.ts:291](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L291)

___

### handlerCtx

• **handlerCtx**: ``null`` \| `Omit`<`T`[``"context"``] & [`CrawleeOneActorRouterCtx`](../modules.md#crawleeoneactorrouterctx)<`T`\>, ``"request"``\> & { `request`: `Request`<`Dictionary`\>  }

#### Defined in

[src/lib/actor/types.ts:353](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L353)

___

### input

• **input**: ``null`` \| `T`[``"input"``]

Read-only inputs passed to the actor

#### Defined in

[src/lib/actor/types.ts:339](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L339)

___

### io

• **io**: `T`[``"io"``]

Instance managing communication with databases - storage & retrieval
(Dataset, RequestQueue, KeyValueStore).

This is modelled and similar to Apify's `Actor` static class.

#### Defined in

[src/lib/actor/types.ts:348](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L348)

___

### log

• **log**: `Log`

Crawlee Log instance.

#### Defined in

[src/lib/actor/types.ts:352](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L352)

___

### metamorph

• **metamorph**: [`Metamorph`](../modules.md#metamorph)

Trigger actor metamorph, using actor's inputs as defaults.

#### Defined in

[src/lib/actor/types.ts:299](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L299)

___

### proxy

• `Optional` **proxy**: `ProxyConfiguration`

#### Defined in

[src/lib/actor/types.ts:332](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L332)

___

### pushData

• **pushData**: <T\>(`oneOrManyItems`: `T` \| `T`[], `options`: [`PushDataOptions`](PushDataOptions.md)<`T`\>) => `Promise`<`any`[]\>

#### Type declaration

▸ <`T`\>(`oneOrManyItems`, `options`): `Promise`<`any`[]\>

`Actor.pushData` with extra optional features:

- Limit the number of entries pushed to the Dataset based on the Actor input
- Transform and filter entries via Actor input.
- Add metadata to entries before they are pushed to Dataset.
- Set which (nested) properties are personal data optionally redact them for privacy compliance.

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Record`<`any`, `any`\> = `Record`<`any`, `any`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `oneOrManyItems` | `T` \| `T`[] |
| `options` | [`PushDataOptions`](PushDataOptions.md)<`T`\> |

##### Returns

`Promise`<`any`[]\>

#### Defined in

[src/lib/actor/types.ts:308](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L308)

___

### pushRequests

• **pushRequests**: <T\>(`oneOrManyItems`: `T` \| `T`[], `options?`: [`PushRequestsOptions`](PushRequestsOptions.md)<`T`\>) => `Promise`<`any`[]\>

#### Type declaration

▸ <`T`\>(`oneOrManyItems`, `options?`): `Promise`<`any`[]\>

Similar to `Actor.openRequestQueue().addRequests`, but with extra features:

- Limit the max size of the RequestQueue. No requests are added when RequestQueue is at or above the limit.
- Transform and filter requests. Requests that did not pass the filter are not added to the RequestQueue.

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `RequestOptions`<`Dictionary`\> \| `Request`<`Dictionary`\> |

##### Parameters

| Name | Type |
| :------ | :------ |
| `oneOrManyItems` | `T` \| `T`[] |
| `options?` | [`PushRequestsOptions`](PushRequestsOptions.md)<`T`\> |

##### Returns

`Promise`<`any`[]\>

#### Defined in

[src/lib/actor/types.ts:318](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L318)

___

### router

• **router**: `RouterHandler`<`T`[``"context"``]\>

#### Defined in

[src/lib/actor/types.ts:334](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L334)

___

### routes

• **routes**: `Record`<`T`[``"labels"``], [`CrawleeOneRoute`](CrawleeOneRoute.md)<`T`, [`CrawleeOneActorRouterCtx`](../modules.md#crawleeoneactorrouterctx)<`T`\>\>\>

#### Defined in

[src/lib/actor/types.ts:335](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L335)

___

### runCrawler

• **runCrawler**: [`RunCrawler`](../modules.md#runcrawler)<`T`[``"context"``]\>

This function wraps `crawler.run(requests, runOtions)` with additional
features:
- Optionally metamorph into another actor after the run finishes

#### Defined in

[src/lib/actor/types.ts:297](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L297)

___

### startUrls

• **startUrls**: (`string` \| `RequestOptions`<`Dictionary`\> \| `Request`<`Dictionary`\>)[]

A list of resolved Requests to be scraped.

This list is a combination of 3 Actor inputs:
- `startUrls` - Static list of URLs to scrape.
- `startUrlsFromDataset` - From a specific field from a Dataset (e.g. "dataset123#fieldName" - Dataset: "dataset123", field: "fieldName").
- `startUrlsFromFunction` - A function that is evaulated to generate the Requests.

#### Defined in

[src/lib/actor/types.ts:330](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L330)

___

### state

• **state**: `Record`<`string`, `unknown`\>

Mutable state that is shared across setup and teardown hooks

#### Defined in

[src/lib/actor/types.ts:341](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L341)

___

### telemetry

• `Optional` **telemetry**: `T`[``"telemetry"``]

Instance managing telemetry like tracking errors.

#### Defined in

[src/lib/actor/types.ts:350](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L350)
