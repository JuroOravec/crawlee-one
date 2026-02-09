[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / runCrawlerTest

# Function: runCrawlerTest()

> **runCrawlerTest**\<`TData`, `TInput`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [src/lib/test/actor.ts:61](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/test/actor.ts#L61)

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
