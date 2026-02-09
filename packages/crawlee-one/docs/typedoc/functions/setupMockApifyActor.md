[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / setupMockApifyActor

# Function: setupMockApifyActor()

> **setupMockApifyActor**\<`TInput`, `TData`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/lib/test/actor.ts:12](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/test/actor.ts#L12)

## Type Parameters

### TInput

`TInput`

### TData

`TData` *extends* [`MaybeArray`](../type-aliases/MaybeArray.md)\<`Dictionary`\> = [`MaybeArray`](../type-aliases/MaybeArray.md)\<`Dictionary`\>

## Parameters

### \_\_namedParameters

#### actorInput?

`TInput`

#### log?

(...`args`) => `void`

#### onBatchAddRequests?

[`OnBatchAddRequests`](../type-aliases/OnBatchAddRequests.md)

#### onGetInfo?

(...`args`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### onPushData?

(`data`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### vi

`VitestUtils`

## Returns

`Promise`\<`void`\>
