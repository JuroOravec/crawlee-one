import { createRequire } from 'node:module';

import type { AnySchema, ValidateFunction } from 'ajv';

import type { Dataset, ExpectationResult, MostlyOptions } from '../types.js';
import { buildColumnResult, getColumnValues } from '../utils.js';

const require = createRequire(import.meta.url);

let _ajv: { compile: (schema: AnySchema) => ValidateFunction } | null = null;

// Lazily load ajv
function getAjv() {
  if (_ajv) return _ajv;
  const mod = require('ajv') as { default?: new (o: object) => typeof _ajv };
  const Cls = mod.default ?? (mod as unknown as new (o: object) => typeof _ajv);
  _ajv = new Cls({ allErrors: true });
  return _ajv!;
}

export function expectColumnValuesToMatchJsonSchema(
  dataset: Dataset,
  column: string,
  schema: Record<string, unknown>,
  options?: MostlyOptions
): ExpectationResult {
  const ajv = getAjv();
  let validate: ValidateFunction;
  try {
    validate = ajv.compile(schema);
  } catch {
    return {
      success: false,
      unexpected_count: dataset.length,
      unexpected_percent: 1,
      unexpected_values: [],
    };
  }

  return buildColumnResult(getColumnValues(dataset, column), (v) => validate(v) === true, options);
}
