[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / ReadmeRenderer

# Type Alias: ReadmeRenderer()\<TInput\>

> **ReadmeRenderer**\<`TInput`\> = (`args`) => `string` \| `Promise`\<`string`\>

Defined in: [packages/crawlee-one/src/types/config.ts:21](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L21)

A README renderer function.

Receives data and returns the rendered README as a string.

The renderer does NOT interact with the filesystem -- crawlee-one
handles writing the output.

## Type Parameters

### TInput

`TInput` = `unknown`

Shape of renderer-specific data (opaque to crawlee-one).
  Everything the renderer needs beyond `actorSpec` -- templates, helper
  functions, etc. -- is passed through this single object.

## Parameters

### args

#### actorSpec

`unknown`

#### input?

`TInput`

## Returns

`string` \| `Promise`\<`string`\>
