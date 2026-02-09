[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / setupMockApifyActor

# Function: setupMockApifyActor()

> **setupMockApifyActor**\<`TInput`, `TData`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [src/lib/test/actor.ts:12](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/test/actor.ts#L12)

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
