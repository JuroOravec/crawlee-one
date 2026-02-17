import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';

import { createExtractWithLlmForContext } from './extractWithLlmScoped.js';
import type { CrawleeOneIO } from '../integrations/types.js';

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

      const actor = {
        input: {
          llmApiKey: 'sk-test',
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
          requestQueueId: 'dev-main',
        },
        io,
        log: ctx.log,
      };

      const extractWithLLM = createExtractWithLlmForContext(ctx, actor);

      const result = await extractWithLLM({
        schema: jobSchema,
        systemPrompt: 'Extract job details.',
        text: '<html><body>Job offer</body></html>',
      });

      expect(result).toBeNull();
      expect(kvs.getValue).toHaveBeenCalledWith('llm--req-1', undefined);
      expect(io.openRequestQueue).toHaveBeenCalledWith('llm');
      expect(reqQueue.addRequest).toHaveBeenCalledTimes(1);
      const added = reqQueue.addRequest.mock.calls[0][0];
      expect(added.userData).toMatchObject({
        html: '<html><body>Job offer</body></html>',
        systemPrompt: 'Extract job details.',
        apiKey: 'sk-test',
        provider: 'openai',
        model: 'gpt-4o',
        originalRequestId: 'req-1',
        originalRequestQueueId: 'dev-main',
      });
      expect(added.url).toBe('https://example.com/job/1');
      expect(added.skipNavigation).toBe(true);
    });
  });

  describe('when result IS in key-value store', () => {
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

      const actor = {
        input: {
          llmApiKey: 'sk-test',
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
        },
        io,
        log: ctx.log,
      };

      const extractWithLLM = createExtractWithLlmForContext(ctx, actor);

      const result = await extractWithLLM({
        schema: jobSchema,
        systemPrompt: 'Extract job details.',
      });

      expect(result).toEqual(storedResult);
      expect(kvs.setValue).toHaveBeenCalledWith('llm--req-2', null);
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

      const actor = {
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

      const extractWithLLM = createExtractWithLlmForContext(ctx, actor);

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

      const actor = {
        input: {
          llmApiKey: 'actor-key',
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
        },
        io,
        log: ctx.log,
      };

      const extractWithLLM = createExtractWithLlmForContext(ctx, actor);

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

      const actor = {
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

      const extractWithLLM = createExtractWithLlmForContext(ctx, actor);

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

      const actor = {
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

      const extractWithLLM = createExtractWithLlmForContext(ctx, actor);

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

  describe('when LLM not configured', () => {
    it('throws when apiKey, provider, or model missing', async () => {
      const ctx = {
        request: {
          id: 'req-6',
          uniqueKey: 'key-6',
          url: 'https://example.com/job/6',
          loadedUrl: 'https://example.com/job/6',
        },
        log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
      } as any;

      const actor = {
        input: { llmApiKey: 'sk-x' },
        io: createMockIO(),
        log: ctx.log,
      };

      const extractWithLLM = createExtractWithLlmForContext(ctx, actor);

      await expect(
        extractWithLLM({
          schema: jobSchema,
          systemPrompt: 'Extract.',
        })
      ).rejects.toThrow(/LLM extraction is not configured/);
      expect(ctx.log.error).toHaveBeenCalledWith(
        expect.stringContaining('LLM extraction is not configured')
      );
    });
  });
});
