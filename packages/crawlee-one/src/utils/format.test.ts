import { describe, it, expect } from 'vitest';

import { strOrNull, strAsNumber } from './format.js';

describe('strOrNull', () => {
  it('returns string for truthy strings', () => {
    expect(strOrNull('hello')).toBe('hello');
  });

  it('returns null for null input', () => {
    expect(strOrNull(null)).toBeNull();
  });

  it('returns null for empty string by default', () => {
    expect(strOrNull('')).toBeNull();
  });

  it('returns empty string when allowEmpty is true', () => {
    expect(strOrNull('', true)).toBe('');
  });
});

describe('strAsNumber', () => {
  it('parses float by default', () => {
    expect(strAsNumber('3.14')).toBe(3.14);
  });

  it('parses integer in int mode', () => {
    expect(strAsNumber('3.14', { mode: 'int' })).toBe(3);
  });

  it('returns null for null input', () => {
    expect(strAsNumber(null)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(strAsNumber('')).toBeNull();
  });

  it('returns null for non-numeric string', () => {
    expect(strAsNumber('abc')).toBeNull();
  });

  it('removes whitespace when removeWhitespace is true', () => {
    expect(strAsNumber(' 4 2 ', { mode: 'int', removeWhitespace: true })).toBe(42);
  });

  it('handles custom separator', () => {
    expect(strAsNumber('1,000,000', { mode: 'int', separator: ',' })).toBe(1000000);
  });

  it('handles custom decimal', () => {
    expect(strAsNumber('3,14', { mode: 'float', decimal: ',' })).toBe(3.14);
  });

  it('handles separator and decimal together', () => {
    expect(strAsNumber('1.000,50', { mode: 'float', separator: '\\.', decimal: ',' })).toBe(1000.5);
  });

  it('returns empty string as number when allowEmpty is true but content is empty', () => {
    // Empty string still becomes NaN when parsed
    expect(strAsNumber('', { mode: 'float', allowEmpty: true })).toBeNull();
  });
});
