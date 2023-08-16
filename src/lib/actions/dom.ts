import { AnyNode, Cheerio } from 'cheerio';
import type { ElementHandle, JSHandle, Locator, Page } from 'playwright';
import get from 'lodash/get';

import { StrAsNumOptions, strAsNumber, strOrNull } from '../../utils/format';
import { FormatUrlOptions, formatUrl } from '../../utils/url';
import type { MaybeArray, MaybePromise } from '../../utils/types';
import { mergeHandles, splitCheerioSelection, splitPlaywrightSelection } from './domUtils';

/**
 * Common interface for working with DOM despite different environments.
 *
 * Consider these environments:
 * 1) Browser (via Playwright & Chromium) - uses Browser API to work with DOM
 * 2) Cheerio - uses own API to work with DOM
 *
 * This common interfaces makes the scraping code more portable between the two.
 */
export interface DOMLib<El extends BaseEl, BaseEl> {
  node: El | null;

  ///////////////////////
  // SCALAR OPERATIONS
  ///////////////////////

  /** Get element's text (trimmed) */
  text: (options?: { allowEmpty?: boolean }) => MaybePromise<string | null>;
  /** Get element's text as uppercase (trimmed) */
  textAsUpper: (options?: { allowEmpty?: boolean }) => MaybePromise<string | null>;
  /** Get element's text as lowercase (trimmed) */
  textAsLower: (options?: { allowEmpty?: boolean }) => MaybePromise<string | null>;
  /** Get element's text and convert it to number */
  textAsNumber: (options?: StrAsNumOptions) => MaybePromise<number | null>;
  /** Get element's attribute */
  attr: (attrName: string, options?: { allowEmpty?: boolean }) => MaybePromise<string | null>;
  /** Get element's attributes */
  attrs: <T extends string>(
    attrNames: T[],
    options?: { allowEmpty?: boolean }
  ) => MaybePromise<Record<T, string | null>>;
  /** Get element's property */
  prop: <R = unknown>(
    /** Single or nested prop path */
    propName: MaybeArray<string>,
    options?: { allowEmpty?: boolean }
  ) => MaybePromise<R>;
  /** Get element's properties */
  props: <R extends any[]>(
    /** List of single or nested prop paths */
    propName: MaybeArray<string>[],
    options?: { allowEmpty?: boolean }
  ) => MaybePromise<R>;
  /** Get element's href */
  href: (options?: { allowEmpty?: boolean } & FormatUrlOptions) => MaybePromise<string | null>;
  /** Get element's src */
  src: (options?: { allowEmpty?: boolean } & FormatUrlOptions) => MaybePromise<string | null>;
  /** Get element's nodeName */
  nodeName: () => MaybePromise<string | null>;
  /** Get URL of website associated with the DOM */
  url: () => MaybePromise<string | null>;
  /** Freely modify the underlying DOM node */
  map: <TVal>(map: (node: El | null) => TVal) => MaybePromise<TVal>;

  ///////////////////////
  // NODE OPERATIONS
  ///////////////////////

  /** Get a single descendant matching the selector */
  findOne: <TNewEl extends BaseEl = El>(selector: string) => MaybePromise<DOMLib<TNewEl, BaseEl> | null>; // prettier-ignore
  /** Get all descendants matching the selector */
  findMany: <TNewEl extends BaseEl = El>(selector: string) => MaybePromise<DOMLib<TNewEl, BaseEl>[]>; // prettier-ignore
  /** Get a single ancestor (or itself) matching the selector */
  closest: <TNewEl extends BaseEl = El>(selector: string) => MaybePromise<DOMLib<TNewEl, BaseEl> | null>; // prettier-ignore
  /** Get element's parent */
  parent: <TNewEl extends BaseEl = El>() => MaybePromise<DOMLib<TNewEl, BaseEl> | null>;
  /** Get element's children */
  children: <TNewEl extends BaseEl = El>() => MaybePromise<DOMLib<TNewEl, BaseEl>[]>;
  /** Get remove the element */
  remove: () => MaybePromise<void>;
  /** Get root element */
  root: <TNewEl extends BaseEl = El>() => MaybePromise<DOMLib<TNewEl, BaseEl> | null>;

