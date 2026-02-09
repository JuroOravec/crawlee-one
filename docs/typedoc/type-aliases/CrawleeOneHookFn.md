[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / CrawleeOneHookFn

# Type Alias: CrawleeOneHookFn()\<TArgs, TReturn, T\>

> **CrawleeOneHookFn**\<`TArgs`, `TReturn`, `T`\> = (...`args`) => [`MaybePromise`](MaybePromise.md)\<`TReturn`\>

Defined in: [src/lib/actor/types.ts:129](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/actor/types.ts#L129)

## Type Parameters

### TArgs

`TArgs` *extends* `any`[] = \[\]

### TReturn

`TReturn` = `void`

### T

`T` *extends* [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md) = [`CrawleeOneCtx`](../interfaces/CrawleeOneCtx.md)

## Parameters

### args

...\[`...TArgs`, [`CrawleeOneHookCtx`](CrawleeOneHookCtx.md)\<`T`\>\]

## Returns

[`MaybePromise`](MaybePromise.md)\<`TReturn`\>
