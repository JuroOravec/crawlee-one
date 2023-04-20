import type { AnyNode, Cheerio, CheerioAPI } from 'cheerio';

import { StrAsNumOptions, strAsNumber, strOrNull } from '../utils/format';
import { FormatUrlOptions, formatUrl } from '../utils/url';

/**
 * Common interface for work working with DOM despite different environments.
 *
 * Consider these environments:
 * 1) Browser (via Playwright & Chromium) - uses Browser API to work with DOM
 * 2) Cheerio - uses own API to work with DOM
 *
 * This common interfaces makes the scraping code more portable between the two.
 */
export interface DOMLib<El> {
  /** Get element's text (trimmed) */
  text: (el: El | null, options?: { allowEmpty?: boolean }) => string | null;
  /** Get element's text as uppercase (trimmed) */
  textAsUpper: (el: El | null, options?: { allowEmpty?: boolean }) => string | null;
  /** Get element's text as lowercase (trimmed) */
  textAsLower: (el: El | null, options?: { allowEmpty?: boolean }) => string | null;
  /** Get element's text and convert it to number */
  textAsNumber: (el: El | null, options?: StrAsNumOptions) => number | null;
  /** Get element's property */
  prop: (el: El | null, propName: string, options?: { allowEmpty?: boolean }) => string | null;
  /** Get element's href */
  href: (el: El | null, options?: { allowEmpty?: boolean } & FormatUrlOptions) => string | null;
  /** Get element's src */
  src: (el: El | null, options?: { allowEmpty?: boolean } & FormatUrlOptions) => string | null;
  /** Get element's nodeName */
  nodeName: (el: El | null) => string | null;
  /** Get a single descendant matching the selector */
  findOne: DOMLibFindOne<El>;
  /** Get all descendants matching the selector */
  findMany: DOMLibFindMany<El>;
  /** Get element's parent */
  parent: DOMLibParent<El>;
  /** Get element's children */
  children: DOMLibChildren<El>;
  /** Get remove the element */
  remove: (el: El | null) => void;
  /** Get root element */
  root: DOMLibRoot<El>;
  /** Get URL of website associated with the DOM */
  url: () => string | null;
}

interface DOMLibFindOne<El> {
  (el: El | null, selector: string): El | null;
  <TVal>(el: El | null, selector: string, map: (el: El | null) => TVal): TVal | null;
}

interface DOMLibFindMany<El> {
  (el: El | null, selector: string): El[];
  <TVal>(el: El | null, selector: string, map: (el: El, index: number, arr: El[]) => TVal): TVal[];
}

interface DOMLibParent<El> {
  (el: El | null): El | null;
  <TVal>(el: El | null, map: (el: El | null) => TVal): TVal;
}

interface DOMLibChildren<El> {
  (el: El | null): El[];
  <TVal>(el: El | null, map: (el: El, index: number, arr: El[]) => TVal): TVal;
}

interface DOMLibRoot<El> {
  (): El | null;
  <TVal>(map: (el: El | null) => TVal): TVal;
}

export type BrowserDOMLib<T extends Node = Node> = DOMLib<T>;

