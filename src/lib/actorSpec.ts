import type { DatasetPerfStat, ScraperActorSpec, ScraperDataset } from 'actor-spec';

/**
 * Scraper actor spec with additional dataset perf stats info for formatting in tables
 *
 * See {@link ScraperActorSpec}
 */
export interface CrawleeOneScraperActorSpec extends ScraperActorSpec {
  datasets: CrawleeOneScraperDataset[];
}

/** Dataset with additional perf stats info for formatting in tables */
export interface CrawleeOneScraperDataset extends ScraperDataset {
  perfStats: CrawleeOneDatasetPerfStat[];
  /** Specify which perfTable should render this data */
  perfTable: string;
}

/** Dataset perf stats with additional info for formatting in tables */
export interface CrawleeOneDatasetPerfStat extends DatasetPerfStat {
  rowId: string;
  colId: string;
}
