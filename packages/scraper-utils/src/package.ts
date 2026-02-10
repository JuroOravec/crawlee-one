import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

/**
 * Read fields from the nearest package.json relative to the given module.
 *
 * Walks up from the caller's directory to find the nearest package.json.
 *
 * @param fields - Array of field names to read from package.json.
 * @param importMetaUrl - Pass `import.meta.url` from the calling module.
 *
 * @example
 * ```ts
 * const pkg = getPackageJsonInfo(['name', 'version'], import.meta.url);
 * console.log(pkg.name); // "my-scraper"
 * ```
 */
export const getPackageJsonInfo = <TFields extends string = string>(
  fields: TFields[],
  importMetaUrl: string
): Record<TFields, any> => {
  const req = createRequire(importMetaUrl);
  let dir = dirname(fileURLToPath(importMetaUrl));

  // Walk up directories to find the nearest package.json
  while (true) {
    const candidate = join(dir, 'package.json');
    if (existsSync(candidate)) {
      const pkg = req(candidate);
      const result = {} as Record<TFields, any>;
      for (const field of fields) {
        result[field] = pkg[field];
      }
      return result;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  throw new Error(`No package.json found starting from ${importMetaUrl}`);
};
