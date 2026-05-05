/**
 * Declarative expectation types for defining expectations in JSON-serializable format.
 *
 * Each expectation is a discriminated union variant: the `expectation` name
 * restricts which `params` are allowed. Level is implied by the key in
 * DatasetExpectations (field, multi-field, row, dataset, other).
 *
 * Example (with row shape for column autocomplete):
 *
 * ```ts
 * interface MyRow { offerId: string; offerUrl: string; supplierUrl: string }
 * const expectations: DatasetExpectations<MyRow> = {
 *   field: [
 *     { expectation: 'expectColumnToExist', params: { column: 'offerId' } },
 *     { expectation: 'expectColumnValuesToBeUnique', params: { column: 'offerId' } },
 *   ],
 * };
 * ```
 */

/** Level keys for DatasetExpectations. */
export type ExpectationLevel = 'field' | 'multi-field' | 'row' | 'dataset' | 'other';

/**
 * Generic param types for declarative expectations.
 *
 * TRow = shape of one row in the dataset. When provided, `column` / `columnA` / `columnB` /
 * `columns` are constrained to keys of TRow for autocomplete.
 */
type TRowDefault = Record<string, unknown>;

/** Shared param for many field expectations: column + optional mostly. */
interface ColumnMostly<TRow extends object = TRowDefault> {
  column: keyof TRow;
  mostly?: number;
}

/** Params for expectations with value set. */
interface ColumnValueSet<TRow extends object = TRowDefault> {
  column: keyof TRow;
  valueSet: unknown[];
  mostly?: number;
}

/** Params for expectations with numeric range. */
interface MinMax {
  min_value?: number;
  max_value?: number;
}

/** Params for between (column + range). */
interface ColumnBetween<TRow extends object = TRowDefault> extends ColumnMostly<TRow> {
  min_value?: number;
  max_value?: number;
  strict_min?: boolean;
  strict_max?: boolean;
}

/** Params for regex expectations. */
interface ColumnRegex<TRow extends object = TRowDefault> extends ColumnMostly<TRow> {
  regex: string;
}

/** Params for strftime format. */
interface ColumnStrftime<TRow extends object = TRowDefault> extends ColumnMostly<TRow> {
  strftime_format: string;
}

/** Params for JSON Schema. */
interface ColumnSchema<TRow extends object = TRowDefault> extends ColumnMostly<TRow> {
  schema: Record<string, unknown>;
}

/** Params for quantile ranges. */
interface ColumnQuantileRanges<TRow extends object = TRowDefault> {
  column: keyof TRow;
  quantile_ranges: {
    quantiles: number[];
    value_ranges: [number | null, number | null][];
  };
}

/** Params for z-scores. */
interface ColumnZScore<TRow extends object = TRowDefault> extends ColumnMostly<TRow> {
  threshold: number;
  double_sided?: boolean;
}

/** Params for IP in network. */
interface ColumnNetwork<TRow extends object = TRowDefault> extends ColumnMostly<TRow> {
  network: string;
}

/** Params for secure passwords. */
interface ColumnPassword<TRow extends object = TRowDefault> extends ColumnMostly<TRow> {
  require_lowercase?: boolean;
  require_uppercase?: boolean;
  require_digit?: boolean;
  require_special?: boolean;
  min_length?: number;
}

/** Params for IMSI country code. */
interface ColumnImsiCountry<TRow extends object = TRowDefault> extends ColumnMostly<TRow> {
  country_code: string;
}

/** Params for column pair. */
interface ColumnPair<TRow extends object = TRowDefault> {
  columnA: keyof TRow;
  columnB: keyof TRow;
  mostly?: number;
}

/** Params for column pair with or_equal. */
interface ColumnPairOrEqual<TRow extends object = TRowDefault> extends ColumnPair<TRow> {
  or_equal?: boolean;
}

/** Params for column pair in set. */
interface ColumnPairInSet<TRow extends object = TRowDefault> extends ColumnPair<TRow> {
  pairSet: [unknown, unknown][];
}

/** Params for compound/multicolumn. */
interface ColumnsParam<TRow extends object = TRowDefault> {
  columns: (keyof TRow)[];
  mostly?: number;
}

/** Params for multicolumn sum. */
interface MulticolumnSum<TRow extends object = TRowDefault> extends ColumnsParam<TRow> {
  sumTotal: number;
}

// ---------------------------------------------------------------------------
// Dataset-level
// ---------------------------------------------------------------------------

export type DatasetLevelDeclaredExpectation<TRow extends object = TRowDefault> =
  | { expectation: 'expectTableRowCountToEqual'; params: { value: number } }
  | { expectation: 'expectTableRowCountToBeBetween'; params: MinMax }
  | { expectation: 'expectTableColumnCountToEqual'; params: { value: number } }
  | { expectation: 'expectTableColumnCountToBeBetween'; params: MinMax }
  | { expectation: 'expectTableColumnsToMatchOrderedList'; params: { columnList: (keyof TRow)[] } }
  | { expectation: 'expectTableColumnsToMatchSet'; params: { columnSet: (keyof TRow)[] } };

