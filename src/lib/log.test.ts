import { describe, it, expect, vi } from 'vitest';
import { LogLevel as CrawleeLogLevel } from 'crawlee';

import { LOG_LEVEL, logLevelToCrawlee, logLevelHandlerWrapper } from './log';

describe('LOG_LEVEL', () => {
  it('contains all expected levels', () => {
    expect(LOG_LEVEL).toEqual(['debug', 'info', 'warn', 'error', 'off']);
  });
});

describe('logLevelToCrawlee', () => {
  it('maps all log levels to crawlee equivalents', () => {
    expect(logLevelToCrawlee.off).toBe(CrawleeLogLevel.OFF);
    expect(logLevelToCrawlee.debug).toBe(CrawleeLogLevel.DEBUG);
    expect(logLevelToCrawlee.info).toBe(CrawleeLogLevel.INFO);
    expect(logLevelToCrawlee.warn).toBe(CrawleeLogLevel.WARNING);
    expect(logLevelToCrawlee.error).toBe(CrawleeLogLevel.ERROR);
  });

  it('has a mapping for every LOG_LEVEL entry', () => {
    for (const level of LOG_LEVEL) {
      expect(logLevelToCrawlee).toHaveProperty(level);
      expect(typeof logLevelToCrawlee[level]).toBe('number');
    }
  });
});

describe('logLevelHandlerWrapper', () => {
  it('returns a wrapper function', () => {
    const wrapper = logLevelHandlerWrapper('info');
    expect(typeof wrapper).toBe('function');
  });

  it('the wrapper returns a handler function', () => {
    const wrapper = logLevelHandlerWrapper('info');
    const handler = vi.fn();
    const wrappedHandler = wrapper(handler as any);
    expect(typeof wrappedHandler).toBe('function');
  });

  it('sets log level on context before calling handler', async () => {
    const wrapper = logLevelHandlerWrapper('debug');
    const handler = vi.fn();
    const wrappedHandler = wrapper(handler as any);

    const mockCtx = {
      log: {
        info: vi.fn(),
        setLevel: vi.fn(),
      },
    };

    await (wrappedHandler as any)(mockCtx);

    expect(mockCtx.log.setLevel).toHaveBeenCalledWith(CrawleeLogLevel.DEBUG);
    expect(handler).toHaveBeenCalledWith(mockCtx);
  });

  it('calls the original handler with all arguments', async () => {
    const wrapper = logLevelHandlerWrapper('error');
    const handler = vi.fn();
    const wrappedHandler = wrapper(handler as any);

    const mockCtx = {
      log: {
        info: vi.fn(),
        setLevel: vi.fn(),
      },
    };

    await (wrappedHandler as any)(mockCtx, 'extra-arg');

    expect(handler).toHaveBeenCalledWith(mockCtx, 'extra-arg');
  });
});
