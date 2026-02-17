[**apify-actor-config**](../README.md)

***

[apify-actor-config](../globals.md) / IntegerField

# Interface: IntegerField\<T, TUnit, TSchema\>

Defined in: [inputSchema.ts:304](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L304)

See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#numeric-types

Example:

```json
{
"title": "Memory",
"type": "integer",
"description": "Select memory in megabytes",
"default": 64,
"maximum": 1024,
"unit": "MB"
}
```

## Extends

- `BaseField`.`BaseFieldTypedProps`\<`T`, `"integer"`, `TSchema`\>

## Type Parameters

### T

`T` *extends* `number` = `number`

### TUnit

`TUnit` *extends* `string` = `string`

### TSchema

`TSchema` = `any`

## Properties

### default?

> `optional` **default**: `T`

Defined in: [inputSchema.ts:95](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L95)

Default value that will be used when no value is provided.

#### Inherited from

`BaseFieldTypedProps.default`

***

### description

> **description**: `string`

Defined in: [inputSchema.ts:74](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L74)

Description of the field that will be displayed as help text in Actor input UI.

#### Inherited from

`BaseField.description`

***

### editor?

> `optional` **editor**: `"number"` \| `"hidden"`

Defined in: [inputSchema.ts:312](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L312)

Visual editor used for the input field.

***

### errorMessage?

> `optional` **errorMessage**: [`NumericErrorMessage`](NumericErrorMessage.md)

Defined in: [inputSchema.ts:111](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L111)

Custom error messages for validation keywords.
The allowed keys depend on the field's `type`.

See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/custom-error-messages

#### Inherited from

`BaseFieldTypedProps.errorMessage`

***

### example?

> `optional` **example**: `T`

Defined in: [inputSchema.ts:104](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L104)

Sample value of this field for the actor to be displayed when
actor is published in Apify Store.

#### Inherited from

`BaseFieldTypedProps.example`

***

### maximum?

> `optional` **maximum**: `number`

Defined in: [inputSchema.ts:314](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L314)

Maximum allowed value.

***

### minimum?

> `optional` **minimum**: `number`

Defined in: [inputSchema.ts:316](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L316)

Minimum allowed value.

***

### nullable?

> `optional` **nullable**: `boolean`

Defined in: [inputSchema.ts:89](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L89)

Specifies whether null is an allowed value.

#### Inherited from

`BaseField.nullable`

***

### prefill?

> `optional` **prefill**: `T`

Defined in: [inputSchema.ts:99](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L99)

Value that will be prefilled in the actor input interface.

#### Inherited from

`BaseFieldTypedProps.prefill`

***

### schema?

> `optional` **schema**: `TSchema`

Defined in: [inputSchema.ts:118](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L118)

Optional validation schema for this field (e.g. a Zod schema).

This property is NOT part of the Apify input schema spec and is
automatically stripped when generating `actor.json`.

#### Inherited from

`BaseFieldTypedProps.schema`

***

### sectionCaption?

> `optional` **sectionCaption**: `string`

Defined in: [inputSchema.ts:81](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L81)

If this property is set, then all fields following this field
(this field included) will be separated into a collapsible section
with the value set as its caption. The section ends at the last field
or the next field which has the sectionCaption property set.

#### Inherited from

`BaseField.sectionCaption`

***

### sectionDescription?

> `optional` **sectionDescription**: `string`

Defined in: [inputSchema.ts:87](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L87)

If the sectionCaption property is set, then you can use this property to
provide additional description to the section. The description will be
visible right under the caption when the section is open.

#### Inherited from

`BaseField.sectionDescription`

***

### title

> **title**: `string`

Defined in: [inputSchema.ts:72](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L72)

Title of the field in UI.

#### Inherited from

`BaseField.title`

***

### type

> **type**: `"integer"`

Defined in: [inputSchema.ts:310](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L310)

Allowed type for the input value. Cannot be mixed.

#### Overrides

`BaseField.type`

***

### unit?

> `optional` **unit**: `TUnit`

Defined in: [inputSchema.ts:318](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L318)

Unit displayed next to the field in UI, for example second, MB, etc.
