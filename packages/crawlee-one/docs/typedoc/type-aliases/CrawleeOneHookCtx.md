[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneHookCtx

# Type Alias: CrawleeOneHookCtx\<T\>

> **CrawleeOneHookCtx**\<`T`\> = `Pick`\<[`CrawleeOneContext`](../interfaces/CrawleeOneContext.md)\<`T`\>, `"input"` \| `"state"`\> & `object`

Defined in: [packages/crawlee-one/src/lib/context/types.ts:127](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L127)

Context passed to user-defined functions passed from input

## Type Declaration

### io

> **io**: `T`\[`"io"`\]

Instance of [CrawleeOneIO](../interfaces/CrawleeOneIO.md) that manages results (Dataset), Requests (RequestQueue), and cache (KeyValueStore).

By default this is the Apify Actor class, see https://docs.apify.com/sdk/js/reference/class/Actor.

### itemCacheKey

> **itemCacheKey**: _typeof_ `itemCacheKey`

A function you can use to get cacheID for current `entry`.
It takes the entry itself, and a list of properties to be used for hashing.

By default, you should pass `input.cachePrimaryKeys` to it.

### sendRequest

> **sendRequest**: _typeof_ `gotScraping`

Fetch remote data. Uses 'got-scraping', same as Apify's `sendRequest`.

See https://crawlee.dev/docs/guides/got-scraping

## Type Parameters

### T

`T` _extends_ [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md)
