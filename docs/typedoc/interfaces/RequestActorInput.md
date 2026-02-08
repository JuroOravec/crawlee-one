[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / RequestActorInput

# Interface: RequestActorInput

Common input fields related to actor requests

## Properties

### requestFilter?

> `optional` **requestFilter**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)\<[`Source`], `unknown`\>

Option to filter a request using a custom function before pushing it to the RequestQueue.

If not set, all requests will be included.

This is done after `requestTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the second argument.

`async (entry, { io, input, state, itemCacheKey }) => boolean`

#### Source

[src/lib/input.ts:201](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L201)

***

### requestFilterAfter?

> `optional` **requestFilterAfter**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)

Use this if you need to run one-time initialization code after `requestFilter`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => boolean`

#### Source

[src/lib/input.ts:219](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L219)

***

### requestFilterBefore?

> `optional` **requestFilterBefore**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)

Use this if you need to run one-time initialization code before `requestFilter`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => boolean`

#### Source

[src/lib/input.ts:210](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L210)

***

### requestMaxEntries?

> `optional` **requestMaxEntries**: `number`

If set, only at most this many requests will be scraped.

The count is determined from the RequestQueue that's used for the Actor run.

This means that if `requestMaxEntries` is set to 50, but the
associated RequestQueue already handled 40 requests, then only 10 new requests
will be handled.

#### Source

[src/lib/input.ts:155](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L155)

***

### requestQueueId?

> `optional` **requestQueueId**: `string`

ID of the RequestQueue to which the requests should be pushed

#### Source

[src/lib/input.ts:222](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L222)

***

### requestTransform?

> `optional` **requestTransform**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)\<[`Source`], `Source`\>

Option to freely transform a request using a custom function before pushing it to the RequestQueue.

If not set, the request will remain as is.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the second argument.

`async (entry, { io, input, state, itemCacheKey }) => { ... }`

#### Source

[src/lib/input.ts:167](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L167)

***

### requestTransformAfter?

> `optional` **requestTransformAfter**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)

Use this if you need to run one-time teardown code after `requestTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => { ... }`

#### Source

[src/lib/input.ts:187](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L187)

***

### requestTransformBefore?

> `optional` **requestTransformBefore**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)

Use this if you need to run one-time initialization code before `requestTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => { ... }`

#### Source

[src/lib/input.ts:178](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L178)
