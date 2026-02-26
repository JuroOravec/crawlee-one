[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneInternalOptions

# Interface: CrawleeOneInternalOptions\<T\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:159](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L159)

All that's necessary to define a single CrawleeOne actor/crawler.

## Type Parameters

### T

`T` _extends_ [`CrawleeOneTypes`](CrawleeOneTypes.md)

## Properties

### createCrawler()

> **createCrawler**: (`ctx`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`\[`"context"`\]\[`"crawler"`\]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:309](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L309)

#### Parameters

##### ctx

`Omit`\<[`CrawleeOneContext`](CrawleeOneContext.md)\<`T`\>, `"crawler"` \| `"metamorph"` \| `"startUrls"` \| `"addRequests"`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`\[`"context"`\]\[`"crawler"`\]\>

---

### input?

> `optional` **input**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`T`\[`"input"`\], \[`CrawleeOneInternalOptions`\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:172](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L172)

Supply actor input via this field instead of from `io.getInput()`.

If `input` is NOT defined, the Actor input is obtained from `io.getInput()`,
which by default corresponds to Apify's `Actor.getInput()`.

If `input` is defined, then `io.getInput()` is ignored.

---

### inputDefaults?

> `optional` **inputDefaults**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`T`\[`"input"`\], \[`CrawleeOneInternalOptions`\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:174](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L174)

Default input that may be overriden by `input` and `io.getInput()`.

---

### inputFields?

> `optional` **inputFields**: `Record`\<`string`, `Field`\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:222](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L222)

Field objects describing the actor input schema.

If provided, crawlee-one auto-validates input against
embedded Zod schemas before calling `validateInput`.

---

### io

> **io**: `T`\[`"io"`\]

Defined in: [packages/crawlee-one/src/lib/context/types.ts:161](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L161)

Client for communicating with cloud/local storage.

---

### mergeInput?

> `optional` **mergeInput**: `boolean` \| (`sources`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`\[`"input"`\]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:207](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L207)

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

---

### proxy?

> `optional` **proxy**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`ProxyConfiguration`, \[[`CrawleeOneInternalOptionsWithInput`](../type-aliases/CrawleeOneInternalOptionsWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:292](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L292)

---

### routeHandlerWrappers?

> `optional` **routeHandlerWrappers**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<[`CrawleeOneRouteMiddleware`](../type-aliases/CrawleeOneRouteMiddleware.md)\<`T`\>[], \[[`CrawleeOneInternalOptionsWithInput`](../type-aliases/CrawleeOneInternalOptionsWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:286](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L286)

Provides the option to modify or extend all router handlers by wrapping
them in these functions.

Wrappers are applied from right to left. That means that wrappers `[A, B, C]`
will be applied like so `A( B( C( handler ) ) )`.

Default `routeHandlerWrappers`:

```js
{
  ...
  routeHandlerWrappers: ({ input }) => [
    logLevelHandlerWrapper<Ctx, any>(input?.logLevel ?? 'info'),
  ],
}
```

---

### router

> **router**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`RouterHandler`\<`T`\[`"context"`\]\>, \[[`CrawleeOneInternalOptionsWithInput`](../type-aliases/CrawleeOneInternalOptionsWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:235](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L235)

Router instance that redirects the request to handlers.

#### Example

```ts
import { createCheerioRouter } from 'crawlee';

({
   ...
  router: createCheerioRouter(),
})
```

---

### routes

> **routes**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](CrawleeOneRoute.md)\<`T`\>\>, \[[`CrawleeOneInternalOptionsWithInput`](../type-aliases/CrawleeOneInternalOptionsWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:265](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L265)

Criteria that un-labelled requests are matched against.

E.g. If `match` function returns truthy value,
the request is passed to the `action` function for processing.

#### Example

```ts
({
  ...
  routes: [{
    // If match returns true, the request is forwarded to handler
    // with label JOB_DETAIL.
    name: 'Job detail',
    label: routeLabels.JOB_DETAIL,
    match: (url) => isUrlJobOffer(url),
  }, {
    // Define custom action function:
    // If match returns true, we replace this request with new one
    // pointing to new domain.
    name: 'Main page',
    label: null,
    match: (url) => url.match(/example\.com/?(?:[?#~]|$)/i),
    action: async (url, ctx, _, handlers) => {
      ctx.log.info(`Redirecting to https://www.new-domain.com`);
      await ctx.crawler.addRequests(['https://www.new-domain.com'], { forefront: true });
    },
  }],
})
```

---

### strict?

> `optional` **strict**: `boolean`

Defined in: [packages/crawlee-one/src/lib/context/types.ts:306](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L306)

When `true`, throw when a URL does not match any route.

If `false`, log an error and skip the URL.

Defaults to `false`.

---

### telemetry?

> `optional` **telemetry**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`T`\[`"telemetry"`\], \[[`CrawleeOneInternalOptionsWithInput`](../type-aliases/CrawleeOneInternalOptionsWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:298](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L298)

Client for telemetry like tracking errors.

---

### validateInput()?

> `optional` **validateInput**: (`input`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:215](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L215)

Validation for the actor input. Should throw error if validation fails.

#### Parameters

##### input

`T`\[`"input"`\] | `null`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>
