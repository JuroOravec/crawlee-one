[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / LlmModelComparisonOptions

# Interface: LlmModelComparisonOptions\<_TData\>

Defined in: packages/crawlee-one/src/lib/llmCompare/comparison.ts:19

Options for runLlmModelComparison — matches LlmCompareReportDefinition fields.

## Type Parameters

### _TData

`_TData` = `Dictionary`

## Properties

### modelConfigs

> **modelConfigs**: [`LlmModelCompareConfig`](LlmModelCompareConfig.md)[]

Defined in: packages/crawlee-one/src/lib/llmCompare/comparison.ts:23

Model configs to compare

***

### outputFormat?

> `optional` **outputFormat**: `"json"` \| `"html"`

Defined in: packages/crawlee-one/src/lib/llmCompare/comparison.ts:33

Output format: 'html' (default) or 'json'

***

### outputPath?

> `optional` **outputPath**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/comparison.ts:31

Output file path (e.g. report.html or report.json)

***

### referenceModel

> **referenceModel**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/comparison.ts:25

ID of the model whose output is the reference for comparison

***

### reportName?

> `optional` **reportName**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/comparison.ts:35

Optional report name for queue/dataset IDs (default: 'default')

***

### reportOnly?

> `optional` **reportOnly**: `boolean`

Defined in: packages/crawlee-one/src/lib/llmCompare/comparison.ts:37

If true, skip crawl and drop; read from existing dataset only (no new extractions)

***

### schema

> **schema**: `unknown`

Defined in: packages/crawlee-one/src/lib/llmCompare/comparison.ts:27

JSON schema or Zod schema for extraction output

***

### systemPrompt

> **systemPrompt**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/comparison.ts:29

System prompt for LLM extraction

***

### urls

> **urls**: [`CrawlerUrl`](../type-aliases/CrawlerUrl.md)[]

Defined in: packages/crawlee-one/src/lib/llmCompare/comparison.ts:21

URLs or RequestOptions to fetch and extract (no function support)
