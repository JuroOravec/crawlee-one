import { Actor, DatasetDataOptions } from 'apify';

/**
 * Given an ID of an Apify Dataset and a name of a field,
 * get the columnar data.
 *
 * Example:
 * ```js
 * // Given dataset
 * // [
 * //   { id: 1, field: 'abc' },
 * //   { id: 2, field: 'def' }
 * // ]
 * const results = await getColumnFromDataset('datasetId123', 'field');
 * console.log(results)
 * // ['abc', 'def']
 * ```
 */
export const getColumnFromDataset = async (
  datasetId: string,
  field: string,
  options?: { dataOptions?: Pick<DatasetDataOptions, 'offset' | 'limit' | 'desc'> }
) => {
  const dataset = await Actor.openDataset(datasetId);
  const result = await dataset.getData({
    ...options?.dataOptions,
    fields: [field],
    skipEmpty: true,
  });
  const data = result.items.map((d) => d[field]);
  return data;
};
