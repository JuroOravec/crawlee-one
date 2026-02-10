[**apify-actor-config**](../README.md)

***

[apify-actor-config](../globals.md) / ViewDisplay

# Interface: ViewDisplay\<TFields\>

Defined in: [outputSchema.ts:121](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L121)

See https://docs.apify.com/platform/actors/development/output-schema#viewdisplay-object-definition

## Type Parameters

### TFields

`TFields` *extends* `string` = `string`

## Properties

### component

> **component**: `"table"`

Defined in: [outputSchema.ts:123](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L123)

Only component "table" is available.

***

### properties?

> `optional` **properties**: `Record`\<`string` \| `TFields`, [`ViewDisplayProperty`](ViewDisplayProperty.md)\>

Defined in: [outputSchema.ts:130](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/outputSchema.ts#L130)

Object with keys matching the transformation.fields
and ViewDisplayProperty as values. In case properties are not set
the table will be rendered automatically with fields formatted
as Strings, Arrays or Objects.
