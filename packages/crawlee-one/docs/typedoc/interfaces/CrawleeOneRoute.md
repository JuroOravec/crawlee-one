[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneRoute

# Interface: CrawleeOneRoute\<T, RouterCtx\>

Defined in: [packages/crawlee-one/src/lib/router/types.ts:36](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/router/types.ts#L36)

Route that a request will be sent to if the request doesn't have a label yet,
and if the `match` function returns truthy value.

If `match` function returns truthy value, the request is passed to the `action`
function for processing.

NOTE: If multiple records would match the request, then the first record to match
a request will process that request.

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)

### RouterCtx

`RouterCtx` *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>

## Properties

### handler()

> **handler**: (`ctx`) => `Awaitable`\<`void`\>

Defined in: [packages/crawlee-one/src/lib/router/types.ts:41](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/router/types.ts#L41)

#### Parameters

##### ctx

`Omit`\<`T`\[`"context"`\] & `RouterCtx`, `"request"`\> & `object`

#### Returns

`Awaitable`\<`void`\>

***

### match

> **match**: [`CrawleeOneRouteMatcher`](../type-aliases/CrawleeOneRouteMatcher.md)\<`T`, `RouterCtx`\>

Defined in: [packages/crawlee-one/src/lib/router/types.ts:40](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/router/types.ts#L40)
