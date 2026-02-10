[**portadom**](../README.md)

***

[portadom](../globals.md) / mergeHandles

# Function: mergeHandles()

> **mergeHandles**(`handles`, `options?`): `Promise`\<`JSHandle`\<`Element`[]\>\>

Defined in: [dom/domUtils.ts:57](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/domUtils.ts#L57)

Join several Locators and Handles in a single JSHandle.

Locators are evaluated to their matching elements.

To override how Locators are resolved, supply own `locatorResolver` function.

## Parameters

### handles

[`HandleLike`](../type-aliases/HandleLike.md)[]

### options?

#### locatorResolver?

(`loc`) => `MaybePromise`\<`MaybeArray`\<[`AnyHandle`](../type-aliases/AnyHandle.md)\>\>

Configure how to process Locators into JSHandles.

By default, Locator resolves to the first DOM Element it matches,
using Locator.elementHandle.

## Returns

`Promise`\<`JSHandle`\<`Element`[]\>\>
