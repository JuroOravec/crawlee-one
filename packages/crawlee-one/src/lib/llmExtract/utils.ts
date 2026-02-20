import type { JSONSchema7 } from 'ai';
import { createHash } from 'node:crypto';

/** Stable hash for extraction IDs. First 12 chars of base64url SHA256. */
export function stableHash(input: string): string {
  const hash = createHash('sha256').update(input).digest('base64').replace(/[+/=]/g, '');
  return hash.length > 12 ? hash.slice(0, 12) : hash;
}

/** Recursively sort object keys for deterministic JSON stringification. */
function sortKeysRecursive(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sortKeysRecursive);
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(obj as Record<string, unknown>).sort()) {
    sorted[key] = sortKeysRecursive((obj as Record<string, unknown>)[key]);
  }
  return sorted;
}

/** Deterministic JSON string for hashing (normalized key order). */
export function canonicalJson(obj: unknown): string {
  return JSON.stringify(sortKeysRecursive(obj));
}

/**
 * Compute a unique extraction ID for scoped extractWithLLM.
 * - Without text: requestId + systemPrompt hash + jsonSchema hash
 * - With text: text hash + systemPrompt hash + jsonSchema hash
 *
 * We use requestId (not text hash) when text is unspecified because the fetched HTML
 * may differ slightly between passes (e.g. timestamps, ads). When parsing the entire
 * page, keying by requestId ensures we can retrieve the result on the second pass
 * even if the HTML changed.
 *
 * Used as KVS key and LLM queue uniqueKey for each extraction.
 */
export function computeExtractionId(opts: {
  requestId: string;
  systemPrompt: string;
  jsonSchema: JSONSchema7;
  text?: string;
}): string {
  const promptHash = stableHash(opts.systemPrompt);
  const schemaHash = stableHash(canonicalJson(opts.jsonSchema));
  const contentPart =
    opts.text != null ? stableHash(opts.text) : opts.requestId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `ext-${contentPart}-${promptHash}-${schemaHash}`;
}

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
