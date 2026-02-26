[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / LlmModelCompareConfig

# Interface: LlmModelCompareConfig

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:2

Configuration for one LLM model in a comparison run

## Properties

### apiKey

> **apiKey**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:10

API key for the provider

---

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:12

Base URL for OpenAI-compatible APIs

---

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:14

Custom headers

---

### id

> **id**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:4

Unique identifier (e.g. 'gpt-4o', 'claude-3-5-sonnet')

---

### label?

> `optional` **label**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:16

Human-readable label (e.g. 'GPT-4o (OpenAI)')

---

### model

> **model**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:8

Model ID (e.g. 'gpt-4o', 'claude-3-5-sonnet')

---

### priceInputPer1MToken?

> `optional` **priceInputPer1MToken**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:18

Price per 1M input tokens (USD), for cost estimate in reports

---

### priceOutputPer1MToken?

> `optional` **priceOutputPer1MToken**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:20

Price per 1M output tokens (USD), for cost estimate in reports

---

### provider

> **provider**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:6

Provider (e.g. 'openai', 'anthropic')
