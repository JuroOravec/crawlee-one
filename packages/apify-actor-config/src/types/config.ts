import type { ActorInputSchema } from './inputSchema.js';
import type { ActorOutputSchema } from './outputSchema.js';

/** See https://docs.apify.com/platform/actors/development/actor-definition/actor-json */
export interface ActorConfig<
  TInputSchema extends ActorInputSchema = ActorInputSchema,
  TOutputSchema extends ActorOutputSchema = ActorOutputSchema,
  TEnvVars extends Record<string, string> = Record<string, string>,
> {
  /**
   * The version of the specification against which your schema is written.
   * Currently, only version 1 is out.
   */
  actorSpecification: 1;
  /** Name of the Actor. */
  name: string;
  /**
   * The display title of the Actor. This is the human-readable title shown
   * in the Apify Console and Store. If not specified, the `name` property
   * is used as the title.
   */
  title?: string;
  /** Actor version in the form [Number].[Number], i.e. for example `0.0`, `0.1`, `2.3`, ... */
  version: string;
  /** The tag name applied for the successful build of the Actor. Defaults to `latest` */
  buildTag?: string;
  /**
   * Metadata object containing additional information about the Actor.
   * Currently supports `templateId` field to identify the template from which
   * the Actor was created.
   */
  meta?: object;
  /**
   * A map of environment variables used during the local development that will be also applied to
   * Actor at Apify platform.
   *
   * @example
   * {
   * MYSQL_USER: 'my_username',
   * MYSQL_PASSWORD: '@mySecretPassword',
   * }
   */
  environmentVariables?: TEnvVars;
  /**
   * If you specify the path to your Docker file under the dockerfile field,
   * this file will be used for actor builds on the platform. If not specified,
   * the system will look for Docker files at .actor/Dockerfile and Dockerfile,
   * in this order of preference.
   *
   * Example: `'./Dockerfile'`
   */
  dockerfile?: string;
  /**
   * Specifies the path to the directory used as the Docker context when building
   * the Actor. The path is relative to the location of the actor.json file. Useful
   * for having a monorepo with multiple Actors.
   */
  dockerContextDir?: string;
  /**
   * If you specify the path to your README file under the readme field, the README
   * at this path will be used on the platform. If not specified,
   * README at .actor/README.md or README.md will be used, in this order of preference.
   *
   * Example: `'./ACTOR.md'`
   */
  readme?: string;
  /**
   * The path to the CHANGELOG file displayed in the Information tab of the Actor
   * in Apify Console next to Readme. If not provided, the CHANGELOG at
   * `.actor/CHANGELOG.md` or `CHANGELOG.md` is used, in this order of preference.
   */
  changelog?: string;
  /**
   * You can embed your input schema object directly in actor.json under the input field.
   * Alternatively, you can provide a path to a custom input schema. If not provided,
   * the input schema at .actor/INPUT_SCHEMA.json or INPUT_SCHEMA.json is used,
   * in this order of preference.
   *
   * Example: `'./input_schema.json'`
   */
  input?: string | TInputSchema;
  storages?: {
    /**
     * You can define the schema of the items in your dataset under the storages.dataset field.
     * This can be either an embedded object or a path to a JSON schema file.
     *
     * Read more about actor output schema at
     * https://docs.apify.com/platform/actors/development/actor-definition/dataset-schema
     *
     * Example: `'./dataset_schema.json'`
     */
    dataset?: string | TOutputSchema;
  };
  /**
   * Specifies the default amount of memory in megabytes to be used when the Actor
   * is started. Can be an integer or a dynamic memory expression string.
   *
   * @example 1024
   * @example "get(input, 'startUrls.length', 1) * 1024"
   */
  defaultMemoryMbytes?: number | string;
  /**
   * Specifies the minimum amount of memory in megabytes that an Actor requires to run.
   * Requires an integer value. If both minMemoryMbytes and maxMemoryMbytes are set, then
   * minMemoryMbytes must be the same or lower than maxMemoryMbytes.
   */
  minMemoryMbytes?: number;
  /**
   * Specifies the maximum amount of memory in megabytes that an Actor requires to run.
   * It can be used to control the costs of run, especially when developing pay per result
   * actors. Requires an integer value.
   */
  maxMemoryMbytes?: number;
  /**
   * Boolean specifying whether the Actor will have Standby mode enabled.
   *
   * See https://docs.apify.com/platform/actors/development/programming-interface/standby
   */
  usesStandbyMode?: boolean;
  /**
   * Defines an OpenAPI v3 schema for the web server running in the Actor.
   * This can be either an embedded object or a path to a JSON schema file.
   * Use this when your Actor starts its own HTTP server and you want to
   * describe its interface.
   */
  webServerSchema?: string | object;
  /**
   * The HTTP endpoint path where the Actor exposes its MCP (Model Context Protocol)
   * server functionality. When set, the Actor is recognized as an MCP server.
   * For example, setting `"/mcp"` designates the `/mcp` endpoint as the MCP interface.
   * This path becomes part of the Actor's stable URL when Standby mode is enabled.
   */
  webServerMcpPath?: string;
}

export const createActorConfig = <T extends ActorConfig>(config: T) => config;
