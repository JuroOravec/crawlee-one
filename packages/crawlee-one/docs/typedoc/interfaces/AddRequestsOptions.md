[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / AddRequestsOptions

# Interface: AddRequestsOptions\<T\>

Defined in: [packages/crawlee-one/src/lib/io/addRequests.ts:10](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/addRequests.ts#L10)

Options for addRequests. Extends Crawlee's RequestQueueOperationOptions (e.g. forefront).

## Extends

- `RequestQueueOperationOptions`

## Type Parameters

### T

`T` *extends* `Exclude`\<[`CrawlerUrl`](../type-aliases/CrawlerUrl.md), `string`\> = `Exclude`\<[`CrawlerUrl`](../type-aliases/CrawlerUrl.md), `string`\>

## Properties

### cache?

> `optional` **cache**: `boolean`

Defined in: node\_modules/.pnpm/@crawlee+core@3.16.0/node\_modules/@crawlee/core/storages/request\_provider.d.ts:325

**`Internal`**

Should the requests be added to the local LRU cache?

#### Default

```ts
false
@internal
```

#### Inherited from

`RequestQueueOperationOptions.cache`

***

### filter()?

> `optional` **filter**: (`req`) => `unknown`

Defined in: [packages/crawlee-one/src/lib/io/addRequests.ts:36](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/addRequests.ts#L36)

Option to filter a request before pushing it to the RequestQueue.

This serves mainly to allow users to filter the requests from actor input UI.

#### Parameters

##### req

`T`

#### Returns

`unknown`

***

### forefront?

> `optional` **forefront**: `boolean`

Defined in: node\_modules/.pnpm/@crawlee+core@3.16.0/node\_modules/@crawlee/core/storages/request\_provider.d.ts:319

If set to `true`:
  - while adding the request to the queue: the request will be added to the foremost position in the queue.
  - while reclaiming the request: the request will be placed to the beginning of the queue, so that it's returned
  in the next call to RequestQueue.fetchNextRequest.
By default, it's put to the end of the queue.

In case the request is already present in the queue, this option has no effect.

If more requests are added with this option at once, their order in the following `fetchNextRequest` call
is arbitrary.

#### Default

```ts
false
```

#### Inherited from

`RequestQueueOperationOptions.forefront`

***

### io?

> `optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)\<`any`, `any`, `object`\>

Defined in: [packages/crawlee-one/src/lib/io/addRequests.ts:13](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/addRequests.ts#L13)

***

### log?

> `optional` **log**: `Log`

Defined in: [packages/crawlee-one/src/lib/io/addRequests.ts:14](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/addRequests.ts#L14)

***

### maxCount?

> `optional` **maxCount**: `number`

Defined in: [packages/crawlee-one/src/lib/io/addRequests.ts:24](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/addRequests.ts#L24)

If set, only at most this many requests will be added to the RequestQueue.

The count is determined from the RequestQueue that's used for the crawler run.

This means that if `maxCount` is set to 50, but the
associated RequestQueue already handled 40 requests, then only 10 new requests
will be processed.

***

### requestQueueId?

> `optional` **requestQueueId**: `string`

Defined in: [packages/crawlee-one/src/lib/io/addRequests.ts:38](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/addRequests.ts#L38)

ID of the RequestQueue to which the data should be pushed

***

### transform()?

> `optional` **transform**: (`req`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`\>

Defined in: [packages/crawlee-one/src/lib/io/addRequests.ts:30](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/addRequests.ts#L30)

Option to freely transform a request before pushing it to the RequestQueue.

This serves mainly to allow users to transform the requests from actor input UI.

#### Parameters

##### req

`T`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`\>