  /**
   * Given two elements, return closest ancestor element that encompases them both,
   * or `null` if none such found.
   */
  getCommonAncestor: <TNewEl extends BaseEl = El>(
    otherEl: El
  ) => MaybePromise<DOMLib<TNewEl, BaseEl> | null>;
  /**
   * Given a selector, find all DOM elements that match the selector,
   * and return closest ancestor element that encompases them all,
   * or `null` if none such found.
   */
  getCommonAncestorFromSelector: <TNewEl extends BaseEl = El>(
    selector: string
  ) => MaybePromise<DOMLib<TNewEl, BaseEl> | null>;
}

export type BrowserDOMLib<T extends Element = Element> = DOMLib<T, Element>;

/** Implementation of DOMLib in browser (using Browser API) */
export const browserDOMLib = <El extends Element>(node: El): BrowserDOMLib<El> => {
  ///////////////////////
  // SCALAR OPERATIONS
  ///////////////////////

  const text: BrowserDOMLib<El>['text'] = ({ allowEmpty } = {}) => {
    const txt = node.textContent?.trim() ?? null;
    return strOrNull(txt, allowEmpty);
  };

  const textAsUpper: BrowserDOMLib<El>['textAsUpper'] = (options) => {
    const txt = text(options);
    return txt ? (txt as string).toLocaleUpperCase() : txt;
  };

  const textAsLower: BrowserDOMLib<El>['textAsLower'] = (options) => {
    const txt = text(options);
    return txt ? (txt as string).toLocaleLowerCase() : txt;
  };

  const textAsNumber: BrowserDOMLib<El>['textAsNumber'] = (options) => {
    const txt = text(options);
    return strAsNumber(txt as string, options);
  };

  const prop: BrowserDOMLib<El>['prop'] = <R = unknown>(
    propOrPath: MaybeArray<string>,
    { allowEmpty = false } = {}
  ) => {
    const propPath = Array.isArray(propOrPath) ? propOrPath : [propOrPath];
    let propVal = get(node, propPath) ?? null;
    propVal = typeof propVal === 'string' ? propVal.trim() : propVal;
    return strOrNull(propVal, allowEmpty) as R;
  };

  const props: BrowserDOMLib<El>['props'] = <R extends any[]>(
    propsOrPaths: MaybeArray<string>[],
    options = {}
  ) => {
    const propPaths = propsOrPaths.map((p) => (Array.isArray(p) ? p : [p]));
    const propData = propPaths.map((path) => prop(path, options));
    return propData as MaybePromise<R>;
  };

  const attr: BrowserDOMLib<El>['attr'] = (propName, { allowEmpty } = {}) => {
    let attrVal = node.getAttribute(propName) ?? null;
    attrVal = typeof attrVal === 'string' ? attrVal.trim() : attrVal;
    return strOrNull(attrVal, allowEmpty);
  };

  const attrs: BrowserDOMLib<El>['attrs'] = <T extends string>(attrNames: T[], options = {}) => {
    const attrData = attrNames.reduce<Record<T, string | null>>((agg, name) => {
      agg[name] = attr(name, options) as string | null;
      return agg;
    }, {} as any);
    return attrData;
  };

  const href: BrowserDOMLib<El>['href'] = ({ allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop('href', { allowEmpty }) as string | null;
    return formatUrl(val, { allowRelative, baseUrl });
  };

  const src: BrowserDOMLib<El>['src'] = ({ allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop('src', { allowEmpty }) as string | null;
    return formatUrl(val, { allowRelative, baseUrl });
  };

  const nodeName: BrowserDOMLib<El>['nodeName'] = () => {
    // On UPPER- vs lower-case https://stackoverflow.com/questions/27223756/
    const val = prop('nodeName') as string | null;
    return typeof val === 'string' ? val.toLocaleUpperCase() : val;
  };

  const url: BrowserDOMLib<El>['url'] = () => {
    const doc = node.ownerDocument;
    // See https://stackoverflow.com/a/16010322/9788634
    const urlVal = doc.defaultView?.location?.href || null;
    return urlVal;
  };

  const map: BrowserDOMLib<El>['map'] = <TVal>(mapFn: (node: El) => TVal) => {
    return mapFn(node);
  };

  ///////////////////////
  // NODE OPERATIONS
  ///////////////////////

  const findOne: BrowserDOMLib<El>['findOne'] = <TNewEl extends Element = El>(selector) => {
    if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(node.nodeType as any)) return null;
    const resultEl = (node.querySelector(selector) ?? null) as TNewEl | null;
    return resultEl ? browserDOMLib(resultEl) : null;
  };

  const findMany: BrowserDOMLib<El>['findMany'] = <TNewEl extends Element = El>(selector) => {
    if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(node.nodeType as any)) return [];
    const resultEls = [...node.querySelectorAll(selector)] as TNewEl[]; // prettier-ignore
    return resultEls.map((el) => browserDOMLib(el));
  };

  const closest: BrowserDOMLib<El>['closest'] = <TNewEl extends Element = El>(selector) => {
    if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(node.nodeType as any)) return null;
    const resultEl = (node.closest(selector) ?? null) as TNewEl | null;
    return resultEl ? browserDOMLib(resultEl) : null;
  };

  const parent: BrowserDOMLib<El>['parent'] = <TNewEl extends Element = El>() => {
    const parentEl = (node.parentNode || null) as TNewEl | null;
    return parentEl ? browserDOMLib(parentEl) : null;
  };

  const children: BrowserDOMLib<El>['children'] = <TNewEl extends Element = El>() => {
    const childEls = [...node.children] as TNewEl[];
    return childEls.map((el) => browserDOMLib(el));
  };

  const root: BrowserDOMLib<El>['root'] = <TNewEl extends Element = El>() => {
    const rootEl = ((node.ownerDocument?.documentElement as any) || null) as TNewEl | null;
    return rootEl ? browserDOMLib(rootEl) : null;
  };

  const remove: BrowserDOMLib<El>['remove'] = () => {
    node.remove();
  };

  const _getCommonAncestor = <El extends Node>(el1: El, el2: El) => {
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

  const getCommonAncestor: BrowserDOMLib<El>['getCommonAncestor'] = <TNewEl extends Element = El>(
    otherEl
  ) => {
    const ancestor = _getCommonAncestor(node, otherEl);
    return ancestor ? browserDOMLib<TNewEl>(ancestor) : null;
  };

  const _getCommonAncestorFromSelector = _createCommonAncestorFromSelectorFn<El>({
    querySelectorAll: (selector) => node.querySelectorAll(selector) as Iterable<El>,
    getParent: (el) => el.parentElement as El | null,
    isAncestor: (el1, el2) => {
      return !!(el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_CONTAINED_BY);
    },
    getCommonAncestor: (el1, el2) => _getCommonAncestor(el1, el2),
  });

  const getCommonAncestorFromSelector: BrowserDOMLib<El>['getCommonAncestorFromSelector'] = async <
    TNewEl extends Element = El
  >(
    selector
  ) => {
    const ancestor = (await _getCommonAncestorFromSelector(selector)) as TNewEl | null;
    return ancestor ? browserDOMLib(ancestor) : null;
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
  } satisfies DOMLib<El, Element>;
};

