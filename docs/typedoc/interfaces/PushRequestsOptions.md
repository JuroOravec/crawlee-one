[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / PushRequestsOptions

# Interface: PushRequestsOptions\<T\>

Defined in: [src/lib/io/pushRequests.ts:9](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/pushRequests.ts#L9)

## Type Parameters

### T

`T` *extends* `Exclude`\<[`CrawlerUrl`](../type-aliases/CrawlerUrl.md), `string`\> = `Exclude`\<[`CrawlerUrl`](../type-aliases/CrawlerUrl.md), `string`\>

## Properties

### filter()?

> `optional` **filter**: (`req`) => `unknown`

Defined in: [src/lib/io/pushRequests.ts:35](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/pushRequests.ts#L35)

Option to filter a request before pushing it to the RequestQueue.

This serves mainly to allow users to filter the requests from actor input UI.

#### Parameters

##### req

`T`

#### Returns

`unknown`

***

### io?

> `optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)\<`any`, `any`, `object`\>

Defined in: [src/lib/io/pushRequests.ts:12](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/pushRequests.ts#L12)

***

### log?

> `optional` **log**: `Log`

Defined in: [src/lib/io/pushRequests.ts:13](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/pushRequests.ts#L13)

***

### maxCount?

> `optional` **maxCount**: `number`

Defined in: [src/lib/io/pushRequests.ts:23](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/pushRequests.ts#L23)

If set, only at most this many requests will be added to the RequestQueue.

The count is determined from the RequestQueue that's used for the crawler run.

This means that if `maxCount` is set to 50, but the
associated RequestQueue already handled 40 requests, then only 10 new requests
will be processed.

***

### queueOptions?

> `optional` **queueOptions**: `RequestQueueOperationOptions`

Defined in: [src/lib/io/pushRequests.ts:40](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/pushRequests.ts#L40)

***

### requestQueueId?

> `optional` **requestQueueId**: `string`

Defined in: [src/lib/io/pushRequests.ts:37](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/pushRequests.ts#L37)

ID of the RequestQueue to which the data should be pushed

***

### transform()?

> `optional` **transform**: (`req`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`\>

Defined in: [src/lib/io/pushRequests.ts:29](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/pushRequests.ts#L29)

Option to freely transform a request before pushing it to the RequestQueue.

This serves mainly to allow users to transform the requests from actor input UI.

#### Parameters

##### req

`T`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`\>
