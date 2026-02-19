[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / logLevelHandlerWrapper

# Function: logLevelHandlerWrapper()

> **logLevelHandlerWrapper**\<`T`\>(`logLevel`): [`CrawleeOneRouteMiddleware`](../type-aliases/CrawleeOneRouteMiddleware.md)\<`T`\>

Defined in: [packages/crawlee-one/src/lib/log.ts:49](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/log.ts#L49)

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

`T` *extends* [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md)\<`CrawlingContext`\<`JSDOMCrawler` \| `CheerioCrawler` \| `PlaywrightCrawler` \| `PuppeteerCrawler` \| `BasicCrawler`\<`BasicCrawlingContext`\<`Dictionary`\>\> \| `HttpCrawler`\<`InternalHttpCrawlingContext`\<`any`, `any`, `HttpCrawler`\<`any`\>\>\>, `Dictionary`\>, `string`, `Record`\<`string`, `any`\>, [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>, [`CrawleeOneTelemetry`](../interfaces/CrawleeOneTelemetry.md)\<`any`, `any`\>\>

## Parameters

### logLevel

`"error"` | `"debug"` | `"info"` | `"warn"` | `"off"`

## Returns

[`CrawleeOneRouteMiddleware`](../type-aliases/CrawleeOneRouteMiddleware.md)\<`T`\>
