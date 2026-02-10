import type { AnyNode } from 'domhandler';
import type { Cheerio } from 'cheerio';
import type { ElementHandle, JSHandle, Locator, Page } from 'playwright';

import { strAsNumber, strOrNull } from '../utils/format.js';
import { formatUrl } from '../utils/url.js';
import type { MaybeArray, MaybePromise } from '../utils/types.js';
import { logAndRethrow } from '../utils/error.js';
import { mergeHandles, splitCheerioSelection, splitPlaywrightSelection } from './domUtils.js';
import { createPortadomArrayPromise, createPortadomPromise, type Portadom } from './types.js';

const get = (obj: any, propPath: string[]) =>
  propPath.reduce((prevRes, propKey) => prevRes?.[propKey] ?? null, obj);

/** Implementation of Portadom in browser (using Browser API) */
export type BrowserPortadom<El extends Element = Element> = Portadom<El>;

/** Implementation of Portadom in browser (using Browser API) */
export const browserPortadom = <El extends Element = Element>(node: El): BrowserPortadom<El> => {
  const getDoc = () => node.ownerDocument;

  ///////////////////////
  // SCALAR OPERATIONS
  ///////////////////////

  const text: BrowserPortadom<El>['text'] = ({ allowEmpty } = {}) => {
    const txt = node.textContent?.trim() ?? null;
    return strOrNull(txt, allowEmpty);
  };

  const textAsUpper: BrowserPortadom<El>['textAsUpper'] = (options) => {
    const txt = text(options);
    return txt ? (txt as string).toLocaleUpperCase() : txt;
  };

  const textAsLower: BrowserPortadom<El>['textAsLower'] = (options) => {
    const txt = text(options);
    return txt ? (txt as string).toLocaleLowerCase() : txt;
  };

  const textAsNumber: BrowserPortadom<El>['textAsNumber'] = (options) => {
    const txt = text(options);
    return strAsNumber(txt as string, options);
  };

  const prop: BrowserPortadom<El>['prop'] = <R = any>(
    propOrPath: MaybeArray<string>,
    { allowEmpty = false } = {}
  ) => {
    const propPath = Array.isArray(propOrPath) ? propOrPath : [propOrPath];
    let propVal = get(node, propPath) ?? null;
    propVal = typeof propVal === 'string' ? propVal.trim() : propVal;
    return strOrNull(propVal, allowEmpty) as R;
  };

  const props: BrowserPortadom<El>['props'] = <R = any>(
    propsOrPaths: MaybeArray<string>[],
    options = {}
  ) => {
    const propPaths = propsOrPaths.map((p) => (Array.isArray(p) ? p : [p]));
    const propData = propPaths.map((path) => prop(path, options));
    return propData as MaybePromise<R>;
  };

  const attr: BrowserPortadom<El>['attr'] = (propName, { allowEmpty } = {}) => {
    let attrVal = node.getAttribute(propName) ?? null;
    attrVal = typeof attrVal === 'string' ? attrVal.trim() : attrVal;
    return strOrNull(attrVal, allowEmpty);
  };

  const attrs: BrowserPortadom<El>['attrs'] = <T extends string>(attrNames: T[], options = {}) => {
    const attrData = attrNames.reduce<Record<T, string | null>>((agg, name) => {
      agg[name] = attr(name, options) as string | null;
      return agg;
    }, {} as any);
    return attrData;
  };

  const href: BrowserPortadom<El>['href'] = async ({ allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop('href', { allowEmpty }) as string | null;
    return formatUrl(val, { allowRelative, baseUrl: baseUrl ?? (await url()) });
  };

  const src: BrowserPortadom<El>['src'] = async ({ allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop('src', { allowEmpty }) as string | null;
    return formatUrl(val, { allowRelative, baseUrl: baseUrl ?? (await url()) });
  };

  const nodeName: BrowserPortadom<El>['nodeName'] = () => {
    // On UPPER- vs lower-case https://stackoverflow.com/questions/27223756/
    const val = prop('nodeName') as string | null;
    return typeof val === 'string' ? val.toLocaleUpperCase() : val;
  };

  const url: BrowserPortadom<El>['url'] = () => {
    // See https://stackoverflow.com/a/16010322/9788634
    const urlVal = getDoc().defaultView?.location?.href || null;
    return urlVal;
  };

  const map: BrowserPortadom<El>['map'] = <TVal>(mapFn: (node: El) => TVal) => {
    return mapFn(node);
  };

  ///////////////////////
  // NODE OPERATIONS
  ///////////////////////

  const findOne = <TNewEl extends Element = El>(selector: string) => {
    if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(node.nodeType as any)) {
      return createPortadomPromise<TNewEl>(null);
    }
    const resultEl = (node.querySelector(selector) ?? null) as TNewEl | null;
    const dom = resultEl ? browserPortadom<TNewEl>(resultEl) : null;
    return createPortadomPromise<TNewEl>(dom);
  };

  const findMany = <TNewEl extends Element = El>(selector: string) => {
    if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(node.nodeType as any)) {
      return createPortadomArrayPromise<TNewEl>([]);
    }
    const resultEls = [...node.querySelectorAll(selector)] as TNewEl[]; // prettier-ignore
    const dom = resultEls.map((el) => browserPortadom<TNewEl>(el));
    return createPortadomArrayPromise<TNewEl>(dom);
  };

  const closest = <TNewEl extends Element = El>(selector: string) => {
    if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(node.nodeType as any)) {
      return createPortadomPromise<TNewEl>(null);
    }
    const resultEl = (node.closest(selector) ?? null) as TNewEl | null;
    const dom = resultEl ? browserPortadom<TNewEl>(resultEl) : null;
    return createPortadomPromise<TNewEl>(dom);
  };

  const parent = <TNewEl extends Element = El>() => {
    const parentEl = (node.parentNode || null) as TNewEl | null;
    const dom = parentEl ? browserPortadom<TNewEl>(parentEl) : null;
    return createPortadomPromise<TNewEl>(dom);
  };

  const children = <TNewEl extends Element = El>() => {
    const childEls = [...node.children] as TNewEl[];
    const dom = childEls.map((el) => browserPortadom<TNewEl>(el));
    return createPortadomArrayPromise<TNewEl>(dom);
  };

  const root = <TNewEl extends Element = El>() => {
    const rootEl = ((node.ownerDocument?.documentElement as any) || null) as TNewEl | null;
    const dom = rootEl ? browserPortadom<TNewEl>(rootEl) : null;
    return createPortadomPromise<TNewEl>(dom);
  };

  const remove: BrowserPortadom<El>['remove'] = () => {
    node.remove();
  };

  const _getCommonAncestor = (el1: El, el2: El) => {
    // https://stackoverflow.com/a/25154092
    // https://developer.mozilla.org/en-US/docs/Web/API/Range/commonAncestorContainer
    const _getCommonAncestorFromRange = (el1: El, el2: El) => {
      const range = new Range();
      range.setStartBefore(el1);
      range.setEndAfter(el2);
      const containerEl = range.commonAncestorContainer;
      return containerEl;
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
    const isEl1BeforeEl2 = !!(el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_FOLLOWING);

    const { firstEl, lastEl } = isEl1BeforeEl2
      ? { firstEl: el1, lastEl: el2 }
      : { firstEl: el2, lastEl: el1 };

    const containerEl = _getCommonAncestorFromRange(firstEl, lastEl);
    return containerEl as El | null;
  };

  const getCommonAncestor = <TNewEl extends Element = El>(otherEl: El) => {
    const ancestor = _getCommonAncestor(node, otherEl);
    const dom = ancestor ? browserPortadom<TNewEl>(ancestor as any as TNewEl) : null;
    return createPortadomPromise<TNewEl>(dom);
  };

  const _getCommonAncestorFromSelector = _createCommonAncestorFromSelectorFn<El>({
    querySelectorAll: (selector) => node.querySelectorAll(selector) as Iterable<El>,
    getParent: (el) => el.parentElement as El | null,
    isAncestor: (el1, el2) => {
      return !!(el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_CONTAINED_BY);
    },
    getCommonAncestor: (el1, el2) => _getCommonAncestor(el1, el2),
  });

  const getCommonAncestorFromSelector = <TNewEl extends Element = El>(selector: string) => {
    const dom = _getCommonAncestorFromSelector(selector).then<Portadom<TNewEl> | null>(
      (ancestor) => (ancestor ? browserPortadom<TNewEl>(ancestor as any as TNewEl) : null)
    );
    return createPortadomPromise<TNewEl>(dom);
  };

  return {
    node,

    text,
    textAsLower,
    textAsUpper,
    textAsNumber,
    attr,
    attrs,
    prop,
    props,
    href,
    src,
    nodeName,
    url,
    map,

    findOne,
    findMany,
    closest,
    parent,
    children,
    root,
    remove,
    getCommonAncestor,
    getCommonAncestorFromSelector,
  } as Portadom<El>;
};

