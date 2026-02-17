/** Env var for LLM request queue ID. Default: 'llm'. */
export const ENV_LLM_REQUEST_QUEUE_ID = 'CRAWLEE_LLM_REQUEST_QUEUE_ID';

/** Env var for LLM key-value store ID. Default: 'llm'. */
export const ENV_LLM_KEY_VALUE_STORE_ID = 'CRAWLEE_LLM_KEY_VALUE_STORE_ID';

const DEFAULT_LLM_QUEUE_ID = 'llm';
const DEFAULT_LLM_STORE_ID = 'llm';

export function getLlmRequestQueueId(overrides?: { llmRequestQueueId?: string }): string {
  return (
    overrides?.llmRequestQueueId ?? process.env[ENV_LLM_REQUEST_QUEUE_ID] ?? DEFAULT_LLM_QUEUE_ID
  );
}

export function getLlmKeyValueStoreId(overrides?: { llmKeyValueStoreId?: string }): string {
  return (
    overrides?.llmKeyValueStoreId ?? process.env[ENV_LLM_KEY_VALUE_STORE_ID] ?? DEFAULT_LLM_STORE_ID
  );
}

export const LLM_KVS_KEY_PREFIX = 'llm--';
