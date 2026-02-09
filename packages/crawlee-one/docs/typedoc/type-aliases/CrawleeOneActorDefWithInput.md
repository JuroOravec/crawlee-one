[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / CrawleeOneActorDefWithInput

# Type Alias: CrawleeOneActorDefWithInput\<T\>

> **CrawleeOneActorDefWithInput**\<`T`\> = `Omit`\<[`CrawleeOneActorDef`](../interfaces/CrawleeOneActorDef.md)\<`T`\>, `"input"`\> & `object`

Defined in: packages/crawlee-one/src/lib/actor/types.ts:280

CrawleeOneActorDef object where the input is already resolved

## Type Declaration

### input

> **input**: `T`\[`"input"`\] \| `null`

### state

> **state**: `Record`\<`string`, `unknown`\>

## Type Parameters

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)
