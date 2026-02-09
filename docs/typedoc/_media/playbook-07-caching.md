# 7. Caching: Extract only new or previously-seen entries

> **TL;DR:** Cache scraped entries across runs to enable incremental scraping -- only process what's new.

> **Note on input format:** Examples show input as JSON. When using `crawlee-one` directly, pass the same fields via the `input` option:
>
> ```ts
> await crawleeOne({ type: '...', input: { startUrls: ['https://...'] } });
> ```

## The problem

Sites with time-sensitive data -- job boards, classifieds, social feeds -- add new entries continuously. You don't know when, so you poll frequently (every 5-15 minutes). But re-scraping the entire site each time is expensive and places unnecessary load on the target.

The solution: scrape only entries that haven't been seen before. When the scraper hits previously-cached entries, it stops.

## Strategy

1. Run the scraper. On each entry, check a cache to see if it's already been scraped.
2. If the entry is new, save it to the dataset _and_ add it to the cache.
3. If the entry is already in the cache, skip it (and optionally stop scraping).
4. On subsequent runs, reuse the same cache. Only new entries are processed.

## Cache input fields

- `outputCacheStoreId` -- ID of the KeyValueStore used as the cache.
- `outputCachePrimaryKeys` -- Fields used to generate the cache key (e.g. `["id"]`).
- `outputCacheActionOnResult` -- Whether to `"add"`, `"remove"`, or `"overwrite"` cache entries on each result.

Custom functions also receive `itemCacheKey`, which generates the cache key from an entry based on the configured primary keys.

## Working with the cache

**Saving an entry to the cache:**

```js
async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
  const key = itemCacheKey(entry, input.outputCachePrimaryKeys);
  const store = await Actor.openKeyValueStore(input.outputCacheStoreId);
  await store.setValue(key, entry);
};
```

**Checking if an entry exists in the cache:**

```js
async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
  const key = itemCacheKey(entry, input.outputCachePrimaryKeys);
  const store = await Actor.openKeyValueStore(input.outputCacheStoreId);
  const exists = !!(await store.getValue(key));
};
```

> **Choosing primary keys:** Use stable, unique identifiers. An item's `id` is ideal. Titles may change. Timestamps and descriptions are poor choices -- they generate false negatives because they change across runs.
>
> If `outputCachePrimaryKeys` is not set, the entire entry is serialized as the key. This is almost never what you want, since fields like scrape timestamps change on every run.

## Scraping only new entries

Combine the cache with output filtering to skip cached entries and stop scraping when old entries are reached:

```js
{
  outputFilterBefore: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    state.store = await Actor.openKeyValueStore(input.outputCacheStoreId);
    state.queue = await Actor.openRequestQueue(input.requestQueueId);

    state.isEntryInCache = async (entry, primaryKeys = input.outputCachePrimaryKeys) => {
      const key = itemCacheKey(entry, primaryKeys);
      return !!(await state.store.getValue(key));
    };

    state.emptyRequestQueue = async () => {
      await state.queue.clear();
    };
  },

  outputFilter: async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
    const cached = await state.isEntryInCache(entry);

    if (cached) {
      await state.emptyRequestQueue();
    }

    return !cached;
  },
}
```

This achieves two things:

- New entries are saved; cached entries are skipped.
- When a cached entry is found, all remaining requests are cleared from the queue.

## Assumptions and limitations

This approach assumes:

- **Ordered requests:** Newest entries are grouped together and processed first. This holds for most chronologically sorted sites (job boards, classifieds), but not for sites that sort by engagement metrics (Facebook, Instagram, LinkedIn). On those sites, do not call `RequestQueue.clear()` -- there may be unseen entries further in the queue.

- **No concurrency:** With `maxConcurrency > 1`, one instance may encounter cached entries before another finishes processing new ones. For concurrent setups, use a heuristic threshold (e.g. clear the queue after 10-20 consecutive cache hits) instead of clearing on the first hit.

- **Stable queue ordering:** The order entries are dequeued may not exactly match the order they were enqueued, especially when entries from the same page are added simultaneously.
