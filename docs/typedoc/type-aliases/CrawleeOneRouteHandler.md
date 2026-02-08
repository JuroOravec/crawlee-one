[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneRouteHandler

# Type alias: CrawleeOneRouteHandler\<T, RouterCtx\>

> **CrawleeOneRouteHandler**\<`T`, `RouterCtx`\>: `Parameters`\<`CrawlerRouter`\<`T`\[`"context"`\] & `RouterCtx`\>\[`"addHandler"`\]\>\[`1`\]

Function that's passed to `router.addHandler(label, handler)`

## Type parameters

• **T** *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

• **RouterCtx** *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](CrawleeOneRouteCtx.md)\<`T`\>

## Source

[src/lib/router/types.ts:13](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/router/types.ts#L13)
