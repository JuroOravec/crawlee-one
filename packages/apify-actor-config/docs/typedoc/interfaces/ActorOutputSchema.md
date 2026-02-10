[**apify-actor-config**](../README.md)

***

[apify-actor-config](../globals.md) / ActorOutputSchema

# Interface: ActorOutputSchema\<TFields, TViews\>

Defined in: [outputSchema.ts:24](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L24)

See https://docs.apify.com/platform/actors/development/output-schema

Example

```json
{
"actorSpecification": 1,
"fields": {},
"views": {
"overview": {
"title": "Overview",
"transformation": {},
"display": {}
}
}
```

## Type Parameters

### TFields

`TFields` *extends* `object` = `object`

### TViews

`TViews` *extends* `Record`\<`string`, [`DatasetView`](DatasetView.md)\> = `Record`\<`string`, [`DatasetView`](DatasetView.md)\>

## Properties

### actorSpecification

> **actorSpecification**: `1`

Defined in: [outputSchema.ts:32](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L32)

The version of the specification against which your schema is written.
Currently, only version 1 is out.

***

### fields

> **fields**: `TFields`

Defined in: [outputSchema.ts:37](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L37)

Schema of one dataset object. Use JsonSchema Draft 2020-12
or other compatible formats.

***

### views

> **views**: `TViews`

Defined in: [outputSchema.ts:39](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L39)

An object with a description of an API and UI views.
