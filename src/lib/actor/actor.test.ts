import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

import { createHttpCrawlerOptions, runCrawleeOne } from './actor.js';
import { actorClassByType } from '../../constants.js';
import { CRAWLER_TYPE } from '../../types/index.js';
import type {
  CrawleeOneIO,
  CrawleeOneRequestQueue,
  CrawleeOneDataset,
  CrawleeOneKeyValueStore,
} from '../integrations/types.js';

// ---- Mock helpers ----

const createMockRequestQueue = (
  overrides?: Partial<CrawleeOneRequestQueue>
): CrawleeOneRequestQueue => ({
  addRequests: vi.fn(),
  markRequestHandled: vi.fn(),
  fetchNextRequest: vi.fn().mockResolvedValue(null),
  reclaimRequest: vi.fn(),
  isFinished: vi.fn().mockResolvedValue(true),
  drop: vi.fn(),
  clear: vi.fn(),
  handledCount: vi.fn().mockResolvedValue(0),
  ...overrides,
});

const createMockDataset = (overrides?: Partial<CrawleeOneDataset>): CrawleeOneDataset => ({
  pushData: vi.fn(),
  getItems: vi.fn().mockResolvedValue([]),
  getItemCount: vi.fn().mockResolvedValue(0),
  ...overrides,
});

const createMockKeyValueStore = (): CrawleeOneKeyValueStore => ({
  getValue: vi.fn().mockResolvedValue(null) as any,
  setValue: vi.fn(),
  drop: vi.fn(),
  clear: vi.fn(),
});

const createMockIO = (overrides?: {
  input?: any;
  reqQueue?: CrawleeOneRequestQueue;
  dataset?: CrawleeOneDataset;
}): CrawleeOneIO<any, any, any> => {
  const reqQueue = overrides?.reqQueue ?? createMockRequestQueue();
  const dataset = overrides?.dataset ?? createMockDataset();

  return {
    openDataset: vi.fn().mockResolvedValue(dataset),
    openRequestQueue: vi.fn().mockResolvedValue(reqQueue),
    openKeyValueStore: vi.fn().mockResolvedValue(createMockKeyValueStore()),
    getInput: vi.fn().mockResolvedValue(overrides?.input ?? null),
    runInContext: vi.fn().mockImplementation(async (fn) => {
      await fn();
    }),
    triggerDownstreamCrawler: vi.fn(),
    createDefaultProxyConfiguration: vi.fn().mockResolvedValue(undefined),
    isTelemetryEnabled: vi.fn().mockReturnValue(false),
    generateErrorReport: vi
      .fn()
      .mockResolvedValue({ errorName: 'TestError', errorMessage: 'test' }),
    generateEntryMetadata: vi.fn().mockResolvedValue({}),
  } as any;
};

// ---- Existing tests ----

