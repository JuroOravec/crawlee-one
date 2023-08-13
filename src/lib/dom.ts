import { load as loadCheerio, AnyNode, Cheerio } from 'cheerio';

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
export interface DOMLib<El extends BaseEl, BaseEl> {
  node: El | null;

  ///////////////////////
  // SCALAR OPERATIONS
  ///////////////////////

  /** Get element's text (trimmed) */
  text: (options?: { allowEmpty?: boolean }) => string | null;
  /** Get element's text as uppercase (trimmed) */
  textAsUpper: (options?: { allowEmpty?: boolean }) => string | null;
  /** Get element's text as lowercase (trimmed) */
  textAsLower: (options?: { allowEmpty?: boolean }) => string | null;
  /** Get element's text and convert it to number */
  textAsNumber: (options?: StrAsNumOptions) => number | null;
  /** Get element's attribute */
  attr: (attrName: string, options?: { allowEmpty?: boolean }) => string | null;
  /** Get element's property */
  prop: (propName: string, options?: { allowEmpty?: boolean }) => string | null;
  /** Get element's href */
  href: (options?: { allowEmpty?: boolean } & FormatUrlOptions) => string | null;
  /** Get element's src */
  src: (options?: { allowEmpty?: boolean } & FormatUrlOptions) => string | null;
  /** Get element's nodeName */
  nodeName: () => string | null;
  /** Get URL of website associated with the DOM */
  url: () => string | null;
  /** Freely modify the underlying DOM node */
  map: <TVal>(map: (node: El | null) => TVal) => TVal;

  ///////////////////////
  // NODE OPERATIONS
  ///////////////////////

  /** Get a single descendant matching the selector */
  findOne: <TNewEl extends BaseEl = El>(selector: string) => DOMLib<TNewEl, BaseEl> | null;
  /** Get all descendants matching the selector */
  findMany: <TNewEl extends BaseEl = El>(selector: string) => DOMLib<TNewEl, BaseEl>[];
  /** Get element's parent */
  parent: <TNewEl extends BaseEl = El>() => DOMLib<TNewEl, BaseEl> | null;
  /** Get element's children */
  children: <TNewEl extends BaseEl = El>() => DOMLib<TNewEl, BaseEl>[];
  /** Get remove the element */
  remove: () => void;
  /** Get root element */
  root: <TNewEl extends BaseEl = El>() => DOMLib<TNewEl, BaseEl> | null;
}

export type BrowserDOMLib<T extends Element = Element> = DOMLib<T, Element>;

