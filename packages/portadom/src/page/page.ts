import type { Page, Locator, ElementHandle, JSHandle } from 'playwright';

import type { MaybePromise } from '../utils/types.js';
import { logAndRethrow } from '../utils/error.js';
import { handleIsLocator } from '../dom/domUtils.js';
import type {
  InfiniteScrollLoaderOptions,
  Portapage,
  _AnyInfiScrollTypes,
  _InfiScrollTypes,
} from './types.js';
import { createPlaywrightElementSerializer } from './pageUtils.js';

type PlaywrightInfiScrollTypes = _InfiScrollTypes<
  Locator | ElementHandle,
  JSHandle,
  JSHandle,
  JSHandle<(Element | null)[]>
>;
type PWIST = PlaywrightInfiScrollTypes; // For brevity

/** Implementation of Portapage in Playwright */
export type PlaywrightPortapage<T extends Page = Page> = Portapage<
  T,
  PWIST,
  { container: PWIST['container']; page: T }
>;

/** Implementation of Portapage in Playwright */
export const playwrightPortapage = async <T extends Page = Page>(
  page: T
): Promise<PlaywrightPortapage<T>> => {
  const { serializeEls, resolveId, resolveIds } = await createPlaywrightElementSerializer(page);

  const infiniteScroll: PlaywrightPortapage<T>['infiniteScroll'] = async (
    container,
    onNewChildren,
    options
  ) => {
    const childrenCounter = options?.childrenCounter ?? ((h) => (h as ElementHandle).evaluate((el) => el ? (el as Element).childElementCount : 0).catch(logAndRethrow)); // prettier-ignore
    const childrenGetter = options?.childrenGetter ?? ((h) => (h as any).evaluateHandle((el: any) => el ? (el as Element).children : []).catch(logAndRethrow)); // prettier-ignore
    const scrollIntoView = options?.scrollIntoView ?? ((h) => (h as any).evaluate((el: any) => el && el.scrollIntoView()).catch(logAndRethrow)); // prettier-ignore
    const waitAfterScroll = options?.waitAfterScroll ?? (() => page.waitForLoadState('networkidle')); // prettier-ignore

    const handleOrLocator = typeof container === 'string' ? page.locator(container) : container;
    if (handleIsLocator(handleOrLocator) && handleOrLocator.page() !== page) {
      throw Error('Locator does not belong to given Page.');
    }

    await _infiniteScrollLoader<
      _InfiScrollTypes<typeof handleOrLocator, string, string[], string[]>
    >(
      handleOrLocator,
      async (childIds, ctx, stopFn) => {
        // Resolve child IDs to handle of child elements on the page
        const elsHandle = await resolveIds(childIds);
        // Then pass them to user
        await onNewChildren?.(elsHandle as any, { ...ctx, page } as any, stopFn);
      },
      {
        retries: options?.retries ?? 3,
        childrenCounter: (el, ctx) => childrenCounter(el as any, { ...ctx, page } as any),
        childrenGetter: async (handle, ctx) => {
          // First let user tell us how to collect the child elements
          const childElsHandle = await childrenGetter(handle as any, { ...ctx, page } as any);
          // Then convert them to serializable IDs that we can return to user
          const childIds = await serializeEls(childElsHandle as any);
          return childIds;
        },
        scrollIntoView: async (childId, ctx) => {
          // First resolve serializable ID to an element on the page
          const childElHandle = await resolveId(childId);
          // Then let user tell us how to scroll into view
          await scrollIntoView(childElHandle as any, { ...ctx, page } as any);
        },
        waitAfterScroll: async (childId, ctx) => {
          // First resolve serializable ID to an element on the page
          const childElHandle = await resolveId(childId);
          // Then let user tell us how to wait after scroll
          await waitAfterScroll(childElHandle as any, { ...ctx, page } as any);
        },
      }
    );
  };

  return {
    page,

    infiniteScroll,
  } as PlaywrightPortapage<T>;
};

/** Load entries via infinite scroll and process them as you go. */
const _infiniteScrollLoader = async <T extends _AnyInfiScrollTypes>(
  container: T['container'] | (() => MaybePromise<T['container']>),
  onNewChildren: (
    childEls: T['callbackArg'],
    ctx: { container: T['container'] },
    stop: () => void
  ) => MaybePromise<void>,
  options: Required<InfiniteScrollLoaderOptions<T>>
) => {
  const containerElGetter = (
    typeof container === 'function' ? container : () => container
  ) as () => MaybePromise<T['container']>;

  const processedChildren = new Set<T['child']>();
  let userAskedToStop = false;

  const stopFn = () => {
    userAskedToStop = true;
  };

  const processChildren = async (childrenEl: T['child'][]) => {
    const newChildren = await childrenEl.filter((el: any) => !processedChildren.has(el));
    const container = await containerElGetter();
    await onNewChildren?.(newChildren, { container }, stopFn);
    newChildren.forEach((el: any) => processedChildren.add(el));
  };

  const initContainer = await containerElGetter();
  let currChildrenCount = await options.childrenCounter(initContainer, { container: initContainer }); // prettier-ignore
  let currRetries = 0;

  while (!userAskedToStop) {
    // Process currently-loaded children
    const containerEl = await containerElGetter();
    const currChildren = [...(await options.childrenGetter(containerEl, { container: containerEl }))]; // prettier-ignore
    await processChildren(currChildren);

    if (userAskedToStop) break;

    // Load next batch
    const lastChildEl = currChildren.slice(-1)[0];
    await options.scrollIntoView(lastChildEl, { container: containerEl });
    await options.waitAfterScroll(lastChildEl, { container: containerEl });
    const newChildrenCount = await options.childrenCounter(containerEl, { container: containerEl }); // prettier-ignore

    if (newChildrenCount <= currChildrenCount) {
      if (currRetries >= options.retries) break;
      else currRetries++;
    } else {
      currRetries = 0;
    }

    currChildrenCount = newChildrenCount;
  }
};