/** Implementation of Portadom in Cheerio */
export type CheerioPortadom<El extends Cheerio<AnyNode> = Cheerio<AnyNode>> = Portadom<
  El,
  Cheerio<AnyNode>
>;

/** Implementation of Portadom in Cheerio */
export const cheerioPortadom = <El extends Cheerio<AnyNode> = Cheerio<AnyNode>>(
  cheerioNode: El,
  srcUrl: string | null
): CheerioPortadom<El> => {
  ///////////////////////
  // SCALAR OPERATIONS
  ///////////////////////

  const text: CheerioPortadom<El>['text'] = ({ allowEmpty } = {}) => {
    const txt = cheerioNode.text()?.trim() ?? null;
    return strOrNull(txt, allowEmpty);
  };

  const textAsUpper: CheerioPortadom<El>['textAsUpper'] = (options) => {
    const txt = text(options);
    return txt ? (txt as string).toLocaleUpperCase() : txt;
  };

  const textAsLower: CheerioPortadom<El>['textAsLower'] = (options) => {
    const txt = text(options);
    return txt ? (txt as string).toLocaleLowerCase() : txt;
  };

  const textAsNumber: CheerioPortadom<El>['textAsNumber'] = (options) => {
    const txt = text(options);
    return strAsNumber(txt as string, options);
  };

  const attr: CheerioPortadom<El>['attr'] = (attrName, { allowEmpty } = {}) => {
    let attrVal = cheerioNode.attr(attrName) ?? null;
    attrVal = typeof attrVal === 'string' ? attrVal.trim() : attrVal;
    return strOrNull(attrVal, allowEmpty);
  };

  const attrs: CheerioPortadom<El>['attrs'] = <T extends string>(attrNames: T[], options = {}) => {
    const attrData = attrNames.reduce<Record<T, string | null>>((agg, name) => {
      agg[name] = attr(name, options) as string | null;
      return agg;
    }, {} as any);
    return attrData;
  };

  const prop: CheerioPortadom<El>['prop'] = <R = any>(
    propOrPath: MaybeArray<string>,
    { allowEmpty = false } = {}
  ) => {
    const propPath = Array.isArray(propOrPath) ? propOrPath : [propOrPath];
    let propVal = cheerioNode.prop(propPath[0]) ?? null;
    if (propPath.length > 1) propVal = get(propVal, propPath.slice(1));
    propVal = typeof propVal === 'string' ? propVal.trim() : propVal;
    return strOrNull(propVal, allowEmpty) as R;
  };

  const props: CheerioPortadom<El>['props'] = <R = any>(
    propsOrPaths: MaybeArray<string>[],
    options = {}
  ) => {
    const propPaths = propsOrPaths.map((p) => (Array.isArray(p) ? p : [p]));
    const propData = propPaths.map((path) => prop(path, options));
    return propData as MaybePromise<R>;
  };

  const href: CheerioPortadom<El>['href'] = ({ allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop('href', { allowEmpty }) as string | null;
    return formatUrl(val, { allowRelative, baseUrl: baseUrl ?? srcUrl });
  };

  const src: CheerioPortadom<El>['src'] = ({ allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop('src', { allowEmpty }) as string | null;
    return formatUrl(val, { allowRelative, baseUrl: baseUrl ?? srcUrl });
  };

  const nodeName: CheerioPortadom<El>['nodeName'] = () => {
    // On UPPER- vs lower-case https://stackoverflow.com/questions/27223756/
    const val = prop('nodeName') as string | null;
    return typeof val === 'string' ? val.toLocaleUpperCase() : val;
  };

  const url: CheerioPortadom<El>['url'] = () => {
    return srcUrl ?? null;
  };

  const map: CheerioPortadom<El>['map'] = <TVal>(mapFn: (node: El) => TVal) => {
    return mapFn(cheerioNode);
  };

  ///////////////////////
  // NODE OPERATIONS
  ///////////////////////

  const findOne = <TNewEl extends Cheerio<AnyNode> = El>(selector: string) => {
    const resultEl = cheerioNode.find(selector).first() as TNewEl;
    if (!resultEl.get(0)) return createPortadomPromise<TNewEl>(null);
    const dom = cheerioPortadom<TNewEl>(resultEl, srcUrl);
    return createPortadomPromise<TNewEl>(dom);
  };

  const findMany = <TNewEl extends Cheerio<AnyNode> = El>(selector: string) => {
    const resultEls = splitCheerioSelection(cheerioNode.find(selector)) as TNewEl[];
    const doms = resultEls.map((ch) => cheerioPortadom<TNewEl>(ch, srcUrl));
    return createPortadomArrayPromise<TNewEl>(doms);
  };

  const closest = <TNewEl extends Cheerio<AnyNode> = El>(selector: string) => {
    const resultEl = cheerioNode.closest(selector).first() as TNewEl;
    if (!resultEl.get(0)) return createPortadomPromise<TNewEl>(null);
    const dom = cheerioPortadom<TNewEl>(resultEl, srcUrl);
    return createPortadomPromise<TNewEl>(dom);
  };

  const parent = <TNewEl extends Cheerio<AnyNode> = El>() => {
    const parentEl = cheerioNode.parent().first() as TNewEl;
    if (!parentEl.get(0)) return createPortadomPromise<TNewEl>(null);
    const dom = cheerioPortadom<TNewEl>(parentEl, srcUrl);
    return createPortadomPromise<TNewEl>(dom);
  };

  const children = <TNewEl extends Cheerio<AnyNode> = El>() => {
    const childEls = splitCheerioSelection(cheerioNode.children()) as TNewEl[];
    const doms = childEls.map((ch) => cheerioPortadom<TNewEl>(ch, srcUrl));
    return createPortadomArrayPromise<TNewEl>(doms);
  };

  const root = <TNewEl extends Cheerio<AnyNode> = El>() => {
    const rootEl = (cheerioNode as any)._root?.first() as TNewEl | null;
    if (!rootEl?.get(0)) return createPortadomPromise<TNewEl>(null);
    const dom = cheerioPortadom<TNewEl>(rootEl, srcUrl);
    return createPortadomPromise<TNewEl>(dom);
  };

  const remove: CheerioPortadom<El>['remove'] = () => {
    cheerioNode.remove();
  };

  /** Function that finds the closest common ancestor for `el1` and `el2`. */
  const _getCommonAncestor = async (el1: El, el2: El) => {
    const ch1Parents = splitCheerioSelection(el1.parents()) as El[];
    const ch2Parents = splitCheerioSelection(el2.parents()) as El[];

    let commonAncestor: El | null = null;
    for (const comparerParent of ch1Parents) {
      for (const compareeParent of ch2Parents) {
        if (!comparerParent.is(compareeParent)) continue;
        commonAncestor = comparerParent;
        break;
      }
      if (commonAncestor) break;
    }
    return commonAncestor;
  };

  const getCommonAncestor = <TNewEl extends Cheerio<AnyNode> = El>(otherEl: El) => {
    const dom = _getCommonAncestor(cheerioNode, otherEl).then((ancestor) => {
      if (!ancestor?.get(0)) return null;
      return cheerioPortadom<TNewEl>(ancestor as any as TNewEl, srcUrl);
    });
    return createPortadomPromise<TNewEl>(dom);
  };

  const _getCommonAncestorFromSelector = _createCommonAncestorFromSelectorFn<El>({
    querySelectorAll: (selector) => splitCheerioSelection(cheerioNode.find(selector)) as El[],
    getParent: (el) => el.parent() as El | null,
    isAncestor: (el1, el2) => el1.is(el2.parents()),
    getCommonAncestor: (el1, el2) => _getCommonAncestor(el1, el2),
  });

  const getCommonAncestorFromSelector = <TNewEl extends Cheerio<AnyNode> = El>(
    selector: string
  ) => {
    const dom = _getCommonAncestorFromSelector(selector).then((ancestor) => {
      if (!ancestor?.get(0)) return null;
      return cheerioPortadom<TNewEl>(ancestor as any as TNewEl, srcUrl);
    });
    return createPortadomPromise<TNewEl>(dom);
  };

  return {
    node: cheerioNode,

    text,
    textAsLower,
    textAsUpper,
    textAsNumber,
    attr,
    attrs,
    prop,
    props,
    href,
    src,
    nodeName,
    url,
    map,

    findOne,
    findMany,
    closest,
    parent,
    children,
    root,
    remove,
    getCommonAncestor,
    getCommonAncestorFromSelector,
  } as CheerioPortadom<El>;
};

/** Implementation of Portadom in Playwright using Handles */
export type PlaywrightHandlePortadom<El extends Locator | ElementHandle = Locator | ElementHandle> =
  Portadom<El, Locator | ElementHandle>;

const verifyHandleEl = async (el: Locator | ElementHandle | JSHandle | null) => {
  if (!el) return null;
  const exists = await (el as ElementHandle).evaluate((el) => !!el).catch(logAndRethrow);
  return exists ? el : null;
};

/** Implementation of Portadom in Playwright using Handles */
export const playwrightHandlePortadom = <
  El extends Locator | ElementHandle = Locator | ElementHandle,
>(
  node: El,
  page: Page
): PlaywrightHandlePortadom<El> => {
  ///////////////////////
  // SCALAR OPERATIONS
  ///////////////////////

  const text: PlaywrightHandlePortadom<El>['text'] = async ({ allowEmpty } = {}) => {
    const txt = (await node.textContent())?.trim() ?? null;
    return strOrNull(txt, allowEmpty);
  };

  const textAsUpper: PlaywrightHandlePortadom<El>['textAsUpper'] = async (options) => {
    const txt = await text(options);
    return txt ? txt.toLocaleUpperCase() : txt;
  };

  const textAsLower: PlaywrightHandlePortadom<El>['textAsLower'] = async (options) => {
    const txt = await text(options);
    return txt ? txt.toLocaleLowerCase() : txt;
  };

  const textAsNumber: PlaywrightHandlePortadom<El>['textAsNumber'] = async (options) => {
    const txt = await text(options);
    return strAsNumber(txt, options);
  };

  const prop: PlaywrightHandlePortadom<El>['prop'] = async <R = any>(
    propOrPath: MaybeArray<string>,
    options = {}
  ) => {
    const [resProp] = await props([propOrPath], options);
    return resProp as R;
  };

  const props: PlaywrightHandlePortadom<El>['props'] = async <R = any>(
    propsOrPaths: MaybeArray<string>[],
    { allowEmpty = false } = {}
  ) => {
    const propPaths = propsOrPaths.map((p) => (Array.isArray(p) ? p : [p]));
    const data = await (node as Locator)
      .evaluate(
        (el, { propPaths, allowEmpty }) => {
          return propPaths.map((propPath) => {
            let val: any = el;
            for (const prop of propPath) {
              if (el == null) break;
              val = val[prop];
            }
            val = typeof val === 'string' ? val.trim() : val;
            return strOrNull(val, allowEmpty) as any;
          });
        },
        { propPaths, allowEmpty }
      )
      .catch(logAndRethrow);
    return data as R;
  };

  const attr: PlaywrightHandlePortadom<El>['attr'] = async (attrName, options) => {
    const data = await attrs([attrName], options);
    return data[attrName] ?? null;
  };

  const attrs: PlaywrightHandlePortadom<El>['attrs'] = <T extends string>(
    attrNames: T[],
    { allowEmpty = false } = {}
  ) => {
    const data = (node as Locator)
      .evaluate(
        (el, { attrNames, allowEmpty }) => {
          const attrData = (attrNames as T[]).reduce<Record<T, string | null>>((agg, name) => {
            let attrVal = el.getAttribute(name) ?? null;
            attrVal = typeof attrVal === 'string' ? attrVal.trim() : attrVal;
            agg[name] = strOrNull(attrVal, allowEmpty);
            return agg;
          }, {} as any);
          return attrData;
        },
        { attrNames, allowEmpty }
      )
      .catch(logAndRethrow);
    return data;
  };

  const href: PlaywrightHandlePortadom<El>['href'] = async ({
    allowEmpty,
    allowRelative,
    baseUrl,
  } = {}) => {
    const val = (await prop('href', { allowEmpty })) as string | null;
    return formatUrl(val, { allowRelative, baseUrl: baseUrl ?? (await url()) });
  };

  const src: PlaywrightHandlePortadom<El>['src'] = async ({
    allowEmpty,
    allowRelative,
    baseUrl,
  } = {}) => {
    const val = (await prop('src', { allowEmpty })) as string | null;
    return formatUrl(val, { allowRelative, baseUrl: baseUrl ?? (await url()) });
  };

  const nodeName: PlaywrightHandlePortadom<El>['nodeName'] = async () => {
    // On UPPER- vs lower-case https://stackoverflow.com/questions/27223756/
    const val = (await prop('nodeName')) as string | null;
    return typeof val === 'string' ? val.toLocaleUpperCase() : val;
  };

  const url: PlaywrightHandlePortadom<El>['url'] = async () => {
    return page.url() || null;
  };

  const map: PlaywrightHandlePortadom<El>['map'] = <TVal>(mapFn: (node: El) => TVal) => {
    return mapFn(node);
  };

  ///////////////////////
  // NODE OPERATIONS
  ///////////////////////

  const findOne = <TNewEl extends Locator | ElementHandle = El>(selector: string) => {
    const dom = (node as Locator)
      .evaluateHandle((el, s) => {
        if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(el.nodeType as any)) return null;
        return (el as Element).querySelector(s) || null;
      }, selector)
      .catch(logAndRethrow)
      .then(async (resultEl) => {
        const hasResult = await verifyHandleEl(resultEl);
        return hasResult ? playwrightHandlePortadom(resultEl as unknown as TNewEl, page) : null;
      });
    return createPortadomPromise<TNewEl>(dom);
  };

  const findMany = <TNewEl extends Locator | ElementHandle = El>(selector: string) => {
    const doms = (node as Locator)
      .evaluateHandle((el, s) => {
        if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(el.nodeType as any)) return [];
        return [...(el as Element).querySelectorAll(s)];
      }, selector)
      .catch(logAndRethrow)
      .then(async (elsHandle) => {
        const resultEls = await splitPlaywrightSelection(elsHandle as any);
        return resultEls.map((el) => playwrightHandlePortadom(el as unknown as TNewEl, page));
      });
    return createPortadomArrayPromise<TNewEl>(doms);
  };

  const closest = <TNewEl extends Locator | ElementHandle = El>(selector: string) => {
    const dom = (node as Locator)
      .evaluateHandle((el, s) => {
        if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(el.nodeType as any)) return null;
        return (el as Element).closest(s) || null;
      }, selector)
      .catch(logAndRethrow)
      .then(async (resultEl) => {
        const hasResult = await verifyHandleEl(resultEl);
        return hasResult ? playwrightHandlePortadom(resultEl as unknown as TNewEl, page) : null;
      });
    return createPortadomPromise<TNewEl>(dom);
  };

  const parent = <TNewEl extends Locator | ElementHandle = El>() => {
    const dom = (node as Locator)
      .evaluateHandle((el) => el.parentElement || null)
      .catch(logAndRethrow)
      .then(async (resultEl) => {
        const hasResult = await verifyHandleEl(resultEl);
        return hasResult ? playwrightHandlePortadom(resultEl as unknown as TNewEl, page) : null;
      });
    return createPortadomPromise<TNewEl>(dom);
  };

  const children = <TNewEl extends Locator | ElementHandle = El>() => {
    const doms = (node as Locator)
      .evaluateHandle((el) => [...(el as Element).children])
      .catch(logAndRethrow)
      .then(async (elsHandle) => {
        const resultEls = await splitPlaywrightSelection(elsHandle as any);
        return resultEls.map((el) => playwrightHandlePortadom(el as unknown as TNewEl, page));
      });
    return createPortadomArrayPromise<TNewEl>(doms);
  };

  const root = <TNewEl extends Locator | ElementHandle = El>() => {
    const dom = (node as Locator)
      .evaluateHandle((el) => el.ownerDocument?.documentElement || null)
      .catch(logAndRethrow)
      .then(async (resultEl) => {
        const hasResult = await verifyHandleEl(resultEl);
        return hasResult ? playwrightHandlePortadom(resultEl as unknown as TNewEl, page) : null;
      });
    return createPortadomPromise<TNewEl>(dom);
  };

  const remove = async () => {
    await (node as Locator).evaluate((el) => el.remove()).catch(logAndRethrow);
  };

  const _getCommonAncestor = async (loc1: El, loc2: El) => {
    const isEl1BeforeEl2 = await (
      await mergeHandles([loc1, loc2])
    )
      .evaluate(([el1, el2]) => {
        if (!el1 || !el2) return false;
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
        const result = !!(el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_FOLLOWING);
        return result;
      })
      .catch(logAndRethrow);

    const { firstEl, lastEl } = isEl1BeforeEl2
      ? { firstEl: loc1, lastEl: loc2 }
      : { firstEl: loc2, lastEl: loc1 };

    const ancestor = await (
      await mergeHandles([firstEl, lastEl])
    )
      .evaluateHandle(([el1, el2]) => {
        if (!el1 || !el2) return null;
        // https://stackoverflow.com/a/25154092
        // https://developer.mozilla.org/en-US/docs/Web/API/Range/commonAncestorContainer
        const range = new Range();
        range.setStartBefore(el1);
        range.setEndAfter(el2);
        const containerEl = range.commonAncestorContainer;
        return containerEl;
      })
      .catch(logAndRethrow);

    const hasResult = await (ancestor as JSHandle).evaluate((el) => !!el).catch(logAndRethrow);
    return hasResult ? (ancestor as El) : null;
  };

  const getCommonAncestor = <TNewEl extends Locator | ElementHandle = El>(otherEl: El) => {
    const dom = _getCommonAncestor(node, otherEl).then(async (resultEl) => {
      const hasResult = await verifyHandleEl(resultEl);
      return resultEl && hasResult
        ? playwrightHandlePortadom(resultEl as any as TNewEl, page)
        : null;
    });
    return createPortadomPromise<TNewEl>(dom);
  };

  const _getCommonAncestorFromSelector = _createCommonAncestorFromSelectorFn<El>({
    querySelectorAll: async (selector) => {
      const resultEls = (await findMany(selector).map((d) => d.node!)).filter(Boolean);
      return resultEls;
    },
    getParent: async (el) => {
      return playwrightHandlePortadom(el, page).parent().node as Promise<El | null>;
    },
    isAncestor: async (el1, el2) => {
      return (await mergeHandles([el1, el2] as any))
        .evaluate(([el1, el2]: Element[]) => {
          if (!el1 || !el2) return false;
          // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
          const result = !!(el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_CONTAINED_BY);
          return result;
        })
        .catch(logAndRethrow);
    },
    getCommonAncestor: _getCommonAncestor,
  });

  const getCommonAncestorFromSelector = <TNewEl extends Locator | ElementHandle = El>(
    selector: string
  ) => {
    const dom = _getCommonAncestorFromSelector(selector).then(async (resultEl) => {
      const hasResult = await verifyHandleEl(resultEl);
      return resultEl && hasResult
        ? playwrightHandlePortadom(resultEl as any as TNewEl, page)
        : null;
    });
    return createPortadomPromise<TNewEl>(dom);
  };

  return {
    node,

    text,
    textAsLower,
    textAsUpper,
    textAsNumber,
    attr,
    attrs,
    prop,
    props,
    href,
    src,
    nodeName,
    url,
    map,

    findOne,
    findMany,
    closest,
    parent,
    children,
    root,
    remove,
    getCommonAncestor,
    getCommonAncestorFromSelector,
  } as PlaywrightHandlePortadom<El>;
};