/** Implementation of DOMLib in browser (using Browser API) */
export const browserDOMLib = <T extends Node>(doc: Document): BrowserDOMLib<T> => {
  const text: BrowserDOMLib<T>['text'] = (el, { allowEmpty } = {}) => {
    const txt = el?.textContent?.trim() ?? null;
    return strOrNull(txt, allowEmpty);
  };

  const textAsUpper: BrowserDOMLib<T>['textAsUpper'] = (el, options) => {
    const txt = text(el, options);
    return txt ? txt.toLocaleUpperCase() : txt;
  };

  const textAsLower: BrowserDOMLib<T>['textAsLower'] = (el, options) => {
    const txt = text(el, options);
    return txt ? txt.toLocaleLowerCase() : txt;
  };

  const textAsNumber: BrowserDOMLib<T>['textAsNumber'] = (el, options) => {
    const txt = text(el, options);
    return strAsNumber(txt, options);
  };

  const prop: BrowserDOMLib<T>['prop'] = (el, propName, { allowEmpty } = {}) => {
    let propVal = (el as any)?.[propName] ?? null;
    propVal = typeof propVal === 'string' ? propVal.trim() : propVal;
    return strOrNull(propVal, allowEmpty);
  };

  const href: BrowserDOMLib<T>['href'] = (el, { allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop(el, 'href', { allowEmpty });
    return formatUrl(val, { allowRelative, baseUrl });
  };

  const src: BrowserDOMLib<T>['src'] = (el, { allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop(el, 'src', { allowEmpty });
    return formatUrl(val, { allowRelative, baseUrl });
  };

  const nodeName: BrowserDOMLib<T>['nodeName'] = (el) => {
    // On UPPER- vs lower-case https://stackoverflow.com/questions/27223756/
    const val = prop(el, 'nodeName');
    return typeof val === 'string' ? val.toLocaleUpperCase() : val;
  };

  // @ts-expect-error Ignore - interface type is the source of truth
  const findOne: BrowserDOMLib<T>['findOne'] = (el, selector, mapFn) => {
    if (!el) return null;
    if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(el.nodeType as any)) return null;
    // prettier-ignore
    const resultEl = ((el as any as Element | Document).querySelector(selector) ?? null) as T | null;
    return mapFn ? mapFn(resultEl) : resultEl;
  };

  // @ts-expect-error Ignore - interface type is the source of truth
  const findMany: BrowserDOMLib<T>['findMany'] = (el, selector, mapFn) => {
    if (!el) return [];
    if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(el.nodeType as any)) return [];
    const resultEls = [...(el as any as Element | Document)?.querySelectorAll(selector)] as any as T[]; // prettier-ignore
    return mapFn ? resultEls.map(mapFn) : resultEls;
  };

  // @ts-expect-error Ignore - interface type is the source of truth
  const parent: BrowserDOMLib<T>['parent'] = (el, mapFn) => {
    const parentEl = el?.parentNode || null;
    return mapFn ? mapFn(parentEl as any) : parentEl;
  };

  // @ts-expect-error Ignore - interface type is the source of truth
  const children: BrowserDOMLib<T>['children'] = (el, mapFn) => {
    if (!el) return [];
    const childEls = [...el?.childNodes] as any as T[];
    return mapFn ? childEls.map(mapFn) : childEls;
  };

  // @ts-expect-error Ignore - interface type is the source of truth
  const root: BrowserDOMLib<T>['root'] = (mapFn) => {
    const rootEl = doc.documentElement || null;
    return mapFn ? mapFn(rootEl as any) : rootEl;
  };

  const remove: BrowserDOMLib<T>['remove'] = (el) => {
    if (!el) return;
    const parentEl = parent(el);
    parentEl?.removeChild(el);
  };

  const url: BrowserDOMLib<T>['url'] = () => {
    const urlVal = globalThis?.location?.href || null;
    return urlVal;
  };

  return {
    text,
    textAsLower,
    textAsUpper,
    textAsNumber,
    prop,
    href,
    src,
    nodeName,
    findOne,
    findMany,
    parent,
    children,
    root,
    remove,
    url,
  };
};

export type CheerioDOMLib<T extends AnyNode = AnyNode> = DOMLib<Cheerio<T>>;

