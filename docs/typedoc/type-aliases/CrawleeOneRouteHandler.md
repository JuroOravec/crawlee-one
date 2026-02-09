[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / CrawleeOneRouteHandler

# Type Alias: CrawleeOneRouteHandler\<T, RouterCtx\>

> **CrawleeOneRouteHandler**\<`T`, `RouterCtx`\> = `Parameters`\<`CrawlerRouter`\<`T`\[`"context"`\] & `RouterCtx`\>\[`"addHandler"`\]\>\[`1`\]

Defined in: [src/lib/router/types.ts:13](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/router/types.ts#L13)

Function that's passed to `router.addHandler(label, handler)`

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

### RouterCtx

`RouterCtx` *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](CrawleeOneRouteCtx.md)\<`T`\>
