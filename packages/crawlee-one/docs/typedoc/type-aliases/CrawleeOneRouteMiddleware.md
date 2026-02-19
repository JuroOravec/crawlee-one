[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneRouteMiddleware

# Type Alias: CrawleeOneRouteMiddleware()\<T\>

> **CrawleeOneRouteMiddleware**\<`T`\> = (`handler`) => [`MaybePromise`](MaybePromise.md)\<(`ctx`) => `Promise`\<`void`\> \| `Awaitable`\<`void`\>\>

Defined in: [packages/crawlee-one/src/lib/router/types.ts:26](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/router/types.ts#L26)

Wrapper that modifies behavior of CrawleeOneRouteHandler

## Type Parameters

### T

`T` *extends* [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md)

## Parameters

### handler

(`ctx`) => `Promise`\<`void`\> \| `Awaitable`\<`void`\>

## Returns

[`MaybePromise`](MaybePromise.md)\<(`ctx`) => `Promise`\<`void`\> \| `Awaitable`\<`void`\>\>
