[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / outputInput

# Variable: outputInput

> `const` **outputInput**: `object`

Common input fields related to actor output

## Type declaration

### outputCacheActionOnResult

> **outputCacheActionOnResult**: `StringField`\<`NonNullable`\<`undefined` \| `null` \| `"add"` \| `"remove"` \| `"overwrite"`\>, `string`\>

### outputCachePrimaryKeys

> **outputCachePrimaryKeys**: `ArrayField`\<`string`[]\>

### outputCacheStoreId

> **outputCacheStoreId**: `StringField`\<`string`, `string`\>

### outputDatasetId

> **outputDatasetId**: `StringField`\<`string`, `string`\>

### outputFilter

> **outputFilter**: `StringField`\<`string`, `string`\>

### outputFilterAfter

> **outputFilterAfter**: `StringField`\<`string`, `string`\>

### outputFilterBefore

> **outputFilterBefore**: `StringField`\<`string`, `string`\>

### outputMaxEntries

> **outputMaxEntries**: `IntegerField`\<`number`, `string`\>

### outputPickFields

> **outputPickFields**: `ArrayField`\<`string`[]\>

### outputRenameFields

> **outputRenameFields**: `ObjectField`\<`object`\>

#### Type declaration

##### oldFieldName

> **oldFieldName**: `string` = `'newFieldName'`

### outputTransform

> **outputTransform**: `StringField`\<`string`, `string`\>

### outputTransformAfter

> **outputTransformAfter**: `StringField`\<`string`, `string`\>

### outputTransformBefore

> **outputTransformBefore**: `StringField`\<`string`, `string`\>

## Source

[src/lib/input.ts:861](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/input.ts#L861)
