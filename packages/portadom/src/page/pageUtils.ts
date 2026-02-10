import type { JSHandle, Page } from 'playwright';

import { logAndRethrow } from '../utils/error.js';

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
export const createPlaywrightElementSerializer = async <T extends Page>(page: T) => {
  const prefix = '__portadom_infiniteScrollLoader__';
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
        (globalThis as any)[helperKey] = () => {
          const elMap = ((globalThis as any)[mapKey] = (globalThis as any)[mapKey] || new Map());
          const elMapRev = ((globalThis as any)[`${mapKey}_rev`] =
            (globalThis as any)[`${mapKey}_rev`] || new Map());
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
   */
  const serializeEls = async (elsHandle: JSHandle<any>) => {
    const ids = await page
      .evaluate(
        ({ els, helperKey }) => {
          if (!els) return [] as string[];

          const { elMap, elMapRev } = (globalThis as any)[helperKey]() as PlaywrightElementSerializerHelperResult; // prettier-ignore

          const innerIds = [...els].map((el: Element) => {
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
   */
  const resolveIds = async (ids: string[]) => {
    // Resolve serializable IDs to an element on the page
    const elsHandle = await page
      .evaluateHandle(
        ({ ids, helperKey }) => {
          const { elMapRev } = (globalThis as any)[helperKey]() as PlaywrightElementSerializerHelperResult; // prettier-ignore

          const els = ids.map((id: string) => elMapRev.get(id) || null);
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
    const handle = await elsHandle.evaluateHandle((ids: any) => ids[0]).catch(logAndRethrow);
    return handle;
  };

  return {
    serializeEls,
    resolveIds,
    resolveId,
  };
};
