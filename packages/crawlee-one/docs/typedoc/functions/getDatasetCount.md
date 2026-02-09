[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / getDatasetCount

# Function: getDatasetCount()

> **getDatasetCount**(`datasetNameOrId?`, `options?`): `Promise`\<`number` \| `null`\>

Defined in: [packages/crawlee-one/src/lib/io/dataset.ts:12](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/io/dataset.ts#L12)

Given a Dataset ID, get the number of entries already in the Dataset.

By default uses Apify Dataset.

## Parameters

### datasetNameOrId?

`string`

### options?

#### io?

[`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>

#### log?

`Log`

## Returns

`Promise`\<`number` \| `null`\>
