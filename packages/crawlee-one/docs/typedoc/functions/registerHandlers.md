[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / registerHandlers

# Function: registerHandlers()

> **registerHandlers**\<`T`, `RouterCtx`\>(`router`, `routes`, `options?`): `Promise`\<`void`\>

Defined in: packages/crawlee-one/src/lib/router/router.ts:93

Register many handlers at once onto the Crawlee's RouterHandler.

The labels under which the handlers are registered are the respective object keys.

Example:

```js
registerHandlers(router, { labelA: fn1, labelB: fn2 });
```

Is similar to:
```js
router.addHandler(labelA, fn1)
router.addHandler(labelB, fn2)
```

You can also specify a list of wrappers to override the behaviour of all handlers
all at once.

A list of wrappers `[a, b, c]` will be applied to the handlers right-to-left as so
`a( b( c( handler ) ) )`.

The entries on the `routerContext` object will be made available to all handlers.

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`CrawlingContext`\<`JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler` \| `BasicCrawler`\<`BasicCrawlingContext`\<`Dictionary`\>\> \| `HttpCrawler`\<`InternalHttpCrawlingContext`\<`any`, `any`, `HttpCrawler`\<`any`\>\>\>, `Dictionary`\>, `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

### RouterCtx

`RouterCtx` *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>

## Parameters

### router

`RouterHandler`\<`T`\[`"context"`\]\>

### routes

`Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](../interfaces/CrawleeOneRoute.md)\<`T`, `RouterCtx`\>\>

### options?

#### handlerWrappers?

[`CrawleeOneRouteWrapper`](../type-aliases/CrawleeOneRouteWrapper.md)\<`T`, `RouterCtx`\>[]

#### onSetCtx?

(`ctx`) => `void`

#### routerContext?

`RouterCtx`

## Returns

`Promise`\<`void`\>
