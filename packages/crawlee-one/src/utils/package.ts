import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Finds the closest package.json by walking up from the given
 * `import.meta.url` and returns only the requested fields.
 */
export const getPackageJsonInfo = <TFields extends string = string>(
  importMetaUrl: string,
  fields: TFields[]
): Record<TFields, any> => {
  let dir = path.dirname(fileURLToPath(importMetaUrl));
  while (true) {
    try {
      const pkg = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf-8'));
      const result = {} as Record<TFields, any>;
      for (const field of fields) result[field] = pkg[field];
      return result;
    } catch {
      const parent = path.dirname(dir);
      if (parent === dir) throw new Error('package.json not found');
      dir = parent;
    }
  }
};
