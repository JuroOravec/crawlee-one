import { describe, expect, it } from 'vitest';
import { getPackageJsonInfo } from './package.js';

describe('getPackageJsonInfo', () => {
  it('reads the name field from the nearest package.json', () => {
    const result = getPackageJsonInfo(import.meta.url, ['name']);
    expect(result.name).toBe('crawlee-one');
  });

  it('reads multiple fields', () => {
    const result = getPackageJsonInfo(import.meta.url, ['name', 'version']);
    expect(result.name).toBe('crawlee-one');
    expect(result.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('returns undefined for fields that do not exist', () => {
    const result = getPackageJsonInfo(import.meta.url, ['nonExistentField']);
    expect(result.nonExistentField).toBeUndefined();
  });

  it('throws when no package.json can be found', () => {
    // Use a file:// URL pointing to the filesystem root where no package.json exists
    expect(() => getPackageJsonInfo('file:///package.json', ['name'])).toThrow(
      /package\.json not found/
    );
  });
});
