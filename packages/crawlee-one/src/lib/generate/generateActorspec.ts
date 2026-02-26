import fsp from 'node:fs/promises';
import path from 'node:path';

import type { CrawleeOneConfig } from '../config/types.js';
import { resolveOutFile } from './utils.js';

/**
 * Generate actorspec.json from the `actorspec` section of the CrawleeOne config.
 *
 * Validates that `actorspecVersion` is present, then serializes to JSON.
 * ActorSpec comes from config.metadata.
 */

export const generateActorSpec = async (config: CrawleeOneConfig): Promise<void> => {
  if (!config.generate?.actorspec) return;

  const { outFile } = config.generate.actorspec;
  const actorSpec = config.metadata;
  if (!actorSpec || typeof actorSpec !== 'object') {
    throw new Error('ActorSpec required for actorspec generation. Set config.metadata.');
  }

  const spec = actorSpec as Record<string, any>;
  if (!spec.actorspecVersion) {
    throw new Error(
      'Invalid actorspec: actorspecVersion is missing. ' +
        'The ActorSpec (from config.metadata) must include an actorspecVersion field.'
    );
  }

  const jsonContent = JSON.stringify(actorSpec, null, 2);
  const resolvedPath = resolveOutFile(outFile, 'actorspec.json');

  await fsp.mkdir(path.dirname(resolvedPath), { recursive: true });
  await fsp.writeFile(resolvedPath, jsonContent, 'utf-8');

  console.log(`Generated actorspec at ${resolvedPath}`);
};
