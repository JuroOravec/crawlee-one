import { createHash } from 'node:crypto';

const REQUEST_ID_LENGTH = 15;

/**
 * Same algorithm as Crawlee memory-storage — requestId is deterministic from uniqueKey
 *
 * See https://github.com/apify/crawlee/blob/adf3daeb0b3000124817b1b2011b2196342e8715/packages/core/src/storages/utils.ts#L107
 */
export function computeRequestIdFromUniqueKey(uniqueKey: string): string {
  const str = createHash('sha256').update(uniqueKey).digest('base64').replace(/[+/=]/g, '');
  return str.length > REQUEST_ID_LENGTH ? str.slice(0, REQUEST_ID_LENGTH) : str;
}
