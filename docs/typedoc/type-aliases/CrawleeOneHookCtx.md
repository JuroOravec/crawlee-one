[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneHookCtx

# Type alias: CrawleeOneHookCtx\<T\>

> **CrawleeOneHookCtx**\<`T`\>: `Pick`\<[`CrawleeOneActorInst`](../interfaces/CrawleeOneActorInst.md)\<`T`\>, `"input"` \| `"state"`\> & `object`

Context passed to user-defined functions passed from input

## Type declaration

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

## Type parameters

• **T** *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

## Source

[src/lib/actor/types.ts:104](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L104)
