import type { MaybePromise } from '../utils/types.js';

export type _InfiScrollTypes<TContainer, TChild, TChildren, TCB> = {
  container: TContainer;
  child: TChild;
  children: TChildren;
  callbackArg: TCB;
};

export type _AnyInfiScrollTypes = _InfiScrollTypes<any, any, any, any>;

/**
 * Common interface for working with browser page despite different environments
 * (e.g. Browser API, Playwright, Puppeteer, Selenium).
 *
 * This common interfaces makes the scraping code more portable between them.
 *
 * WARNING: Portapage is experimental.
 */
export interface Portapage<
  TPage,
  TScroll extends _AnyInfiScrollTypes,
  TCtx extends { container: TScroll['container'] },
> {
  page: TPage;

  /** Load entries via infinite scroll and process them as you go. */
  infiniteScroll: (
    /** A container, or selector for it, that includes the dynamically loaded items. */
    container: string | TScroll['container'],
    /**
     * Callback that receives a handle to the new child elements in the DOM
     *
     * Example:
     * ```js
     * // Get text from all new child elements of the infinite-scroller container
     * async (elementsHandle) => {
     *   const result = await page.evaluate((els) => els.map((el) => el.textContent), elementsHandle);
     *   return result;
     * };
     * ```
     */
    onNewChildren?: (
      /** New elements that were added */
      elsHandle: TScroll['callbackArg'],
      ctx: { page: TPage; container: TScroll['container'] },
      /** Function that, if called, stops the infinite scrolling */
      stop: () => void
    ) => MaybePromise<void>,
    options?: InfiniteScrollLoaderOptions<TScroll, TCtx>
  ) => MaybePromise<void>;
}

export interface InfiniteScrollLoaderOptions<
  T extends _AnyInfiScrollTypes,
  TCtx extends { container: T['container'] } = { container: T['container'] },
> {
  /** How many times to retry the infinite scroll if new items aren't loading */
  retries?: number;
  /** Override how container children are counted. Default uses `el.childElementCount` */
  childrenCounter?: (containerEl: T['container'], ctx: TCtx) => MaybePromise<number>;
  /** Override how container children are extraced. Default uses `el.children` */
  childrenGetter?: (containerEl: T['container'], ctx: TCtx) => MaybePromise<T['children']>;
  /** Override how container children are scrolled into view. Default uses `el.scrollIntoView` */
  scrollIntoView?: (childEl: T['child'], ctx: TCtx) => MaybePromise<void>;
  /** Override whether and how to wait after scrolling into view */
  waitAfterScroll?: (childEl: T['child'], ctx: TCtx) => MaybePromise<void>;
}
