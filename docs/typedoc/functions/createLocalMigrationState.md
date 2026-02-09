[**crawlee-one**](../README.md)

***

[crawlee-one](../globals.md) / createLocalMigrationState

# Function: createLocalMigrationState()

> **createLocalMigrationState**(`__namedParameters`): `object`

Defined in: [src/lib/migrate/localState.ts:5](https://github.com/JuroOravec/crawlee-one/blob/b22a7b5549c967588792b1d290e0bcccdaddfc61/src/lib/migrate/localState.ts#L5)

## Parameters

### \_\_namedParameters

#### stateDir

`string`

## Returns

`object`

### loadState()

> **loadState**: (`migrationFilename`) => `Promise`\<`Actor`\>

#### Parameters

##### migrationFilename

`string`

#### Returns

`Promise`\<`Actor`\>

### saveState()

> **saveState**: (`migrationFilename`, `actor`) => `Promise`\<`void`\>

#### Parameters

##### migrationFilename

`string`

##### actor

`ActorClient`

#### Returns

`Promise`\<`void`\>
