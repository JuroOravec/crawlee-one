[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / CrawleeOneRouteMatcher

# Type Alias: CrawleeOneRouteMatcher\<T, RouterCtx\>

> **CrawleeOneRouteMatcher**\<`T`, `RouterCtx`\> = [`MaybeArray`](MaybeArray.md)\<`RegExp` \| [`CrawleeOneRouteMatcherFn`](CrawleeOneRouteMatcherFn.md)\<`T`, `RouterCtx`\>\>

Defined in: [src/lib/router/types.ts:56](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/router/types.ts#L56)

Function or RegExp that checks if the [CrawleeOneRoute](../interfaces/CrawleeOneRoute.md) this Matcher belongs to
should handle the given request.

If the Matcher returns truthy value, the request is passed to the `action`
function of the same CrawleeOneRoute.

The Matcher can be:
- Regular expression
- Function
- Array of <RegExp | Function>

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

### RouterCtx

`RouterCtx` *extends* `Record`\<`string`, `any`\> = [`CrawleeOneRouteCtx`](CrawleeOneRouteCtx.md)\<`T`\>
