[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / OutputActorInput

# Interface: OutputActorInput

Defined in: packages/crawlee-one/src/lib/input.ts:226

Common input fields related to actor output

## Properties

### outputCacheActionOnResult?

> `optional` **outputCacheActionOnResult**: `"add"` \| `"remove"` \| `"overwrite"` \| `null`

Defined in: packages/crawlee-one/src/lib/input.ts:331

Define whether we want to add, remove, or overwrite cached entries with results from the actor run

***

### outputCachePrimaryKeys?

> `optional` **outputCachePrimaryKeys**: `string`[]

Defined in: packages/crawlee-one/src/lib/input.ts:329

Define fields that will be used for cache key

***

### outputCacheStoreId?

> `optional` **outputCacheStoreId**: `string`

Defined in: packages/crawlee-one/src/lib/input.ts:327

ID or name of the key-value store used as cache

***

### outputDatasetId?

> `optional` **outputDatasetId**: `string`

Defined in: packages/crawlee-one/src/lib/input.ts:324

ID or name of the dataset to which the data should be pushed

***

### outputFilter?

> `optional` **outputFilter**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)\<\[`any`\], `any`\>

Defined in: packages/crawlee-one/src/lib/input.ts:303

Option to filter out the data using a custom function before pushing it to the dataset.

If not set, all entries will be included.

This is done after `outputPickFields`, `outputRenameFields`, and `outputTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the second argument.

`async (entry, { io, input, state, itemCacheKey }) => boolean`

***

### outputFilterAfter?

> `optional` **outputFilterAfter**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)

Defined in: packages/crawlee-one/src/lib/input.ts:321

Use this if you need to run one-time initialization code after `outputFilter`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => boolean`

***

### outputFilterBefore?

> `optional` **outputFilterBefore**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)

Defined in: packages/crawlee-one/src/lib/input.ts:312

Use this if you need to run one-time initialization code before `outputFilter`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => boolean`

***

### outputMaxEntries?

> `optional` **outputMaxEntries**: `number`

Defined in: packages/crawlee-one/src/lib/input.ts:236

If set, only at most this many entries will be scraped.

The count is determined from the Dataset that's used for the Actor run.

This means that if `outputMaxEntries` is set to 50, but the
associated Dataset already has 40 items in it, then only 10 new entries
will be saved.

***

### outputPickFields?

> `optional` **outputPickFields**: `string`[]

Defined in: packages/crawlee-one/src/lib/input.ts:248

Option to select a subset of keys/fields of an entry that
will be pushed to the dataset.

If not set, all fields on an entry will be pushed to the dataset.

This is done after `outputRenameFields`.

Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
resolved using Lodash.get().

***

### outputRenameFields?

> `optional` **outputRenameFields**: `Record`\<`string`, `string`\>

Defined in: packages/crawlee-one/src/lib/input.ts:257

Option to remap the keys before pushing the entries to the dataset.

This is done before `outputRenameFields`.

Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
resolved using Lodash.get().

***

### outputTransform?

> `optional` **outputTransform**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)\<\[`any`\], `any`\>

Defined in: packages/crawlee-one/src/lib/input.ts:271

Option to freely transform the output data object using a custom function before pushing it to the dataset.

If not set, the data will remain as is.

This is done after `outputPickFields` and `outputRenameFields`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the second argument.

`async (entry, { io, input, state, itemCacheKey }) => { ... }`

***

### outputTransformAfter?

> `optional` **outputTransformAfter**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)

Defined in: packages/crawlee-one/src/lib/input.ts:289

Use this if you need to run one-time teardown code after `outputTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => { ... }`

***

### outputTransformBefore?

> `optional` **outputTransformBefore**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)

Defined in: packages/crawlee-one/src/lib/input.ts:280

Use this if you need to run one-time initialization code before `outputTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => { ... }`
