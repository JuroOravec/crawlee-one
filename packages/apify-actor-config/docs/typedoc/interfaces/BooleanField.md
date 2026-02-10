[**apify-actor-config**](../README.md)

***

[apify-actor-config](../globals.md) / BooleanField

# Interface: BooleanField\<T\>

Defined in: [inputSchema.ts:319](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L319)

See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#boolean-type

Example options with group caption:

```json
{
"title": "Verbose log",
"type": "boolean",
"description": "Debug messages will be included in the log.",
"default": true,
"groupCaption": "Options",
"groupDescription": "Various options for this actor"
},
{
"title": "Lightspeed",
"type": "boolean",
"description": "If checked then actors runs at the speed of light.",
"prefill": true
}
```

## Extends

- `BaseField`.`BaseFieldTypedProps`\<`T`, `"boolean"`\>

## Type Parameters

### T

`T` *extends* `boolean` = `boolean`

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

> `optional` **editor**: `"hidden"` \| `"checkbox"`

Defined in: [inputSchema.ts:323](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L323)

Visual editor used for the input field.

***

### errorMessage?

> `optional` **errorMessage**: [`BooleanErrorMessage`](BooleanErrorMessage.md)

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

### groupCaption?

> `optional` **groupCaption**: `string`

Defined in: [inputSchema.ts:328](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L328)

If you want to group multiple checkboxes together,
add this option to the first of the group.

***

### groupDescription?

> `optional` **groupDescription**: `string`

Defined in: [inputSchema.ts:330](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L330)

Description displayed as help text displayed of group title.

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

> **type**: `"boolean"`

Defined in: [inputSchema.ts:321](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L321)

Allowed type for the input value. Cannot be mixed.

#### Overrides

`BaseField.type`
