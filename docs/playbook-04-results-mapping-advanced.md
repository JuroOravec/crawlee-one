# 4. Advanced transformations & aggregations

We've already described simple transformations like selecting or renaming fields.

But what if you need something more advanced? Consider these scenarios:

- *You want to export data to a spreadsheet, so you don't need metadata for each image. Instead, you want just a column with `imageCount`.*

- *You are scraping book data. You want to capture the relationships between authors and books. So, as each entry is being processed, you want to note down the name of the author and the related book.*

- *You are scraping job offers, and you want to add `keywords` field. You will send each job offer to ChatGPT to get keyword suggestions.*
  > NOTE: While it's entirely possible, this scenario is not recommended to be done at this stage (scraping entries). There is too many things that can go wrong when using a 3rd party server to enrich your data. And if it fails, the entry may be lost too, so it should be done as a standalone task.

All of these are feasible with Crawlee One, we just need to write a custom transformation function.

For that we can use input fields `outputTransform`, `outputTransformBefore`, and `outputTransformAfter`.

Let's have a look at some examples!

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

1. Add, remove, and modify fields

    In this example, we removed the `images` field, and instead
    added field `imagesWithTextCount`.

    ```js
    {
      outputTransform: async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
        const { images, ...keptData } = entry || {};
        const imagesWithTextCount = images.filter((img) => img.alt != null).length;
        return {
          ...keptData,
          imagesWithTextCount,
        };
      }
    }
    ```

2. Enrich entries with remote data

    In this example, we call the CatFacts API to generate a random cat fact to send along with this entry.

    For this, we use the `sendRequest` argument available to the function. `sendRequest` is actually an instance of [`got-scraping`](https://github.com/apify/got-scraping).

    ```js
    {
      // Define what happens for each entry
      outputTransform: async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
        // Use `sendRequest` to get data from the internet:
        // Docs: https://github.com/apify/got-scraping
        // We make a GET request to the given URL, and parse the response as JSON
        const catFactResponse = await sendRequest.get('https://cat-fact.herokuapp.com/facts/5887e1d85c873e0011036889').json();
        
        const catFact = catFact.text;
        // => "Cats make about 100 different sounds. Dogs make only about 10."

        return { ...entry, catFact };
      },
    }
    ```

3. Aggregate with KeyValueStore

    In this example, we capture the category of each entry.
    Note how in the end, we still return the original `entry`.

    - For one, we must return it. If we don't, we practically
    remove the entry from the dataset.

    - And for two, we don't make any changes to the entry itself,
    so we can return it as is.

    Futher, we also make use of the `outputTransformBefore` and `outputTransformAfter` to prepare and cleanup the environment.

    ```js
    {
      // Initialize the cache during scraper startup
      outputTransformBefore: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
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
      outputTransform: async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
        // Leave early if invalid entry
        if (!entry.category) return entry;

        const data = (await state.store.getValue('idsByCategories')) || {};

        // Update stats
        const idList = data[entry.category] || [];
        idList.push(entry.id);
        data[entry.category] = idList;
        const newData = { ...data, [entry.category]: idList };

        // Save to cache again
        await store.setValue('idsByCategories', newData);

        return entry;
      },

      // Do... nothing during scraper shutdown
      outputTransformAfter: async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
        // NOTE: KeyValueStore doesn't need to be closed/disposed
        // there's not much for us to do here
      },
    }
    ```

    Did you notice the following about the example above?

    1. While the `outputTransform` function has an "entry" argument, `outputTransformBefore` and `outputTransformAfter` don't, because:
      
        - `outputTransformBefore` is run before any scraping begins.
        - `outputTransformAfter` is run after all scraping is done.

    2. `outputTransform` has to return the transformed data. But `outputTransformBefore` and `outputTransformAfter` don't return anything.

    3. We passed the KeyValueStore from `outputTransformBefore` to `outputTransform` via the `state` object.

    > IMPORTANT 1: Note that `outputTransformBefore` and `outputTransformAfter` are ran for EACH scraper instance.
    >
    > What this means is that if you set the Actor input `maxConcurrency` to anything beyond 1, then you may have multiple instances running at the same time.
    >
    > Then, `outputTransformBefore` and `outputTransformAfter` will run for both of them!

    > IMPORTANT 2: Likewise, the `state` object is INSTANCE-SPECIFIC!
    >
    > What this means is that if you set the Actor input `maxConcurrency` to anything beyond 1, then you may have multiple instances running at the same time.
    >
    > Then, they will each have their own `state` object. Instead, if you want to share data between all instances, use the KeyValueStore.

    > NOTE: Although possible, the example above is open to concurrency issues. In other words, if the KeyValueStore is opened by two different entries at the same time, and they both update it at the same time, then the change coming from one of them might be lost!
    >
    > To avoid concurrency issues, either set `maxConcurrency: 1`, so all entries are processed one by one. Or store the data for each entry under a different key in the KeyValueStore.

That's all for advanced transformations!

  > *Congrats! Now you know how to transform, enrich, and aggregate scraper data using Crawlee One. 🚀*
