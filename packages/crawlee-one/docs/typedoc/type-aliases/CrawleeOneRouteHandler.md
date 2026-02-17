[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneRouteHandler

# Type Alias: CrawleeOneRouteHandler\<T, RouterCtx\>

> **CrawleeOneRouteHandler**\<`T`, `RouterCtx`\> = `Parameters`\<`CrawlerRouter`\<`T`\[`"context"`\] & `RouterCtx`\>\[`"addHandler"`\]\>\[`1`\]

Defined in: [packages/crawlee-one/src/lib/router/types.ts:14](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/router/types.ts#L14)

Function that's passed to `router.addHandler(label, handler)`

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

### RouterCtx

`RouterCtx` *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](CrawleeOneRouteCtx.md)\<`T`\>