// ---------------------------------------------------------------------------
// Field-level
// ---------------------------------------------------------------------------

// prettier-ignore
export type FieldLevelDeclaredExpectation<TRow extends object = TRowDefault> =
  | { expectation: 'expectColumnToExist'; params: { column: keyof TRow } }
  | { expectation: 'expectColumnValuesToBeNull'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToNotBeNull'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeUnique'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeInSet'; params: ColumnValueSet<TRow> }
  | { expectation: 'expectColumnValuesToNotBeInSet'; params: ColumnValueSet<TRow> }
  | { expectation: 'expectColumnDistinctValuesToBeInSet'; params: { column: keyof TRow; valueSet: unknown[] } }
  | { expectation: 'expectColumnDistinctValuesToContainSet'; params: { column: keyof TRow; valueSet: unknown[] } }
  | { expectation: 'expectColumnDistinctValuesToEqualSet'; params: { column: keyof TRow; valueSet: unknown[] } }
  | { expectation: 'expectColumnValuesToBeBetween'; params: ColumnBetween<TRow> }
  | { expectation: 'expectColumnValuesToBeIncreasing'; params: ColumnMostly<TRow> & { strictly?: boolean } }
  | { expectation: 'expectColumnValuesToBeDecreasing'; params: ColumnMostly<TRow> & { strictly?: boolean } }
  | { expectation: 'expectColumnValueLengthsToBeBetween'; params: ColumnMostly<TRow> & { min_value?: number; max_value?: number } }
  | { expectation: 'expectColumnValueLengthsToEqual'; params: ColumnMostly<TRow> & { value: number } }
  | { expectation: 'expectColumnValuesToBeOfType'; params: ColumnMostly<TRow> & { type: string } }
  | { expectation: 'expectColumnValuesToBeInTypeList'; params: ColumnMostly<TRow> & { typeList: string[] } }
  | { expectation: 'expectColumnValuesToMatchRegex'; params: ColumnRegex<TRow> }
  | { expectation: 'expectColumnValuesToNotMatchRegex'; params: ColumnRegex<TRow> }
  | { expectation: 'expectColumnValuesToMatchRegexList'; params: ColumnMostly<TRow> & { regexList: string[]; match_on?: 'any' | 'all' } }
  | { expectation: 'expectColumnValuesToNotMatchRegexList'; params: ColumnMostly<TRow> & { regexList: string[] } }
  | { expectation: 'expectColumnValuesToBeJsonParseable'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeDateutilParseable'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToMatchStrftimeFormat'; params: ColumnStrftime<TRow> }
  | { expectation: 'expectColumnMaxToBeBetween'; params: ColumnMostly<TRow> & MinMax }
  | { expectation: 'expectColumnMinToBeBetween'; params: ColumnMostly<TRow> & MinMax }
  | { expectation: 'expectColumnMeanToBeBetween'; params: ColumnMostly<TRow> & MinMax }
  | { expectation: 'expectColumnMedianToBeBetween'; params: ColumnMostly<TRow> & MinMax }
  | { expectation: 'expectColumnSumToBeBetween'; params: ColumnMostly<TRow> & MinMax }
  | { expectation: 'expectColumnStdevToBeBetween'; params: ColumnMostly<TRow> & MinMax }
  | { expectation: 'expectColumnUniqueValueCountToBeBetween'; params: ColumnMostly<TRow> & MinMax }
  | { expectation: 'expectColumnMostCommonValueToBeInSet'; params: ColumnValueSet<TRow> }
  | { expectation: 'expectColumnProportionOfNonNullValuesToBeBetween'; params: ColumnMostly<TRow> & MinMax }
  | { expectation: 'expectColumnProportionOfUniqueValuesToBeBetween'; params: ColumnMostly<TRow> & MinMax }
  | { expectation: 'expectColumnQuantileValuesToBeBetween'; params: ColumnQuantileRanges<TRow> }
  | { expectation: 'expectColumnValueZScoresToBeLessThan'; params: ColumnZScore<TRow> }
  | { expectation: 'expectColumnValuesToMatchLikePattern'; params: ColumnMostly<TRow> & { like_pattern: string } }
  | { expectation: 'expectColumnValuesToNotMatchLikePattern'; params: ColumnMostly<TRow> & { like_pattern: string } }
  | { expectation: 'expectColumnValuesToMatchLikePatternList'; params: ColumnMostly<TRow> & { like_pattern_list: string[] } }
  | { expectation: 'expectColumnValuesToNotMatchLikePatternList'; params: ColumnMostly<TRow> & { like_pattern_list: string[] } }
  | { expectation: 'expectColumnValuesToMatchJsonSchema'; params: ColumnSchema<TRow> }
  // Semantic - format
  | { expectation: 'expectColumnValuesToBeValidUuid'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToContainValidEmail'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeAscii'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeSlug'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidHexColor'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidMd5'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidSha1'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidBase64'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidHashtag'; params: ColumnMostly<TRow> }
  // Semantic - network
  | { expectation: 'expectColumnValuesToBeValidUrls'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidIpv4'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidIpv6'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidMac'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidHttpMethod'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidHttpMethods'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidHttpStatusCode'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidTcpPort'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidUdpPort'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidDate'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeWeekday'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesIpAddressInNetwork'; params: ColumnNetwork<TRow> }
  | { expectation: 'expectColumnValuesToBePrivateIpV4'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBePrivateIpv4Class'; params: ColumnMostly<TRow> & { ip_class?: 'A' | 'B' | 'C' } }
  | { expectation: 'expectColumnValuesToBePrivateIpV6'; params: ColumnMostly<TRow> }
  // Semantic - checksum, format extended, math, data-table, finance, telecom (column + mostly)
  | { expectation: 'expectColumnValuesToBeValidIsbn10'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidIsbn13'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidEan'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidImei'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidIsin'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidMeid'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidIsmn'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidIsan'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidBarcode'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeGtinBaseUnit'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeGtinVariableMeasureTradeItem'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidSsn'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidImdbId'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidDoi'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidOrcid'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidArxivId'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidPubmedId'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidRomanNumeral'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidBase32'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeXmlParseable'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidTemperature'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidPrice'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidOpenLibraryId'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeSecurePasswords'; params: ColumnPassword<TRow> }
  | { expectation: 'expectColumnValuesToBeVectors'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBePrimeNumber'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeFibonacciNumber'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidLeapYear'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidPronicNumber'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidPowerfulNumber'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidSemiprime'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidSphenicNumber'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidSquareFreeNumber'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidIsoCountry'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidCurrencyCode'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidIanaTimezone'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeIsoLanguages'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidHttpStatusName'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidMime'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidMbti'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidTld'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidUsState'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidUsStateAbbreviation'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidUsStateOrTerritory'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidUsStateOrTerritoryAbbreviation'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidCountry'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidIban'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidBic'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidFormattedVat'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidImsi'; params: ColumnMostly<TRow> }
  | { expectation: 'expectColumnValuesToBeValidImsiCountryCode'; params: ColumnImsiCountry<TRow> }
  | { expectation: 'expectColumnValuesToBeValidPhonenumber'; params: ColumnMostly<TRow> };

// ---------------------------------------------------------------------------
// Multi-field level
// ---------------------------------------------------------------------------

// prettier-ignore
export type MultiFieldLevelDeclaredExpectation<TRow extends object = TRowDefault> =
  | { expectation: 'expectColumnPairValuesToBeEqual'; params: ColumnPair<TRow> }
  | { expectation: 'expectColumnPairValuesAToBeGreaterThanB'; params: ColumnPairOrEqual<TRow> }
  | { expectation: 'expectColumnPairValuesToBeInSet'; params: ColumnPairInSet<TRow> }
  | { expectation: 'expectCompoundColumnsToBeUnique'; params: { columns: (keyof TRow)[] } };

// ---------------------------------------------------------------------------
// Row level
// ---------------------------------------------------------------------------

// prettier-ignore
export type RowLevelDeclaredExpectation<TRow extends object = TRowDefault> =
  | { expectation: 'expectSelectColumnValuesToBeUniqueWithinRecord'; params: ColumnsParam<TRow> }
  | { expectation: 'expectMulticolumnSumToEqual'; params: MulticolumnSum<TRow> };

// ---------------------------------------------------------------------------
// Union and DatasetExpectations
// ---------------------------------------------------------------------------

/** Declared expectation: discriminated union by expectation name. Level implied by DatasetExpectations key. */
export type DeclaredExpectation<TRow extends object = TRowDefault> =
  | DatasetLevelDeclaredExpectation<TRow>
  | FieldLevelDeclaredExpectation<TRow>
  | MultiFieldLevelDeclaredExpectation<TRow>
  | RowLevelDeclaredExpectation<TRow>;

/** All valid expectation names (for typing EXPECTATION_REGISTRY keys). */
export type ExpectationName = DeclaredExpectation['expectation'];

/**
 * Dataset expectations grouped by level.
 *
 * Pass TRow = shape of one row to get column autocomplete (e.g. column: 'offerId' from keys of TRow).
 */
export interface DatasetExpectations<TRow extends object = TRowDefault> {
  field?: FieldLevelDeclaredExpectation<TRow>[];
  'multi-field'?: MultiFieldLevelDeclaredExpectation<TRow>[];
  row?: RowLevelDeclaredExpectation<TRow>[];
  dataset?: DatasetLevelDeclaredExpectation<TRow>[];
  other?: DeclaredExpectation<TRow>[];
}
