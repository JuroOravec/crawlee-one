[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / ExtractWithLlmScopedOptions

# Interface: ExtractWithLlmScopedOptions\<T\>

Defined in: packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:34

Options for the scoped extractWithLLM function.

## Type Parameters

### T

`T`

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:42

Override actor input

***

### baseURL?

> `optional` **baseURL**: `string`

Defined in: packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:45

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:46

***

### llmKeyValueStoreId?

> `optional` **llmKeyValueStoreId**: `string`

Defined in: packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:48

***

### llmRequestQueueId?

> `optional` **llmRequestQueueId**: `string`

Defined in: packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:47

***

### model?

> `optional` **model**: `string`

Defined in: packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:44

***

### provider?

> `optional` **provider**: `string`

Defined in: packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:43

***

### schema

> **schema**: `ZodType`\<`T`\>

Defined in: packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:36

Zod schema for the expected output. Converted to JSON schema for the LLM queue.

***

### systemPrompt

> **systemPrompt**: `string`

Defined in: packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:38

System prompt describing the extraction task.

***

### text?

> `optional` **text**: `string`

Defined in: packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:40

Override default text (e.g. ctx.$.html() or $('.my-class').html()).
