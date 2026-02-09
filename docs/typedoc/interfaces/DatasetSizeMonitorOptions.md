[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / DatasetSizeMonitorOptions

# Interface: DatasetSizeMonitorOptions

Defined in: [src/lib/io/dataset.ts:67](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/dataset.ts#L67)

## Extends

- `ValueMonitorOptions`

## Properties

### datasetId?

> `optional` **datasetId**: `string`

Defined in: [src/lib/io/dataset.ts:73](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/dataset.ts#L73)

ID or name of the Dataset that's monitored for size.

If omitted, the default Dataset is used.

***

### io?

> `optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)\<`object`, `object`, `object`\>

Defined in: [src/lib/io/dataset.ts:81](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/dataset.ts#L81)

***

### requestQueueId?

> `optional` **requestQueueId**: `string`

Defined in: [src/lib/io/dataset.ts:80](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/dataset.ts#L80)

ID of the RequestQueue that holds remaining requests. This queue will be
emptied when Dataset reaches `maxSize`.

If omitted, the default RequestQueue is used.

***

### ttlInMs?

> `optional` **ttlInMs**: `number`

Defined in: [src/utils/valueMonitor.ts:6](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/utils/valueMonitor.ts#L6)

How long (in milliseconds) after fetching the value can we use it before we have to re-fetch it.

#### Inherited from

`ValueMonitorOptions.ttlInMs`
