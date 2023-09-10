[crawlee-one](../README.md) / [Exports](../modules.md) / PushRequestsOptions

# Interface: PushRequestsOptions<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Exclude`<[`CrawlerUrl`](../modules.md#crawlerurl), `string`\> = `Exclude`<[`CrawlerUrl`](../modules.md#crawlerurl), `string`\> |

## Table of contents

### Properties

- [filter](PushRequestsOptions.md#filter)
- [io](PushRequestsOptions.md#io)
- [log](PushRequestsOptions.md#log)
- [maxCount](PushRequestsOptions.md#maxcount)
- [queueOptions](PushRequestsOptions.md#queueoptions)
- [requestQueueId](PushRequestsOptions.md#requestqueueid)
- [transform](PushRequestsOptions.md#transform)

## Properties

### filter

• `Optional` **filter**: (`req`: `T`) => `unknown`

#### Type declaration

▸ (`req`): `unknown`

Option to filter a request before pushing it to the RequestQueue.

This serves mainly to allow users to filter the requests from actor input UI.

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `T` |

##### Returns

`unknown`

#### Defined in

[src/lib/io/pushRequests.ts:35](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/pushRequests.ts#L35)

___

### io

• `Optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)<`any`, `any`, `object`\>

#### Defined in

[src/lib/io/pushRequests.ts:12](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/pushRequests.ts#L12)

___

### log

• `Optional` **log**: `Log`

#### Defined in

[src/lib/io/pushRequests.ts:13](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/pushRequests.ts#L13)

___

### maxCount

• `Optional` **maxCount**: `number`

If set, only at most this many requests will be added to the RequestQueue.

The count is determined from the RequestQueue that's used for the crawler run.

This means that if `maxCount` is set to 50, but the
associated RequestQueue already handled 40 requests, then only 10 new requests
will be processed.

#### Defined in

[src/lib/io/pushRequests.ts:23](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/pushRequests.ts#L23)

___

### queueOptions

• `Optional` **queueOptions**: `RequestQueueOperationOptions`

#### Defined in

[src/lib/io/pushRequests.ts:40](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/pushRequests.ts#L40)

___

### requestQueueId

• `Optional` **requestQueueId**: `string`

ID of the RequestQueue to which the data should be pushed

#### Defined in

[src/lib/io/pushRequests.ts:37](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/pushRequests.ts#L37)

___

### transform

• `Optional` **transform**: (`req`: `T`) => [`MaybePromise`](../modules.md#maybepromise)<`T`\>

#### Type declaration

▸ (`req`): [`MaybePromise`](../modules.md#maybepromise)<`T`\>

Option to freely transform a request before pushing it to the RequestQueue.

This serves mainly to allow users to transform the requests from actor input UI.

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `T` |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`T`\>

#### Defined in

[src/lib/io/pushRequests.ts:29](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/io/pushRequests.ts#L29)
