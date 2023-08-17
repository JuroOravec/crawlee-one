import type { Page, Locator, ElementHandle, JSHandle } from 'playwright';

import type { MaybePromise } from '../../utils/types';
import { logAndRethrow } from '../../utils/error';
import { handleIsLocator } from './domUtils';

type InfiScrollTypes<TContainer, TChild, TChildren, TCB> = {
  container: TContainer;
  child: TChild;
  children: TChildren;
  callbackArg: TCB;
};

type AnyInfiScrollTypes = InfiScrollTypes<any, any, any, any>;

/**
 * Common interface for working with browser page despite different environments
 * (e.g. Browser API, Playwright, Puppeteer, Selenium).
 *
 * This common interfaces makes the scraping code more portable between them.
 */
export interface PageLib<
  TPage,
  TScroll extends AnyInfiScrollTypes,
  TCtx extends { container: TScroll['container'] }
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
      elsHandle: TScroll['callbackArg'],
      ctx: { page: TPage; container: TScroll['container'] }
    ) => MaybePromise<void>,
    options?: InfiniteScrollLoaderOptions<TScroll, TCtx>
  ) => MaybePromise<void>;
}

type PlaywrightInfiScrollTypes = InfiScrollTypes<
  Locator | ElementHandle<Element>,
  JSHandle<Element | null>,
  JSHandle<Element[]>,
  JSHandle<(Element | null)[]>
>;
type PWIST = PlaywrightInfiScrollTypes; // For brevity

export interface InfiniteScrollLoaderOptions<
  T extends AnyInfiScrollTypes,
  TCtx extends { container: T['container'] } = { container: T['container'] }
> {
  /** Override how container children are counted. Default uses `el.childElementCount` */
  childrenCounter?: (containerEl: T['container'], ctx: TCtx) => MaybePromise<number>;
  /** Override how container children are extraced. Default uses `el.children` */
  childrenGetter?: (containerEl: T['container'], ctx: TCtx) => MaybePromise<T['children']>;
  /** Override how container children are scrolled into view. Default uses `el.scrollIntoView` */
  scrollIntoView?: (childEl: T['child'], ctx: TCtx) => MaybePromise<void>;
  /** Override whether and how to wait after scrolling into view */
  waitAfterScroll?: (childEl: T['child'], ctx: TCtx) => MaybePromise<void>;
}

export type PlaywrightPageLib<T extends Page = Page> = PageLib<
  T,
  PWIST,
  { container: PWIST['container']; page: T }
>;

/** Implementation of PageLib in Playwright */
export const playwrightPageLib = async <T extends Page>(page: T): Promise<PlaywrightPageLib<T>> => {
  const { serializeEls, resolveId, resolveIds } = await _createPlaywrightElementSerializer(page);

  const infiniteScroll: PlaywrightPageLib<T>['infiniteScroll'] = async (
    container,
    onNewChildren,
    options
  ) => {
    const childrenCounter = options?.childrenCounter ?? ((h) => (h as ElementHandle).evaluate((el) => el ? (el as Element).childElementCount : 0).catch(logAndRethrow)); // prettier-ignore
    const childrenGetter = options?.childrenGetter ?? ((h) => h.evaluateHandle((el) => el ? (el as Element).children : []).catch(logAndRethrow)); // prettier-ignore
    const scrollIntoView = options?.scrollIntoView ?? ((h) => h.evaluate((el) => { el && el.scrollIntoView() }).catch(logAndRethrow)); // prettier-ignore
    const waitAfterScroll = options?.waitAfterScroll ?? (() => page.waitForLoadState('networkidle')); // prettier-ignore

    const handleOrLocator = typeof container === 'string' ? page.locator(container) : container;
    if (handleIsLocator(handleOrLocator) && handleOrLocator.page() !== page) {
      throw Error('Locator does not belong to given Page.');
    }

    await _infiniteScrollLoader<InfiScrollTypes<PWIST['container'], string, string[], string[]>>(
      handleOrLocator,
      async (childIds, ctx) => {
        // Resolve child IDs to handle of child elements on the page
        const elsHandle = await resolveIds(childIds);
        // Then pass them to user
        await onNewChildren?.(elsHandle, { ...ctx, page });
      },
      {
        childrenCounter: (el, ctx) => childrenCounter(el, { ...ctx, page }),
        childrenGetter: async (handle, ctx) => {
          // First let user tell us how to collect the child elements
          const childElsHandle = await childrenGetter(handle, { ...ctx, page });
          // Then convert them to serializable IDs that we can return to user
          const childIds = await serializeEls(childElsHandle);
          return childIds;
        },
        scrollIntoView: async (childId, ctx) => {
          // First resolve serializable ID to an element on the page
          const childElHandle = await resolveId(childId);
          // Then let user tell us how to scroll into view
          await scrollIntoView(childElHandle, { ...ctx, page });
        },
        waitAfterScroll: async (childId, ctx) => {
          // First resolve serializable ID to an element on the page
          const childElHandle = await resolveId(childId);
          // Then let user tell us how to wait after scroll
          await waitAfterScroll(childElHandle, { ...ctx, page });
        },
      }
    );
  };

  return {
    page,

    infiniteScroll,
  } satisfies PlaywrightPageLib<T>;
};

