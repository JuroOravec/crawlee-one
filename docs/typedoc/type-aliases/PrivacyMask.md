[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / PrivacyMask

# Type Alias: PrivacyMask\<T\>

> **PrivacyMask**\<`T`\> = \{ \[Key in keyof T\]?: T\[Key\] extends Date \| any\[\] ? PrivacyFilter\<T\[Key\], Key, T\> : T\[Key\] extends object ? PrivacyMask\<T\[Key\]\> : PrivacyFilter\<T\[Key\], Key, T\> \}

Defined in: [src/lib/io/pushData.ts:55](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/io/pushData.ts#L55)

PrivacyMask determines which (potentally nested) properties
of an object are considered private.

PrivacyMask copies the structure of another object, but each
non-object property on PrivacyMask is a PrivacyFilter - function
that determines if the property is considered private.

Property is private if the function returns truthy value.

If the function returns a Promise, it will be awaited.

## Type Parameters

### T

`T` *extends* `object`
