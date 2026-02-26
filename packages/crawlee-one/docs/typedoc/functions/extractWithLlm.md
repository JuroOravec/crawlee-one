[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / extractWithLlm

# Function: extractWithLlm()

> **extractWithLlm**\<`T`\>(`opts`): `Promise`\<[`ExtractWithLlmResult`](../interfaces/ExtractWithLlmResult.md)\<`T`\>\>

Defined in: [packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts:64](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/llmExtract/extractWithLlm.ts#L64)

Extract structured data from HTML using an LLM with a JSON schema.

Used by the LLM crawler when processing deferred extraction jobs from userData.

## Type Parameters

### T

`T` = `unknown`

## Parameters

### opts

[`ExtractWithLlmOptions`](../interfaces/ExtractWithLlmOptions.md)

## Returns

`Promise`\<[`ExtractWithLlmResult`](../interfaces/ExtractWithLlmResult.md)\<`T`\>\>

## Example

```ts
const { object } = await extractWithLlm({
  html: documentHtml,
  jsonSchema: jobOfferJsonSchema,
  systemPrompt: 'Extract job details from this job posting HTML.',
  apiKey: process.env.OPENAI_API_KEY!,
  provider: 'openai',
  model: 'gpt-4o',
});
// object, metadata
```
