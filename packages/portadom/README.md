# portadom

**One DOM interface. Any engine.**

Write scraping and extraction logic once. Run it on Cheerio, Playwright, or the Browser API. Swap engines when requirements change -- no rewrite needed.

```bash
npm install portadom
```

## Quick start

Wrap any DOM engine in a `Portadom` instance, then use the same API everywhere:

```typescript
import * as cheerio from 'cheerio';
import { cheerioPortadom } from 'portadom';

// 1. Create a Portadom instance from a Cheerio root
const $ = cheerio.load('<h1>Hello</h1><a href="/about">About</a>');
const dom = cheerioPortadom($.root(), 'https://example.com');

// 2. Use the engine-agnostic API
await dom.findOne('h1').text(); // "Hello"
await dom.findOne('a').href(); // "https://example.com/about"
await dom.findMany('li').map((el) => el.text()); // ["Item 1", "Item 2", ...]
```

Switch engines by changing only the setup -- the extraction logic stays identical:

```typescript
import { playwrightLocatorPortadom } from 'portadom';

// 1. Create a Portadom instance from a Playwright locator
const dom = playwrightLocatorPortadom(page.locator('body'), page);

// 2. Exact same API -- no changes needed
await dom.findOne('h1').text();
await dom.findOne('a').href();
```

## Why portadom?

### Write once. Run anywhere.

Cheerio, Playwright, and the Browser API have incompatible DOM APIs. Portadom wraps them behind a single `Portadom` interface. Your selectors, traversals, and data extraction stay the same regardless of engine.

### Chain without awaits.

Traversal methods return `PortadomPromise` -- chain `findOne`, `closest`, `parent`, and more without intermediate `await`s. The promise resolves when you extract a value.

```typescript
// Without portadom
const root = await page.locator('#root').elementHandle();
const heading = root ? await root.$('h1') : null;
const text = heading ? await heading.textContent() : null;

// With portadom
const text = await dom.findOne('#root').findOne('h1').text();
```

### Collections that feel like arrays.

`findMany()` returns `PortadomArrayPromise` -- the full `Array` API (`map`, `filter`, `find`, `slice`, `reduce`, ...) plus async helpers like `mapAsyncSerial` and `filterAsyncParallel`.

```typescript
const prices = await dom
  .findMany('.product')
  .filterAsyncParallel(async (el) => (await el.attr('in-stock')) === 'true')
  .mapAsyncSerial(async (el) => await el.findOne('.price').textAsNumber({ mode: 'float' }));
```

### URLs resolved automatically.

`href()` and `src()` resolve relative paths to absolute URLs using the page's base URL. No manual `new URL()` calls.

<details>
<summary>What portadom replaces (click to expand)</summary>

**Cheerio -- extracting an href:**

```typescript
const rawHref = $('a').attr('href'); // "/about"
const absHref = rawHref?.startsWith('/') ? new URL(rawHref, 'https://example.com').href : rawHref;
```

**Portadom:**

```typescript
await dom.findOne('a').href(); // "https://example.com/about"
```

</details>

## Supported engines

| Factory function                           | Engine                | Element type               |
| ------------------------------------------ | --------------------- | -------------------------- |
| `cheerioPortadom(el, url)`                 | Cheerio               | `Cheerio<AnyNode>`         |
| `playwrightLocatorPortadom(locator, page)` | Playwright (locators) | `Locator`                  |
| `playwrightHandlePortadom(handle, page)`   | Playwright (handles)  | `Locator \| ElementHandle` |
| `browserPortadom(element)`                 | Browser API           | `Element`                  |

Install only the engine(s) you need:

```bash
npm install cheerio       # static HTML
npm install playwright    # browser automation
```

## Page-level operations (experimental)

`Portapage` provides page-level helpers like infinite scroll handling:

```typescript
import { playwrightPortapage } from 'portadom';

const portapage = await playwrightPortapage(page);
await portapage.infiniteScroll('#feed', async (newItems, ctx, stop) => {
  // Process each batch of new DOM elements as they load
  if (shouldStop) stop();
});
```

## Documentation

| Document                                   | Description                      |
| ------------------------------------------ | -------------------------------- |
| [API reference](./docs/typedoc/globals.md) | Full typedoc-generated API docs. |
| [Changelog](./CHANGELOG.md)                | Release history.                 |

## License

MIT
