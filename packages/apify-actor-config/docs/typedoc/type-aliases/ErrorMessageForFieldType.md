[**apify-actor-config**](../README.md)

---

[apify-actor-config](../globals.md) / ErrorMessageForFieldType

# Type Alias: ErrorMessageForFieldType\<FT\>

> **ErrorMessageForFieldType**\<`FT`\> = `FT` _extends_ `"string"` ? [`StringErrorMessage`](../interfaces/StringErrorMessage.md) : `FT` _extends_ `"boolean"` ? [`BooleanErrorMessage`](../interfaces/BooleanErrorMessage.md) : `FT` _extends_ `"integer"` \| `"number"` ? [`NumericErrorMessage`](../interfaces/NumericErrorMessage.md) : `FT` _extends_ `"array"` ? [`ArrayErrorMessage`](../interfaces/ArrayErrorMessage.md) : `FT` _extends_ `"object"` ? [`ObjectErrorMessage`](../interfaces/ObjectErrorMessage.md) : `never`

Defined in: [inputSchema.ts:600](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L600)

Maps a [FieldType](FieldType.md) literal to the matching error-message interface.

See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/custom-error-messages#supported-validation-keywords

## Type Parameters

### FT

`FT` _extends_ [`FieldType`](FieldType.md)
