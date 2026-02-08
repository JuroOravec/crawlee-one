import { describe, it, expect, vi } from 'vitest';

import { itemCacheKey, pushData } from './pushData.js';
import type {
  CrawleeOneIO,
  CrawleeOneDataset,
  CrawleeOneKeyValueStore,
} from '../integrations/types.js';

// Minimal mock crawling context
const createMockCtx = () =>
  ({
    id: 'ctx-1',
    request: {
      id: 'req-1',
      url: 'https://example.com',
      loadedUrl: 'https://example.com',
      handledAt: '2024-01-01T00:00:00.000Z',
      retryCount: 0,
    },
  }) as any;

const createMockDataset = (overrides?: Partial<CrawleeOneDataset>): CrawleeOneDataset => ({
  pushData: vi.fn(),
  getItems: vi.fn().mockResolvedValue([]),
  getItemCount: vi.fn().mockResolvedValue(0),
  ...overrides,
});

const createMockKeyValueStore = (
  overrides?: Partial<CrawleeOneKeyValueStore>
): CrawleeOneKeyValueStore => ({
  getValue: vi.fn().mockResolvedValue(null),
  setValue: vi.fn(),
  drop: vi.fn(),
  clear: vi.fn(),
  ...overrides,
});

const createMockIO = (overrides?: {
  dataset?: CrawleeOneDataset;
  kvStore?: CrawleeOneKeyValueStore;
}): CrawleeOneIO<any, any, any> => {
  const dataset = overrides?.dataset ?? createMockDataset();
  const kvStore = overrides?.kvStore ?? createMockKeyValueStore();

  return {
    openDataset: vi.fn().mockResolvedValue(dataset),
    openRequestQueue: vi.fn().mockResolvedValue({
      addRequests: vi.fn(),
      markRequestHandled: vi.fn(),
      fetchNextRequest: vi.fn(),
      reclaimRequest: vi.fn(),
      isFinished: vi.fn().mockResolvedValue(true),
      drop: vi.fn(),
      clear: vi.fn(),
      handledCount: vi.fn().mockResolvedValue(0),
    }),
    openKeyValueStore: vi.fn().mockResolvedValue(kvStore),
    getInput: vi.fn().mockResolvedValue(null),
    runInContext: vi.fn(),
    triggerDownstreamCrawler: vi.fn(),
    createDefaultProxyConfiguration: vi.fn().mockResolvedValue(undefined),
    isTelemetryEnabled: vi.fn().mockReturnValue(false),
    generateErrorReport: vi.fn().mockResolvedValue({}),
    generateEntryMetadata: vi.fn().mockResolvedValue({ actorId: 'test' }),
  } as any;
};

describe('itemCacheKey', () => {
  it('returns a string hash for an object', () => {
    const key = itemCacheKey({ a: 1, b: 2 });
    expect(typeof key).toBe('string');
    expect(key.length).toBeGreaterThan(0);
  });

  it('returns consistent hash for same object', () => {
    const key1 = itemCacheKey({ a: 1, b: 2 });
    const key2 = itemCacheKey({ a: 1, b: 2 });
    expect(key1).toBe(key2);
  });

  it('returns consistent hash regardless of key order', () => {
    const key1 = itemCacheKey({ a: 1, b: 2 });
    const key2 = itemCacheKey({ b: 2, a: 1 });
    expect(key1).toBe(key2);
  });

  it('returns different hashes for different objects', () => {
    const key1 = itemCacheKey({ a: 1 });
    const key2 = itemCacheKey({ a: 2 });
    expect(key1).not.toBe(key2);
  });

  it('uses primary keys when provided', () => {
    const key1 = itemCacheKey({ id: 1, name: 'foo', extra: 'a' }, ['id', 'name']);
    const key2 = itemCacheKey({ id: 1, name: 'foo', extra: 'b' }, ['id', 'name']);
    expect(key1).toBe(key2); // extra field doesn't matter
  });

  it('primary keys are order-independent', () => {
    const key1 = itemCacheKey({ id: 1, name: 'foo' }, ['name', 'id']);
    const key2 = itemCacheKey({ id: 1, name: 'foo' }, ['id', 'name']);
    expect(key1).toBe(key2);
  });
});

