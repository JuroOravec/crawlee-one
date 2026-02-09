import { describe, it, expect } from 'vitest';

import { enumFromArray } from './types.js';

describe('enumFromArray', () => {
  it('creates a self-referencing enum object', () => {
    const result = enumFromArray(['a', 'b', 'c'] as const);
    expect(result).toEqual({ a: 'a', b: 'b', c: 'c' });
  });

  it('returns empty object for empty array', () => {
    const result = enumFromArray([] as const);
    expect(result).toEqual({});
  });

  it('keys equal values', () => {
    const result = enumFromArray(['foo', 'bar'] as const);
    expect(result.foo).toBe('foo');
    expect(result.bar).toBe('bar');
  });
});
