import fsp from 'node:fs/promises';
import path from 'node:path';

import { defaultReadmeRenderer } from './defaultRenderer.js';
import type { CrawleeOneConfig, ReadmeRenderer } from '../config/types.js';
import { resolveOutFile } from './utils.js';

/**
 * Generate a README file from the `readme` section of the CrawleeOne config.
 *
 * Calls the configured renderer (or {@link defaultReadmeRenderer}) with the
 * provided actorSpec and input. The renderer returns a string;
 * this function writes it to disk. ActorSpec comes from config.metadata.
 */
export const generateReadme = async (config: CrawleeOneConfig): Promise<void> => {
  if (!config.generate?.readme) return;

  const { input, renderer, outFile } = config.generate.readme;

  // Cast to ReadmeRenderer<any> so that the unknown input
  // from the runtime config can be passed through without type errors.
  const renderFn: ReadmeRenderer<any> = renderer ?? defaultReadmeRenderer;
  const content = await renderFn({
    actorSpec: config.metadata,
    input,
  });

  const resolvedPath = resolveOutFile(outFile, 'README.md');

  await fsp.mkdir(path.dirname(resolvedPath), { recursive: true });
  await fsp.writeFile(resolvedPath, content, 'utf-8');

  console.log(`Generated README at ${resolvedPath}`);
};
