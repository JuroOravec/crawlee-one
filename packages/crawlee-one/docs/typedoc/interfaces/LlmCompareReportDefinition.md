[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / LlmCompareReportDefinition

# Interface: LlmCompareReportDefinition

Defined in: [packages/crawlee-one/src/lib/config/types.ts:53](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L53)

LLM compare report definition. Used in crawlee-one.config.ts `llm.compare.reports`.

## Properties

### models

> **models**: [`LlmModelCompareConfig`](LlmModelCompareConfig.md)[]

Defined in: [packages/crawlee-one/src/lib/config/types.ts:55](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L55)

Model configs to compare

---

### referenceModel

> **referenceModel**: `string`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:57](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L57)

ID of the model whose output is the reference for comparison

---

### schema

> **schema**: `unknown`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:61](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L61)

JSON schema or Zod schema for extraction output

---

### systemPrompt

> **systemPrompt**: `string`

Defined in: [packages/crawlee-one/src/lib/config/types.ts:63](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L63)

System prompt for LLM extraction

---

### urls

> **urls**: [`CrawlerUrl`](../type-aliases/CrawlerUrl.md)[]

Defined in: [packages/crawlee-one/src/lib/config/types.ts:59](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/config/types.ts#L59)

URLs or RequestOptions to fetch and extract (no function support)
