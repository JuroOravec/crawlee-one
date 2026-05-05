[**apify-actor-config**](../README.md)

---

[apify-actor-config](../globals.md) / ObjectField

# Interface: ObjectField\<T, TSchema\>

Defined in: [inputSchema.ts:388](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L388)

See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#object-type

Example of proxy configuration:

```json
{
  "title": "Proxy configuration",
  "type": "object",
  "description": "Select proxies to be used by your crawler.",
  "prefill": { "useApifyProxy": true },
  "editor": "proxy"
}
```

Example of a blackbox object:

```json
{
  "title": "User object",
  "type": "object",
  "description": "Enter object representing user",
  "prefill": {
    "name": "John Doe",
    "email": "janedoe@gmail.com"
  },
  "editor": "json"
}
```

## Extends

- `BaseField`.`BaseFieldTypedProps`\<`T`, `"object"`, `TSchema`\>

## Type Parameters

### T

`T` _extends_ `object` = `object`

### TSchema

`TSchema` = `any`

## Properties

### additionalProperties?

> `optional` **additionalProperties**: `boolean`

Defined in: [inputSchema.ts:420](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L420)

Controls if sub-properties not listed in `properties` are allowed.
Defaults to `true`. Set to `false` to make requests with extra
properties fail.

---

### default?

> `optional` **default**: `T`

Defined in: [inputSchema.ts:95](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L95)

Default value that will be used when no value is provided.

#### Inherited from

`BaseFieldTypedProps.default`

---

### description

> **description**: `string`

Defined in: [inputSchema.ts:74](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L74)

Description of the field that will be displayed as help text in Actor input UI.

#### Inherited from

`BaseField.description`

---

### editor

> **editor**: `"hidden"` \| `"json"` \| `"proxy"` \| `"schemaBased"`

Defined in: [inputSchema.ts:392](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L392)

Visual editor used for the input field.

---

### errorMessage?

> `optional` **errorMessage**: [`ObjectErrorMessage`](ObjectErrorMessage.md)

Defined in: [inputSchema.ts:111](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L111)

Custom error messages for validation keywords.
The allowed keys depend on the field's `type`.

See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/custom-error-messages

#### Inherited from

`BaseFieldTypedProps.errorMessage`

---

### example?

> `optional` **example**: `T`

Defined in: [inputSchema.ts:104](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L104)

Sample value of this field for the actor to be displayed when
actor is published in Apify Store.

#### Inherited from

`BaseFieldTypedProps.example`

---

### isSecret?

> `optional` **isSecret**: `boolean`

Defined in: [inputSchema.ts:405](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L405)

Specifies whether the input field will be stored encrypted.
Only available with `json` and `hidden` editors.

---

### maxProperties?

> `optional` **maxProperties**: `number`

Defined in: [inputSchema.ts:398](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L398)

Maximum number of properties the object can have.

---

### minProperties?

> `optional` **minProperties**: `number`

Defined in: [inputSchema.ts:400](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L400)

Minimum number of properties the object can have.

---

### nullable?

> `optional` **nullable**: `boolean`

Defined in: [inputSchema.ts:89](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L89)

Specifies whether null is an allowed value.

#### Inherited from

`BaseField.nullable`

---

### patternKey?

> `optional` **patternKey**: `string`

Defined in: [inputSchema.ts:394](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L394)

Regular expression that will be used to validate the keys of the object.

---

### patternValue?

> `optional` **patternValue**: `string`

Defined in: [inputSchema.ts:396](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L396)

Regular expression that will be used to validate the values of object.

---

### prefill?

> `optional` **prefill**: `T`

Defined in: [inputSchema.ts:99](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L99)

Value that will be prefilled in the actor input interface.

#### Inherited from

`BaseFieldTypedProps.prefill`

---

### properties?

> `optional` **properties**: `Record`\<`string`, [`Field`](../type-aliases/Field.md)\>

Defined in: [inputSchema.ts:414](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L414)

Defines the sub-schema properties for the object, used for validation
and UI rendering with the `schemaBased` editor. Each sub-property can
define the same fields as root-level input fields, except for
`sectionCaption` and `sectionDescription`.

See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#object-fields-validation

---

### required?

> `optional` **required**: `string`[]

Defined in: [inputSchema.ts:427](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L427)

An array of sub-property keys that are required.
Note: This applies only if the object field itself is present.
If the object field is optional and not included in the input,
its required subfields are not validated.

---

### schema?

> `optional` **schema**: `TSchema`

Defined in: [inputSchema.ts:118](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L118)

Optional validation schema for this field (e.g. a Zod schema).

This property is NOT part of the Apify input schema spec and is
automatically stripped when generating `actor.json`.

#### Inherited from

`BaseFieldTypedProps.schema`

---

### sectionCaption?

> `optional` **sectionCaption**: `string`

Defined in: [inputSchema.ts:81](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L81)

If this property is set, then all fields following this field
(this field included) will be separated into a collapsible section
with the value set as its caption. The section ends at the last field
or the next field which has the sectionCaption property set.

#### Inherited from

`BaseField.sectionCaption`

---

### sectionDescription?

> `optional` **sectionDescription**: `string`

Defined in: [inputSchema.ts:87](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L87)

If the sectionCaption property is set, then you can use this property to
provide additional description to the section. The description will be
visible right under the caption when the section is open.

#### Inherited from

`BaseField.sectionDescription`

---

### title

> **title**: `string`

Defined in: [inputSchema.ts:72](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L72)

Title of the field in UI.

#### Inherited from

`BaseField.title`

---

### type

> **type**: `"object"`

Defined in: [inputSchema.ts:390](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L390)

Allowed type for the input value. Cannot be mixed.

#### Overrides

`BaseField.type`
