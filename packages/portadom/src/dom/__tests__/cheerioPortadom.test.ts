import { describe, expect, it } from 'vitest';
import * as cheerio from 'cheerio';

import { cheerioPortadom } from '../dom.js';
import { splitCheerioSelection } from '../domUtils.js';

const html = `
<html>
  <head><title>Test Page</title></head>
  <body>
    <div id="root" class="container">
      <h1>Hello World</h1>
      <p id="intro" class="text">Welcome to <strong>portadom</strong></p>
      <a id="link1" href="/about" class="nav-link">About</a>
      <a id="link2" href="https://example.com" class="nav-link external">External</a>
      <img id="img1" src="/images/logo.png" alt="Logo" />
      <ul id="list">
        <li class="item" data-index="0">Item 1</li>
        <li class="item" data-index="1">Item 2</li>
        <li class="item" data-index="2">Item 3</li>
      </ul>
      <span id="number">  42  </span>
      <span id="float-num">3.14</span>
      <span id="empty"></span>
      <div id="nested">
        <div id="inner">
          <span id="deep">Deep text</span>
        </div>
      </div>
    </div>
  </body>
</html>
`;

const srcUrl = 'https://example.com/page';

function loadDom(selector: string) {
  const $ = cheerio.load(html);
  const el = $(selector);
  return cheerioPortadom(el, srcUrl);
}

function loadRoot() {
  const $ = cheerio.load(html);
  return { $, dom: cheerioPortadom($.root(), srcUrl) };
}

// ─── Scalar Operations ───────────────────────────────────────────────

describe('cheerioPortadom — scalar operations', () => {
  describe('text()', () => {
    it('extracts trimmed text content', () => {
      const dom = loadDom('h1');
      expect(dom.text()).toBe('Hello World');
    });

    it('returns trimmed text from elements with whitespace', () => {
      const dom = loadDom('#number');
      expect(dom.text()).toBe('42');
    });

    it('returns null for empty elements by default', () => {
      const dom = loadDom('#empty');
      expect(dom.text()).toBeNull();
    });

    it('returns empty string when allowEmpty is true', () => {
      const dom = loadDom('#empty');
      expect(dom.text({ allowEmpty: true })).toBe('');
    });
  });

  describe('textAsUpper()', () => {
    it('returns uppercased text', () => {
      const dom = loadDom('h1');
      expect(dom.textAsUpper()).toBe('HELLO WORLD');
    });

    it('returns null for empty elements', () => {
      const dom = loadDom('#empty');
      expect(dom.textAsUpper()).toBeNull();
    });
  });

  describe('textAsLower()', () => {
    it('returns lowercased text', () => {
      const dom = loadDom('h1');
      expect(dom.textAsLower()).toBe('hello world');
    });
  });

  describe('textAsNumber()', () => {
    it('parses integer text', () => {
      const dom = loadDom('#number');
      expect(dom.textAsNumber({ mode: 'int' })).toBe(42);
    });

    it('parses float text', () => {
      const dom = loadDom('#float-num');
      expect(dom.textAsNumber({ mode: 'float' })).toBe(3.14);
    });

    it('returns null for non-numeric text', () => {
      const dom = loadDom('h1');
      expect(dom.textAsNumber({ mode: 'int' })).toBeNull();
    });
  });

  describe('attr()', () => {
    it('reads an attribute', () => {
      const dom = loadDom('#link1');
      expect(dom.attr('href')).toBe('/about');
    });

    it('returns null for missing attribute', () => {
      const dom = loadDom('#link1');
      expect(dom.attr('data-missing')).toBeNull();
    });

    it('reads the class attribute', () => {
      const dom = loadDom('#link2');
      expect(dom.attr('class')).toBe('nav-link external');
    });
  });

  describe('attrs()', () => {
    it('reads multiple attributes at once', () => {
      const dom = loadDom('#link1');
      const result = dom.attrs(['id', 'href', 'class']);
      expect(result).toEqual({
        id: 'link1',
        href: '/about',
        class: 'nav-link',
      });
    });

    it('returns null for missing attributes', () => {
      const dom = loadDom('#link1');
      const result = dom.attrs(['id', 'data-x']);
      expect(result).toEqual({ id: 'link1', 'data-x': null });
    });
  });

  describe('prop()', () => {
    it('reads a property', () => {
      const dom = loadDom('#link1');
      // In cheerio, prop returns the underlying DOM-like property
      expect(dom.prop('tagName')).toBe('A');
    });
  });

  describe('href()', () => {
    it('resolves relative href against srcUrl', () => {
      const dom = loadDom('#link1');
      expect(dom.href()).toBe('https://example.com/about');
    });

    it('returns absolute href as-is', () => {
      const dom = loadDom('#link2');
      expect(dom.href()).toBe('https://example.com');
    });

    it('returns relative href when allowRelative is true', () => {
      const dom = loadDom('#link1');
      expect(dom.href({ allowRelative: true })).toBe('/about');
    });
  });

  describe('src()', () => {
    it('resolves relative src against srcUrl', () => {
      const dom = loadDom('#img1');
      expect(dom.src()).toBe('https://example.com/images/logo.png');
    });
  });

  describe('nodeName()', () => {
    it('returns uppercase node name', () => {
      const dom = loadDom('#link1');
      expect(dom.nodeName()).toBe('A');
    });
  });

  describe('url()', () => {
    it('returns the source URL', () => {
      const dom = loadDom('#root');
      expect(dom.url()).toBe(srcUrl);
    });

    it('returns null when srcUrl is null', () => {
      const $ = cheerio.load(html);
      const dom = cheerioPortadom($('#root'), null);
      expect(dom.url()).toBeNull();
    });
  });

  describe('map()', () => {
    it('maps over the underlying node', () => {
      const dom = loadDom('#list');
      const tagName = dom.map((n) => n.prop('tagName'));
      expect(tagName).toBe('UL');
    });
  });
});

