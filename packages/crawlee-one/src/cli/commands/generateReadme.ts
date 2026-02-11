import fsp from 'node:fs/promises';
import path from 'node:path';

import type { CrawleeOneConfig, ReadmeRenderer } from '../../types/config.js';
import { defaultReadmeRenderer } from '../../readme/defaultRenderer.js';
import { resolveOutFile } from './utils.js';

/**
 * Generate a README file from the `readme` section of the CrawleeOne config.
 *
 * Calls the configured renderer (or {@link defaultReadmeRenderer}) with the
 * provided actorSpec and input. The renderer returns a string;
 * this function writes it to disk.
 */
export const generateReadme = async (config: CrawleeOneConfig): Promise<void> => {
  if (!config.readme) return;

  const { actorSpec, input, renderer, outFile } = config.readme;

  // Cast to ReadmeRenderer<any> so that the unknown input
  // from the runtime config can be passed through without type errors.
  const renderFn: ReadmeRenderer<any> = renderer ?? defaultReadmeRenderer;
  const content = await renderFn({ actorSpec, input });

  const resolvedPath = resolveOutFile(outFile, 'README.md');

  await fsp.mkdir(path.dirname(resolvedPath), { recursive: true });
  await fsp.writeFile(resolvedPath, content, 'utf-8');

  console.log(`Generated README at ${resolvedPath}`);
};
