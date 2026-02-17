import { Dataset } from 'crawlee';
import type { CrawleeOneDataset } from '../integrations/types.js';

// NOTE: Uses Crawlee `Dataset` directly for local storage
// to ensure correct pagination (Apify `Actor.openDataset()` when not initialized
// may behave differently). Works with both local and cloud via same storage config.

/**
 * Open a dataset for export. Uses Crawlee's Dataset.open which respects
 * APIFY_LOCAL_STORAGE_DIR (local) or APIFY_TOKEN (cloud).
 */
export async function openDatasetForExport(datasetId: string): Promise<CrawleeOneDataset> {
  const dataset = await Dataset.open(datasetId);
  const getItemCount = async () => (await dataset.getInfo())?.itemCount ?? null;
  const getItems: CrawleeOneDataset['getItems'] = async (options) => {
    const result = await dataset.getData({
      ...options,
      skipEmpty: true,
    });
    return result.items;
  };
  return {
    pushData: dataset.pushData.bind(dataset),
    getItems,
    getItemCount,
  };
}
