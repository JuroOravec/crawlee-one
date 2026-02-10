[**apify-actor-config**](../README.md)

***

[apify-actor-config](../globals.md) / IntegerField

# Interface: IntegerField\<T, TUnit\>

Defined in: [inputSchema.ts:349](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L349)

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

- `BaseField`.`BaseFieldTypedProps`\<`T`, `"integer"`\>

## Type Parameters

### T

`T` *extends* `number` = `number`

### TUnit

`TUnit` *extends* `string` = `string`

## Properties

### default?

> `optional` **default**: `T`

Defined in: [inputSchema.ts:157](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L157)

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

Defined in: [inputSchema.ts:353](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L353)

Visual editor used for the input field.

***

### errorMessage?

> `optional` **errorMessage**: [`NumericErrorMessage`](NumericErrorMessage.md)

Defined in: [inputSchema.ts:173](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L173)

Custom error messages for validation keywords.
The allowed keys depend on the field's `type`.

See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/custom-error-messages

#### Inherited from

`BaseFieldTypedProps.errorMessage`

***

### example?

> `optional` **example**: `T`

Defined in: [inputSchema.ts:166](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L166)

Sample value of this field for the actor to be displayed when
actor is published in Apify Store.

#### Inherited from

`BaseFieldTypedProps.example`

***

### maximum?

> `optional` **maximum**: `number`

Defined in: [inputSchema.ts:355](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L355)

Maximum allowed value.

***

### minimum?

> `optional` **minimum**: `number`

Defined in: [inputSchema.ts:357](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L357)

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

Defined in: [inputSchema.ts:161](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L161)

Value that will be prefilled in the actor input interface.

#### Inherited from

`BaseFieldTypedProps.prefill`

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

Defined in: [inputSchema.ts:351](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L351)

Allowed type for the input value. Cannot be mixed.

#### Overrides

`BaseField.type`

***

### unit?

> `optional` **unit**: `TUnit`

Defined in: [inputSchema.ts:359](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L359)

Unit displayed next to the field in UI, for example second, MB, etc.
