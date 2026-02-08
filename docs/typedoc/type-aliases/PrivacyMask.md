[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / PrivacyMask

# Type alias: PrivacyMask\<T\>

> **PrivacyMask**\<`T`\>: \{ \[Key in keyof T\]?: T\[Key\] extends Date \| any\[\] ? PrivacyFilter\<T\[Key\], Key, T\> : T\[Key\] extends object ? PrivacyMask\<T\[Key\]\> : PrivacyFilter\<T\[Key\], Key, T\> \}

PrivacyMask determines which (potentally nested) properties
of an object are considered private.

PrivacyMask copies the structure of another object, but each
non-object property on PrivacyMask is a PrivacyFilter - function
that determines if the property is considered private.

Property is private if the function returns truthy value.

If the function returns a Promise, it will be awaited.

## Type parameters

• **T** *extends* `object`

## Source

[src/lib/io/pushData.ts:55](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L55)
