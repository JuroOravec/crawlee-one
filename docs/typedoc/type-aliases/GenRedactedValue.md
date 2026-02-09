[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / GenRedactedValue

# Type Alias: GenRedactedValue()\<V, K, O\>

> **GenRedactedValue**\<`V`, `K`, `O`\> = (`val`, `key`, `obj`) => [`MaybePromise`](MaybePromise.md)\<`any`\>

Defined in: [src/lib/io/pushData.ts:15](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/pushData.ts#L15)

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
