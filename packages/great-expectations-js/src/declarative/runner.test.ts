import { describe, it, expect } from 'vitest';

import { runExpectations } from './runner.js';
import type { DatasetExpectations } from './declaredExpectations.js';

interface MyRow {
  offerId: string;
  offerUrl: string;
  supplierUrl: string;
  updatetime: string;
}

describe('runExpectations', () => {
  const validData: MyRow[] = [
    {
      offerId: '1',
      offerUrl: 'https://example.com/1',
      supplierUrl: 'https://foo.com',
      updatetime: '2025-01-15',
    },
    {
      offerId: '2',
      offerUrl: 'https://example.com/2',
      supplierUrl: 'https://bar.com',
      updatetime: '2025-02-20',
    },
  ];

  it('runs dataset-level expectations', () => {
    const expectations: DatasetExpectations<MyRow> = {
      dataset: [
        { expectation: 'expectTableRowCountToBeBetween', params: { min_value: 1, max_value: 10 } },
      ],
    };
    const results = runExpectations(validData, expectations);
    expect(results).toHaveLength(1);
    expect(results[0]!.level).toBe('dataset');
    expect(results[0]!.expectation).toBe('expectTableRowCountToBeBetween');
    expect(results[0]!.result.success).toBe(true);
  });

  it('runs field-level expectations', () => {
    const expectations: DatasetExpectations = {
      field: [
        { expectation: 'expectColumnToExist', params: { column: 'offerId' } },
        { expectation: 'expectColumnValuesToBeUnique', params: { column: 'offerId' } },
      ],
    };
    const results = runExpectations(validData, expectations);
    expect(results).toHaveLength(2);
    expect(results.every((r) => r.result.success)).toBe(true);
  });

  it('reports failure when expectation fails', () => {
    const expectations: DatasetExpectations<MyRow> = {
      field: [{ expectation: 'expectColumnValuesToNotBeNull', params: { column: 'offerUrl' } }],
    };
    const dataWithNull = [{ ...validData[0], offerUrl: null }, validData[1]];
    const results = runExpectations(dataWithNull, expectations);
    expect(results).toHaveLength(1);
    expect(results[0]!.result.success).toBe(false);
    expect(results[0]!.result.unexpected_count).toBe(1);
  });

  it('throws on unknown expectation by default', () => {
    const expectations: DatasetExpectations<MyRow> = {
      field: [{ expectation: 'expectUnknownThing', params: {} } as any],
    };
    expect(() => runExpectations(validData, expectations)).toThrow('Unknown expectation');
  });

  it('continues on error when continueOnError is true', () => {
    const expectations: DatasetExpectations<MyRow> = {
      field: [{ expectation: 'expectUnknownThing', params: {} } as any],
    };
    const results = runExpectations(validData, expectations, { continueOnError: true });
    expect(results).toHaveLength(1);
    expect(results[0]!.result.success).toBe(false);
  });

  it('runs multi-field expectations', () => {
    const dataWithNums = [
      { a: 10, b: 5 },
      { a: 20, b: 15 },
    ] as Record<string, unknown>[];
    const expectations: DatasetExpectations = {
      'multi-field': [
        {
          expectation: 'expectColumnPairValuesAToBeGreaterThanB',
          params: { columnA: 'a', columnB: 'b' },
        },
      ],
    };
    const results = runExpectations(dataWithNums, expectations);
    expect(results).toHaveLength(1);
    expect(results[0]!.result.success).toBe(true);
  });

  it('ignores empty level lists', () => {
    const expectations: DatasetExpectations<MyRow> = {
      dataset: [{ expectation: 'expectTableRowCountToBeBetween', params: { min_value: 1 } }],
      field: [],
    };
    const results = runExpectations(validData, expectations);
    expect(results).toHaveLength(1);
  });
});
