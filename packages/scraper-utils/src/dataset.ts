import type { Log } from 'apify';
import type { CrawleeOneIO } from 'crawlee-one';

/**
 * Given a Dataset ID, get the number of entries already in the Dataset.
 *
 * Requires a `CrawleeOneIO` instance -- typically passed from the actor context.
 */
export const getDatasetCount = async (
  datasetNameOrId?: string,
  options?: { io: CrawleeOneIO; log?: Log }
) => {
  const { io, log } = options ?? {};
  if (!io) throw new Error('getDatasetCount requires an io option');

  log?.debug('Opening dataset');
  const dataset = await io.openDataset(datasetNameOrId);
  log?.debug('Obtaining dataset entries count');
  const count = await dataset.getItemCount();
  if (typeof count !== 'number') {
    log?.warning('Failed to get count of entries in dataset. We use this info to know how many items were scraped. More entries might be scraped than was set.'); // prettier-ignore
  } else {
    log?.debug(`Done obtaining dataset entries count (${count})`);
  }
  return count;
};
