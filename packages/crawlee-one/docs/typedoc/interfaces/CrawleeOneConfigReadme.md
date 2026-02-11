[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneConfigReadme

# Interface: CrawleeOneConfigReadme

Defined in: [packages/crawlee-one/src/types/config.ts:92](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L92)

## Properties

### actorSpec?

> `optional` **actorSpec**: `ActorSpec`

Defined in: [packages/crawlee-one/src/types/config.ts:100](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L100)

The `ActorSpec` data passed to the renderer.

***

### input?

> `optional` **input**: `unknown`

Defined in: [packages/crawlee-one/src/types/config.ts:113](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L113)

Renderer-specific data. Shape depends on the renderer.

Everything the renderer needs (templates, helper functions, etc.)
is passed through this single object.

***

### outFile?

> `optional` **outFile**: `string`

Defined in: [packages/crawlee-one/src/types/config.ts:98](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L98)

Output file path (relative to cwd).

Defaults to `.actor/README.md` if `.actor/` exists, otherwise `./README.md`.

***

### renderer?

> `optional` **renderer**: [`ReadmeRenderer`](../type-aliases/ReadmeRenderer.md)\<`any`\>

Defined in: [packages/crawlee-one/src/types/config.ts:106](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/types/config.ts#L106)

The renderer function that produces the README string.

Falls back to `defaultReadmeRenderer` if not provided.
