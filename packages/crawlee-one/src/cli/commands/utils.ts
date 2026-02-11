import fs from 'node:fs';
import path from 'node:path';

/**
 * Resolve the output file path for a generator.
 *
 * If `outFile` is provided, it is resolved relative to cwd.
 * Otherwise, falls back to `.actor/{defaultName}` when `.actor/` exists,
 * or `./{defaultName}` in the current directory.
 */
export const resolveOutFile = (outFile: string | undefined, defaultName: string): string => {
  if (outFile) {
    return path.resolve(process.cwd(), outFile);
  }
  const actorDir = path.resolve(process.cwd(), '.actor');
  const base = fs.existsSync(actorDir) ? actorDir : process.cwd();
  return path.resolve(base, defaultName);
};
