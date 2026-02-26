[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneRouteHandler

# Type Alias: CrawleeOneRouteHandler\<T\>

> **CrawleeOneRouteHandler**\<`T`\> = `Parameters`\<`CrawlerRouter`\<`T`\[`"context"`\] & [`CrawleeOneRouteHandlerCtxExtras`](CrawleeOneRouteHandlerCtxExtras.md)\<`T`\>\>\[`"addHandler"`\]\>\[`1`\]

Defined in: [packages/crawlee-one/src/lib/router/types.ts:12](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/router/types.ts#L12)

Function that's passed to Crawlee's `router.addHandler(label, handler)`

The handler context is enriched with CrawleeOne's `actor`, `pushData`, `addRequests`, etc.

## Type Parameters

### T

`T` _extends_ [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md)
