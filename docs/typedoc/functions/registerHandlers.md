[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / registerHandlers

# Function: registerHandlers()

> **registerHandlers**\<`T`, `RouterCtx`\>(`router`, `routes`, `options`?): `Promise`\<`void`\>

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

## Type parameters

• **T** *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`CrawlingContext`\<`JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler` \| `BasicCrawler`\<`BasicCrawlingContext`\<`Dictionary`\>\> \| `HttpCrawler`\<`InternalHttpCrawlingContext`\<`any`, `any`, `HttpCrawler`\<`any`\>\>\>, `Dictionary`\>, `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

• **RouterCtx** *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>

## Parameters

• **router**: `RouterHandler`\<`T`\[`"context"`\]\>

• **routes**: `Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](../interfaces/CrawleeOneRoute.md)\<`T`, `RouterCtx`\>\>

• **options?**

• **options.handlerWrappers?**: [`CrawleeOneRouteWrapper`](../type-aliases/CrawleeOneRouteWrapper.md)\<`T`, `RouterCtx`\>[]

• **options.onSetCtx?**

• **options.routerContext?**: `RouterCtx`

## Returns

`Promise`\<`void`\>

## Source

[src/lib/router/router.ts:93](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/router/router.ts#L93)
