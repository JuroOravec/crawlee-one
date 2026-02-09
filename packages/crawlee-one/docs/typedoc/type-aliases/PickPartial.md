[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / PickPartial

# Type Alias: PickPartial\<T, Keys\>

> **PickPartial**\<`T`, `Keys`\> = `Omit`\<`T`, `Keys`\> & `Partial`\<`Pick`\<`T`, `Keys`\>\>

Defined in: [packages/crawlee-one/src/utils/types.ts:18](https://github.com/JuroOravec/crawlee-one/blob/main/packages/crawlee-one/src/utils/types.ts#L18)

Pick properties that should be optional

## Type Parameters

### T

`T` *extends* `object`

### Keys

`Keys` *extends* keyof `T`
