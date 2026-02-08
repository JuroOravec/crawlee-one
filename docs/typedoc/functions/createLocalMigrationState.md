[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / createLocalMigrationState

# Function: createLocalMigrationState()

> **createLocalMigrationState**(`__namedParameters`): `object`

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.stateDir**: `string`

## Returns

`object`

### loadState()

> **loadState**: (`migrationFilename`) => `Promise`\<`Actor`\>

#### Parameters

• **migrationFilename**: `string`

#### Returns

`Promise`\<`Actor`\>

### saveState()

> **saveState**: (`migrationFilename`, `actor`) => `Promise`\<`void`\>

#### Parameters

• **migrationFilename**: `string`

• **actor**: `ActorClient`

#### Returns

`Promise`\<`void`\>

## Source

[src/lib/migrate/localState.ts:5](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/lib/migrate/localState.ts#L5)
