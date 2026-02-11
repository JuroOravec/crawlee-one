import fsp from 'node:fs/promises';
import path from 'node:path';

import type { CrawleeOneConfig } from '../../types/config.js';
import { resolveOutFile } from './utils.js';

/**
 * Generate actorspec.json from the `actorspec` section of the CrawleeOne config.
 *
 * Validates that `actorspecVersion` is present, then serializes to JSON.
 */
export const generateActorSpec = async (config: CrawleeOneConfig): Promise<void> => {
  if (!config.actorspec) return;

  const { config: actorSpecConfig, outFile } = config.actorspec;
  if (!actorSpecConfig || typeof actorSpecConfig !== 'object') {
    throw new Error('actorspec.config must be a non-null object');
  }

  const spec = actorSpecConfig as Record<string, any>;
  if (!spec.actorspecVersion) {
    throw new Error(
      'Invalid actorspec config: actorspecVersion is missing. ' +
        'The actorspec.config object must include an actorspecVersion field.'
    );
  }

  const jsonContent = JSON.stringify(actorSpecConfig, null, 2);
  const resolvedPath = resolveOutFile(outFile, 'actorspec.json');

  await fsp.mkdir(path.dirname(resolvedPath), { recursive: true });
  await fsp.writeFile(resolvedPath, jsonContent, 'utf-8');

  console.log(`Generated actorspec at ${resolvedPath}`);
};
