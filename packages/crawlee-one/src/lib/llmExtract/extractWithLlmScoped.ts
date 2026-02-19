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
export function createExtractWithLlmForContext(outerOpts: {
  ctx: CrawlingContext & { routeLabel?: string };
  context: {
    input: LlmActorInput | null;
    io: CrawleeOneIO;
    log: Log;
  };
  llmRequestQueueId: string;
  llmKeyValueStoreId: string;
}): <T>(opts: ExtractWithLlmScopedOptions<T>) => Promise<LlmExtractionResult<T> | null> {
  const { ctx, context, llmRequestQueueId, llmKeyValueStoreId } = outerOpts;

  return async <T>(
    opts: ExtractWithLlmScopedOptions<T>
  ): Promise<LlmExtractionResult<T> | null> => {
    const { request, log } = ctx;

    // Check if we're in phase 2 - result is already in key-value store.
    // If yes, `extractWithLLM` was called before to trigger the LLM job
    // and now we got back the results.
    const llmQueueId = opts.llmRequestQueueId ?? llmRequestQueueId;
    const llmStoreId = opts.llmKeyValueStoreId ?? llmKeyValueStoreId;
    const requestId = request.id ?? request.uniqueKey;
    if (!requestId) {
      throw new Error('Request has neither id nor uniqueKey; cannot key LLM result.');
    }

    const store = await context.io.openKeyValueStore(llmStoreId);
    const existing = await store.getValue<LlmExtractionResult<T> | LlmExtractionError | null>(
      requestId,
      null
    );

    // Process result if it exists. The result was set on the key-value store by the LLM crawler.
    if (existing) {
      await store.setValue(requestId, null);
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

    const url = request.loadedUrl || request.url;
    const text = opts.text ?? (await getDefaultExtractionText(ctx));
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
        apiKey: opts.apiKey ?? context.input?.llmApiKey,
        provider: opts.provider ?? context.input?.llmProvider,
        model: opts.model ?? context.input?.llmModel,
        baseURL: opts.baseURL ?? context.input?.llmBaseUrl,
        headers: opts.headers ?? context.input?.llmHeaders,
        url,
        /** Used by LLM crawler to write result to KVS under the ID of the original request */
        originalRequestId: requestId,
        /** Used by LLM crawler to add original request back to its queue when done */
        originalRequestQueueId,
      },
    };

    try {
      const llmQueue = await context.io.openRequestQueue(llmQueueId);
      await addRequestOrReclaim(llmQueue, llmRequest, context.log);
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
