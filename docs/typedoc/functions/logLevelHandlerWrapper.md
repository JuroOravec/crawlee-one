[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / logLevelHandlerWrapper

# Function: logLevelHandlerWrapper()

> **logLevelHandlerWrapper**\<`T`, `RouterCtx`\>(`logLevel`): [`CrawleeOneRouteWrapper`](../type-aliases/CrawleeOneRouteWrapper.md)\<`T`, `RouterCtx`\>

Wrapper for Crawlee route handler that configures log level.

Usage with Crawlee's `RouterHandler.addDefaultHandler`
```ts
const wrappedHandler = logLevelHandlerWrapper('debug')(handler)
await router.addDefaultHandler<Ctx>(wrappedHandler);
```

Usage with Crawlee's `RouterHandler.addHandler`
```ts
const wrappedHandler = logLevelHandlerWrapper('error')(handler)
await router.addHandler<Ctx>(wrappedHandler);
```

Usage with `createCrawleeOne`
```ts
const actor = await createCrawleeOne<CheerioCrawlingContext>({
  validateInput,
  router: createCheerioRouter(),
  routes,
  routeHandlers: ({ input }) => createHandlers(input!),
  routeHandlerWrappers: ({ input }) => [
    logLevelHandlerWrapper<CheerioCrawlingContext<any, any>>(input?.logLevel ?? 'info'),
  ],
  createCrawler: ({ router, input }) => createCrawler({ router, input, crawlerConfig }),
});
```

## Type parameters

• **T** *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`CrawlingContext`\<`JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler` \| `BasicCrawler`\<`BasicCrawlingContext`\<`Dictionary`\>\> \| `HttpCrawler`\<`InternalHttpCrawlingContext`\<`any`, `any`, `HttpCrawler`\<`any`\>\>\>, `Dictionary`\>, `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

• **RouterCtx** *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>

## Parameters

• **logLevel**: `"error"` \| `"debug"` \| `"info"` \| `"warn"` \| `"off"`

## Returns

[`CrawleeOneRouteWrapper`](../type-aliases/CrawleeOneRouteWrapper.md)\<`T`, `RouterCtx`\>

## Source

[src/lib/log.ts:49](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/log.ts#L49)
