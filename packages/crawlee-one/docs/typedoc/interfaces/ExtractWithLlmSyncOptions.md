[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / ExtractWithLlmSyncOptions

# Interface: ExtractWithLlmSyncOptions\<T\>

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:78](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L78)

Options for the scoped extractWithLlmSync function.

## Extends

- `Pick`\<[`ExtractWithLlmOptions`](ExtractWithLlmOptions.md), `"systemPrompt"` \| `"baseURL"` \| `"headers"`\>.`Partial`\<`Pick`\<[`ExtractWithLlmOptions`](ExtractWithLlmOptions.md), `"apiKey"` \| `"provider"` \| `"model"`\>\>

## Extended by

- [`ExtractWithLlmAsyncOptions`](ExtractWithLlmAsyncOptions.md)

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

---

### baseURL?

> `optional` **baseURL**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:19](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L19)

Optional base URL for OpenAI-compatible APIs (e.g. custom endpoint, Azure OpenAI)

#### Inherited from

[`ExtractWithLlmOptions`](ExtractWithLlmOptions.md).[`baseURL`](ExtractWithLlmOptions.md#baseurl)

---

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:21](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L21)

Custom headers to include in LLM API requests

#### Inherited from

[`ExtractWithLlmOptions`](ExtractWithLlmOptions.md).[`headers`](ExtractWithLlmOptions.md#headers)

---

### model?

> `optional` **model**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:13](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L13)

Model ID (e.g. `gpt-4o`, `claude-3-5-sonnet`).

#### Inherited from

[`ExtractWithLlmOptions`](ExtractWithLlmOptions.md).[`model`](ExtractWithLlmOptions.md#model)

---

### provider?

> `optional` **provider**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:15](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L15)

Provider identifier (e.g. `openai`, `anthropic`). Unknown providers use the OpenAI adapter.

#### Inherited from

[`ExtractWithLlmOptions`](ExtractWithLlmOptions.md).[`provider`](ExtractWithLlmOptions.md#provider)

---

### schema

> **schema**: `ZodType`\<`T`\>

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:83](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L83)

Zod schema for the expected output. Converted to JSON schema for the LLM.

---

### systemPrompt

> **systemPrompt**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:11](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L11)

System prompt describing the extraction task

#### Inherited from

[`ExtractWithLlmOptions`](ExtractWithLlmOptions.md).[`systemPrompt`](ExtractWithLlmOptions.md#systemprompt)

---

### text?

> `optional` **text**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts:85](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlmScoped.ts#L85)

Override default text (e.g. ctx.$.html() or $('.my-class').html()).
