[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / LlmModelCompareReportEntry

# Interface: LlmModelCompareReportEntry

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:24

Result of comparing one model against the source of truth

## Properties

### agreementByField

> **agreementByField**: `Record`\<`string`, `number`\>

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:34

Per-field agreement rate (e.g. { title: 0.95, description: 0.72 })

---

### agreementRate

> **agreementRate**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:32

Fraction of field comparisons that match (0–1)

---

### completionTokensAvg?

> `optional` **completionTokensAvg**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:46

Average completion tokens per request

---

### errorCount

> **errorCount**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:30

Number of extractions that errored (LLM call failed)

---

### extractionSecAvg?

> `optional` **extractionSecAvg**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:42

Average LLM extraction time per request in seconds (from \_extractionMeta.extractionMs)

---

### id

> **id**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:25

---

### label?

> `optional` **label**: `string`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:26

---

### matchedIds

> **matchedIds**: `string`[]

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:36

IDs where both reference and this model have a result, and all fields match field-by-field

---

### mismatchedIds

> **mismatchedIds**: `string`[]

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:38

IDs where both reference and this model have a result, but at least one field differs

---

### missingIds

> **missingIds**: `string`[]

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:40

IDs the reference has but this model has no result for (comparison gap)

---

### promptTokensAvg?

> `optional` **promptTokensAvg**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:44

Average prompt tokens per request

---

### succeededCount

> **succeededCount**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:28

Number of extractions that succeeded (data returned)

---

### totalTokensAvg?

> `optional` **totalTokensAvg**: `number`

Defined in: packages/crawlee-one/src/lib/llmCompare/types.ts:48

Average total tokens per request
