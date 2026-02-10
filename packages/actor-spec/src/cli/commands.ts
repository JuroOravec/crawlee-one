import fs from 'node:fs';
import path from 'node:path';
import fsp from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

import type { ActorSpec } from '../types/actorSpec.js';

type MaybePromise<T> = T | Promise<T>;
type MaybeAsyncFn<R, Args extends any[] = []> = R | ((...args: Args) => MaybePromise<R>);

const absPath = (filepath: string) => {
  const cwd = process.cwd();
  return path.resolve(cwd, filepath);
};

/** Given a path to an actorspec.js file, resolve the config and export it as JSON to out path */
export const generate = async ({
  config: unresolvedConfigPath,
  outDir,
  silent,
}: {
  /** Path to config file, relative to CWD */
  config: string;
  /** Dir path where the actorspec.json will be generated, relative to CWD */
  outDir?: string;
  silent?: boolean;
}) => {
  const log = silent ? () => {} : console.log;

  const absConfigPath = absPath(unresolvedConfigPath);
  log(`Importing file from ${absConfigPath}`);

  // Use dynamic import() with file:// URL for ESM compatibility
  const configModule = await import(pathToFileURL(absConfigPath).href);
  const configOrInit = configModule.default as MaybeAsyncFn<ActorSpec>;
  if (!configOrInit || !['function', 'object'].includes(typeof configOrInit)) {
    throw Error(
      `Failed to import actorspec from path ${absConfigPath}, got ${configOrInit} instead`
    );
  }

  log(`Actorspec found! Resolving...`);
  const resolvedConfig = typeof configOrInit === 'function' ? await configOrInit() : configOrInit;
  if (!resolvedConfig || typeof resolvedConfig !== 'object') {
    throw Error(
      `Failed to import actorspec from path ${absConfigPath}, the import did not resolve to object, got ${resolvedConfig} instead`
    );
  }

  if (!resolvedConfig.actorspecVersion) {
    throw Error(
      `Invalid actorspec object imported from path ${absConfigPath}, config.actorspecVersion is missing`
    );
  }

  const jsonConfig = JSON.stringify(resolvedConfig, null, 2);

  const outDirUsed = outDir ? outDir : fs.existsSync(absPath('./.actor')) ? './.actor' : '.';
  const absOutDirPath = absPath(outDirUsed);
  const absOutFilePath = path.resolve(absOutDirPath, 'actorspec.json');
  log(`Writing resolved config to file ${absOutFilePath}`);

  await fsp.mkdir(absOutDirPath, { recursive: true });
  await fsp.writeFile(absOutFilePath, jsonConfig, 'utf-8');

  log(`Done!`);
};
