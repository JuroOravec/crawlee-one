[**actor-spec**](../README.md)

***

[actor-spec](../globals.md) / DatasetOutput

# Interface: DatasetOutput\<TEntry\>

Defined in: [actorSpec.ts:153](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L153)

## Type Parameters

### TEntry

`TEntry` *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

## Properties

### exampleEntry

> **exampleEntry**: `TEntry`

Defined in: [actorSpec.ts:155](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L155)

Example single extracted entry

***

### exampleEntryComments?

> `optional` **exampleEntryComments**: `Partial`\<`Record`\<keyof `TEntry`, `string`\>\>

Defined in: [actorSpec.ts:169](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L169)

Comments related to individual fields of `exampleEntry`

These comments may be rendered as such:

```json
{
"exampleEntryField1": 22,
// This is a comment from exampleEntryComments.exampleEntryField2
"exampleEntryField2": "Value from exampleEntry.exampleEntryField2"
}
```
