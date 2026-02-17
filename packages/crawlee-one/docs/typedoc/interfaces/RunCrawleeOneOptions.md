[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / RunCrawleeOneOptions

# Interface: RunCrawleeOneOptions\<TType, T\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:101](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L101)

Options available when creating default configuration for an opinionated Crawlee actor,
which is then run within Apify's `Actor.main()` context.

Apify context can be replaced with custom implementation using the `actorConfig.io` option.

Read more about what this actor does at createCrawleeOne.

## Type Parameters

### TType

`TType` *extends* [`CrawlerType`](../type-aliases/CrawlerType.md)

### T

`T` *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)\<[`CrawlerMeta`](../type-aliases/CrawlerMeta.md)\<`TType`\>\[`"context"`\]\>

## Properties

### actorConfig

> **actorConfig**: [`PickPartial`](../type-aliases/PickPartial.md)\<[`CrawleeOneActorDef`](CrawleeOneActorDef.md)\<`T`\>, `"io"` \| `"telemetry"` \| `"router"` \| `"createCrawler"`\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:109](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L109)

Config passed to the createCrawleeOne

***

### actorName?

> `optional` **actorName**: `string`

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:107](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L107)

***

### actorType

> **actorType**: `TType`

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:106](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L106)

String idetifying the actor class, e.g. `'cheerio'`

***

### crawleeOneOptions?

> `optional` **crawleeOneOptions**: [`CrawleeOneOptions`](CrawleeOneOptions.md)

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:128](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L128)

Meta options (e.g. strict mode from CLI).

***

### crawlerConfigDefaults?

> `optional` **crawlerConfigDefaults**: `Omit`\<[`CrawlerMeta`](../type-aliases/CrawlerMeta.md)\<`TType`, `CrawlingContext`\<`unknown`, `Dictionary`\>, `Record`\<`string`, `any`\>\>\[`"options"`\], `"requestHandler"`\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:114](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L114)

If using default `createCrawler` implementation, these are crawler options
that may be overriden by user input.

***

### crawlerConfigOverrides?

> `optional` **crawlerConfigOverrides**: `Omit`\<[`CrawlerMeta`](../type-aliases/CrawlerMeta.md)\<`TType`, `CrawlingContext`\<`unknown`, `Dictionary`\>, `Record`\<`string`, `any`\>\>\[`"options"`\], `"requestHandler"`\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:121](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L121)

If using default `createCrawler` implementation, these are crawler options
that will override user input.

This is useful for testing env.

***

### onReady()?

> `optional` **onReady**: (`actor`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:126](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L126)

Callback with the created actor. The callback is called within
the `Actor.main()` context.

#### Parameters

##### actor

[`CrawleeOneActorInst`](CrawleeOneActorInst.md)\<`T`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>
