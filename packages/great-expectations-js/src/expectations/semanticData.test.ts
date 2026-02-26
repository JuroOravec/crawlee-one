import { describe, expect, it } from 'vitest';

import {
  expectColumnValuesToBeIsoLanguages,
  expectColumnValuesToBeValidCountry,
  expectColumnValuesToBeValidCurrencyCode,
  expectColumnValuesToBeValidHttpStatusName,
  expectColumnValuesToBeValidIanaTimezone,
  expectColumnValuesToBeValidIsoCountry,
  expectColumnValuesToBeValidMbti,
  expectColumnValuesToBeValidMime,
  expectColumnValuesToBeValidTld,
  expectColumnValuesToBeValidUsState,
  expectColumnValuesToBeValidUsStateAbbreviation,
  expectColumnValuesToBeValidUsStateOrTerritory,
  expectColumnValuesToBeValidUsStateOrTerritoryAbbreviation,
} from './semanticData.js';

describe('expectColumnValuesToBeValidIsoCountry', () => {
  it('passes for alpha-2 codes', () => {
    const d = [{ v: 'US' }, { v: 'DE' }, { v: 'JP' }];
    expect(expectColumnValuesToBeValidIsoCountry(d, 'v').success).toBe(true);
  });

  it('passes for alpha-3 codes', () => {
    const d = [{ v: 'USA' }, { v: 'DEU' }];
    expect(expectColumnValuesToBeValidIsoCountry(d, 'v').success).toBe(true);
  });

  it('fails for invalid codes', () => {
    const d = [{ v: 'ZZ' }, { v: 'XYZ' }];
    expect(expectColumnValuesToBeValidIsoCountry(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidCurrencyCode', () => {
  it('passes for valid codes', () => {
    const d = [{ v: 'USD' }, { v: 'EUR' }, { v: 'GBP' }];
    expect(expectColumnValuesToBeValidCurrencyCode(d, 'v').success).toBe(true);
  });

  it('fails for invalid codes', () => {
    const d = [{ v: 'XYZ' }, { v: 'EURO' }];
    expect(expectColumnValuesToBeValidCurrencyCode(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidIanaTimezone', () => {
  it('passes for valid timezones', () => {
    const d = [{ v: 'America/New_York' }, { v: 'Europe/London' }, { v: 'UTC' }];
    expect(expectColumnValuesToBeValidIanaTimezone(d, 'v').success).toBe(true);
  });

  it('fails for invalid timezones', () => {
    const d = [{ v: 'Not/A/Timezone' }, { v: 'Central' }];
    expect(expectColumnValuesToBeValidIanaTimezone(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeIsoLanguages', () => {
  it('passes for valid ISO 639-1 codes', () => {
    const d = [{ v: 'en' }, { v: 'fr' }, { v: 'de' }];
    expect(expectColumnValuesToBeIsoLanguages(d, 'v').success).toBe(true);
  });

  it('fails for invalid codes', () => {
    const d = [{ v: 'xx' }, { v: 'english' }];
    expect(expectColumnValuesToBeIsoLanguages(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidHttpStatusName', () => {
  it('passes for valid status names', () => {
    const d = [{ v: 'OK' }, { v: 'Not Found' }, { v: 'Internal Server Error' }];
    expect(expectColumnValuesToBeValidHttpStatusName(d, 'v').success).toBe(true);
  });

  it('fails for invalid status names', () => {
    const d = [{ v: 'super error' }, { v: '404' }];
    expect(expectColumnValuesToBeValidHttpStatusName(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidMime', () => {
  it('passes for valid MIME types', () => {
    const d = [{ v: 'text/html' }, { v: 'application/json' }, { v: 'image/png' }];
    expect(expectColumnValuesToBeValidMime(d, 'v').success).toBe(true);
  });

  it('fails for invalid MIME types', () => {
    const d = [{ v: 'html' }, { v: 'foo/bar/baz' }];
    expect(expectColumnValuesToBeValidMime(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidMbti', () => {
  it('passes for valid types', () => {
    const d = [{ v: 'INTJ' }, { v: 'enfp' }, { v: 'ISTP' }];
    expect(expectColumnValuesToBeValidMbti(d, 'v').success).toBe(true);
  });

  it('fails for invalid types', () => {
    const d = [{ v: 'ABCD' }, { v: 'introvert' }];
    expect(expectColumnValuesToBeValidMbti(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidTld', () => {
  it('passes for valid TLDs (with or without leading dot)', () => {
    const d = [{ v: 'com' }, { v: '.org' }, { v: 'basketball' }];
    expect(expectColumnValuesToBeValidTld(d, 'v').success).toBe(true);
  });

  it('fails for invalid TLDs', () => {
    const d = [{ v: 'notarealtld' }, { v: 'x' }, { v: 'mee' }];
    expect(expectColumnValuesToBeValidTld(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidUsState', () => {
  it('passes for abbreviations', () => {
    const d = [{ v: 'CA' }, { v: 'NY' }, { v: 'TX' }];
    expect(expectColumnValuesToBeValidUsState(d, 'v').success).toBe(true);
  });

  it('passes for full names', () => {
    const d = [{ v: 'California' }, { v: 'new york' }];
    expect(expectColumnValuesToBeValidUsState(d, 'v').success).toBe(true);
  });

  it('fails for invalid values', () => {
    const d = [{ v: 'XX' }, { v: 'Atlantis' }];
    expect(expectColumnValuesToBeValidUsState(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidUsStateAbbreviation', () => {
  it('passes for valid abbreviations', () => {
    const d = [{ v: 'CA' }, { v: 'ny' }];
    expect(expectColumnValuesToBeValidUsStateAbbreviation(d, 'v').success).toBe(true);
  });

  it('rejects full names', () => {
    const d = [{ v: 'California' }];
    expect(expectColumnValuesToBeValidUsStateAbbreviation(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidUsStateOrTerritory', () => {
  it('includes territories', () => {
    const d = [{ v: 'PR' }, { v: 'GU' }, { v: 'CA' }];
    expect(expectColumnValuesToBeValidUsStateOrTerritory(d, 'v').success).toBe(true);
  });
});

describe('expectColumnValuesToBeValidUsStateOrTerritoryAbbreviation', () => {
  it('passes for territory abbreviations', () => {
    const d = [{ v: 'DC' }, { v: 'VI' }];
    expect(expectColumnValuesToBeValidUsStateOrTerritoryAbbreviation(d, 'v').success).toBe(true);
  });
});

describe('expectColumnValuesToBeValidCountry', () => {
  it('passes for ISO codes', () => {
    const d = [{ v: 'US' }, { v: 'DEU' }];
    expect(expectColumnValuesToBeValidCountry(d, 'v').success).toBe(true);
  });

  it('passes for official and alias names from i18n', () => {
    const d = [{ v: 'USA' }, { v: 'UK' }, { v: 'United Kingdom' }];
    expect(expectColumnValuesToBeValidCountry(d, 'v').success).toBe(true);
  });

  it('fails for invalid countries', () => {
    const d = [{ v: 'Narnia' }, { v: 'Atlantis' }];
    expect(expectColumnValuesToBeValidCountry(d, 'v').success).toBe(false);
  });
});
