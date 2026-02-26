[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneRouteMatcher

# Type Alias: CrawleeOneRouteMatcher\<T\>

> **CrawleeOneRouteMatcher**\<`T`\> = [`MaybeArray`](MaybeArray.md)\<`RegExp` \| [`CrawleeOneRouteMatcherFn`](CrawleeOneRouteMatcherFn.md)\<`T`\>\>

Defined in: [packages/crawlee-one/src/lib/router/types.ts:101](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/router/types.ts#L101)

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

`T` _extends_ [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md)
