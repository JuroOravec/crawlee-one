[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneDataset

# Interface: CrawleeOneDataset\<T\>

Interface for storing and retrieving data in/from Dataset

This interface is based on Crawlee/Apify, but defined separately to allow
drop-in replacement with other integrations.

## Type parameters

• **T** *extends* `object` = `object`

## Properties

### getItemCount()

> **getItemCount**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`null` \| `number`\>

Returns the count of items in the dataset.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`null` \| `number`\>

#### Source

[src/lib/integrations/types.ts:166](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L166)

***

### getItems()

> **getItems**: (`options`?) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`[]\>

Returns the items in the dataset based on the provided parameters.

#### Parameters

• **options?**: `Pick`\<`DatasetDataOptions`, `"limit"` \| `"offset"` \| `"desc"` \| `"fields"`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`[]\>

#### Source

[src/lib/integrations/types.ts:162](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L162)

***

### pushData()

> **pushData**: (`data`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Stores an object or an array of objects to the dataset. The function returns a promise
that resolves when the operation finishes. It has no result, but throws on invalid args
or other errors.

#### Parameters

• **data**: [`MaybeArray`](../type-aliases/MaybeArray.md)\<`T`\>

Object or array of objects containing data to be stored in the default dataset.
The objects must be serializable to JSON and the JSON representation of each object
must be smaller than 9MB.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

#### Source

[src/lib/integrations/types.ts:153](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/integrations/types.ts#L153)
