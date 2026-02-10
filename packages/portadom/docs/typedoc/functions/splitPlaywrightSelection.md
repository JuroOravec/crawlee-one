[**portadom**](../README.md)

***

[portadom](../globals.md) / splitPlaywrightSelection

# Function: splitPlaywrightSelection()

> **splitPlaywrightSelection**\<`T`\>(`handle`): `Promise`\<`JSHandle`\<`T`\>[]\>

Defined in: [dom/domUtils.ts:32](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/domUtils.ts#L32)

Given a Playwright JSHandle that points to an array of Elements, split it into an array of
ElementHandles, where each has only one element.

From `JSHandle([el, el, el)]`

To `ElHandle(el), ElHandle(el), ElHandle(el)`

## Type Parameters

### T

`T`

## Parameters

### handle

`JSHandle`\<`T`[]\>

## Returns

`Promise`\<`JSHandle`\<`T`\>[]\>
