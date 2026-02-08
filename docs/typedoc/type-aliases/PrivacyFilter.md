[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / PrivacyFilter

# Type alias: PrivacyFilter\<V, K, O\>

> **PrivacyFilter**\<`V`, `K`, `O`\>: `boolean` \| (`val`, `key`, `obj`, `options`?) => `any`

Determine if the property is considered private (and hence may be hidden for privacy reasons).

`PrivacyFilter` may be either boolean, or a function that returns truthy/falsy value.

Property is private if `true` or if the function returns truthy value.

The function receives the property value, its position, and parent object.

By default, when a property is redacted, its value is replaced with a string
that informs about the redaction. If you want different text or value to be used instead,
supply it to `setCustomRedactedValue`.

If the function returns a Promise, it will be awaited.

## Type parameters

• **V**

• **K**

• **O**

## Source

[src/lib/io/pushData.ts:32](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/io/pushData.ts#L32)
