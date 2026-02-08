[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / pushData

# Function: pushData()

> **pushData**\<`Ctx`, `T`\>(`ctx`, `oneOrManyItems`, `options`): `Promise`\<`unknown`[]\>

Apify's `Actor.pushData` with extra features:

- Data can be sent elsewhere, not just to Apify. This is set by the `io` options. By default data is sent using Apify (cloud/local).
- Limit the max size of the Dataset. No entries are added when Dataset is at or above the limit.
- Redact "private" fields
- Add metadata to entries before they are pushed to dataset.
- Select and rename (nested) properties
- Transform and filter entries. Entries that did not pass the filter are not added to the dataset.
- Add/remove entries to/from KeyValueStore. Entries are saved to the store by hash generated from entry fields set by `cachePrimaryKeys`.

## Type parameters

• **Ctx** *extends* `CrawlingContext`\<`unknown`, `Dictionary`\>

• **T** *extends* `Record`\<`any`, `any`\> = `Record`\<`any`, `any`\>

## Parameters

• **ctx**: `Ctx`

• **oneOrManyItems**: `T` \| `T`[]

• **options**: [`PushDataOptions`](../interfaces/PushDataOptions.md)\<`T`\>

## Returns

`Promise`\<`unknown`[]\>

## Source

[src/lib/io/pushData.ts:319](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L319)
