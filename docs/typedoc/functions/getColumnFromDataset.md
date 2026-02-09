[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / getColumnFromDataset

# Function: getColumnFromDataset()

> **getColumnFromDataset**\<`T`\>(`datasetId`, `field`, `options?`): `Promise`\<`T`[]\>

Defined in: [src/lib/io/dataset.ts:48](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/dataset.ts#L48)

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
