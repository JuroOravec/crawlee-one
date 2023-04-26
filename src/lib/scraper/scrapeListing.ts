import { findLastIndex } from 'lodash';

import { serialAsyncMap, retryAsync } from '../../utils/async';
import { validateUrl } from '../../utils/url';
import type { MaybePromise } from '../../utils/types';

export interface ListingLogger {
  debug: (msg: string, data?: any) => void;
  info: (msg: string, data?: any) => void;
  warning: (msg: string, data?: any) => void;
  error: (msg: string, data?: any) => void;
}

export interface ListingPageFilter {
  name: string;
  disabled?: boolean;
  initState: () => MaybePromise<boolean>;
  resetState: () => MaybePromise<void>;
  nextState: () => MaybePromise<void>;
  hasNextState: () => MaybePromise<boolean>;
  hasState: () => MaybePromise<boolean>;
  loadState: () => MaybePromise<void>;
}

export interface ListingFiltersSetupOptions<Ctx extends object, UrlType> {
  context: ListingPageScraperContext<Ctx, UrlType>;
  filters?: ListingPageFilter[];
  shouldApplyFilter?: (
    context: ListingPageScraperContext<Ctx, UrlType>,
    filter: ListingPageFilter,
    filters: ListingPageFilter[]
  ) => MaybePromise<boolean>;
  onResetFilters?: (context: ListingPageScraperContext<Ctx, UrlType>) => MaybePromise<void>;
  onFiltersLoaded?: (context: ListingPageScraperContext<Ctx, UrlType>) => MaybePromise<void>;
  log: ListingLogger;
}

type ListingFilterController = Pick<ListingPageFilter, 'loadState' | 'nextState' | 'hasNextState' | 'hasState'>; // prettier-ignore

export interface ListingPageScraperContext<Ctx extends object, UrlType> {
  context: Ctx;
  log: ListingLogger;
  startUrl: UrlType;
  filters: ListingPageFilter[];
  /** Use this if you need to load filters again (eg after reloading page manually) */
  loadFilterState: () => MaybePromise<void>;
  /** Call this function from any callback to stop scraping */
  abort: () => void;
}

// prettier-ignore
export interface ListingPageScraperOptions<Ctx extends object, UrlType> extends Omit<ListingFiltersSetupOptions<Ctx, UrlType>, 'context'> {
  context: Ctx;
  startUrls: UrlType[];
  listingCountOnly?: boolean;
  /** Get ID of the current page in the pagination, so it can be logged */
  pageId?: (context: ListingPageScraperContext<Ctx, UrlType>) => MaybePromise<string>;
  log: ListingLogger;

  onNavigate?: (context: ListingPageScraperContext<Ctx, UrlType>, url: UrlType) => MaybePromise<void>;
  /**
   * Hook triggered after navigating to the url using Page.goto().
   *
   * One use of this hook is to conditionally disable/enable filters based on the page content.
   **/
  onAfterNavigation?: (context: ListingPageScraperContext<Ctx, UrlType>) => MaybePromise<void>;

  /** How many attempts are retried after filters failed to load. Defaults to 3 */
  loadFiltersRetries?: number;
  /**
   * Hook triggered after a failed attempt at loading listings page filters.
   *
   * One use of this hook is to reload the page on failed attemp in case something didn't load correctly.
   **/
  onLoadFiltersError?: (
    context: ListingPageScraperContext<Ctx, UrlType>,
    error: any,
    retryIndex: number
  ) => MaybePromise<void>;

  /** Main logic to extract entries from a page */
  extractEntries: (context: ListingPageScraperContext<Ctx, UrlType>, retryIndex: number) => MaybePromise<UrlType[]>;
  /** How many attempts are retried after failed to scrape entries from a listing. Defaults to 3 */
  extractEntriesRetries?: number;
  /**
   * Hook triggered after a failed attempt at scraping entries from a listing.
   *
   * One use of this hook is to reload the page on failed attemp in case something didn't load correctly.
   **/
  onExtractEntriesError?: (
    context: ListingPageScraperContext<Ctx, UrlType>,
    error: any,
    retryIndex: number
  ) => MaybePromise<void>;
  onExtractEntriesDone?: (
    context: ListingPageScraperContext<Ctx, UrlType>,
    entries: UrlType[] | null
  ) => MaybePromise<void>;

  /**
   * If goToNextPage hook is defined, it will be called after each page. To indicate that there's no more
   * pages left, throw an error.
   **/
  onGoToNextPage?: (
    context: ListingPageScraperContext<Ctx, UrlType>,
    entries: UrlType[] | null
  ) => MaybePromise<void>;
  /** How long to wait after we've navigated to the next page and before we start extracting? */
  nextPageWait?: number;
}

/**
 * Given configuration for listing page filters, set up functions to
 * navigate through the different states of filters, to allow to paginate
 * through all states.
 */
