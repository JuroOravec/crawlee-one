[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / InputActorInput

# Interface: InputActorInput

Defined in: [packages/crawlee-one/src/lib/input.ts:48](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L48)

Common input fields related to extending Actor input with remote or generated data

## Properties

### inputExtendFromFunction?

> `optional` **inputExtendFromFunction**: `string` \| [`CrawleeOneHookFn`](../type-aliases/CrawleeOneHookFn.md)\<\[\], [`ActorInput`](../type-aliases/ActorInput.md)\>

Defined in: [packages/crawlee-one/src/lib/input.ts:70](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L70)

If set, the Actor input is extended with a config from this custom function.

For example, you can store your actor input in a source control, and import it here.

In case of a conflict (if a field is defined both in Actor input and in imported input)
the Actor input overwrites the imported fields.

The URL must point to a JSON file containing a single object (the config).

---

### inputExtendUrl?

> `optional` **inputExtendUrl**: `string`

Defined in: [packages/crawlee-one/src/lib/input.ts:59](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L59)

If set, the Actor input is extended with a config from this URL.

For example, you can store your actor input in a source control, and import it here.

In case of a conflict (if a field is defined both in Actor input and in imported input)
the Actor input overwrites the imported fields.

The URL must point to a JSON file containing a single object (the config).
