[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneRequestQueue

# Interface: CrawleeOneRequestQueue

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:232](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L232)

Interface for storing and retrieving Requests (URLs) to scrape

This interface is based on Crawlee/Apify, but defined separately to allow
drop-in replacement with other integrations.

## Properties

### addRequest()

> **addRequest**: (`requestLike`, `options?`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<\{ `requestId`: `string`; `wasAlreadyHandled`: `boolean`; `wasAlreadyPresent`: `boolean`; \}\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:237](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L237)

Adds a single request to the queue. Returns operation info including wasAlreadyHandled.

#### Parameters

##### requestLike

`Request`\<`Dictionary`\> | `Record`\<`string`, `unknown`\>

##### options?

###### forefront?

`boolean`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<\{ `requestId`: `string`; `wasAlreadyHandled`: `boolean`; `wasAlreadyPresent`: `boolean`; \}\>

---

### addRequests()

> **addRequests**: (`requestsLike`, `options?`) => `unknown`

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:251](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L251)

Adds requests to the queue.

If a request that is passed in is already present due to its uniqueKey property
being the same, it will not be updated.

#### Parameters

##### requestsLike

(`Request`\<`Dictionary`\> \| `RequestOptions`\<`Dictionary`\>)[]

Objects with request data.

##### options?

###### forefront?

`boolean`

If set to true, the request will be added to the foremost position in the queue,
so that it's returned in the next call to [CrawleeOneRequestQueue.fetchNextRequest](#fetchnextrequest).

By default, it's put to the end of the queue.

#### Returns

`unknown`

---

### clear()

> **clear**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:311](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L311)

Removes all entries from the queue.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

---

### drop()

> **drop**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:309](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L309)

Removes the queue from the storage.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

---

### fetchNextRequest()

> **fetchNextRequest**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`Request`\<`Dictionary`\> \| `null`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:286](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L286)

Returns a next request in the queue to be processed, or null if there are no more
pending requests.

Once you successfully finish processing of the request, you need to call
[CrawleeOneRequestQueue.markRequestHandled](#markrequesthandled) to mark the request as handled
in the queue. If there was some error in processing the request, call
[CrawleeOneRequestQueue.reclaimRequest](#reclaimrequest) instead, so that the queue will
give the request to some other consumer in another call to the fetchNextRequest function.

Note that the null return value doesn't mean the queue processing finished,
it means there are currently no pending requests. To check whether all requests in queue
were finished, use [CrawleeOneRequestQueue.isFinished](#isfinished) instead.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`Request`\<`Dictionary`\> \| `null`\>

— Returns the request object or null if there are no more pending requests.

---

### getRequest()

> **getRequest**: (`id`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`Request`\<`Dictionary`\> \| `null`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:244](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L244)

Gets a request by ID. Used with reclaimRequest when addRequest returns wasAlreadyHandled.

#### Parameters

##### id

`string`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`Request`\<`Dictionary`\> \| `null`\>

---

### handledCount()

> **handledCount**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`number` \| `null`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:313](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L313)

Returns the number of handled requests.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`number` \| `null`\>

---

### isFinished()

> **isFinished**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:307](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L307)

Resolves to true if all requests were already handled and there are no more left. Due to the nature
of distributed storage used by the queue, the function might occasionally return a false negative.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

---

### markRequestHandled()

> **markRequestHandled**: (`req`) => `unknown`

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:269](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L269)

Marks a request that was previously returned by the
[CrawleeOneRequestQueue.fetchNextRequest](#fetchnextrequest) function as handled after successful
processing. Handled requests will never again be returned by the fetchNextRequest function.

#### Parameters

##### req

`Request`

#### Returns

`unknown`

---

### name?

> `optional` **name**: `string`

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:233](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L233)

---

### reclaimRequest()

> **reclaimRequest**: (`req`, `options?`) => `unknown`

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:291](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/integrations/types.ts#L291)

Reclaims a failed request back to the queue, so that it can be returned
for processing later again by another call to [CrawleeOneRequestQueue.fetchNextRequest](#fetchnextrequest).

#### Parameters

##### req

`Request`

##### options?

###### forefront?

`boolean`

If set to true, the request will be placed to the beginning of the queue,
so that it's returned in the next call to [CrawleeOneRequestQueue.fetchNextRequest](#fetchnextrequest).

By default, it's put to the end of the queue.

#### Returns

`unknown`
