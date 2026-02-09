[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / itemCacheKey

# Function: itemCacheKey()

> **itemCacheKey**(`item`, `primaryKeys?`): `string`

Defined in: [src/lib/io/pushData.ts:245](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/pushData.ts#L245)

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
