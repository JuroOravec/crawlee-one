import {
  CheerioCrawlingContext,
  HttpCrawlingContext,
  PlaywrightCrawlingContext,
  type CrawlingContext,
  type Log,
} from 'crawlee';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { z } from 'zod';

import type { CrawleeOneIO } from '../integrations/types.js';
import type { LlmActorInput, RequestActorInput } from '../input.js';
import { addRequestOrReclaim } from '../io/utils.js';
import { getLlmKeyValueStoreId, getLlmRequestQueueId, LLM_KVS_KEY_PREFIX } from './constants.js';

/** Metadata attached to LLM-extracted objects. */
export interface LlmExtractionMeta {
  extractedByLlm: true;
  llmProvider: string;
  llmModel: string;
  extractionMs: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

/** Result returned by scoped extractWithLLM when the result is available. */
export interface ExtractWithLlmScopedResult<T> {
  object: T;
  _extractionMeta?: LlmExtractionMeta;
}

/** Options for the scoped extractWithLLM function. */
export interface ExtractWithLlmScopedOptions<T> {
  /** Zod schema for the expected output. Converted to JSON schema for the LLM queue. */
  schema: z.ZodType<T>;
  /** System prompt describing the extraction task. */
  systemPrompt: string;
  /** Override default text (e.g. ctx.$.html() or $('.my-class').html()). */
  text?: string;
  /** Override actor input */
  apiKey?: string;
  provider?: string;
  model?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  llmRequestQueueId?: string;
  llmKeyValueStoreId?: string;
}

/**
 * Creates a context-bound extractWithLLM function for route handlers.
 *
 * Implements the two-phase flow:
 * - first pass pushes a Request to the LLM Crawler's request queue;
 * - second pass (after LLM crawler runs) reads the result from KVS and returns it.
 *
 * The second pass is triggered when the LLM crawler processes the request, after which
 * it adds the original request back to its queue.
 */
export function createExtractWithLlmForContext(
  ctx: CrawlingContext & { routeLabel?: string },
  actor: {
    input: LlmActorInput | null;
    io: CrawleeOneIO;
    log: Log;
  }
): <T>(opts: ExtractWithLlmScopedOptions<T>) => Promise<ExtractWithLlmScopedResult<T> | null> {
  return async <T>(
    opts: ExtractWithLlmScopedOptions<T>
  ): Promise<ExtractWithLlmScopedResult<T> | null> => {
    const { request, log } = ctx;
    const url = request.loadedUrl || request.url;

    const input = (actor.input ?? {}) as LlmActorInput;
    const apiKey = opts.apiKey ?? input.llmApiKey;
    const provider = opts.provider ?? input.llmProvider;
    const model = opts.model ?? input.llmModel;

    if (!apiKey || !provider || !model) {
      const msg = `LLM extraction is not configured (missing llmApiKey, llmProvider, or llmModel). URL: ${url}`;
      log.error(msg);
      throw new Error(msg);
    }

    const text = opts.text ?? (await getDefaultExtractionText(ctx));

    const llmQueueId = getLlmRequestQueueId({
      llmRequestQueueId: opts.llmRequestQueueId ?? input.llmRequestQueueId,
    });
    const llmStoreId = getLlmKeyValueStoreId({
      llmKeyValueStoreId: opts.llmKeyValueStoreId ?? input.llmKeyValueStoreId,
    });
    const requestId = request.id ?? request.uniqueKey;
    if (!requestId) {
      throw new Error('Request has neither id nor uniqueKey; cannot key LLM result.');
    }
    const kvsKey = `${LLM_KVS_KEY_PREFIX}${requestId}`;

    const store = await actor.io.openKeyValueStore(llmStoreId);
    const existing = await store.getValue(kvsKey, undefined);

    if (existing != null) {
      await store.setValue(kvsKey, null);
      const parsed = existing as ExtractWithLlmScopedResult<T>;
      return parsed;
    }

    const originalRequestQueueId =
      (actor.input as RequestActorInput | undefined)?.requestQueueId ?? 'default';

    const jsonSchema = zodToJsonSchema(opts.schema) as Record<string, unknown>;
    const llmRequest = {
      url: request.url,
      uniqueKey: request.uniqueKey,
      method: request.method ?? 'GET',
      headers: request.headers,
      skipNavigation: true as const,
      userData: {
        html: text,
        jsonSchema,
        systemPrompt: opts.systemPrompt,
        apiKey,
        provider,
        model,
        baseURL: opts.baseURL ?? input.llmBaseUrl,
        headers: opts.headers ?? input.llmHeaders,
        url,
        /** Used by LLM crawler to write result to KVS under llm--{originalRequestId} */
        originalRequestId: requestId,
        /** Used by LLM crawler to add original request back to its queue when done */
        originalRequestQueueId,
      },
    };

    try {
      const llmQueue = await actor.io.openRequestQueue(llmQueueId);
      await addRequestOrReclaim(llmQueue, llmRequest, actor.log);
    } catch (err) {
      const msg = `Failed to re-queue original request to LLM queue ${llmQueueId}: ${err instanceof Error ? err.message : String(err)}`;
      log.error(msg);
      throw new Error(msg, { cause: err });
    }

    return null;
  };
}

/**
 * Get the default text to pass to LLM extraction from the crawling context.
 * Crawler-specific: Cheerio uses $.html(), browser uses page.content(), Http uses body.
 *
 * @throws If no extractable text is found and none can be inferred from context
 */
const getDefaultExtractionText = async (ctx: unknown): Promise<string> => {
  const cheerioCtx = ctx as CheerioCrawlingContext;
  if (cheerioCtx.$) {
    return cheerioCtx.$.html();
  }
  const browserCtx = ctx as PlaywrightCrawlingContext;
  if (browserCtx.page) {
    return browserCtx.page.content();
  }
  const httpCtx = ctx as HttpCrawlingContext;
  if (httpCtx.body) {
    return httpCtx.body as string;
  }
  throw new Error(
    'Cannot infer default extraction text from context. Pass `text` explicitly (e.g. text: ctx.$.html() or text: await ctx.page.content()).'
  );
};
