[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / RequestQueueSizeMonitorOptions

# Interface: RequestQueueSizeMonitorOptions

Defined in: packages/crawlee-one/src/lib/io/requestQueue.ts:5

## Extends

- `ValueMonitorOptions`

## Properties

### io?

> `optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)\<`any`, `any`, `object`\>

Defined in: packages/crawlee-one/src/lib/io/requestQueue.ts:6

***

### requestQueueId?

> `optional` **requestQueueId**: `string`

Defined in: packages/crawlee-one/src/lib/io/requestQueue.ts:12

ID of the RequestQueue that's monitored for size.

If omitted, the default RequestQueue is used.

***

### ttlInMs?

> `optional` **ttlInMs**: `number`

Defined in: packages/crawlee-one/src/utils/valueMonitor.ts:6

How long (in milliseconds) after fetching the value can we use it before we have to re-fetch it.

#### Inherited from

`ValueMonitorOptions.ttlInMs`
