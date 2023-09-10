[crawlee-one](../README.md) / [Exports](../modules.md) / StartUrlsActorInput

# Interface: StartUrlsActorInput

Common input fields for defining URLs to scrape

## Table of contents

### Properties

- [startUrls](StartUrlsActorInput.md#starturls)
- [startUrlsFromDataset](StartUrlsActorInput.md#starturlsfromdataset)
- [startUrlsFromFunction](StartUrlsActorInput.md#starturlsfromfunction)

## Properties

### startUrls

• `Optional` **startUrls**: (`string` \| `RequestOptions`<`Dictionary`\> \| `Request`<`Dictionary`\>)[]

URLs to start with, defined manually as a list of strings or crawler requests

#### Defined in

src/lib/input.ts:94

___

### startUrlsFromDataset

• `Optional` **startUrlsFromDataset**: `string`

Import starting URLs from an existing Dataset.

String is in the format `datasetID#field` (e.g. `datasetid123#url`).

#### Defined in

src/lib/input.ts:100

___

### startUrlsFromFunction

• `Optional` **startUrlsFromFunction**: `string` \| [`CrawleeOneHookFn`](../modules.md#crawleeonehookfn)<[], (`string` \| `RequestOptions`<`Dictionary`\> \| `Request`<`Dictionary`\>)[]\>

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

#### Defined in

src/lib/input.ts:117