export type CheerioDOMLib<El extends Cheerio<AnyNode> = Cheerio<AnyNode>> = DOMLib<
  El,
  Cheerio<AnyNode>
>;

/** Implementation of DOMLib in Cheerio */
export const cheerioDOMLib = <El extends Cheerio<AnyNode>>(
  cheerioNode: El,
  srcUrl: string | null
): CheerioDOMLib<El> => {
  ///////////////////////
  // SCALAR OPERATIONS
  ///////////////////////

  const text: CheerioDOMLib<El>['text'] = ({ allowEmpty } = {}) => {
    const txt = cheerioNode.text()?.trim() ?? null;
    return strOrNull(txt, allowEmpty);
  };

  const textAsUpper: CheerioDOMLib<El>['textAsUpper'] = (options) => {
    const txt = text(options);
    return txt ? (txt as string).toLocaleUpperCase() : txt;
  };

  const textAsLower: CheerioDOMLib<El>['textAsLower'] = (options) => {
    const txt = text(options);
    return txt ? (txt as string).toLocaleLowerCase() : txt;
  };

  const textAsNumber: CheerioDOMLib<El>['textAsNumber'] = (options) => {
    const txt = text(options);
    return strAsNumber(txt as string, options);
  };

  const attr: CheerioDOMLib<El>['attr'] = (attrName, { allowEmpty } = {}) => {
    let attrVal = cheerioNode.attr(attrName) ?? null;
    attrVal = typeof attrVal === 'string' ? attrVal.trim() : attrVal;
    return strOrNull(attrVal, allowEmpty);
  };

  const attrs: CheerioDOMLib<El>['attrs'] = <T extends string>(attrNames: T[], options = {}) => {
    const attrData = attrNames.reduce<Record<T, string | null>>((agg, name) => {
      agg[name] = attr(name, options) as string | null;
      return agg;
    }, {} as any);
    return attrData;
  };

  const prop: CheerioDOMLib<El>['prop'] = <R = unknown>(
    propOrPath: MaybeArray<string>,
    { allowEmpty = false } = {}
  ) => {
    const propPath = Array.isArray(propOrPath) ? propOrPath : [propOrPath];
    let propVal = cheerioNode.prop(propPath[0]) ?? null;
    if (propPath.length > 1) propVal = get(propVal, propPath.slice(1));
    propVal = typeof propVal === 'string' ? propVal.trim() : propVal;
    return strOrNull(propVal, allowEmpty) as R;
  };

  const props: CheerioDOMLib<El>['props'] = <R extends any[]>(
    propsOrPaths: MaybeArray<string>[],
    options = {}
  ) => {
    const propPaths = propsOrPaths.map((p) => (Array.isArray(p) ? p : [p]));
    const propData = propPaths.map((path) => prop(path, options));
    return propData as MaybePromise<R>;
  };

  const href: CheerioDOMLib<El>['href'] = ({ allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop('href', { allowEmpty }) as string | null;
    return formatUrl(val, { allowRelative, baseUrl });
  };

  const src: CheerioDOMLib<El>['src'] = ({ allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop('src', { allowEmpty }) as string | null;
    return formatUrl(val, { allowRelative, baseUrl });
  };

  const nodeName: CheerioDOMLib<El>['nodeName'] = () => {
    // On UPPER- vs lower-case https://stackoverflow.com/questions/27223756/
    const val = prop('nodeName') as string | null;
    return typeof val === 'string' ? val.toLocaleUpperCase() : val;
  };

  const url: CheerioDOMLib<El>['url'] = () => {
    return srcUrl ?? null;
  };

  const map: CheerioDOMLib<El>['map'] = <TVal>(mapFn: (node: El) => TVal) => {
    return mapFn(cheerioNode);
  };

  ///////////////////////
  // NODE OPERATIONS
  ///////////////////////

  const findOne: CheerioDOMLib<El>['findOne'] = <TNewEl extends Cheerio<AnyNode> = El>(
    selector
  ) => {
    const resultEl = cheerioNode.find(selector).first() as TNewEl;
    if (!resultEl.get(0)) return null;
    return cheerioDOMLib(resultEl, srcUrl);
  };

  const findMany: CheerioDOMLib<El>['findMany'] = <TNewEl extends Cheerio<AnyNode> = El>(
    selector
  ) => {
    const resultEls = splitCheerioSelection(cheerioNode.find(selector)) as TNewEl[];
    return resultEls.map((ch) => cheerioDOMLib(ch, srcUrl));
  };

  const closest: CheerioDOMLib<El>['closest'] = <TNewEl extends Cheerio<AnyNode> = El>(
    selector
  ) => {
    const resultEl = cheerioNode.closest(selector).first() as TNewEl;
    if (!resultEl.get(0)) return null;
    return cheerioDOMLib(resultEl, srcUrl);
  };

  const parent: CheerioDOMLib<El>['parent'] = <TNewEl extends Cheerio<AnyNode> = El>() => {
    const parentEl = cheerioNode.parent().first() as TNewEl;
    if (!parentEl.get(0)) return null;
    return cheerioDOMLib(parentEl, srcUrl);
  };

  const children: CheerioDOMLib<El>['children'] = <TNewEl extends Cheerio<AnyNode> = El>() => {
    const childEls = splitCheerioSelection(cheerioNode.children()) as TNewEl[];
    return childEls.map((ch) => cheerioDOMLib(ch, srcUrl));
  };

  const root: CheerioDOMLib<El>['root'] = <TNewEl extends Cheerio<AnyNode> = El>() => {
    const rootEl = cheerioNode._root?.first() as TNewEl | null;
    if (!rootEl?.get(0)) return null;
    return cheerioDOMLib(rootEl, srcUrl);
  };

  const remove: CheerioDOMLib<El>['remove'] = () => {
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
    }
    return commonAncestor;
  };

  const getCommonAncestor: CheerioDOMLib<El>['getCommonAncestor'] = async <
    TNewEl extends Cheerio<AnyNode> = El
  >(
    otherEl
  ) => {
    const ancestor = (await _getCommonAncestor(cheerioNode, otherEl)) as TNewEl | null;
    if (!ancestor?.get(0)) return null;
    return cheerioDOMLib<TNewEl>(ancestor, srcUrl);
  };

  const _getCommonAncestorFromSelector = _createCommonAncestorFromSelectorFn<El>({
    querySelectorAll: (selector) => splitCheerioSelection(cheerioNode.find(selector)) as El[],
    getParent: (el) => el.parent() as El | null,
    isAncestor: (el1, el2) => el1.is(el2.parents()),
    getCommonAncestor: (el1, el2) => _getCommonAncestor(el1, el2),
  });

  const getCommonAncestorFromSelector: CheerioDOMLib<El>['getCommonAncestorFromSelector'] = async <
    TNewEl extends Cheerio<AnyNode> = El
  >(
    selector
  ) => {
    const ancestor = (await _getCommonAncestorFromSelector(selector)) as TNewEl | null;
    if (!ancestor?.get(0)) return null;
    return cheerioDOMLib<TNewEl>(ancestor, srcUrl);
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
  } satisfies CheerioDOMLib<El>;
};

export type PlaywrightDOMLib<
  El extends Locator | ElementHandle<Node> = Locator | ElementHandle<Node>
> = DOMLib<El, Locator | ElementHandle<Node>>;

/** Implementation of DOMLib in Playwright */
export const playwrightDOMLib = <El extends Locator | ElementHandle<Node>>(
  node: El,
  page: Page
): PlaywrightDOMLib<El> => {
  ///////////////////////
  // SCALAR OPERATIONS
  ///////////////////////

  const text: PlaywrightDOMLib<El>['text'] = async ({ allowEmpty } = {}) => {
    const txt = (await node.textContent())?.trim() ?? null;
    return strOrNull(txt, allowEmpty);
  };

  const textAsUpper: PlaywrightDOMLib<El>['textAsUpper'] = async (options) => {
    const txt = await text(options);
    return txt ? txt.toLocaleUpperCase() : txt;
  };

  const textAsLower: PlaywrightDOMLib<El>['textAsLower'] = async (options) => {
    const txt = await text(options);
    return txt ? txt.toLocaleLowerCase() : txt;
  };

  const textAsNumber: PlaywrightDOMLib<El>['textAsNumber'] = async (options) => {
    const txt = await text(options);
    return strAsNumber(txt, options);
  };

  const prop: PlaywrightDOMLib<El>['prop'] = async <R = unknown>(
    propOrPath: MaybeArray<string>,
    options = {}
  ) => {
    const [resProp] = await props([propOrPath], options);
    return resProp as R;
  };

  const props: PlaywrightDOMLib<El>['props'] = async <R extends any[]>(
    propsOrPaths: MaybeArray<string>[],
    { allowEmpty = false } = {}
  ) => {
    const propPaths = propsOrPaths.map((p) => (Array.isArray(p) ? p : [p]));
    const data = await (node as Locator).evaluate(
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
    );
    return data as R;
  };

  const attr: PlaywrightDOMLib<El>['attr'] = async (attrName, { allowEmpty } = {}) => {
    let attrVal = (await node.getAttribute(attrName)) ?? null;
    attrVal = typeof attrVal === 'string' ? attrVal.trim() : attrVal;
    return strOrNull(attrVal, allowEmpty);
  };

  const attrs: PlaywrightDOMLib<El>['attrs'] = <El extends string>(
    attrNames: El[],
    { allowEmpty = false } = {}
  ) => {
    const data = (node as Locator).evaluate(
      (el, { attrNames, allowEmpty }) => {
        const attrData = (attrNames as El[]).reduce<Record<El, string | null>>((agg, name) => {
          let attrVal = el.getAttribute(name) ?? null;
          attrVal = typeof attrVal === 'string' ? attrVal.trim() : attrVal;
          agg[name] = strOrNull(attrVal, allowEmpty);
          return agg;
        }, {} as any);
        return attrData;
      },
      { attrNames, allowEmpty }
    );
    return data;
  };

  const href: PlaywrightDOMLib<El>['href'] = async ({
    allowEmpty,
    allowRelative,
    baseUrl,
  } = {}) => {
    const val = (await prop('href', { allowEmpty })) as string | null;
    return formatUrl(val, { allowRelative, baseUrl });
  };

  const src: PlaywrightDOMLib<El>['src'] = async ({ allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = (await prop('src', { allowEmpty })) as string | null;
    return formatUrl(val, { allowRelative, baseUrl });
  };

  const nodeName: PlaywrightDOMLib<El>['nodeName'] = async () => {
    // On UPPER- vs lower-case https://stackoverflow.com/questions/27223756/
    const val = (await prop('nodeName')) as string | null;
    return typeof val === 'string' ? val.toLocaleUpperCase() : val;
  };

  const url: PlaywrightDOMLib<El>['url'] = async () => {
    return page.url() || null;
  };

  const map: PlaywrightDOMLib<El>['map'] = <TVal>(mapFn: (node: El) => TVal) => {
    return mapFn(node);
  };

  ///////////////////////
  // NODE OPERATIONS
  ///////////////////////

  const findOne: PlaywrightDOMLib<El>['findOne'] = async <
    TNewEl extends Locator | ElementHandle<Node> = El
  >(
    selector
  ) => {
    const resultEl = await node.evaluateHandle((el, s) => {
      if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(el.nodeType as any)) return null;
      return (el as Element).querySelector(s) || null;
    }, selector);
    const hasResult = await resultEl.evaluate((el) => !!el);
    return hasResult ? playwrightDOMLib(resultEl as TNewEl, page) : null;
  };

  const findMany: PlaywrightDOMLib<El>['findMany'] = async <
    TNewEl extends Locator | ElementHandle<Node> = El
  >(
    selector
  ) => {
    const elsHandle = await node.evaluateHandle((el, s) => {
      if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(el.nodeType as any)) return [];
      return [...(el as Element).querySelectorAll<Element>(s)];
    }, selector);
    const resultEls = await splitPlaywrightSelection<any>(elsHandle);
    return resultEls.map((el) => playwrightDOMLib(el as TNewEl, page));
  };

  const closest: PlaywrightDOMLib<El>['closest'] = async <
    TNewEl extends Locator | ElementHandle<Node> = El
  >(
    selector
  ) => {
    const resultEl = await node.evaluateHandle((el, s) => {
      if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(el.nodeType as any)) return null;
      return (el as Element).closest(s) || null;
    }, selector);
    const hasResult = await resultEl.evaluate((el) => !!el);
    return hasResult ? playwrightDOMLib(resultEl as TNewEl, page) : null;
  };

  const parent: PlaywrightDOMLib<El>['parent'] = async <
    TNewEl extends Locator | ElementHandle<Node> = El
  >() => {
    const parentEl = await node.evaluateHandle((el) => el.parentElement || null);
    const hasResult = await parentEl.evaluate((el) => !!el);
    return hasResult ? playwrightDOMLib(parentEl as TNewEl, page) : null;
  };

  const children: PlaywrightDOMLib<El>['children'] = async <
    TNewEl extends Locator | ElementHandle<Node> = El
  >() => {
    const elsHandle = await node.evaluateHandle((el) => [...(el as Element).children]);
    const resultEls = await splitPlaywrightSelection<any>(elsHandle);
    return resultEls.map((el) => playwrightDOMLib(el as TNewEl, page));
  };

  const root: PlaywrightDOMLib<El>['root'] = async <
    TNewEl extends Locator | ElementHandle<Node> = El
  >() => {
    const rootEl = await node.evaluateHandle((el) => el.ownerDocument?.documentElement || null);
    const hasResult = await rootEl.evaluate((el) => !!el);
    return hasResult ? playwrightDOMLib(rootEl as TNewEl, page) : null;
  };

  const remove: PlaywrightDOMLib<El>['remove'] = async () => {
    await (node as Locator).evaluate((el) => el.remove());
  };

  const _getCommonAncestor = async (loc1: El, loc2: El) => {
    const isEl1BeforeEl2 = await (
      await mergeHandles([loc1, loc2])
    ).evaluate(([el1, el2]) => {
      if (!el1 || !el2) return false;
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
      const result = !!(el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_FOLLOWING);
      return result;
    });

    const { firstEl, lastEl } = isEl1BeforeEl2
      ? { firstEl: loc1, lastEl: loc2 }
      : { firstEl: loc2, lastEl: loc1 };

    const ancestor = await (
      await mergeHandles([firstEl, lastEl])
    ).evaluateHandle(([el1, el2]) => {
      if (!el1 || !el2) return null;
      // https://stackoverflow.com/a/25154092
      // https://developer.mozilla.org/en-US/docs/Web/API/Range/commonAncestorContainer
      const range = new Range();
      range.setStartBefore(el1);
      range.setEndAfter(el2);
      const containerEl = range.commonAncestorContainer;
      return containerEl;
    });

    const hasResult = await (ancestor as JSHandle).evaluate((el) => !!el);
    return hasResult ? (ancestor as El) : null;
  };

  const getCommonAncestor: PlaywrightDOMLib<El>['getCommonAncestor'] = async <
    TNewEl extends Locator | ElementHandle<Node> = El
  >(
    otherEl
  ) => {
    const ancestor = (await _getCommonAncestor(node, otherEl)) as TNewEl | null;
    const hasResult = await (ancestor as Locator)?.evaluate((el) => !!el);
    return ancestor && hasResult ? playwrightDOMLib(ancestor, page) : null;
  };

  const _getCommonAncestorFromSelector = _createCommonAncestorFromSelectorFn<El>({
    querySelectorAll: async (selector) => {
      const elsHandle = await (node as Locator).evaluateHandle(
        (el, s) => [...el.querySelectorAll(s)],
        selector
      );
      const resultEls = await splitPlaywrightSelection<any>(elsHandle);
      return resultEls as El[];
    },
    getParent: async (el) => {
      const parentEl = await el.evaluateHandle((el) => el.parentElement || null);
      const hasResult = await parentEl.evaluate((el) => !!el);
      return hasResult ? (parentEl as El) : null;
    },
    isAncestor: async (el1, el2) => {
      return (await mergeHandles([el1, el2])).evaluate(([el1, el2]) => {
        if (!el1 || !el2) return false;
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
        const result = !!(el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_CONTAINED_BY);
        return result;
      });
    },
    getCommonAncestor: _getCommonAncestor,
  });

  const getCommonAncestorFromSelector: PlaywrightDOMLib<El>['getCommonAncestorFromSelector'] =
    async <TNewEl extends Locator | ElementHandle<Node> = El>(selector) => {
      const ancestor = (await _getCommonAncestorFromSelector(selector)) as TNewEl | null;
      const hasResult = await (ancestor as Locator)?.evaluate((el) => !!el);
      return ancestor && hasResult ? playwrightDOMLib(ancestor, page) : null;
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
  } satisfies PlaywrightDOMLib<El>;
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
    const els = [...(await input.querySelectorAll(selector))];
    if (!els.length) return null;
    if (els.length === 1) return input.getParent(els[0]);

    const comparerEl = els.shift();
    let ancestorEl: El | null = null;
    for (const el of els) {
      const currAncestorEl = comparerEl ? await input.getCommonAncestor(comparerEl, el) : null;
      const newAncestorEl = !ancestorEl
        ? currAncestorEl
        : currAncestorEl && (await input.isAncestor(currAncestorEl, ancestorEl))
        ? currAncestorEl
        : ancestorEl;
      ancestorEl = newAncestorEl;
    }

    return ancestorEl as El;
  };

  return getCommonAncestorFromSelector;
};