describe('createHttpCrawlerOptions', () => {
  it('returns defaults when no input or overrides', () => {
    const result = createHttpCrawlerOptions({
      input: null,
      defaults: { maxRequestRetries: 3, maxConcurrency: 10 } as any,
    });

    expect(result).toMatchObject({
      maxRequestRetries: 3,
      maxConcurrency: 10,
    });
  });

  it('input fields override defaults', () => {
    const result = createHttpCrawlerOptions({
      input: { maxRequestRetries: 5 },
      defaults: { maxRequestRetries: 3, maxConcurrency: 10 } as any,
    });

    expect(result).toMatchObject({
      maxRequestRetries: 5,
      maxConcurrency: 10,
    });
  });

  it('overrides take precedence over input and defaults', () => {
    const result = createHttpCrawlerOptions({
      input: { maxRequestRetries: 5 },
      defaults: { maxRequestRetries: 3, maxConcurrency: 10 } as any,
      overrides: { maxRequestRetries: 1, maxConcurrency: 2 } as any,
    });

    expect(result).toMatchObject({
      maxRequestRetries: 1,
      maxConcurrency: 2,
    });
  });

  it('omits undefined fields from defaults', () => {
    const result = createHttpCrawlerOptions({
      input: null,
      defaults: { maxRequestRetries: 3, maxConcurrency: undefined } as any,
    });

    expect(result).toHaveProperty('maxRequestRetries', 3);
    expect(result).not.toHaveProperty('maxConcurrency');
  });

  it('omits undefined fields from overrides', () => {
    const result = createHttpCrawlerOptions({
      input: { maxRequestRetries: 5 },
      defaults: { maxConcurrency: 10 } as any,
      overrides: { maxRequestRetries: undefined } as any,
    });

    expect(result).toMatchObject({
      maxRequestRetries: 5,
      maxConcurrency: 10,
    });
  });

  it('handles null input gracefully', () => {
    const result = createHttpCrawlerOptions({
      input: null,
    });

    expect(result).toEqual({});
  });

  it('only picks recognized crawler input fields from input', () => {
    const result = createHttpCrawlerOptions({
      input: {
        maxRequestRetries: 5,
        // This is not a crawler config field - it's a crawlee-one-specific input
        outputDatasetId: 'my-dataset',
        startUrls: ['https://example.com'],
      },
    });

    // Only crawler config fields should be included
    expect(result).toHaveProperty('maxRequestRetries', 5);
    expect(result).not.toHaveProperty('outputDatasetId');
    expect(result).not.toHaveProperty('startUrls');
  });

  it('picks maxCrawlDepth from input', () => {
    const result = createHttpCrawlerOptions({
      input: { maxCrawlDepth: 3 },
    });

    expect(result).toHaveProperty('maxCrawlDepth', 3);
  });

  it('maxCrawlDepth can be overridden', () => {
    const result = createHttpCrawlerOptions({
      input: { maxCrawlDepth: 3 },
      overrides: { maxCrawlDepth: 1 } as any,
    });

    expect(result).toHaveProperty('maxCrawlDepth', 1);
  });
});

// ---- runCrawleeOne tests ----

