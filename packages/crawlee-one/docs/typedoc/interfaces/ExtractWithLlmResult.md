[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / ExtractWithLlmResult

# Interface: ExtractWithLlmResult\<T\>

Defined in: packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:39

Result of LLM extraction.

## Type Parameters

### T

`T`

## Properties

### metadata

> **metadata**: [`LlmExtractionMetadata`](LlmExtractionMetadata.md)

Defined in: packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:43

Extraction metadata (timing, token usage)

***

### object

> **object**: `T`

Defined in: packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:41

Extracted object validated by the schema
