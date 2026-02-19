[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneOptions

# Interface: CrawleeOneOptions\<TType, T\>

Defined in: [packages/crawlee-one/src/lib/context/context.ts:54](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L54)

Options object passed to `crawleeOne`

## Type Parameters

### TType

`TType` *extends* [`CrawlerType`](../type-aliases/CrawlerType.md)

### T

`T` *extends* [`CrawleeOneTypes`](CrawleeOneTypes.md)\<[`CrawlerMeta`](../type-aliases/CrawlerMeta.md)\<`TType`\>\[`"context"`\]\>

## Properties

### crawlerConfigDefaults?

> `optional` **crawlerConfigDefaults**: `Omit`\<[`CrawlerMeta`](../type-aliases/CrawlerMeta.md)\<`TType`, `CrawlingContext`\<`unknown`, `Dictionary`\>, `Record`\<`string`, `any`\>\>\[`"options"`\], `"requestHandler"`\>

Defined in: [packages/crawlee-one/src/lib/context/context.ts:66](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L66)

Default crawler configuration that may be overriden via `input` and `crawlerConfigOverrides`

***

### crawlerConfigOverrides?

> `optional` **crawlerConfigOverrides**: `Omit`\<[`CrawlerMeta`](../type-aliases/CrawlerMeta.md)\<`TType`, `CrawlingContext`\<`unknown`, `Dictionary`\>, `Record`\<`string`, `any`\>\>\[`"options"`\], `"requestHandler"`\>

Defined in: [packages/crawlee-one/src/lib/context/context.ts:64](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L64)

Crawler configuration that is applied at the end and overrides `crawlerConfigDefaults` and `input` settings.

***

### hooks?

> `optional` **hooks**: `object`

Defined in: [packages/crawlee-one/src/lib/context/context.ts:161](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L161)

#### onAfterHandler?

> `optional` **onAfterHandler**: [`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`\>

#### onBeforeHandler?

> `optional` **onBeforeHandler**: [`CrawleeOneRouteHandler`](../type-aliases/CrawleeOneRouteHandler.md)\<`T`\>

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

Defined in: [packages/crawlee-one/src/lib/context/context.ts:106](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L106)

Input configuration that CANNOT be overriden via `inputDefaults` and `io.getInput()`

***

### inputDefaults?

> `optional` **inputDefaults**: `Partial`\<`T`\[`"input"`\]\>

Defined in: [packages/crawlee-one/src/lib/context/context.ts:108](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L108)

Input configuration that CAN be overriden via `input` and `io.getInput()`

***

### inputFields?

> `optional` **inputFields**: `Record`\<`string`, `Field`\>

Defined in: [packages/crawlee-one/src/lib/context/context.ts:113](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L113)

Field objects with embedded Zod schemas for input validation.
If provided, input is validated against these schemas automatically.

***

### io?

> `optional` **io**: `T`\[`"io"`\]

Defined in: [packages/crawlee-one/src/lib/context/context.ts:145](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L145)

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

Defined in: [packages/crawlee-one/src/lib/context/context.ts:100](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L100)

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

Defined in: [packages/crawlee-one/src/lib/context/context.ts:61](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L61)

Unique name of the crawler instance. The name may be used in codegen and logging.

***

### proxy?

> `optional` **proxy**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`ProxyConfiguration`, \[[`CrawleeOneInternalOptionsWithInput`](../type-aliases/CrawleeOneInternalOptionsWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/context/context.ts:121](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L121)

Configure the Crawlee proxy.

See ProxyConfiguration

***

### router?

> `optional` **router**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`RouterHandler`\<`T`\[`"context"`\]\>, \[[`CrawleeOneInternalOptionsWithInput`](../type-aliases/CrawleeOneInternalOptionsWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/context/context.ts:157](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L157)

Provide a custom router instance.

By default, router is created as:
```ts
import { Router } from 'crawlee';
Router.create(),
```

See Router

***

### routes

> **routes**: `Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](CrawleeOneRoute.md)\<`T`\>\>

Defined in: [packages/crawlee-one/src/lib/context/context.ts:159](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L159)

Routes that are used to redirect requests to the appropriate handler.

***

### strict?

> `optional` **strict**: `boolean`

Defined in: [packages/crawlee-one/src/lib/context/context.ts:175](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L175)

When `true`, throw when a URL does not match any route.

If `false`, log an error and skip the URL.

Defaults to `false`.

***

### telemetry?

> `optional` **telemetry**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`T`\[`"telemetry"`\], \[[`CrawleeOneInternalOptionsWithInput`](../type-aliases/CrawleeOneInternalOptionsWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/context/context.ts:127](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L127)

Provide a telemetry instance that is used for tracking errors.

See [CrawleeOneTelemetry](CrawleeOneTelemetry.md)

***

### type

> **type**: `"basic"` \| `"http"` \| `"jsdom"` \| `"cheerio"` \| `"playwright"` \| `"adaptive-playwright"` \| `"puppeteer"`

Defined in: [packages/crawlee-one/src/lib/context/context.ts:59](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/context.ts#L59)

Type specifying the Crawlee crawler class, input options, and more.
