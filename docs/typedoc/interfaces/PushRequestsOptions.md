[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / PushRequestsOptions

# Interface: PushRequestsOptions\<T\>

## Type parameters

• **T** *extends* `Exclude`\<[`CrawlerUrl`](../type-aliases/CrawlerUrl.md), `string`\> = `Exclude`\<[`CrawlerUrl`](../type-aliases/CrawlerUrl.md), `string`\>

## Properties

### filter()?

> `optional` **filter**: (`req`) => `unknown`

Option to filter a request before pushing it to the RequestQueue.

This serves mainly to allow users to filter the requests from actor input UI.

#### Parameters

• **req**: `T`

#### Returns

`unknown`

#### Source

[src/lib/io/pushRequests.ts:35](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushRequests.ts#L35)

***

### io?

> `optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)\<`any`, `any`, `object`\>

#### Source

[src/lib/io/pushRequests.ts:12](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushRequests.ts#L12)

***

### log?

> `optional` **log**: `Log`

#### Source

[src/lib/io/pushRequests.ts:13](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushRequests.ts#L13)

***

### maxCount?

> `optional` **maxCount**: `number`

If set, only at most this many requests will be added to the RequestQueue.

The count is determined from the RequestQueue that's used for the crawler run.

This means that if `maxCount` is set to 50, but the
associated RequestQueue already handled 40 requests, then only 10 new requests
will be processed.

#### Source

[src/lib/io/pushRequests.ts:23](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushRequests.ts#L23)

***

### queueOptions?

> `optional` **queueOptions**: `RequestQueueOperationOptions`

#### Source

[src/lib/io/pushRequests.ts:40](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushRequests.ts#L40)

***

### requestQueueId?

> `optional` **requestQueueId**: `string`

ID of the RequestQueue to which the data should be pushed

#### Source

[src/lib/io/pushRequests.ts:37](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushRequests.ts#L37)

***

### transform()?

> `optional` **transform**: (`req`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`\>

Option to freely transform a request before pushing it to the RequestQueue.

This serves mainly to allow users to transform the requests from actor input UI.

#### Parameters

• **req**: `T`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`\>

#### Source

[src/lib/io/pushRequests.ts:29](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushRequests.ts#L29)
