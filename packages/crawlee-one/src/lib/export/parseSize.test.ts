import { describe, it, expect } from 'vitest';

import { parseSize } from './parseSize.js';

describe('parseSize', () => {
  it('parses MB (uppercase)', () => {
    expect(parseSize('30MB')).toBe(30 * 1024 * 1024);
  });

  it('parses mb (lowercase)', () => {
    expect(parseSize('20mb')).toBe(20 * 1024 * 1024);
  });

  it('parses GB', () => {
    expect(parseSize('4GB')).toBe(4 * 1024 * 1024 * 1024);
  });

  it('parses KB', () => {
    expect(parseSize('100KB')).toBe(100 * 1024);
  });

  it('parses bytes (B)', () => {
    expect(parseSize('500b')).toBe(500);
  });

  it('parses decimal values', () => {
    expect(parseSize('1.5MB')).toBe(Math.floor(1.5 * 1024 * 1024));
  });

  it('returns null for invalid input', () => {
    expect(parseSize('')).toBeNull();
    expect(parseSize('invalid')).toBeNull();
    expect(parseSize('30')).toBeNull();
    expect(parseSize('30 M')).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(parseSize(undefined)).toBeNull();
  });
});
