[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / ExtractWithLlmOptions

# Interface: ExtractWithLlmOptions

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:6](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L6)

Options for extraction when using a pre-serialized JSON schema (e.g. from userData in LLM crawler).

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:17](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L17)

API key for the LLM provider

---

### baseURL?

> `optional` **baseURL**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:19](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L19)

Optional base URL for OpenAI-compatible APIs (e.g. custom endpoint, Azure OpenAI)

---

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:21](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L21)

Custom headers to include in LLM API requests

---

### html

> **html**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:7](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L7)

---

### jsonSchema

> **jsonSchema**: `JSONSchema7`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:9](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L9)

JSON schema for the expected output structure

---

### model

> **model**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:13](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L13)

Model ID (e.g. `gpt-4o`, `claude-3-5-sonnet`).

---

### provider?

> `optional` **provider**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:15](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L15)

Provider identifier (e.g. `openai`, `anthropic`). Unknown providers use the OpenAI adapter.

---

### systemPrompt

> **systemPrompt**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:11](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L11)

System prompt describing the extraction task

---

### url?

> `optional` **url**: `string`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:23](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L23)

Page URL (for logging)
