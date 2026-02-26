[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / outputInput

# Variable: outputInput

> `const` **outputInput**: `object`

Defined in: [packages/crawlee-one/src/lib/input.ts:962](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L962)

Common input fields related to actor output

## Type Declaration

### outputCacheActionOnResult

> **outputCacheActionOnResult**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodEnum`\<\[`"add"`, `"remove"`, `"overwrite"`\]\>\>\>

### outputCachePrimaryKeys

> **outputCachePrimaryKeys**: `ArrayField`\<`string`[], `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>\>

### outputCacheStoreId

> **outputCacheStoreId**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### outputDatasetId

> **outputDatasetId**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### outputFilter

> **outputFilter**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### outputFilterAfter

> **outputFilterAfter**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### outputFilterBefore

> **outputFilterBefore**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### outputMaxEntries

> **outputMaxEntries**: `IntegerField`\<`number`, `string`, `ZodOptional`\<`ZodNumber`\>\>

### outputPickFields

> **outputPickFields**: `ArrayField`\<`string`[], `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>\>

### outputRenameFields

> **outputRenameFields**: `ObjectField`\<\{ `oldFieldName`: `string`; \}, `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodString`\>\>\>

### outputTransform

> **outputTransform**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### outputTransformAfter

> **outputTransformAfter**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>

### outputTransformBefore

> **outputTransformBefore**: `StringField`\<`string`, `string`, `ZodOptional`\<`ZodString`\>\>
