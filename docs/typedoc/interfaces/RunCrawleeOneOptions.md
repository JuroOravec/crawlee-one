[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / RunCrawleeOneOptions

# Interface: RunCrawleeOneOptions\<TType, T\>

Defined in: [src/lib/actor/actor.ts:97](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/actor.ts#L97)

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

Defined in: [src/lib/actor/actor.ts:105](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/actor.ts#L105)

Config passed to the createCrawleeOne

***

### actorName?

> `optional` **actorName**: `string`

Defined in: [src/lib/actor/actor.ts:103](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/actor.ts#L103)

***

### actorType

> **actorType**: `TType`

Defined in: [src/lib/actor/actor.ts:102](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/actor.ts#L102)

String idetifying the actor class, e.g. `'cheerio'`

***

### crawlerConfigDefaults?

> `optional` **crawlerConfigDefaults**: `Omit`\<`CrawlerMeta`\<`TType`, `CrawlingContext`\<`unknown`, `Dictionary`\>, `Record`\<`string`, `any`\>\>\[`"options"`\], `"requestHandler"`\>

Defined in: [src/lib/actor/actor.ts:110](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/actor.ts#L110)

If using default `createCrawler` implementation, these are crawler options
that may be overriden by user input.

***

### crawlerConfigOverrides?

> `optional` **crawlerConfigOverrides**: `Omit`\<`CrawlerMeta`\<`TType`, `CrawlingContext`\<`unknown`, `Dictionary`\>, `Record`\<`string`, `any`\>\>\[`"options"`\], `"requestHandler"`\>

Defined in: [src/lib/actor/actor.ts:117](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/actor.ts#L117)

If using default `createCrawler` implementation, these are crawler options
that will override user input.

This is useful for testing env.

***

### onReady()?

> `optional` **onReady**: (`actor`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [src/lib/actor/actor.ts:122](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/actor.ts#L122)

Callback with the created actor. The callback is called within
the `Actor.main()` context.

#### Parameters

##### actor

[`CrawleeOneActorInst`](CrawleeOneActorInst.md)\<`T`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>