describe('pushData', () => {
  it('pushes items to the dataset', async () => {
    const dataset = createMockDataset();
    const io = createMockIO({ dataset });
    const ctx = createMockCtx();

    await pushData(ctx, [{ a: 1 }], { io, privacyMask: {} });

    expect(dataset.pushData).toHaveBeenCalledTimes(1);
    expect(dataset.pushData).toHaveBeenCalledWith([{ a: 1 }]);
  });

  it('converts single item to array', async () => {
    const dataset = createMockDataset();
    const io = createMockIO({ dataset });
    const ctx = createMockCtx();

    await pushData(ctx, { a: 1 } as any, { io, privacyMask: {} });

    expect(dataset.pushData).toHaveBeenCalledWith([{ a: 1 }]);
  });

  it('applies transform function', async () => {
    const dataset = createMockDataset();
    const io = createMockIO({ dataset });
    const ctx = createMockCtx();

    await pushData(ctx, [{ val: 1 }], {
      io,
      privacyMask: {},
      transform: (item) => ({ ...item, val: item.val * 10 }),
    });

    expect(dataset.pushData).toHaveBeenCalledWith([{ val: 10 }]);
  });

  it('applies filter function', async () => {
    const dataset = createMockDataset();
    const io = createMockIO({ dataset });
    const ctx = createMockCtx();

    await pushData(ctx, [{ val: 1 }, { val: 2 }, { val: 3 }], {
      io,
      privacyMask: {},
      filter: (item) => item.val > 1,
    });

    expect(dataset.pushData).toHaveBeenCalledWith([{ val: 2 }, { val: 3 }]);
  });

  it('applies pickKeys to select fields', async () => {
    const dataset = createMockDataset();
    const io = createMockIO({ dataset });
    const ctx = createMockCtx();

    await pushData(ctx, [{ a: 1, b: 2, c: 3 }], {
      io,
      privacyMask: {},
      pickKeys: ['a', 'c'],
    });

    expect(dataset.pushData).toHaveBeenCalledWith([{ a: 1, c: 3 }]);
  });

  it('applies remapKeys to rename fields', async () => {
    const dataset = createMockDataset();
    const io = createMockIO({ dataset });
    const ctx = createMockCtx();

    await pushData(ctx, [{ oldName: 'value' }], {
      io,
      privacyMask: {},
      remapKeys: { oldName: 'newName' },
    });

    expect(dataset.pushData).toHaveBeenCalledWith([{ newName: 'value' }]);
  });

  it('applies privacy mask to redact fields', async () => {
    const dataset = createMockDataset();
    const io = createMockIO({ dataset });
    const ctx = createMockCtx();

    const result = await pushData(ctx, [{ email: 'test@test.com', name: 'public' }], {
      io,
      privacyMask: { email: true } as any,
    });

    expect((result[0] as any).name).toBe('public');
    expect((result[0] as any).email).toContain('Redacted');
  });

  it('shows private data when showPrivate is true', async () => {
    const dataset = createMockDataset();
    const io = createMockIO({ dataset });
    const ctx = createMockCtx();

    const result = await pushData(ctx, [{ email: 'test@test.com' }], {
      io,
      privacyMask: { email: true } as any,
      showPrivate: true,
    });

    expect((result[0] as any).email).toBe('test@test.com');
  });

  it('opens named dataset when datasetId is provided', async () => {
    const dataset = createMockDataset();
    const io = createMockIO({ dataset });
    const ctx = createMockCtx();

    await pushData(ctx, [{ a: 1 }], {
      io,
      privacyMask: {},
      datasetId: 'my-dataset',
    });

    expect(io.openDataset).toHaveBeenCalledWith('my-dataset');
  });

  it('updates cache when cacheStoreId and cacheActionOnResult are set', async () => {
    const kvStore = createMockKeyValueStore();
    const io = createMockIO({ kvStore });
    const ctx = createMockCtx();

    await pushData(ctx, [{ id: 1, val: 'a' }], {
      io,
      privacyMask: {},
      cacheStoreId: 'cache-store',
      cacheActionOnResult: 'add',
    });

    expect(io.openKeyValueStore).toHaveBeenCalledWith('cache-store');
    expect(kvStore.setValue).toHaveBeenCalledTimes(1);
    // First arg is the cache key (a hash string), second is the item
    expect(kvStore.setValue).toHaveBeenCalledWith(expect.any(String), { id: 1, val: 'a' });
  });

  it('removes cache entries when cacheActionOnResult is "remove"', async () => {
    const kvStore = createMockKeyValueStore();
    const io = createMockIO({ kvStore });
    const ctx = createMockCtx();

    await pushData(ctx, [{ id: 1 }], {
      io,
      privacyMask: {},
      cacheStoreId: 'cache-store',
      cacheActionOnResult: 'remove',
    });

    expect(kvStore.setValue).toHaveBeenCalledWith(expect.any(String), null);
  });

  it('does not update cache when cacheActionOnResult is null', async () => {
    const kvStore = createMockKeyValueStore();
    const io = createMockIO({ kvStore });
    const ctx = createMockCtx();

    await pushData(ctx, [{ id: 1 }], {
      io,
      privacyMask: {},
      cacheStoreId: 'cache-store',
      cacheActionOnResult: null,
    });

    expect(kvStore.setValue).not.toHaveBeenCalled();
  });

  it('includes metadata when includeMetadata is true', async () => {
    const dataset = createMockDataset();
    const io = createMockIO({ dataset });
    const ctx = createMockCtx();

    const result = await pushData(ctx, [{ val: 1 }], {
      io,
      privacyMask: {},
      includeMetadata: true,
    });

    expect(result[0]).toHaveProperty('metadata');
    expect((result[0] as any).metadata).toEqual({ actorId: 'test' });
  });
});
