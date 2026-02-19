[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / LlmModelCompareReportEntry

# Interface: LlmModelCompareReportEntry

Defined in: [packages/crawlee-one/src/lib/llmCompare/types.ts:24](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/types.ts#L24)

Result of comparing one model against the source of truth

## Properties

### agreementByField

> **agreementByField**: `Record`\<`string`, `number`\>

Defined in: [packages/crawlee-one/src/lib/llmCompare/types.ts:34](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/types.ts#L34)

Per-field agreement rate (e.g. { title: 0.95, description: 0.72 })

***

### agreementRate

> **agreementRate**: `number`

Defined in: [packages/crawlee-one/src/lib/llmCompare/types.ts:32](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/types.ts#L32)

Fraction of field comparisons that match (0–1)

***

### completionTokensAvg?

> `optional` **completionTokensAvg**: `number`

Defined in: [packages/crawlee-one/src/lib/llmCompare/types.ts:46](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/types.ts#L46)

Average completion tokens per request

***

### errorCount

> **errorCount**: `number`

Defined in: [packages/crawlee-one/src/lib/llmCompare/types.ts:30](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/types.ts#L30)

Number of extractions that errored (LLM call failed)

***

### extractionSecAvg?

> `optional` **extractionSecAvg**: `number`

Defined in: [packages/crawlee-one/src/lib/llmCompare/types.ts:42](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/types.ts#L42)

Average LLM extraction time per request in seconds (from _extractionMeta.extractionMs)

***

### id

> **id**: `string`

Defined in: [packages/crawlee-one/src/lib/llmCompare/types.ts:25](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/types.ts#L25)

***

### label?

> `optional` **label**: `string`

Defined in: [packages/crawlee-one/src/lib/llmCompare/types.ts:26](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/types.ts#L26)

***

### matchedIds

> **matchedIds**: `string`[]

Defined in: [packages/crawlee-one/src/lib/llmCompare/types.ts:36](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/types.ts#L36)

IDs where both reference and this model have a result, and all fields match field-by-field

***

### mismatchedIds

> **mismatchedIds**: `string`[]

Defined in: [packages/crawlee-one/src/lib/llmCompare/types.ts:38](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/types.ts#L38)

IDs where both reference and this model have a result, but at least one field differs

***

### missingIds

> **missingIds**: `string`[]

Defined in: [packages/crawlee-one/src/lib/llmCompare/types.ts:40](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/types.ts#L40)

IDs the reference has but this model has no result for (comparison gap)

***

### promptTokensAvg?

> `optional` **promptTokensAvg**: `number`

Defined in: [packages/crawlee-one/src/lib/llmCompare/types.ts:44](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/types.ts#L44)

Average prompt tokens per request

***

### succeededCount

> **succeededCount**: `number`

Defined in: [packages/crawlee-one/src/lib/llmCompare/types.ts:28](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/types.ts#L28)

Number of extractions that succeeded (data returned)

***

### totalTokensAvg?

> `optional` **totalTokensAvg**: `number`

Defined in: [packages/crawlee-one/src/lib/llmCompare/types.ts:48](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmCompare/types.ts#L48)

Average total tokens per request
