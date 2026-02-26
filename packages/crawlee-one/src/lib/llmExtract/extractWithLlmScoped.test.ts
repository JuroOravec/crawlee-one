import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const mockExtractWithLlm = vi.fn();
vi.mock('./extractWithLlm.js', () => ({
  extractWithLlm: (...args: unknown[]) => mockExtractWithLlm(...args),
}));

import type { CrawleeOneIO } from '../integrations/types.js';
import { createExtractWithLlmForContext } from './extractWithLlmScoped.js';
import { computeExtractionId } from './utils.js';

const jobSchema = z.object({ title: z.string(), salary: z.string().optional() });

function createMockKeyValueStore(initialValue: unknown = undefined) {
  let stored: unknown = initialValue;
  return {
    getValue: vi.fn(async (_key: string, defaultValue?: unknown) => {
      return stored !== undefined ? stored : defaultValue;
    }),
    setValue: vi.fn(async (_key: string, value: unknown) => {
      stored = value;
    }),
    drop: vi.fn(),
    clear: vi.fn(),
  };
}

function createMockRequestQueue() {
  return {
    addRequest: vi.fn().mockResolvedValue({ wasAlreadyHandled: false, requestId: 'mock-req-id' }),
    addRequests: vi.fn(),
    getRequest: vi.fn().mockResolvedValue(null),
    markRequestHandled: vi.fn(),
    fetchNextRequest: vi.fn().mockResolvedValue(null),
    reclaimRequest: vi.fn(),
    isFinished: vi.fn().mockResolvedValue(true),
    drop: vi.fn(),
    clear: vi.fn(),
    handledCount: vi.fn().mockResolvedValue(0),
  };
}

function createMockIO(overrides?: {
  kvs?: ReturnType<typeof createMockKeyValueStore>;
  reqQueue?: ReturnType<typeof createMockRequestQueue>;
}): CrawleeOneIO {
  const kvs = overrides?.kvs ?? createMockKeyValueStore();
  const reqQueue = overrides?.reqQueue ?? createMockRequestQueue();
  return {
    openDataset: vi.fn().mockResolvedValue({
      pushData: vi.fn(),
      getItems: vi.fn().mockResolvedValue([]),
      getItemCount: vi.fn().mockResolvedValue(0),
    }),
    openRequestQueue: vi.fn().mockResolvedValue(reqQueue),
    openKeyValueStore: vi.fn().mockResolvedValue(kvs),
    getInput: vi.fn().mockResolvedValue(null),
    runInContext: vi.fn(),
    triggerDownstreamCrawler: vi.fn(),
    createDefaultProxyConfiguration: vi.fn().mockResolvedValue(undefined),
    isTelemetryEnabled: vi.fn().mockReturnValue(false),
    generateErrorReport: vi.fn().mockResolvedValue({}),
    generateEntryMetadata: vi.fn().mockResolvedValue({}),
  } as any;
}

