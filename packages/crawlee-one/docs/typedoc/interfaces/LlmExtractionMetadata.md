[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / LlmExtractionMetadata

# Interface: LlmExtractionMetadata

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:27](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L27)

Metadata for LLM extraction (timing and optional token usage).

## Properties

### completionTokens?

> `optional` **completionTokens**: `number`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:33](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L33)

Output (completion) tokens

***

### extractionMs

> **extractionMs**: `number`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:29](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L29)

Elapsed time in milliseconds for the LLM API call

***

### promptTokens?

> `optional` **promptTokens**: `number`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:31](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L31)

Input (prompt) tokens

***

### totalTokens?

> `optional` **totalTokens**: `number`

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:35](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L35)

Total tokens
