[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / CrawleeOneActorDefWithInput

# Type alias: CrawleeOneActorDefWithInput\<T\>

> **CrawleeOneActorDefWithInput**\<`T`\>: `Omit`\<[`CrawleeOneActorDef`](../interfaces/CrawleeOneActorDef.md)\<`T`\>, `"input"`\> & `object`

CrawleeOneActorDef object where the input is already resolved

## Type declaration

### input

> **input**: `T`\[`"input"`\] \| `null`

### state

> **state**: `Record`\<`string`, `unknown`\>

## Type parameters

• **T** *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

## Source

[src/lib/actor/types.ts:280](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/actor/types.ts#L280)
