[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / InputActorInput

# Interface: InputActorInput

Common input fields related to extending Actor input with remote or generated data

## Properties

### inputExtendFromFunction?

> `optional` **inputExtendFromFunction**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)\<[], [`AllActorInputs`](../type-aliases/AllActorInputs.md)\>

If set, the Actor input is extended with a config from this custom function.

For example, you can store your actor input in a source control, and import it here.

In case of a conflict (if a field is defined both in Actor input and in imported input)
the Actor input overwrites the imported fields.

The URL must point to a JSON file containing a single object (the config).

#### Source

[src/lib/input.ts:69](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L69)

***

### inputExtendUrl?

> `optional` **inputExtendUrl**: `string`

If set, the Actor input is extended with a config from this URL.

For example, you can store your actor input in a source control, and import it here.

In case of a conflict (if a field is defined both in Actor input and in imported input)
the Actor input overwrites the imported fields.

The URL must point to a JSON file containing a single object (the config).

#### Source

[src/lib/input.ts:58](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L58)
