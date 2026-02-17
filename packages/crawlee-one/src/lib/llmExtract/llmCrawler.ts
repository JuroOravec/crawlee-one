import {
  BasicCrawler,
  KeyValueStore,
  RequestQueue,
  Source,
  type BasicCrawlingContext,
} from 'crawlee';

import { getLlmKeyValueStoreId, getLlmRequestQueueId } from './constants.js';
import { extractWithLlm } from './extractWithLlm.js';
import type { ExtractWithLlmScopedResult } from './extractWithLlmScoped.js';
import { addRequestOrReclaim } from '../io/utils.js';

/** userData shape for requests in the LLM queue. */
export interface LlmQueueRequestUserData {
  html: string;
  jsonSchema: Record<string, unknown>;
  systemPrompt: string;
  apiKey: string;
  provider: string;
  model: string;
  url?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  /** Original request ID for KVS key llm--{originalRequestId} */
  originalRequestId: string;
  /** Original request queue ID; used to add request back when LLM extraction completes */
  originalRequestQueueId?: string;
}

// Subclass BasicCrawler so it appears as `LLMCrawler` in the logs
class LLMCrawler<T extends BasicCrawlingContext> extends BasicCrawler<T> {}

/**
 * BasicCrawler that processes LLM extraction jobs from the LLM request queue.
 * Each request's userData contains html, jsonSchema, systemPrompt, and LLM config.
 * On success, writes the extracted object to the LLM KeyValueStore under llm--{originalRequestId}.
 *
 * When keepAlive is true, the crawler will not resolve run() when the queue is empty;
 * it keeps running until crawler.stop() is called. Used for orchestrator mode where
 * the scraper and LLM worker run concurrently.
 */
export async function createLlmCrawler(options?: {
  requestQueueId?: string;
  keyValueStoreId?: string;
  /** When true, crawler stays alive after queue is empty until stop() is called. */
  keepAlive?: boolean;
}) {
  const queueId = getLlmRequestQueueId({ llmRequestQueueId: options?.requestQueueId });
  const storeId = getLlmKeyValueStoreId({ llmKeyValueStoreId: options?.keyValueStoreId });

  const queue = await RequestQueue.open(queueId);

  const crawler = new LLMCrawler<BasicCrawlingContext>({
    requestQueue: queue,
    keepAlive: options?.keepAlive ?? false,
    requestHandler: async (ctx) => {
      await handleLlmQueueRequest(ctx, { storeId });
    },
  });

  return crawler;
}

/** Request handler used by the LLM crawler. Exported for testing. */
export async function handleLlmQueueRequest(
  ctx: BasicCrawlingContext,
  options: { storeId: string }
): Promise<void> {
  const { request, log } = ctx;
  const userData = request.userData;

  if (!isLlmUserData(userData)) {
    throw new Error(
      `LLM queue request missing required userData (html, jsonSchema, systemPrompt, apiKey, provider, model, originalRequestId). URL: ${request.url}`
    );
  }

  const { html, jsonSchema, systemPrompt, originalRequestId } = userData;

  log.info(`Extracting via LLM (${userData.provider}:${userData.model}) for ${request.url}...`);

  // This is where we actually call the LLM and get the result
  const result = await extractWithLlm({
    html,
    jsonSchema,
    systemPrompt,
    apiKey: userData.apiKey,
    provider: userData.provider,
    model: userData.model,
    url: userData.url,
    baseURL: userData.baseURL,
    headers: userData.headers,
  });

  // Once done, store the result in the KVS, so in the main crawler
  // it can picked up simply by knowing the original request ID.
  const { metadata } = result;
  // e.g. llm--1234567890
  const kvsKey = `llm--${originalRequestId}`;
  const store = await KeyValueStore.open(options.storeId);

  const value = {
    object: result.object,
    _extractionMeta: {
      extractedByLlm: true,
      llmProvider: userData.provider,
      llmModel: userData.model,
      extractionMs: metadata.extractionMs,
      promptTokens: metadata.promptTokens,
      completionTokens: metadata.completionTokens,
      totalTokens: metadata.totalTokens,
    },
  } satisfies ExtractWithLlmScopedResult<unknown>;

  await store.setValue(kvsKey, value);

  log.info(`LLM extraction done for ${request.url}; stored under ${kvsKey}`);

  // Add original request back to its queue so the main crawler can process it again
  // and pick up the result from KVS
  // NOTE: We add the request back to the queue only after LLM Crawler has processed it,
  // because if we reclaimed the request in the same crawler that called `extractWithLLM`,
  // we would end up in an infinite loop.
  const originalRequestQueueId = userData.originalRequestQueueId;
  if (originalRequestQueueId) {
    try {
      const originalQueue = await RequestQueue.open(originalRequestQueueId);
      const newRequest: Source = {
        url: request.url,
        uniqueKey: request.uniqueKey,
      };
      await addRequestOrReclaim(originalQueue, newRequest, log);
    } catch (err) {
      const msg = `Failed to re-queue original request to ${originalRequestQueueId}: ${err instanceof Error ? err.message : String(err)}`;
      log.error(msg);
      throw new Error(msg, { cause: err });
    }
  } else {
    const msg = `originalRequestQueueId missing; cannot re-queue ${request.url}. Ensure requestQueueId is set in actor input for LLM deferral.`;
    log.error(msg);
    throw new Error(msg);
  }
}

function isLlmUserData(u: unknown): u is LlmQueueRequestUserData {
  const d = u as Record<string, unknown>;
  return (
    typeof d?.html === 'string' &&
    d?.jsonSchema != null &&
    typeof d?.systemPrompt === 'string' &&
    typeof d?.apiKey === 'string' &&
    typeof d?.provider === 'string' &&
    typeof d?.model === 'string' &&
    typeof d?.originalRequestId === 'string'
  );
}
