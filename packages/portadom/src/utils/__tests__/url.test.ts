import { describe, expect, it } from 'vitest';

import { resolveUrlPath, formatUrl } from '../url.js';

describe('resolveUrlPath', () => {
  it('resolves a relative path against a base URL', () => {
    expect(resolveUrlPath('https://example.com/old/path', '/new/path')).toBe(
      'https://example.com/new/path'
    );
  });

  it('preserves host and protocol', () => {
    const result = resolveUrlPath('https://api.example.com:8080/v1', '/v2/resource');
    expect(result).toBe('https://api.example.com:8080/v2/resource');
  });
});

describe('formatUrl', () => {
  it('returns non-string values as-is', () => {
    expect(formatUrl(null)).toBeNull();
    expect(formatUrl(42 as any)).toBe(42);
  });

  it('returns absolute URLs as-is', () => {
    expect(formatUrl('https://example.com/page')).toBe('https://example.com/page');
  });

  it('returns relative URLs when allowRelative is true', () => {
    expect(formatUrl('/page', { allowRelative: true })).toBe('/page');
  });

  it('resolves relative URLs with baseUrl', () => {
    expect(formatUrl('/page', { baseUrl: 'https://example.com' })).toBe('https://example.com/page');
  });

  it('throws when relative URL has no baseUrl', () => {
    expect(() => formatUrl('/page')).toThrow('baseUrl is missing');
  });
});
