[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / LlmModelComparisonOptions

# Interface: LlmModelComparisonOptions\<_TData\>

Defined in: [packages/crawlee-one/src/lib/llmCompare/comparison.ts:19](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/comparison.ts#L19)

Options for runLlmModelComparison — matches LlmCompareReportDefinition fields.

## Type Parameters

### _TData

`_TData` = `Dictionary`

## Properties

### modelConfigs

> **modelConfigs**: [`LlmModelCompareConfig`](LlmModelCompareConfig.md)[]

Defined in: [packages/crawlee-one/src/lib/llmCompare/comparison.ts:23](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/comparison.ts#L23)

Model configs to compare

***

### outputFormat?

> `optional` **outputFormat**: `"json"` \| `"html"`

Defined in: [packages/crawlee-one/src/lib/llmCompare/comparison.ts:33](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/comparison.ts#L33)

Output format: 'html' (default) or 'json'

***

### outputPath?

> `optional` **outputPath**: `string`

Defined in: [packages/crawlee-one/src/lib/llmCompare/comparison.ts:31](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/comparison.ts#L31)

Output file path (e.g. report.html or report.json)

***

### referenceModel

> **referenceModel**: `string`

Defined in: [packages/crawlee-one/src/lib/llmCompare/comparison.ts:25](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/comparison.ts#L25)

ID of the model whose output is the reference for comparison

***

### reportName?

> `optional` **reportName**: `string`

Defined in: [packages/crawlee-one/src/lib/llmCompare/comparison.ts:35](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/comparison.ts#L35)

Optional report name for queue/dataset IDs (default: 'default')

***

### reportOnly?

> `optional` **reportOnly**: `boolean`

Defined in: [packages/crawlee-one/src/lib/llmCompare/comparison.ts:37](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/comparison.ts#L37)

If true, skip crawl and drop; read from existing dataset only (no new extractions)

***

### schema

> **schema**: `unknown`

Defined in: [packages/crawlee-one/src/lib/llmCompare/comparison.ts:27](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/comparison.ts#L27)

JSON schema or Zod schema for extraction output

***

### systemPrompt

> **systemPrompt**: `string`

Defined in: [packages/crawlee-one/src/lib/llmCompare/comparison.ts:29](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/comparison.ts#L29)

System prompt for LLM extraction

***

### urls

> **urls**: [`CrawlerUrl`](../type-aliases/CrawlerUrl.md)[]

Defined in: [packages/crawlee-one/src/lib/llmCompare/comparison.ts:21](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/comparison.ts#L21)

URLs or RequestOptions to fetch and extract (no function support)
