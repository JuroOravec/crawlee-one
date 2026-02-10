[**apify-actor-config**](../README.md)

***

[apify-actor-config](../globals.md) / ActorInputSchema

# Interface: ActorInputSchema\<TProps\>

Defined in: [inputSchema.ts:29](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L29)

See https://docs.apify.com/platform/actors/development/actor-definition/input-schema

## Type Parameters

### TProps

`TProps` *extends* `Record`\<`string`, [`Field`](../type-aliases/Field.md)\> = `Record`\<`string`, [`Field`](../type-aliases/Field.md)\>

## Properties

### additionalProperties?

> `optional` **additionalProperties**: `boolean`

Defined in: [inputSchema.ts:56](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L56)

Controls if properties not listed in `properties` are allowed.
Defaults to `true`. Set to `false` to make requests with extra
properties fail.

***

### description?

> `optional` **description**: `string`

Defined in: [inputSchema.ts:39](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L39)

Help text for the input that will be displayed above the UI fields.

***

### properties

> **properties**: `TProps`

Defined in: [inputSchema.ts:48](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L48)

This is an object mapping each field key to its specification.

***

### required?

> `optional` **required**: keyof `TProps`[]

Defined in: [inputSchema.ts:50](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L50)

An array of field keys that are required.

***

### schemaVersion

> **schemaVersion**: `1`

Defined in: [inputSchema.ts:46](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L46)

The version of the specification against which your schema is written.
Currently, only version 1 is out.

***

### title

> **title**: `string`

Defined in: [inputSchema.ts:35](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L35)

Any text describing your input schema.

Example: `'Cheerio Crawler input'`

***

### type

> **type**: `"object"`

Defined in: [inputSchema.ts:41](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L41)

This is fixed and must be set to string object.