/** Load entries via infinite scroll and process them as you go. */
const _infiniteScrollLoader = async <T extends AnyInfiScrollTypes>(
  container: T['container'] | (() => MaybePromise<T['container']>),
  onNewChildren: (
    childEls: T['callbackArg'],
    ctx: { container: T['container'] }
  ) => MaybePromise<void>,
  handlers: Required<InfiniteScrollLoaderOptions<T>>
) => {
  const containerElGetter = (
    typeof container === 'function' ? container : () => container
  ) as () => MaybePromise<T['container']>;

  const processedChildren = new Set();

  const processChildren = async (childrenEl: T['child'][]) => {
    const newChildren = await childrenEl.filter((el) => !processedChildren.has(el));
    const container = await containerElGetter();
    await onNewChildren?.(newChildren, { container });
    newChildren.forEach((el) => processedChildren.add(el));
  };

  const initContainer = await containerElGetter();
  let currChildrenCount = await handlers.childrenCounter(initContainer, { container: initContainer }); // prettier-ignore
  while (true) {
    // Process currently-loaded children
    const containerEl = await containerElGetter();
    const currChildren = [...(await handlers.childrenGetter(containerEl, { container: containerEl }))]; // prettier-ignore
    await processChildren(currChildren);

    // Load next batch
    const lastChildEl = currChildren.slice(-1)[0];
    await handlers.scrollIntoView(lastChildEl, { container: containerEl });
    await handlers.waitAfterScroll(lastChildEl, { container: containerEl });
    const newChildrenCount = await handlers.childrenCounter(containerEl, { container: containerEl }); // prettier-ignore

    if (newChildrenCount <= currChildrenCount) break;

    currChildrenCount = newChildrenCount;
  }
};

interface PlaywrightElementSerializerHelperResult {
  elMap: Map<Element, string>;
  elMapRev: Map<string, Element>;
}

/**
 * Helper methods that allow to represent HTML Elements on the Page as string IDs
 *
 * We use this so we can identify which elements have already been processed, and which have not.
 * Normally, the elements are represented via Playwright JSHandle/ElementHandle. However, if two
 * Handles are pointing to the same Element, we're unable to count them as one, because it's two
 * instances that don't have any IDs of the Elemenets. On the other hand, using the string IDs,
 * two different JSHandles will return the same string if they point to the same Element, so we
 * cache the IDs outside of Playwright in Sets or Maps.
 */
