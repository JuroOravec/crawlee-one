# 7. Caching: Extract only new or only previously-seen entries

> NOTE:
>
> In these examples, the input is mostly shown as a JSON, e.g.:
>
> ```json
> {
>   "startUrls": ["https://www.example.com/path/1"]
> }
> ```
>
> If you are using the `crawlee-one` package directly, then that is the same as:
>
> ```ts
> import { crawleeOne } from 'crawlee-one';
> await crawleeOne({
>   type: '...',
>   input: {
>     startUrls: ['https://www.example.com/path/1'],
>   },
> });
> ```

Seeing how custom transformations and filtering work, now let's put the two together to learn how to set up CrawleeOne to scrape _only new_ or _only "old"_ entries.

### Scenario

Why would you do that?

> Imagine a social media site, job offers site, or classifieds sites like CraigsList or Gumtree.
>
> All of these work with time-sensitive data - job offers are eventually filled, and items on ads are sold.
>
> You don't know _when_ a new post will be added. Only way to know is to check the website.
>
> You can decide to check the website every 5-15 minutes. But if you fully scrape the website every 5-15 minutes, it will be costly for you, and a heavy load for the scraped website.
>
> So what else can we do?
>
> We can set up a scraper so that it checks only for NEW entries, and once it comes across older ones, it stops.
>
> That way, we get very fresh data, without compromising performance 👌

### Requirements

Our general strategy is following:

1. First, we run a scraper that extracts the data.

2. At the same time, the scraper is configured save the data to a storage (cache) that we can query to check if particular entries were already scraped.

3. At the same time, the scraper is configured to save the data ONLY if the data IS/IS NOT in our storage (cache) already.

4. The first time we run the scraper, ALL entries are scraped, beause the cache is empty. As we do this, we populate the cache.

5. Then, when we run the scraper the next time, we reuse the same cache. Since the cache is no longer empty, then only those entries will be scraped, which ARE/ARE NOT in the cache already.

Before we get ahead, let's review what we need for this to work:

1. ✅ Request filtering
2. ⚠️ Knowing which entries were scraped in previous run:
   1. Storing and retrieval of scraped entries based on unambiguous ID.
   2. Comparison of stored scraped entries against the newly scraped entry.

So if we can store, retrieve, and compare scraped entries, then we can define a flow to scrape only new or only "old" entries. 🤔

For this purpose, we've defined following Actor input options:

- `outputCacheStoreId` - ID of the KeyValueStore that's used for caching scraped entries
- `outputCachePrimaryKeys` - List of property names of the scraped entries that are used for generating cache key.
- `outputCacheActionOnResult` - Specifies whether scraped results should be added to (`"add"`), removed from (`"remove"`), or overwrite (`"overwrite"`) the cache.

Further, your custom functions have access to the `itemCacheKey` function, which generates for you the cache ID from the scraped entry at hand.

### Storing and retrieving entries in/from cache

Here is how we can use the above inputs and function to save entries to the KeyValueStore dedicated as our cache:

```js
async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
  // 1. Generate cache key for given entry based on fields
  //    that we specified via Apify UI.
  const entryCacheKey = itemCacheKey(entry, input.outputCachePrimaryKeys);
  // 2. Load the KeyValueStore dedicated as our cache.
  const store = await Actor.openKeyValueStore(input.outputCacheStoreId);
  // 3. Save the entry to the store.
  await store.setValue(entryCacheKey, entry);
  // ...
};
```

And here is how we retrieve entries and check if the cache already includes said entry:

```js
async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
  // 1. Generate cache key for given entry based on fields
  //    that we specified via Apify UI.
  const entryCacheKey = itemCacheKey(entry, input.outputCachePrimaryKeys);
  // 2. Load the KeyValueStore dedicated as our cache.
  const store = await Actor.openKeyValueStore(input.outputCacheStoreId);
  // 3. Check the store for the entry.
  const cacheHasEntry = !!(await store.getValue(entryCacheKey));

  if (cacheHasEntry) {
    // Do something when item IS in cache
  } else {
    // Do something when item IS NOT in cache
  }

  // ...
};
```

