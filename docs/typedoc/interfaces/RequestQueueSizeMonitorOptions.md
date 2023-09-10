[crawlee-one](../README.md) / [Exports](../modules.md) / RequestQueueSizeMonitorOptions

# Interface: RequestQueueSizeMonitorOptions

## Hierarchy

- `ValueMonitorOptions`

  ↳ **`RequestQueueSizeMonitorOptions`**

## Table of contents

### Properties

- [io](RequestQueueSizeMonitorOptions.md#io)
- [requestQueueId](RequestQueueSizeMonitorOptions.md#requestqueueid)
- [ttlInMs](RequestQueueSizeMonitorOptions.md#ttlinms)

## Properties

### io

• `Optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)<`any`, `any`, `object`\>

#### Defined in

[src/lib/io/requestQueue.ts:6](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/requestQueue.ts#L6)

___

### requestQueueId

• `Optional` **requestQueueId**: `string`

ID of the RequestQueue that's monitored for size.

If omitted, the default RequestQueue is used.

#### Defined in

[src/lib/io/requestQueue.ts:12](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/requestQueue.ts#L12)

___

### ttlInMs

• `Optional` **ttlInMs**: `number`

How long (in milliseconds) after fetching the value can we use it before we have to re-fetch it.

#### Inherited from

ValueMonitorOptions.ttlInMs

#### Defined in

[src/utils/valueMonitor.ts:6](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/utils/valueMonitor.ts#L6)
