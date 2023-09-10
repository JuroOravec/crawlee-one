[crawlee-one](../README.md) / [Exports](../modules.md) / CrawleeOneKeyValueStore

# Interface: CrawleeOneKeyValueStore

Interface for storing and retrieving data in/from KeyValueStore.

KeyValueStore is a cache / map structure, where entries are retrieved and saved
under keys.

This interface is based on Crawlee/Apify, but defined separately to allow
drop-in replacement with other integrations.

## Table of contents

### Properties

- [clear](CrawleeOneKeyValueStore.md#clear)
- [drop](CrawleeOneKeyValueStore.md#drop)
- [setValue](CrawleeOneKeyValueStore.md#setvalue)

### Methods

- [getValue](CrawleeOneKeyValueStore.md#getvalue)

## Properties

### clear

• **clear**: () => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

Removes all entries from the store.

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/integrations/types.ts:223](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/integrations/types.ts#L223)

___

### drop

• **drop**: () => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

Removes the key-value store either from the cloud storage or from the local directory,
depending on the mode of operation.

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/integrations/types.ts:221](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/integrations/types.ts#L221)

___

### setValue

• **setValue**: (`key`: `string`, `value`: `any`, `options?`: { `contentType?`: `string`  }) => [`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Type declaration

▸ (`key`, `value`, `options?`): [`MaybePromise`](../modules.md#maybepromise)<`void`\>

Saves or deletes a record in the key-value store. The function returns a promise that
resolves once the record has been saved or deleted.

If value is null, the record is deleted instead. Note that the setValue() function
succeeds regardless whether the record existed or not.

Beware that the key can be at most 256 characters long and only contain the following
characters: a-zA-Z0-9!-_.'()

To retrieve a value from the key-value store, use the [CrawleeOneKeyValueStore.getValue](CrawleeOneKeyValueStore.md#getvalue)
function.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | - |
| `value` | `any` | - |
| `options?` | `Object` | - |
| `options.contentType?` | `string` | Specifies a custom MIME content type of the record. |

##### Returns

[`MaybePromise`](../modules.md#maybepromise)<`void`\>

#### Defined in

[src/lib/integrations/types.ts:209](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/integrations/types.ts#L209)

## Methods

### getValue

▸ **getValue**<`T`\>(`key`, `defaultValue`): `Promise`<`T`\>

Gets a value from the key-value store.

The function returns a `Promise` that resolves to the record value.

If the record does not exist, the function resolves to `null`.

To save or delete a value in the key-value store, use the
[CrawleeOneKeyValueStore.setValue](CrawleeOneKeyValueStore.md#setvalue) function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | Unique key of the record. It can be at most 256 characters long and only consist of the following characters: `a`-`z`, `A`-`Z`, `0`-`9` and `!-_.'()` |
| `defaultValue` | `T` | - |

#### Returns

`Promise`<`T`\>

Returns a promise that resolves to the value, or the default value if the key is missing from the store.

#### Defined in

[src/lib/integrations/types.ts:195](https://github.com/JuroOravec/crawlee-one/blob/490b500/src/lib/integrations/types.ts#L195)
