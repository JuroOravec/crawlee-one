/**
 * Shared response cache logic for dev mode.
 *
 * Both HTTP crawlers (devHttpClient) and browser crawlers (devNavigationHandler)
 * store responses in sidecar files ({requestId}.response.json) next to request
 * queue entries. This module provides the common load/save primitives.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

import type { RequestQueue } from 'crawlee';

import type { HttpResponse } from '../../types.js';
import { computeRequestIdFromUniqueKey } from './utils.js';

/** Key used in request.userData for cached response (fallback when no sidecar file). */
export const USER_DATA_RESPONSE_KEY = 'response';

export function getResponseCachePath(responseCacheDir: string, requestId: string): string {
  return path.join(responseCacheDir, `${requestId}.response.json`);
}

/** Options for loadCachedResponse */
export interface LoadCachedResponseOpts {
  responseCacheDir: string;
  devQueue: RequestQueue;
  uniqueKey: string;
}

/**
 * Load a cached response: try sidecar file first, fall back to userData.
 */
export async function loadCachedResponse(
  opts: LoadCachedResponseOpts
): Promise<HttpResponse | null> {
  const { responseCacheDir, devQueue, uniqueKey } = opts;
  const requestId = computeRequestIdFromUniqueKey(uniqueKey);
  const filePath = getResponseCachePath(responseCacheDir, requestId);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as HttpResponse;
  } catch {
    const request = await devQueue.getRequest(requestId);
    const userDataResponse = request?.userData?.[USER_DATA_RESPONSE_KEY];
    return (userDataResponse as HttpResponse) ?? null;
  }
}

/** Options for saveResponseToCache */
export interface SaveResponseToCacheOpts {
  responseCacheDir: string;
  uniqueKey: string;
  response: HttpResponse;
}

/**
 * Write response to sidecar file. Caller is responsible for ensuring the
 * request exists in the queue and for any userData/updateRequest handling.
 */
export async function saveResponseToCache(opts: SaveResponseToCacheOpts): Promise<void> {
  const { responseCacheDir, uniqueKey, response } = opts;
  const requestId = computeRequestIdFromUniqueKey(uniqueKey);
  await writeResponseToCache({ responseCacheDir, requestId, response });
}

async function writeResponseToCache(opts: {
  responseCacheDir: string;
  requestId: string;
  response: HttpResponse;
}): Promise<void> {
  const { responseCacheDir, requestId, response } = opts;
  const filePath = getResponseCachePath(responseCacheDir, requestId);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(response), 'utf-8');
}
