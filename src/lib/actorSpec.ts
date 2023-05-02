import type { DatasetPerfStat, ScraperActorSpec, ScraperDataset } from 'actor-spec';

/**
 * Scraper actor spec with additional dataset perf stats info for formatting in tables
 *
 * See {@link ScraperActorSpec}
 */
export interface ApifyScraperActorSpec extends ScraperActorSpec {
  datasets: ScraperDataset[];
}

/** Dataset with additional perf stats info for formatting in tables */
export interface ApifyScraperDataset extends ScraperDataset {
  perfStats: ApifyDatasetPerfStat[];
}

/** Dataset perf stats with additional info for formatting in tables */
export interface ApifyDatasetPerfStat extends DatasetPerfStat {
  rowId: string;
  colId: string;
}