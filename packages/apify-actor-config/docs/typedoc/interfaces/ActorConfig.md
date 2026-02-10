[**apify-actor-config**](../README.md)

***

[apify-actor-config](../globals.md) / ActorConfig

# Interface: ActorConfig\<TInputSchema, TOutputSchema, TEnvVars\>

Defined in: [config.ts:5](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L5)

See https://docs.apify.com/platform/actors/development/actor-definition/actor-json

## Type Parameters

### TInputSchema

`TInputSchema` *extends* [`ActorInputSchema`](ActorInputSchema.md) = [`ActorInputSchema`](ActorInputSchema.md)

### TOutputSchema

`TOutputSchema` *extends* [`ActorOutputSchema`](ActorOutputSchema.md) = [`ActorOutputSchema`](ActorOutputSchema.md)

### TEnvVars

`TEnvVars` *extends* `Record`\<`string`, `string`\> = `Record`\<`string`, `string`\>

## Properties

### actorSpecification

> **actorSpecification**: `1`

Defined in: [config.ts:14](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L14)

The version of the specification against which your schema is written.
Currently, only version 1 is out.

***

### buildTag?

> `optional` **buildTag**: `string`

Defined in: [config.ts:26](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L26)

The tag name applied for the successful build of the Actor. Defaults to `latest`

***

### changelog?

> `optional` **changelog**: `string`

Defined in: [config.ts:72](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L72)

The path to the CHANGELOG file displayed in the Information tab of the Actor
in Apify Console next to Readme. If not provided, the CHANGELOG at
`.actor/CHANGELOG.md` or `CHANGELOG.md` is used, in this order of preference.

***

### defaultMemoryMbytes?

> `optional` **defaultMemoryMbytes**: `string` \| `number`

Defined in: [config.ts:101](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L101)

Specifies the default amount of memory in megabytes to be used when the Actor
is started. Can be an integer or a dynamic memory expression string.

#### Examples

```ts
1024
```

```ts
"get(input, 'startUrls.length', 1) * 1024"
```

***

### dockerContextDir?

> `optional` **dockerContextDir**: `string`

Defined in: [config.ts:58](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L58)

Specifies the path to the directory used as the Docker context when building
the Actor. The path is relative to the location of the actor.json file. Useful
for having a monorepo with multiple Actors.

***

### dockerfile?

> `optional` **dockerfile**: `string`

Defined in: [config.ts:52](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L52)

If you specify the path to your Docker file under the dockerfile field,
this file will be used for actor builds on the platform. If not specified,
the system will look for Docker files at .actor/Dockerfile and Dockerfile,
in this order of preference.

Example: `'./Dockerfile'`

***

### environmentVariables?

> `optional` **environmentVariables**: `TEnvVars`

Defined in: [config.ts:43](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L43)

A map of environment variables used during the local development that will be also applied to
Actor at Apify platform.

#### Example

```ts
{
   * MYSQL_USER: 'my_username',
   * MYSQL_PASSWORD: '@mySecretPassword',
   * }
```

***

### input?

> `optional` **input**: `string` \| `TInputSchema`

Defined in: [config.ts:81](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L81)

You can embed your input schema object directly in actor.json under the input field.
Alternatively, you can provide a path to a custom input schema. If not provided,
the input schema at .actor/INPUT_SCHEMA.json or INPUT_SCHEMA.json is used,
in this order of preference.

Example: `'./input_schema.json'`

***

### maxMemoryMbytes?

> `optional` **maxMemoryMbytes**: `number`

Defined in: [config.ts:113](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L113)

Specifies the maximum amount of memory in megabytes that an Actor requires to run.
It can be used to control the costs of run, especially when developing pay per result
actors. Requires an integer value.

***

### meta?

> `optional` **meta**: `object`

Defined in: [config.ts:32](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L32)

Metadata object containing additional information about the Actor.
Currently supports `templateId` field to identify the template from which
the Actor was created.

***

### minMemoryMbytes?

> `optional` **minMemoryMbytes**: `number`

Defined in: [config.ts:107](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L107)

Specifies the minimum amount of memory in megabytes that an Actor requires to run.
Requires an integer value. If both minMemoryMbytes and maxMemoryMbytes are set, then
minMemoryMbytes must be the same or lower than maxMemoryMbytes.

***

### name

> **name**: `string`

Defined in: [config.ts:16](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L16)

Name of the Actor.

***

### readme?

> `optional` **readme**: `string`

Defined in: [config.ts:66](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L66)

If you specify the path to your README file under the readme field, the README
at this path will be used on the platform. If not specified,
README at .actor/README.md or README.md will be used, in this order of preference.

Example: `'./ACTOR.md'`

***

### storages?

> `optional` **storages**: `object`

Defined in: [config.ts:82](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L82)

#### dataset?

> `optional` **dataset**: `string` \| `TOutputSchema`

You can define the schema of the items in your dataset under the storages.dataset field.
This can be either an embedded object or a path to a JSON schema file.

Read more about actor output schema at
https://docs.apify.com/platform/actors/development/actor-definition/dataset-schema

Example: `'./dataset_schema.json'`

***

### title?

> `optional` **title**: `string`

Defined in: [config.ts:22](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L22)

The display title of the Actor. This is the human-readable title shown
in the Apify Console and Store. If not specified, the `name` property
is used as the title.

***

### usesStandbyMode?

> `optional` **usesStandbyMode**: `boolean`

Defined in: [config.ts:119](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L119)

Boolean specifying whether the Actor will have Standby mode enabled.

See https://docs.apify.com/platform/actors/development/programming-interface/standby

***

### version

> **version**: `string`

Defined in: [config.ts:24](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L24)

Actor version in the form [Number].[Number], i.e. for example `0.0`, `0.1`, `2.3`, ...

***

### webServerMcpPath?

> `optional` **webServerMcpPath**: `string`

Defined in: [config.ts:133](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L133)

The HTTP endpoint path where the Actor exposes its MCP (Model Context Protocol)
server functionality. When set, the Actor is recognized as an MCP server.
For example, setting `"/mcp"` designates the `/mcp` endpoint as the MCP interface.
This path becomes part of the Actor's stable URL when Standby mode is enabled.

***

### webServerSchema?

> `optional` **webServerSchema**: `string` \| `object`

Defined in: [config.ts:126](https://github.com/JuroOravec/crawlee-one/blob/main/packages/apify-actor-config/src/types/config.ts#L126)

Defines an OpenAPI v3 schema for the web server running in the Actor.
This can be either an embedded object or a path to a JSON schema file.
Use this when your Actor starts its own HTTP server and you want to
describe its interface.
