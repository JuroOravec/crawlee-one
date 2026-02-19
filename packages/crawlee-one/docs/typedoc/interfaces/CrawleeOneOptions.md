[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneOptions

# Interface: CrawleeOneOptions\<TType, T\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:53](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L53)

Options object passed to `crawleeOne`

## Type Parameters

### TType

`TType` *extends* [`CrawlerType`](../type-aliases/CrawlerType.md)

### T

`T` *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)\<[`CrawlerMeta`](../type-aliases/CrawlerMeta.md)\<`TType`\>\[`"context"`\]\>

## Properties

### crawlerConfigDefaults?

> `optional` **crawlerConfigDefaults**: `Omit`\<[`CrawlerMeta`](../type-aliases/CrawlerMeta.md)\<`TType`, `CrawlingContext`\<`unknown`, `Dictionary`\>, `Record`\<`string`, `any`\>\>\[`"options"`\], `"requestHandler"`\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:65](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L65)

Default crawler configuration that may be overriden via `input` and `crawlerConfigOverrides`

***

### crawlerConfigOverrides?

> `optional` **crawlerConfigOverrides**: `Omit`\<[`CrawlerMeta`](../type-aliases/CrawlerMeta.md)\<`TType`, `CrawlingContext`\<`unknown`, `Dictionary`\>, `Record`\<`string`, `any`\>\>\[`"options"`\], `"requestHandler"`\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:63](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L63)

Crawler configuration that is applied at the end and overrides `crawlerConfigDefaults` and `input` settings.

***

### hooks?

> `optional` **hooks**: `object`

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:160](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L160)

#### onAfterHandler?

> `optional` **onAfterHandler**: [`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`, [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>\>

#### onBeforeHandler?

> `optional` **onBeforeHandler**: [`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`, [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>\>

#### validateInput()?

> `optional` **validateInput**: (`input`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

##### Parameters

###### input

`T`\[`"input"`\] | `null`

##### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### input?

> `optional` **input**: `Partial`\<`T`\[`"input"`\]\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:105](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L105)

Input configuration that CANNOT be overriden via `inputDefaults` and `io.getInput()`

***

### inputDefaults?

> `optional` **inputDefaults**: `Partial`\<`T`\[`"input"`\]\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:107](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L107)

Input configuration that CAN be overriden via `input` and `io.getInput()`

***

### inputFields?

> `optional` **inputFields**: `Record`\<`string`, `Field`\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:112](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L112)

Field objects with embedded Zod schemas for input validation.
If provided, input is validated against these schemas automatically.

***

### io?

> `optional` **io**: `T`\[`"io"`\]

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:144](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L144)

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

> `optional` **mergeInput**: `boolean` \| (`sources`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`Partial`\<`T`\[`"input"`\]\>\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:99](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L99)

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

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:60](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L60)

Unique name of the crawler instance. The name may be used in codegen and logging.

***

### proxy?

> `optional` **proxy**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`ProxyConfiguration`, \[[`CrawleeOneActorDefWithInput`](../type-aliases/CrawleeOneActorDefWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:120](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L120)

Configure the Crawlee proxy.

See ProxyConfiguration

***

### router?

> `optional` **router**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`RouterHandler`\<`T`\[`"context"`\]\>, \[[`CrawleeOneActorDefWithInput`](../type-aliases/CrawleeOneActorDefWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:156](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L156)

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

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:158](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L158)

Routes that are used to redirect requests to the appropriate handler.

***

### strict?

> `optional` **strict**: `boolean`

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:174](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L174)

When `true`, throw when a URL does not match any route.

If `false`, log an error and skip the URL.

Defaults to `false`.

***

### telemetry?

> `optional` **telemetry**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`T`\[`"telemetry"`\], \[[`CrawleeOneActorDefWithInput`](../type-aliases/CrawleeOneActorDefWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:126](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L126)

Provide a telemetry instance that is used for tracking errors.

See [CrawleeOneTelemetry](CrawleeOneTelemetry.md)

***

### type

> **type**: `"basic"` \| `"http"` \| `"jsdom"` \| `"cheerio"` \| `"playwright"` \| `"adaptive-playwright"` \| `"puppeteer"`

Defined in: [packages/crawlee-one/src/lib/actor/actor.ts:58](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/actor.ts#L58)

Type specifying the Crawlee crawler class, input options, and more.
