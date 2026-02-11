import fsp from 'node:fs/promises';
import path from 'node:path';

import type { CrawleeOneConfig } from '../../types/config.js';
import { resolveOutFile } from './utils.js';

/**
 * Remove the `schema` property from input field objects,
 * because these are not part of the Apify input schema spec.
 *
 * Recurses into ObjectField.properties for nested fields.
 */
const stripFieldSchemas = (fields: Record<string, any>): Record<string, any> => {
  const cleaned: Record<string, any> = {};
  for (const [key, field] of Object.entries(fields)) {
    // Shallow-clone to avoid mutating the original
    const { schema: _schema, ...rest } = field;
    const cleanedField = rest;

    // If it's an ObjectField with nested properties, recurse
    if (cleanedField.type === 'object' && 'properties' in cleanedField && cleanedField.properties) {
      cleanedField.properties = stripFieldSchemas(cleanedField.properties);
    }

    cleaned[key] = cleanedField;
  }
  return cleaned;
};

/**
 * Generate actor.json from the `actor` section of the CrawleeOne config.
 *
 * Strips Zod `schema` properties from input fields (they are runtime-only
 * and not part of the Apify actor.json spec), then serializes to JSON.
 */
export const generateActor = async (config: CrawleeOneConfig): Promise<void> => {
  if (!config.actor) return;

  const { config: actorConfig, outFile } = config.actor;
  if (!actorConfig || typeof actorConfig !== 'object') {
    throw new Error('actor.config must be a non-null object');
  }

  // Strip `schema` properties from input fields
  const configToSerialize = { ...(actorConfig as Record<string, any>) };
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

  const jsonContent = JSON.stringify(configToSerialize, null, 2);
  const resolvedPath = resolveOutFile(outFile, 'actor.json');

  await fsp.mkdir(path.dirname(resolvedPath), { recursive: true });
  await fsp.writeFile(resolvedPath, jsonContent, 'utf-8');

  console.log(`Generated actor config at ${resolvedPath}`);
};
