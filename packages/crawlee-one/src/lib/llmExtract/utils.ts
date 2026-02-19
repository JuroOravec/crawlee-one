export function getLlmIds(overrides?: {
  llmRequestQueueId?: string;
  llmKeyValueStoreId?: string;
}): { llmRequestQueueId: string; llmKeyValueStoreId: string } {
  // Each crawler run has its own LLM queue/store identified by unique run ID.
  // The run ID is available under APIFY_ACTOR_RUN_ID env var inside Apify platform.
  // On local development, the run ID is set to a timestamp.
  const runId = process.env.APIFY_ACTOR_RUN_ID || `llm-t${Date.now()}`;

  return {
    llmRequestQueueId: overrides?.llmRequestQueueId || runId,
    llmKeyValueStoreId: overrides?.llmKeyValueStoreId || runId,
  };
}
