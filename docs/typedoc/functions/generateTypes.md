[**crawlee-one**](../README.md) • **Docs**

***

[crawlee-one](../globals.md) / generateTypes

# Function: generateTypes()

> **generateTypes**(`outfile`, `configOrPath`?): `Promise`\<`void`\>

Generate types for CrawleeOne given a config.

Config can be passed directly, or as the path to the config file.
If the config is omitted, it is automatically searched for using CosmicConfig.

## Parameters

• **outfile**: `string`

• **configOrPath?**: `string` \| [`CrawleeOneConfig`](../interfaces/CrawleeOneConfig.md)

## Returns

`Promise`\<`void`\>

## Source

[src/cli/commands/codegen.ts:251](https://github.com/JuroOravec/crawlee-one/blob/0ca55da91a680bbb8a6fc10e3df394336ef5d766/src/cli/commands/codegen.ts#L251)
