[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / getColumnFromDataset

# Function: getColumnFromDataset()

> **getColumnFromDataset**\<`T`\>(`datasetId`, `field`, `options`?): `Promise`\<`T`[]\>

Given a Dataset ID and a name of a field, get the columnar data.

By default uses Apify Dataset.

Example:
```js
// Given dataset
// [
//   { id: 1, field: 'abc' },
//   { id: 2, field: 'def' }
// ]
const results = await getColumnFromDataset('datasetId123', 'field');
console.log(results)
// ['abc', 'def']
```

## Type parameters

• **T**

## Parameters

• **datasetId**: `string`

• **field**: `string`

• **options?**

• **options.dataOptions?**: `Pick`\<`DatasetDataOptions`, `"limit"` \| `"offset"` \| `"desc"`\>

• **options.io?**: [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>

## Returns

`Promise`\<`T`[]\>

## Source

[src/lib/io/dataset.ts:48](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/dataset.ts#L48)
