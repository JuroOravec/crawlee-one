[**portadom**](../README.md)

***

[portadom](../globals.md) / Portapage

# Interface: Portapage\<TPage, TScroll, TCtx\>

Defined in: [page/types.ts:20](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/page/types.ts#L20)

Common interface for working with browser page despite different environments
(e.g. Browser API, Playwright, Puppeteer, Selenium).

This common interfaces makes the scraping code more portable between them.

WARNING: Portapage is experimental.

## Type Parameters

### TPage

`TPage`

### TScroll

`TScroll` *extends* `_AnyInfiScrollTypes`

### TCtx

`TCtx` *extends* `object`

## Properties

### infiniteScroll()

> **infiniteScroll**: (`container`, `onNewChildren?`, `options?`) => `MaybePromise`\<`void`\>

Defined in: [page/types.ts:28](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/page/types.ts#L28)

Load entries via infinite scroll and process them as you go.

#### Parameters

##### container

A container, or selector for it, that includes the dynamically loaded items.

`string` | `TScroll`\[`"container"`\]

##### onNewChildren?

(`elsHandle`, `ctx`, `stop`) => `MaybePromise`\<`void`\>

Callback that receives a handle to the new child elements in the DOM

Example:
```js
// Get text from all new child elements of the infinite-scroller container
async (elementsHandle) => {
  const result = await page.evaluate((els) => els.map((el) => el.textContent), elementsHandle);
  return result;
};
```

##### options?

[`InfiniteScrollLoaderOptions`](InfiniteScrollLoaderOptions.md)\<`TScroll`, `TCtx`\>

#### Returns

`MaybePromise`\<`void`\>

***

### page

> **page**: `TPage`

Defined in: [page/types.ts:25](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/page/types.ts#L25)
