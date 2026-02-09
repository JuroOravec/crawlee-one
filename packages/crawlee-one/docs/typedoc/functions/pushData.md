[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / pushData

# Function: pushData()

> **pushData**\<`Ctx`, `T`\>(`ctx`, `oneOrManyItems`, `options`): `Promise`\<`unknown`[]\>

Defined in: [packages/crawlee-one/src/lib/io/pushData.ts:319](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/io/pushData.ts#L319)

Apify's `Actor.pushData` with extra features:

- Data can be sent elsewhere, not just to Apify. This is set by the `io` options. By default data is sent using Apify (cloud/local).
- Limit the max size of the Dataset. No entries are added when Dataset is at or above the limit.
- Redact "private" fields
- Add metadata to entries before they are pushed to dataset.
- Select and rename (nested) properties
- Transform and filter entries. Entries that did not pass the filter are not added to the dataset.
- Add/remove entries to/from KeyValueStore. Entries are saved to the store by hash generated from entry fields set by `cachePrimaryKeys`.

## Type Parameters

### Ctx

`Ctx` *extends* `CrawlingContext`\<`unknown`, `Dictionary`\>

### T

`T` *extends* `Record`\<`any`, `any`\> = `Record`\<`any`, `any`\>

## Parameters

### ctx

`Ctx`

### oneOrManyItems

`T` | `T`[]

### options

[`PushDataOptions`](../interfaces/PushDataOptions.md)\<`T`\>

## Returns

`Promise`\<`unknown`[]\>
