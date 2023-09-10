[crawlee-one](../README.md) / [Exports](../modules.md) / PushDataOptions

# Interface: PushDataOptions<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |

## Table of contents

### Properties

- [cacheActionOnResult](PushDataOptions.md#cacheactiononresult)
- [cachePrimaryKeys](PushDataOptions.md#cacheprimarykeys)
- [cacheStoreId](PushDataOptions.md#cachestoreid)
- [datasetId](PushDataOptions.md#datasetid)
- [filter](PushDataOptions.md#filter)
- [includeMetadata](PushDataOptions.md#includemetadata)
- [io](PushDataOptions.md#io)
- [log](PushDataOptions.md#log)
- [maxCount](PushDataOptions.md#maxcount)
- [pickKeys](PushDataOptions.md#pickkeys)
- [privacyMask](PushDataOptions.md#privacymask)
- [remapKeys](PushDataOptions.md#remapkeys)
- [requestQueueId](PushDataOptions.md#requestqueueid)
- [showPrivate](PushDataOptions.md#showprivate)
- [transform](PushDataOptions.md#transform)

## Properties

### cacheActionOnResult

• `Optional` **cacheActionOnResult**: ``null`` \| ``"add"`` \| ``"remove"`` \| ``"overwrite"``

Define whether we want to add, remove, or overwrite cached entries with results from the actor run

#### Defined in

[src/lib/io/pushData.ts:138](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L138)

___

### cachePrimaryKeys

• `Optional` **cachePrimaryKeys**: `string`[]

Define fields that uniquely identify entries for caching

#### Defined in

[src/lib/io/pushData.ts:136](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L136)

___

### cacheStoreId

• `Optional` **cacheStoreId**: `string`

ID or name of the key-value store used as cache

#### Defined in

[src/lib/io/pushData.ts:134](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L134)

___

### datasetId

• `Optional` **datasetId**: `string`

ID or name of the dataset to which the data should be pushed

#### Defined in

[src/lib/io/pushData.ts:130](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L130)

___

### filter

• `Optional` **filter**: (`item`: `any`) => `unknown`

#### Type declaration

▸ (`item`): `unknown`

Option to filter an entry before pushing it to the dataset.

This serves mainly to allow users to filter the entries from actor input UI.

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

##### Returns

`unknown`

#### Defined in

[src/lib/io/pushData.ts:128](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L128)

___

### includeMetadata

• `Optional` **includeMetadata**: `boolean`

Whether items should be enriched with request and run metadata.

If truthy, the metadata is set under the `metadata` property.

#### Defined in

[src/lib/io/pushData.ts:81](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L81)

___

### io

• `Optional` **io**: [`CrawleeOneIO`](CrawleeOneIO.md)<`any`, `any`, `object`\>

#### Defined in

[src/lib/io/pushData.ts:64](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L64)

___

### log

• `Optional` **log**: `Log`

#### Defined in

[src/lib/io/pushData.ts:65](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L65)

___

### maxCount

• `Optional` **maxCount**: `number`

If set, only at most this many entries will be scraped.

The count is determined from the Dataset that's used for the crawler run.

This means that if `maxCount` is set to 50, but the
associated Dataset already has 40 items in it, then only 10 new entries
will be saved.

#### Defined in

[src/lib/io/pushData.ts:75](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L75)

___

### pickKeys

• `Optional` **pickKeys**: `string`[]

Option to select which keys (fields) of an entry to keep (discarding the rest)
before pushing the entries to the dataset.

This serves mainly to allow users to select the keys from actor input UI.

This is done before `remapKeys`.

Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
resolved using Lodash.get().

#### Defined in

[src/lib/io/pushData.ts:107](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L107)

___

### privacyMask

• **privacyMask**: [`PrivacyMask`](../modules.md#privacymask)<`T`\>

Determine which properties are considered personal data.

See [PrivacyMask](../modules.md#privacymask).

#### Defined in

[src/lib/io/pushData.ts:95](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L95)

___

### remapKeys

• `Optional` **remapKeys**: `Record`<`string`, `string`\>

Option to remap the keys before pushing the entries to the dataset.

This serves mainly to allow users to remap the keys from actor input UI.

Keys can be nested, e.g. `"someProp.value[0]"`. Nested path is
resolved using Lodash.get().

#### Defined in

[src/lib/io/pushData.ts:116](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L116)

___

### requestQueueId

• `Optional` **requestQueueId**: `string`

ID of the RequestQueue that stores remaining requests

#### Defined in

[src/lib/io/pushData.ts:132](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L132)

___

### showPrivate

• `Optional` **showPrivate**: `boolean`

Whether properties that are considered personal data should be shown as is.

If falsy or not set, these properties are redacted to hide the actual information.

Which properties are personal data is determined by `privacyMask`.

#### Defined in

[src/lib/io/pushData.ts:89](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L89)

___

### transform

• `Optional` **transform**: (`item`: `any`) => `any`

#### Type declaration

▸ (`item`): `any`

Option to freely transform an entry before pushing it to the dataset.

This serves mainly to allow users to transform the entries from actor input UI.

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

##### Returns

`any`

#### Defined in

[src/lib/io/pushData.ts:122](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/io/pushData.ts#L122)
