import { describe, expect, it } from 'vitest';

import {
  expectColumnValuesToBeAscii,
  expectColumnValuesToBeSlug,
  expectColumnValuesToBeValidBase64,
  expectColumnValuesToBeValidDate,
  expectColumnValuesToBeValidHashtag,
  expectColumnValuesToBeValidHexColor,
  expectColumnValuesToBeValidHttpMethod,
  expectColumnValuesToBeValidHttpMethods,
  expectColumnValuesToBeValidHttpStatusCode,
  expectColumnValuesToBeValidIpv4,
  expectColumnValuesToBeValidIpv6,
  expectColumnValuesToBeValidMac,
  expectColumnValuesToBeValidMd5,
  expectColumnValuesToBeValidSha1,
  expectColumnValuesToBeValidTcpPort,
  expectColumnValuesToBeValidUdpPort,
  expectColumnValuesToBeValidUrls,
  expectColumnValuesToBeValidUuid,
  expectColumnValuesToBeWeekday,
  expectColumnValuesToContainValidEmail,
} from './semantic.js';

function col(values: unknown[]) {
  return values.map((v) => ({ v }));
}

describe('expectColumnValuesToBeValidUuid', () => {
  it('passes for valid UUIDs', () => {
    const d = col(['550e8400-e29b-41d4-a716-446655440000', 'f47ac10b-58cc-4372-a567-0e02b2c3d479']);
    expect(expectColumnValuesToBeValidUuid(d, 'v').success).toBe(true);
  });
  it('fails for invalid UUIDs', () => {
    const d = col(['not-a-uuid', '550e8400-e29b-41d4-a716-446655440000']);
    expect(expectColumnValuesToBeValidUuid(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToContainValidEmail', () => {
  it('passes for valid emails', () => {
    const d = col(['user@example.com', 'name+tag@domain.co.uk']);
    expect(expectColumnValuesToContainValidEmail(d, 'v').success).toBe(true);
  });
  it('fails for invalid emails', () => {
    const d = col(['not-an-email', '@missing-local.com', 'no-at-sign']);
    expect(expectColumnValuesToContainValidEmail(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeAscii', () => {
  it('passes for ASCII strings', () => {
    const d = col(['hello', 'world 123', '!@#$%']);
    expect(expectColumnValuesToBeAscii(d, 'v').success).toBe(true);
  });
  it('fails for non-ASCII', () => {
    const d = col(['hello', 'café']);
    expect(expectColumnValuesToBeAscii(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeSlug', () => {
  it('passes for valid slugs', () => {
    const d = col(['hello-world', 'my-post-123', 'simple']);
    expect(expectColumnValuesToBeSlug(d, 'v').success).toBe(true);
  });
  it('fails for non-slugs', () => {
    const d = col(['Hello World', 'with spaces', 'UPPER']);
    expect(expectColumnValuesToBeSlug(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidHexColor', () => {
  it('passes for valid hex colors', () => {
    const d = col(['#fff', '#AABBCC', '#12345678', '#abcd']);
    expect(expectColumnValuesToBeValidHexColor(d, 'v').success).toBe(true);
  });
  it('fails for invalid hex colors', () => {
    const d = col(['red', '#gg0000', '123456']);
    expect(expectColumnValuesToBeValidHexColor(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidMd5', () => {
  it('passes for valid MD5 hashes', () => {
    const d = col(['d41d8cd98f00b204e9800998ecf8427e']);
    expect(expectColumnValuesToBeValidMd5(d, 'v').success).toBe(true);
  });
  it('fails for wrong length or chars', () => {
    const d = col(['d41d8cd98f00b204e9800998ecf8427', 'xyz']);
    expect(expectColumnValuesToBeValidMd5(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidSha1', () => {
  it('passes for valid SHA1', () => {
    const d = col(['da39a3ee5e6b4b0d3255bfef95601890afd80709']);
    expect(expectColumnValuesToBeValidSha1(d, 'v').success).toBe(true);
  });
  it('fails for wrong length', () => {
    const d = col(['da39a3ee5e6b4b0d3255bfef95601890afd8070']);
    expect(expectColumnValuesToBeValidSha1(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidBase64', () => {
  it('passes for valid base64', () => {
    const d = col(['SGVsbG8=', 'dGVzdA==', 'YWJj']);
    expect(expectColumnValuesToBeValidBase64(d, 'v').success).toBe(true);
  });
  it('fails for invalid base64', () => {
    const d = col(['not valid!', '====']);
    expect(expectColumnValuesToBeValidBase64(d, 'v').success).toBe(false);
  });
  it('rejects empty string', () => {
    const d = col(['']);
    expect(expectColumnValuesToBeValidBase64(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidHashtag', () => {
  it('passes for valid hashtags', () => {
    const d = col(['#hello', '#TypeScript', '#100days']);
    expect(expectColumnValuesToBeValidHashtag(d, 'v').success).toBe(true);
  });
  it('fails without # prefix', () => {
    const d = col(['hello', 'no-hash']);
    expect(expectColumnValuesToBeValidHashtag(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidUrls', () => {
  it('passes for valid URLs', () => {
    const d = col(['https://example.com', 'http://localhost:3000/path', 'ftp://files.example.com']);
    expect(expectColumnValuesToBeValidUrls(d, 'v').success).toBe(true);
  });
  it('fails for non-URLs', () => {
    const d = col(['not a url', 'just-text']);
    expect(expectColumnValuesToBeValidUrls(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidIpv4', () => {
  it('passes for valid IPv4', () => {
    const d = col(['192.168.1.1', '10.0.0.0', '255.255.255.255']);
    expect(expectColumnValuesToBeValidIpv4(d, 'v').success).toBe(true);
  });
  it('fails for invalid IPv4', () => {
    const d = col(['256.0.0.1', '1.2.3', 'abc']);
    expect(expectColumnValuesToBeValidIpv4(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidIpv6', () => {
  it('passes for valid IPv6', () => {
    const d = col(['2001:0db8:85a3:0000:0000:8a2e:0370:7334', '::1', 'fe80::1']);
    expect(expectColumnValuesToBeValidIpv6(d, 'v').success).toBe(true);
  });
  it('fails for invalid IPv6', () => {
    const d = col(['192.168.1.1', 'not-ipv6']);
    expect(expectColumnValuesToBeValidIpv6(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidMac', () => {
  it('passes for valid MAC addresses', () => {
    const d = col(['00:1A:2B:3C:4D:5E', 'AA-BB-CC-DD-EE-FF']);
    expect(expectColumnValuesToBeValidMac(d, 'v').success).toBe(true);
  });
  it('fails for invalid MAC', () => {
    const d = col(['00:1A:2B:3C:4D', 'not-a-mac']);
    expect(expectColumnValuesToBeValidMac(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidHttpMethod', () => {
  it('passes for valid methods', () => {
    const d = col(['GET', 'POST', 'put', 'Delete']);
    expect(expectColumnValuesToBeValidHttpMethod(d, 'v').success).toBe(true);
  });
  it('fails for invalid methods', () => {
    const d = col(['FETCH', 'QUERY']);
    expect(expectColumnValuesToBeValidHttpMethod(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidHttpMethods', () => {
  it('is the same function as the singular form', () => {
    expect(expectColumnValuesToBeValidHttpMethods).toBe(expectColumnValuesToBeValidHttpMethod);
  });
});

describe('expectColumnValuesToBeValidHttpStatusCode', () => {
  it('passes for valid status codes', () => {
    const d = col([200, 301, 404, 500]);
    expect(expectColumnValuesToBeValidHttpStatusCode(d, 'v').success).toBe(true);
  });
  it('fails for out-of-range codes', () => {
    const d = col([99, 600, -1]);
    expect(expectColumnValuesToBeValidHttpStatusCode(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidTcpPort', () => {
  it('passes for valid ports', () => {
    const d = col([0, 80, 443, 8080, 65535]);
    expect(expectColumnValuesToBeValidTcpPort(d, 'v').success).toBe(true);
  });
  it('fails for out-of-range ports', () => {
    const d = col([-1, 65536, 100000]);
    expect(expectColumnValuesToBeValidTcpPort(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidUdpPort', () => {
  it('behaves like TCP port validation', () => {
    const d = col([0, 80, 65535]);
    expect(expectColumnValuesToBeValidUdpPort(d, 'v').success).toBe(true);
  });
});

describe('expectColumnValuesToBeValidDate', () => {
  it('passes for valid dates', () => {
    const d = col(['2024-01-15', '2024-01-15T10:30:00Z', 'Jan 15, 2024']);
    expect(expectColumnValuesToBeValidDate(d, 'v').success).toBe(true);
  });
  it('fails for invalid dates', () => {
    const d = col(['not-a-date', '']);
    expect(expectColumnValuesToBeValidDate(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeWeekday', () => {
  it('passes for weekdays', () => {
    // 2024-01-15 is a Monday
    const d = col(['2024-01-15', '2024-01-16', '2024-01-17']);
    expect(expectColumnValuesToBeWeekday(d, 'v').success).toBe(true);
  });
  it('fails for weekends', () => {
    // 2024-01-13 is a Saturday, 2024-01-14 is a Sunday
    const d = col(['2024-01-13', '2024-01-14']);
    expect(expectColumnValuesToBeWeekday(d, 'v').success).toBe(false);
  });
  it('supports mostly', () => {
    const d = col(['2024-01-15', '2024-01-16', '2024-01-13']);
    expect(expectColumnValuesToBeWeekday(d, 'v', { mostly: 0.6 }).success).toBe(true);
  });
});
