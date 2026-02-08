# 5. Filtering results

> **TL;DR:** Include or exclude scraped entries based on custom conditions to reduce dataset size and storage costs.

> **Note on input format:** Examples show input as JSON. When using `crawlee-one` directly, pass the same fields via the `input` option:
>
> ```ts
> await crawleeOne({ type: '...', input: { startUrls: ['https://...'] } });
> ```

## Overview

Filtering works the same way as [advanced transformations](./playbook-04-results-mapping-advanced.md), with two differences:

1. **Return value:** `outputTransform` returns the transformed entry. `outputFilter` returns a truthy value to include the entry, or falsy to exclude it.
2. **Input fields:** Use `outputFilter`, `outputFilterBefore`, and `outputFilterAfter` instead of their `Transform` counterparts.

## Why filter?

If you only need a subset of the scraped data, filtering at scrape time reduces storage costs and produces a dataset small enough to work with in spreadsheets or downstream tools.

> **Note on code format:** For clarity, examples below use JavaScript syntax. In practice, these are passed as string values in JSON input.

## Examples

### 1. Filter by condition

Keep only entries with more than 3 images that have alt text:

```js
{
  outputFilter: async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
    const { images } = entry || {};
    return images.filter((img) => img.alt != null).length > 3;
  };
}
```

### 2. Filter with remote data

Call an external API to decide whether to include each entry. `sendRequest` is an instance of [`got-scraping`](https://github.com/apify/got-scraping):

```js
{
  outputFilter: async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
    const randomNumStr = await sendRequest
      .get('https://www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new')
      .text();
    return Number.parseInt(randomNumStr) > 5;
  };
}
```

### 3. Aggregate-based filtering with KeyValueStore

Keep only the first 5 entries per category:

```js
{
  outputFilterBefore: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    const store = await Actor.openKeyValueStore();
    state.store = store;
    if (!(await store.getValue('idsByCategories'))) {
      await store.setValue('idsByCategories', {});
    }
  },

  outputFilter: async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
    if (!entry.category) return true;

    const data = (await state.store.getValue('idsByCategories')) || {};
    const idList = data[entry.category] || [];
    idList.push(entry.id);

    if (idList.length >= 5) return false;

    await state.store.setValue('idsByCategories', { ...data, [entry.category]: idList });
    return true;
  },

  outputFilterAfter: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // KeyValueStore does not need explicit cleanup
  },
}
```

## How the hooks work

- `outputFilterBefore` and `outputFilterAfter` run once, at the start and end of the scraping run. They do not receive an entry argument.
- `outputFilter` must return a truthy/falsy value. It does not modify the entry.
- Data is shared between hooks via the `state` object.

## Concurrency considerations

> **The `state` object is instance-specific.** If `maxConcurrency` is greater than 1, multiple instances run in parallel, each with their own `state`. To share data across instances, use the KeyValueStore.
>
> **KeyValueStore writes are not atomic.** Concurrent reads and writes to the same key can cause data loss. To avoid this, either set `maxConcurrency: 1`, or store each entry under a unique key.
