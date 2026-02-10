[**portadom**](../README.md)

***

[portadom](../globals.md) / createPortadomArrayPromise

# Function: createPortadomArrayPromise()

> **createPortadomArrayPromise**\<`El`\>(`promiseDom`): [`PortadomArrayPromise`](../interfaces/PortadomArrayPromise.md)\<`El`\>

Defined in: [dom/types.ts:561](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/dom/types.ts#L561)

Wrapper for a Promise that resolves to an Array of [Portadom](../interfaces/Portadom.md) instances. This allows us to chain
Portadom methods before the Promise is resolved.

## Type Parameters

### El

`El`

## Parameters

### promiseDom

`MaybePromise`\<[`Portadom`](../interfaces/Portadom.md)\<`El`, `El`\>[]\>

## Returns

[`PortadomArrayPromise`](../interfaces/PortadomArrayPromise.md)\<`El`\>
