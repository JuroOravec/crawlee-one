[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / PushDataOptions

# Interface: PushDataOptions\<T\>

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:63

## Type Parameters

### T

`T` *extends* `object`

## Properties

### cacheActionOnResult?

> `optional` **cacheActionOnResult**: `"add"` \| `"remove"` \| `"overwrite"` \| `null`

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:138

Define whether we want to add, remove, or overwrite cached entries with results from the actor run

***

### cachePrimaryKeys?

> `optional` **cachePrimaryKeys**: `string`[]

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:136

Define fields that uniquely identify entries for caching

***

### cacheStoreId?

> `optional` **cacheStoreId**: `string`

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:134

ID or name of the key-value store used as cache

***

### datasetId?

> `optional` **datasetId**: `string`

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:130

ID or name of the dataset to which the data should be pushed

***

### filter()?

> `optional` **filter**: (`item`) => `unknown`

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:128

Option to filter an entry before pushing it to the dataset.

This serves mainly to allow users to filter the entries from actor input UI.

#### Parameters

##### item

`any`

#### Returns

`unknown`

***

### includeMetadata?

> `optional` **includeMetadata**: `boolean`

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:81

Whether items should be enriched with request and run metadata.

If truthy, the metadata is set under the `metadata` property.

***

### io?

> `optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)\<`any`, `any`, `object`\>

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:64

***

### log?

> `optional` **log**: `Log`

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:65

***

### maxCount?

> `optional` **maxCount**: `number`

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:75

If set, only at most this many entries will be scraped.

The count is determined from the Dataset that's used for the crawler run.

This means that if `maxCount` is set to 50, but the
associated Dataset already has 40 items in it, then only 10 new entries
will be saved.

***

### pickKeys?

> `optional` **pickKeys**: `string`[]

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:107

Option to select which keys (fields) of an entry to keep (discarding the rest)
before pushing the entries to the dataset.

This serves mainly to allow users to select the keys from actor input UI.

This is done before `remapKeys`.

Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
resolved using Lodash.get().

***

### privacyMask

> **privacyMask**: [`PrivacyMask`](../type-aliases/PrivacyMask.md)\<`T`\>

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:95

Determine which properties are considered personal data.

See [PrivacyMask](../type-aliases/PrivacyMask.md).

***

### remapKeys?

> `optional` **remapKeys**: `Record`\<`string`, `string`\>

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:116

Option to remap the keys before pushing the entries to the dataset.

This serves mainly to allow users to remap the keys from actor input UI.

Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
resolved using Lodash.get().

***

### requestQueueId?

> `optional` **requestQueueId**: `string`

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:132

ID of the RequestQueue that stores remaining requests

***

### showPrivate?

> `optional` **showPrivate**: `boolean`

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:89

Whether properties that are considered personal data should be shown as is.

If falsy or not set, these properties are redacted to hide the actual information.

Which properties are personal data is determined by `privacyMask`.

***

### transform()?

> `optional` **transform**: (`item`) => `any`

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:122

Option to freely transform an entry before pushing it to the dataset.

This serves mainly to allow users to transform the entries from actor input UI.

#### Parameters

##### item

`any`

#### Returns

`any`