/** Implementation of Portadom in Playwright using Locators */
export type PlaywrightLocatorPortadom<El extends Locator = Locator> = Portadom<El>;

/** Implementation of Portadom in Playwright using Locators */
export const playwrightLocatorPortadom = <El extends Locator = Locator>(
  node: El,
  page: Page
): PlaywrightLocatorPortadom<El> => {
  // NOTE: Where possible, make use of the already-existing logic for Handles
  const handleDom = playwrightHandlePortadom(node, page);

  ///////////////////////
  // SCALAR OPERATIONS
  ///////////////////////

  /** Empty */

  ///////////////////////
  // NODE OPERATIONS
  ///////////////////////

  const findOne = <TNewEl extends Locator = El>(selector: string) => {
    const resultEl = node.locator(selector);
    const dom = verifyHandleEl(resultEl).then((hasResult) => {
      return hasResult ? playwrightLocatorPortadom(resultEl as TNewEl, page) : null;
    });
    return createPortadomPromise<TNewEl>(dom);
  };

  const findMany = <TNewEl extends Locator = El>(selector: string) => {
    const doms = node
      .locator(selector)
      .all()
      .then((resultEls) => {
        return resultEls.map((el) => playwrightLocatorPortadom(el as TNewEl, page));
      });
    return createPortadomArrayPromise<TNewEl>(doms);
  };

  const closest = <TNewEl extends Locator = El>(selector: string) => {
    // Find closest ancestor matching the given selector.
    // See https://stackoverflow.com/a/40333166/9788634
    const resultEl = node.locator(`xpath=ancestor::${selector.trim()}[position() = 1]`);
    const dom = verifyHandleEl(resultEl).then((hasResult) => {
      return hasResult ? playwrightLocatorPortadom(resultEl as TNewEl, page) : null;
    });
    return createPortadomPromise<TNewEl>(dom);
  };

  const parent = <TNewEl extends Locator = El>() => {
    return closest<TNewEl>('*');
  };

  const children = <TNewEl extends Locator = El>() => {
    const doms = node
      .locator('xpath=child::*')
      .all()
      .then((resultEls) => {
        return resultEls.map((el) => playwrightLocatorPortadom(el as TNewEl, page));
      });
    return createPortadomArrayPromise<TNewEl>(doms);
  };

  const root = <TNewEl extends Locator = El>() => {
    // Find closest ancestor matching the given selector.
    // See https://stackoverflow.com/a/40333166/9788634 and https://stackoverflow.com/q/31562639/9788634
    const resultEl = node.locator(`xpath=ancestor::*[position() = last()]`);
    const dom = verifyHandleEl(resultEl).then((hasResult) => {
      return hasResult ? playwrightLocatorPortadom(resultEl as TNewEl, page) : null;
    });
    return createPortadomPromise<TNewEl>(dom);
  };

  const remove = async () => {
    await node.evaluate((el) => el.remove()).catch(logAndRethrow);
  };

  /** Function that finds the closest common ancestor for `el1` and `el2`. */
  const _getCommonAncestor = async (el1: El, el2: El) => {
    const ch1Parents = await el1.locator(`xpath=ancestor::*`).all();
    const ch2Parents = await el2.locator(`xpath=ancestor::*`).all();

    let commonAncestor: El | null = null;
    for (const comparerParent of ch1Parents) {
      for (const compareeParent of ch2Parents) {
        const handle = await mergeHandles([comparerParent, compareeParent]);
        const isSame = await handle.evaluate(([el1, el2]: Element[]) => {
          return el1 === el2;
        });
        if (isSame) {
          commonAncestor = comparerParent as El;
          break;
        }
      }
      if (commonAncestor) break;
    }
    return commonAncestor;
  };

  const getCommonAncestor = <TNewEl extends Locator = El>(otherEl: El) => {
    const dom = _getCommonAncestor(node, otherEl).then(async (resultEl) => {
      const hasResult = await verifyHandleEl(resultEl);
      return resultEl && hasResult
        ? playwrightLocatorPortadom(resultEl as any as TNewEl, page)
        : null;
    });
    return createPortadomPromise<TNewEl>(dom);
  };

  const _getCommonAncestorFromSelector = _createCommonAncestorFromSelectorFn<El>({
    querySelectorAll: async (selector) => {
      const resultEls = (await findMany(selector).map((d) => d.node!)).filter(Boolean);
      return resultEls;
    },
    getParent: async (el) => {
      return playwrightLocatorPortadom(el, page).parent().node as Promise<El | null>;
    },
    isAncestor: async (el1, el2) => {
      return (await mergeHandles([el1, el2] as any))
        .evaluate(([el1, el2]: Element[]) => {
          if (!el1 || !el2) return false;
          // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
          const result = !!(el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_CONTAINED_BY);
          return result;
        })
        .catch(logAndRethrow);
    },
    getCommonAncestor: _getCommonAncestor,
  });

  const getCommonAncestorFromSelector = <TNewEl extends Locator = El>(selector: string) => {
    const dom = _getCommonAncestorFromSelector(selector).then(async (ancestor) => {
      const hasResult = await (ancestor as Locator)?.evaluate((el) => !!el).catch(logAndRethrow);
      return ancestor && hasResult
        ? playwrightHandlePortadom(ancestor as any as TNewEl, page)
        : null;
    });
    return createPortadomPromise<TNewEl>(dom);
  };

  return {
    node,

    text: handleDom.text,
    textAsLower: handleDom.textAsLower,
    textAsUpper: handleDom.textAsUpper,
    textAsNumber: handleDom.textAsNumber,
    attr: handleDom.attr,
    attrs: handleDom.attrs,
    prop: handleDom.prop,
    props: handleDom.props,
    href: handleDom.href,
    src: handleDom.src,
    nodeName: handleDom.nodeName,
    url: handleDom.url,
    map: handleDom.map,

    findOne,
    findMany,
    closest,
    parent,
    children,
    root,
    remove,
    getCommonAncestor,
    getCommonAncestorFromSelector,
  } as PlaywrightLocatorPortadom<El>;
};

