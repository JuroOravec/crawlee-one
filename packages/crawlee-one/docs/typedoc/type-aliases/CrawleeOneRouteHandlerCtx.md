[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneRouteHandlerCtx

# Type Alias: CrawleeOneRouteHandlerCtx\<T\>

> **CrawleeOneRouteHandlerCtx**\<`T`\> = `Parameters`\<[`CrawleeOneRouteHandler`](CrawleeOneRouteHandler.md)\<`T`\>\>\[`0`\]

Defined in: [packages/crawlee-one/src/lib/router/types.ts:21](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/router/types.ts#L21)

Handler context - combination of:
- Crawlee context as it appears in `Router.addHandler()`
- Merged with CrawleeOne's `actor`, `pushData`, `addRequests`, etc.

## Type Parameters

### T

`T` *extends* [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md)
