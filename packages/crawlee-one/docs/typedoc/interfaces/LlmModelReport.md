[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / LlmModelReport

# Interface: LlmModelReport

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:26

Result of comparing one model against the source of truth

## Properties

### agreementByField

> **agreementByField**: `Record`\<`string`, `number`\>

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:32

Per-field agreement rate (e.g. { title: 0.95, description: 0.72 })

***

### agreementRate

> **agreementRate**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:30

Fraction of field comparisons that match (0–1)

***

### completionTokensTotal?

> `optional` **completionTokensTotal**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:42

Total completion tokens across extractions

***

### costEstimate?

> `optional` **costEstimate**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:46

Estimated cost in USD (when pricePer1kInputTokens/OutputTokens set on config)

***

### extractionMsTotal?

> `optional` **extractionMsTotal**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:38

Total LLM extraction time in ms (from _extractionMeta.extractionMs)

***

### failedIds

> **failedIds**: `string`[]

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:36

IDs with no result from this model

***

### id

> **id**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:27

***

### label?

> `optional` **label**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:28

***

### matchedIds

> **matchedIds**: `string`[]

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:33

***

### mismatchedIds

> **mismatchedIds**: `string`[]

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:34

***

### promptTokensTotal?

> `optional` **promptTokensTotal**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:40

Total prompt tokens across extractions

***

### totalTokensTotal?

> `optional` **totalTokensTotal**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:44

Total tokens across extractions
