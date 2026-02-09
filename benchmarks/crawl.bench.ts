/**
 * E2E benchmarks for crawlee-one crawlers.
 *
 * Measures throughput (time per crawl cycle) and peak memory (RSS delta)
 * for each crawler type against a local HTTP server.
 */
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { describe, beforeAll, afterAll } from 'vitest';
import { vi } from 'vitest';

import { measurePerf, measureMemory } from './helpers.js';

import { runCrawleeOne } from '../src/lib/actor/actor.js';
import type {
  CrawleeOneIO,
  CrawleeOneRequestQueue,
  CrawleeOneDataset,
  CrawleeOneKeyValueStore,
} from '../src/lib/integrations/types.js';

// ---------------------------------------------------------------------------
// Mock helpers (same pattern as src/lib/actor/actor.test.ts)
// ---------------------------------------------------------------------------

const createMockRequestQueue = (): CrawleeOneRequestQueue => ({
  addRequests: vi.fn(),
  markRequestHandled: vi.fn(),
  fetchNextRequest: vi.fn().mockResolvedValue(null),
  reclaimRequest: vi.fn(),
  isFinished: vi.fn().mockResolvedValue(true),
  drop: vi.fn(),
  clear: vi.fn(),
  handledCount: vi.fn().mockResolvedValue(0),
});

const createMockDataset = (): CrawleeOneDataset => ({
  pushData: vi.fn(),
  getItems: vi.fn().mockResolvedValue([]),
  getItemCount: vi.fn().mockResolvedValue(0),
});

const createMockKeyValueStore = (): CrawleeOneKeyValueStore => ({
  getValue: vi.fn().mockResolvedValue(null) as any,
  setValue: vi.fn(),
  drop: vi.fn(),
  clear: vi.fn(),
});

const createMockIO = (): CrawleeOneIO<any, any, any> => {
  return {
    openDataset: vi.fn().mockResolvedValue(createMockDataset()),
    openRequestQueue: vi.fn().mockResolvedValue(createMockRequestQueue()),
    openKeyValueStore: vi.fn().mockResolvedValue(createMockKeyValueStore()),
    getInput: vi.fn().mockResolvedValue(null),
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

// ---------------------------------------------------------------------------
// Realistic HTML page (~5 KB -- enough to exercise parsing without being huge)
// ---------------------------------------------------------------------------

const generateHtmlPage = (): string => {
  const items = Array.from({ length: 50 }, (_, i) => {
    return `<li class="item item-${i}">
      <a href="/page/${i}">Item ${i}</a>
      <span class="price">$${(Math.random() * 100).toFixed(2)}</span>
      <p class="desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </li>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Benchmark Test Page</title>
  <meta name="description" content="A realistic page for benchmarking crawlers">
</head>
<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  </header>
  <main>
    <h1>Product Listing</h1>
    <p>Showing 50 items for benchmarking purposes.</p>
    <ul class="product-list">
      ${items}
    </ul>
  </main>
  <footer>
    <p>&copy; 2026 Benchmark Corp. All rights reserved.</p>
  </footer>
</body>
</html>`;
};

const HTML_PAGE = generateHtmlPage();

// ---------------------------------------------------------------------------
// Shared server setup
// ---------------------------------------------------------------------------

let server: http.Server;
let port: number;

// Counter to generate unique URLs per bench iteration (avoids Crawlee dedup)
let reqCounter = 0;

beforeAll(async () => {
  server = http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML_PAGE);
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

// ---------------------------------------------------------------------------
// Helper: run a single crawl cycle
// ---------------------------------------------------------------------------

const crawlOnce = async (actorType: string, handler: (ctx: any) => void) => {
  const io = createMockIO();
  const id = ++reqCounter;

  await runCrawleeOne({
    actorType: actorType as any,
    actorConfig: {
      io,
      routes: {
        MAIN: {
          match: /127\.0\.0\.1/,
          handler: async (ctx: any) => handler(ctx),
        },
      },
    },
    crawlerConfigOverrides: {
      maxRequestRetries: 0,
      maxConcurrency: 1,
    } as any,
    onReady: async (actor) => {
      await actor.runCrawler([{ url: `http://127.0.0.1:${port}/?bench=${actorType}&id=${id}` }]);
    },
  });
};

// ---------------------------------------------------------------------------
// Throughput benchmarks
// ---------------------------------------------------------------------------

describe('crawler throughput', () => {
  measurePerf(
    'cheerio crawl + parse',
    'Cheerio crawl + parse',
    async () => {
      await crawlOnce('cheerio', (ctx) => {
        // Exercise the Cheerio API
        ctx.$('title').text();
        ctx.$('h1').text();
        ctx.$('.product-list .item').length;
      });
    },
    { iterations: 5, time: 0 }
  );

  measurePerf(
    'http crawl',
    'HTTP crawl',
    async () => {
      await crawlOnce('http', (ctx) => {
        // Access raw body
        const body = typeof ctx.body === 'string' ? ctx.body : ctx.body?.toString();
        body?.includes('<title>');
      });
    },
    { iterations: 5, time: 0 }
  );

  measurePerf(
    'jsdom crawl + parse',
    'JSDOM crawl + parse',
    async () => {
      await crawlOnce('jsdom', (ctx) => {
        // Exercise the JSDOM API
        ctx.window?.document?.title;
        ctx.window?.document?.querySelector('h1')?.textContent;
      });
    },
    { iterations: 5, time: 0 }
  );

  measurePerf(
    'basic crawl',
    'Basic crawl',
    async () => {
      await crawlOnce('basic', (ctx) => {
        // Access request context
        ctx.request.url;
      });
    },
    { iterations: 5, time: 0 }
  );
});

// ---------------------------------------------------------------------------
// Memory benchmarks
//
// vitest bench measures timing. For memory we use a workaround: each
// "bench" records peak memory (RSS) delta and stores it in a global map via the
// measureMemory helper. The transform step later reads the sidecar to
// merge memory data into the rich results.
// ---------------------------------------------------------------------------

describe('crawler memory', () => {
  measureMemory(
    'cheerio peak memory',
    'Cheerio peak memory',
    async () => {
      await crawlOnce('cheerio', (ctx) => {
        ctx.$('title').text();
        ctx.$('.product-list .item').length;
      });
    },
    { iterations: 3, time: 0 }
  );

  measureMemory(
    'http peak memory',
    'HTTP peak memory',
    async () => {
      await crawlOnce('http', (ctx) => {
        const body = typeof ctx.body === 'string' ? ctx.body : ctx.body?.toString();
        body?.includes('<title>');
      });
    },
    { iterations: 3, time: 0 }
  );

  measureMemory(
    'jsdom peak memory',
    'JSDOM peak memory',
    async () => {
      await crawlOnce('jsdom', (ctx) => {
        ctx.window?.document?.title;
      });
    },
    { iterations: 3, time: 0 }
  );

  measureMemory(
    'basic peak memory',
    'Basic peak memory',
    async () => {
      await crawlOnce('basic', (ctx) => {
        ctx.request.url;
      });
    },
    { iterations: 3, time: 0 }
  );
});