const _createPlaywrightElementSerializer = async <T extends Page>(page: T) => {
  const prefix = '__domLib_infiniteScrollLoader__';
  const helperKey = `${prefix}helpers_elIdMap`;
  // There may be multiple instances of this cache on the Page, so we distinguish
  // them with operationId.
  const operationId = Math.floor(Math.random() * 10 ** 9).toString().padStart(9, '0'); // prettier-ignore
  const mapKey = `${prefix}${operationId}`;

  // Prepare a function in-page that creates the cache to store and retrieve the elements.
  await page
    .evaluate(
      ({ mapKey, helperKey }) => {
        // Create mapping between IDs and HTMLElements, so we can pass the IDs as a serializable
        // reference to the in-page DOM elements
        globalThis[helperKey] = () => {
          const elMap = (globalThis[mapKey] = globalThis[mapKey] || new Map());
          const elMapRev = (globalThis[`${mapKey}_rev`] = globalThis[`${mapKey}_rev`] || new Map());
          return { elMap, elMapRev } satisfies PlaywrightElementSerializerHelperResult;
        };
      },
      { mapKey, helperKey }
    )
    .catch(logAndRethrow);

  /**
   * Given a Playwright JSHandle holding an array of Elements, cache the Elements
   * in the Page and generate serializable IDs that can be used to refer to these
   * elements outside of Playwright.
   *
   * This is the opposite of `_resolveIds`.
   *
   * We use this so we can identify which elements have already been processed, and which have not.
   * Normally, the elements are represented via Playwright JSHandle/ElementHandle. However, if two
   * Handles are pointing to the same Element, we're unable to count them as one, because it's two
   * instances that don't have any IDs of the Elemenets. On the other hand, using the string IDs,
   * two different JSHandles will return the same string if they point to the same Element, so we
   * cache the IDs outside of Playwright in Sets or Maps.
   */
  const serializeEls = async (elsHandle: PWIST['children']) => {
    const ids = await page
      .evaluate(
        ({ els, helperKey }) => {
          if (!els) return [] as string[];

          const { elMap, elMapRev } = globalThis[helperKey]() as PlaywrightElementSerializerHelperResult; // prettier-ignore

          const innerIds = [...els].map((el) => {
            if (!elMap.has(el)) {
              const elId = Math.floor(Math.random() * 10 ** 9)
                .toString()
                .padStart(9, '0');
              elMap.set(el, elId);
              elMapRev.set(elId, el);
              return elId;
            }
            return elMap.get(el)!;
          });
          return innerIds;
        },
        { els: elsHandle, helperKey }
      )
      .catch(logAndRethrow);

    return ids;
  };

  /**
   * Given an array of IDs, resolve them to a Playwright JSHandle holding an array of corresponding
   * Elements cached in Page's global context.
   *
   * This is the opposite of `_serializeEls`.
   *
   * We use this so we can identify which elements have already been processed, and which have not.
   * Normally, the elements are represented via Playwright JSHandle/ElementHandle. However, if two
   * Handles are pointing to the same Element, we're unable to count them as one, because it's two
   * instances that don't have any IDs of the Elemenets. On the other hand, using the string IDs,
   * two different JSHandles will return the same string if they point to the same Element, so we
   * cache the IDs outside of Playwright in Sets or Maps.
   */
  const resolveIds = async (ids: string[]) => {
    // Resolve serializable IDs to an element on the page
    const elsHandle = await page
      .evaluateHandle(
        ({ ids, helperKey }) => {
          const { elMapRev } = globalThis[helperKey]() as PlaywrightElementSerializerHelperResult; // prettier-ignore

          const els = ids.map((id) => elMapRev.get(id) || null);
          return els;
        },
        { ids, helperKey }
      )
      .catch(logAndRethrow);
    return elsHandle;
  };

  /** See {@link resolveIds}. */
  const resolveId = async (id: string) => {
    const elsHandle = await resolveIds([id]);
    const handle = await elsHandle.evaluateHandle((ids) => ids[0]).catch(logAndRethrow);
    return handle;
  };

  return {
    serializeEls,
    resolveIds,
    resolveId,
  };
};
