import fs from 'node:fs/promises';
import path from 'node:path';

import { Request, type RequestQueue } from 'crawlee';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createDevHttpClient, devRequestStore } from './devHttpClient.js';
import { computeRequestIdFromUniqueKey } from './utils.js';

describe('utils', () => {
  describe('computeRequestIdFromUniqueKey', () => {
    it('returns deterministic id for same uniqueKey', () => {
      const id1 = computeRequestIdFromUniqueKey('https://example.com');
      const id2 = computeRequestIdFromUniqueKey('https://example.com');
      expect(id1).toBe(id2);
    });

    it('returns different ids for different uniqueKeys', () => {
      const id1 = computeRequestIdFromUniqueKey('https://example.com/a');
      const id2 = computeRequestIdFromUniqueKey('https://example.com/b');
      expect(id1).not.toBe(id2);
    });

    it('produces ids of length 15 (Crawlee memory-storage compatible)', () => {
      const id = computeRequestIdFromUniqueKey('https://example.com/page');
      expect(id.length).toBe(15);
    });
  });
});

describe('createDevHttpClient', () => {
  let responseCacheDir: string;
  const mockRequestQueue = {
    getRequest: vi.fn(),
  } as unknown as RequestQueue;

  const mockUnderlying = {
    stream: vi.fn(),
    sendRequest: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    responseCacheDir = path.join(
      process.cwd(),
      'node_modules/.tmp/dev-http-client-test-' + Date.now()
    );
    await fs.mkdir(responseCacheDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(responseCacheDir, { recursive: true, force: true }).catch(() => {});
  });

  describe('stream() with AsyncLocalStorage', () => {
    it('uses request.uniqueKey from store when available (custom uniqueKey from sampleUrls)', async () => {
      const customUniqueKey = 'my-custom-key-from-request-options';
      const requestId = computeRequestIdFromUniqueKey(customUniqueKey);
      const cachedResponse = {
        statusCode: 200,
        headers: {},
        body: '<html><body>Cached from custom key</body></html>',
      };
      await fs.writeFile(
        path.join(responseCacheDir, `${requestId}.response.json`),
        JSON.stringify(cachedResponse),
        'utf-8'
      );

      const request = new Request({
        url: 'https://example.com/different-url',
        uniqueKey: customUniqueKey,
      });

      const client = createDevHttpClient({
        underlying: mockUnderlying as any,
        devQueue: mockRequestQueue,
        responseCacheDir,
      });

      const result = await devRequestStore.run(request, () =>
        client.stream({ url: 'https://example.com/different-url' })
      );

      expect(mockUnderlying.stream).not.toHaveBeenCalled();
      expect(result.statusCode).toBe(200);
      const chunks: Buffer[] = [];
      for await (const chunk of result.stream!) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      expect(Buffer.concat(chunks).toString('utf-8')).toBe(cachedResponse.body);
    });

    it('falls back to computed uniqueKey when no request in store', async () => {
      const url = 'https://example.com/no-store';
      const derivedKey = url;
      const requestId = computeRequestIdFromUniqueKey(derivedKey);
      const cachedResponse = {
        statusCode: 200,
        headers: {},
        body: '<html>From derived key</html>',
      };
      await fs.writeFile(
        path.join(responseCacheDir, `${requestId}.response.json`),
        JSON.stringify(cachedResponse),
        'utf-8'
      );

      const client = createDevHttpClient({
        underlying: mockUnderlying as any,
        devQueue: mockRequestQueue,
        responseCacheDir,
      });

      const result = await client.stream({ url });

      expect(mockUnderlying.stream).not.toHaveBeenCalled();
      const chunks: Buffer[] = [];
      for await (const chunk of result.stream!) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      expect(Buffer.concat(chunks).toString('utf-8')).toBe(cachedResponse.body);
    });
  });

  describe('sendRequest()', () => {
    it('derives uniqueKey from options only (ignores AsyncLocalStorage)', async () => {
      mockUnderlying.sendRequest.mockResolvedValue({
        statusCode: 200,
        headers: {},
        body: '<html>live</html>',
      });

      vi.mocked(mockRequestQueue.getRequest).mockResolvedValue(
        new Request({ url: 'https://example.com/detail' })
      );

      const client = createDevHttpClient({
        underlying: mockUnderlying as any,
        devQueue: mockRequestQueue,
        responseCacheDir,
      });

      const result = await client.sendRequest({
        url: 'https://example.com/detail',
      });

      expect(mockUnderlying.sendRequest).toHaveBeenCalledWith({
        url: 'https://example.com/detail',
      });
      expect(result.body).toBe('<html>live</html>');
    });
  });
});