/** Implementation of DOMLib in browser (using Browser API) */
export const browserDOMLib = <T extends Element>(node: T): BrowserDOMLib<T> => {
  ///////////////////////
  // SCALAR OPERATIONS
  ///////////////////////

  const text: BrowserDOMLib<T>['text'] = ({ allowEmpty } = {}) => {
    const txt = node.textContent?.trim() ?? null;
    return strOrNull(txt, allowEmpty);
  };

  const textAsUpper: BrowserDOMLib<T>['textAsUpper'] = (options) => {
    const txt = text(options);
    return txt ? txt.toLocaleUpperCase() : txt;
  };

  const textAsLower: BrowserDOMLib<T>['textAsLower'] = (options) => {
    const txt = text(options);
    return txt ? txt.toLocaleLowerCase() : txt;
  };

  const textAsNumber: BrowserDOMLib<T>['textAsNumber'] = (options) => {
    const txt = text(options);
    return strAsNumber(txt, options);
  };

  const prop: BrowserDOMLib<T>['prop'] = (propName, { allowEmpty } = {}) => {
    let propVal = node[propName] ?? null;
    propVal = typeof propVal === 'string' ? propVal.trim() : propVal;
    return strOrNull(propVal, allowEmpty);
  };

  const attr: BrowserDOMLib<T>['attr'] = (propName, { allowEmpty } = {}) => {
    let attrVal = node.getAttribute(propName) ?? null;
    attrVal = typeof attrVal === 'string' ? attrVal.trim() : attrVal;
    return strOrNull(attrVal, allowEmpty);
  };

  const href: BrowserDOMLib<T>['href'] = ({ allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop('href', { allowEmpty });
    return formatUrl(val, { allowRelative, baseUrl });
  };

  const src: BrowserDOMLib<T>['src'] = ({ allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop('src', { allowEmpty });
    return formatUrl(val, { allowRelative, baseUrl });
  };

  const nodeName: BrowserDOMLib<T>['nodeName'] = () => {
    // On UPPER- vs lower-case https://stackoverflow.com/questions/27223756/
    const val = prop('nodeName');
    return typeof val === 'string' ? val.toLocaleUpperCase() : val;
  };

  const url: BrowserDOMLib<T>['url'] = () => {
    const doc = node.ownerDocument;
    // See https://stackoverflow.com/a/16010322/9788634
    const urlVal = doc.defaultView?.location?.href || null;
    return urlVal;
  };

  const map: BrowserDOMLib<T>['map'] = <TVal>(mapFn: (node: T) => TVal) => {
    return mapFn(node);
  };

  ///////////////////////
  // NODE OPERATIONS
  ///////////////////////

  const findOne: BrowserDOMLib<T>['findOne'] = <TNewEl extends Element = T>(selector) => {
    if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(node.nodeType as any)) return null;
    const resultEl = (node.querySelector(selector) ?? null) as TNewEl | null;
    return resultEl ? browserDOMLib(resultEl) : null;
  };

  const findMany: BrowserDOMLib<T>['findMany'] = <TNewEl extends Element = T>(selector) => {
    if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE].includes(node.nodeType as any)) return [];
    const resultEls = [...node.querySelectorAll(selector)] as TNewEl[]; // prettier-ignore
    return resultEls.map((el) => browserDOMLib(el));
  };

  const parent: BrowserDOMLib<T>['parent'] = <TNewEl extends Element = T>() => {
    const parentEl = (node.parentNode || null) as TNewEl | null;
    return parentEl ? browserDOMLib(parentEl) : null;
  };

  const children: BrowserDOMLib<T>['children'] = <TNewEl extends Element = T>() => {
    const childEls = [...node.childNodes] as TNewEl[];
    return childEls.map((el) => browserDOMLib(el));
  };

  const root: BrowserDOMLib<T>['root'] = <TNewEl extends Element = T>() => {
    const rootEl = ((node.ownerDocument?.documentElement as any) || null) as TNewEl | null;
    return rootEl ? browserDOMLib(rootEl) : null;
  };

  const remove: BrowserDOMLib<T>['remove'] = () => {
    const parentEl = parent();
    parentEl?.node?.removeChild(node);
  };

  return {
    node,

    text,
    textAsLower,
    textAsUpper,
    textAsNumber,
    attr,
    prop,
    href,
    src,
    nodeName,
    url,
    map,

    findOne,
    findMany,
    parent,
    children,
    root,
    remove,
  } satisfies DOMLib<T, Element>;
};

export type CheerioDOMLib<T extends Cheerio<AnyNode> = Cheerio<AnyNode>> = DOMLib<
  T,
  Cheerio<AnyNode>
>;

/**
 * Given a Cheerio selection, split it into an array of Cheerio selections,
 * where each has only one element.
 *
 * From `Cheerio[el, el, el, el]`
 *
 * To `[Cheerio[el], Cheerio[el], Cheerio[el], Cheerio[el]]`
 */
const splitCheerioSelection = (cheerioSel: Cheerio<AnyNode>) => {
  return cheerioSel.toArray().map((el) => {
    const cheerioInst = loadCheerio(el);
    return cheerioInst(el);
  });
};

