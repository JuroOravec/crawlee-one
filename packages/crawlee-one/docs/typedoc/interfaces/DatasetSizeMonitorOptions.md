[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / DatasetSizeMonitorOptions

# Interface: DatasetSizeMonitorOptions

Defined in: [packages/crawlee-one/src/lib/io/dataset.ts:43](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/dataset.ts#L43)

## Extends

- `ValueMonitorOptions`

## Properties

### datasetId?

> `optional` **datasetId**: `string`

Defined in: [packages/crawlee-one/src/lib/io/dataset.ts:49](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/dataset.ts#L49)

ID or name of the Dataset that's monitored for size.

If omitted, the default Dataset is used.

***

### io?

> `optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)\<`object`, `object`, `object`\>

Defined in: [packages/crawlee-one/src/lib/io/dataset.ts:57](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/dataset.ts#L57)

***

### requestQueueId?

> `optional` **requestQueueId**: `string`

Defined in: [packages/crawlee-one/src/lib/io/dataset.ts:56](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/dataset.ts#L56)

ID of the RequestQueue that holds remaining requests. This queue will be
emptied when Dataset reaches `maxSize`.

If omitted, the default RequestQueue is used.

***

### ttlInMs?

> `optional` **ttlInMs**: `number`

Defined in: [packages/crawlee-one/src/utils/valueMonitor.ts:6](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/utils/valueMonitor.ts#L6)

How long (in milliseconds) after fetching the value can we use it before we have to re-fetch it.

#### Inherited from

`ValueMonitorOptions.ttlInMs`