describe('runCrawleeOne', () => {
  // Requires Puppeteer to be installed as a devDependency
  describe.each(CRAWLER_TYPE)('with %s crawler', (actorType) => {
    it('creates the correct crawler class and exposes actor properties', async () => {
      let capturedActor: any = null;
      const io = createMockIO();

      await runCrawleeOne({
        actorType: actorType as any,
        actorConfig: {
          io,
          routes: {
            MAIN: { match: /.*/, handler: vi.fn() },
          },
        },
        crawlerConfigOverrides: {
          maxRequestRetries: 0,
        } as any,
        onReady: async (actor) => {
          capturedActor = actor;
        },
      });

      expect(capturedActor).not.toBeNull();
      expect(capturedActor.crawler).toBeDefined();
      expect(capturedActor.crawler).toBeInstanceOf(actorClassByType[actorType]);

      // Verify actor has expected properties
      expect(capturedActor.io).toBe(io);
      expect(capturedActor.router).toBeDefined();
      expect(capturedActor.input).toBeDefined();
      expect(capturedActor.state).toBeDefined();
      expect(capturedActor.log).toBeDefined();
      expect(typeof capturedActor.runCrawler).toBe('function');
      expect(typeof capturedActor.metamorph).toBe('function');
      expect(typeof capturedActor.pushData).toBe('function');
      expect(typeof capturedActor.pushRequests).toBe('function');
      expect(Array.isArray(capturedActor.startUrls)).toBe(true);
    });
  });

  describe('input resolution', () => {
    it('reads input from io.getInput when no config.input provided', async () => {
      let capturedInput: any;
      const expectedInput = { startUrls: ['https://example.com'], maxRequestRetries: 5 };
      const io = createMockIO({ input: expectedInput });

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: async (actor) => {
          capturedInput = actor.input;
        },
      });

      expect(io.getInput).toHaveBeenCalled();
      expect(capturedInput).toMatchObject(expectedInput);
    });

    it('uses config.input when provided as object', async () => {
      let capturedInput: any;
      const configInput = { myField: 'from-config' };
      const ioInput = { myField: 'from-io' };
      const io = createMockIO({ input: ioInput });

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          input: configInput,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: async (actor) => {
          capturedInput = actor.input;
        },
      });

      // When config.input is provided (without mergeInput), io.getInput is not used
      expect(capturedInput).toMatchObject(configInput);
    });

    it('calls config.input as function when provided', async () => {
      let capturedInput: any;
      const inputFn = vi.fn().mockReturnValue({ myField: 'from-function' });
      const io = createMockIO();

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          input: inputFn,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: async (actor) => {
          capturedInput = actor.input;
        },
      });

      expect(inputFn).toHaveBeenCalled();
      expect(capturedInput).toMatchObject({ myField: 'from-function' });
    });

    it('calls validateInput when provided', async () => {
      const validateInput = vi.fn();
      const io = createMockIO();

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          validateInput,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: vi.fn(),
      });

      expect(validateInput).toHaveBeenCalledTimes(1);
    });

    it('merges inputs when mergeInput is true', async () => {
      let capturedInput: any;
      const configInput = { fieldA: 'from-config', shared: 'config-wins' };
      const ioInput = { fieldB: 'from-io', shared: 'io-value' };
      const io = createMockIO({ input: ioInput });

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          input: configInput,
          mergeInput: true,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: async (actor) => {
          capturedInput = actor.input;
        },
      });

      // Both io and config inputs should be merged, with config (overrides) winning
      expect(capturedInput).toMatchObject({
        fieldA: 'from-config',
        fieldB: 'from-io',
        shared: 'config-wins',
      });
    });

    it('uses inputDefaults as fallback values', async () => {
      let capturedInput: any;
      const io = createMockIO({ input: { fromIO: 'yes' } });

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          inputDefaults: { defaultField: 'default-value', fromIO: 'should-be-overridden' },
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: async (actor) => {
          capturedInput = actor.input;
        },
      });

      expect(capturedInput).toMatchObject({
        defaultField: 'default-value',
        fromIO: 'yes', // IO input overrides defaults
      });
    });
  });

  describe('startUrls', () => {
    it('resolves startUrls from input', async () => {
      let capturedStartUrls: any;
      const io = createMockIO({
        input: { startUrls: ['https://a.com', 'https://b.com'] },
      });

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: async (actor) => {
          capturedStartUrls = actor.startUrls;
        },
      });

      expect(capturedStartUrls).toEqual(['https://a.com', 'https://b.com']);
    });

    it('pushes startUrls to request queue on init', async () => {
      const reqQueue = createMockRequestQueue();
      const io = createMockIO({
        input: { startUrls: ['https://a.com'] },
        reqQueue,
      });

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: vi.fn(),
      });

      // pushRequests is called during init with startUrls
      expect(reqQueue.addRequests).toHaveBeenCalled();
    });

    it('handles empty startUrls', async () => {
      let capturedStartUrls: any;
      const io = createMockIO();

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: async (actor) => {
          capturedStartUrls = actor.startUrls;
        },
      });

      expect(capturedStartUrls).toEqual([]);
    });
  });

  describe('scoped functions', () => {
    it('metamorph triggers downstream crawler when metamorphActorId is set', async () => {
      const io = createMockIO({
        input: {
          metamorphActorId: 'downstream-actor',
          metamorphActorBuild: 'latest',
          metamorphActorInput: { key: 'value' },
        },
      });

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: async (actor) => {
          await actor.metamorph();

          expect(io.triggerDownstreamCrawler).toHaveBeenCalledWith(
            'downstream-actor',
            { key: 'value' },
            { build: 'latest' }
          );
        },
      });
    });

    it('metamorph is no-op without metamorphActorId', async () => {
      const io = createMockIO();

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: async (actor) => {
          await actor.metamorph();
          expect(io.triggerDownstreamCrawler).not.toHaveBeenCalled();
        },
      });
    });

    it('metamorph accepts overrides', async () => {
      const io = createMockIO({
        input: {
          metamorphActorId: 'default-actor',
          metamorphActorInput: { defaultKey: 'value' },
        },
      });

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: async (actor) => {
          await actor.metamorph({
            metamorphActorId: 'override-actor',
            metamorphActorInput: { overrideKey: 'yes' },
          });

          expect(io.triggerDownstreamCrawler).toHaveBeenCalledWith(
            'override-actor',
            { overrideKey: 'yes' },
            expect.any(Object)
          );
        },
      });
    });

    it('scoped pushRequests delegates to io request queue', async () => {
      const reqQueue = createMockRequestQueue();
      const io = createMockIO({ reqQueue });

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: async (actor) => {
          // Reset call count after init pushes startUrls
          vi.mocked(reqQueue.addRequests).mockClear();

          await actor.pushRequests([{ url: 'https://example.com', uniqueKey: '1' }] as any);
          expect(reqQueue.addRequests).toHaveBeenCalled();
        },
      });
    });

    it('scoped pushData throws when called outside handler context', async () => {
      const io = createMockIO();

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: async (actor) => {
          await expect(actor.pushData({ data: 'test' }, { privacyMask: {} })).rejects.toThrow(
            'outside of the crawling context'
          );
        },
      });
    });
  });

  describe('telemetry', () => {
    it('sets up telemetry when isTelemetryEnabled returns true', async () => {
      const telemetrySetup = vi.fn();
      const io = createMockIO();
      vi.mocked(io.isTelemetryEnabled).mockReturnValue(true);

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          telemetry: { setup: telemetrySetup, onSendErrorToTelemetry: vi.fn() },
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: vi.fn(),
      });

      expect(telemetrySetup).toHaveBeenCalled();
    });

    it('skips telemetry setup when isTelemetryEnabled returns false', async () => {
      const telemetrySetup = vi.fn();
      const io = createMockIO();

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          telemetry: { setup: telemetrySetup, onSendErrorToTelemetry: vi.fn() },
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: vi.fn(),
      });

      expect(telemetrySetup).not.toHaveBeenCalled();
    });
  });

  describe('onReady callback', () => {
    it('calls onReady with the created actor', async () => {
      const onReady = vi.fn();
      const io = createMockIO();

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady,
      });

      expect(onReady).toHaveBeenCalledTimes(1);
      expect(onReady).toHaveBeenCalledWith(
        expect.objectContaining({
          crawler: expect.any(Object),
          io: expect.any(Object),
          router: expect.any(Function),
        })
      );
    });
  });

  describe('io.runInContext', () => {
    it('wraps the entire initialization in io.runInContext', async () => {
      const io = createMockIO();

      await runCrawleeOne({
        actorType: 'basic',
        actorConfig: {
          io,
          routes: { MAIN: { match: /.*/, handler: vi.fn() } },
        },
        onReady: vi.fn(),
      });

      expect(io.runInContext).toHaveBeenCalledTimes(1);
      expect(io.runInContext).toHaveBeenCalledWith(expect.any(Function), {
        statusMessage: 'Crawling finished!',
      });
    });
  });
});

