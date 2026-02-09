[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / PrivacyFilter

# Type Alias: PrivacyFilter\<V, K, O\>

> **PrivacyFilter**\<`V`, `K`, `O`\> = `boolean` \| (`val`, `key`, `obj`, `options?`) => `any`

Defined in: packages/crawlee-one/src/lib/io/pushData.ts:32

Determine if the property is considered private (and hence may be hidden for privacy reasons).

`PrivacyFilter` may be either boolean, or a function that returns truthy/falsy value.

Property is private if `true` or if the function returns truthy value.

The function receives the property value, its position, and parent object.

By default, when a property is redacted, its value is replaced with a string
that informs about the redaction. If you want different text or value to be used instead,
supply it to `setCustomRedactedValue`.

If the function returns a Promise, it will be awaited.

## Type Parameters

### V

`V`

### K

`K`

### O

`O`
