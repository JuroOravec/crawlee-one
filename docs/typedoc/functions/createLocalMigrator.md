[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / createLocalMigrator

# Function: createLocalMigrator()

> **createLocalMigrator**(`__namedParameters`): `object`

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.delimeter**: `string`= `'_'`

Delimeter between version and rest of file name

• **\_\_namedParameters.extension**: `string`= `'.js'`

Extension glob

• **\_\_namedParameters.migrationsDir**: `string`

## Returns

`object`

### migrate()

> **migrate**: (`version`) => `Promise`\<`void`\>

#### Parameters

• **version**: `string`

#### Returns

`Promise`\<`void`\>

### unmigrate()

> **unmigrate**: (`version`) => `Promise`\<`void`\>

#### Parameters

• **version**: `string`

#### Returns

`Promise`\<`void`\>

## Source

[src/lib/migrate/localMigrator.ts:8](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/migrate/localMigrator.ts#L8)