describe('createExtractWithLlmForContext', () => {
  beforeEach(() => {
    mockExtractWithLlm.mockReset();
  });

  describe('extractWithLLMSync', () => {
    it('calls extractWithLlm directly and returns LlmExtractionResult', async () => {
      mockExtractWithLlm.mockResolvedValue({
        object: { title: 'Sync Job', salary: '90k' },
        metadata: { extractionMs: 150, promptTokens: 100, completionTokens: 50 },
      });

      const io = createMockIO();
      const ctx = {
        request: {
          id: 'req-sync',
          uniqueKey: 'key-sync',
          url: 'https://example.com/sync',
          loadedUrl: 'https://example.com/sync',
          method: 'GET' as const,
          headers: {},
        },
        log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
        $: { html: () => '<html><body>Job</body></html>' },
      } as any;

      const context = {
        input: {
          llmApiKey: 'sk-sync',
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
        },
        io,
        log: ctx.log,
      };

      const { extractWithLLMSync } = createExtractWithLlmForContext({
        ctx,
        context,
        llmRequestQueueId: 'llm-run123',
        llmKeyValueStoreId: 'llm-run123',
      });

      const result = await extractWithLLMSync({
        schema: jobSchema,
        systemPrompt: 'Extract job.',
        text: '<html><body>Job</body></html>',
      });

      expect(result).toEqual({
        object: { title: 'Sync Job', salary: '90k' },
        _extractionMeta: {
          extractedByLlm: true,
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
          extractionMs: 150,
          promptTokens: 100,
          completionTokens: 50,
        },
      });
      expect(mockExtractWithLlm).toHaveBeenCalledTimes(1);
      expect(mockExtractWithLlm).toHaveBeenCalledWith(
        expect.objectContaining({
          html: '<html><body>Job</body></html>',
          systemPrompt: 'Extract job.',
          apiKey: 'sk-sync',
          provider: 'openai',
          model: 'gpt-4o',
        })
      );
    });

    it('uses actor input when opts omit apiKey, provider, model', async () => {
      mockExtractWithLlm.mockResolvedValue({
        object: { title: 'X' },
        metadata: { extractionMs: 1 },
      });

      const io = createMockIO();
      const ctx = {
        request: {
          id: 'r1',
          uniqueKey: 'k1',
          url: 'https://x.com',
          method: 'GET' as const,
          headers: {},
        },
        log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
        $: { html: () => '<html></html>' },
      } as any;

      const { extractWithLLMSync } = createExtractWithLlmForContext({
        ctx,
        context: {
          input: {
            llmApiKey: 'actor-key',
            llmProvider: 'anthropic',
            llmModel: 'claude-3',
          },
          io,
          log: ctx.log,
        },
        llmRequestQueueId: 'llm',
        llmKeyValueStoreId: 'llm',
      });

      await extractWithLLMSync({ schema: jobSchema, systemPrompt: 'Extract.' });

      expect(mockExtractWithLlm).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: 'actor-key',
          provider: 'anthropic',
          model: 'claude-3',
        })
      );
    });

    it('throws when LLM not configured', async () => {
      const io = createMockIO();
      const ctx = {
        request: {
          id: 'r1',
          uniqueKey: 'k1',
          url: 'https://x.com',
          method: 'GET' as const,
          headers: {},
        },
        log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
        $: { html: () => '<html></html>' },
      } as any;

      const { extractWithLLMSync } = createExtractWithLlmForContext({
        ctx,
        context: { input: null, io, log: ctx.log },
        llmRequestQueueId: 'llm',
        llmKeyValueStoreId: 'llm',
      });

      await expect(
        extractWithLLMSync({ schema: jobSchema, systemPrompt: 'Extract.' })
      ).rejects.toThrow('LLM not configured');
      expect(mockExtractWithLlm).not.toHaveBeenCalled();
    });
  });

  describe('when result is NOT in key-value store', () => {
    it('pushes request to LLM queue and returns null', async () => {
      const kvs = createMockKeyValueStore(undefined);
      const reqQueue = createMockRequestQueue();
      const io = createMockIO({ kvs, reqQueue });

      const ctx = {
        request: {
          id: 'req-1',
          uniqueKey: 'key-1',
          url: 'https://example.com/job/1',
          loadedUrl: 'https://example.com/job/1',
          method: 'GET' as const,
          headers: {},
        },
        log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
      } as any;

      const context = {
        input: {
          llmApiKey: 'sk-test',
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
          requestQueueId: 'dev-main',
        },
        io,
        log: ctx.log,
      };

      const { extractWithLLM } = createExtractWithLlmForContext({
        ctx,
        context,
        llmRequestQueueId: 'llm-run123',
        llmKeyValueStoreId: 'llm-run123',
      });

      const result = await extractWithLLM({
        schema: jobSchema,
        systemPrompt: 'Extract job details.',
        text: '<html><body>Job offer</body></html>',
      });

      expect(result).toBeNull();
      const jsonSchema = zodToJsonSchema(jobSchema) as Record<string, unknown>;
      const expectedExtractionId = computeExtractionId({
        requestId: 'req-1',
        systemPrompt: 'Extract job details.',
        jsonSchema,
        text: '<html><body>Job offer</body></html>',
      });
      expect(kvs.getValue).toHaveBeenCalledWith(expectedExtractionId, null);
      expect(io.openRequestQueue).toHaveBeenCalledWith('llm-run123');
      expect(reqQueue.addRequest).toHaveBeenCalledTimes(1);
      const added = reqQueue.addRequest.mock.calls[0][0];
      expect(added.uniqueKey).toBe(expectedExtractionId);
      expect(added.userData).toMatchObject({
        html: '<html><body>Job offer</body></html>',
        systemPrompt: 'Extract job details.',
        apiKey: 'sk-test',
        provider: 'openai',
        model: 'gpt-4o',
        extractionId: expectedExtractionId,
        originalRequestUniqueKey: 'key-1',
        originalRequestQueueId: 'dev-main',
      });
      expect(added.url).toBe('https://example.com/job/1');
      expect(added.skipNavigation).toBe(true);
    });
  });

  describe('when result IS in key-value store', () => {
    it('when stored value is _extractionError, rethrows', async () => {
      const storedError = {
        _extractionError: {
          message: 'LLM API rate limit exceeded',
          name: 'Error',
        },
      };
      const kvs = createMockKeyValueStore(storedError);
      const reqQueue = createMockRequestQueue();
      const io = createMockIO({ kvs, reqQueue });

      const ctx = {
        request: {
          id: 'req-error',
          uniqueKey: 'key-error',
          url: 'https://example.com/job/error',
          loadedUrl: 'https://example.com/job/error',
          method: 'GET' as const,
          headers: {},
        },
        log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
        $: { html: () => '<html></html>' },
      } as any;

      const context = {
        input: {
          llmApiKey: 'sk-test',
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
        },
        io,
        log: ctx.log,
      };

      const { extractWithLLM } = createExtractWithLlmForContext({
        ctx,
        context,
        llmRequestQueueId: 'llm-run123',
        llmKeyValueStoreId: 'llm-run123',
      });

      await expect(extractWithLLM({ schema: jobSchema, systemPrompt: 'Extract.' })).rejects.toThrow(
        'LLM API rate limit exceeded'
      );
      const extractionId = computeExtractionId({
        requestId: 'req-error',
        systemPrompt: 'Extract.',
        jsonSchema: zodToJsonSchema(jobSchema) as Record<string, unknown>,
      });
      expect(kvs.setValue).toHaveBeenCalledWith(extractionId, null);
      expect(reqQueue.addRequests).not.toHaveBeenCalled();
    });

    it('pops value from store and returns it', async () => {
      const storedResult = {
        object: { title: 'Software Engineer', salary: '100k' },
        _extractionMeta: {
          extractedByLlm: true as const,
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
          extractionMs: 500,
        },
      };
      const kvs = createMockKeyValueStore(storedResult);
      const reqQueue = createMockRequestQueue();
      const io = createMockIO({ kvs, reqQueue });

      const ctx = {
        request: {
          id: 'req-2',
          uniqueKey: 'key-2',
          url: 'https://example.com/job/2',
          loadedUrl: 'https://example.com/job/2',
          method: 'GET' as const,
          headers: {},
        },
        log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
        $: { html: () => '<html></html>' },
      } as any;

      const context = {
        input: {
          llmApiKey: 'sk-test',
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
        },
        io,
        log: ctx.log,
      };

      const { extractWithLLM } = createExtractWithLlmForContext({
        ctx,
        context,
        llmRequestQueueId: 'llm-run123',
        llmKeyValueStoreId: 'llm-run123',
      });

      const result = await extractWithLLM({
        schema: jobSchema,
        systemPrompt: 'Extract job details.',
      });

      expect(result).toEqual(storedResult);
      const extractionId = computeExtractionId({
        requestId: 'req-2',
        systemPrompt: 'Extract job details.',
        jsonSchema: zodToJsonSchema(jobSchema) as Record<string, unknown>,
      });
      expect(kvs.setValue).toHaveBeenCalledWith(extractionId, null);
      expect(reqQueue.addRequests).not.toHaveBeenCalled();
    });
  });

  describe('actor input settings flow through', () => {
    it('passes llmApiKey, llmProvider, llmModel from actor input to pushed request', async () => {
      const kvs = createMockKeyValueStore(undefined);
      const reqQueue = createMockRequestQueue();
      const io = createMockIO({ kvs, reqQueue });

      const ctx = {
        request: {
          id: 'req-3',
          uniqueKey: 'key-3',
          url: 'https://example.com/job/3',
          loadedUrl: 'https://example.com/job/3',
          method: 'GET' as const,
          headers: {},
        },
        log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
        $: { html: () => '<html></html>' },
      } as any;

      const context = {
        input: {
          llmApiKey: 'actor-key',
          llmProvider: 'anthropic',
          llmModel: 'claude-3-5-sonnet',
          llmBaseUrl: 'https://custom.endpoint',
          llmHeaders: { 'X-Custom': 'value' },
        },
        io,
        log: ctx.log,
      };

      const { extractWithLLM } = createExtractWithLlmForContext({
        ctx,
        context,
        llmRequestQueueId: 'llm-run123',
        llmKeyValueStoreId: 'llm-run123',
      });

      expect(await extractWithLLM({ schema: jobSchema, systemPrompt: 'Extract.' })).toBeNull();

      const added = reqQueue.addRequest.mock.calls[0][0];
      expect(added.userData).toMatchObject({
        apiKey: 'actor-key',
        provider: 'anthropic',
        model: 'claude-3-5-sonnet',
        baseURL: 'https://custom.endpoint',
        headers: { 'X-Custom': 'value' },
      });
    });
  });

  describe('opts override actor input', () => {
    it('opts.apiKey, opts.provider, opts.model override actor input', async () => {
      const kvs = createMockKeyValueStore(undefined);
      const reqQueue = createMockRequestQueue();
      const io = createMockIO({ kvs, reqQueue });

      const ctx = {
        request: {
          id: 'req-4',
          uniqueKey: 'key-4',
          url: 'https://example.com/job/4',
          loadedUrl: 'https://example.com/job/4',
          method: 'GET' as const,
          headers: {},
        },
        log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
        $: { html: () => '<html></html>' },
      } as any;

      const context = {
        input: {
          llmApiKey: 'actor-key',
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
        },
        io,
        log: ctx.log,
      };

      const { extractWithLLM } = createExtractWithLlmForContext({
        ctx,
        context,
        llmRequestQueueId: 'llm-run123',
        llmKeyValueStoreId: 'llm-run123',
      });

      const result = await extractWithLLM({
        schema: jobSchema,
        systemPrompt: 'Extract.',
        apiKey: 'override-key',
        provider: 'anthropic',
        model: 'claude-3-opus',
      });

      expect(result).toBeNull();
      const added = reqQueue.addRequest.mock.calls[0][0];
      expect(added.userData).toMatchObject({
        apiKey: 'override-key',
        provider: 'anthropic',
        model: 'claude-3-opus',
      });
    });

    it('opts.llmRequestQueueId and opts.llmKeyValueStoreId override actor input', async () => {
      const kvs = createMockKeyValueStore(undefined);
      const reqQueue = createMockRequestQueue();
      const io = createMockIO({ kvs, reqQueue });

      const ctx = {
        request: {
          id: 'req-queue-override',
          uniqueKey: 'key-queue',
          url: 'https://example.com/job',
          loadedUrl: 'https://example.com/job',
          method: 'GET' as const,
          headers: {},
        },
        log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
        $: { html: () => '<html></html>' },
      } as any;

      const context = {
        input: {
          llmApiKey: 'sk-x',
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
          llmRequestQueueId: 'actor-queue',
          llmKeyValueStoreId: 'actor-store',
        },
        io,
        log: ctx.log,
      };

      const { extractWithLLM } = createExtractWithLlmForContext({
        ctx,
        context,
        llmRequestQueueId: 'base-queue',
        llmKeyValueStoreId: 'base-store',
      });

      expect(
        await extractWithLLM({
          schema: jobSchema,
          systemPrompt: 'Extract.',
          llmRequestQueueId: 'override-queue',
          llmKeyValueStoreId: 'override-store',
        })
      ).toBeNull();

      expect(io.openRequestQueue).toHaveBeenCalledWith('override-queue');
      expect(io.openKeyValueStore).toHaveBeenCalledWith('override-store');
    });

    it('opts.baseURL and opts.headers override actor input', async () => {
      const kvs = createMockKeyValueStore(undefined);
      const reqQueue = createMockRequestQueue();
      const io = createMockIO({ kvs, reqQueue });

      const ctx = {
        request: {
          id: 'req-5',
          uniqueKey: 'key-5',
          url: 'https://example.com/job/5',
          loadedUrl: 'https://example.com/job/5',
          method: 'GET' as const,
          headers: {},
        },
        log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
        $: { html: () => '<html></html>' },
      } as any;

      const context = {
        input: {
          llmApiKey: 'sk-x',
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
          llmBaseUrl: 'https://actor-base.com',
          llmHeaders: { 'Actor-Header': 'actor' },
        },
        io,
        log: ctx.log,
      };

      const { extractWithLLM } = createExtractWithLlmForContext({
        ctx,
        context,
        llmRequestQueueId: 'llm-run123',
        llmKeyValueStoreId: 'llm-run123',
      });

      expect(
        await extractWithLLM({
          schema: jobSchema,
          systemPrompt: 'Extract.',
          baseURL: 'https://override-base.com',
          headers: { 'Override-Header': 'override' },
        })
      ).toBeNull();

      const added = reqQueue.addRequest.mock.calls[0][0];
      expect(added.userData.baseURL).toBe('https://override-base.com');
      expect(added.userData.headers).toEqual({ 'Override-Header': 'override' });
    });
  });

  describe('extractionId override', () => {
    it('uses opts.extractionId when provided', async () => {
      const storedResult = {
        object: { title: 'Custom' },
        _extractionMeta: {
          extractedByLlm: true as const,
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
          extractionMs: 100,
        },
      };
      const kvs = createMockKeyValueStore(undefined);
      (kvs.getValue as ReturnType<typeof vi.fn>).mockImplementation(async (key: string) =>
        key === 'my-custom-id' ? storedResult : undefined
      );
      const reqQueue = createMockRequestQueue();
      const io = createMockIO({ kvs, reqQueue });

      const ctx = {
        request: {
          id: 'req-1',
          uniqueKey: 'key-1',
          url: 'https://example.com/job',
          loadedUrl: 'https://example.com/job',
          method: 'GET' as const,
          headers: {},
        },
        log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
        $: { html: () => '<html></html>' },
      } as any;

      const context = {
        input: {
          llmApiKey: 'sk-test',
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
          requestQueueId: 'dev-main',
        },
        io,
        log: ctx.log,
      };

      const { extractWithLLM } = createExtractWithLlmForContext({
        ctx,
        context,
        llmRequestQueueId: 'llm-run123',
        llmKeyValueStoreId: 'llm-run123',
      });

      const result = await extractWithLLM({
        schema: jobSchema,
        systemPrompt: 'Extract.',
        extractionId: 'my-custom-id',
      });

      expect(result).toEqual(storedResult);
      expect(kvs.getValue).toHaveBeenCalledWith('my-custom-id', null);
    });

    it('pushes LLM request with opts.extractionId as uniqueKey and userData.extractionId', async () => {
      const kvs = createMockKeyValueStore(undefined);
      const reqQueue = createMockRequestQueue();
      const io = createMockIO({ kvs, reqQueue });

      const ctx = {
        request: {
          id: 'req-x',
          uniqueKey: 'key-x',
          url: 'https://example.com/page',
          loadedUrl: 'https://example.com/page',
          method: 'GET' as const,
          headers: {},
        },
        log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
        $: { html: () => '<html></html>' },
      } as any;

      const context = {
        input: {
          llmApiKey: 'sk-x',
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
          requestQueueId: 'main',
        },
        io,
        log: ctx.log,
      };

      const { extractWithLLM } = createExtractWithLlmForContext({
        ctx,
        context,
        llmRequestQueueId: 'llm-run123',
        llmKeyValueStoreId: 'llm-run123',
      });

      expect(
        await extractWithLLM({
          schema: jobSchema,
          systemPrompt: 'Extract.',
          extractionId: 'explicit-extraction-key',
        })
      ).toBeNull();

      const added = reqQueue.addRequest.mock.calls[0][0];
      expect(added.uniqueKey).toBe('explicit-extraction-key');
      expect(added.userData.extractionId).toBe('explicit-extraction-key');
    });
  });

  describe('multi-extraction per request', () => {
    it('allows multiple extractWithLLM calls with different extractionIds', async () => {
      const headerResult = {
        object: { title: 'Header' },
        _extractionMeta: {
          extractedByLlm: true as const,
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
          extractionMs: 100,
        },
      };
      const bodyResult = {
        object: { content: 'Body text' },
        _extractionMeta: {
          extractedByLlm: true as const,
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
          extractionMs: 200,
        },
      };

      const headerSchema = z.object({ title: z.string() });
      const bodySchema = z.object({ content: z.string() });
      const headerExtractionId = computeExtractionId({
        requestId: 'req-multi',
        systemPrompt: 'Extract header.',
        jsonSchema: zodToJsonSchema(headerSchema) as Record<string, unknown>,
        text: '<header>Header</header>',
      });
      const bodyExtractionId = computeExtractionId({
        requestId: 'req-multi',
        systemPrompt: 'Extract body.',
        jsonSchema: zodToJsonSchema(bodySchema) as Record<string, unknown>,
        text: '<body>Body text</body>',
      });

      const kvs = createMockKeyValueStore(undefined);
      (kvs.getValue as ReturnType<typeof vi.fn>).mockImplementation(async (key: string) => {
        if (key === headerExtractionId) return headerResult;
        if (key === bodyExtractionId) return bodyResult;
        return undefined;
      });
      const reqQueue = createMockRequestQueue();
      const io = createMockIO({ kvs, reqQueue });

      const ctx = {
        request: {
          id: 'req-multi',
          uniqueKey: 'key-multi',
          url: 'https://example.com/page',
          loadedUrl: 'https://example.com/page',
          method: 'GET' as const,
          headers: {},
        },
        log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
        $: { html: () => '<html></html>' },
      } as any;

      const context = {
        input: {
          llmApiKey: 'sk-test',
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
          requestQueueId: 'dev-main',
        },
        io,
        log: ctx.log,
      };

      const { extractWithLLM } = createExtractWithLlmForContext({
        ctx,
        context,
        llmRequestQueueId: 'llm-run123',
        llmKeyValueStoreId: 'llm-run123',
      });

      const r1 = await extractWithLLM({
        schema: headerSchema,
        systemPrompt: 'Extract header.',
        text: '<header>Header</header>',
      });
      const r2 = await extractWithLLM({
        schema: bodySchema,
        systemPrompt: 'Extract body.',
        text: '<body>Body text</body>',
      });

      expect(r1).toEqual(headerResult);
      expect(r2).toEqual(bodyResult);
      expect(kvs.getValue).toHaveBeenCalledWith(headerExtractionId, null);
      expect(kvs.getValue).toHaveBeenCalledWith(bodyExtractionId, null);
    });
  });
});
