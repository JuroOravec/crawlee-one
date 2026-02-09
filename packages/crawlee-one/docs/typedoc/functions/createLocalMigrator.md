[**crawlee-one**](../README.md)

***

[crawlee-one](../README.md) / createLocalMigrator

# Function: createLocalMigrator()

> **createLocalMigrator**(`__namedParameters`): `object`

Defined in: packages/crawlee-one/src/lib/migrate/localMigrator.ts:8

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
