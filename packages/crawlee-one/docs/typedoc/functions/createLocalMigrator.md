[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / createLocalMigrator

# Function: createLocalMigrator()

> **createLocalMigrator**(`__namedParameters`): `object`

Defined in: [packages/crawlee-one/src/lib/migrate/localMigrator.ts:8](https://github.com/JuroOravec/crawlee-one/blob/21f97db438b62ef45add1d44924b7781b5721667/packages/crawlee-one/src/lib/migrate/localMigrator.ts#L8)

## Parameters

### \_\_namedParameters

#### delimeter

`string` = `'_'`

Delimeter between version and rest of file name

#### extension

`string` = `'.js'`

Extension glob

#### migrationsDir

`string`

## Returns

`object`

### migrate()

> **migrate**: (`version`) => `Promise`\<`void`\>

#### Parameters

##### version

`string`

#### Returns

`Promise`\<`void`\>

### unmigrate()

> **unmigrate**: (`version`) => `Promise`\<`void`\>

#### Parameters

##### version

`string`

#### Returns

`Promise`\<`void`\>
