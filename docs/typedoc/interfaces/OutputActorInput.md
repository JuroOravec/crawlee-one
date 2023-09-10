[crawlee-one](../README.md) / [Exports](../modules.md) / OutputActorInput

# Interface: OutputActorInput

Common input fields related to actor output

## Table of contents

### Properties

- [outputCacheActionOnResult](OutputActorInput.md#outputcacheactiononresult)
- [outputCachePrimaryKeys](OutputActorInput.md#outputcacheprimarykeys)
- [outputCacheStoreId](OutputActorInput.md#outputcachestoreid)
- [outputDatasetId](OutputActorInput.md#outputdatasetid)
- [outputFilter](OutputActorInput.md#outputfilter)
- [outputFilterAfter](OutputActorInput.md#outputfilterafter)
- [outputFilterBefore](OutputActorInput.md#outputfilterbefore)
- [outputMaxEntries](OutputActorInput.md#outputmaxentries)
- [outputPickFields](OutputActorInput.md#outputpickfields)
- [outputRenameFields](OutputActorInput.md#outputrenamefields)
- [outputTransform](OutputActorInput.md#outputtransform)
- [outputTransformAfter](OutputActorInput.md#outputtransformafter)
- [outputTransformBefore](OutputActorInput.md#outputtransformbefore)

## Properties

### outputCacheActionOnResult

• `Optional` **outputCacheActionOnResult**: ``null`` \| ``"add"`` \| ``"remove"`` \| ``"overwrite"``

Define whether we want to add, remove, or overwrite cached entries with results from the actor run

#### Defined in

src/lib/input.ts:330

___

### outputCachePrimaryKeys

• `Optional` **outputCachePrimaryKeys**: `string`[]

Define fields that will be used for cache key

#### Defined in

src/lib/input.ts:328

___

### outputCacheStoreId

• `Optional` **outputCacheStoreId**: `string`

ID or name of the key-value store used as cache

#### Defined in

src/lib/input.ts:326

___

### outputDatasetId

• `Optional` **outputDatasetId**: `string`

ID or name of the dataset to which the data should be pushed

#### Defined in

src/lib/input.ts:323

___

### outputFilter

• `Optional` **outputFilter**: `string` \| [`CrawleeOneHookFn`](../modules.md#crawleeonehookfn)<[item: any], `any`\>

Option to filter out the data using a custom function before pushing it to the dataset.

If not set, all entries will be included.

This is done after `outputPickFields`, `outputRenameFields`, and `outputTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the second argument.

`async (entry, { io, input, state, itemCacheKey }) => boolean`

#### Defined in

src/lib/input.ts:302

___

### outputFilterAfter

• `Optional` **outputFilterAfter**: `string` \| [`CrawleeOneHookFn`](../modules.md#crawleeonehookfn)

Use this if you need to run one-time initialization code after `outputFilter`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => boolean`

#### Defined in

src/lib/input.ts:320

___

### outputFilterBefore

• `Optional` **outputFilterBefore**: `string` \| [`CrawleeOneHookFn`](../modules.md#crawleeonehookfn)

Use this if you need to run one-time initialization code before `outputFilter`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => boolean`

#### Defined in

src/lib/input.ts:311

___

### outputMaxEntries

• `Optional` **outputMaxEntries**: `number`

If set, only at most this many entries will be scraped.

The count is determined from the Dataset that's used for the Actor run.

This means that if `outputMaxEntries` is set to 50, but the
associated Dataset already has 40 items in it, then only 10 new entries
will be saved.

#### Defined in

src/lib/input.ts:235

___

### outputPickFields

• `Optional` **outputPickFields**: `string`[]

Option to select a subset of keys/fields of an entry that
will be pushed to the dataset.

If not set, all fields on an entry will be pushed to the dataset.

This is done after `outputRenameFields`.

Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
resolved using Lodash.get().

#### Defined in

src/lib/input.ts:247

___

### outputRenameFields

• `Optional` **outputRenameFields**: `Record`<`string`, `string`\>

Option to remap the keys before pushing the entries to the dataset.

This is done before `outputRenameFields`.

Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
resolved using Lodash.get().

#### Defined in

src/lib/input.ts:256

___

### outputTransform

• `Optional` **outputTransform**: `string` \| [`CrawleeOneHookFn`](../modules.md#crawleeonehookfn)<[item: any], `any`\>

Option to freely transform the output data object using a custom function before pushing it to the dataset.

If not set, the data will remain as is.

This is done after `outputPickFields` and `outputRenameFields`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the second argument.

`async (entry, { io, input, state, itemCacheKey }) => { ... }`

#### Defined in

src/lib/input.ts:270

___

### outputTransformAfter

• `Optional` **outputTransformAfter**: `string` \| [`CrawleeOneHookFn`](../modules.md#crawleeonehookfn)

Use this if you need to run one-time teardown code after `outputTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => { ... }`

#### Defined in

src/lib/input.ts:288

___

### outputTransformBefore

• `Optional` **outputTransformBefore**: `string` \| [`CrawleeOneHookFn`](../modules.md#crawleeonehookfn)

Use this if you need to run one-time initialization code before `outputTransform`.

The function has access to Apify's Actor class (under variable `io`), and actor's input
and a shared state in the first argument.

`async ({ io, input, state, itemCacheKey }) => { ... }`

#### Defined in

src/lib/input.ts:279
