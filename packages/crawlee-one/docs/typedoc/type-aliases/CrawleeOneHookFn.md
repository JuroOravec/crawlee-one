[**crawlee-one**](../README.md)

---

[crawlee-one](../README.md) / CrawleeOneHookFn

# Type Alias: CrawleeOneHookFn()\<TArgs, TReturn, T\>

> **CrawleeOneHookFn**\<`TArgs`, `TReturn`, `T`\> = (...`args`) => [`MaybePromise`](MaybePromise.md)\<`TReturn`\>

Defined in: [packages/crawlee-one/src/lib/context/types.ts:152](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/lib/context/types.ts#L152)

## Type Parameters

### TArgs

`TArgs` _extends_ `any`[] = \[\]

### TReturn

`TReturn` = `void`

### T

`T` _extends_ [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md) = [`CrawleeOneTypes`](../interfaces/CrawleeOneTypes.md)

## Parameters

### args

...\[`...TArgs`, [`CrawleeOneHookCtx`](CrawleeOneHookCtx.md)\<`T`\>\]

## Returns

[`MaybePromise`](MaybePromise.md)\<`TReturn`\>
