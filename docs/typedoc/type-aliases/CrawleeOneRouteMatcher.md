[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneRouteMatcher

# Type alias: CrawleeOneRouteMatcher\<T, RouterCtx\>

> **CrawleeOneRouteMatcher**\<`T`, `RouterCtx`\>: [`MaybeArray`](MaybeArray.md)\<`RegExp` \| [`CrawleeOneRouteMatcherFn`](CrawleeOneRouteMatcherFn.md)\<`T`, `RouterCtx`\>\>

Function or RegExp that checks if the [CrawleeOneRoute](../interfaces/CrawleeOneRoute.md) this Matcher belongs to
should handle the given request.

If the Matcher returns truthy value, the request is passed to the `action`
function of the same CrawleeOneRoute.

The Matcher can be:
- Regular expression
- Function
- Array of <RegExp | Function>

## Type parameters

• **T** *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

• **RouterCtx** *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](CrawleeOneRouteCtx.md)\<`T`\>

## Source

[src/lib/router/types.ts:56](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/router/types.ts#L56)
