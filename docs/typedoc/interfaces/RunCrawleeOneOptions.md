[crawlee-one](../README.md) / [Exports](../modules.md) / RunCrawleeOneOptions

# Interface: RunCrawleeOneOptions<TType, T\>

Options available when creating default configuration for an opinionated Crawlee actor,
which is then run within Apify's `Actor.main()` context.

Apify context can be replaced with custom implementation using the `actorConfig.io` option.

Read more about what this actor does at createCrawleeOne.

## Type parameters

| Name | Type |
| :------ | :------ |
| `TType` | extends [`CrawlerType`](../modules.md#crawlertype) |
| `T` | extends [`CrawleeOneCtx`](CrawleeOneCtx.md)<`CrawlerMeta`<`TType`\>[``"context"``]\> |

## Table of contents

### Properties

- [actorConfig](RunCrawleeOneOptions.md#actorconfig)
- [actorName](RunCrawleeOneOptions.md#actorname)
- [actorType](RunCrawleeOneOptions.md#actortype)
- [crawlerConfigDefaults](RunCrawleeOneOptions.md#crawlerconfigdefaults)
- [crawlerConfigOverrides](RunCrawleeOneOptions.md#crawlerconfigoverrides)
- [onReady](RunCrawleeOneOptions.md#onready)

## Properties

### actorConfig

• **actorConfig**: [`PickPartial`](../modules.md#pickpartial)<[`CrawleeOneActorDef`](CrawleeOneActorDef.md)<`T`\>, ``"io"`` \| ``"telemetry"`` \| ``"router"`` \| ``"createCrawler"``\>

Config passed to the createCrawleeOne

#### Defined in

[src/lib/actor/actor.ts:104](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actor/actor.ts#L104)

___

### actorName

• `Optional` **actorName**: `string`

#### Defined in

[src/lib/actor/actor.ts:102](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actor/actor.ts#L102)

___

### actorType

• **actorType**: `TType`

String idetifying the actor class, e.g. `'cheerio'`

#### Defined in

[src/lib/actor/actor.ts:101](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actor/actor.ts#L101)

___

### crawlerConfigDefaults

• `Optional` **crawlerConfigDefaults**: `Omit`<`CrawlerMeta`<`TType`, `CrawlingContext`<`unknown`, `Dictionary`\>, `Record`<`string`, `any`\>\>[``"options"``], ``"requestHandler"``\>

If using default `createCrawler` implementation, these are crawler options
that may be overriden by user input.

#### Defined in

[src/lib/actor/actor.ts:109](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actor/actor.ts#L109)

___

### crawlerConfigOverrides

• `Optional` **crawlerConfigOverrides**: `Omit`<`CrawlerMeta`<`TType`, `CrawlingContext`<`unknown`, `Dictionary`\>, `Record`<`string`, `any`\>\>[``"options"``], ``"requestHandler"``\>

If using default `createCrawler` implementation, these are crawler options
that will override user input.

This is useful for testing env.

#### Defined in

[src/lib/actor/actor.ts:116](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actor/actor.ts#L116)

___

### onReady

• `Optional` **onReady**: (`actor`: [`CrawleeOneActorInst`](CrawleeOneActorInst.md)<`T`\>) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`actor`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

Callback with the created actor. The callback is called within
the `Actor.main()` context.

##### Parameters

| Name | Type |
| :------ | :------ |
| `actor` | [`CrawleeOneActorInst`](CrawleeOneActorInst.md)<`T`\> |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/actor/actor.ts:121](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/actor/actor.ts#L121)
