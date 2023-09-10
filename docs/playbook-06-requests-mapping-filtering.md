# 6. Deciding what URLs to scrape: Filtering and transforming requests

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

IMPORTANT: This section builds on top of the previous 2 sections ([4. Advanced transformations](#4-advanced-transformations--aggregations)
& [5. Filtering results](#5-filtering-results)). Please read them first.

In the previous section, we've learnt how to filter out entries from our dataset.

## Scenario

Imagine you're testing out a scraper for one of major websites, maybe Amazon products or TikTok.
As part of the test, you want to scrape only a few entries, maybe 20.

How would you achieve that...?

If your answer is to use the `outputFilter`, you deserve a star for listening!
But it will cost you ⚠️!

Consider this:

1. Both Amazon and TikTok may have _millions_ of entries, and your scraper may be configured
   to _scrape them all!_.
2. `outputFilter` works on the **scraped entry**. So, we first need to 1) visit the page, 2) extract data,
   and 3) only then we can decide whether to include the entry or not using `outputFilter`.

So if you used `outputFilter` naively, you would end up with 20 entries, but it would TAKE TOO LONG
and COST TOO MUCH.

So, can we filter entries even before we scrape them? We sure can 😉

## Request filtering

Same as we can filter **scraped entries**, we can also filter **requests**. As a reminder,
[Requests](https://crawlee.dev/api/core/class/Request)
represent the URLs you want to scrape. `Requests` are passed to the scraper,
which then goes one-by-one, loads the given URLs and extracts the data from the loaded web page.

For this, you have the Actor input fields `requestFilter`, `requestFilterBefore`, and `requestFilterAfter`.

These work the similarly to filtering of **output** (input fields `outputFilter`, `outputFilterBefore`, and `outputFilterAfter`).
The only difference is the filtered value:

- In `outputFilter`, we are given the scraped entry as first argument.
- In `requestFilter`, we are given the [Request](https://crawlee.dev/api/core/class/Request)
  as first argument.

The example below should already look familiar:

```js
{
  // Initialize RequestQueue
  requestFilterBefore: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    state.reqQueue = await Actor.openRequestQueue(input.requestQueueId);

    // Function that returns how many Requests were passed to the RequestQueue
    state.getSize = async () => {
      const { totalRequestCount } = (await state.reqQueue.getInfo()) || {};
      return totalRequestCount;
    };
  },

  // Define what happens for each Request
  requestFilter: async (request, { Actor, input, state, sendRequest, itemCacheKey }) => {
    const size = await state.getSize();
    return size < 20;
  },

  // Clean up state
  requestFilterAfter: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // Do something...
  },
}
```

In this example, we used
[Actor.openRequestQueue()](https://crawlee.dev/docs/guides/apify-platform#using-platform-storage-in-a-local-actor)
and
[RequestQueue.getInfo().totalRequestCount](https://crawlee.dev/api/types/interface/RequestQueueInfo#totalRequestCount) to get number of requests that were pushed to the queue. We wrapped this in `getSize`, and exposed the function via `state` object.

Since we filter the Requests, we won't waste time and resources
on scraping data from URLs that we eventually don't want to scrape anyway. 💸

## Request mapping

Just like you can filter and map results, you can both filter **and** map requests.

I don't have a good use case for transforming requests, but let's go over it for completeness.

For this, you have the Actor input fields `requestTransform`, `requestTransformBefore`, and `requestTransformAfter`.

These work the similarly to transforming of **output** (input fields `outputTransform`, `outputTransformBefore`, and `outputTransformAfter`).
The only difference is the transformed value:

- In `outputTransform`, we are given the scraped entry as first argument.
- In `requestTransform`, we are given the [Request](https://crawlee.dev/api/core/class/Request)
  as first argument.

Let's have a look at the example:

```js
{
  // Initialize
  requestTransformBefore: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // Do something...
  },

  // Define what happens for each Request
  requestTransform: async (request, { Actor, input, state, sendRequest, itemCacheKey }) => {
    // Modify and return the request
    request.usedData.tag = 'ABC';
    return request;
  },

  // Clean up state
  requestTransformAfter: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // Do something...
  },
}
```

> _Congrats! With CrawleeOne, you were able to scrape only the first 20 URLs by configuring the request filter for an Apify Actor. High-five to the efficiency!_
