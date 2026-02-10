import { describe, expect, it } from 'vitest';

import { strOrNull, strAsNumber } from '../format.js';

describe('strOrNull', () => {
  it('returns null for null input', () => {
    expect(strOrNull(null)).toBeNull();
  });

  it('returns null for empty string by default', () => {
    expect(strOrNull('')).toBeNull();
  });

  it('returns empty string when allowEmpty is true', () => {
    expect(strOrNull('', true)).toBe('');
  });

  it('returns non-empty strings as-is', () => {
    expect(strOrNull('hello')).toBe('hello');
  });
});

describe('strAsNumber', () => {
  it('parses a float by default', () => {
    expect(strAsNumber('3.14', { mode: 'float' })).toBe(3.14);
  });

  it('parses an integer', () => {
    expect(strAsNumber('42', { mode: 'int' })).toBe(42);
  });

  it('returns null for null input', () => {
    expect(strAsNumber(null, { mode: 'float' })).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(strAsNumber('', { mode: 'float' })).toBeNull();
  });

  it('returns null for non-numeric string', () => {
    expect(strAsNumber('abc', { mode: 'float' })).toBeNull();
  });

  it('strips whitespace when removeWhitespace is true', () => {
    expect(strAsNumber('1 234', { mode: 'int', removeWhitespace: true })).toBe(1234);
  });

  it('handles custom separator', () => {
    expect(strAsNumber('1,234', { mode: 'int', separator: ',' })).toBe(1234);
  });

  it('handles custom decimal character', () => {
    expect(strAsNumber('3,14', { mode: 'float', decimal: ',' })).toBe(3.14);
  });

  it('handles separator and decimal together', () => {
    expect(strAsNumber('1.234,56', { mode: 'float', separator: '\\.', decimal: ',' })).toBe(
      1234.56
    );
  });

  it('defaults to float mode when mode is not specified', () => {
    expect(strAsNumber('3.14')).toBe(3.14);
  });
});
