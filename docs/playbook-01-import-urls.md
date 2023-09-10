# 1. Import URLs to scrape from your database (or elsewhere)

> NOTE:
>
> In these examples, the input is mostly shown as a JSON, e.g.:
> ```json
> {
>   "startUrls": ["https://www.example.com/path/1"],
> }
> ```
> If you are using the `crawlee-one` package directly, then that is the same as:
> ```ts
> import { crawleeOne } from 'crawlee-one';
> await crawleeOne({
>   type: '...',
>   input: {
>     startUrls: ['https://www.example.com/path/1'],
>   },
> });
> ```

Let's start our examples at the beginning of the scraping lifecycle:

There are website(s) from which you want to extract data, and you have URLs to those websites.

If you have only a few of the URLs (say, up to hundreds), you can copy-paste them and manage them manually, and that's fine.

**But if you store the URLs in a database or another service, you will need a script to extract the URLs. And that script will need to live somewhere, and it will need to run somewhere.**

So you haven't even started, and you already need to run 2 programs:

1. A loader script
2. The scraper itself

**To avoid this, CrawleeOne has the loader script integrated.** Let's see how it works:

You have 3 ways of defining the URLs to scrape:

- `startUrls` - Provide a static list of URLs.
- `startUrlsFromDataset` - Take URLs from _another_ Apify Dataset.
- `startUrlsFromFunction` - Define custom loader script that obtains or generates the URLs.

Let's show the 3 ways on the following scenario:

> _Imagine you want to train an AI model that detects fake reviews specifically for books. You decide to use Amazon's product reviews for training. You have already extracted their book product listings. It looks like this:_
>
> ```json
> {
>   "asin": "xxxxxxxxx",
>   "title": "A book title",
>   "description": "...",
>   "url": "https://www.amazon.com/..."
> }
> ```
>
> _You have a dataset of 100K-1M products. Now you need to extract the reviews for each of the products._

...1 milion is a lot, but let's not get ahead of ourselves. At first, you may want to use just 2-3 URLs to verify validity of your approach.

In that, you can use a CrawleeOne Apify actor and pass it a static list of URLs:

```json
{
  "startUrls": [
    "https://www.example.com/path/1",
    "https://www.example.com/path/2",
    "https://www.example.com/path/3",
    ...
  ],
}
```

> _You ran a scraper with the settings above, and the scraper got us the results we needed. Sweet! Now onto the remaining 999,997 entries..._

Assuming that you named the Amazon products dataset as `"AmazonBooks2023-08"`, we can pass all 1 million URLs to the scraper by referring to your Apify Dataset and the field that holds the URL.

For this, we use the `startUrlsFromDataset` field, and we separate the Dataset ID and the field name with `#`, like so: `{datasetId}#{fieldName}`.

```json
{
  "startUrlsFromDataset": "AmazonBooks2023-08#url"
}
```

Alternatively, you may want to derive the URLs from the product's `asin` field. This is more complicated, because we already require some data pre-processing - we need to map the `asin` field to an URL.

Nevertheless, this is still very much feasible if we define an Actor input with a custom loader function:

```json
{
  "startUrlsFromFunction": "
    // Example: Create and load URLs from an Apify Dataset
    async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
      const dataset = await Actor.openDataset('AmazonBooks2023-08');
      const data = await dataset.getData();
      const urls = data.items.map((item) => `https://amazon.com/dp/${item.asin}`);
      return urls;
    };",
}
```

And here's the same, but with JS syntax highlight:

```js
async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
  const dataset = await Actor.openDataset('AmazonBooks2023-08');
  const data = await dataset.getData();
  const urls = data.items.map((item) => `https://amazon.com/dp/${item.asin}`);
  return urls;
};
```

(NOTE: Of course, in reality you should download the dataset in smaller batches.)

And just like that, you've loaded the 1M URLs from one Apify Dataset, and passed it to a scraper that uses CrawleeOne.

Also, notice how the function returned the list of URLs. The function also received current context in `state` and `input`, and helper methods in `Actor`, `sendRequest`, `itemCacheKey`.

> _Congrats! With CrawleeOne, you were able to scrape reviews for all your 1M products using an Apify Actor. And you didn't even need to spin up a separate server just for loading the URLs to the scraper. 🚀_
