[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneRouteMatcherFn

# Type Alias: CrawleeOneRouteMatcherFn()\<T, RouterCtx\>

> **CrawleeOneRouteMatcherFn**\<`T`, `RouterCtx`\> = (`url`, `ctx`, `route`, `routes`) => `unknown`

Defined in: [packages/crawlee-one/src/lib/router/types.ts:68](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/router/types.ts#L68)

Function variant of Matcher. Matcher that checks if the [CrawleeOneRoute](../interfaces/CrawleeOneRoute.md)
this Matcher belongs to should handle the given request.

If the Matcher returns truthy value, the request is passed to the `action`
function of the same CrawleeOneRoute.

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

### RouterCtx

`RouterCtx` *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](CrawleeOneRouteCtx.md)\<`T`\>

## Parameters

### url

`string`

### ctx

[`CrawleeOneRouteCtx`](CrawleeOneRouteCtx.md)\<`T`, `RouterCtx`\>

### route

[`CrawleeOneRoute`](../interfaces/CrawleeOneRoute.md)\<`T`, `RouterCtx`\>

### routes

`Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](../interfaces/CrawleeOneRoute.md)\<`T`, `RouterCtx`\>\>

## Returns

`unknown`
