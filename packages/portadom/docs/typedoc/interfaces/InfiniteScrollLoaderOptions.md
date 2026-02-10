[**portadom**](../README.md)

***

[portadom](../globals.md) / InfiniteScrollLoaderOptions

# Interface: InfiniteScrollLoaderOptions\<T, TCtx\>

Defined in: [page/types.ts:54](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/page/types.ts#L54)

## Type Parameters

### T

`T` *extends* `_AnyInfiScrollTypes`

### TCtx

`TCtx` *extends* `object` = \{ `container`: `T`\[`"container"`\]; \}

## Properties

### childrenCounter()?

> `optional` **childrenCounter**: (`containerEl`, `ctx`) => `MaybePromise`\<`number`\>

Defined in: [page/types.ts:61](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/page/types.ts#L61)

Override how container children are counted. Default uses `el.childElementCount`

#### Parameters

##### containerEl

`T`\[`"container"`\]

##### ctx

`TCtx`

#### Returns

`MaybePromise`\<`number`\>

***

### childrenGetter()?

> `optional` **childrenGetter**: (`containerEl`, `ctx`) => `MaybePromise`\<`T`\[`"children"`\]\>

Defined in: [page/types.ts:63](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/page/types.ts#L63)

Override how container children are extraced. Default uses `el.children`

#### Parameters

##### containerEl

`T`\[`"container"`\]

##### ctx

`TCtx`

#### Returns

`MaybePromise`\<`T`\[`"children"`\]\>

***

### retries?

> `optional` **retries**: `number`

Defined in: [page/types.ts:59](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/page/types.ts#L59)

How many times to retry the infinite scroll if new items aren't loading

***

### scrollIntoView()?

> `optional` **scrollIntoView**: (`childEl`, `ctx`) => `MaybePromise`\<`void`\>

Defined in: [page/types.ts:65](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/page/types.ts#L65)

Override how container children are scrolled into view. Default uses `el.scrollIntoView`

#### Parameters

##### childEl

`T`\[`"child"`\]

##### ctx

`TCtx`

#### Returns

`MaybePromise`\<`void`\>

***

### waitAfterScroll()?

> `optional` **waitAfterScroll**: (`childEl`, `ctx`) => `MaybePromise`\<`void`\>

Defined in: [page/types.ts:67](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/page/types.ts#L67)

Override whether and how to wait after scrolling into view

#### Parameters

##### childEl

`T`\[`"child"`\]

##### ctx

`TCtx`

#### Returns

`MaybePromise`\<`void`\>
