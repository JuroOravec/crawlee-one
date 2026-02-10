[**portadom**](../README.md)

***

[portadom](../globals.md) / createPlaywrightElementSerializer

# Function: createPlaywrightElementSerializer()

> **createPlaywrightElementSerializer**\<`T`\>(`page`): `Promise`\<\{ `resolveId`: (`id`) => `Promise`\<`ElementHandle`\<`any`\>\>; `resolveIds`: (`ids`) => `Promise`\<`JSHandle`\<(`Element` \| `null`)[]\>\>; `serializeEls`: (`elsHandle`) => `Promise`\<`string`[]\>; \}\>

Defined in: [page/pageUtils.ts:20](https://github.com/JuroOravec/crawlee-one/blob/main/packages/portadom/src/page/pageUtils.ts#L20)

Helper methods that allow to represent HTML Elements on the Page as string IDs

We use this so we can identify which elements have already been processed, and which have not.
Normally, the elements are represented via Playwright JSHandle/ElementHandle. However, if two
Handles are pointing to the same Element, we're unable to count them as one, because it's two
instances that don't have any IDs of the Elemenets. On the other hand, using the string IDs,
two different JSHandles will return the same string if they point to the same Element, so we
cache the IDs outside of Playwright in Sets or Maps.

## Type Parameters

### T

`T` *extends* `Page`

## Parameters

### page

`T`

## Returns

`Promise`\<\{ `resolveId`: (`id`) => `Promise`\<`ElementHandle`\<`any`\>\>; `resolveIds`: (`ids`) => `Promise`\<`JSHandle`\<(`Element` \| `null`)[]\>\>; `serializeEls`: (`elsHandle`) => `Promise`\<`string`[]\>; \}\>
