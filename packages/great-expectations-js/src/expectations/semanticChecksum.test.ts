import { describe, it, expect } from 'vitest';
import {
  expectColumnValuesToBeValidIsbn10,
  expectColumnValuesToBeValidIsbn13,
  expectColumnValuesToBeValidEan,
  expectColumnValuesToBeValidImei,
  expectColumnValuesToBeValidIsin,
  expectColumnValuesToBeValidMeid,
  expectColumnValuesToBeValidIsmn,
  expectColumnValuesToBeValidIsan,
  expectColumnValuesToBeValidBarcode,
  expectColumnValuesToBeGtinBaseUnit,
  expectColumnValuesToBeGtinVariableMeasureTradeItem,
} from './semanticChecksum.js';

describe('expectColumnValuesToBeValidIsbn10', () => {
  it('passes for valid ISBN-10', () => {
    const d = [{ v: '0-521-22151-X' }, { v: '0-521-29366-9' }, { v: '052122151X' }];
    expect(expectColumnValuesToBeValidIsbn10(d, 'v').success).toBe(true);
  });

  it('fails for invalid ISBN-10', () => {
    const d = [{ v: '0-521-22151-1' }, { v: 'not-isbn' }];
    expect(expectColumnValuesToBeValidIsbn10(d, 'v').success).toBe(false);
  });

  it('strips hyphens and spaces', () => {
    const d = [{ v: '0 521 22151 X' }];
    expect(expectColumnValuesToBeValidIsbn10(d, 'v').success).toBe(true);
  });
});

describe('expectColumnValuesToBeValidIsbn13', () => {
  it('passes for valid ISBN-13', () => {
    const d = [{ v: '978-3-16-148410-0' }, { v: '9783161484100' }];
    expect(expectColumnValuesToBeValidIsbn13(d, 'v').success).toBe(true);
  });

  it('fails for invalid ISBN-13', () => {
    const d = [{ v: '978-3-16-148410-1' }];
    expect(expectColumnValuesToBeValidIsbn13(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidEan', () => {
  it('passes for valid EAN-13', () => {
    const d = [{ v: '5901234123457' }];
    expect(expectColumnValuesToBeValidEan(d, 'v').success).toBe(true);
  });

  it('passes for valid EAN-8', () => {
    const d = [{ v: '73513537' }];
    expect(expectColumnValuesToBeValidEan(d, 'v').success).toBe(true);
  });

  it('fails for invalid EAN', () => {
    const d = [{ v: 'abcd' }, { v: '1234567' }];
    expect(expectColumnValuesToBeValidEan(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidImei', () => {
  it('passes for valid IMEI', () => {
    const d = [{ v: '35-686800-004141-8' }, { v: '354178036859789' }];
    expect(expectColumnValuesToBeValidImei(d, 'v').success).toBe(true);
  });

  it('fails for invalid IMEI', () => {
    const d = [{ v: '123456789012345' }];
    expect(expectColumnValuesToBeValidImei(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidIsin', () => {
  it('passes for valid ISIN', () => {
    const d = [{ v: 'US0378331005' }, { v: 'GB00BYXJL758' }];
    expect(expectColumnValuesToBeValidIsin(d, 'v').success).toBe(true);
  });

  it('fails for invalid ISIN', () => {
    const d = [{ v: 'US0000000001' }, { v: 'not-isin' }];
    expect(expectColumnValuesToBeValidIsin(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidMeid', () => {
  it('passes for valid MEID (14 hex digits)', () => {
    const d = [{ v: 'A0000000000000' }];
    expect(expectColumnValuesToBeValidMeid(d, 'v').success).toBe(true);
  });

  it('fails for invalid MEID', () => {
    const d = [{ v: '12345678901234' }, { v: 'ZZZZZZZZZZZZZZ' }];
    expect(expectColumnValuesToBeValidMeid(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidIsmn', () => {
  it('passes for valid ISMN', () => {
    const d = [{ v: '979-0-060-11561-5' }, { v: '9790060115615' }];
    expect(expectColumnValuesToBeValidIsmn(d, 'v').success).toBe(true);
  });

  it('fails for non-9790 prefix', () => {
    const d = [{ v: '9780060115615' }];
    expect(expectColumnValuesToBeValidIsmn(d, 'v').success).toBe(false);
  });

  it('fails for invalid checksum', () => {
    const d = [{ v: '9790060115616' }];
    expect(expectColumnValuesToBeValidIsmn(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidIsan', () => {
  it('passes for valid ISAN (16 hex)', () => {
    const d = [{ v: '0000-0001-8947-0000' }];
    expect(expectColumnValuesToBeValidIsan(d, 'v').success).toBe(true);
  });

  it('passes for 24 hex ISAN with version', () => {
    const d = [{ v: '0000-0001-8947-0000-8-0000-0000' }];
    expect(expectColumnValuesToBeValidIsan(d, 'v').success).toBe(true);
  });

  it('fails for non-hex', () => {
    const d = [{ v: 'ZZZZ-ZZZZ-ZZZZ-ZZZZ' }];
    expect(expectColumnValuesToBeValidIsan(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeValidBarcode', () => {
  it('passes for valid EAN-13', () => {
    const d = [{ v: '5901234123457' }];
    expect(expectColumnValuesToBeValidBarcode(d, 'v').success).toBe(true);
  });

  it('passes for valid UPC-A (12 digits)', () => {
    const d = [{ v: '012345678905' }];
    expect(expectColumnValuesToBeValidBarcode(d, 'v').success).toBe(true);
  });

  it('fails for invalid barcode', () => {
    const d = [{ v: '1234567890' }, { v: 'abcde' }];
    expect(expectColumnValuesToBeValidBarcode(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeGtinBaseUnit', () => {
  it('passes for valid GTIN-13', () => {
    const d = [{ v: '5901234123457' }];
    expect(expectColumnValuesToBeGtinBaseUnit(d, 'v').success).toBe(true);
  });

  it('passes for valid GTIN-14', () => {
    const d = [{ v: '15901234123454' }];
    expect(expectColumnValuesToBeGtinBaseUnit(d, 'v').success).toBe(true);
  });

  it('fails for invalid GTIN', () => {
    const d = [{ v: '5901234123450' }];
    expect(expectColumnValuesToBeGtinBaseUnit(d, 'v').success).toBe(false);
  });
});

describe('expectColumnValuesToBeGtinVariableMeasureTradeItem', () => {
  it('passes for GTIN-14 with indicator 9', () => {
    const d = [{ v: '95901234123450' }];
    expect(expectColumnValuesToBeGtinVariableMeasureTradeItem(d, 'v').success).toBe(true);
  });

  it('passes for GTIN-13 with prefix 20-29', () => {
    const d = [{ v: '2012345678903' }];
    expect(expectColumnValuesToBeGtinVariableMeasureTradeItem(d, 'v').success).toBe(true);
  });

  it('fails for non-variable-measure GTIN', () => {
    const d = [{ v: '5901234123457' }];
    expect(expectColumnValuesToBeGtinVariableMeasureTradeItem(d, 'v').success).toBe(false);
  });
});
