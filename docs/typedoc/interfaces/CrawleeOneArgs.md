[crawlee-one](../README.md) / [Exports](../modules.md) / CrawleeOneArgs

# Interface: CrawleeOneArgs<TType, T\>

Args obbject passed to `crawleeOne`

## Type parameters

| Name | Type |
| :------ | :------ |
| `TType` | extends [`CrawlerType`](../modules.md#crawlertype) |
| `T` | extends [`CrawleeOneCtx`](CrawleeOneCtx.md)<`CrawlerMeta`<`TType`\>[``"context"``]\> |

## Table of contents

### Properties

- [crawlerConfig](CrawleeOneArgs.md#crawlerconfig)
- [crawlerConfigDefaults](CrawleeOneArgs.md#crawlerconfigdefaults)
- [hooks](CrawleeOneArgs.md#hooks)
- [input](CrawleeOneArgs.md#input)
- [inputDefaults](CrawleeOneArgs.md#inputdefaults)
- [io](CrawleeOneArgs.md#io)
- [mergeInput](CrawleeOneArgs.md#mergeinput)
- [name](CrawleeOneArgs.md#name)
- [proxy](CrawleeOneArgs.md#proxy)
- [router](CrawleeOneArgs.md#router)
- [routes](CrawleeOneArgs.md#routes)
- [telemetry](CrawleeOneArgs.md#telemetry)
- [type](CrawleeOneArgs.md#type)

## Properties

### crawlerConfig

• `Optional` **crawlerConfig**: `Omit`<`CrawlerMeta`<`TType`, `CrawlingContext`<`unknown`, `Dictionary`\>, `Record`<`string`, `any`\>\>[``"options"``], ``"requestHandler"``\>

Crawlee crawler configuration that CANNOT be overriden via `input` and `crawlerConfigDefaults`

#### Defined in

[src/api.ts:25](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/api.ts#L25)

___

### crawlerConfigDefaults

• `Optional` **crawlerConfigDefaults**: `Omit`<`CrawlerMeta`<`TType`, `CrawlingContext`<`unknown`, `Dictionary`\>, `Record`<`string`, `any`\>\>[``"options"``], ``"requestHandler"``\>

Crawlee crawler configuration that CAN be overriden via `input` and `crawlerConfig`

#### Defined in

[src/api.ts:27](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/api.ts#L27)

___

### hooks

• `Optional` **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `onAfterHandler?` | [`CrawleeOneRouteHandler`](../modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneActorRouterCtx`](../modules.md#crawleeoneactorrouterctx)<`T`\>\> |
| `onBeforeHandler?` | [`CrawleeOneRouteHandler`](../modules.md#crawleeoneroutehandler)<`T`, [`CrawleeOneActorRouterCtx`](../modules.md#crawleeoneactorrouterctx)<`T`\>\> |
| `onReady?` | (`actor`: [`CrawleeOneActorInst`](CrawleeOneActorInst.md)<`T`\>) => [`MaybePromise`](../modules.md#maybepromise)<`void`\> |
| `validateInput?` | (`input`: ``null`` \| [`AllActorInputs`](../modules.md#allactorinputs)) => [`MaybePromise`](../modules.md#maybepromise)<`void`\> |

#### Defined in

[src/api.ts:115](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/api.ts#L115)

___

### input

• `Optional` **input**: `Partial`<[`AllActorInputs`](../modules.md#allactorinputs)\>

Input configuration that CANNOT be overriden via `inputDefaults` and `io.getInput()`

#### Defined in

[src/api.ts:67](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/api.ts#L67)

___

### inputDefaults

• `Optional` **inputDefaults**: `Partial`<[`AllActorInputs`](../modules.md#allactorinputs)\>

Input configuration that CAN be overriden via `input` and `io.getInput()`

#### Defined in

[src/api.ts:69](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/api.ts#L69)

___

### io

• `Optional` **io**: `T`[``"io"``]

Provide an instance that is responsible for state management:
- Adding scraped data to datasets
- Adding and removing requests to/from queues
- Cache storage

This is an API based on Apify's `Actor` utility class, which is also
the default.

You don't need to override this in most of the cases.

By default, the data is saved and kept locally in
`./storage` directory. And if the cralwer runs in Apify's platform
then it will use Apify's cloud for storage.

See [CrawleeOneIO](CrawleeOneIO.md)

#### Defined in

[src/api.ts:101](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/api.ts#L101)

___

### mergeInput

• `Optional` **mergeInput**: `boolean` \| (`sources`: { `defaults`: `Partial`<[`AllActorInputs`](../modules.md#allactorinputs)\> ; `env`: `Partial`<[`AllActorInputs`](../modules.md#allactorinputs)\> ; `overrides`: `Partial`<[`AllActorInputs`](../modules.md#allactorinputs)\>  }) => [`MaybePromise`](../modules.md#maybepromise)<`Partial`<[`AllActorInputs`](../modules.md#allactorinputs)\>\>

If `mergeInput` is truthy, will merge input settings from `inputDefaults`, `input`,
and `io.getInput()`.

```js
{ ...inputDefaults, ...io.getInput(), ...input }
```

If `mergeInput` is falsy, `io.getInput()` is ignored if `input` is provided. So the input is either:

```js
{ ...inputDefaults, ...io.getInput() } // If `input` is not defined
```

OR

```js
{ ...inputDefaults, ...input } // If `input` is defined
```

Alternatively, you can supply your own function that merges the sources:

```js
{
  // `mergeInput` can be also async
  mergeInput: ({ defaults, overrides, env }) => {
    // This is same as `mergeInput: true`
    return { ...defaults, ...env, ...overrides };
  },
}
```

#### Defined in

[src/api.ts:61](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/api.ts#L61)

___

### name

• `Optional` **name**: `string`

Unique name of the crawler instance. The name may be used in codegen and logging.

#### Defined in

[src/api.ts:22](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/api.ts#L22)

___

### proxy

• `Optional` **proxy**: [`MaybeAsyncFn`](../modules.md#maybeasyncfn)<`ProxyConfiguration`, [[`CrawleeOneActorDefWithInput`](../modules.md#crawleeoneactordefwithinput)<`T`\>]\>

Configure the Crawlee proxy.

See ProxyConfiguration

#### Defined in

[src/api.ts:77](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/api.ts#L77)

___

### router

• `Optional` **router**: [`MaybeAsyncFn`](../modules.md#maybeasyncfn)<`RouterHandler`<`T`[``"context"``]\>, [[`CrawleeOneActorDefWithInput`](../modules.md#crawleeoneactordefwithinput)<`T`\>]\>

Provide a custom router instance.

By default, router is created as:
```ts
import { Router } from 'crawlee';
Router.create(),
```

See Router

#### Defined in

[src/api.ts:113](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/api.ts#L113)

___

### routes

• **routes**: `Record`<`T`[``"labels"``], [`CrawleeOneRoute`](CrawleeOneRoute.md)<`T`, [`CrawleeOneActorRouterCtx`](../modules.md#crawleeoneactorrouterctx)<`T`\>\>\>

#### Defined in

[src/api.ts:121](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/api.ts#L121)

___

### telemetry

• `Optional` **telemetry**: [`MaybeAsyncFn`](../modules.md#maybeasyncfn)<`T`[``"telemetry"``], [[`CrawleeOneActorDefWithInput`](../modules.md#crawleeoneactordefwithinput)<`T`\>]\>

Provide a telemetry instance that is used for tracking errors.

See [CrawleeOneTelemetry](CrawleeOneTelemetry.md)

#### Defined in

[src/api.ts:83](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/api.ts#L83)

___

### type

• **type**: ``"basic"`` \| ``"http"`` \| ``"cheerio"`` \| ``"jsdom"`` \| ``"playwright"`` \| ``"puppeteer"``

Type specifying the Crawlee crawler class, input options, and more.

#### Defined in

[src/api.ts:20](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/api.ts#L20)
