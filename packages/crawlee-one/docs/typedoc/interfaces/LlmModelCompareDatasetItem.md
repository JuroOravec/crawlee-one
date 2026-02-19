[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / LlmModelCompareDatasetItem

# Interface: LlmModelCompareDatasetItem

Defined in: [packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:15](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts#L15)

Dataset item shape for LLM compare runs

## Properties

### completionTokens?

> `optional` **completionTokens**: `number`

Defined in: [packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:24](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts#L24)

***

### data

> **data**: `Record`\<`string`, `unknown`\> \| `null`

Defined in: [packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:17](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts#L17)

Extracted object on success, null on failure

***

### error

> **error**: `string` \| `null`

Defined in: [packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:19](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts#L19)

Error message on failure, null on success

***

### extractionMs?

> `optional` **extractionMs**: `number`

Defined in: [packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:22](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts#L22)

***

### modelId

> **modelId**: `string`

Defined in: [packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:20](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts#L20)

***

### promptTokens?

> `optional` **promptTokens**: `number`

Defined in: [packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:23](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts#L23)

***

### totalTokens?

> `optional` **totalTokens**: `number`

Defined in: [packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:25](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts#L25)

***

### url

> **url**: `string`

Defined in: [packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:21](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts#L21)
