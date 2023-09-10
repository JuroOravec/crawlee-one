[crawlee-one](../README.md) / [Exports](../modules.md) / RequestActorInput

# Interface: RequestActorInput

Common input fields related to actor requests

## Table of contents

### Properties

- [requestFilter](RequestActorInput.md#requestfilter)
- [requestFilterAfter](RequestActorInput.md#requestfilterafter)
- [requestFilterBefore](RequestActorInput.md#requestfilterbefore)
- [requestMaxEntries](RequestActorInput.md#requestmaxentries)
- [requestQueueId](RequestActorInput.md#requestqueueid)
- [requestTransform](RequestActorInput.md#requesttransform)
- [requestTransformAfter](RequestActorInput.md#requesttransformafter)
- [requestTransformBefore](RequestActorInput.md#requesttransformbefore)

## Properties

### requestFilter

• `Optional` **requestFilter**: `string` \| [`CrawleeOneHookFn`](../modules.md#crawleeonehookfn)<[`RequestOptions`<`Dictionary`\> \| `Request`<`Dictionary`\>], `unknown`\>

Option to filter a request using a custom function before pushing it to the RequestQueue.

If not set, all requests will be included.

This is done after `requestTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the second argument.

`async (entry, { io, input, state, itemCacheKey }) => boolean`

#### Defined in

[src/lib/input.ts:200](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/input.ts#L200)

___

### requestFilterAfter

• `Optional` **requestFilterAfter**: `string` \| [`CrawleeOneHookFn`](../modules.md#crawleeonehookfn)

Use this if you need to run one-time initialization code after `requestFilter`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => boolean`

#### Defined in

[src/lib/input.ts:218](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/input.ts#L218)

___

### requestFilterBefore

• `Optional` **requestFilterBefore**: `string` \| [`CrawleeOneHookFn`](../modules.md#crawleeonehookfn)

Use this if you need to run one-time initialization code before `requestFilter`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => boolean`

#### Defined in

[src/lib/input.ts:209](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/input.ts#L209)

___

### requestMaxEntries

• `Optional` **requestMaxEntries**: `number`

If set, only at most this many requests will be scraped.

The count is determined from the RequestQueue that's used for the Actor run.

This means that if `requestMaxEntries` is set to 50, but the
associated RequestQueue already handled 40 requests, then only 10 new requests
will be handled.

#### Defined in

[src/lib/input.ts:154](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/input.ts#L154)

___

### requestQueueId

• `Optional` **requestQueueId**: `string`

ID of the RequestQueue to which the requests should be pushed

#### Defined in

[src/lib/input.ts:221](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/input.ts#L221)

___

### requestTransform

• `Optional` **requestTransform**: `string` \| [`CrawleeOneHookFn`](../modules.md#crawleeonehookfn)<[`RequestOptions`<`Dictionary`\> \| `Request`<`Dictionary`\>], `RequestOptions`<`Dictionary`\> \| `Request`<`Dictionary`\>\>

Option to freely transform a request using a custom function before pushing it to the RequestQueue.

If not set, the request will remain as is.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the second argument.

`async (entry, { io, input, state, itemCacheKey }) => { ... }`

#### Defined in

[src/lib/input.ts:166](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/input.ts#L166)

___

### requestTransformAfter

• `Optional` **requestTransformAfter**: `string` \| [`CrawleeOneHookFn`](../modules.md#crawleeonehookfn)

Use this if you need to run one-time teardown code after `requestTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => { ... }`

#### Defined in

[src/lib/input.ts:186](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/input.ts#L186)

___

### requestTransformBefore

• `Optional` **requestTransformBefore**: `string` \| [`CrawleeOneHookFn`](../modules.md#crawleeonehookfn)

Use this if you need to run one-time initialization code before `requestTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => { ... }`

#### Defined in

[src/lib/input.ts:177](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/input.ts#L177)
