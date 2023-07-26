import { Actor, Log } from 'apify';

/**
 * Given a batch of entries, use several strategies to check
 * if we've reached the limit on the max number of entries
 * we're allowed to extract this run.
 */
export const checkEntriesCount = async (
  {
    maxCount,
    currBatchCount,
    datasetNameOrId,
    customItemCount,
  }: {
    /** Number of entries in the current batch */
    currBatchCount: number;
    /** Max number of entries allowed to extract. */
    maxCount?: number | null;
    /**
     * If given, maxCount will be ALSO compared against
     * the amount of entries already in the dataset.
     */
    datasetNameOrId?: string | null;
    /**
     * If given, maxCount will be ALSO compared against
     * this amount.
     */
    customItemCount?: number | null;
  },
  { log }: { log?: Log } = {}
) => {
  const datasetItemCount = datasetNameOrId ? await getDatasetCount(datasetNameOrId, { log }) : null;

  if ((datasetItemCount == null && customItemCount == null) || maxCount == null) {
    return { limitReached: false, overflow: 0 };
  }

  // Check if we've reached the limit for max entries
  if (currBatchCount >= maxCount) {
    return { limitReached: true, overflow: currBatchCount - maxCount };
  }

  // Use count of items already in dataset to check if limit reached
  if (datasetItemCount != null && datasetItemCount + currBatchCount >= maxCount) {
    return { limitReached: true, overflow: datasetItemCount + currBatchCount - maxCount };
  }

  // Use page offset to check if limit reached (20 entries per page)
  if (customItemCount != null && customItemCount >= maxCount) {
    return { limitReached: true, overflow: customItemCount - maxCount };
  }

  return { limitReached: false, overflow: 0 };
};

export const getDatasetCount = async (datasetNameOrId?: string, { log }: { log?: Log } = {}) => {
  log?.debug('Opening dataset');
  const dataset = await Actor.openDataset(datasetNameOrId);
  log?.debug('Obtaining dataset entries count');
  const datasetInfo = await dataset.getInfo();
  const count = datasetInfo?.itemCount ?? null;
  if (typeof count !== 'number') {
    log?.warning('Failed to get count of entries in dataset. We use this info to know how many items were scraped. More entries might be scraped than was set.'); // prettier-ignore
  } else {
    log?.debug(`Done obtaining dataset entries count (${count})`);
  }
  return count;
};