/** Implementation of DOMLib in Cheerio */
export const cheerioDOMLib = <T extends Cheerio<AnyNode>>(
  cheerioNode: T,
  srcUrl: string | null
): CheerioDOMLib<T> => {
  ///////////////////////
  // SCALAR OPERATIONS
  ///////////////////////

  const text: CheerioDOMLib<T>['text'] = ({ allowEmpty } = {}) => {
    const txt = cheerioNode.text()?.trim() ?? null;
    return strOrNull(txt, allowEmpty);
  };

  const textAsUpper: CheerioDOMLib<T>['textAsUpper'] = (options) => {
    const txt = text(options);
    return txt ? txt.toLocaleUpperCase() : txt;
  };

  const textAsLower: CheerioDOMLib<T>['textAsLower'] = (options) => {
    const txt = text(options);
    return txt ? txt.toLocaleLowerCase() : txt;
  };

  const textAsNumber: CheerioDOMLib<T>['textAsNumber'] = (options) => {
    const txt = text(options);
    return strAsNumber(txt, options);
  };

  const attr: CheerioDOMLib<T>['attr'] = (attrName, { allowEmpty } = {}) => {
    let attrVal = cheerioNode.attr(attrName) ?? null;
    attrVal = typeof attrVal === 'string' ? attrVal.trim() : attrVal;
    return strOrNull(attrVal, allowEmpty);
  };

  const prop: CheerioDOMLib<T>['prop'] = (propName, { allowEmpty } = {}) => {
    let propVal = cheerioNode.prop(propName) ?? null;
    propVal = typeof propVal === 'string' ? propVal.trim() : propVal;
    return strOrNull(propVal, allowEmpty);
  };

  const href: CheerioDOMLib<T>['href'] = ({ allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop('href', { allowEmpty });
    return formatUrl(val, { allowRelative, baseUrl });
  };

  const src: CheerioDOMLib<T>['src'] = ({ allowEmpty, allowRelative, baseUrl } = {}) => {
    const val = prop('src', { allowEmpty });
    return formatUrl(val, { allowRelative, baseUrl });
  };

  const nodeName: CheerioDOMLib<T>['nodeName'] = () => {
    // On UPPER- vs lower-case https://stackoverflow.com/questions/27223756/
    const val = prop('nodeName');
    return typeof val === 'string' ? val.toLocaleUpperCase() : val;
  };

  const url: CheerioDOMLib<T>['url'] = () => {
    return srcUrl ?? null;
  };

  const map: CheerioDOMLib<T>['map'] = <TVal>(mapFn: (node: T) => TVal) => {
    return mapFn(cheerioNode);
  };

  ///////////////////////
  // NODE OPERATIONS
  ///////////////////////

  const findOne: CheerioDOMLib<T>['findOne'] = <TNewEl extends Cheerio<AnyNode> = T>(selector) => {
    const resultEl = cheerioNode.find(selector).first() as TNewEl;
    if (!resultEl.get(0)) return null;
    return cheerioDOMLib(resultEl, srcUrl);
  };

  const findMany: CheerioDOMLib<T>['findMany'] = <TNewEl extends Cheerio<AnyNode> = T>(
    selector
  ) => {
    const resultEls = splitCheerioSelection(cheerioNode.find(selector)) as TNewEl[];
    return resultEls.map((ch) => cheerioDOMLib(ch, srcUrl));
  };

  const parent: CheerioDOMLib<T>['parent'] = <TNewEl extends Cheerio<AnyNode> = T>() => {
    const parentEl = cheerioNode.parent().first() as TNewEl;
    if (!parentEl.get(0)) return null;
    return cheerioDOMLib(parentEl, srcUrl);
  };

  const children: CheerioDOMLib<T>['children'] = <TNewEl extends Cheerio<AnyNode> = T>() => {
    const childEls = splitCheerioSelection(cheerioNode.children()) as TNewEl[];
    return childEls.map((ch) => cheerioDOMLib(ch, srcUrl));
  };

  const root: CheerioDOMLib<T>['root'] = <TNewEl extends Cheerio<AnyNode> = T>() => {
    const rootEl = cheerioNode._root?.first() as TNewEl | null;
    if (!rootEl?.get(0)) return null;
    return cheerioDOMLib(rootEl, srcUrl);
  };

  const remove: CheerioDOMLib<T>['remove'] = () => {
    cheerioNode.remove();
  };

  return {
    node: cheerioNode,

    text,
    textAsLower,
    textAsUpper,
    textAsNumber,
    attr,
    prop,
    href,
    src,
    nodeName,
    url,
    map,

    findOne,
    findMany,
    parent,
    children,
    root,
    remove,
  } satisfies CheerioDOMLib<T>;
};
