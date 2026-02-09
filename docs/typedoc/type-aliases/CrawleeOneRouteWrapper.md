[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / CrawleeOneRouteWrapper

# Type Alias: CrawleeOneRouteWrapper()\<T, RouterCtx\>

> **CrawleeOneRouteWrapper**\<`T`, `RouterCtx`\> = (`handler`) => [`MaybePromise`](MaybePromise.md)\<(`ctx`) => `Promise`\<`void`\> \| `Awaitable`\<`void`\>\>

Defined in: [src/lib/router/types.ts:19](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/router/types.ts#L19)

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
