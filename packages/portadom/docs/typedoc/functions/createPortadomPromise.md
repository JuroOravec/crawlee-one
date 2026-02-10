[**portadom**](../README.md)

***

[portadom](../globals.md) / createPortadomPromise

# Function: createPortadomPromise()

> **createPortadomPromise**\<`El`\>(`promiseDom`): [`PortadomPromise`](../interfaces/PortadomPromise.md)\<`El`\>

Defined in: dom/types.ts:220

Wrapper for a Promise that resolves to a [Portadom](../interfaces/Portadom.md) instance. This allows us to chain
Portadom methods before the Promise is resolved.

## Type Parameters

### El

`El`

## Parameters

### promiseDom

`MaybePromise`\<[`Portadom`](../interfaces/Portadom.md)\<`El`, `El`\> \| `null`\>

## Returns

[`PortadomPromise`](../interfaces/PortadomPromise.md)\<`El`\>
