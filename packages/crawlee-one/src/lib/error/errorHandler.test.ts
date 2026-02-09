import { describe, it, expect, vi } from 'vitest';

import {
  captureError,
  captureErrorWrapper,
  captureErrorRouteHandler,
  createErrorHandler,
} from './errorHandler.js';
import type { CrawleeOneIO, CrawleeOneDataset } from '../integrations/types.js';

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

  it('passes page and url to generateErrorReport', async () => {
    const io = createMockIO();
    const error = new Error('Test');
    const mockPage = { url: () => 'https://page-url.com' } as any;

    try {
      await captureError(
        { error, url: 'https://example.com', page: mockPage, log: null },
        { io, reportingDatasetId: 'ERRORS' }
      );
    } catch {
      // Expected
    }

    expect(io.generateErrorReport).toHaveBeenCalledWith(
      expect.objectContaining({
        error,
        page: mockPage,
        url: 'https://example.com',
      }),
      expect.any(Object)
    );
  });
});

describe('captureErrorWrapper', () => {
  it('passes captureError function to the wrapped function', async () => {
    const io = createMockIO();
    let receivedCapture: any = null;

    await captureErrorWrapper(
      ({ captureError: capture }) => {
        receivedCapture = capture;
      },
      { io }
    );

    expect(typeof receivedCapture).toBe('function');
  });

  it('catches and reports errors thrown by the wrapped function', async () => {
    const io = createMockIO();
    const error = new Error('Wrapped function failed');

    // captureErrorWrapper catches the error, calls captureError which reports
    // and then rethrows. The rethrow propagates out of captureErrorWrapper.
    try {
      await captureErrorWrapper(
        () => {
          throw error;
        },
        { io, reportingDatasetId: 'ERRORS' }
      );
    } catch {
      // Expected - captureError always rethrows
    }

    // Error was captured (generateErrorReport was called)
    expect(io.generateErrorReport).toHaveBeenCalled();
  });

  it('does not double-capture already captured errors', async () => {
    const io = createMockIO();
    const error = new Error('Already captured');
    (error as any)._crawleeOneErrorCaptured = true;

    // Should not call generateErrorReport again since error is already captured
    await captureErrorWrapper(
      () => {
        throw error;
      },
      { io }
    );

    // The error was already captured, so generateErrorReport should not be called
    expect(io.generateErrorReport).not.toHaveBeenCalled();
  });

  it('allows the wrapped function to capture errors manually', async () => {
    const io = createMockIO();
    const error = new Error('Manual capture');

    // The wrapped function uses the provided captureError to report the error
    try {
      await captureErrorWrapper(
        async ({ captureError: capture }) => {
          try {
            throw error;
          } catch (e: any) {
            await capture({ error: e, url: 'https://example.com', page: null, log: null });
          }
        },
        { io, reportingDatasetId: 'ERRORS' }
      );
    } catch {
      // captureError always rethrows
    }

    expect(io.generateErrorReport).toHaveBeenCalledTimes(1);
  });
});

describe('captureErrorRouteHandler', () => {
  it('wraps a route handler with error capture', () => {
    const io = createMockIO();
    const handler = vi.fn();

    const wrapped = captureErrorRouteHandler(handler as any, { io });

    expect(typeof wrapped).toBe('function');
  });

  it('provides captureError to the handler context', async () => {
    const io = createMockIO();
    let receivedCapture: any = null;

    const handler = async (ctx: any) => {
      receivedCapture = ctx.captureError;
    };

    const wrapped = captureErrorRouteHandler(handler as any, { io });

    const mockCtx = {
      request: { url: 'https://example.com' },
      log: { child: () => ({ error: vi.fn(), info: vi.fn(), debug: vi.fn() }) },
      page: null,
    };

    await wrapped(mockCtx as any);

    expect(typeof receivedCapture).toBe('function');
  });

  it('auto-captures errors thrown by the handler', async () => {
    const io = createMockIO();
    const error = new Error('Handler error');

    const handler = async () => {
      throw error;
    };

    const wrapped = captureErrorRouteHandler(handler as any, {
      io,
      reportingDatasetId: 'ERRORS',
    });

    const mockCtx = {
      request: { url: 'https://example.com' },
      log: { child: () => ({ error: vi.fn(), info: vi.fn(), debug: vi.fn() }) },
      page: null,
    };

    // The error is captured and reported, then rethrown
    try {
      await wrapped(mockCtx as any);
    } catch {
      // Expected - captureError always rethrows
    }

    expect(io.generateErrorReport).toHaveBeenCalled();
  });

  it('uses context url and page for error capture when not provided', async () => {
    const io = createMockIO();
    const mockPage = { url: () => 'https://page.com' } as any;

    const handler = async (ctx: any) => {
      // Call captureError without explicit url/page
      await ctx.captureError({ error: new Error('test') });
    };

    const wrapped = captureErrorRouteHandler(handler as any, { io });

    const mockLog = { error: vi.fn(), info: vi.fn(), debug: vi.fn() };
    const mockCtx = {
      request: { url: 'https://example.com' },
      log: { child: () => mockLog },
      page: mockPage,
    };

    try {
      await wrapped(mockCtx as any);
    } catch {
      // captureError rethrows
    }

    // generateErrorReport should have been called with the context page and url
    const reportInput = vi.mocked(io.generateErrorReport).mock.calls[0][0];
    expect(reportInput.page).toBe(mockPage);
    expect(reportInput.url).toBe('https://example.com');
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

  it('falls back to request.url when loadedUrl is not available', async () => {
    const io = createMockIO();
    const handler = createErrorHandler({
      io,
      reportingDatasetId: 'ERRORS',
    } as any);

    const mockLog = { error: vi.fn(), info: vi.fn(), debug: vi.fn(), warning: vi.fn() };
    const ctx = {
      request: { url: 'https://example.com', loadedUrl: '' },
      log: { child: () => mockLog },
      page: null,
    } as any;

    try {
      await handler(ctx, new Error('fail'));
    } catch {
      // Expected
    }

    const reportInput = vi.mocked(io.generateErrorReport).mock.calls[0][0];
    expect(reportInput.url).toBe('https://example.com');
  });
});
