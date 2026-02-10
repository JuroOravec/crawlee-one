import { describe, expect, it } from 'vitest';
import { strOrNull, strAsNumber } from '../format.js';

describe('strOrNull', () => {
  it('returns the string when non-empty', () => {
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
  it('parses a float string', () => {
    expect(strAsNumber('3.14')).toBe(3.14);
  });

  it('parses an integer string', () => {
    expect(strAsNumber('42')).toBe(42);
  });

  it('returns null for null input', () => {
    expect(strAsNumber(null)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(strAsNumber('')).toBeNull();
  });

  it('returns empty-string value when allowEmpty is true but value is still unparseable', () => {
    // Empty string parses to NaN, so result is null
    expect(strAsNumber('', { mode: 'float', allowEmpty: true })).toBeNull();
  });

  it('returns null for non-numeric string', () => {
    expect(strAsNumber('abc')).toBeNull();
  });

  it('removes whitespace when removeWhitespace is true', () => {
    expect(strAsNumber('1 234', { mode: 'int', removeWhitespace: true })).toBe(1234);
  });

  it('handles custom separator', () => {
    // European style: 1.234.567
    expect(strAsNumber('1.234.567', { mode: 'int', separator: '\\.' })).toBe(1234567);
  });

  it('handles custom decimal', () => {
    // European style: 3,14
    expect(strAsNumber('3,14', { mode: 'float', decimal: ',' })).toBe(3.14);
  });

  it('handles separator and decimal together', () => {
    // European: 1.234,56
    expect(strAsNumber('1.234,56', { mode: 'float', separator: '\\.', decimal: ',' })).toBe(
      1234.56
    );
  });

  it('parses in int mode (truncates decimals)', () => {
    expect(strAsNumber('3.99', { mode: 'int' })).toBe(3);
  });

  it('defaults to float mode', () => {
    expect(strAsNumber('3.99')).toBe(3.99);
  });
});
