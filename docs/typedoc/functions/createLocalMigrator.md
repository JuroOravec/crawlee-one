[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / createLocalMigrator

# Function: createLocalMigrator()

> **createLocalMigrator**(`__namedParameters`): `object`

Defined in: [src/lib/migrate/localMigrator.ts:8](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/migrate/localMigrator.ts#L8)

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
