[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / getDatasetCount

# Function: getDatasetCount()

> **getDatasetCount**(`datasetNameOrId`?, `options`?): `Promise`\<`null` \| `number`\>

Given a Dataset ID, get the number of entries already in the Dataset.

By default uses Apify Dataset.

## Parameters

• **datasetNameOrId?**: `string`

• **options?**

• **options.io?**: [`CrawleeOneIO`](../interfaces/CrawleeOneIO.md)\<`object`, `object`, `object`\>

• **options.log?**: `Log`

## Returns

`Promise`\<`null` \| `number`\>

## Source

[src/lib/io/dataset.ts:12](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/dataset.ts#L12)
