[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / PickRequired

# Type Alias: PickRequired\<T, Keys\>

> **PickRequired**\<`T`, `Keys`\> = `Omit`\<`T`, `Keys`\> & `Required`\<`Pick`\<`T`, `Keys`\>\>

Defined in: [src/utils/types.ts:21](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/utils/types.ts#L21)

Pick properties that should be required

## Type Parameters

### T

`T` *extends* `object`

### Keys

`Keys` *extends* keyof `T`
