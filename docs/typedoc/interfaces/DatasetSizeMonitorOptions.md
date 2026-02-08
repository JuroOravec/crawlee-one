[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / DatasetSizeMonitorOptions

# Interface: DatasetSizeMonitorOptions

## Extends

- `ValueMonitorOptions`

## Properties

### datasetId?

> `optional` **datasetId**: `string`

ID or name of the Dataset that's monitored for size.

If omitted, the default Dataset is used.

#### Source

[src/lib/io/dataset.ts:73](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/dataset.ts#L73)

***

### io?

> `optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)\<`object`, `object`, `object`\>

#### Source

[src/lib/io/dataset.ts:81](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/dataset.ts#L81)

***

### requestQueueId?

> `optional` **requestQueueId**: `string`

ID of the RequestQueue that holds remaining requests. This queue will be
emptied when Dataset reaches `maxSize`.

If omitted, the default RequestQueue is used.

#### Source

[src/lib/io/dataset.ts:80](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/dataset.ts#L80)

***

### ttlInMs?

> `optional` **ttlInMs**: `number`

How long (in milliseconds) after fetching the value can we use it before we have to re-fetch it.

#### Inherited from

`ValueMonitorOptions.ttlInMs`

#### Source

[src/utils/valueMonitor.ts:6](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/utils/valueMonitor.ts#L6)
