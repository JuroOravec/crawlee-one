[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneActorDef

# Interface: CrawleeOneActorDef\<T\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:138](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L138)

All that's necessary to define a single CrawleeOne actor/crawler.

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)

## Properties

### createCrawler()

> **createCrawler**: (`actorCtx`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`\[`"context"`\]\[`"crawler"`\]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:280](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L280)

#### Parameters

##### actorCtx

`Omit`\<[`CrawleeOneActorInst`](CrawleeOneActorInst.md)\<`T`\>, `"crawler"` \| `"runCrawler"` \| `"metamorph"` \| `"pushData"` \| `"pushRequests"` \| `"startUrls"`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`\[`"context"`\]\[`"crawler"`\]\>

***

### input?

> `optional` **input**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`T`\[`"input"`\], \[`CrawleeOneActorDef`\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:151](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L151)

Supply actor input via this field instead of from `io.getInput()`.

If `input` is NOT defined, the Actor input is obtained from `io.getInput()`,
which by default corresponds to Apify's `Actor.getInput()`.

If `input` is defined, then `io.getInput()` is ignored.

***

### inputDefaults?

> `optional` **inputDefaults**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`T`\[`"input"`\], \[`CrawleeOneActorDef`\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:153](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L153)

Default input that may be overriden by `input` and `io.getInput()`.

***

### inputFields?

> `optional` **inputFields**: `Record`\<`string`, `Field`\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:201](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L201)

Field objects describing the actor input schema.

If provided, crawlee-one auto-validates input against
embedded Zod schemas before calling `validateInput`.

***

### io

> **io**: `T`\[`"io"`\]

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:140](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L140)

Client for communicating with cloud/local storage.

***

### mergeInput?

> `optional` **mergeInput**: `boolean` \| (`sources`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`\[`"input"`\]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:186](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L186)

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

### proxy?

> `optional` **proxy**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`ProxyConfiguration`, \[[`CrawleeOneActorDefWithInput`](../type-aliases/CrawleeOneActorDefWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:271](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L271)

***

### routeHandlerWrappers?

> `optional` **routeHandlerWrappers**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<[`CrawleeOneRouteWrapper`](../type-aliases/CrawleeOneRouteWrapper.md)\<`T`, [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>\>[], \[[`CrawleeOneActorDefWithInput`](../type-aliases/CrawleeOneActorDefWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:265](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L265)

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

***

### router

> **router**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`RouterHandler`\<`T`\[`"context"`\]\>, \[[`CrawleeOneActorDefWithInput`](../type-aliases/CrawleeOneActorDefWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:214](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L214)

Router instance that redirects the request to handlers.

#### Example

```ts
import { createCheerioRouter } from 'crawlee';

({
   ...
  router: createCheerioRouter(),
})
```

***

### routes

> **routes**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](CrawleeOneRoute.md)\<`T`, [`CrawleeOneActorRouterCtx`](../type-aliases/CrawleeOneActorRouterCtx.md)\<`T`\>\>\>, \[[`CrawleeOneActorDefWithInput`](../type-aliases/CrawleeOneActorDefWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:244](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L244)

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

***

### telemetry?

> `optional` **telemetry**: [`MaybeAsyncFn`](../type-aliases/MaybeAsyncFn.md)\<`T`\[`"telemetry"`\], \[[`CrawleeOneActorDefWithInput`](../type-aliases/CrawleeOneActorDefWithInput.md)\<`T`\>\]\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:277](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L277)

Client for telemetry like tracking errors.

***

### validateInput()?

> `optional` **validateInput**: (`input`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:194](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L194)

Validation for the actor input. Should throw error if validation fails.

#### Parameters

##### input

`T`\[`"input"`\] | `null`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>
