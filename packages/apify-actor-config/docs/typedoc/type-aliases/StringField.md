[**apify-actor-config**](../README.md)

***

[apify-actor-config](../globals.md) / StringField

# Type Alias: StringField\<TEnum, TEnumTitles, TSchema\>

> **StringField**\<`TEnum`, `TEnumTitles`, `TSchema`\> = `SelectStringField`\<`TEnum`, `TEnumTitles`, `TSchema`\> \| `TextStringField`\<`TEnum`, `TSchema`\> \| `DatePickerStringField`\<`TEnum`, `TSchema`\> \| `BaseStringField`\<`TEnum`, `TSchema`\>

Defined in: [inputSchema.ts:150](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L150)

See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#string

Example of code input:

```json
{
"title": "Page function",
"type": "string",
"description": "Function executed for each request",
"editor": "javascript",
"prefill": "async () => { return $('title').text(); }",
}
```

Example of country selection using a select input:

```json
{
"title": "Country",
"type": "string",
"description": "Select your country",
"editor": "select",
"default": "us",
"enum": ["us", "de", "fr"],
"enumTitles": ["USA", "Germany", "France"]
}
```

## Type Parameters

### TEnum

`TEnum` *extends* `string` = `string`

### TEnumTitles

`TEnumTitles` *extends* `string` = `string`

### TSchema

`TSchema` = `any`
