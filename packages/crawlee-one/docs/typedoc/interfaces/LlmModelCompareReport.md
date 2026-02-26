[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / LlmModelCompareReport

# Interface: LlmModelCompareReport\<TData\>

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:52

Report from runLlmModelComparison

## Type Parameters

### TData

`TData` = `unknown`

## Properties

### byId

> **byId**: `Record`\<`string`, \{\[`modelId`: `string`\]: `TData` \| `null`; \}\>

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:57

Per ID: each model's result (null if model failed for that ID)

---

### models

> **models**: [`LlmModelCompareReportEntry`](LlmModelCompareReportEntry.md)[]

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:55

---

### referenceModelId

> **referenceModelId**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:54

---

### totalIds

> **totalIds**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:53
