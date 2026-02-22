import { describe, it, expect } from 'vitest';
import {
  expectColumnValuesToBeValidSsn,
  expectColumnValuesToBeValidImdbId,
  expectColumnValuesToBeValidDoi,
  expectColumnValuesToBeValidOrcid,
  expectColumnValuesToBeValidArxivId,
  expectColumnValuesToBeValidPubmedId,
  expectColumnValuesToBeValidRomanNumeral,
  expectColumnValuesToBeValidBase32,
  expectColumnValuesToBeXmlParseable,
  expectColumnValuesToBeValidTemperature,
  expectColumnValuesToBeValidPrice,
  expectColumnValuesToBeValidOpenLibraryId,
  expectColumnValuesToBeSecurePasswords,
  expectColumnValuesToBeVectors,
} from './semanticFormat.js';

describe('expectColumnValuesToBeValidSsn', () => {
  it('passes for valid format', () => {
    const d = [{ v: '856-45-6789' }, { v: '467-81-9630' }];
    expect(expectColumnValuesToBeValidSsn(d, 'v').success).toBe(true);
  });

  it('rejects invalid area numbers', () => {
    const d = [{ v: '000-45-6789' }, { v: '666-45-6789' }, { v: '900-45-6789' }];
    const r = expectColumnValuesToBeValidSsn(d, 'v');
    expect(r.success).toBe(false);
    expect(r.unexpected_count).toBe(3);
  });
});

