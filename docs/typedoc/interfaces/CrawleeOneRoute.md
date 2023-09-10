[crawlee-one](../README.md) / [Exports](../modules.md) / CrawleeOneRoute

# Interface: CrawleeOneRoute<T, RouterCtx\>

Route that a request will be sent to if the request doesn't have a label yet,
and if the `match` function returns truthy value.

If `match` function returns truthy value, the request is passed to the `action`
function for processing.

NOTE: If multiple records would match the request, then the first record to match
a request will process that request.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CrawleeOneCtx`](CrawleeOneCtx.md) |
| `RouterCtx` | extends `Record`<`string`, `any`\> = [`CrawleeOneRouteCtx`](../modules.md#crawleeoneroutectx)<`T`\> |

## Table of contents

### Properties

- [handler](CrawleeOneRoute.md#handler)
- [match](CrawleeOneRoute.md#match)

## Properties

### handler

• **handler**: (`ctx`: `Omit`<`T`[``"context"``] & `RouterCtx`, ``"request"``\> & { `request`: `Request`<`Dictionary`\>  }) => `Awaitable`<`void`\>

#### Type declaration

▸ (`ctx`): `Awaitable`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | `Omit`<`T`[``"context"``] & `RouterCtx`, ``"request"``\> & { `request`: `Request`<`Dictionary`\>  } |

##### Returns

`Awaitable`<`void`\>

#### Defined in

[src/lib/router/types.ts:41](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/router/types.ts#L41)

___

### match

• **match**: [`CrawleeOneRouteMatcher`](../modules.md#crawleeoneroutematcher)<`T`, `RouterCtx`\>

#### Defined in

[src/lib/router/types.ts:40](https://github.com/JuroOravec/crawlee-one/blob/a1c29c5/src/lib/router/types.ts#L40)
