import fs from 'node:fs';
import path from 'node:path';
import fsp from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

import type { ActorConfig } from '../types/config.js';
import type { Field } from '../types/inputSchema.js';

type MaybePromise<T> = T | Promise<T>;
type MaybeAsyncFn<R, Args extends any[] = []> = R | ((...args: Args) => MaybePromise<R>);

/**
 * Remove the `schema` property from `Field` objects,
 * because these are not part of Apify input schema spec.
 *
 * Recurses into ObjectField.properties for nested Fields.
 */
const stripFieldSchemas = (fields: Record<string, Field>): Record<string, Field> => {
  const cleaned: Record<string, Field> = {};
  for (const [key, field] of Object.entries(fields)) {
    // Shallow-clone to avoid mutating the original
    const { schema: _schema, ...rest } = field;
    const cleanedField = rest as Field;

    // If it's an ObjectField with nested properties, recurse
    if (cleanedField.type === 'object' && 'properties' in cleanedField && cleanedField.properties) {
      (cleanedField as any).properties = stripFieldSchemas(cleanedField.properties);
    }

    cleaned[key] = cleanedField;
  }
  return cleaned;
};

const absPath = (filepath: string) => {
  const cwd = process.cwd();
  return path.resolve(cwd, filepath);
};

/** Given a path to a config .js file, resolve the config and export it as JSON to out path */
export const generate = async ({
  config: unresolvedConfigPath,
  outDir,
  silent,
}: {
  /** Path to config file */
  config: string;
  /** Dir path where the actor.json will be generated */
  outDir?: string;
  silent?: boolean;
}) => {
  const log = silent ? () => {} : console.log;

  const absConfigPath = absPath(unresolvedConfigPath);
  log(`Importing config file from ${absConfigPath}`);

  // Use dynamic import() with file:// URL for ESM compatibility
  const configModule = await import(pathToFileURL(absConfigPath).href);
  const configOrInit = configModule.default as MaybeAsyncFn<ActorConfig>;
  if (!configOrInit || !['function', 'object'].includes(typeof configOrInit)) {
    throw Error(
      `Failed to import Actor config from path ${absConfigPath}, got ${configOrInit} instead`
    );
  }

  log(`Config found! Resolving...`);
  const resolvedConfig = typeof configOrInit === 'function' ? await configOrInit() : configOrInit;
  if (!resolvedConfig || typeof resolvedConfig !== 'object') {
    throw Error(
      `Failed to import Actor config from path ${absConfigPath}, config did not resolve to object, got ${resolvedConfig} instead`
    );
  }

  if (!resolvedConfig.actorSpecification) {
    throw Error(
      `Invalid Actor config object imported from path ${absConfigPath}, config.actorSpecification is missing`
    );
  }

  // Strip `schema` properties from Fields in `config.input.properties`,
  // because these are not part of Apify input schema spec.
  const configToSerialize = { ...resolvedConfig };
  if (
    configToSerialize.input &&
    typeof configToSerialize.input === 'object' &&
    configToSerialize.input.properties
  ) {
    configToSerialize.input = {
      ...configToSerialize.input,
      properties: stripFieldSchemas(configToSerialize.input.properties),
    };
  }

  const jsonConfig = JSON.stringify(configToSerialize, null, 2);

  const outDirUsed = outDir ? outDir : fs.existsSync(absPath('./.actor')) ? './.actor' : '.';
  const absOutDirPath = absPath(outDirUsed);
  const absOutFilePath = path.resolve(absOutDirPath, 'actor.json');
  log(`Writing resolved config to file ${absOutFilePath}`);

  await fsp.mkdir(absOutDirPath, { recursive: true });
  await fsp.writeFile(absOutFilePath, jsonConfig, 'utf-8');

  log(`Done!`);
};
