[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneArgs

# Interface: CrawleeOneArgs\<TType, T\>

Defined in: packages/crawlee-one/src/api.ts:15

Args object passed to `crawleeOne`

## Type Parameters

### TType

`TType` *extends* [`CrawlerType`](../type-aliases/CrawlerType.md)

### T

`T` *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)\<`CrawlerMeta`\<`TType`\>\[`"context"`\]\>

## Properties

### crawlerConfig?

> `optional` **crawlerConfig**: `Omit`\<`CrawlerMeta`\<`TType`, `CrawlingContext`\<`unknown`, `Dictionary`\>, `Record`\<`string`, `any`\>\>\[`"options"`\], `"requestHandler"`\>

Defined in: packages/crawlee-one/src/api.ts:25

Crawlee crawler configuration that CANNOT be overriden via `input` and `crawlerConfigDefaults`

***

### crawlerConfigDefaults?

> `optional` **crawlerConfigDefaults**: `Omit`\<`CrawlerMeta`\<`TType`, `CrawlingContext`\<`unknown`, `Dictionary`\>, `Record`\<`string`, `any`\>\>\[`"options"`\], `"requestHandler"`\>

Defined in: packages/crawlee-one/src/api.ts:27

Crawlee crawler configuration that CAN be overriden via `input` and `crawlerConfig`

***

### hooks?

> `optional` **hooks**: `object`

Defined in: packages/crawlee-one/src/api.ts:115

#### onAfterHandler?

> `optional` **onAfterHandler**: [`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`, [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>\>

#### onBeforeHandler?

> `optional` **onBeforeHandler**: [`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`, [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>\>

#### onReady()?

> `optional` **onReady**: (`actor`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

##### Parameters

###### actor

[`CrawleeOneActorInst`](CrawleeOneActorInst.md)\<`T`\>

##### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### validateInput()?

> `optional` **validateInput**: (`input`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

##### Parameters

###### input

[`AllActorInputs`](../type-aliases/AllActorInputs.md) | `null`

##### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### input?

> `optional` **input**: `Partial`\<[`AllActorInputs`](../type-aliases/AllActorInputs.md)\>

Defined in: packages/crawlee-one/src/api.ts:67

Input configuration that CANNOT be overriden via `inputDefaults` and `io.getInput()`

***

### inputDefaults?

> `optional` **inputDefaults**: `Partial`\<[`AllActorInputs`](../type-aliases/AllActorInputs.md)\>

Defined in: packages/crawlee-one/src/api.ts:69

Input configuration that CAN be overriden via `input` and `io.getInput()`

***

### io?

> `optional` **io**: `T`\[`"io"`\]

Defined in: packages/crawlee-one/src/api.ts:101

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

***

### mergeInput?

> `optional` **mergeInput**: `boolean` \| (`sources`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`Partial`\<[`AllActorInputs`](../type-aliases/AllActorInputs.md)\>\>

Defined in: packages/crawlee-one/src/api.ts:61

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

***

### name?

> `optional` **name**: `string`

Defined in: packages/crawlee-one/src/api.ts:22

Unique name of the crawler instance. The name may be used in codegen and logging.

***

### proxy?

> `optional` **proxy**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`ProxyConfiguration`, \[[`CrawleeOneActorDefWithInput`](../type-aliases/CrawleeOneActorDefWithInput.md)\<`T`\>\]\>

Defined in: packages/crawlee-one/src/api.ts:77

Configure the Crawlee proxy.

See ProxyConfiguration

***

### router?

> `optional` **router**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`RouterHandler`\<`T`\[`"context"`\]\>, \[[`CrawleeOneActorDefWithInput`](../type-aliases/CrawleeOneActorDefWithInput.md)\<`T`\>\]\>

Defined in: packages/crawlee-one/src/api.ts:113

Provide a custom router instance.

By default, router is created as:
```ts
import { Router } from 'crawlee';
Router.create(),
```

See Router

***

### routes

> **routes**: `Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](CrawleeOneRoute.md)\<`T`, [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>\>\>

Defined in: packages/crawlee-one/src/api.ts:121

***

### telemetry?

> `optional` **telemetry**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`T`\[`"telemetry"`\], \[[`CrawleeOneActorDefWithInput`](../type-aliases/CrawleeOneActorDefWithInput.md)\<`T`\>\]\>

Defined in: packages/crawlee-one/src/api.ts:83

Provide a telemetry instance that is used for tracking errors.

See [CrawleeOneTelemetry](CrawleeOneTelemetry.md)

***

### type

> **type**: `"basic"` \| `"http"` \| `"jsdom"` \| `"cheerio"` \| `"playwright"` \| `"adaptive-playwright"` \| `"puppeteer"`

Defined in: packages/crawlee-one/src/api.ts:20

Type specifying the Crawlee crawler class, input options, and more.
