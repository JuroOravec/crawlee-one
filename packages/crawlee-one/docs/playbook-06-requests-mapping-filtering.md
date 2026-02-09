# 6. Filtering and transforming requests

> **TL;DR:** Filter and transform requests before scraping to avoid wasting time and money on unwanted pages.

> **Note on input format:** Examples show input as JSON. When using `crawlee-one` directly, pass the same fields via the `input` option:
>
> ```ts
> await crawleeOne({ type: '...', input: { startUrls: ['https://...'] } });
> ```

**Prerequisite:** This guide builds on [advanced transformations](./playbook-04-results-mapping-advanced.md) and [result filtering](./playbook-05-results-filtering.md). Read those first.

## The problem

You want to test a scraper against a large site (Amazon, TikTok) but only need 20 entries. Using `outputFilter` would work, but it filters _after_ scraping -- you'd still visit every page, extract the data, and only then discard it. That costs time and money.

The solution is to filter **requests** (URLs) before they're scraped.

## Request filtering

Use `requestFilter`, `requestFilterBefore`, and `requestFilterAfter`. These work identically to [output filtering](./playbook-05-results-filtering.md), except the first argument is a [Request](https://crawlee.dev/api/core/class/Request) instead of a scraped entry.

```js
{
  requestFilterBefore: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    state.reqQueue = await Actor.openRequestQueue(input.requestQueueId);
    state.getSize = async () => {
      const { totalRequestCount } = (await state.reqQueue.getInfo()) || {};
      return totalRequestCount;
    };
  },

  requestFilter: async (request, { Actor, input, state, sendRequest, itemCacheKey }) => {
    const size = await state.getSize();
    return size < 20;
  },

  requestFilterAfter: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // Cleanup if needed
  },
}
```

This uses [Actor.openRequestQueue()](https://crawlee.dev/docs/guides/apify-platform#using-platform-storage-in-a-local-actor) and [RequestQueue.getInfo().totalRequestCount](https://crawlee.dev/api/types/interface/RequestQueueInfo#totalRequestCount) to track queue size. Only the first 20 requests are allowed through.

Since filtering happens before scraping, unwanted pages are never visited.

## Request transformation

You can also transform requests before they're processed. Use `requestTransform`, `requestTransformBefore`, and `requestTransformAfter`. These mirror [output transformations](./playbook-04-results-mapping-advanced.md), but operate on [Request](https://crawlee.dev/api/core/class/Request) objects.

```js
{
  requestTransform: async (request, { Actor, input, state, sendRequest, itemCacheKey }) => {
    request.userData.tag = 'ABC';
    return request;
  },
}
```

**Result:** By filtering requests before scraping, you control exactly which pages are visited -- saving both time and compute costs.
