import type { JSONSchema7 } from 'ai';
import {
  type CheerioCrawlingContext,
  type CrawlingContext,
  type HttpCrawlingContext,
  type Log,
  type PlaywrightCrawlingContext,
  type Source,
} from 'crawlee';
import type { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import type { LlmActorInput, RequestActorInput } from '../input.js';
import type { CrawleeOneIO } from '../integrations/types.js';
import { addRequestOrReclaim } from '../io/utils.js';
import { extractWithLlm, type ExtractWithLlmOptions } from './extractWithLlm.js';
import type { LlmQueueRequestUserData } from './llmCrawler.js';
import { computeExtractionId } from './utils.js';

/**
 * In-memory cache for results popped from KVS.
 *
 * When we read a result from KVS, we pop it (delete the key) to avoid unbounded KVS
 * growth across many pages. We then store the result here so it remains available for
 * the current handler run (e.g. multi-extraction) or if the same request is retried
 * after a failure (e.g. pushData throws, request reclaimed). We do not delete on read
 * — multiple accesses to the same extractionId must be expected.
 *
 * The cache is LRU-bounded (max 500 entries) so process memory stays bounded; worst
 * case only the current actor process grows, not the shared KVS.
 */
const LLM_EXTRACTION_CACHE_MAX = 500;
const llmExtractionCache = new Map<string, LlmExtractionResult<unknown> | LlmExtractionError>();

function evictFromCacheIfNeeded(): void {
  if (llmExtractionCache.size > LLM_EXTRACTION_CACHE_MAX) {
    const firstKey = llmExtractionCache.keys().next().value;
    if (firstKey != null) llmExtractionCache.delete(firstKey);
  }
}

/** Metadata attached to LLM-extracted objects. */
export interface LlmExtractionMeta {
  extractedByLlm: true;
  llmModel: string;
  llmProvider?: string;
  extractionMs: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

/** Result returned by scoped extractWithLLM when the result is available. */
export interface LlmExtractionResult<T> {
  object: T;
  _extractionMeta?: LlmExtractionMeta;
}

/**
 * Error payload stored in KVS when LLM extraction fails.
 * Scoped extractWithLLM rethrows on second pass.
 */
export interface LlmExtractionError {
  _extractionError: {
    message: string;
    name?: string;
    /** Serialized cause message when original error had a cause */
    causeMessage?: string;
  };
}

function isLlmExtractionError(value: unknown): value is LlmExtractionError {
  const err = (value as LlmExtractionError)?._extractionError;
  return typeof err === 'object' && err != null && typeof err.message === 'string';
}

/** Options for the scoped extractWithLlmSync function. */
export interface ExtractWithLlmSyncOptions<T>
  extends
    Pick<ExtractWithLlmOptions, 'systemPrompt' | 'baseURL' | 'headers'>,
    Partial<Pick<ExtractWithLlmOptions, 'apiKey' | 'provider' | 'model'>> {
  /** Zod schema for the expected output. Converted to JSON schema for the LLM. */
  schema: z.ZodType<T>;
  /** Override default text (e.g. ctx.$.html() or $('.my-class').html()). */
  text?: string;
}

/** Options for the async (deferred) extractWithLLM function. */
export interface ExtractWithLlmAsyncOptions<T> extends ExtractWithLlmSyncOptions<T> {
  llmRequestQueueId?: string;
  llmKeyValueStoreId?: string;
  /**
   * Override the extraction ID (KVS key and LLM queue uniqueKey).
   * When set, skips computed ID. Use as an escape hatch when you need explicit control.
   */
  extractionId?: string;
}

/**
 * Creates context-bound extractWithLLM and extractWithLLMSync for route handlers.
 *
 * extractWithLLMSync calls the LLM directly (no queue/KVS). Use when blocking is acceptable.
 *
 * extractWithLLM implements the two-phase flow:
 * - first pass pushes a Request to the LLM Crawler's request queue;
 * - second pass (after LLM crawler runs) reads the result from KVS and returns it.
 *
 * The second pass is triggered when the LLM crawler processes the request, after which
 * it adds the original request back to its queue.
 *
 * Supports multiple extractions per request: call extractWithLLM multiple times with
 * different text, systemPrompt, or schema. Each gets its own KVS key (extractionId) and
 * LLM queue entry. Use this to extract different parts of the page (e.g. header vs body)
 * for cheaper models that work well on smaller HTML snippets.
 */
export function createExtractWithLlmForContext(outerOpts: {
  ctx: CrawlingContext & { routeLabel?: string };
  context: {
    input: LlmActorInput | null;
    io: CrawleeOneIO;
    log: Log;
  };
  llmRequestQueueId: string;
  llmKeyValueStoreId: string;
}): {
  extractWithLLM: <T>(
    opts: ExtractWithLlmAsyncOptions<T>
  ) => Promise<LlmExtractionResult<T> | null>;
  extractWithLLMSync: <T>(opts: ExtractWithLlmSyncOptions<T>) => Promise<LlmExtractionResult<T>>;
} {
  const { ctx, context, llmRequestQueueId, llmKeyValueStoreId } = outerOpts;

  const extractWithLLM = async <T>(
    opts: ExtractWithLlmAsyncOptions<T>
  ): Promise<LlmExtractionResult<T> | null> => {
    const { request, log } = ctx;

    const llmQueueId = opts.llmRequestQueueId ?? llmRequestQueueId;
    const llmStoreId = opts.llmKeyValueStoreId ?? llmKeyValueStoreId;
    const requestId = request.id ?? request.uniqueKey;
    if (!requestId) {
      throw new Error('Request has neither id nor uniqueKey; cannot key LLM result.');
    }

    const prepared = await prepareExtractWithLlmInput(ctx, context, opts);
    const extractionId =
      opts.extractionId ??
      computeExtractionId({
        requestId,
        systemPrompt: opts.systemPrompt,
        jsonSchema: prepared.jsonSchema,
        // If the text was not provided, and instead we extracted the HTML from the context
        // then we use the requestId as the content part of the extractionId.
        text: opts.text != null ? prepared.html : undefined,
      });

    // Check in-memory cache first (results popped from KVS are stored here).
    const cached = llmExtractionCache.get(extractionId);
    if (cached) {
      if (isLlmExtractionError(cached)) {
        const { message, name, causeMessage } = cached._extractionError;
        const err = new Error(message, {
          cause: causeMessage ? new Error(causeMessage) : undefined,
        });
        if (name) err.name = name;
        throw err;
      }
      return cached as LlmExtractionResult<T>;
    }

    // Check KVS (phase 2 - result written by LLM crawler).
    const store = await context.io.openKeyValueStore(llmStoreId);
    const existing = await store.getValue<LlmExtractionResult<T> | LlmExtractionError | null>(
      extractionId,
      null
    );

    // Process result if it exists. The result was set on the key-value store by the LLM crawler.
    if (existing) {
      await store.setValue(extractionId, null); // Pop from KVS
      evictFromCacheIfNeeded();
      llmExtractionCache.set(extractionId, existing); // Store in memory for same handler run
      if (isLlmExtractionError(existing)) {
        // We got back error! Rethrow it, so the error shows up for this crawler.
        const { message, name, causeMessage } = existing._extractionError;
        const err = new Error(message, {
          cause: causeMessage ? new Error(causeMessage) : undefined,
        });
        if (name) err.name = name;
        throw err;
      }
      // We successfully got back the result!
      return existing;
    }

    // We're in phase 1 - result is not in key-value store yet.
    // Push a job to the LLM request queue and return `null`.
    // After the user returns `null` from the route handler,
    // the original request will be marked handled and **not** reinserted
    // into the queue for processing (reclaimed).
    // This is desired and intended - if we reclaimed the request NOW,
    // we would end up in an infinite loop - the same URL would be reclaimed
    // and reprocessed before the LLM queue completes.

    const originalRequestQueueId =
      (context.input as RequestActorInput | undefined)?.requestQueueId ?? 'default';

    const llmRequest = {
      url: request.url,
      uniqueKey: extractionId,
      method: request.method ?? 'GET',
      headers: request.headers,
      skipNavigation: true as const,
      userData: {
        ...prepared,
        jsonSchema: prepared.jsonSchema,
        url: prepared.url,
        extractionId,
        originalRequestUniqueKey: request.uniqueKey,
        originalRequestQueueId,
      } satisfies LlmQueueRequestUserData,
    } satisfies Source;

    try {
      const llmQueue = await context.io.openRequestQueue(llmQueueId);
      await addRequestOrReclaim({
        queue: llmQueue,
        request: llmRequest,
        log: context.log,
      });
    } catch (err) {
      const msg = `Failed to re-queue original request to LLM queue ${llmQueueId}: ${err instanceof Error ? err.message : String(err)}`;
      log.error(msg);
      throw new Error(msg, { cause: err });
    }

    return null;
  };

  const extractWithLLMSync = async <T>(
    opts: ExtractWithLlmSyncOptions<T>
  ): Promise<LlmExtractionResult<T>> => {
    const prepared = await prepareExtractWithLlmInput(ctx, context, opts);
    const extractOpts: ExtractWithLlmOptions = {
      html: prepared.html,
      jsonSchema: prepared.jsonSchema as JSONSchema7,
      systemPrompt: prepared.systemPrompt,
      apiKey: prepared.apiKey,
      provider: prepared.provider,
      model: prepared.model,
      url: prepared.url,
      baseURL: prepared.baseURL,
      headers: prepared.headers,
    };
    const result = await extractWithLlm<T>(extractOpts);
    return {
      object: result.object,
      _extractionMeta: {
        extractedByLlm: true,
        llmProvider: prepared.provider,
        llmModel: prepared.model,
        extractionMs: result.metadata.extractionMs,
        promptTokens: result.metadata.promptTokens,
        completionTokens: result.metadata.completionTokens,
        totalTokens: result.metadata.totalTokens,
      },
    };
  };

  return { extractWithLLM, extractWithLLMSync };
}

/**
 * Prepare opts for extractWithLlm. Resolves text, jsonSchema, and LLM config from
 * common options with actor input fallbacks. Shared by extractWithLLM and extractWithLLMSync.
 */
async function prepareExtractWithLlmInput<T>(
  ctx: CrawlingContext & { routeLabel?: string },
  context: { input: LlmActorInput | null },
  opts: ExtractWithLlmSyncOptions<T>
): Promise<ExtractWithLlmOptions> {
  const text = opts.text ?? (await getDefaultExtractionText(ctx));
  const request = (ctx as { request?: { loadedUrl?: string; url?: string } }).request;
  const url = request?.loadedUrl ?? request?.url;
  const apiKey = opts.apiKey ?? context.input?.llmApiKey;
  const provider = opts.provider ?? context.input?.llmProvider;
  const model = opts.model ?? context.input?.llmModel;

  if (!model) {
    throw new Error('model is required for the LLM API call to work');
  }

  return {
    html: text,
    jsonSchema: zodToJsonSchema(opts.schema) as Record<string, unknown>,
    systemPrompt: opts.systemPrompt,
    apiKey,
    provider,
    model,
    url,
    baseURL: opts.baseURL ?? context.input?.llmBaseUrl,
    headers: opts.headers ?? context.input?.llmHeaders,
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
