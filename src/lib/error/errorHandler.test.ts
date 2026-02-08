import { describe, it, expect, vi } from 'vitest';

import { captureError, createErrorHandler } from './errorHandler';
import type { CrawleeOneIO, CrawleeOneDataset } from '../integrations/types';

const createMockDataset = (overrides?: Partial<CrawleeOneDataset>): CrawleeOneDataset => ({
  pushData: vi.fn(),
  getItems: vi.fn().mockResolvedValue([]),
  getItemCount: vi.fn().mockResolvedValue(0),
  ...overrides,
});

const createMockIO = (overrides?: { dataset?: CrawleeOneDataset }): CrawleeOneIO<any, any, any> => {
  const dataset = overrides?.dataset ?? createMockDataset();

  return {
    openDataset: vi.fn().mockResolvedValue(dataset),
    openRequestQueue: vi.fn().mockResolvedValue({
      addRequests: vi.fn(),
      markRequestHandled: vi.fn(),
      fetchNextRequest: vi.fn().mockResolvedValue(null),
      reclaimRequest: vi.fn(),
      isFinished: vi.fn().mockResolvedValue(true),
      drop: vi.fn(),
      clear: vi.fn(),
      handledCount: vi.fn().mockResolvedValue(0),
    }),
    openKeyValueStore: vi.fn().mockResolvedValue({
      getValue: vi.fn(),
      setValue: vi.fn(),
      drop: vi.fn(),
      clear: vi.fn(),
    }),
    getInput: vi.fn().mockResolvedValue(null),
    runInContext: vi.fn(),
    triggerDownstreamCrawler: vi.fn(),
    createDefaultProxyConfiguration: vi.fn().mockResolvedValue(undefined),
    isTelemetryEnabled: vi.fn().mockReturnValue(false),
    generateErrorReport: vi
      .fn()
      .mockResolvedValue({ errorName: 'TestError', errorMessage: 'test' }),
    generateEntryMetadata: vi.fn().mockResolvedValue({}),
  } as any;
};

describe('captureError', () => {
  it('generates error report via IO and rethrows', async () => {
    const io = createMockIO();
    const error = new Error('Test error');

    await expect(
      captureError(
        { error, url: 'https://example.com', page: null, log: null },
        { io, reportingDatasetId: 'ERRORS' }
      )
    ).rejects.toThrow('Test error');

    expect(io.generateErrorReport).toHaveBeenCalledTimes(1);
  });

  it('pushes error report to reporting dataset', async () => {
    const dataset = createMockDataset();
    const io = createMockIO({ dataset });
    const error = new Error('Test');

    try {
      await captureError(
        { error, url: null, page: null, log: null },
        { io, reportingDatasetId: 'ERRORS' }
      );
    } catch {
      // Expected
    }

    expect(io.openDataset).toHaveBeenCalledWith('ERRORS');
    expect(dataset.pushData).toHaveBeenCalledWith({
      errorName: 'TestError',
      errorMessage: 'test',
    });
  });

  it('marks error as captured to prevent double capture', async () => {
    const io = createMockIO();
    const error = new Error('Test');

    try {
      await captureError({ error, url: null, page: null, log: null }, { io });
    } catch {
      // Expected
    }

    expect((error as any)._crawleeOneErrorCaptured).toBe(true);
  });

  it('calls onErrorCapture callback', async () => {
    const io = createMockIO();
    const onErrorCapture = vi.fn();
    const error = new Error('Test');

    try {
      await captureError({ error, url: null, page: null, log: null }, { io, onErrorCapture });
    } catch {
      // Expected
    }

    expect(onErrorCapture).toHaveBeenCalledWith({
      error,
      report: { errorName: 'TestError', errorMessage: 'test' },
    });
  });

  it('does not push to dataset when reportingDatasetId is not set', async () => {
    const dataset = createMockDataset();
    const io = createMockIO({ dataset });
    const error = new Error('Test');

    try {
      await captureError({ error, url: null, page: null, log: null }, { io });
    } catch {
      // Expected
    }

    expect(dataset.pushData).not.toHaveBeenCalled();
  });
});

describe('createErrorHandler', () => {
  it('returns a function', () => {
    const io = createMockIO();
    const handler = createErrorHandler({
      io,
      reportingDatasetId: 'ERRORS',
    } as any);

    expect(typeof handler).toBe('function');
  });

  it('the returned handler captures errors and rethrows', async () => {
    const io = createMockIO();
    const handler = createErrorHandler({
      io,
      reportingDatasetId: 'ERRORS',
    } as any);

    const mockLog = { error: vi.fn(), info: vi.fn(), debug: vi.fn(), warning: vi.fn() };
    const ctx = {
      request: { url: 'https://example.com', loadedUrl: 'https://example.com/loaded' },
      log: { child: () => mockLog },
      page: null,
    } as any;

    const error = new Error('Handler failed');

    await expect(handler(ctx, error)).rejects.toThrow('Handler failed');

    expect(io.generateErrorReport).toHaveBeenCalled();
    // Verify the URL was extracted from context (prefers loadedUrl over url)
    const reportInput = (io.generateErrorReport as any).mock.calls[0][0];
    expect(reportInput.url).toBe('https://example.com/loaded');
  });

  it('sends to telemetry when enabled', async () => {
    const io = createMockIO();
    const onSendErrorToTelemetry = vi.fn();

    const handler = createErrorHandler({
      io,
      reportingDatasetId: 'ERRORS',
      sendToTelemetry: true,
      onSendErrorToTelemetry,
    } as any);

    const mockLog = { error: vi.fn(), info: vi.fn(), debug: vi.fn(), warning: vi.fn() };
    const ctx = {
      request: { url: 'https://example.com', loadedUrl: 'https://example.com' },
      log: { child: () => mockLog },
      page: null,
    } as any;

    try {
      await handler(ctx, new Error('fail'));
    } catch {
      // Expected - captureError always rethrows
    }

    expect(onSendErrorToTelemetry).toHaveBeenCalled();
  });

  it('does not send to telemetry when disabled', async () => {
    const io = createMockIO();
    const onSendErrorToTelemetry = vi.fn();

    const handler = createErrorHandler({
      io,
      reportingDatasetId: 'ERRORS',
      sendToTelemetry: false,
      onSendErrorToTelemetry,
    } as any);

    const mockLog = { error: vi.fn(), info: vi.fn(), debug: vi.fn(), warning: vi.fn() };
    const ctx = {
      request: { url: 'https://example.com', loadedUrl: 'https://example.com' },
      log: { child: () => mockLog },
      page: null,
    } as any;

    try {
      await handler(ctx, new Error('fail'));
    } catch {
      // Expected
    }

    expect(onSendErrorToTelemetry).not.toHaveBeenCalled();
  });
});
