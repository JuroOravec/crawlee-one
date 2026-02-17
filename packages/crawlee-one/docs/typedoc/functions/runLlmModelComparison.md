[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / runLlmModelComparison

# Function: runLlmModelComparison()

> **runLlmModelComparison**\<`TData`, `TInput`\>(`opts`): `Promise`\<[`LlmComparisonReport`](../interfaces/LlmComparisonReport.md)\<`TData`\>\>

Defined in: packages/crawlee-one/src/lib/llmCompare/comparison.ts:84

## Type Parameters

### TData

`TData` *extends* `Dictionary`

### TInput

`TInput` *extends* `object`

## Parameters

### opts

#### baseInput?

`Partial`\<`TInput`\>

#### getResultId

(`item`) => `string` \| `undefined`

#### modelConfigs

[`LlmModelConfig`](../interfaces/LlmModelConfig.md)[]

#### outputHtmlPath?

`string`

When set, generate an HTML comparison report at this path

#### runCrawler

() => `Promise`\<`void`\>

#### urls

`string`[]

#### vi

`VitestUtils`

## Returns

`Promise`\<[`LlmComparisonReport`](../interfaces/LlmComparisonReport.md)\<`TData`\>\>
