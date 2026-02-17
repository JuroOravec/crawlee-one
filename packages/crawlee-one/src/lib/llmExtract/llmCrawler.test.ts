import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { KeyValueStore, RequestQueue } from 'crawlee';

const mockExtractWithLlm = vi.fn();

vi.mock('./extractWithLlm.js', () => ({
  extractWithLlm: (...args: unknown[]) => mockExtractWithLlm(...args),
}));

import { handleLlmQueueRequest } from './llmCrawler.js';
import type { LlmQueueRequestUserData } from './llmCrawler.js';

describe('handleLlmQueueRequest (LLM crawler handler)', () => {
  let storageDir: string;
  const originalEnv = process.env.APIFY_LOCAL_STORAGE_DIR;

  beforeEach(() => {
    storageDir = mkdtempSync(path.join(tmpdir(), 'llm-crawler-test-'));
    process.env.APIFY_LOCAL_STORAGE_DIR = storageDir;
    mockExtractWithLlm.mockReset();
    mockExtractWithLlm.mockResolvedValue({
      object: { title: 'Extracted Job', salary: '80k' },
      metadata: { extractionMs: 123 },
    });
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.APIFY_LOCAL_STORAGE_DIR = originalEnv;
    } else {
      delete process.env.APIFY_LOCAL_STORAGE_DIR;
    }
  });

  it('calls extractWithLlm (generateText + Output.object) with userData and writes to KVS', async () => {
    const userData: LlmQueueRequestUserData = {
      html: '<html><body>Job offer</body></html>',
      jsonSchema: {
        type: 'object',
        properties: { title: { type: 'string' }, salary: { type: 'string' } },
        required: ['title'],
      },
      systemPrompt: 'Extract job details.',
      apiKey: 'sk-test',
      provider: 'openai',
      model: 'gpt-4o',
      originalRequestId: 'orig-req-1',
      originalRequestQueueId: 'dev-main',
    };

    const ctx = {
      request: {
        url: 'https://example.com/job/1',
        uniqueKey: 'llm-job-1',
        userData,
      },
      log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
    } as any;

    const storeId = `llm-store-${Date.now()}`;
    await handleLlmQueueRequest(ctx, { storeId });

    expect(mockExtractWithLlm).toHaveBeenCalledTimes(1);
    expect(mockExtractWithLlm).toHaveBeenCalledWith(
      expect.objectContaining({
        html: '<html><body>Job offer</body></html>',
        jsonSchema: userData.jsonSchema,
        systemPrompt: 'Extract job details.',
        apiKey: 'sk-test',
        provider: 'openai',
        model: 'gpt-4o',
      })
    );

    const store = await KeyValueStore.open(storeId);
    const stored = await store.getValue('llm--orig-req-1', undefined);
    expect(stored).toEqual(
      expect.objectContaining({
        object: { title: 'Extracted Job', salary: '80k' },
        _extractionMeta: expect.objectContaining({
          extractedByLlm: true,
          llmProvider: 'openai',
          llmModel: 'gpt-4o',
          extractionMs: 123,
        }),
      })
    );

    // Re-queues original request to original queue (so main crawler can pick it up again)
    const origQueue = await RequestQueue.open('dev-main');
    const reclaimedReq = await origQueue.fetchNextRequest();
    expect(reclaimedReq).toBeDefined();
  });

  it('passes baseURL and headers from userData to extractWithLlm', async () => {
    const userData: LlmQueueRequestUserData = {
      html: '<html></html>',
      jsonSchema: { type: 'object', properties: {} },
      systemPrompt: 'Extract.',
      apiKey: 'sk-x',
      provider: 'openai',
      model: 'gpt-4o',
      originalRequestId: 'orig-2',
      originalRequestQueueId: 'dev-main',
      baseURL: 'https://custom.openai.com/v1',
      headers: { 'X-Custom': 'value' },
    };

    const ctx = {
      request: {
        url: 'https://example.com/job/2',
        uniqueKey: 'llm-job-2',
        userData,
      },
      log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
    } as any;

    const storeId = `llm-store-${Date.now()}`;
    await handleLlmQueueRequest(ctx, { storeId });

    expect(mockExtractWithLlm).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://custom.openai.com/v1',
        headers: { 'X-Custom': 'value' },
      })
    );
  });

  it('throws when originalRequestQueueId is missing', async () => {
    const userData: LlmQueueRequestUserData = {
      html: '<html></html>',
      jsonSchema: { type: 'object', properties: {} },
      systemPrompt: 'Extract.',
      apiKey: 'sk-x',
      provider: 'openai',
      model: 'gpt-4o',
      originalRequestId: 'orig-missing-queue',
      // no originalRequestQueueId
    };

    const ctx = {
      request: { url: 'https://example.com/job/x', userData },
      log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
    } as any;

    await expect(
      handleLlmQueueRequest(ctx, { storeId: `llm-store-${Date.now()}` })
    ).rejects.toThrow('originalRequestQueueId missing');
  });

  it('throws when userData is invalid', async () => {
    const ctx = {
      request: {
        url: 'https://example.com/job/3',
        userData: { html: 'x' },
      },
      log: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), debug: vi.fn() },
    } as any;

    await expect(handleLlmQueueRequest(ctx, { storeId: 'llm-store' })).rejects.toThrow(
      'LLM queue request missing required userData'
    );

    expect(mockExtractWithLlm).not.toHaveBeenCalled();
  });
});
