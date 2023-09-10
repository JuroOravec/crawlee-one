[crawlee-one](../README.md) / [Exports](../modules.md) / DatasetSizeMonitorOptions

# Interface: DatasetSizeMonitorOptions

## Hierarchy

- `ValueMonitorOptions`

  ↳ **`DatasetSizeMonitorOptions`**

## Table of contents

### Properties

- [datasetId](DatasetSizeMonitorOptions.md#datasetid)
- [io](DatasetSizeMonitorOptions.md#io)
- [requestQueueId](DatasetSizeMonitorOptions.md#requestqueueid)
- [ttlInMs](DatasetSizeMonitorOptions.md#ttlinms)

## Properties

### datasetId

• `Optional` **datasetId**: `string`

ID or name of the Dataset that's monitored for size.

If omitted, the default Dataset is used.

#### Defined in

[src/lib/io/dataset.ts:73](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/io/dataset.ts#L73)

___

### io

• `Optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)<`object`, `object`, `object`\>

#### Defined in

[src/lib/io/dataset.ts:81](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/io/dataset.ts#L81)

___

### requestQueueId

• `Optional` **requestQueueId**: `string`

ID of the RequestQueue that holds remaining requests. This queue will be
emptied when Dataset reaches `maxSize`.

If omitted, the default RequestQueue is used.

#### Defined in

[src/lib/io/dataset.ts:80](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/io/dataset.ts#L80)

___

### ttlInMs

• `Optional` **ttlInMs**: `number`

How long (in milliseconds) after fetching the value can we use it before we have to re-fetch it.

#### Inherited from

ValueMonitorOptions.ttlInMs

#### Defined in

[src/utils/valueMonitor.ts:6](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/utils/valueMonitor.ts#L6)
