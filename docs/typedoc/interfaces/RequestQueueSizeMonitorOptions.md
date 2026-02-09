[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / RequestQueueSizeMonitorOptions

# Interface: RequestQueueSizeMonitorOptions

Defined in: [src/lib/io/requestQueue.ts:5](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/requestQueue.ts#L5)

## Extends

- `ValueMonitorOptions`

## Properties

### io?

> `optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)\<`any`, `any`, `object`\>

Defined in: [src/lib/io/requestQueue.ts:6](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/requestQueue.ts#L6)

***

### requestQueueId?

> `optional` **requestQueueId**: `string`

Defined in: [src/lib/io/requestQueue.ts:12](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/requestQueue.ts#L12)

ID of the RequestQueue that's monitored for size.

If omitted, the default RequestQueue is used.

***

### ttlInMs?

> `optional` **ttlInMs**: `number`

Defined in: [src/utils/valueMonitor.ts:6](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/utils/valueMonitor.ts#L6)

How long (in milliseconds) after fetching the value can we use it before we have to re-fetch it.

#### Inherited from

`ValueMonitorOptions.ttlInMs`
