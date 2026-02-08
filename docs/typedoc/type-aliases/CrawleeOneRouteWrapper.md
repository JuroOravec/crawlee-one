[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneRouteWrapper

# Type alias: CrawleeOneRouteWrapper()\<T, RouterCtx\>

> **CrawleeOneRouteWrapper**\<`T`, `RouterCtx`\>: (`handler`) => [`MaybePromise`](MaybePromise.md)\<(`ctx`) => `Promise`\<`void`\> \| `Awaitable`\<`void`\>\>

Wrapper that modifies behavior of CrawleeOneRouteHandler

## Type parameters

• **T** *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

• **RouterCtx** *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](CrawleeOneRouteCtx.md)\<`T`\>

## Parameters

• **handler**

## Returns

[`MaybePromise`](MaybePromise.md)\<(`ctx`) => `Promise`\<`void`\> \| `Awaitable`\<`void`\>\>

## Source

[src/lib/router/types.ts:19](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/router/types.ts#L19)
