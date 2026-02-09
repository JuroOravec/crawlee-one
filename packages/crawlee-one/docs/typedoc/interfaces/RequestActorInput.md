[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / RequestActorInput

# Interface: RequestActorInput

Defined in: packages/crawlee-one/src/lib/input.ts:145

Common input fields related to actor requests

## Properties

### requestFilter?

> `optional` **requestFilter**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)\<\[`Source`\], `unknown`\>

Defined in: packages/crawlee-one/src/lib/input.ts:201

Option to filter a request using a custom function before pushing it to the RequestQueue.

If not set, all requests will be included.

This is done after `requestTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the second argument.

`async (entry, { io, input, state, itemCacheKey }) => boolean`

***

### requestFilterAfter?

> `optional` **requestFilterAfter**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)

Defined in: packages/crawlee-one/src/lib/input.ts:219

Use this if you need to run one-time initialization code after `requestFilter`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => boolean`

***

### requestFilterBefore?

> `optional` **requestFilterBefore**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)

Defined in: packages/crawlee-one/src/lib/input.ts:210

Use this if you need to run one-time initialization code before `requestFilter`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => boolean`

***

### requestMaxEntries?

> `optional` **requestMaxEntries**: `number`

Defined in: packages/crawlee-one/src/lib/input.ts:155

If set, only at most this many requests will be scraped.

The count is determined from the RequestQueue that's used for the Actor run.

This means that if `requestMaxEntries` is set to 50, but the
associated RequestQueue already handled 40 requests, then only 10 new requests
will be handled.

***

### requestQueueId?

> `optional` **requestQueueId**: `string`

Defined in: packages/crawlee-one/src/lib/input.ts:222

ID of the RequestQueue to which the requests should be pushed

***

### requestTransform?

> `optional` **requestTransform**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)\<\[`Source`\], `Source`\>

Defined in: packages/crawlee-one/src/lib/input.ts:167

Option to freely transform a request using a custom function before pushing it to the RequestQueue.

If not set, the request will remain as is.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the second argument.

`async (entry, { io, input, state, itemCacheKey }) => { ... }`

***

### requestTransformAfter?

> `optional` **requestTransformAfter**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)

Defined in: packages/crawlee-one/src/lib/input.ts:187

Use this if you need to run one-time teardown code after `requestTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => { ... }`

***

### requestTransformBefore?

> `optional` **requestTransformBefore**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)

Defined in: packages/crawlee-one/src/lib/input.ts:178

Use this if you need to run one-time initialization code before `requestTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => { ... }`
