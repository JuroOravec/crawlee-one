[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneInternalOptionsWithInput

# Type Alias: CrawleeOneInternalOptionsWithInput\<T\>

> **CrawleeOneInternalOptionsWithInput**\<`T`\> = `Omit`\<[`CrawleeOneInternalOptions`](../interfaces/CrawleeOneInternalOptions.md)\<`T`\>, `"input"`\> & `object`

Defined in: [packages/crawlee-one/src/lib/context/types.ts:315](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L315)

CrawleeOneInternalOptions object where the input is already resolved

## Type Declaration

### input

> **input**: `T`\[`"input"`\] \| `null`

### state

> **state**: `Record`\<`string`, `unknown`\>

## Type Parameters

### T

`T` _extends_ [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md)
