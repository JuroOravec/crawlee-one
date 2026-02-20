[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / ExtractWithLlmAsyncOptions

# Interface: ExtractWithLlmAsyncOptions\<T\>

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:89](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L89)

Options for the async (deferred) extractWithLLM function.

## Extends

- [`ExtractWithLlmSyncOptions`](ExtractWithLlmSyncOptions.md)\<`T`\>

## Type Parameters

### T

`T`

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:17](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L17)

API key for the LLM provider

#### Inherited from

[`ExtractWithLlmOptions`](ExtractWithLlmOptions.md).[`apiKey`](ExtractWithLlmOptions.md#apikey)

***

### baseURL?

> `optional` **baseURL**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:19](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L19)

Optional base URL for OpenAI-compatible APIs (e.g. custom endpoint, Azure OpenAI)

#### Inherited from

[`ExtractWithLlmOptions`](ExtractWithLlmOptions.md).[`baseURL`](ExtractWithLlmOptions.md#baseurl)

***

### extractionId?

> `optional` **extractionId**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:96](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L96)

Override the extraction ID (KVS key and LLM queue uniqueKey).
When set, skips computed ID. Use as an escape hatch when you need explicit control.

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:21](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L21)

Custom headers to include in LLM API requests

#### Inherited from

[`ExtractWithLlmOptions`](ExtractWithLlmOptions.md).[`headers`](ExtractWithLlmOptions.md#headers)

***

### llmKeyValueStoreId?

> `optional` **llmKeyValueStoreId**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:91](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L91)

***

### llmRequestQueueId?

> `optional` **llmRequestQueueId**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:90](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L90)

***

### model?

> `optional` **model**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:13](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L13)

Model ID (e.g. `gpt-4o`, `claude-3-5-sonnet`).

#### Inherited from

[`ExtractWithLlmOptions`](ExtractWithLlmOptions.md).[`model`](ExtractWithLlmOptions.md#model)

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:15](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L15)

Provider identifier (e.g. `openai`, `anthropic`). Unknown providers use the OpenAI adapter.

#### Inherited from

[`ExtractWithLlmOptions`](ExtractWithLlmOptions.md).[`provider`](ExtractWithLlmOptions.md#provider)

***

### schema

> **schema**: `ZodType`\<`T`\>

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:83](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L83)

Zod schema for the expected output. Converted to JSON schema for the LLM.

#### Inherited from

[`ExtractWithLlmSyncOptions`](ExtractWithLlmSyncOptions.md).[`schema`](ExtractWithLlmSyncOptions.md#schema)

***

### systemPrompt

> **systemPrompt**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:11](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L11)

System prompt describing the extraction task

#### Inherited from

[`ExtractWithLlmOptions`](ExtractWithLlmOptions.md).[`systemPrompt`](ExtractWithLlmOptions.md#systemprompt)

***

### text?

> `optional` **text**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:85](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L85)

Override default text (e.g. ctx.$.html() or $('.my-class').html()).

#### Inherited from

[`ExtractWithLlmSyncOptions`](ExtractWithLlmSyncOptions.md).[`text`](ExtractWithLlmSyncOptions.md#text)
