[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneRouteMatcherFn

# Type alias: CrawleeOneRouteMatcherFn()\<T, RouterCtx\>

> **CrawleeOneRouteMatcherFn**\<`T`, `RouterCtx`\>: (`url`, `ctx`, `route`, `routes`) => `unknown`

Function variant of Matcher. Matcher that checks if the [CrawleeOneRoute](../interfaces/CrawleeOneRoute.md)
this Matcher belongs to should handle the given request.

If the Matcher returns truthy value, the request is passed to the `action`
function of the same CrawleeOneRoute.

## Type parameters

• **T** *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

• **RouterCtx** *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](CrawleeOneRouteCtx.md)\<`T`\>

## Parameters

• **url**: `string`

• **ctx**: [`CrawleeOneRouteCtx`](CrawleeOneRouteCtx.md)\<`T`, `RouterCtx`\>

• **route**: [`CrawleeOneRoute`](../interfaces/CrawleeOneRoute.md)\<`T`, `RouterCtx`\>

• **routes**: `Record`\<`T`\[`"labels"`\], [`CrawleeOneRoute`](../interfaces/CrawleeOneRoute.md)\<`T`, `RouterCtx`\>\>

## Returns

`unknown`

## Source

[src/lib/router/types.ts:68](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/router/types.ts#L68)
