[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / runCrawlerTest

# Function: runCrawlerTest()

> **runCrawlerTest**\<`TData`, `TInput`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/crawlee-one/src/lib/test/actor.ts:61](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/test/actor.ts#L61)

## Type Parameters

### TData

`TData` *extends* [`MaybeArray`](../type-aliases/MaybeArray.md)\<`Dictionary`\>

### TInput

`TInput`

## Parameters

### \_\_namedParameters

#### input

`TInput`

#### log?

(...`args`) => `void`

#### onBatchAddRequests?

[`OnBatchAddRequests`](../type-aliases/OnBatchAddRequests.md)

#### onDone?

(`done`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\> = `...`

#### onPushData?

(`data`, `done`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### runCrawler

() => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### vi

`VitestUtils`

## Returns

`Promise`\<`void`\>
