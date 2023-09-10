[crawlee-one](../README.md) / [Exports](../modules.md) / InputActorInput

# Interface: InputActorInput

Common input fields related to extending Actor input with remote or generated data

## Table of contents

### Properties

- [inputExtendFromFunction](InputActorInput.md#inputextendfromfunction)
- [inputExtendUrl](InputActorInput.md#inputextendurl)

## Properties

### inputExtendFromFunction

• `Optional` **inputExtendFromFunction**: `string` \| [`CrawleeOneHookFn`](../modules.md#crawleeonehookfn)<[], [`AllActorInputs`](../modules.md#allactorinputs)\>

If set, the Actor input is extended with a config from this custom function.

For example, you can store your actor input in a source control, and import it here.

In case of a conflict (if a field is defined both in Actor input and in imported input)
the Actor input overwrites the imported fields.

The URL must point to a JSON file containing a single object (the config).

#### Defined in

[src/lib/input.ts:68](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/input.ts#L68)

___

### inputExtendUrl

• `Optional` **inputExtendUrl**: `string`

If set, the Actor input is extended with a config from this URL.

For example, you can store your actor input in a source control, and import it here.

In case of a conflict (if a field is defined both in Actor input and in imported input)
the Actor input overwrites the imported fields.

The URL must point to a JSON file containing a single object (the config).

#### Defined in

[src/lib/input.ts:57](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/input.ts#L57)
