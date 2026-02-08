[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / itemCacheKey

# Function: itemCacheKey()

> **itemCacheKey**(`item`, `primaryKeys`?): `string`

Serialize dataset item to fixed-length hash.

NOTE: Apify (around which this lib is designed) allows the key-value store key
      to be max 256 char long.
      https://docs.apify.com/sdk/js/reference/class/KeyValueStore#setValue

## Parameters

• **item**: `any`

• **primaryKeys?**: `string`[]

## Returns

`string`

## Source

[src/lib/io/pushData.ts:245](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L245)
