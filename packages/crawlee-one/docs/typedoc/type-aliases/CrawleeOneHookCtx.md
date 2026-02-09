[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneHookCtx

# Type Alias: CrawleeOneHookCtx\<T\>

> **CrawleeOneHookCtx**\<`T`\> = `Pick`\<[`CrawleeOneActorInst`](../interfaces/CrawleeOneActorInst.md)\<`T`\>, `"input"` \| `"state"`\> & `object`

Defined in: [packages/crawlee-one/src/lib/actor/types.ts:104](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/actor/types.ts#L104)

Context passed to user-defined functions passed from input

## Type Declaration

### io

> **io**: `T`\[`"io"`\]

Instance of [CrawleeOneIO](../interfaces/CrawleeOneIO.md) that manages results (Dataset), Requests (RequestQueue), and cache (KeyValueStore).

By default this is the Apify Actor class, see https://docs.apify.com/sdk/js/reference/class/Actor.

### itemCacheKey

> **itemCacheKey**: *typeof* [`itemCacheKey`](../functions/itemCacheKey.md)

A function you can use to get cacheID for current `entry`.
It takes the entry itself, and a list of properties to be used for hashing.

By default, you should pass `input.cachePrimaryKeys` to it.

### sendRequest

> **sendRequest**: *typeof* `gotScraping`

Fetch remote data. Uses 'got-scraping', same as Apify's `sendRequest`.

See https://crawlee.dev/docs/guides/got-scraping

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)
