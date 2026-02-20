import { generateText, Output, jsonSchema, NoObjectGeneratedError, type JSONSchema7 } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

/** Options for extraction when using a pre-serialized JSON schema (e.g. from userData in LLM crawler). */
export interface ExtractWithLlmOptions {
  html: string;
  /** JSON schema for the expected output structure */
  jsonSchema: JSONSchema7;
  /** System prompt describing the extraction task */
  systemPrompt: string;
  /** Model ID (e.g. `gpt-4o`, `claude-3-5-sonnet`). */
  model: string;
  /** Provider identifier (e.g. `openai`, `anthropic`). Unknown providers use the OpenAI adapter. */
  provider?: string;
  /** API key for the LLM provider */
  apiKey?: string;
  /** Optional base URL for OpenAI-compatible APIs (e.g. custom endpoint, Azure OpenAI) */
  baseURL?: string;
  /** Custom headers to include in LLM API requests */
  headers?: Record<string, string>;
  /** Page URL (for logging) */
  url?: string;
}

/** Metadata for LLM extraction (timing and optional token usage). */
export interface LlmExtractionMetadata {
  /** Elapsed time in milliseconds for the LLM API call */
  extractionMs: number;
  /** Input (prompt) tokens */
  promptTokens?: number;
  /** Output (completion) tokens */
  completionTokens?: number;
  /** Total tokens */
  totalTokens?: number;
}

/** Result of LLM extraction. */
export interface ExtractWithLlmResult<T> {
  /** Extracted object validated by the schema */
  object: T;
  /** Extraction metadata (timing, token usage) */
  metadata: LlmExtractionMetadata;
}

/**
 * Extract structured data from HTML using an LLM with a JSON schema.
 *
 * Used by the LLM crawler when processing deferred extraction jobs from userData.
 *
 * @example
 * ```ts
 * const { object } = await extractWithLlm({
 *   html: documentHtml,
 *   jsonSchema: jobOfferJsonSchema,
 *   systemPrompt: 'Extract job details from this job posting HTML.',
 *   apiKey: process.env.OPENAI_API_KEY!,
 *   provider: 'openai',
 *   model: 'gpt-4o',
 * });
 * // object, metadata
 * ```
 */
export async function extractWithLlm<T = unknown>(
  opts: ExtractWithLlmOptions
): Promise<ExtractWithLlmResult<T>> {
  const { html, jsonSchema: schemaObj, systemPrompt, apiKey } = opts;
  const provider = opts.provider?.toLowerCase();
  const model = opts.model;

  let languageModel: Parameters<typeof generateText>[0]['model'];

  const openaiSettings = {
    apiKey,
    baseURL: opts.baseURL,
    headers: opts.headers,
  };

  if (provider === 'openai') {
    const openai = createOpenAI(openaiSettings);
    languageModel = openai(model);
  } else if (provider === 'anthropic') {
    const anthropic = createAnthropic({ apiKey });
    languageModel = anthropic(model);
  } else {
    // Unknown provider: use OpenAI adapter (works with OpenAI-compatible APIs via baseURL)
    const openai = createOpenAI({
      ...openaiSettings,
      name: provider,
    });
    languageModel = openai(model);
  }

  const prompt = opts.url ? `Page URL: ${opts.url}\n\n${html}` : html;
  const schema = jsonSchema<T>(schemaObj);

  try {
    const start = performance.now();
    const result = await generateText({
      model: languageModel,
      system: systemPrompt,
      prompt,
      output: Output.object({ schema }),
      // OpenAI strictJsonSchema (default true in v6) requires every property in required.
      // Zod schemas with .default() or optional fields fail. Disable for flexible extraction schemas.
      ...(provider === 'openai' || provider !== 'anthropic'
        ? { providerOptions: { openai: { strictJsonSchema: false } } }
        : {}),
    });
    const extractionMs = performance.now() - start;
    const u = result.usage ?? result.totalUsage;
    const metadata: LlmExtractionMetadata = {
      extractionMs,
      promptTokens: (u as { inputTokens?: number })?.inputTokens,
      completionTokens: (u as { outputTokens?: number })?.outputTokens,
      totalTokens: (u as { totalTokens?: number })?.totalTokens,
    };
    return {
      object: result.output as T,
      metadata,
    };
  } catch (err) {
    if (NoObjectGeneratedError.isInstance(err) && err.text != null) {
      const modelMeta = `${provider}:${model}`;
      console.warn(
        `[extractWithLlm] Schema validation failed (${modelMeta}). Raw LLM output:\n` + err.text
      );
      if (err.cause && err.cause instanceof Error) {
        console.warn(`[extractWithLlm] Validation error (${modelMeta}):`, err.cause.message);
      }
    }
    throw err;
  }
}
