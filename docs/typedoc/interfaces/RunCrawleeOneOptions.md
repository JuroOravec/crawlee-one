[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / RunCrawleeOneOptions

# Interface: RunCrawleeOneOptions\<TType, T\>

Options available when creating default configuration for an opinionated Crawlee actor,
which is then run within Apify's `Actor.main()` context.

Apify context can be replaced with custom implementation using the `actorConfig.io` option.

Read more about what this actor does at createCrawleeOne.

## Type parameters

• **TType** *extends* [`CrawlerType`](../type-aliases/CrawlerType.md)

• **T** *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)\<`CrawlerMeta`\<`TType`\>\[`"context"`\]\>

## Properties

### actorConfig

> **actorConfig**: [`PickPartial`](../type-aliases/PickPartial.md)\<[`CrawleeOneActorDef`](CrawleeOneActorDef.md)\<`T`\>, `"io"` \| `"telemetry"` \| `"router"` \| `"createCrawler"`\>

Config passed to the createCrawleeOne

#### Source

[src/lib/actor/actor.ts:105](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/actor.ts#L105)

***

### actorName?

> `optional` **actorName**: `string`

#### Source

[src/lib/actor/actor.ts:103](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/actor.ts#L103)

***

### actorType

> **actorType**: `TType`

String idetifying the actor class, e.g. `'cheerio'`

#### Source

[src/lib/actor/actor.ts:102](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/actor.ts#L102)

***

### crawlerConfigDefaults?

> `optional` **crawlerConfigDefaults**: `Omit`\<`CrawlerMeta`\<`TType`, `CrawlingContext`\<`unknown`, `Dictionary`\>, `Record`\<`string`, `any`\>\>\[`"options"`\], `"requestHandler"`\>

If using default `createCrawler` implementation, these are crawler options
that may be overriden by user input.

#### Source

[src/lib/actor/actor.ts:110](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/actor.ts#L110)

***

### crawlerConfigOverrides?

> `optional` **crawlerConfigOverrides**: `Omit`\<`CrawlerMeta`\<`TType`, `CrawlingContext`\<`unknown`, `Dictionary`\>, `Record`\<`string`, `any`\>\>\[`"options"`\], `"requestHandler"`\>

If using default `createCrawler` implementation, these are crawler options
that will override user input.

This is useful for testing env.

#### Source

[src/lib/actor/actor.ts:117](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/actor.ts#L117)

***

### onReady()?

> `optional` **onReady**: (`actor`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Callback with the created actor. The callback is called within
the `Actor.main()` context.

#### Parameters

• **actor**: [`CrawleeOneActorInst`](CrawleeOneActorInst.md)\<`T`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/actor/actor.ts:122](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/actor.ts#L122)
