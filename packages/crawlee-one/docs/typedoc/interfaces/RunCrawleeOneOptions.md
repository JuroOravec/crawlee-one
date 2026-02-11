[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / RunCrawleeOneOptions

# Interface: RunCrawleeOneOptions\<TType, T\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:98](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L98)

Options available when creating default configuration for an opinionated Crawlee actor,
which is then run within Apify's `Actor.main()` context.

Apify context can be replaced with custom implementation using the `actorConfig.io` option.

Read more about what this actor does at createCrawleeOne.

## Type Parameters

### TType

`TType` *extends* [`CrawlerType`](../type-aliases/CrawlerType.md)

### T

`T` *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)\<`CrawlerMeta`\<`TType`\>\[`"context"`\]\>

## Properties

### actorConfig

> **actorConfig**: [`PickPartial`](../type-aliases/PickPartial.md)\<[`CrawleeOneActorDef`](CrawleeOneActorDef.md)\<`T`\>, `"io"` \| `"telemetry"` \| `"router"` \| `"createCrawler"`\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:106](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L106)

Config passed to the createCrawleeOne

***

### actorName?

> `optional` **actorName**: `string`

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:104](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L104)

***

### actorType

> **actorType**: `TType`

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:103](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L103)

String idetifying the actor class, e.g. `'cheerio'`

***

### crawlerConfigDefaults?

> `optional` **crawlerConfigDefaults**: `Omit`\<`CrawlerMeta`\<`TType`, `CrawlingContext`\<`unknown`, `Dictionary`\>, `Record`\<`string`, `any`\>\>\[`"options"`\], `"requestHandler"`\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:111](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L111)

If using default `createCrawler` implementation, these are crawler options
that may be overriden by user input.

***

### crawlerConfigOverrides?

> `optional` **crawlerConfigOverrides**: `Omit`\<`CrawlerMeta`\<`TType`, `CrawlingContext`\<`unknown`, `Dictionary`\>, `Record`\<`string`, `any`\>\>\[`"options"`\], `"requestHandler"`\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:118](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L118)

If using default `createCrawler` implementation, these are crawler options
that will override user input.

This is useful for testing env.

***

### onReady()?

> `optional` **onReady**: (`actor`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:123](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L123)

Callback with the created actor. The callback is called within
the `Actor.main()` context.

#### Parameters

##### actor

[`CrawleeOneActorInst`](CrawleeOneActorInst.md)\<`T`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>
