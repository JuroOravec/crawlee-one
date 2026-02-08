[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneRequestQueue

# Interface: CrawleeOneRequestQueue

Interface for storing and retrieving Requests (URLs) to scrape

This interface is based on Crawlee/Apify, but defined separately to allow
drop-in replacement with other integrations.

## Properties

### addRequests()

> **addRequests**: (`requestsLike`, `options`?) => `unknown`

Adds requests to the queue.

If a request that is passed in is already present due to its uniqueKey property
being the same, it will not be updated.

#### Parameters

• **requestsLike**: (`Request`\<`Dictionary`\> \| `RequestOptions`\<`Dictionary`\>)[]

Objects with request data.

• **options?**

• **options.forefront?**: `boolean`

If set to true, the request will be added to the foremost position in the queue,
so that it's returned in the next call to [CrawleeOneRequestQueue.fetchNextRequest](CrawleeOneRequestQueue.md#fetchnextrequest).

By default, it's put to the end of the queue.

#### Returns

`unknown`

#### Source

[src/lib/integrations/types.ts:239](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L239)

***

### clear()

> **clear**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Removes all entries from the queue.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/integrations/types.ts:299](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L299)

***

### drop()

> **drop**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Removes the queue from the storage.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/integrations/types.ts:297](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L297)

***

### fetchNextRequest()

> **fetchNextRequest**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`null` \| `Request`\<`Dictionary`\>\>

Returns a next request in the queue to be processed, or null if there are no more
pending requests.

Once you successfully finish processing of the request, you need to call
[CrawleeOneRequestQueue.markRequestHandled](CrawleeOneRequestQueue.md#markrequesthandled) to mark the request as handled
in the queue. If there was some error in processing the request, call
[CrawleeOneRequestQueue.reclaimRequest](CrawleeOneRequestQueue.md#reclaimrequest) instead, so that the queue will
give the request to some other consumer in another call to the fetchNextRequest function.

Note that the null return value doesn't mean the queue processing finished,
it means there are currently no pending requests. To check whether all requests in queue
were finished, use [CrawleeOneRequestQueue.isFinished](CrawleeOneRequestQueue.md#isfinished) instead.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`null` \| `Request`\<`Dictionary`\>\>

#### Source

[src/lib/integrations/types.ts:274](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L274)

***

### handledCount()

> **handledCount**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`null` \| `number`\>

Returns the number of handled requests.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`null` \| `number`\>

#### Source

[src/lib/integrations/types.ts:301](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L301)

***

### isFinished()

> **isFinished**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

Resolves to true if all requests were already handled and there are no more left. Due to the nature
of distributed storage used by the queue, the function might occasionally return a false negative.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

#### Source

[src/lib/integrations/types.ts:295](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L295)

***

### markRequestHandled()

> **markRequestHandled**: (`req`) => `unknown`

Marks a request that was previously returned by the
[CrawleeOneRequestQueue.fetchNextRequest](CrawleeOneRequestQueue.md#fetchnextrequest) function as handled after successful
processing. Handled requests will never again be returned by the fetchNextRequest function.

#### Parameters

• **req**: `Request`\<`Dictionary`\>

#### Returns

`unknown`

#### Source

[src/lib/integrations/types.ts:257](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L257)

***

### reclaimRequest()

> **reclaimRequest**: (`req`, `options`?) => `unknown`

Reclaims a failed request back to the queue, so that it can be returned
for processing later again by another call to [CrawleeOneRequestQueue.fetchNextRequest](CrawleeOneRequestQueue.md#fetchnextrequest).

#### Parameters

• **req**: `Request`\<`Dictionary`\>

• **options?**

• **options.forefront?**: `boolean`

If set to true, the request will be placed to the beginning of the queue,
so that it's returned in the next call to [CrawleeOneRequestQueue.fetchNextRequest](CrawleeOneRequestQueue.md#fetchnextrequest).

By default, it's put to the end of the queue.

#### Returns

`unknown`

#### Source

[src/lib/integrations/types.ts:279](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L279)
