# 4. Advanced transformations and aggregations

> **TL;DR:** Use custom functions to add, remove, or modify fields, enrich entries with remote data, or aggregate across entries using KeyValueStore.

> **Note on input format:** Examples show input as JSON. When using `crawlee-one` directly, pass the same fields via the `input` option:
>
> ```ts
> await crawleeOne({ type: '...', input: { startUrls: ['https://...'] } });
> ```

## When simple transforms aren't enough

The [simple transformations](./playbook-03-results-mapping-simple.md) cover field selection and renaming. For more complex cases -- computed fields, API enrichment, cross-entry aggregation -- use custom transformation functions.

**Input fields:**

- `outputTransform` -- Called for each entry. Receives the entry, returns the transformed entry.
- `outputTransformBefore` -- Called once before scraping starts. Use for initialization.
- `outputTransformAfter` -- Called once after scraping completes. Use for cleanup.

> **Note on code format:** For clarity, examples below use JavaScript syntax. In practice, these are passed as string values in JSON input.

## Examples

### 1. Add, remove, and modify fields

Replace an `images` array with a computed `imagesWithTextCount` field:

```js
{
  outputTransform: async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
    const { images, ...keptData } = entry || {};
    const imagesWithTextCount = images.filter((img) => img.alt != null).length;
    return { ...keptData, imagesWithTextCount };
  };
}
```

### 2. Enrich entries with remote data

Call an external API to add data to each entry. The `sendRequest` argument is an instance of [`got-scraping`](https://github.com/apify/got-scraping):

```js
{
  outputTransform: async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
    const response = await sendRequest
      .get('https://cat-fact.herokuapp.com/facts/5887e1d85c873e0011036889')
      .json();
    return { ...entry, catFact: response.text };
  };
}
```

> While possible, enrichment via third-party APIs during scraping carries risk. If the API call fails, the entry may be lost. Consider doing enrichment as a separate pipeline step for critical data.

### 3. Aggregate across entries with KeyValueStore

Track categories across all scraped entries using `outputTransformBefore` for setup and the `state` object for cross-call communication:

```js
{
  outputTransformBefore: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    const store = await Actor.openKeyValueStore();
    state.store = store;
    if (!(await store.getValue('idsByCategories'))) {
      await store.setValue('idsByCategories', {});
    }
  },

  outputTransform: async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
    if (!entry.category) return entry;

    const data = (await state.store.getValue('idsByCategories')) || {};
    const idList = data[entry.category] || [];
    idList.push(entry.id);
    await state.store.setValue('idsByCategories', { ...data, [entry.category]: idList });

    // Return the original entry unchanged
    return entry;
  },

  outputTransformAfter: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // KeyValueStore does not need explicit cleanup
  },
}
```

## How the hooks work

- `outputTransformBefore` and `outputTransformAfter` do not receive an entry argument -- they run once at the start and end of the scraping run respectively.
- `outputTransform` must return the transformed entry. Returning nothing effectively removes the entry from the dataset.
- Data is shared between hooks via the `state` object.

## Concurrency considerations

> **The `state` object is instance-specific.** If `maxConcurrency` is greater than 1, multiple instances run in parallel, each with their own `state`. To share data across instances, use the KeyValueStore.
>
> **KeyValueStore writes are not atomic.** Concurrent reads and writes to the same key can cause data loss. To avoid this, either set `maxConcurrency: 1`, or store each entry under a unique key.