describe('expectColumnValuesToBeValidImdbId', () => {
  it('passes for valid IDs', () => {
    const d = [{ v: 'tt0068646' }, { v: 'nm1827914' }, { v: 'ch0000985' }];
    expect(expectColumnValuesToBeValidImdbId(d, 'v').success).toBe(true);
  });

  it('fails for invalid IDs', () => {
    const d = [{ v: 'ab0068646' }, { v: '42' }];
    expect(expectColumnValuesToBeValidImdbId(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidDoi', () => {
  it('passes for valid DOIs', () => {
    const d = [{ v: '10.1430/8105' }, { v: '10.1038/nphys1170' }];
    expect(expectColumnValuesToBeValidDoi(d, 'v').success).toBe(true);
  });

  it('fails for invalid DOIs', () => {
    const d = [{ v: '11.1038/nphys1170' }, { v: 'not-a-doi' }];
    expect(expectColumnValuesToBeValidDoi(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidOrcid', () => {
  it('passes for valid ORCIDs', () => {
    const d = [{ v: '0000-0002-1003-5675' }, { v: '0000-0002-1694-233X' }];
    expect(expectColumnValuesToBeValidOrcid(d, 'v').success).toBe(true);
  });

  it('fails for invalid ORCIDs', () => {
    const d = [{ v: '1234-5678-9012-3456' }];
    expect(expectColumnValuesToBeValidOrcid(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidArxivId', () => {
  it('passes for new-format IDs', () => {
    const d = [{ v: '1706.03762' }, { v: '2301.01234v2' }];
    expect(expectColumnValuesToBeValidArxivId(d, 'v').success).toBe(true);
  });

  it('passes for old-format IDs', () => {
    const d = [{ v: 'hep-th/9108001' }, { v: 'math/9910001v1' }];
    expect(expectColumnValuesToBeValidArxivId(d, 'v').success).toBe(true);
  });

  it('fails for invalid IDs', () => {
    const d = [{ v: 'not-an-arxiv-id' }, { v: '' }];
    expect(expectColumnValuesToBeValidArxivId(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidPubmedId', () => {
  it('passes for valid IDs', () => {
    const d = [{ v: '823' }, { v: '17246615' }, { v: '32768924' }];
    expect(expectColumnValuesToBeValidPubmedId(d, 'v').success).toBe(true);
  });

  it('fails for invalid IDs', () => {
    const d = [{ v: '172466159' }, { v: '01724661' }];
    expect(expectColumnValuesToBeValidPubmedId(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidRomanNumeral', () => {
  it('passes for valid numerals', () => {
    const d = [{ v: 'VIII' }, { v: 'XLII' }, { v: 'MDCCLXXVI' }];
    expect(expectColumnValuesToBeValidRomanNumeral(d, 'v').success).toBe(true);
  });

  it('fails for invalid numerals', () => {
    const d = [{ v: '' }, { v: '42' }, { v: 'XVIV' }];
    expect(expectColumnValuesToBeValidRomanNumeral(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidBase32', () => {
  it('passes for valid base32', () => {
    const d = [{ v: 'GQZA====' }, { v: 'JBSWY3DPEBLW64TMMQQQ====' }];
    expect(expectColumnValuesToBeValidBase32(d, 'v').success).toBe(true);
  });

  it('fails for invalid base32', () => {
    const d = [{ v: 'GQZA' }, { v: 'not base32!' }];
    expect(expectColumnValuesToBeValidBase32(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeXmlParseable', () => {
  it('passes for valid XML', () => {
    const d = [{ v: '<root><child/></root>' }, { v: '<br/>' }];
    expect(expectColumnValuesToBeXmlParseable(d, 'v').success).toBe(true);
  });

  it('fails for invalid XML', () => {
    const d = [{ v: 'not xml' }, { v: '<open>' }];
    expect(expectColumnValuesToBeXmlParseable(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidTemperature', () => {
  it('passes for valid temperatures', () => {
    const d = [{ v: '100C' }, { v: '212 F' }, { v: '-40°C' }, { v: '273.15K' }];
    expect(expectColumnValuesToBeValidTemperature(d, 'v').success).toBe(true);
  });

  it('fails for invalid temperatures', () => {
    const d = [{ v: 'hot' }, { v: '100' }, { v: '100X' }];
    expect(expectColumnValuesToBeValidTemperature(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidPrice', () => {
  it('passes for valid prices', () => {
    const d = [{ v: '$19.99' }, { v: '100' }, { v: '€1,000.50' }, { v: '£9.99' }];
    expect(expectColumnValuesToBeValidPrice(d, 'v').success).toBe(true);
  });

  it('fails for invalid prices', () => {
    const d = [{ v: 'free' }, { v: '' }];
    expect(expectColumnValuesToBeValidPrice(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidOpenLibraryId', () => {
  it('passes for valid IDs', () => {
    const d = [{ v: 'OL1234567M' }, { v: 'OL98765A' }, { v: 'OL100W' }];
    expect(expectColumnValuesToBeValidOpenLibraryId(d, 'v').success).toBe(true);
  });

  it('fails for invalid IDs', () => {
    const d = [{ v: 'OL1234' }, { v: '1234M' }, { v: 'OL1234X' }];
    expect(expectColumnValuesToBeValidOpenLibraryId(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeSecurePasswords', () => {
  it('passes for secure passwords (defaults)', () => {
    const d = [{ v: 'P@ssw0rd!' }, { v: 'MyStr0ng#Pass' }];
    expect(expectColumnValuesToBeSecurePasswords(d, 'v').success).toBe(true);
  });

  it('fails for weak passwords', () => {
    const d = [{ v: 'password' }, { v: '12345678' }, { v: 'short' }];
    expect(expectColumnValuesToBeSecurePasswords(d, 'v').success).toBe(false);
  });

  it('respects custom options', () => {
    const d = [{ v: 'alllowercase' }];
    expect(
      expectColumnValuesToBeSecurePasswords(d, 'v', {
        require_uppercase: false,
        require_digit: false,
        require_special: false,
      }).success
    ).toBe(true);
  });
});

describe('expectColumnValuesToBeVectors', () => {
  it('passes for arrays of numbers', () => {
    const d = [{ v: [1, 2, 3] }, { v: [0.5, -1.5] }];
    expect(expectColumnValuesToBeVectors(d, 'v').success).toBe(true);
  });

  it('fails for non-arrays', () => {
    const d = [{ v: 'not array' }, { v: 42 }];
    expect(expectColumnValuesToBeVectors(d, 'v').success).toBe(false);
  });

  it('fails for empty arrays', () => {
    const d = [{ v: [] }];
    expect(expectColumnValuesToBeVectors(d, 'v').success).toBe(false);
  });

  it('fails for arrays with non-numbers', () => {
    const d = [{ v: [1, 'two', 3] }];
    expect(expectColumnValuesToBeVectors(d, 'v').success).toBe(false);
  });
});
