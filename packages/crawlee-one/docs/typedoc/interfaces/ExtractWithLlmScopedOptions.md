[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / ExtractWithLlmScopedOptions

# Interface: ExtractWithLlmScopedOptions\<T\>

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:51](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L51)

Options for the scoped extractWithLLM function.

## Type Parameters

### T

`T`

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:59](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L59)

Override actor input

***

### baseURL?

> `optional` **baseURL**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:62](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L62)

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:63](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L63)

***

### llmKeyValueStoreId?

> `optional` **llmKeyValueStoreId**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:65](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L65)

***

### llmRequestQueueId?

> `optional` **llmRequestQueueId**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:64](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L64)

***

### model?

> `optional` **model**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:61](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L61)

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:60](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L60)

***

### schema

> **schema**: `ZodType`\<`T`\>

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:53](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L53)

Zod schema for the expected output. Converted to JSON schema for the LLM queue.

***

### systemPrompt

> **systemPrompt**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:55](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L55)

System prompt describing the extraction task.

***

### text?

> `optional` **text**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:57](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L57)

Override default text (e.g. ctx.$.html() or $('.my-class').html()).
