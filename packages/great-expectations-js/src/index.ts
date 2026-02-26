/* eslint-disable simple-import-sort/exports */

export type { Dataset, ExpectationResult, MostlyOptions, QuantileResult } from './types.js';
export type { BetweenOptions } from './expectations/columnRange.js';
export type { QuantileRanges } from './expectations/columnStats.js';
export {
  // Table-level
  expectTableRowCountToEqual,
  expectTableRowCountToBeBetween,
  expectTableColumnCountToEqual,
  expectTableColumnCountToBeBetween,
  expectTableColumnsToMatchOrderedList,
  expectTableColumnsToMatchSet,
  expectTableRowCountToEqualOtherTable,
} from './expectations/table.js';

export {
  // Column — existence, null, uniqueness
  expectColumnToExist,
  expectColumnValuesToBeNull,
  expectColumnValuesToNotBeNull,
  expectColumnValuesToBeUnique,
  expectCompoundColumnsToBeUnique,
  expectMulticolumnValuesToBeUnique,
  expectSelectColumnValuesToBeUniqueWithinRecord,
} from './expectations/columnExistence.js';

export {
  // Column — set membership
  expectColumnValuesToBeInSet,
  expectColumnValuesToNotBeInSet,
  expectColumnDistinctValuesToBeInSet,
  expectColumnDistinctValuesToContainSet,
  expectColumnDistinctValuesToEqualSet,
} from './expectations/columnSet.js';

export {
  // Column — ranges, ordering, lengths, types
  expectColumnValuesToBeBetween,
  expectColumnValuesToBeIncreasing,
  expectColumnValuesToBeDecreasing,
  expectColumnValueLengthsToBeBetween,
  expectColumnValueLengthsToEqual,
  expectColumnValuesToBeOfType,
  expectColumnValuesToBeInTypeList,
} from './expectations/columnRange.js';

export {
  // Column — regex and parsing
  expectColumnValuesToMatchRegex,
  expectColumnValuesToNotMatchRegex,
  expectColumnValuesToMatchRegexList,
  expectColumnValuesToNotMatchRegexList,
  expectColumnValuesToBeJsonParseable,
  expectColumnValuesToBeDateutilParseable,
  expectColumnValuesToMatchStrftimeFormat,
} from './expectations/columnRegex.js';

export {
  // Column — aggregates
  expectColumnMaxToBeBetween,
  expectColumnMinToBeBetween,
  expectColumnMeanToBeBetween,
  expectColumnMedianToBeBetween,
  expectColumnSumToBeBetween,
  expectColumnStdevToBeBetween,
  expectColumnUniqueValueCountToBeBetween,
  expectColumnMostCommonValueToBeInSet,
  expectColumnProportionOfNonNullValuesToBeBetween,
  expectColumnProportionOfUniqueValuesToBeBetween,
} from './expectations/columnAggregate.js';

export {
  // Column — pair and multicolumn
  expectColumnPairValuesToBeEqual,
  expectColumnPairValuesAToBeGreaterThanB,
  expectColumnPairValuesToBeInSet,
  expectMulticolumnSumToEqual,
} from './expectations/columnPair.js';

export {
  // Semantic — format
  expectColumnValuesToBeValidUuid,
  expectColumnValuesToContainValidEmail,
  expectColumnValuesToBeAscii,
  expectColumnValuesToBeSlug,
  expectColumnValuesToBeValidHexColor,
  expectColumnValuesToBeValidMd5,
  expectColumnValuesToBeValidSha1,
  expectColumnValuesToBeValidBase64,
  expectColumnValuesToBeValidHashtag,

  // Semantic — network
  expectColumnValuesToBeValidUrls,
  expectColumnValuesToBeValidIpv4,
  expectColumnValuesToBeValidIpv6,
  expectColumnValuesToBeValidMac,
  expectColumnValuesToBeValidHttpMethod,
  expectColumnValuesToBeValidHttpMethods,
  expectColumnValuesToBeValidHttpStatusCode,
  expectColumnValuesToBeValidTcpPort,
  expectColumnValuesToBeValidUdpPort,

  // Semantic — datetime
  expectColumnValuesToBeValidDate,
  expectColumnValuesToBeWeekday,
} from './expectations/semantic.js';

