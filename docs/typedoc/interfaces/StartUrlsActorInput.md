[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / StartUrlsActorInput

# Interface: StartUrlsActorInput

Defined in: [src/lib/input.ts:93](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L93)

Common input fields for defining URLs to scrape

## Properties

### startUrls?

> `optional` **startUrls**: [`CrawlerUrl`](../type-aliases/CrawlerUrl.md)[]

Defined in: [src/lib/input.ts:95](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L95)

URLs to start with, defined manually as a list of strings or crawler requests

***

### startUrlsFromDataset?

> `optional` **startUrlsFromDataset**: `string`

Defined in: [src/lib/input.ts:101](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L101)

Import starting URLs from an existing Dataset.

String is in the format `datasetID#field` (e.g. `datasetid123#url`).

***

### startUrlsFromFunction?

> `optional` **startUrlsFromFunction**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)\<\[\], [`CrawlerUrl`](../type-aliases/CrawlerUrl.md)[]\>

Defined in: [src/lib/input.ts:118](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L118)

Import or generate starting URLs using a custom function.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

```js
// Example: Create and load URLs from a Dataset by combining multiple fields
async ({ io, input, state, itemCacheKey }) => {
  const dataset = await io.openDataset(datasetNameOrId);
  const data = await dataset.getData();
  const urls = data.items.map((item) => `https://example.com/u/${item.userId}/list/${item.listId}`);
  return urls;
}
```
