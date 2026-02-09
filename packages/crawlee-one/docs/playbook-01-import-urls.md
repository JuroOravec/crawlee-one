# 1. Import URLs from your database (or elsewhere)

> **TL;DR:** Load starting URLs from a static list, an Apify Dataset, or a custom function -- no separate loader script needed.

> **Note on input format:** Examples show input as JSON. When using `crawlee-one` directly, pass the same fields via the `input` option:
>
> ```ts
> await crawleeOne({ type: '...', input: { startUrls: ['https://...'] } });
> ```

## The problem

You have a list of URLs to scrape. If there are only a handful, you can manage them manually. But if the URLs live in a database or external service, you need a loader script to fetch them -- and that script needs to run somewhere.

Before you've even started scraping, you're managing two programs: a loader and a scraper.

CrawleeOne eliminates the loader. URL loading is built into the scraper itself.

## Three ways to define URLs

- `startUrls` -- A static list of URLs.
- `startUrlsFromDataset` -- Pull URLs from an existing Apify Dataset.
- `startUrlsFromFunction` -- A custom function that fetches or generates URLs.

## Example scenario

You have a dataset of 1M Amazon book product listings and need to scrape reviews for each. Each entry looks like:

```json
{
  "asin": "xxxxxxxxx",
  "title": "A book title",
  "url": "https://www.amazon.com/..."
}
```

### Step 1: Validate with a static list

Start small. Pass a few URLs to verify your scraper works:

```json
{
  "startUrls": [
    "https://www.example.com/path/1",
    "https://www.example.com/path/2",
    "https://www.example.com/path/3"
  ]
}
```

### Step 2: Scale with a dataset reference

Once validated, point the scraper at your full dataset. Use `startUrlsFromDataset` with the format `{datasetId}#{fieldName}`:

```json
{
  "startUrlsFromDataset": "AmazonBooks2023-08#url"
}
```

All 1M URLs are loaded directly from the dataset. No intermediate script.

### Step 3: Custom logic with a loader function

If you need to derive URLs from other fields (e.g. constructing URLs from ASINs), use `startUrlsFromFunction`:

```js
async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
  const dataset = await Actor.openDataset('AmazonBooks2023-08');
  const data = await dataset.getData();
  return data.items.map((item) => `https://amazon.com/dp/${item.asin}`);
};
```

> In production, download the dataset in smaller batches rather than all at once.

The function receives the current `state`, `input`, and helper methods (`Actor`, `sendRequest`, `itemCacheKey`), giving you full control over URL generation.

**Result:** 1M URLs loaded from an Apify Dataset, fed directly to the scraper, with no separate infrastructure.
