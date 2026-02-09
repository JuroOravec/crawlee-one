[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneRouteWrapper

# Type Alias: CrawleeOneRouteWrapper()\<T, RouterCtx\>

> **CrawleeOneRouteWrapper**\<`T`, `RouterCtx`\> = (`handler`) => [`MaybePromise`](MaybePromise.md)\<(`ctx`) => `Promise`\<`void`\> \| `Awaitable`\<`void`\>\>

Defined in: packages/crawlee-one/src/lib/router/types.ts:19

Wrapper that modifies behavior of CrawleeOneRouteHandler

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

### RouterCtx

`RouterCtx` *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](CrawleeOneRouteCtx.md)\<`T`\>

## Parameters

### handler

(`ctx`) => `Promise`\<`void`\> \| `Awaitable`\<`void`\>

## Returns

[`MaybePromise`](MaybePromise.md)\<(`ctx`) => `Promise`\<`void`\> \| `Awaitable`\<`void`\>\>
