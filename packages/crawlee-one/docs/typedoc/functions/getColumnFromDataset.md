[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / getColumnFromDataset

# Function: getColumnFromDataset()

> **getColumnFromDataset**\<`T`\>(`datasetId`, `field`, `options?`): `Promise`\<`T`[]\>

Defined in: packages/crawlee-one/src/lib/io/dataset.ts:48

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

## Type Parameters

### T

`T`

## Parameters

### datasetId

`string`

### field

`string`

### options?

#### dataOptions?

`Pick`\<`DatasetDataOptions`, `"limit"` \| `"offset"` \| `"desc"`\>

#### io?

[`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>

## Returns

`Promise`\<`T`[]\>
