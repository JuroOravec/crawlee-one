[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / RequestQueueSizeMonitorOptions

# Interface: RequestQueueSizeMonitorOptions

## Extends

- `ValueMonitorOptions`

## Properties

### io?

> `optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)\<`any`, `any`, `object`\>

#### Source

[src/lib/io/requestQueue.ts:6](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/requestQueue.ts#L6)

***

### requestQueueId?

> `optional` **requestQueueId**: `string`

ID of the RequestQueue that's monitored for size.

If omitted, the default RequestQueue is used.

#### Source

[src/lib/io/requestQueue.ts:12](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/requestQueue.ts#L12)

***

### ttlInMs?

> `optional` **ttlInMs**: `number`

How long (in milliseconds) after fetching the value can we use it before we have to re-fetch it.

#### Inherited from

`ValueMonitorOptions.ttlInMs`

#### Source

[src/utils/valueMonitor.ts:6](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/utils/valueMonitor.ts#L6)