// ---- Integration tests with a real web server ----

describe('runCrawleeOne integration', () => {
  let server: http.Server;
  let port: number;

  beforeAll(async () => {
    server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        '<html><head><title>Test Page</title></head>' +
          '<body><h1>Hello World</h1><p>Content here</p></body></html>'
      );
    });

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        port = (server.address() as AddressInfo).port;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('cheerio crawler fetches and parses HTML from localhost', async () => {
    const handlerSpy = vi.fn();
    const io = createMockIO();

    await runCrawleeOne({
      actorType: 'cheerio',
      actorConfig: {
        io,
        routes: {
          MAIN: {
            match: /127\.0\.0\.1/,
            handler: async (ctx: any) => {
              const title = ctx.$('title').text();
              const heading = ctx.$('h1').text();
              handlerSpy({ title, heading, hasCheerio: !!ctx.$ });
            },
          },
        },
      },
      crawlerConfigOverrides: {
        maxRequestRetries: 0,
        maxConcurrency: 1,
      } as any,
      onReady: async (actor) => {
        // Use unique URL to avoid Crawlee request deduplication across tests
        await actor.runCrawler([{ url: `http://127.0.0.1:${port}/?type=cheerio` }]);
      },
    });

    expect(handlerSpy).toHaveBeenCalledTimes(1);
    expect(handlerSpy).toHaveBeenCalledWith({
      title: 'Test Page',
      heading: 'Hello World',
      hasCheerio: true,
    });
  }, 30000);

  it('http crawler fetches raw content from localhost', async () => {
    const handlerSpy = vi.fn();
    const io = createMockIO();

    await runCrawleeOne({
      actorType: 'http',
      actorConfig: {
        io,
        routes: {
          MAIN: {
            match: /127\.0\.0\.1/,
            handler: async (ctx: any) => {
              // HttpCrawler returns body as Buffer or string
              const bodyStr = typeof ctx.body === 'string' ? ctx.body : ctx.body?.toString();
              handlerSpy({
                hasBody: !!ctx.body,
                includesTitle: bodyStr?.includes('<title>Test Page</title>') ?? false,
              });
            },
          },
        },
      },
      crawlerConfigOverrides: {
        maxRequestRetries: 0,
        maxConcurrency: 1,
      } as any,
      onReady: async (actor) => {
        await actor.runCrawler([{ url: `http://127.0.0.1:${port}/?type=http` }]);
      },
    });

    expect(handlerSpy).toHaveBeenCalledTimes(1);
    expect(handlerSpy).toHaveBeenCalledWith({
      hasBody: true,
      includesTitle: true,
    });
  }, 30000);

  it('jsdom crawler fetches and provides DOM access', async () => {
    const handlerSpy = vi.fn();
    const io = createMockIO();

    await runCrawleeOne({
      actorType: 'jsdom',
      actorConfig: {
        io,
        routes: {
          MAIN: {
            match: /127\.0\.0\.1/,
            handler: async (ctx: any) => {
              handlerSpy({
                hasWindow: !!ctx.window,
                title: ctx.window?.document?.title,
              });
            },
          },
        },
      },
      crawlerConfigOverrides: {
        maxRequestRetries: 0,
        maxConcurrency: 1,
      } as any,
      onReady: async (actor) => {
        await actor.runCrawler([{ url: `http://127.0.0.1:${port}/?type=jsdom` }]);
      },
    });

    expect(handlerSpy).toHaveBeenCalledTimes(1);
    const result = handlerSpy.mock.calls[0][0];
    expect(result.hasWindow).toBe(true);
    expect(result.title).toBe('Test Page');
  }, 30000);

  it('basic crawler provides request context', async () => {
    const handlerSpy = vi.fn();
    const io = createMockIO();

    await runCrawleeOne({
      actorType: 'basic',
      actorConfig: {
        io,
        routes: {
          MAIN: {
            match: /127\.0\.0\.1/,
            handler: async (ctx: any) => {
              handlerSpy({
                url: ctx.request.url,
                hasRequest: !!ctx.request,
              });
            },
          },
        },
      },
      crawlerConfigOverrides: {
        maxRequestRetries: 0,
        maxConcurrency: 1,
      } as any,
      onReady: async (actor) => {
        await actor.runCrawler([{ url: `http://127.0.0.1:${port}/?type=basic` }]);
      },
    });

    expect(handlerSpy).toHaveBeenCalledTimes(1);
    expect(handlerSpy).toHaveBeenCalledWith({
      url: `http://127.0.0.1:${port}/?type=basic`,
      hasRequest: true,
    });
  }, 30000);
});
