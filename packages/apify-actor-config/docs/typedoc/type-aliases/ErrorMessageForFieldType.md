[**apify-actor-config**](../README.md)

***

[apify-actor-config](../globals.md) / ErrorMessageForFieldType

# Type Alias: ErrorMessageForFieldType\<FT\>

> **ErrorMessageForFieldType**\<`FT`\> = `FT` *extends* `"string"` ? [`StringErrorMessage`](../interfaces/StringErrorMessage.md) : `FT` *extends* `"boolean"` ? [`BooleanErrorMessage`](../interfaces/BooleanErrorMessage.md) : `FT` *extends* `"integer"` \| `"number"` ? [`NumericErrorMessage`](../interfaces/NumericErrorMessage.md) : `FT` *extends* `"array"` ? [`ArrayErrorMessage`](../interfaces/ArrayErrorMessage.md) : `FT` *extends* `"object"` ? [`ObjectErrorMessage`](../interfaces/ObjectErrorMessage.md) : `never`

Defined in: [inputSchema.ts:149](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L149)

Maps a [FieldType](FieldType.md) literal to the matching error-message interface.

See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/custom-error-messages#supported-validation-keywords

## Type Parameters

### FT

`FT` *extends* [`FieldType`](FieldType.md)
