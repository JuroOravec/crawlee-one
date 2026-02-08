[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / PushDataOptions

# Interface: PushDataOptions\<T\>

## Type parameters

• **T** *extends* `object`

## Properties

### cacheActionOnResult?

> `optional` **cacheActionOnResult**: `null` \| `"add"` \| `"remove"` \| `"overwrite"`

Define whether we want to add, remove, or overwrite cached entries with results from the actor run

#### Source

[src/lib/io/pushData.ts:138](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L138)

***

### cachePrimaryKeys?

> `optional` **cachePrimaryKeys**: `string`[]

Define fields that uniquely identify entries for caching

#### Source

[src/lib/io/pushData.ts:136](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L136)

***

### cacheStoreId?

> `optional` **cacheStoreId**: `string`

ID or name of the key-value store used as cache

#### Source

[src/lib/io/pushData.ts:134](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L134)

***

### datasetId?

> `optional` **datasetId**: `string`

ID or name of the dataset to which the data should be pushed

#### Source

[src/lib/io/pushData.ts:130](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L130)

***

### filter()?

> `optional` **filter**: (`item`) => `unknown`

Option to filter an entry before pushing it to the dataset.

This serves mainly to allow users to filter the entries from actor input UI.

#### Parameters

• **item**: `any`

#### Returns

`unknown`

#### Source

[src/lib/io/pushData.ts:128](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L128)

***

### includeMetadata?

> `optional` **includeMetadata**: `boolean`

Whether items should be enriched with request and run metadata.

If truthy, the metadata is set under the `metadata` property.

#### Source

[src/lib/io/pushData.ts:81](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L81)

***

### io?

> `optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)\<`any`, `any`, `object`\>

#### Source

[src/lib/io/pushData.ts:64](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L64)

***

### log?

> `optional` **log**: `Log`

#### Source

[src/lib/io/pushData.ts:65](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L65)

***

### maxCount?

> `optional` **maxCount**: `number`

If set, only at most this many entries will be scraped.

The count is determined from the Dataset that's used for the crawler run.

This means that if `maxCount` is set to 50, but the
associated Dataset already has 40 items in it, then only 10 new entries
will be saved.

#### Source

[src/lib/io/pushData.ts:75](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L75)

***

### pickKeys?

> `optional` **pickKeys**: `string`[]

Option to select which keys (fields) of an entry to keep (discarding the rest)
before pushing the entries to the dataset.

This serves mainly to allow users to select the keys from actor input UI.

This is done before `remapKeys`.

Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
resolved using Lodash.get().

#### Source

[src/lib/io/pushData.ts:107](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L107)

***

### privacyMask

> **privacyMask**: [`PrivacyMask`](../type-aliases/PrivacyMask.md)\<`T`\>

Determine which properties are considered personal data.

See [PrivacyMask](../type-aliases/PrivacyMask.md).

#### Source

[src/lib/io/pushData.ts:95](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L95)

***

### remapKeys?

> `optional` **remapKeys**: `Record`\<`string`, `string`\>

Option to remap the keys before pushing the entries to the dataset.

This serves mainly to allow users to remap the keys from actor input UI.

Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
resolved using Lodash.get().

#### Source

[src/lib/io/pushData.ts:116](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L116)

***

### requestQueueId?

> `optional` **requestQueueId**: `string`

ID of the RequestQueue that stores remaining requests

#### Source

[src/lib/io/pushData.ts:132](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L132)

***

### showPrivate?

> `optional` **showPrivate**: `boolean`

Whether properties that are considered personal data should be shown as is.

If falsy or not set, these properties are redacted to hide the actual information.

Which properties are personal data is determined by `privacyMask`.

#### Source

[src/lib/io/pushData.ts:89](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L89)

***

### transform()?

> `optional` **transform**: (`item`) => `any`

Option to freely transform an entry before pushing it to the dataset.

This serves mainly to allow users to transform the entries from actor input UI.

#### Parameters

• **item**: `any`

#### Returns

`any`

#### Source

[src/lib/io/pushData.ts:122](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L122)
