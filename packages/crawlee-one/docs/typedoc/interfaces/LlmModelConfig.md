[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / LlmModelConfig

# Interface: LlmModelConfig

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:2

Configuration for one LLM model in a comparison run

## Properties

### apiKey

> **apiKey**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:10

API key for the provider

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:12

Base URL for OpenAI-compatible APIs

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:14

Custom headers

***

### id

> **id**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:4

Unique identifier (e.g. 'gpt-4o', 'claude-3-5-sonnet')

***

### isSourceOfTruth?

> `optional` **isSourceOfTruth**: `boolean`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:16

Exactly one config must have this true; its output is the reference for comparison

***

### label?

> `optional` **label**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:18

Human-readable label (e.g. 'GPT-4o (OpenAI)')

***

### model

> **model**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:8

Model ID (e.g. 'gpt-4o', 'claude-3-5-sonnet')

***

### pricePer1kInputTokens?

> `optional` **pricePer1kInputTokens**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:20

Price per 1k input tokens (for cost estimation)

***

### pricePer1kOutputTokens?

> `optional` **pricePer1kOutputTokens**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:22

Price per 1k output tokens (for cost estimation)

***

### provider

> **provider**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:6

Provider (e.g. 'openai', 'anthropic')