export {
  // Column — LIKE patterns
  likeToRegex,
  expectColumnValuesToMatchLikePattern,
  expectColumnValuesToNotMatchLikePattern,
  expectColumnValuesToMatchLikePatternList,
  expectColumnValuesToNotMatchLikePatternList,
} from './expectations/columnLike.js';

export {
  // Column — quantiles, z-scores
  expectColumnQuantileValuesToBeBetween,
  expectColumnValueZScoresToBeLessThan,
} from './expectations/columnStats.js';

export {
  // Semantic — checksum validators
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
} from './expectations/semanticChecksum.js';

export {
  // Semantic — format validators
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
} from './expectations/semanticFormat.js';
export type { PasswordOptions } from './expectations/semanticFormat.js';

export {
  // Semantic — math validators
  expectColumnValuesToBePrimeNumber,
  expectColumnValuesToBeFibonacciNumber,
  expectColumnValuesToBeValidLeapYear,
  expectColumnValuesToBeValidPronicNumber,
  expectColumnValuesToBeValidPowerfulNumber,
  expectColumnValuesToBeValidSemiprime,
  expectColumnValuesToBeValidSphenicNumber,
  expectColumnValuesToBeValidSquareFreeNumber,
} from './expectations/semanticMath.js';

export {
  // Semantic — data-table validators
  expectColumnValuesToBeValidIsoCountry,
  expectColumnValuesToBeValidCurrencyCode,
  expectColumnValuesToBeValidIanaTimezone,
  expectColumnValuesToBeIsoLanguages,
  expectColumnValuesToBeValidHttpStatusName,
  expectColumnValuesToBeValidMime,
  expectColumnValuesToBeValidMbti,
  expectColumnValuesToBeValidTld,
  expectColumnValuesToBeValidUsState,
  expectColumnValuesToBeValidUsStateAbbreviation,
  expectColumnValuesToBeValidUsStateOrTerritory,
  expectColumnValuesToBeValidUsStateOrTerritoryAbbreviation,
  expectColumnValuesToBeValidCountry,
} from './expectations/semanticData.js';

export {
  // Semantic — private IP validators
  expectColumnValuesToBePrivateIpV4,
  expectColumnValuesToBePrivateIpv4Class,
  expectColumnValuesToBePrivateIpV6,
  expectColumnValuesIpAddressInNetwork,
} from './expectations/semanticNetwork.js';

export {
  // Semantic — finance validators
  expectColumnValuesToBeValidIban,
  expectColumnValuesToBeValidBic,
  expectColumnValuesToBeValidFormattedVat,
} from './expectations/semanticFinance.js';

export {
  // Semantic — telecom validators
  expectColumnValuesToBeValidImsi,
  expectColumnValuesToBeValidImsiCountryCode,
  expectColumnValuesToBeValidPhonenumber,
} from './expectations/semanticTelecom.js';

export {
  // Column — JSON Schema validation
  expectColumnValuesToMatchJsonSchema,
} from './expectations/columnSchema.js';

// Utilities (useful for building custom expectations)
export {
  MAX_UNEXPECTED_SAMPLE,
  getColumnValues,
  getColumnNames,
  buildColumnResult,
  buildTableResult,
  buildRowResult,
} from './utils.js';

// Declarative expectations
export type {
  ExpectationLevel,
  ExpectationName,
  DeclaredExpectation,
  DatasetExpectations,
  DatasetLevelDeclaredExpectation,
  FieldLevelDeclaredExpectation,
  MultiFieldLevelDeclaredExpectation,
  RowLevelDeclaredExpectation,
} from './declarative/declaredExpectations.js';
export { EXPECTATION_REGISTRY, type RegistryEntry } from './declarative/registry.js';
export {
  runExpectations,
  type DatasetExpectationsInput,
  type RunExpectationResult,
  type RunExpectationsOptions,
} from './declarative/runner.js';
