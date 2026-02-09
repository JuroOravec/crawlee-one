[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / logLevelHandlerWrapper

# Function: logLevelHandlerWrapper()

> **logLevelHandlerWrapper**\<`T`, `RouterCtx`\>(`logLevel`): [`CrawleeOneRouteWrapper`](../type-aliases/CrawleeOneRouteWrapper.md)\<`T`, `RouterCtx`\>

Defined in: [packages/crawlee-one/src/lib/log.ts:49](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/log.ts#L49)

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

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)\<`CrawlingContext`\<`JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler` \| `BasicCrawler`\<`BasicCrawlingContext`\<`Dictionary`\>\> \| `HttpCrawler`\<`InternalHttpCrawlingContext`\<`any`, `any`, `HttpCrawler`\<`any`\>\>\>, `Dictionary`\>, `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

### RouterCtx

`RouterCtx` *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>

## Parameters

### logLevel

`"error"` | `"debug"` | `"info"` | `"warn"` | `"off"`

## Returns

[`CrawleeOneRouteWrapper`](../type-aliases/CrawleeOneRouteWrapper.md)\<`T`, `RouterCtx`\>
