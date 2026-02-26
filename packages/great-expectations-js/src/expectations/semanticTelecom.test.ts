import { describe, expect, it } from 'vitest';

import {
  expectColumnValuesToBeValidImsi,
  expectColumnValuesToBeValidImsiCountryCode,
  expectColumnValuesToBeValidPhonenumber,
} from './semanticTelecom.js';

describe('expectColumnValuesToBeValidImsi', () => {
  it('passes for valid 15-digit IMSI', () => {
    const d = [{ v: '310260000000000' }, { v: '234150999999999' }];
    expect(expectColumnValuesToBeValidImsi(d, 'v').success).toBe(true);
  });

  it('fails for wrong length', () => {
    const d = [{ v: '12345' }, { v: '1234567890123456' }];
    expect(expectColumnValuesToBeValidImsi(d, 'v').success).toBe(false);
  });

  it('fails for non-digits', () => {
    const d = [{ v: '31026000000000a' }];
    expect(expectColumnValuesToBeValidImsi(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidImsiCountryCode', () => {
  it('passes when MCC matches country', () => {
    const d = [{ v: '310260000000000' }];
    expect(expectColumnValuesToBeValidImsiCountryCode(d, 'v', 'US').success).toBe(true);
  });

  it('fails when MCC does not match country', () => {
    const d = [{ v: '310260000000000' }];
    expect(expectColumnValuesToBeValidImsiCountryCode(d, 'v', 'GB').success).toBe(false);
  });

  it('passes for GB IMSI with GB country', () => {
    const d = [{ v: '234150999999999' }];
    expect(expectColumnValuesToBeValidImsiCountryCode(d, 'v', 'GB').success).toBe(true);
  });
});

describe('expectColumnValuesToBeValidPhonenumber', () => {
  it('passes for valid phone numbers', () => {
    const d = [{ v: '+14155552671' }, { v: '+442071234567' }];
    expect(expectColumnValuesToBeValidPhonenumber(d, 'v').success).toBe(true);
  });

  it('fails for invalid phone numbers', () => {
    const d = [{ v: 'not-a-phone' }, { v: '123' }, { v: '' }];
    expect(expectColumnValuesToBeValidPhonenumber(d, 'v').success).toBe(false);
  });
});
