**portadom**

***

# portadom

**Portable DOM interface** -- write DOM-manipulation code once, run it against Cheerio, Playwright, or the Browser API.

> One interface for traversing, querying, and extracting data from the DOM, regardless of the underlying engine.

## Why

Web scraping and testing code is tightly coupled to its DOM engine. Code written for Cheerio won't work in Playwright, and vice versa. When you need to switch engines (e.g., from static HTML parsing to browser rendering), you rewrite your extraction logic.

**portadom** solves this with a single `Portadom` interface. Write your selectors and extraction logic once, and swap the engine without touching the business logic.

## Install

```bash
npm install portadom
```

Then install the engine(s) you need as peer dependencies:

```bash
# For static HTML parsing
npm install cheerio

# For browser automation
npm install playwright
```

## Quick start

### With Cheerio (static HTML)

```typescript
import * as cheerio from 'cheerio';
import { cheerioPortadom } from 'portadom';

const html = '<div><h1>Hello</h1><a href="/about">About</a></div>';
const $ = cheerio.load(html);

const dom = cheerioPortadom($.root(), 'https://example.com');

// Extract text
const title = dom.findOne('h1');
console.log(await title.text()); // "Hello"

// Extract and resolve URLs
const link = dom.findOne('a');
console.log(await link.href()); // "https://example.com/about"

// Query multiple elements
const items = dom.findMany('li');
const texts = await items.map((el) => el.text());
```

### With Playwright (browser)

```typescript
import { playwrightHandlePortadom, playwrightLocatorPortadom } from 'portadom';

// Handle-based (lower-level, works with ElementHandle/JSHandle)
const handleDom = playwrightHandlePortadom(elementHandle, page);

// Locator-based (recommended for Playwright >= 1.14)
const locatorDom = playwrightLocatorPortadom(page.locator('#root'), page);

// Same API as Cheerio -- your extraction code is engine-agnostic
const title = await locatorDom.findOne('h1').text();
```

## API overview

### `Portadom<El>` -- DOM element wrapper

Every `Portadom` instance wraps a single DOM node and exposes:

**Scalar operations** (extract data):

| Method           | Returns                | Description                            |
| ---------------- | ---------------------- | -------------------------------------- |
| `text()`         | `string \| null`       | Trimmed text content                   |
| `textAsUpper()`  | `string \| null`       | Text as uppercase                      |
| `textAsLower()`  | `string \| null`       | Text as lowercase                      |
| `textAsNumber()` | `number \| null`       | Text parsed as number (int or float)   |
| `attr(name)`     | `string \| null`       | Single attribute value                 |
| `attrs(names)`   | `Record<string, ...>`  | Multiple attribute values              |
| `prop(name)`     | `any`                  | DOM property (supports nested paths)   |
| `href()`         | `string \| null`       | `href` attribute, resolved to absolute |
| `src()`          | `string \| null`       | `src` attribute, resolved to absolute  |
| `nodeName()`     | `string \| null`       | Uppercase node name                    |
| `url()`          | `string \| null`       | URL of the associated page/document    |
| `map(fn)`        | `T`                    | Transform the underlying node          |

**Node operations** (traverse):

| Method                             | Returns                | Description                          |
| ---------------------------------- | ---------------------- | ------------------------------------ |
| `findOne(selector)`                | `PortadomPromise`      | First descendant matching selector   |
| `findMany(selector)`               | `PortadomArrayPromise` | All descendants matching selector    |
| `closest(selector)`                | `PortadomPromise`      | Closest ancestor matching selector   |
| `parent()`                         | `PortadomPromise`      | Parent element                       |
| `children()`                       | `PortadomArrayPromise` | Direct children                      |
| `root()`                           | `PortadomPromise`      | Document root element                |
| `remove()`                         | `void`                 | Remove element from DOM              |
| `getCommonAncestor(otherEl)`       | `PortadomPromise`      | Closest shared ancestor              |
| `getCommonAncestorFromSelector(s)` | `PortadomPromise`      | Common ancestor of all matches       |

### `PortadomPromise<El>` -- chainable async wrapper

Node operations return `PortadomPromise`, which lets you chain without intermediate `await`s:

```typescript
// Instead of:
const root = await dom.findOne('#root').promise;
const title = root ? await root.findOne('h1').promise : null;
const text = title ? await title.text() : null;

// You can write:
const text = await dom.findOne('#root').findOne('h1').text();
```

### `PortadomArrayPromise<El>` -- async array wrapper

`findMany()` and `children()` return `PortadomArrayPromise`, wrapping the full `Array` API plus async helpers:

```typescript
const items = dom.findMany('.item');

// Standard array methods (async-aware)
await items.map((el) => el.text());
await items.filter((el) => el.text() !== null);
await items.at(0).text();
await items.slice(0, 5).map((el) => el.attr('href'));

// Async iteration helpers
await items.mapAsyncSerial(async (el) => el.text());
await items.filterAsyncParallel(async (el) => /* ... */);
await items.findAsyncSerial(async (el) => /* ... */);
```

### `Portapage` -- page-level operations (experimental)

```typescript
import { playwrightPortapage } from 'portadom';

const portapage = await playwrightPortapage(page);

// Infinite scroll with automatic batching
await portapage.infiniteScroll('#feed', async (newItems, ctx, stop) => {
  const data = await page.evaluate(
    (els) => els.map((el) => el.textContent),
    newItems
  );
  console.log('New items:', data);
  if (data.length > 100) stop();
});
```

## Factory functions

| Function                   | Engine           | Element type             |
| -------------------------- | ---------------- | ------------------------ |
| `cheerioPortadom(el, url)` | Cheerio          | `Cheerio<AnyNode>`       |
| `playwrightHandlePortadom(handle, page)` | Playwright | `Locator \| ElementHandle` |
| `playwrightLocatorPortadom(locator, page)` | Playwright | `Locator` |
| `browserPortadom(element)` | Browser API      | `Element`                |
| `playwrightPortapage(page)` | Playwright (page-level) | `Page` |

## License

MIT
