[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / StartUrlsActorInput

# Interface: StartUrlsActorInput

Common input fields for defining URLs to scrape

## Properties

### startUrls?

> `optional` **startUrls**: [`CrawlerUrl`](../type-aliases/CrawlerUrl.md)[]

URLs to start with, defined manually as a list of strings or crawler requests

#### Source

[src/lib/input.ts:95](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L95)

***

### startUrlsFromDataset?

> `optional` **startUrlsFromDataset**: `string`

Import starting URLs from an existing Dataset.

String is in the format `datasetID#field` (e.g. `datasetid123#url`).

#### Source

[src/lib/input.ts:101](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L101)

***

### startUrlsFromFunction?

> `optional` **startUrlsFromFunction**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)\<[], [`CrawlerUrl`](../type-aliases/CrawlerUrl.md)[]\>

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

#### Source

[src/lib/input.ts:118](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L118)
