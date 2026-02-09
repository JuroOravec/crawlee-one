[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / GenRedactedValue

# Type Alias: GenRedactedValue()\<V, K, O\>

> **GenRedactedValue**\<`V`, `K`, `O`\> = (`val`, `key`, `obj`) => [`MaybePromise`](MaybePromise.md)\<`any`\>

Defined in: [packages/crawlee-one/src/lib/io/pushData.ts:15](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/io/pushData.ts#L15)

Functions that generates a "redacted" version of a value.

If you pass it a Promise, it will be resolved.

## Type Parameters

### V

`V`

### K

`K`

### O

`O`

## Parameters

### val

`V`

### key

`K`

### obj

`O`

## Returns

[`MaybePromise`](MaybePromise.md)\<`any`\>
