[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / runLlmModelComparison

# Function: runLlmModelComparison()

> **runLlmModelComparison**\<`TData`\>(`opts`): `Promise`\<[`LlmModelCompareReport`](../interfaces/LlmModelCompareReport.md)\<`TData`\>\>

Defined in: packages/crawlee-one/src/lib/llmCompare/comparison.ts:50

Run LLM model comparison: fetch URLs with HttpCrawler, extract with each model
with `extractWithLlm`, then compare outputs field-by-field against the reference model.

If `outputPath` is set, the report is written to the file.

If `outputFormat` is "json", the report is written to the file in JSON format.

Uses queue/dataset `llm-compare--{reportName}`.

## Type Parameters

### TData

`TData` *extends* `Dictionary` = `Dictionary`

## Parameters

### opts

[`LlmModelComparisonOptions`](../interfaces/LlmModelComparisonOptions.md)\<`TData`\>

## Returns

`Promise`\<[`LlmModelCompareReport`](../interfaces/LlmModelCompareReport.md)\<`TData`\>\>
