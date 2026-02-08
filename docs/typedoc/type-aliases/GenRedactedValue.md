[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / GenRedactedValue

# Type alias: GenRedactedValue()\<V, K, O\>

> **GenRedactedValue**\<`V`, `K`, `O`\>: (`val`, `key`, `obj`) => [`MaybePromise`](MaybePromise.md)\<`any`\>

Functions that generates a "redacted" version of a value.

If you pass it a Promise, it will be resolved.

## Type parameters

• **V**

• **K**

• **O**

## Parameters

• **val**: `V`

• **key**: `K`

• **obj**: `O`

## Returns

[`MaybePromise`](MaybePromise.md)\<`any`\>

## Source

[src/lib/io/pushData.ts:15](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L15)
