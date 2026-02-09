[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / itemCacheKey

# Function: itemCacheKey()

> **itemCacheKey**(`item`, `primaryKeys?`): `string`

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:245

Serialize dataset item to fixed-length hash.

NOTE: Apify (around which this lib is designed) allows the key-value store key
      to be max 256 char long.
      https://docs.apify.com/sdk/js/reference/class/KeyValueStore#setValue

## Parameters

### item

`any`

### primaryKeys?

`string`[]

## Returns

`string`
