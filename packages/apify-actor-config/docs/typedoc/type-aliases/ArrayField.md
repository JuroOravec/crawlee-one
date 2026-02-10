[**apify-actor-config**](../README.md)

***

[apify-actor-config](../globals.md) / ArrayField

# Type Alias: ArrayField\<T\>

> **ArrayField**\<`T`\> = `BaseArrayField`\<`T`\> \| `KeyValueArrayField`\<`T`\> \| `StringListArrayField`\<`T`\> \| `SelectArrayField`\<`T`\>

Defined in: [inputSchema.ts:498](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/inputSchema.ts#L498)

See https://docs.apify.com/platform/actors/development/actor-definition/input-schema/specification/v1#array

Usage of this field is based on the selected editor:
- `requestListSources` - value from this field can be used as input of RequestList class from Crawlee.
- `pseudoUrls` - is intended to be used with a combination of the PseudoUrl class and the enqueueLinks() function from Crawlee.

Example of request list sources configuration:

```json
{
"title": "Start URLs",
"type": "array",
"description": "URLs to start with",
"prefill": [{ "url": "http://example.com" }],
"editor": "requestListSources"
}
```

Example of an array:

```json
{
"title": "Colors",
"type": "array",
"description": "Enter colors you know",
"prefill": ["Red", "White"],
"editor": "json"
}
```

## Type Parameters

### T

`T` = `unknown`