// ─── Node Operations ─────────────────────────────────────────────────

describe('cheerioPortadom — node operations', () => {
  describe('findOne()', () => {
    it('finds a single descendant by selector', async () => {
      const { dom } = loadRoot();
      const h1 = dom.findOne('h1');
      expect(await h1.text()).toBe('Hello World');
    });

    it('returns null node when selector matches nothing', async () => {
      const { dom } = loadRoot();
      const missing = dom.findOne('.nonexistent');
      expect(await missing.node).toBeNull();
    });
  });

  describe('findMany()', () => {
    it('finds multiple descendants', async () => {
      const { dom } = loadRoot();
      const items = dom.findMany('.item');
      expect(await items.length).toBe(3);
    });

    it('returns empty array when nothing matches', async () => {
      const { dom } = loadRoot();
      const items = dom.findMany('.nonexistent');
      expect(await items.length).toBe(0);
    });
  });

  describe('closest()', () => {
    it('finds the closest ancestor matching selector', async () => {
      const dom = loadDom('#deep');
      const nested = dom.closest('#nested');
      expect(await nested.attr('id')).toBe('nested');
    });

    it('returns null when no ancestor matches', async () => {
      const dom = loadDom('#deep');
      const missing = dom.closest('.nonexistent');
      expect(await missing.node).toBeNull();
    });
  });

  describe('parent()', () => {
    it('returns the parent element', async () => {
      const dom = loadDom('#deep');
      const parent = dom.parent();
      expect(await parent.attr('id')).toBe('inner');
    });
  });

  describe('children()', () => {
    it('returns all child elements', async () => {
      const dom = loadDom('#list');
      const kids = dom.children();
      expect(await kids.length).toBe(3);
      expect(await kids.at(0).text()).toBe('Item 1');
      expect(await kids.at(2).text()).toBe('Item 3');
    });
  });

  describe('remove()', () => {
    it('removes the element from the DOM', async () => {
      const $ = cheerio.load(html);
      const el = $('#number');
      const dom = cheerioPortadom(el, srcUrl);
      dom.remove();
      expect($('#number').length).toBe(0);
    });
  });

  describe('getCommonAncestor()', () => {
    it('returns the common ancestor of two elements', async () => {
      const $ = cheerio.load(html);
      const el1 = $('#link1');
      const el2 = $('#number');
      const dom1 = cheerioPortadom(el1, srcUrl);
      const ancestor = dom1.getCommonAncestor(el2);
      expect(await ancestor.attr('id')).toBe('root');
    });
  });

  describe('getCommonAncestorFromSelector()', () => {
    it('returns the common ancestor of all matching elements', async () => {
      const { dom } = loadRoot();
      const ancestor = dom.findOne('#root').getCommonAncestorFromSelector('.item');
      expect(await ancestor.attr('id')).toBe('list');
    });

    it('returns null when selector matches nothing', async () => {
      const { dom } = loadRoot();
      const ancestor = dom.findOne('#root').getCommonAncestorFromSelector('.nonexistent');
      expect(await ancestor.node).toBeNull();
    });
  });
});

// ─── Promise Wrappers ────────────────────────────────────────────────

describe('PortadomPromise chaining', () => {
  it('chains findOne → text', async () => {
    const { dom } = loadRoot();
    const text = await dom.findOne('#root').findOne('h1').text();
    expect(text).toBe('Hello World');
  });

  it('chains findOne → attr', async () => {
    const { dom } = loadRoot();
    const href = await dom.findOne('#link1').attr('href');
    expect(href).toBe('/about');
  });

  it('returns null when chaining through missing element', async () => {
    const { dom } = loadRoot();
    const text = await dom.findOne('.missing').findOne('h1').text();
    expect(text).toBeNull();
  });

  it('supports promise.node', async () => {
    const { dom } = loadRoot();
    const node = await dom.findOne('h1').node;
    expect(node).not.toBeNull();
    expect(node!.text()).toBe('Hello World');
  });
});

