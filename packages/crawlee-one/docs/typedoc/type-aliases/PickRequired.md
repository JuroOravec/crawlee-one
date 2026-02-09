[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / PickRequired

# Type Alias: PickRequired\<T, Keys\>

> **PickRequired**\<`T`, `Keys`\> = `Omit`\<`T`, `Keys`\> & `Required`\<`Pick`\<`T`, `Keys`\>\>

Defined in: [packages/crawlee-one/src/utils/types.ts:21](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/utils/types.ts#L21)

Pick properties that should be required

## Type Parameters

### T

`T` *extends* `object`

### Keys

`Keys` *extends* keyof `T`
