[crawlee-one](../README.md) / [Exports](../modules.md) / CrawleeOneDataset

# Interface: CrawleeOneDataset<T\>

Interface for storing and retrieving data in/from Dataset

This interface is based on Crawlee/Apify, but defined separately to allow
drop-in replacement with other integrations.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` = `object` |

## Table of contents

### Properties

- [getItemCount](CrawleeOneDataset.md#getitemcount)
- [getItems](CrawleeOneDataset.md#getitems)
- [pushData](CrawleeOneDataset.md#pushdata)

## Properties

### getItemCount

• **getItemCount**: () => [`MaybePromise`](../modules.md#maybepromise)<``null`` \| `number`\>

#### Type declaration

▸ (): [`MaybePromise`](../modules.md#maybepromise)<``null`` \| `number`\>

Returns the count of items in the dataset.

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<``null`` \| `number`\>

#### Defined in

[src/lib/integrations/types.ts:166](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/integrations/types.ts#L166)

___

### getItems

• **getItems**: (`options?`: `Pick`<`DatasetDataOptions`, ``"offset"`` \| ``"desc"`` \| ``"limit"`` \| ``"fields"``\>) => [`MaybePromise`](../modules.md#maybepromise)<`T`[]\>

#### Type declaration

▸ (`options?`): [`MaybePromise`](../modules.md#maybepromise)<`T`[]\>

Returns the items in the dataset based on the provided parameters.

##### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Pick`<`DatasetDataOptions`, ``"offset"`` \| ``"desc"`` \| ``"limit"`` \| ``"fields"``\> |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`T`[]\>

#### Defined in

[src/lib/integrations/types.ts:162](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/integrations/types.ts#L162)

___

### pushData

• **pushData**: (`data`: [`MaybeArray`](../modules.md#maybearray)<`T`\>) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`data`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

Stores an object or an array of objects to the dataset. The function returns a promise
that resolves when the operation finishes. It has no result, but throws on invalid args
or other errors.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`MaybeArray`](../modules.md#maybearray)<`T`\> | Object or array of objects containing data to be stored in the default dataset. The objects must be serializable to JSON and the JSON representation of each object must be smaller than 9MB. |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/integrations/types.ts:153](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/integrations/types.ts#L153)
