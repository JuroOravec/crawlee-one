# 5. Filtering results

Before you proceed, make sure to go over the previous section on advanced transformations.

This section is very similar to advanced transformations, but examples and notes included are in their entirety for if you're starting to read from here.

Filtering works very similarly to advanced transfomations, but with 2 differences:

  1. Meaning of returned values:

      - In `outputTransform` we returned the transformed value.

      - In `outputFilter` we return the decision whether to include (truthy) or exclude (falsy) the entry at hand from the dataset.

  2. Names of Actor inputs:

      - For transformations, you use input fields `outputTransform`, `outputTransformBefore`, and `outputTransformAfter`.

      - For filtering, you use input fields `outputFilter`, `outputFilterBefore`, and `outputFilterAfter`.

Other than that's it's very similar.

Ok, so then, why would you want to filter scraper data?

If you are interested only in a particular subset of the whole, omitting the unrelated entries can have several benefits:

- Smaller size means that storage costs will be smaller.
- Smaller dataset means that you might be able to work with the data using spreadsheets or online tools.

Alright, let's have a look at some examples!

NOTE: For clarity, following code examples for Actor inputs are formatted as JavaScript. But when I write:

```js
{
  outputFilter: (entry) => {
    return entry.someValue > 10;
  }
}
```

what I really mean is:

```json
{
  "outputFilter": "(entry) => {
    return entry.someValue > 10;
  }"
}
```

1. Plain filtering

    In this example, we filter entries based on the count of images.

    ```js
    {
      outputFilter: async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
        const { images } = entry || {};
        const imagesWithTextCount = images.filter((img) => img.alt != null).length;
        return imagesWithTextCount > 3;
      }
    }
    ```

2. Filter entries with remote data

    In this example, we call the RANDOM.ORG API to generate random numbers, and decide based on them whether to include the entry or not.

    For this, we use the `sendRequest` argument available to the function. `sendRequest` is actually an instance of [`got-scraping`](https://github.com/apify/got-scraping).

    ```js
    {
      // Define what happens for each entry
      outputFilter: async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
        // Use `sendRequest` to get data from the internet:
        // Docs: https://github.com/apify/got-scraping
        // We make a GET request to the given URL, and parse the response as TEXT
        const randomNumStr = await sendRequest.get('https://www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new').text();
        
        const randomNum = Number.parseInt(randomNumStr);

        return randomNum > 5;
      },
    }
    ```

3. Aggregate with KeyValueStore

    In this example, we capture the category of each entry,
    and allow to scrape only the first 5 entries from each category.

    Futher, we also make use of the `outputFilterBefore` and `outputFilterAfter` to prepare and cleanup the environment.

    ```js
    {
      // Initialize the cache during scraper startup
      outputFilterBefore: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
        // Use the cache/store associated with this scraper run
        const store = await Actor.openKeyValueStore();

        // Persist the store instance, so we can use it in `outputTransform`
        state.store = store;
        
        // Create the cache entry that will hold aggregate data
        const data = (await store.getValue('idsByCategories'));
        if (!data) {
          await store.setValue('idsByCategories', {});
        }
      },

      // Define what happens for each entry
      outputFilter: async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
        // Leave early if invalid entry
        if (!entry.category) return true;

        const data = (await state.store.getValue('idsByCategories')) || {};

        // Update stats
        const idList = data[entry.category] || [];
        idList.push(entry.id);
        
        // Mark the entry to NOT pass the filter if there is already at least 5 entries.
        if (idList.length >= 5) return false;

        // And if there is less than 5 entries, update the
        // cache
        data[entry.category] = idList;
        const newData = { ...data, [entry.category]: idList };

        // Save to cache again
        await store.setValue('idsByCategories', newData);

        return entry;
      },

      // Do... nothing during scraper shutdown
      outputFilterAfter: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
        // NOTE: KeyValueStore doesn't need to be closed/disposed
        // there's not much for us to do here
      },
    }
    ```

    Did you notice the following about the example above?

    1. While the `outputFilter` function has an "entry" argument, `outputFilterBefore` and `outputFilterAfter` don't, because:
      
        - `outputFilterBefore` is run before any scraping begins.

        - `outputFilterAfter` is run after all scraping is done.

    2. `outputFilter` has to return whether the entry passed the filter (truthy) or not (falsy). But `outputFilterBefore` and `outputFilterAfter` don't return anything.

    3. We passed the KeyValueStore from `outputFilterBefore` to `outputFilter` via the `state` object.

    > IMPORTANT 1: Note that `outputFilterBefore` and `outputFilterAfter` are ran for EACH scraper instance.
    >
    > What this means is that if you set the Actor input `maxConcurrency` to anything beyond 1, then you may have multiple instances running at the same time.
    >
    > Then, `outputFilterBefore` and `outputFilterAfter` will run for both of them!

    > IMPORTANT 2: Likewise, the `state` object is INSTANCE-SPECIFIC!
    >
    > What this means is that if you set the Actor input `maxConcurrency` to anything beyond 1, then you may have multiple instances running at the same time.
    >
    > Then, they will each have their own `state` object. Instead, if you want to share data between all instances, use the KeyValueStore.

    > NOTE: Although possible, the example above is open to concurrency issues. In other words, if the KeyValueStore is opened by two different entries at the same time, and they both update it at the same time, then the change coming from one of them might be lost!
    >
    > To avoid concurrency issues, either set `maxConcurrency: 1`, so all entries are processed one by one. Or store the data for each entry under a different key in the KeyValueStore.

That's all for advanced filtering!

  > *Congrats! Now you know how to filter scraper data using Crawlee One. 🚀*
