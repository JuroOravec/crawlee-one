/**
 * Clear dev storage for given crawlers.
 *
 * Removes:
 * - storage/datasets/dev-{crawler}-* — dev datasets for each route
 * - storage/request_queues/dev-{crawler} — dev request queue
 *
 * Only removes these specific patterns; does not delete other datasets or queues.
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * Clear dev datasets and request queue for the given crawler names.
 *
 * @param storageDir — Base storage directory (e.g. configDir/storage or APIFY_LOCAL_STORAGE_DIR)
 * @param crawlerNames — Crawler names to clear (e.g. ['guidechem', 'profesia'])
 */
export function clearDevStorage(storageDir: string, crawlerNames: string[]): void {
  const datasetsDir = path.join(storageDir, 'datasets');
  const requestQueuesDir = path.join(storageDir, 'request_queues');

  for (const name of crawlerNames) {
    const datasetPrefix = `dev-${name}-`;
    const queueName = `dev-${name}`;

    // Clear datasets: dev-{name}-* (e.g. dev-guidechem-casListing)
    if (fs.existsSync(datasetsDir)) {
      const entries = fs.readdirSync(datasetsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name.startsWith(datasetPrefix)) {
          const dirPath = path.join(datasetsDir, entry.name);
          fs.rmSync(dirPath, { recursive: true });
          console.log(`[crawlee-one] Cleared dataset: ${entry.name}`);
        }
      }
    }

    // Clear request queue: dev-{name}
    const queuePath = path.join(requestQueuesDir, queueName);
    if (fs.existsSync(queuePath)) {
      fs.rmSync(queuePath, { recursive: true });
      console.log(`[crawlee-one] Cleared request queue: ${queueName}`);
    }
  }
}