const _createCommonAncestorFromSelectorFn = <El>(input: {
  querySelectorAll: (selector: string) => MaybePromise<Iterable<El> | El[]>;
  getParent: (el: El) => MaybePromise<El | null>;
  /** Function that returns `true` if `el1` is ancestor of `el2`. */
  isAncestor: (el1: El, el2: El) => MaybePromise<boolean>;
  /** Function that finds the closest common ancestor for `el1` and `el2`. */
  getCommonAncestor: (el1: El, el2: El) => MaybePromise<El | null>;
}) => {
  const getCommonAncestorFromSelector = async (selector: string): Promise<El | null> => {
    const elements = [...(await input.querySelectorAll(selector))];

    if (elements.length === 0) return null;
    if (elements.length === 1) {
      // If there's only one element, the common ancestor is its parent
      return input.getParent(elements[0]);
    }

    // Start with the first pair
    let ancestor = await input.getCommonAncestor(elements[0], elements[1]);
    if (!ancestor) return null;

    // Progressively include more elements
    for (let i = 2; i < elements.length; i++) {
      const isAnc = await input.isAncestor(ancestor, elements[i]);
      if (!isAnc) {
        ancestor = await input.getCommonAncestor(ancestor, elements[i]);
        if (!ancestor) return null;
      }
    }

    return ancestor;
  };

  return getCommonAncestorFromSelector;
};