/** Implementation of DOMLib in Cheerio */
export const cheerioDOMLib = <T extends AnyNode>(
  cheerioDom: CheerioAPI,
  srcUrl: string | null
): CheerioDOMLib<T> => {
  const text: CheerioDOMLib<T>['text'] = (el, { allowEmpty } = {}) => {
    const txt = el ? cheerioDom(el).text()?.trim() ?? null : null;
    return strOrNull(txt, allowEmpty);
  };

  const textAsUpper: CheerioDOMLib<T>['textAsUpper'] = (el, options) => {
    const txt = text(el, options);
    return txt ? txt.toLocaleUpperCase() : txt;
  };

  const textAsLower: CheerioDOMLib<T>['textAsLower'] = (el, options) => {
    const txt = text(el, options);
    return txt ? txt.toLocaleLowerCase() : txt;
  };

  const textAsNumber: CheerioDOMLib<T>['textAsNumber'] = (el, options) => {
    const txt = text(el, options);
    return strAsNumber(txt, options);
  };

  const prop: CheerioDOMLib<T>['prop'] = (el, propName, { allowEmpty } = {}) => {
    let propVal = el ? cheerioDom(el).prop(propName) ?? null : null;
    propVal = typeof propVal === 'string' ? propVal.trim() : propVal;
    return strOrNull(propVal, allowEmpty);
  };

  const href: CheerioDOMLib<T>['href'] = (el, { allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop(el, 'href', { allowEmpty });
    return formatUrl(val, { allowRelative, baseUrl });
  };

  const src: CheerioDOMLib<T>['src'] = (el, { allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop(el, 'src', { allowEmpty });
    return formatUrl(val, { allowRelative, baseUrl });
  };

  const nodeName: CheerioDOMLib<T>['nodeName'] = (el) => {
    // On UPPER- vs lower-case https://stackoverflow.com/questions/27223756/
    const val = prop(el, 'nodeName');
    return typeof val === 'string' ? val.toLocaleUpperCase() : val;
  };

  // @ts-expect-error Ignore - interface type is the source of truth
  const findOne: CheerioDOMLib<T>['findOne'] = (el, selector, mapFn) => {
    const resultEl = el ? cheerioDom(el).find(selector).get(0) ?? null : null;
    const normResultEl = resultEl ? cheerioDom(resultEl) : null;
    return mapFn ? mapFn(normResultEl as any) : normResultEl;
  };

  // @ts-expect-error Ignore - interface type is the source of truth
  const findMany: CheerioDOMLib<T>['findMany'] = (el, selector, mapFn) => {
    if (!el) return [];
    const resultEls = cheerioDom(el).find(selector).toArray().map((resEl) => cheerioDom(resEl) as Cheerio<T>); // prettier-ignore
    return mapFn ? resultEls.map(mapFn) : resultEls;
  };

  // @ts-expect-error Ignore - interface type is the source of truth
  const parent: CheerioDOMLib<T>['parent'] = (el, mapFn) => {
    const parentEl = el ? cheerioDom(el).parent() : null;
    const normParentEl = parentEl?.length ? parentEl : null;
    return mapFn ? mapFn(normParentEl as any) : normParentEl;
  };

  // @ts-expect-error Ignore - interface type is the source of truth
  const children: CheerioDOMLib<T>['children'] = (el, mapFn) => {
    if (!el) return [];
    const childEls = el?.children().toArray().map((resEl) => cheerioDom(resEl)) as any as Cheerio<T>[]; // prettier-ignore
    return mapFn ? childEls.map(mapFn) : childEls;
  };

  // @ts-expect-error Ignore - interface type is the source of truth
  const root: CheerioDOMLib<T>['root'] = (mapFn) => {
    const rootEl = cheerioDom.root() ?? null;
    return mapFn ? mapFn(rootEl as any) : rootEl;
  };

  const remove: CheerioDOMLib<T>['remove'] = (el) => {
    el ? cheerioDom(el).remove() : null;
  };

  const url: CheerioDOMLib<T>['url'] = () => {
    return srcUrl ?? null;
  };

  return {
    text,
    textAsLower,
    textAsUpper,
    textAsNumber,
    prop,
    href,
    src,
    nodeName,
    findOne,
    findMany,
    parent,
    children,
    root,
    remove,
    url,
  };
};
