[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneRouteHandler

# Type Alias: CrawleeOneRouteHandler\<T, RouterCtx\>

> **CrawleeOneRouteHandler**\<`T`, `RouterCtx`\> = `Parameters`\<`CrawlerRouter`\<`T`\[`"context"`\] & `RouterCtx`\>\[`"addHandler"`\]\>\[`1`\]

Defined in: [packages/crawlee-one/src/lib/router/types.ts:13](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/router/types.ts#L13)

Function that's passed to `router.addHandler(label, handler)`

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

### RouterCtx

`RouterCtx` *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](CrawleeOneRouteCtx.md)\<`T`\>
