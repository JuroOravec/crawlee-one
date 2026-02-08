[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneRoute

# Interface: CrawleeOneRoute\<T, RouterCtx\>

Route that a request will be sent to if the request doesn't have a label yet,
and if the `match` function returns truthy value.

If `match` function returns truthy value, the request is passed to the `action`
function for processing.

NOTE: If multiple records would match the request, then the first record to match
a request will process that request.

## Type parameters

• **T** *extends* [`CrawleeOneCtx`](CrawleeOneCtx.md)

• **RouterCtx** *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](../type-aliases/CrawleeOneRouteCtx.md)\<`T`\>

## Properties

### handler()

> **handler**: (`ctx`) => `Awaitable`\<`void`\>

#### Parameters

• **ctx**: `Omit`\<`T`\[`"context"`\] & `RouterCtx`, `"request"`\> & `object`

#### Returns

`Awaitable`\<`void`\>

#### Source

[src/lib/router/types.ts:41](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/router/types.ts#L41)

***

### match

> **match**: [`CrawleeOneRouteMatcher`](../type-aliases/CrawleeOneRouteMatcher.md)\<`T`, `RouterCtx`\>

#### Source

[src/lib/router/types.ts:40](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/router/types.ts#L40)