const setupListingFilters = <Ctx extends object, UrlType>({
  context,
  filters = [],
  shouldApplyFilter,
  onResetFilters,
  onFiltersLoaded,
  log,
}: ListingFiltersSetupOptions<Ctx, UrlType>): ListingFilterController => {
  let filtersStack: ListingPageFilter[] = filters;

  const getNextFilterStateChangeIndex = async () => {
    const hasNextStates = await serialAsyncMap(filtersStack, (filter) => filter.hasNextState());
    return findLastIndex(hasNextStates, (x) => x);
  };

  const hasState = async () => {
    const hasStates = await serialAsyncMap(filtersStack, (filter) => filter.hasState());
    return hasStates.some(Boolean);
  };

  const hasNextState = async () => {
    const nextFilterStateChangeIndex = await getNextFilterStateChangeIndex();
    return nextFilterStateChangeIndex > -1;
  };

  const nextState = async () => {
    // Imagine we have 4 filters, each has 3 states (eg 3 options to select from)
    // We start with all filters in the first state:
    //   State 1: F1(1), F2(1), F3(1), F4(1)
    // As we progress, we increment it akin to numbers:
    //   State 2: F1(1), F2(1), F3(1), F4(2)
    //   State 3: F1(1), F2(1), F3(1), F4(3)
    //   State 4: F1(1), F2(1), F3(2), F4(1)
    // All the way to the last state:
    //   State n: F1(3), F2(3), F3(3), F4(3)
    //
    // When we want move to a next state, we identify the RIGHT-most filter
    // whose state can be incremented (in this case we select F2):
    //             YES    YES     NO    NO
    //   State x: F1(1), F2(2), F3(3), F4(3)
    //
    // When we increment a filter state, all the other filter to the RIGHT
    // will be reset:
    //   State x:   F1(1), F2(2), F3(3), F4(3)
    //   State x+1: F1(1), F2(3), F3(1), F4(1)

    const initStates = await serialAsyncMap(filtersStack, (filter) => filter.initState());
    if (initStates.some(Boolean)) return log.info('Initialised filters');

    const nextFilterStateChangeIndex = await getNextFilterStateChangeIndex();
    if (nextFilterStateChangeIndex === -1)
      throw Error('Cannot select next filter state - reached end of list');

    const filterToNextState = filtersStack[nextFilterStateChangeIndex];
    const filtersToReset = filtersStack.slice(nextFilterStateChangeIndex + 1);

    log.info('Setting filters to next state');
    await filterToNextState.nextState();
    for (const filter of filtersToReset) {
      await filter.resetState();
      await filter.nextState();
    }
  };

  /** Load current filter state in the webpage */
  const loadState = async () => {
    await resetState();

    // Load filters one by one, and only if needed
    filtersStack = [];
    for (const filter of filters) {
      const shouldUseFilter = shouldApplyFilter
        ? await shouldApplyFilter(context, filter, filters)
        : true;
      if (!shouldUseFilter) {
        log.info(`Not applying filter "${filter.name}" or further filters`);
        break;
      }

      if (!filter.disabled) {
        log.info(`Applying filter "${filter.name}"`);
        await filter.loadState();
      } else {
        log.info(`Filter "${filter.name}" recognised but not applied because it is disabled`);
      }

      filtersStack.push(filter);
    }

    log.info(`Done loading filters`);
    await onFiltersLoaded?.(context);
  };

  /** Reset filter state */
  const resetState = async () => {
    log.info(`Resetting filter state`);
    await onResetFilters?.(context);
    filtersStack = filters;
    log.info(`Resetting filter state done`);
  };

  return {
    loadState,
    nextState,
    hasNextState,
    hasState,
  };
};

