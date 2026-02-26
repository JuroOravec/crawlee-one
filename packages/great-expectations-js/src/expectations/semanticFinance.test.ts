import { describe, expect, it } from 'vitest';

import {
  expectColumnValuesToBeValidBic,
  expectColumnValuesToBeValidFormattedVat,
  expectColumnValuesToBeValidIban,
} from './semanticFinance.js';

describe('expectColumnValuesToBeValidIban', () => {
  it('passes for valid IBANs', () => {
    const d = [{ v: 'GB29 NWBK 6016 1331 9268 19' }, { v: 'DE89370400440532013000' }];
    expect(expectColumnValuesToBeValidIban(d, 'v').success).toBe(true);
  });

  it('fails for invalid check digits', () => {
    const d = [{ v: 'GB00 NWBK 6016 1331 9268 19' }];
    expect(expectColumnValuesToBeValidIban(d, 'v').success).toBe(false);
  });

  it('fails for wrong length for country', () => {
    const d = [{ v: 'DE8937040044053201' }];
    expect(expectColumnValuesToBeValidIban(d, 'v').success).toBe(false);
  });

  it('fails for non-IBAN strings', () => {
    const d = [{ v: 'not-an-iban' }, { v: '' }];
    expect(expectColumnValuesToBeValidIban(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidBic', () => {
  it('passes for valid 8-char BICs', () => {
    const d = [{ v: 'DEUTDEFF' }, { v: 'COBADEFF' }];
    expect(expectColumnValuesToBeValidBic(d, 'v').success).toBe(true);
  });

  it('passes for valid 11-char BICs', () => {
    const d = [{ v: 'DEUTDEFF500' }];
    expect(expectColumnValuesToBeValidBic(d, 'v').success).toBe(true);
  });

  it('fails for invalid BICs', () => {
    const d = [{ v: 'DEUT' }, { v: '12345678' }, { v: '' }];
    expect(expectColumnValuesToBeValidBic(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidFormattedVat', () => {
  it('passes for valid EU VAT numbers', () => {
    const d = [{ v: 'DE123456789' }, { v: 'FR12345678901' }, { v: 'GB123456789' }];
    expect(expectColumnValuesToBeValidFormattedVat(d, 'v').success).toBe(true);
  });

  it('fails for invalid VAT formats', () => {
    const d = [{ v: 'DE12345' }, { v: '123' }, { v: '' }];
    expect(expectColumnValuesToBeValidFormattedVat(d, 'v').success).toBe(false);
  });
});