> IMPORTANT NOTES:
>
> - If `outputCachePrimaryKeys` is not set, then the object passed to `itemCacheKey` is serialized as a whole.
>
>   Generally, you do NOT want this, because some fields may change with each run (e.g. timestamp capturing the time of scraping). Hence, even repeatedly scraped entries would be always considered as unique entries to the cache.
>
> - Similarly, when you specify `outputCachePrimaryKeys`, these must be fields that do NOT change across multiple scraper runs.
>
>   - Item's ID is GREAT - ID shouldn't change.
>   - Item's Title is OK, BUT NOT GREAT - The title _may_ change
>   - Item's timestamp, description, or other prone-to-change fields are BAD - These will change often, generating false negatives.

### Scraping only new or only old entries

We're almost there. We know how to decipher whether the entry is already in cache or not. One more thing remains:

Let's say that we want to scrape ONLY NEW entries - _Then, assuming that we run a scraper that eventually comes across entries which will be already found in the cache, then how do we **STOP** the process in order to not scrape any further entries?_

This already depends on your setup, but let's have a look at an example:

```js
{
  outputFilterBefore: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // 1. Load the KeyValueStore dedicated as our cache.
    state.store = await Actor.openKeyValueStore(input.outputCacheStoreId);
    // 2. Load the RequestQueue that holds not-yet-processed
    //    URLs.
    state.queue = await Actor.openRequestQueue(input.requestQueueId);

    // 2. Define helper to check cache
    state.isEntryInCache = async (entry, primaryKeys = input.outputCachePrimaryKeys) => {
      // 3. Generate cache key for given entry
      const entryCacheKey = itemCacheKey(entry, primaryKeys);
      // 4. Check the store for the entry.
      const cacheHasEntry = !!(await state.store.getValue(entryCacheKey));
      return cacheHasEntry;
    };

    // 3. Define helper that clears remaining Requests/URLs from the queue
    state.emptyRequestQueue = async () => {
      await state.queue.clear();
    };
  },

  outputFilter: async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
    // 1. Check the store for the entry.
    const cacheHasEntry = await state.isEntryInCache(entry);

    // Remove all remaining URLs/Requests
    if (cacheHasEntry) {
      state.emptyRequestQueue();
    }

    // And save this entry only if not yet in cache
    return !cacheHasEntry;
    // ...
  };
}
```

With the above configuration we achieved the following:

- New entries will be saved, old will be skipped
- If entry was already found in cache, all Requests that follow are skipped and will not be processed

> NOTE: This setup made a few assumptions, which may be different in your case:
>
> - We assumed that the Requests in RequestQueue are orderly - That is, that the newest entries are grouped together.
>
>   This is a sane assumption - If we scrape time-sensitive data
>   then we usually them by their age. So newest entries should be together, and ordered by age.
>
>   However, for websites like Facebook, Instagram, LinkedIn, and others, which sort posts by custom metrics and not necessarily by age, this strategy would not work!
>
>   On pages where this does not hold, we should NOT call the `RequestQueue.clear()`, because we cannot ensure that there aren't any not-yet-seen entries in the remaining queue.
>
> - The setup assumed NO concurrency. if you had multiple instances of the scraper processing Requests, one scraper may "jump" ahead, and come across "old" entries sooner than before all "not-yet-seen" entries are processed. So our setup may break, and you would need to configure a more heuristic way of detecting when to call `RequestQueue.clear()`. E.g. to call it after 10-20 entries have been marked as "already-seen".
>
> - The setup assumed that the order in which requests are taken from the RequestQueue is the same order with which we've enqueued them.
>
>   E.g. imagine you have a page with 10 entries, half of which are "new" and half "old". Since they are on a single page, they are all enqueued together. Since they are enqueued together, they may have same time of addition, and so it can happen that the order in which they are retrieved is different (e.g. simply because one request might have taken longer to process than other).

> _Congrats! This was by far the most complex use of CrawleeOne. You learnt how to scrape only newest or to exclude newest entries. You can now work well with the hooks that CrawleeOne offers, and can do advanced setups. All of that without needing anything else than the scraper itself. 🚀_
