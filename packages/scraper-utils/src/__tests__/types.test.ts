import { describe, expect, it } from 'vitest';
import { enumFromArray } from '../types.js';

describe('enumFromArray', () => {
  it('creates an object mapping each string to itself', () => {
    const arr = ['a', 'b', 'c'] as const;
    const result = enumFromArray(arr);
    expect(result).toEqual({ a: 'a', b: 'b', c: 'c' });
  });

  it('returns an empty object for an empty array', () => {
    const result = enumFromArray([] as const);
    expect(result).toEqual({});
  });

  it('handles single-element arrays', () => {
    const result = enumFromArray(['only'] as const);
    expect(result).toEqual({ only: 'only' });
  });

  it('preserves string casing', () => {
    const result = enumFromArray(['CamelCase', 'UPPER', 'lower'] as const);
    expect(result).toEqual({
      CamelCase: 'CamelCase',
      UPPER: 'UPPER',
      lower: 'lower',
    });
  });
});
