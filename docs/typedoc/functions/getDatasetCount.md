[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / getDatasetCount

# Function: getDatasetCount()

> **getDatasetCount**(`datasetNameOrId?`, `options?`): `Promise`\<`number` \| `null`\>

Defined in: [src/lib/io/dataset.ts:12](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/dataset.ts#L12)

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
