[crawlee-one](../README.md) / [Exports](../modules.md) / CrawleeOneRequestQueue

# Interface: CrawleeOneRequestQueue

Interface for storing and retrieving Requests (URLs) to scrape

This interface is based on Crawlee/Apify, but defined separately to allow
drop-in replacement with other integrations.

## Table of contents

### Properties

- [addRequests](CrawleeOneRequestQueue.md#addrequests)
- [clear](CrawleeOneRequestQueue.md#clear)
- [drop](CrawleeOneRequestQueue.md#drop)
- [fetchNextRequest](CrawleeOneRequestQueue.md#fetchnextrequest)
- [handledCount](CrawleeOneRequestQueue.md#handledcount)
- [isFinished](CrawleeOneRequestQueue.md#isfinished)
- [markRequestHandled](CrawleeOneRequestQueue.md#markrequesthandled)
- [reclaimRequest](CrawleeOneRequestQueue.md#reclaimrequest)

## Properties

### addRequests

• **addRequests**: (`requestsLike`: (`RequestOptions`<`Dictionary`\> \| `Request`<`Dictionary`\>)[], `options?`: { `forefront?`: `boolean`  }) => `unknown`

#### Type declaration

▸ (`requestsLike`, `options?`): `unknown`

Adds requests to the queue.

If a request that is passed in is already present due to its uniqueKey property
being the same, it will not be updated.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `requestsLike` | (`RequestOptions`<`Dictionary`\> \| `Request`<`Dictionary`\>)[] | Objects with request data. |
| `options?` | `Object` | - |
| `options.forefront?` | `boolean` | If set to true, the request will be added to the foremost position in the queue, so that it's returned in the next call to [CrawleeOneRequestQueue.fetchNextRequest](CrawleeOneRequestQueue.md#fetchnextrequest). By default, it's put to the end of the queue. |

##### Returns

`unknown`

#### Defined in

[src/lib/integrations/types.ts:239](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/integrations/types.ts#L239)

___

### clear

• **clear**: () => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

Removes all entries from the queue.

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/integrations/types.ts:299](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/integrations/types.ts#L299)

___

### drop

• **drop**: () => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

Removes the queue from the storage.

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/integrations/types.ts:297](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/integrations/types.ts#L297)

___

### fetchNextRequest

• **fetchNextRequest**: () => [`MaybePromise`](../modules.md#maybepromise)<``null`` \| `Request`<`Dictionary`\>\>

#### Type declaration

▸ (): [`MaybePromise`](../modules.md#maybepromise)<``null`` \| `Request`<`Dictionary`\>\>

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

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<``null`` \| `Request`<`Dictionary`\>\>

— Returns the request object or null if there are no more pending requests.

#### Defined in

[src/lib/integrations/types.ts:274](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/integrations/types.ts#L274)

___

### handledCount

• **handledCount**: () => [`MaybePromise`](../modules.md#maybepromise)<``null`` \| `number`\>

#### Type declaration

▸ (): [`MaybePromise`](../modules.md#maybepromise)<``null`` \| `number`\>

Returns the number of handled requests.

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<``null`` \| `number`\>

#### Defined in

[src/lib/integrations/types.ts:301](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/integrations/types.ts#L301)

___

### isFinished

• **isFinished**: () => [`MaybePromise`](../modules.md#maybepromise)<`boolean`\>

#### Type declaration

▸ (): [`MaybePromise`](../modules.md#maybepromise)<`boolean`\>

Resolves to true if all requests were already handled and there are no more left. Due to the nature
of distributed storage used by the queue, the function might occasionally return a false negative.

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`boolean`\>

#### Defined in

[src/lib/integrations/types.ts:295](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/integrations/types.ts#L295)

___

### markRequestHandled

• **markRequestHandled**: (`req`: `Request`<`Dictionary`\>) => `unknown`

#### Type declaration

▸ (`req`): `unknown`

Marks a request that was previously returned by the
[CrawleeOneRequestQueue.fetchNextRequest](CrawleeOneRequestQueue.md#fetchnextrequest) function as handled after successful
processing. Handled requests will never again be returned by the fetchNextRequest function.

##### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `Request`<`Dictionary`\> |

##### Returns

`unknown`

#### Defined in

[src/lib/integrations/types.ts:257](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/integrations/types.ts#L257)

___

### reclaimRequest

• **reclaimRequest**: (`req`: `Request`<`Dictionary`\>, `options?`: { `forefront?`: `boolean`  }) => `unknown`

#### Type declaration

▸ (`req`, `options?`): `unknown`

Reclaims a failed request back to the queue, so that it can be returned
for processing later again by another call to [CrawleeOneRequestQueue.fetchNextRequest](CrawleeOneRequestQueue.md#fetchnextrequest).

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `req` | `Request`<`Dictionary`\> | - |
| `options?` | `Object` | - |
| `options.forefront?` | `boolean` | If set to true, the request will be placed to the beginning of the queue, so that it's returned in the next call to [CrawleeOneRequestQueue.fetchNextRequest](CrawleeOneRequestQueue.md#fetchnextrequest). By default, it's put to the end of the queue. |

##### Returns

`unknown`

#### Defined in

[src/lib/integrations/types.ts:279](https://github.com/JuroOravec/crawlee-one/blob/708935c/src/lib/integrations/types.ts#L279)
