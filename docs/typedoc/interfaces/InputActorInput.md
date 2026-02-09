[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / InputActorInput

# Interface: InputActorInput

Defined in: [src/lib/input.ts:47](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L47)

Common input fields related to extending Actor input with remote or generated data

## Properties

### inputExtendFromFunction?

> `optional` **inputExtendFromFunction**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)\<\[\], [`AllActorInputs`](../type-aliases/AllActorInputs.md)\>

Defined in: [src/lib/input.ts:69](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L69)

If set, the Actor input is extended with a config from this custom function.

For example, you can store your actor input in a source control, and import it here.

In case of a conflict (if a field is defined both in Actor input and in imported input)
the Actor input overwrites the imported fields.

The URL must point to a JSON file containing a single object (the config).

***

### inputExtendUrl?

> `optional` **inputExtendUrl**: `string`

Defined in: [src/lib/input.ts:58](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/input.ts#L58)

If set, the Actor input is extended with a config from this URL.

For example, you can store your actor input in a source control, and import it here.

In case of a conflict (if a field is defined both in Actor input and in imported input)
the Actor input overwrites the imported fields.

The URL must point to a JSON file containing a single object (the config).
