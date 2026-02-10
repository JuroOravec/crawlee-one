import { describe, expect, it } from 'vitest';
import { getPackageJsonInfo } from '../package.js';

describe('getPackageJsonInfo', () => {
  it('reads the name field from the nearest package.json', () => {
    const result = getPackageJsonInfo(['name'], import.meta.url);
    expect(result.name).toBe('scraper-utils');
  });

  it('reads multiple fields', () => {
    const result = getPackageJsonInfo(['name', 'version'], import.meta.url);
    expect(result.name).toBe('scraper-utils');
    expect(result.version).toBe('0.0.0');
  });

  it('returns undefined for fields that do not exist', () => {
    const result = getPackageJsonInfo(['nonExistentField'], import.meta.url);
    expect(result.nonExistentField).toBeUndefined();
  });

  it('throws when no package.json can be found', () => {
    // Use a file:// URL pointing to the filesystem root where no package.json exists
    expect(() => getPackageJsonInfo(['name'], 'file:///package.json')).toThrow(
      /No package\.json found/
    );
  });
});