/** Get entries from a listing page (eg URLs to profiles that should be scraped later) */
export const scrapeListingEntries = async <Ctx extends object, UrlType>(
  options: ListingPageScraperOptions<Ctx, UrlType>
) => {
  const {
    context,
    startUrls,
    listingCountOnly = false,
    log,
    pageId,
    onNavigate,
    onAfterNavigation,

    filters = [],
    shouldApplyFilter,
    loadFiltersRetries = 3,
    onLoadFiltersError = (_, err) => console.error(err),
    onFiltersLoaded,
    onResetFilters,

    extractEntries,
    extractEntriesRetries = 3,
    onExtractEntriesError = (_, err) => console.error(err),
    onExtractEntriesDone,

    onGoToNextPage,
    nextPageWait = 500,
  } = options;

  /** Collection of ALL urls across all pages and startUrls */
  const links: UrlType[] = [];

  await serialAsyncMap(startUrls, async (startUrl, index) => {
    if (listingCountOnly && index > 0) return;

    const logId = `${startUrl} (${index + 1}/${startUrls.length})`;

    let userAskedToStop = false;
    const abort = () => { userAskedToStop = true }; // prettier-ignore

    // Prepare context shared across all hooks
    let filterObj: ListingFilterController | null = null;
    const genCtxArg = (): ListingPageScraperContext<Ctx, UrlType> => ({
      context,
      log,
      startUrl,
      filters,
      loadFilterState: filterObj?.loadState ?? (() => {}),
      abort,
    });

    log.debug(`Validating URL ${logId}`);
    validateUrl(startUrl as string);
    log.info(`Navigating URL ${logId}`);
    await onNavigate?.(genCtxArg(), startUrl);
    log.debug(`Done navigating to URL ${logId}`);

    filterObj = setupListingFilters({
      context: genCtxArg(),
      filters,
      shouldApplyFilter,
      onFiltersLoaded,
      onResetFilters,
      log,
    });

    log.debug(`Calling onAfterNavigation callback. URL ${logId}`); // prettier-ignore
    await onAfterNavigation?.(genCtxArg());
    log.debug(`Done calling onAfterNavigation callback. URL ${logId})`); // prettier-ignore

    const isUsingFilters = filters.some((filter) => !filter.disabled);

    let hasFilterStatesToProcess = true;
    while (hasFilterStatesToProcess && !userAskedToStop) {
      // Filter loop
      // Load filters before we start paginating
      log.info(`Setting up filters for URL ${logId}`);
      await retryAsync(
        async () => {
          if (!filterObj) throw Error(`Filter controller is missing. This should never happen. URL ${logId}`); // prettier-ignore

          const filterHasState = await filterObj.hasState();
          if (!isUsingFilters || !filterHasState) {
            log.info(`Not loading filters for URL ${logId}`);
            return;
          }

          log.debug(`Loading filters for URL ${logId}`);
          await filterObj.nextState();
          await filterObj.loadState();
          log.debug(`Done loading filters for URL ${logId}`);
        },
        {
          maxRetries: loadFiltersRetries,
          onError: (err, retryIndex) => onLoadFiltersError(genCtxArg(), err, retryIndex),
        }
      );

      let nextPageAvailable = true;
      while (nextPageAvailable && !userAskedToStop) {
        // Pagination loop
        let currPageId = 'next page';
        if (pageId) {
          log.debug(`Loading pageId for URL ${logId}`);
          currPageId = await pageId(genCtxArg());
          log.debug(`Done loading pageId for URL ${logId}`);
        }
        const pageLogId = `${logId} (${currPageId})`;

        // Extract page links
        log.info(`Extracting links from page ${pageLogId}`);
        const { result } = await retryAsync(
          async (retryIndex) => extractEntries(genCtxArg(), retryIndex),
          {
            maxRetries: extractEntriesRetries,
            onError: (err, retryIndex) => onExtractEntriesError(genCtxArg(), err, retryIndex),
          }
        );
        log.debug(`Done extracting links from page ${pageLogId}`);

        const pageLinks = result ?? [];
        links.push(...pageLinks);
        log.info(`Found ${pageLinks.length} links on page ${pageLogId}`);

        // Leave after printing the count or on abort
        if (listingCountOnly || userAskedToStop) {
          nextPageAvailable = false;
          if (listingCountOnly) log.info(`Debugging mode. Entries are not scraped. Leaving now. URL ${pageLogId}`); // prettier-ignore
          else if (userAskedToStop) log.info(`Aborting. URL ${pageLogId}`);
          continue;
        }

        log.debug(`Calling onExtractEntriesDone callback. URL ${pageLogId}`); // prettier-ignore
        await onExtractEntriesDone?.(genCtxArg(), pageLinks);
        log.debug(`Done calling onExtractEntriesDone callback. URL ${pageLogId}`); // prettier-ignore

        if (onGoToNextPage && !userAskedToStop) {
          // If goToNextPage hook is defined, this will be called after each page, until it errors
          try {
            log.info(`Navigating to next page from URL ${pageLogId}`);
            await onGoToNextPage(genCtxArg(), pageLinks);
            log.debug(`Done navigating to next page from URL ${pageLogId}`); // prettier-ignore
          } catch (e) {
            log.info(`Failed navigating to next page from URL ${pageLogId}`); // prettier-ignore
            log.error((e as Error).toString());
            nextPageAvailable = false;
          }
        } else {
          if (userAskedToStop) log.info(`Aborting. URL ${pageLogId}`);
          nextPageAvailable = false;
        }

        // Wait before we start scraping the next page
        await new Promise((res) => setTimeout(res, nextPageWait));
      }

      // Break out if we're not using filters or we've gone through them all
      log.debug(`Checking if there are more filter states available for URL ${logId}`);
      hasFilterStatesToProcess = isUsingFilters && (await filterObj.hasNextState());
      log.debug(`Done checking if there are more filter states available for URL ${logId}`);

      if (hasFilterStatesToProcess) {
        if (!userAskedToStop) log.info(`Will repeat scraping this URL with different filter setting. URL ${logId}`); // prettier-ignore
        else log.info(`There are unprocessed filter setting remaining for this URL, but stopping due to abort. URL ${logId}`); // prettier-ignore
      } else log.info(`No filter setting remain for scraping this URL. URL ${logId}`); // prettier-ignore
    }
    log.info(`Finished URL ${logId}`);
  });
  return links;
};
