[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / LlmActorInput

# Interface: LlmActorInput

Defined in: [packages/crawlee-one/src/lib/input.ts:336](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L336)

Common input fields for LLM-based extraction (e.g. custom page extraction fallback)

## Properties

### llmApiKey?

> `optional` **llmApiKey**: `string`

Defined in: [packages/crawlee-one/src/lib/input.ts:344](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L344)

API key for the LLM provider.

When set, scrapers can use AI to extract data from pages where DOM-based extraction fails.

Overrides environment variables like `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`.

***

### llmBaseUrl?

> `optional` **llmBaseUrl**: `string`

Defined in: [packages/crawlee-one/src/lib/input.ts:369](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L369)

Base URL for the LLM API (e.g. custom OpenAI-compatible endpoint, Azure OpenAI).

When set, overrides the default provider endpoint. Requires a valid URL.

***

### llmHeaders?

> `optional` **llmHeaders**: `Record`\<`string`, `string`\>

Defined in: [packages/crawlee-one/src/lib/input.ts:373](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L373)

Custom headers to include in LLM API requests (e.g. `X-API-Version`, `OpenAI-Organization`).

***

### llmKeyValueStoreId?

> `optional` **llmKeyValueStoreId**: `string`

Defined in: [packages/crawlee-one/src/lib/input.ts:381](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L381)

Override the LLM key-value store ID. When unset, crawlee-one uses run-scoped ID `llm-{runId}`.

***

### llmModel?

> `optional` **llmModel**: `string`

Defined in: [packages/crawlee-one/src/lib/input.ts:363](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L363)

Model ID for the LLM (e.g. `gpt-4o`, `claude-3-5-sonnet-20241022`).

To see available models per provider, see:
- OpenAI - https://developers.openai.com/api/docs/models
- Anthropic - https://docs.anthropic.com/en/docs/about-claude/models
- Google - https://cloud.google.com/vertex-ai/generative-ai/docs/models
- DeepSeek - https://api-docs.deepseek.com/quick_start/pricing
- Ollama - https://ollama.com/models

***

### llmProvider?

> `optional` **llmProvider**: `string`

Defined in: [packages/crawlee-one/src/lib/input.ts:352](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L352)

LLM provider identifier (e.g. `openai`, `anthropic`, `google`).

Combined with `llmModel` as `{provider}:{model}` when calling the LLM.

Custom / unknown providers are supported via OpenAI-compatible APIs.

***

### llmQueueDrainCheckIntervalMs?

> `optional` **llmQueueDrainCheckIntervalMs**: `number`

Defined in: [packages/crawlee-one/src/lib/input.ts:395](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L395)

After the main crawler finishes, this is how long we wait before
we check if either the main queue or LLM queue have any more requests left.

You likely don't need to change this.

When using LLM to extract data, the requsts may ping-pong between the LLM
and the main queue. The default 5s is set to give time for the dust to settle.

Default: 5000.

Set to 0 in tests to avoid timeouts.

***

### llmRequestQueueId?

> `optional` **llmRequestQueueId**: `string`

Defined in: [packages/crawlee-one/src/lib/input.ts:377](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/input.ts#L377)

Override the LLM request queue ID. When unset, crawlee-one uses run-scoped ID `llm-{runId}`.
