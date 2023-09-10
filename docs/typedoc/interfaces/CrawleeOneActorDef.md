[crawlee-one](../README.md) / [Exports](../modules.md) / CrawleeOneActorDef

# Interface: CrawleeOneActorDef<T\>

All that's necessary to define a single CrawleeOne actor/crawler.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](CrawleeOneCtx.md) |

## Table of contents

### Properties

- [createCrawler](CrawleeOneActorDef.md#createcrawler)
- [input](CrawleeOneActorDef.md#input)
- [inputDefaults](CrawleeOneActorDef.md#inputdefaults)
- [io](CrawleeOneActorDef.md#io)
- [mergeInput](CrawleeOneActorDef.md#mergeinput)
- [proxy](CrawleeOneActorDef.md#proxy)
- [routeHandlerWrappers](CrawleeOneActorDef.md#routehandlerwrappers)
- [router](CrawleeOneActorDef.md#router)
- [routes](CrawleeOneActorDef.md#routes)
- [telemetry](CrawleeOneActorDef.md#telemetry)
- [validateInput](CrawleeOneActorDef.md#validateinput)

## Properties

### createCrawler

• **createCrawler**: (`actorCtx`: `Omit`<[`CrawleeOneActorInst`](CrawleeOneActorInst.md)<`T`\>, ``"crawler"`` \| ``"pushData"`` \| ``"startUrls"`` \| ``"runCrawler"`` \| ``"metamorph"`` \| ``"pushRequests"``\>) => [`MaybePromise`](../modules.md#maybepromise)<`T`[``"context"``][``"crawler"``]\>

#### Type declaration

▸ (`actorCtx`): [`MaybePromise`](../modules.md#maybepromise)<`T`[``"context"``][``"crawler"``]\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `actorCtx` | `Omit`<[`CrawleeOneActorInst`](CrawleeOneActorInst.md)<`T`\>, ``"crawler"`` \| ``"pushData"`` \| ``"startUrls"`` \| ``"runCrawler"`` \| ``"metamorph"`` \| ``"pushRequests"``\> |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`T`[``"context"``][``"crawler"``]\>

#### Defined in

[src/lib/actor/types.ts:271](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L271)

___

### input

• `Optional` **input**: [`MaybeAsyncFn`](../modules.md#maybeasyncfn)<`T`[``"input"``], [[`CrawleeOneActorDef`](CrawleeOneActorDef.md)<`T`\>]\>

Supply actor input via this field instead of from `io.getInput()`.

If `input` is NOT defined, the Actor input is obtained from `io.getInput()`,
which by default corresponds to Apify's `Actor.getInput()`.

If `input` is defined, then `io.getInput()` is ignored.

#### Defined in

[src/lib/actor/types.ts:149](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L149)

___

### inputDefaults

• `Optional` **inputDefaults**: [`MaybeAsyncFn`](../modules.md#maybeasyncfn)<`T`[``"input"``], [[`CrawleeOneActorDef`](CrawleeOneActorDef.md)<`T`\>]\>

Default input that may be overriden by `input` and `io.getInput()`.

#### Defined in

[src/lib/actor/types.ts:151](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L151)

___

### io

• **io**: `T`[``"io"``]

Client for communicating with cloud/local storage.

#### Defined in

[src/lib/actor/types.ts:138](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L138)

___

### mergeInput

• `Optional` **mergeInput**: `boolean` \| (`sources`: { `defaults`: `Partial`<`T`[``"input"``]\> ; `env`: `Partial`<`T`[``"input"``]\> ; `overrides`: `Partial`<`T`[``"input"``]\>  }) => [`MaybePromise`](../modules.md#maybepromise)<`T`[``"input"``]\>

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

[src/lib/actor/types.ts:184](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L184)

___

### proxy

• `Optional` **proxy**: [`MaybeAsyncFn`](../modules.md#maybeasyncfn)<`ProxyConfiguration`, [[`CrawleeOneActorDefWithInput`](../modules.md#crawleeoneactordefwithinput)<`T`\>]\>

#### Defined in

[src/lib/actor/types.ts:262](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L262)

___

### routeHandlerWrappers

• `Optional` **routeHandlerWrappers**: [`MaybeAsyncFn`](../modules.md#maybeasyncfn)<[`CrawleeOneRouteWrapper`](../modules.md#crawleeoneroutewrapper)<`T`, [`CrawleeOneActorRouterCtx`](../modules.md#crawleeoneactorrouterctx)<`T`\>\>[], [[`CrawleeOneActorDefWithInput`](../modules.md#crawleeoneactordefwithinput)<`T`\>]\>

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

#### Defined in

[src/lib/actor/types.ts:256](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L256)

___

### router

• **router**: [`MaybeAsyncFn`](../modules.md#maybeasyncfn)<`RouterHandler`<`T`[``"context"``]\>, [[`CrawleeOneActorDefWithInput`](../modules.md#crawleeoneactordefwithinput)<`T`\>]\>

Router instance that redirects the request to handlers.

**`Example`**

```ts
import { createCheerioRouter } from 'crawlee';

({
   ...
  router: createCheerioRouter(),
})
```

#### Defined in

[src/lib/actor/types.ts:205](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L205)

___

### routes

• **routes**: [`MaybeAsyncFn`](../modules.md#maybeasyncfn)<`Record`<`T`[``"labels"``], [`CrawleeOneRoute`](CrawleeOneRoute.md)<`T`, [`CrawleeOneActorRouterCtx`](../modules.md#crawleeoneactorrouterctx)<`T`\>\>\>, [[`CrawleeOneActorDefWithInput`](../modules.md#crawleeoneactordefwithinput)<`T`\>]\>

Criteria that un-labelled requests are matched against.

E.g. If `match` function returns truthy value,
the request is passed to the `action` function for processing.

**`Example`**

```ts
({
  ...
  routes: [{
    // If match returns true, the request is forwarded to handler
    // with label JOB_DETAIL.
    name: 'Job detail',
    label: routeLabels.JOB_DETAIL,
    match: (url) => isUrlOfJobOffer(url),
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

#### Defined in

[src/lib/actor/types.ts:235](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L235)

___

### telemetry

• `Optional` **telemetry**: [`MaybeAsyncFn`](../modules.md#maybeasyncfn)<`T`[``"telemetry"``], [[`CrawleeOneActorDefWithInput`](../modules.md#crawleeoneactordefwithinput)<`T`\>]\>

Client for telemetry like tracking errors.

#### Defined in

[src/lib/actor/types.ts:268](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L268)

___

### validateInput

• `Optional` **validateInput**: (`input`: ``null`` \| `T`[``"input"``]) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`input`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

Validation for the actor input. Should throw error if validation fails.

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | ``null`` \| `T`[``"input"``] |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/actor/types.ts:192](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/actor/types.ts#L192)
