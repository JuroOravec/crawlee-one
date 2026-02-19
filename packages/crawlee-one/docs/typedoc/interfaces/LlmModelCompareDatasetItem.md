[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / LlmModelCompareDatasetItem

# Interface: LlmModelCompareDatasetItem

Defined in: packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:15

Dataset item shape for LLM compare runs

## Properties

### completionTokens?

> `optional` **completionTokens**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:24

***

### data

> **data**: `Record`\<`string`, `unknown`\> \| `null`

Defined in: packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:17

Extracted object on success, null on failure

***

### error

> **error**: `string` \| `null`

Defined in: packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:19

Error message on failure, null on success

***

### extractionMs?

> `optional` **extractionMs**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:22

***

### modelId

> **modelId**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:20

***

### promptTokens?

> `optional` **promptTokens**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:23

***

### totalTokens?

> `optional` **totalTokens**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:25

***

### url

> **url**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:21
