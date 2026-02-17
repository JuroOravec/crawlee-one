[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / createLlmCrawler

# Function: createLlmCrawler()

> **createLlmCrawler**(`options?`): `Promise`\<`LLMCrawler`\<`BasicCrawlingContext`\<`Dictionary`\>\>\>

Defined in: packages/crawlee-one/src/lib/llmExtract/llmCrawler.ts:36

BasicCrawler that processes LLM extraction jobs from the LLM request queue.
Each request's userData contains html, jsonSchema, systemPrompt, and LLM config.
On success, writes the extracted object to the LLM KeyValueStore under llm--{originalRequestId}.

When keepAlive is true, the crawler will not resolve run() when the queue is empty;
it keeps running until crawler.stop() is called. Used for orchestrator mode where
the scraper and LLM worker run concurrently.

## Parameters

### options?

#### keepAlive?

`boolean`

When true, crawler stays alive after queue is empty until stop() is called.

#### keyValueStoreId?

`string`

#### requestQueueId?

`string`

## Returns

`Promise`\<`LLMCrawler`\<`BasicCrawlingContext`\<`Dictionary`\>\>\>