describe('PortadomArrayPromise chaining', () => {
  it('supports at()', async () => {
    const { dom } = loadRoot();
    const text = await dom.findMany('.item').at(1).text();
    expect(text).toBe('Item 2');
  });

  it('supports map()', async () => {
    const { dom } = loadRoot();
    const texts = await dom.findMany('.item').map((d) => d.text());
    expect(texts).toEqual(['Item 1', 'Item 2', 'Item 3']);
  });

  it('supports filter()', async () => {
    const { dom } = loadRoot();
    const filtered = dom.findMany('.item').filter((d) => d.text() !== 'Item 2');
    expect(await filtered.length).toBe(2);
  });

  it('supports slice()', async () => {
    const { dom } = loadRoot();
    const sliced = dom.findMany('.item').slice(1, 2);
    expect(await sliced.length).toBe(1);
    expect(await sliced.at(0).text()).toBe('Item 2');
  });

  it('supports mapAsyncSerial()', async () => {
    const { dom } = loadRoot();
    const texts = await dom.findMany('.item').mapAsyncSerial(async (d) => d.text());
    expect(texts).toEqual(['Item 1', 'Item 2', 'Item 3']);
  });

  it('supports mapAsyncParallel()', async () => {
    const { dom } = loadRoot();
    const texts = await dom.findMany('.item').mapAsyncParallel(async (d) => d.text());
    expect(texts).toEqual(['Item 1', 'Item 2', 'Item 3']);
  });

  it('supports filterAsyncSerial()', async () => {
    const { dom } = loadRoot();
    const filtered = dom.findMany('.item').filterAsyncSerial(async (d) => d.text() !== 'Item 1');
    expect(await filtered.length).toBe(2);
  });

  it('supports filterAsyncParallel()', async () => {
    const { dom } = loadRoot();
    const filtered = dom.findMany('.item').filterAsyncParallel(async (d) => d.text() !== 'Item 1');
    expect(await filtered.length).toBe(2);
  });

  it('supports findAsyncSerial()', async () => {
    const { dom } = loadRoot();
    const found = dom.findMany('.item').findAsyncSerial(async (d) => d.text() === 'Item 2');
    expect(await found.text()).toBe('Item 2');
  });

  it('supports forEachAsyncSerial()', async () => {
    const { dom } = loadRoot();
    const collected: (string | null)[] = [];
    await dom.findMany('.item').forEachAsyncSerial(async (d) => {
      collected.push(d.text());
    });
    expect(collected).toEqual(['Item 1', 'Item 2', 'Item 3']);
  });

  it('supports forEachAsyncParallel()', async () => {
    const { dom } = loadRoot();
    const collected: (string | null)[] = [];
    await dom.findMany('.item').forEachAsyncParallel(async (d) => {
      collected.push(d.text());
    });
    expect(collected.sort()).toEqual(['Item 1', 'Item 2', 'Item 3']);
  });

  it('supports every()', async () => {
    const { dom } = loadRoot();
    const allItems = await dom.findMany('.item').every((d) => d.text() !== null);
    expect(allItems).toBe(true);
    const allBogus = await dom.findMany('.item').every((d) => d.text() === 'Item 1');
    expect(allBogus).toBe(false);
  });

  it('supports some()', async () => {
    const { dom } = loadRoot();
    const hasItem2 = await dom.findMany('.item').some((d) => d.text() === 'Item 2');
    expect(hasItem2).toBe(true);
    const hasItem99 = await dom.findMany('.item').some((d) => d.text() === 'Item 99');
    expect(hasItem99).toBe(false);
  });

  it('supports reverse()', async () => {
    const { dom } = loadRoot();
    const texts = await dom
      .findMany('.item')
      .reverse()
      .map((d) => d.text());
    expect(texts).toEqual(['Item 3', 'Item 2', 'Item 1']);
  });

  it('supports find()', async () => {
    const { dom } = loadRoot();
    const found = dom.findMany('.item').find((d) => d.text() === 'Item 2');
    expect(await found.text()).toBe('Item 2');
  });

  it('supports concat()', async () => {
    const { dom } = loadRoot();
    const items = dom.findMany('.item');
    const links = dom.findMany('.nav-link');
    // Concat items with links' promise result
    const combined = items.concat(await links.promise);
    expect(await combined.length).toBe(5);
  });
});

// ─── domUtils ────────────────────────────────────────────────────────

describe('splitCheerioSelection', () => {
  it('splits a multi-element Cheerio selection into individual selections', () => {
    const $ = cheerio.load(html);
    const items = $('.item');
    const split = splitCheerioSelection(items);
    expect(split.length).toBe(3);
    split.forEach((sel) => {
      expect(sel.length).toBe(1);
    });
    expect(split[0].text()).toBe('Item 1');
    expect(split[2].text()).toBe('Item 3');
  });

  it('returns empty array for empty selection', () => {
    const $ = cheerio.load(html);
    const nothing = $('.nonexistent');
    const split = splitCheerioSelection(nothing);
    expect(split.length).toBe(0);
  });
});
