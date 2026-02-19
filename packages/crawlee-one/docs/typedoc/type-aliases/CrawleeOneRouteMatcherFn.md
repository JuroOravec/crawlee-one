[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneRouteMatcherFn

# Type Alias: CrawleeOneRouteMatcherFn()\<T\>

> **CrawleeOneRouteMatcherFn**\<`T`\> = (`url`, `ctx`, `route`, `routes`) => `unknown`

Defined in: [packages/crawlee-one/src/lib/router/types.ts:112](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/router/types.ts#L112)

Function variant of Matcher. Matcher that checks if the [CrawleeOneRoute](../interfaces/CrawleeOneRoute.md)
this Matcher belongs to should handle the given request.

If the Matcher returns truthy value, the request is passed to the `action`
function of the same CrawleeOneRoute.

## Type Parameters

### T

`T` *extends* [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md)

## Parameters

### url

`string`

### ctx

[`CrawleeOneRouteHandlerCtx`](CrawleeOneRouteHandlerCtx.md)\<`T`\>

### route

[`CrawleeOneRoute`](../interfaces/CrawleeOneRoute.md)\<`T`\>

### routes

`Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](../interfaces/CrawleeOneRoute.md)\<`T`\>\>

## Returns

`unknown`
