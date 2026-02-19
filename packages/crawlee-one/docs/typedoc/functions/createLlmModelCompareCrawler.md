[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / createLlmModelCompareCrawler

# Function: createLlmModelCompareCrawler()

> **createLlmModelCompareCrawler**(`opts`): `Promise`\<`LLMCompareCrawler`\>

Defined in: packages/crawlee-one/src/lib/llmCompare/compareCrawler.ts:43

Create HttpCrawler that fetches each URL, runs extractWithLlm for each model,
and pushes results to dataset `llm-compare--{reportName}`.

## Parameters

### opts

[`LlmModelCompareCrawlerOptions`](../interfaces/LlmModelCompareCrawlerOptions.md)

## Returns

`Promise`\<`LLMCompareCrawler`\>
