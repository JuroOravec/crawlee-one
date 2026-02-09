[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneDataset

# Interface: CrawleeOneDataset\<T\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:147](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/integrations/types.ts#L147)

Interface for storing and retrieving data in/from Dataset

This interface is based on Crawlee/Apify, but defined separately to allow
drop-in replacement with other integrations.

## Type Parameters

### T

`T` *extends* `object` = `object`

## Properties

### getItemCount()

> **getItemCount**: () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`number` \| `null`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:166](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/integrations/types.ts#L166)

Returns the count of items in the dataset.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`number` \| `null`\>

***

### getItems()

> **getItems**: (`options?`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`[]\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:162](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/integrations/types.ts#L162)

Returns the items in the dataset based on the provided parameters.

#### Parameters

##### options?

`Pick`\<`DatasetDataOptions`, `"limit"` \| `"offset"` \| `"desc"` \| `"fields"`\>

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`T`[]\>

***

### pushData()

> **pushData**: (`data`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/crawlee-one/src/lib/integrations/types.ts:153](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/integrations/types.ts#L153)

Stores an object or an array of objects to the dataset. The function returns a promise
that resolves when the operation finishes. It has no result, but throws on invalid args
or other errors.

#### Parameters

##### data

[`MaybeArray`](../type-aliases/MaybeArray.md)\<`T`\>

Object or array of objects containing data to be stored in the default dataset.
The objects must be serializable to JSON and the JSON representation of each object
must be smaller than 9MB.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>
