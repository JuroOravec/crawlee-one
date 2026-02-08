import { describe, it, expect } from 'vitest';

import { validateUrl, resolveUrlPath, formatUrl } from './url';

describe('validateUrl', () => {
  it('does not throw for valid URLs', () => {
    expect(() => validateUrl('https://example.com')).not.toThrow();
    expect(() => validateUrl('http://localhost:3000/path')).not.toThrow();
  });

  it('throws for invalid URLs with the URL in the error message', () => {
    expect(() => validateUrl('not-a-url')).toThrow('not-a-url');
  });
});

describe('resolveUrlPath', () => {
  it('resolves a relative path against a base URL', () => {
    expect(resolveUrlPath('https://example.com', '/about')).toBe('https://example.com/about');
  });

  it('replaces existing path with the new path', () => {
    expect(resolveUrlPath('https://example.com/old', '/new')).toBe('https://example.com/new');
  });

  it('preserves protocol and host', () => {
    const result = resolveUrlPath('https://sub.example.com:8080', '/path');
    expect(result).toBe('https://sub.example.com:8080/path');
  });
});

describe('formatUrl', () => {
  it('returns absolute URLs unchanged', () => {
    expect(formatUrl('https://example.com/page')).toBe('https://example.com/page');
  });

  it('returns non-string values unchanged', () => {
    const obj = { url: 'test' };
    expect(formatUrl(obj)).toBe(obj);
    expect(formatUrl(42 as any)).toBe(42);
  });

  it('converts relative URL to absolute when baseUrl is provided', () => {
    const result = formatUrl('/about', { baseUrl: 'https://example.com' });
    expect(result).toBe('https://example.com/about');
  });

  it('throws for relative URL when baseUrl is missing', () => {
    expect(() => formatUrl('/about')).toThrow('baseUrl is missing');
  });

  it('returns relative URL unchanged when allowRelative is true', () => {
    expect(formatUrl('/about', { allowRelative: true })).toBe('/about');
  });

  it('does not treat non-slash-prefixed strings as relative', () => {
    // Strings that don't start with '/' are returned as-is
    expect(formatUrl('about')).toBe('about');
  });
});
