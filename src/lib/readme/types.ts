import { ArrVal, enumFromArray } from '../../utils/types';

export const README_FEATURE_TYPE = ['datasets', 'modes', 'filters', 'noBrowser', 'proxy', 'crawlerConfig', 'tests', 'privacy', 'errorMonitoring'] as const; // prettier-ignore
export const README_FEATURE_TYPE_ENUM = enumFromArray(README_FEATURE_TYPE);
export type ReadmeFeatureType = ArrVal<typeof README_FEATURE_TYPE>;

export const README_HOOK_TYPE = ['introActorLongDesc', 'introAfterDatasets', 'useCases', 'costAfterPerfTables', 'costBeforeEnd', 'inputAfterLimit'] as const; // prettier-ignore
export const README_HOOK_TYPE_ENUM = enumFromArray(README_HOOK_TYPE);
export type ReadmeHookType = ArrVal<typeof README_HOOK_TYPE>;

/**
 * Defines how to render a feature block for Apify actor README.
 *
 * Example rendered output:
 * ```markdown
 * - **3 kinds of datasets**
 *   - test1
 *   - Scrape details of organisations, researchers or projects.
 *   - test2
 * ```
 */
export interface ReadmeFeature<TData extends any = any> {
  /** Feature is considered supported by this actor if truthy value is returned. */
  supported: (it) => any;
  /**
   * Title template string for the feature. E.g.
   * ```js
   * '<%~ it.a.datasets.length %> kinds of datasets'
   * ```
   * */
  title: string;
  /**
   * Template string that goes BEFORE the mainText. E.g.
   * ```js
   * '- Scrape details of <%~ it.fn.enumerate(it.a.datasets.map((d) => d.name)) %>.'
   * ```
   */
  afterBegin?: string;
  /**
   * Main body template string for the feature. E.g.
   * ```js
   * '- Scrape details of <%~ it.fn.enumerate(it.a.datasets.map((d) => d.name)) %>.'
   * ```
   */
  mainText: string;
  /**
   * Template string that goes AFTER the mainText. E.g.
   * ```js
   * '- Scrape details of <%~ it.fn.enumerate(it.a.datasets.map((d) => d.name)) %>.'
   * ```
   */
  beforeEnd?: string;
  /**
   * If you need to store/access some variables during render, use this object.
   *
   * E.g.
   * ```js
   * filters: {
   *   supported: (it) => it.a.datasets.some((d) => d.filters.length),
   *   title: 'Filter support',
   *   mainText:
   *     `- Filter the results by <%~ it.fn.enumerate(it.fn.collectFilters(it)) %>.\n` +
   *     `<% if (it.t.features.filters.data.maxEntriesSupported) { %>\n` +
   *     `  - Limit the number of results.\n` +
   *     `<% } %>`,
   *   data: {
   *     maxEntriesSupported: true,
   *   },
   * },
   * ```
   */
  data?: TData;
}

/**
 * Defines how to render an example input block for Apify actor README.
 *
 * Example rendered output:
 * ```markdown
 * #### Example 2: Same as above, but specified by providing a start URL
 *
 * ```json
 * {
 *   "startUrls": [
 *     "https://www.skcris.sk/portal/web/guest/register-organizations"
 *   ],
 *   // Omit relationships to other entries
 *   "entryIncludeLinkedResources": false,
 *   "listingFilterMaxCount": 200,
 *   "listingItemsPerPage": 200,
 * }
 * ```
 */
export interface ReadmeExampleInput<TData extends object = object> {
  /**
   * Title of the example, e.g.
   *
   * ```js
   * `Get first 200 organisations (fast mode)`
   * ```
   */
  title: string;
  /** Example input data */
  inputData: TData;
  /**
   * Comments related to individual fields of `inputData`
   *
   * These comments may be rendered as such:
   *
   * ```json
   * {
   *   "inputDataField1": 22,
   *   // This is a comment from inputDataComments.inputDataField2
   *   "inputDataField2": "Value from inputData.inputDataField2"
   * }
   * ```
   */
  inputDataComments: Partial<Record<keyof TData, string>>;
}

/** Defines how to render the Apify actor README. */
export interface ApifyReadmeTemplates {
  input: {
    /**
     * ID (key on input JSON) of the actor input that sets the max number of entries.
     *
     * E.g. `'listingFilterMaxCount'`
     */
    maxCount: string;
    /**
     * Name (as mentioned in UI) of the actor input that sets to include personal data.
     *
     * E.g. `'Include personal data'`
     */
    privacyName: string;
  };
  /** Configure how to render the performance/cost tables */
  perfTable: {
    /**
     * Map rowIds to header text. E.g.
     * ```ts
     * [
     *   { rowId: 'fast', template: 'Fast run' },
     *   { rowId: 'detailed', template: 'Detailed run' },
     * ]
     * ```
     */
    rows: {
      rowId: string;
      template: string;
    }[];
    /**
     * Map colIds to header text. E.g.
     * ```ts
     * [
     *   { colId: '100items', template: '100 results' },
     *   { colId: 'fullRun', template: 'Full run (~ <%~ it.fn.millify(it.dataset.size) %> results)' },
     * ]
     * ```
     */
    cols: {
      colId: string;
      template: string;
    }[];
  };
  /** Configure how to render readme actor features */
  features: Record<ReadmeFeatureType, ReadmeFeature>;
  /** Configure how to render readme example inputs */
  exampleInputs: ReadmeExampleInput[];
  /**
   * Hooks are various places throughout the README template
   * where you can insert own text
   *
   * Just as other templates, the hooks receive the whole context (`it`)
   */
  hooks?: Partial<Record<ReadmeHookType, string>>;
}