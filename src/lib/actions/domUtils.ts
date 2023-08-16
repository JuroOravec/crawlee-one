import type { AnyNode, Cheerio } from 'cheerio';
import type { ElementHandle, JSHandle, Locator, Page } from 'playwright';

import { serialAsyncMap } from '../../utils/async';
import type { MaybeArray, MaybePromise } from '../../utils/types';
import { logAndRethrow } from '../../utils/error';

/**
 * Given a Cheerio selection, split it into an array of Cheerio selections,
 * where each has only one element.
 *
 * From `Cheerio[el, el, el, el]`
 *
 * To `[Cheerio[el], Cheerio[el], Cheerio[el], Cheerio[el]]`
 */
export const splitCheerioSelection = (cheerioSel: Cheerio<AnyNode>) => {
  const arrSize = cheerioSel.length;
  return Array(arrSize)
    .fill(null)
    .map((_, index) => cheerioSel.slice(index, index + 1));
};

/**
 * Given a Playwright JSHandle that points to an array of Elements, split it into an array of
 * ElementHandles, where each has only one element.
 *
 * From `JSHandle([el, el, el)]`
 *
 * To `ElHandle(el), ElHandle(el), ElHandle(el)`
 */
export const splitPlaywrightSelection = async <T>(handle: JSHandle<T[]>) => {
  const arrSize = await handle.evaluate((arr) => arr.length).catch(logAndRethrow);
  return serialAsyncMap(Array(arrSize).fill(null), (_, index) => {
    return handle.evaluateHandle((arr, i) => arr[i], index).catch(logAndRethrow);
  });
};

/** Any instance that is a Playwright Handle. */
export type AnyHandle<T = any> = JSHandle<T> | ElementHandle<T>;
/** Any instance that is a Playwright Handle, or can be converted to one. */
export type HandleLike<T = any> = Locator | JSHandle<T> | ElementHandle<T>;

export const handleIsLocator = <T>(h: HandleLike<T>): h is Locator => {
  return typeof (h as Locator)?.page === 'function' && h?.toString().startsWith('Locator@');
};

/**
 * Join several Locators and Handles in a single JSHandle.
 *
 * Locators are evaluated to their matching elements.
 *
 * To override how Locators are resolved, supply own `locatorResolver` function.
 */
export const mergeHandles = async <T = any>(
  handles: HandleLike<T>[],
  options?: {
    /**
     * Configure how to process {@link Locator}s into {@link JSHandle}s.
     *
     * By default, Locator resolves to the first DOM Element it matches,
     * using {@link Locator.elementHandle}.
     */
    locatorResolver?: (loc: Locator) => MaybePromise<MaybeArray<AnyHandle<T>>>;
  }
) => {
  const locatorResolver = options?.locatorResolver ?? ((loc) => loc.elementHandle());

  if (!handles.length) {
    throw Error('Nothing to merge, `handles` array is empty.');
  }

  const seenPages = new Map<Page, number>();

  // Resolve Locators into Handlers
  const resolvedHandles = await handles.reduce<Promise<AnyHandle[]>>(
    async (aggPromise, handle, index) => {
      const agg = await aggPromise;

      if (handleIsLocator(handle)) {
        // Validate that all locators belong to the same Page instance
        const locPage = handle.page();
        if (!locPage) throw Error(`Locator at index ${index} is missing Page instance.`);
        if (seenPages.size > 0 && !seenPages.has(locPage)) {
          const prevSeenIndex = [...seenPages.values()][0];
          throw Error(
            `Received locators belonging to different Page instances (index ${prevSeenIndex} and ${index}).`
          );
        }
        seenPages.set(locPage, index);

        const resolved = await locatorResolver(handle);
        const resolvedArr = resolved ? (Array.isArray(resolved) ? resolved : [resolved]) : [];
        agg.push(...resolvedArr);
      } else {
        agg.push(handle);
      }
      return agg;
    },
    Promise.resolve([])
  );

  if (!resolvedHandles.length) {
    throw Error('Nothing to merge, no Handles found after resolving Locators.');
  }

  // There may be multiple instances of this function running on the Page, so we avoid collision
  // them operationId.
  const operationId = Math.floor(Math.random() * 10 ** 9).toString().padStart(9, '0'); // prettier-ignore

  // Ensure that all handlers belong to the same context by checking that they
  // all see the same value set in context of the first handle.
  const prefix = '__domUtils_mergeHandles_prompt__';
  const prompt = { key: `${prefix}${operationId}`, value: 'hello:)' };

  // Use first handle as reference
  const baseHandle = resolvedHandles[0];

  // 1. Plant the prompt
  await baseHandle
    .evaluate((_, prompt) => {
      globalThis[prompt.key] = prompt.value;
    }, prompt)
    .catch(logAndRethrow);

  // 2. Check that all handles see the prompt
  await serialAsyncMap(resolvedHandles, async (handle, index) => {
    const response = await handle
      .evaluate((_, prompt) => globalThis[prompt.key], prompt)
      .catch(logAndRethrow);
    if (response !== prompt.value) {
      throw Error(
        `Handle context mismatch! Either Page context changed or JSHandle at index ${index} ` +
          `is in different Page than previous handles.`
      );
    }
  });

  // 3. Clean up
  await baseHandle
    .evaluate((_, prompt) => {
      delete globalThis[prompt.key];
    }, prompt)
    .catch(logAndRethrow);

  // Now that all handles are sound, pass them to the given function
  const mergedHandle = await baseHandle
    .evaluateHandle((_, handles) => handles, resolvedHandles)
    .catch(logAndRethrow);
  return mergedHandle as JSHandle<T[]>;
};
