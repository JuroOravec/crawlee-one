/**
 * Registry mapping expectation names to functions and levels.
 * Used by the runner to dispatch declared expectations.
 */

import {
  expectColumnMaxToBeBetween,
  expectColumnMeanToBeBetween,
  expectColumnMedianToBeBetween,
  expectColumnMinToBeBetween,
  expectColumnMostCommonValueToBeInSet,
  expectColumnProportionOfNonNullValuesToBeBetween,
  expectColumnProportionOfUniqueValuesToBeBetween,
  expectColumnStdevToBeBetween,
  expectColumnSumToBeBetween,
  expectColumnUniqueValueCountToBeBetween,
} from '../expectations/columnAggregate.js';
import {
  expectColumnToExist,
  expectColumnValuesToBeNull,
  expectColumnValuesToBeUnique,
  expectColumnValuesToNotBeNull,
  expectCompoundColumnsToBeUnique,
  expectSelectColumnValuesToBeUniqueWithinRecord,
} from '../expectations/columnExistence.js';
import {
  expectColumnValuesToMatchLikePattern,
  expectColumnValuesToMatchLikePatternList,
  expectColumnValuesToNotMatchLikePattern,
  expectColumnValuesToNotMatchLikePatternList,
} from '../expectations/columnLike.js';
import {
  expectColumnPairValuesAToBeGreaterThanB,
  expectColumnPairValuesToBeEqual,
  expectColumnPairValuesToBeInSet,
  expectMulticolumnSumToEqual,
} from '../expectations/columnPair.js';
import {
  expectColumnValueLengthsToBeBetween,
  expectColumnValueLengthsToEqual,
  expectColumnValuesToBeBetween,
  expectColumnValuesToBeDecreasing,
  expectColumnValuesToBeIncreasing,
  expectColumnValuesToBeInTypeList,
  expectColumnValuesToBeOfType,
} from '../expectations/columnRange.js';
import {
  expectColumnValuesToBeDateutilParseable,
  expectColumnValuesToBeJsonParseable,
  expectColumnValuesToMatchRegex,
  expectColumnValuesToMatchRegexList,
  expectColumnValuesToMatchStrftimeFormat,
  expectColumnValuesToNotMatchRegex,
  expectColumnValuesToNotMatchRegexList,
} from '../expectations/columnRegex.js';
import { expectColumnValuesToMatchJsonSchema } from '../expectations/columnSchema.js';
import {
  expectColumnDistinctValuesToBeInSet,
  expectColumnDistinctValuesToContainSet,
  expectColumnDistinctValuesToEqualSet,
  expectColumnValuesToBeInSet,
  expectColumnValuesToNotBeInSet,
} from '../expectations/columnSet.js';
import {
  expectColumnQuantileValuesToBeBetween,
  expectColumnValueZScoresToBeLessThan,
} from '../expectations/columnStats.js';
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
} from '../expectations/semantic.js';
import {
  expectColumnValuesToBeGtinBaseUnit,
  expectColumnValuesToBeGtinVariableMeasureTradeItem,
  expectColumnValuesToBeValidBarcode,
  expectColumnValuesToBeValidEan,
  expectColumnValuesToBeValidImei,
  expectColumnValuesToBeValidIsan,
  expectColumnValuesToBeValidIsbn10,
  expectColumnValuesToBeValidIsbn13,
  expectColumnValuesToBeValidIsin,
  expectColumnValuesToBeValidIsmn,
  expectColumnValuesToBeValidMeid,
} from '../expectations/semanticChecksum.js';
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
} from '../expectations/semanticData.js';
import {
  expectColumnValuesToBeValidBic,
  expectColumnValuesToBeValidFormattedVat,
  expectColumnValuesToBeValidIban,
} from '../expectations/semanticFinance.js';
import {
  expectColumnValuesToBeSecurePasswords,
  expectColumnValuesToBeValidArxivId,
  expectColumnValuesToBeValidBase32,
  expectColumnValuesToBeValidDoi,
  expectColumnValuesToBeValidImdbId,
  expectColumnValuesToBeValidOpenLibraryId,
  expectColumnValuesToBeValidOrcid,
  expectColumnValuesToBeValidPrice,
  expectColumnValuesToBeValidPubmedId,
  expectColumnValuesToBeValidRomanNumeral,
  expectColumnValuesToBeValidSsn,
  expectColumnValuesToBeValidTemperature,
  expectColumnValuesToBeVectors,
  expectColumnValuesToBeXmlParseable,
} from '../expectations/semanticFormat.js';
import {
  expectColumnValuesToBeFibonacciNumber,
  expectColumnValuesToBePrimeNumber,
  expectColumnValuesToBeValidLeapYear,
  expectColumnValuesToBeValidPowerfulNumber,
  expectColumnValuesToBeValidPronicNumber,
  expectColumnValuesToBeValidSemiprime,
  expectColumnValuesToBeValidSphenicNumber,
  expectColumnValuesToBeValidSquareFreeNumber,
} from '../expectations/semanticMath.js';
import {
  expectColumnValuesIpAddressInNetwork,
  expectColumnValuesToBePrivateIpV4,
  expectColumnValuesToBePrivateIpv4Class,
  expectColumnValuesToBePrivateIpV6,
} from '../expectations/semanticNetwork.js';
import {
  expectColumnValuesToBeValidImsi,
  expectColumnValuesToBeValidImsiCountryCode,
  expectColumnValuesToBeValidPhonenumber,
} from '../expectations/semanticTelecom.js';
import {
  expectTableColumnCountToBeBetween,
  expectTableColumnCountToEqual,
  expectTableColumnsToMatchOrderedList,
  expectTableColumnsToMatchSet,
  expectTableRowCountToBeBetween,
  expectTableRowCountToEqual,
} from '../expectations/table.js';
import type { Dataset, ExpectationResult } from '../types.js';
import type { ExpectationLevel, ExpectationName } from './declaredExpectations.js';

type Invoker = (dataset: Dataset, params: Record<string, unknown>) => ExpectationResult;

function mostly(params: Record<string, unknown>) {
  const m = params.mostly;
  return m != null ? { mostly: Number(m) } : undefined;
}

export interface RegistryEntry {
  level: ExpectationLevel;
  /** Short text explaining what this expectation asserts (for CLI, dashboards, etc.) */
  description: string;
  /** Optional implementation details or case-specific info */
  notes?: string[];
  invoke: Invoker;
}

export const EXPECTATION_REGISTRY: Record<ExpectationName, RegistryEntry> = {
  // Dataset
  expectTableRowCountToEqual: {
    level: 'dataset',
    description: 'Table row count equals the specified value',
    invoke: (d, p) => expectTableRowCountToEqual(d, p.value as number),
  },
  expectTableRowCountToBeBetween: {
    level: 'dataset',
    description: 'Table row count is between min_value and max_value',
    invoke: (d, p) =>
      expectTableRowCountToBeBetween(d, {
        min_value: p.min_value as number,
        max_value: p.max_value as number,
      }),
  },
  expectTableColumnCountToEqual: {
    level: 'dataset',
    description: 'Table column count equals the specified value',
    invoke: (d, p) => expectTableColumnCountToEqual(d, p.value as number),
  },
  expectTableColumnCountToBeBetween: {
    level: 'dataset',
    description: 'Table column count is between min_value and max_value',
    invoke: (d, p) =>
      expectTableColumnCountToBeBetween(d, {
        min_value: p.min_value as number,
        max_value: p.max_value as number,
      }),
  },
  expectTableColumnsToMatchOrderedList: {
    level: 'dataset',
    description: 'Table columns match the given ordered list',
    invoke: (d, p) => expectTableColumnsToMatchOrderedList(d, p.columnList as string[]),
  },
  expectTableColumnsToMatchSet: {
    level: 'dataset',
    description: 'Table columns match the given set (order irrelevant)',
    invoke: (d, p) => expectTableColumnsToMatchSet(d, p.columnSet as string[]),
  },
  // Field - existence
  expectColumnToExist: {
    level: 'field',
    description: 'Column exists in the dataset',
    invoke: (d, p) => expectColumnToExist(d, p.column as string),
  },
  expectColumnValuesToBeNull: {
    level: 'field',
    description: 'Column values are null (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeNull(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToNotBeNull: {
    level: 'field',
    description: 'Column values are not null (supports mostly)',
    invoke: (d, p) => expectColumnValuesToNotBeNull(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeUnique: {
    level: 'field',
    description: 'Column values are unique (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeUnique(d, p.column as string, mostly(p)),
  },
  // Field - set
  expectColumnValuesToBeInSet: {
    level: 'field',
    description: 'Column values are in the specified set (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToBeInSet(d, p.column as string, p.valueSet as unknown[], mostly(p)),
  },
  expectColumnValuesToNotBeInSet: {
    level: 'field',
    description: 'Column values are not in the specified set (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToNotBeInSet(d, p.column as string, p.valueSet as unknown[], mostly(p)),
  },
  expectColumnDistinctValuesToBeInSet: {
    level: 'field',
    description: 'All distinct column values are in the specified set',
    invoke: (d, p) =>
      expectColumnDistinctValuesToBeInSet(d, p.column as string, p.valueSet as unknown[]),
  },
  expectColumnDistinctValuesToContainSet: {
    level: 'field',
    description: 'Distinct column values contain the specified set',
    invoke: (d, p) =>
      expectColumnDistinctValuesToContainSet(d, p.column as string, p.valueSet as unknown[]),
  },
  expectColumnDistinctValuesToEqualSet: {
    level: 'field',
    description: 'Distinct column values equal the specified set',
    invoke: (d, p) =>
      expectColumnDistinctValuesToEqualSet(d, p.column as string, p.valueSet as unknown[]),
  },
  // Field - range
  expectColumnValuesToBeBetween: {
    level: 'field',
    description: 'Column values are between min and max (supports mostly, strict_min/max)',
    invoke: (d, p) =>
      expectColumnValuesToBeBetween(d, p.column as string, {
        ...mostly(p),
        min_value: p.min_value as number,
        max_value: p.max_value as number,
        strict_min: p.strict_min as boolean,
        strict_max: p.strict_max as boolean,
      }),
  },
  expectColumnValuesToBeIncreasing: {
    level: 'field',
    description: 'Column values are increasing (supports mostly, strictly)',
    invoke: (d, p) =>
      expectColumnValuesToBeIncreasing(d, p.column as string, {
        ...mostly(p),
        strictly: p.strictly as boolean,
      }),
  },
  expectColumnValuesToBeDecreasing: {
    level: 'field',
    description: 'Column values are decreasing (supports mostly, strictly)',
    invoke: (d, p) =>
      expectColumnValuesToBeDecreasing(d, p.column as string, {
        ...mostly(p),
        strictly: p.strictly as boolean,
      }),
  },
  expectColumnValueLengthsToBeBetween: {
    level: 'field',
    description: 'Column value lengths are between min and max (supports mostly)',
    invoke: (d, p) =>
      expectColumnValueLengthsToBeBetween(d, p.column as string, {
        ...mostly(p),
        min_value: p.min_value as number,
        max_value: p.max_value as number,
      }),
  },
  expectColumnValueLengthsToEqual: {
    level: 'field',
    description: 'Column value lengths equal the specified value (supports mostly)',
    invoke: (d, p) =>
      expectColumnValueLengthsToEqual(d, p.column as string, p.value as number, mostly(p)),
  },
  expectColumnValuesToBeOfType: {
    level: 'field',
    description: 'Column values are of the specified type (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToBeOfType(d, p.column as string, p.type as string, mostly(p)),
  },
  expectColumnValuesToBeInTypeList: {
    level: 'field',
    description: 'Column values are in the specified type list (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToBeInTypeList(d, p.column as string, p.typeList as string[], mostly(p)),
  },
  // Field - regex
  expectColumnValuesToMatchRegex: {
    level: 'field',
    description: 'Column values match the regex (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToMatchRegex(d, p.column as string, p.regex as string, mostly(p)),
  },
  expectColumnValuesToNotMatchRegex: {
    level: 'field',
    description: 'Column values do not match the regex (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToNotMatchRegex(d, p.column as string, p.regex as string, mostly(p)),
  },
  expectColumnValuesToMatchRegexList: {
    level: 'field',
    description: 'Column values match regex list (supports mostly, match_on)',
    invoke: (d, p) =>
      expectColumnValuesToMatchRegexList(d, p.column as string, p.regexList as string[], {
        ...mostly(p),
        match_on: p.match_on as 'any' | 'all',
      }),
  },
  expectColumnValuesToNotMatchRegexList: {
    level: 'field',
    description: 'Column values do not match regex list (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToNotMatchRegexList(
        d,
        p.column as string,
        p.regexList as string[],
        mostly(p)
      ),
  },
  expectColumnValuesToBeJsonParseable: {
    level: 'field',
    description: 'Column values are valid JSON (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeJsonParseable(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeDateutilParseable: {
    level: 'field',
    description: 'Column values are dateutil-parseable (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeDateutilParseable(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToMatchStrftimeFormat: {
    level: 'field',
    description: 'Column values match strftime format (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToMatchStrftimeFormat(
        d,
        p.column as string,
        p.strftime_format as string,
        mostly(p)
      ),
  },
  // Field - aggregates
  expectColumnMaxToBeBetween: {
    level: 'field',
    description: 'Column max is between min and max (supports mostly)',
    invoke: (d, p) =>
      expectColumnMaxToBeBetween(d, p.column as string, {
        ...mostly(p),
        min_value: p.min_value as number,
        max_value: p.max_value as number,
      }),
  },
  expectColumnMinToBeBetween: {
    level: 'field',
    description: 'Column min is between min and max (supports mostly)',
    invoke: (d, p) =>
      expectColumnMinToBeBetween(d, p.column as string, {
        ...mostly(p),
        min_value: p.min_value as number,
        max_value: p.max_value as number,
      }),
  },
  expectColumnMeanToBeBetween: {
    level: 'field',
    description: 'Column mean is between min and max (supports mostly)',
    invoke: (d, p) =>
      expectColumnMeanToBeBetween(d, p.column as string, {
        ...mostly(p),
        min_value: p.min_value as number,
        max_value: p.max_value as number,
      }),
  },
  expectColumnMedianToBeBetween: {
    level: 'field',
    description: 'Column median is between min and max (supports mostly)',
    invoke: (d, p) =>
      expectColumnMedianToBeBetween(d, p.column as string, {
        ...mostly(p),
        min_value: p.min_value as number,
        max_value: p.max_value as number,
      }),
  },
  expectColumnSumToBeBetween: {
    level: 'field',
    description: 'Column sum is between min and max (supports mostly)',
    invoke: (d, p) =>
      expectColumnSumToBeBetween(d, p.column as string, {
        ...mostly(p),
        min_value: p.min_value as number,
        max_value: p.max_value as number,
      }),
  },
  expectColumnStdevToBeBetween: {
    level: 'field',
    description: 'Column stdev is between min and max (supports mostly)',
    invoke: (d, p) =>
      expectColumnStdevToBeBetween(d, p.column as string, {
        ...mostly(p),
        min_value: p.min_value as number,
        max_value: p.max_value as number,
      }),
  },
  expectColumnUniqueValueCountToBeBetween: {
    level: 'field',
    description: 'Column unique value count is between min and max (supports mostly)',
    invoke: (d, p) =>
      expectColumnUniqueValueCountToBeBetween(d, p.column as string, {
        ...mostly(p),
        min_value: p.min_value as number,
        max_value: p.max_value as number,
      }),
  },
  expectColumnMostCommonValueToBeInSet: {
    level: 'field',
    description: 'Column most common value is in the specified set',
    invoke: (d, p) =>
      expectColumnMostCommonValueToBeInSet(d, p.column as string, p.valueSet as unknown[]),
  },
  expectColumnProportionOfNonNullValuesToBeBetween: {
    level: 'field',
    description: 'Column proportion of non-null values is between min and max',
    invoke: (d, p) =>
      expectColumnProportionOfNonNullValuesToBeBetween(d, p.column as string, {
        ...mostly(p),
        min_value: p.min_value as number,
        max_value: p.max_value as number,
      }),
  },
  expectColumnProportionOfUniqueValuesToBeBetween: {
    level: 'field',
    description: 'Column proportion of unique values is between min and max',
    invoke: (d, p) =>
      expectColumnProportionOfUniqueValuesToBeBetween(d, p.column as string, {
        ...mostly(p),
        min_value: p.min_value as number,
        max_value: p.max_value as number,
      }),
  },
  // Field - stats
  expectColumnQuantileValuesToBeBetween: {
    level: 'field',
    description: 'Column quantile values are within specified ranges',
    invoke: (d, p) =>
      expectColumnQuantileValuesToBeBetween(
        d,
        p.column as string,
        p.quantile_ranges as { quantiles: number[]; value_ranges: [number | null, number | null][] }
      ),
  },
  expectColumnValueZScoresToBeLessThan: {
    level: 'field',
    description: 'Column value z-scores are less than threshold (supports mostly)',
    invoke: (d, p) =>
      expectColumnValueZScoresToBeLessThan(d, p.column as string, {
        ...mostly(p),
        threshold: p.threshold as number,
        double_sided: p.double_sided as boolean,
      }),
  },
  // Field - LIKE
  expectColumnValuesToMatchLikePattern: {
    level: 'field',
    description: 'Column values match LIKE pattern (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToMatchLikePattern(
        d,
        p.column as string,
        p.like_pattern as string,
        mostly(p)
      ),
  },
  expectColumnValuesToNotMatchLikePattern: {
    level: 'field',
    description: 'Column values do not match LIKE pattern (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToNotMatchLikePattern(
        d,
        p.column as string,
        p.like_pattern as string,
        mostly(p)
      ),
  },
  expectColumnValuesToMatchLikePatternList: {
    level: 'field',
    description: 'Column values match LIKE pattern list (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToMatchLikePatternList(
        d,
        p.column as string,
        p.like_pattern_list as string[],
        {
          ...mostly(p),
          match_on: p.match_on as 'any' | 'all',
        }
      ),
  },
  expectColumnValuesToNotMatchLikePatternList: {
    level: 'field',
    description: 'Column values do not match LIKE pattern list (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToNotMatchLikePatternList(
        d,
        p.column as string,
        p.like_pattern_list as string[],
        mostly(p)
      ),
  },
  // Field - JSON Schema
  expectColumnValuesToMatchJsonSchema: {
    level: 'field',
    description: 'Column values match JSON Schema (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToMatchJsonSchema(
        d,
        p.column as string,
        p.schema as Record<string, unknown>,
        mostly(p)
      ),
  },
  // Field - semantic
  expectColumnValuesToBeValidUuid: {
    level: 'field',
    description: 'Column values are valid UUIDs (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidUuid(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToContainValidEmail: {
    level: 'field',
    description: 'Column values contain valid email (supports mostly)',
    invoke: (d, p) => expectColumnValuesToContainValidEmail(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeAscii: {
    level: 'field',
    description: 'Column values are ASCII (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeAscii(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeSlug: {
    level: 'field',
    description: 'Column values are URL slugs (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeSlug(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidHexColor: {
    level: 'field',
    description: 'Column values are valid hex colors (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidHexColor(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidMd5: {
    level: 'field',
    description: 'Column values are valid MD5 hashes (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidMd5(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidSha1: {
    level: 'field',
    description: 'Column values are valid SHA-1 hashes (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidSha1(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidBase64: {
    level: 'field',
    description: 'Column values are valid Base64 (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidBase64(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidHashtag: {
    level: 'field',
    description: 'Column values are valid hashtags (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidHashtag(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidUrls: {
    level: 'field',
    description: 'Column values are valid URLs (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidUrls(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidIpv4: {
    level: 'field',
    description: 'Column values are valid IPv4 addresses (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidIpv4(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidIpv6: {
    level: 'field',
    description: 'Column values are valid IPv6 addresses (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidIpv6(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidMac: {
    level: 'field',
    description: 'Column values are valid MAC addresses (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidMac(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidHttpMethod: {
    level: 'field',
    description: 'Column values are valid HTTP methods (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidHttpMethod(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidHttpMethods: {
    level: 'field',
    description: 'Column values are valid HTTP methods list (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidHttpMethods(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidHttpStatusCode: {
    level: 'field',
    description: 'Column values are valid HTTP status codes (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidHttpStatusCode(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidTcpPort: {
    level: 'field',
    description: 'Column values are valid TCP ports (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidTcpPort(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidUdpPort: {
    level: 'field',
    description: 'Column values are valid UDP ports (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidUdpPort(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidDate: {
    level: 'field',
    description: 'Column values are valid dates (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidDate(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeWeekday: {
    level: 'field',
    description: 'Column values are weekdays (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeWeekday(d, p.column as string, mostly(p)),
  },
  expectColumnValuesIpAddressInNetwork: {
    level: 'field',
    description: 'Column IP addresses are in the specified network (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesIpAddressInNetwork(d, p.column as string, p.network as string, mostly(p)),
  },
  expectColumnValuesToBePrivateIpV4: {
    level: 'field',
    description: 'Column values are private IPv4 addresses (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBePrivateIpV4(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBePrivateIpv4Class: {
    level: 'field',
    description: 'Column values are private IPv4 of specified class (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToBePrivateIpv4Class(
        d,
        p.column as string,
        (p.ip_class ?? p.ipClass) as 'A' | 'B' | 'C',
        mostly(p)
      ),
  },
  expectColumnValuesToBePrivateIpV6: {
    level: 'field',
    description: 'Column values are private IPv6 addresses (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBePrivateIpV6(d, p.column as string, mostly(p)),
  },
  // More semantic - checksum
  expectColumnValuesToBeValidIsbn10: {
    level: 'field',
    description: 'Column values are valid ISBN-10 (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidIsbn10(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidIsbn13: {
    level: 'field',
    description: 'Column values are valid ISBN-13 (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidIsbn13(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidEan: {
    level: 'field',
    description: 'Column values are valid EAN (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidEan(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidImei: {
    level: 'field',
    description: 'Column values are valid IMEI (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidImei(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidIsin: {
    level: 'field',
    description: 'Column values are valid ISIN (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidIsin(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidMeid: {
    level: 'field',
    description: 'Column values are valid MEID (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidMeid(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidIsmn: {
    level: 'field',
    description: 'Column values are valid ISMN (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidIsmn(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidIsan: {
    level: 'field',
    description: 'Column values are valid ISAN (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidIsan(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidBarcode: {
    level: 'field',
    description: 'Column values are valid barcodes (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidBarcode(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeGtinBaseUnit: {
    level: 'field',
    description: 'Column values are valid GTIN base unit (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeGtinBaseUnit(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeGtinVariableMeasureTradeItem: {
    level: 'field',
    description: 'Column values are valid GTIN variable measure (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToBeGtinVariableMeasureTradeItem(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidSsn: {
    level: 'field',
    description: 'Column values are valid SSN (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidSsn(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidImdbId: {
    level: 'field',
    description: 'Column values are valid IMDb IDs (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidImdbId(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidDoi: {
    level: 'field',
    description: 'Column values are valid DOI (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidDoi(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidOrcid: {
    level: 'field',
    description: 'Column values are valid ORCID (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidOrcid(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidArxivId: {
    level: 'field',
    description: 'Column values are valid arXiv IDs (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidArxivId(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidPubmedId: {
    level: 'field',
    description: 'Column values are valid PubMed IDs (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidPubmedId(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidRomanNumeral: {
    level: 'field',
    description: 'Column values are valid Roman numerals (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidRomanNumeral(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidBase32: {
    level: 'field',
    description: 'Column values are valid Base32 (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidBase32(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeXmlParseable: {
    level: 'field',
    description: 'Column values are valid XML (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeXmlParseable(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidTemperature: {
    level: 'field',
    description: 'Column values are valid temperatures (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidTemperature(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidPrice: {
    level: 'field',
    description: 'Column values are valid prices (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidPrice(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidOpenLibraryId: {
    level: 'field',
    description: 'Column values are valid Open Library IDs (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidOpenLibraryId(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeSecurePasswords: {
    level: 'field',
    description: 'Column values meet password security requirements',
    invoke: (d, p) =>
      expectColumnValuesToBeSecurePasswords(d, p.column as string, {
        ...mostly(p),
        require_lowercase: p.require_lowercase as boolean,
        require_uppercase: p.require_uppercase as boolean,
        require_digit: p.require_digit as boolean,
        require_special: p.require_special as boolean,
        min_length: p.min_length as number,
      }),
  },
  expectColumnValuesToBeVectors: {
    level: 'field',
    description: 'Column values are numeric vectors (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeVectors(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBePrimeNumber: {
    level: 'field',
    description: 'Column values are prime numbers (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBePrimeNumber(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeFibonacciNumber: {
    level: 'field',
    description: 'Column values are Fibonacci numbers (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeFibonacciNumber(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidLeapYear: {
    level: 'field',
    description: 'Column values are leap years (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidLeapYear(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidPronicNumber: {
    level: 'field',
    description: 'Column values are pronic numbers (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidPronicNumber(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidPowerfulNumber: {
    level: 'field',
    description: 'Column values are powerful numbers (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidPowerfulNumber(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidSemiprime: {
    level: 'field',
    description: 'Column values are semiprime (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidSemiprime(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidSphenicNumber: {
    level: 'field',
    description: 'Column values are sphenic numbers (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidSphenicNumber(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidSquareFreeNumber: {
    level: 'field',
    description: 'Column values are square-free numbers (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidSquareFreeNumber(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidIsoCountry: {
    level: 'field',
    description: 'Column values are ISO country codes (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidIsoCountry(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidCurrencyCode: {
    level: 'field',
    description: 'Column values are valid currency codes (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidCurrencyCode(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidIanaTimezone: {
    level: 'field',
    description: 'Column values are IANA timezones (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidIanaTimezone(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeIsoLanguages: {
    level: 'field',
    description: 'Column values are ISO language codes (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeIsoLanguages(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidHttpStatusName: {
    level: 'field',
    description: 'Column values are HTTP status names (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidHttpStatusName(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidMime: {
    level: 'field',
    description: 'Column values are valid MIME types (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidMime(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidMbti: {
    level: 'field',
    description: 'Column values are valid MBTI (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidMbti(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidTld: {
    level: 'field',
    description: 'Column values are valid TLDs (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidTld(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidUsState: {
    level: 'field',
    description: 'Column values are valid US states (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidUsState(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidUsStateAbbreviation: {
    level: 'field',
    description: 'Column values are valid US state abbreviations (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToBeValidUsStateAbbreviation(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidUsStateOrTerritory: {
    level: 'field',
    description: 'Column values are valid US states/territories (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToBeValidUsStateOrTerritory(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidUsStateOrTerritoryAbbreviation: {
    level: 'field',
    description: 'Column values are valid US state/territory abbreviations (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToBeValidUsStateOrTerritoryAbbreviation(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidCountry: {
    level: 'field',
    description: 'Column values are valid country names (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidCountry(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidIban: {
    level: 'field',
    description: 'Column values are valid IBAN (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidIban(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidBic: {
    level: 'field',
    description: 'Column values are valid BIC/SWIFT (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidBic(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidFormattedVat: {
    level: 'field',
    description: 'Column values are valid formatted VAT (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidFormattedVat(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidImsi: {
    level: 'field',
    description: 'Column values are valid IMSI (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidImsi(d, p.column as string, mostly(p)),
  },
  expectColumnValuesToBeValidImsiCountryCode: {
    level: 'field',
    description: 'Column values are valid IMSI country codes (supports mostly)',
    invoke: (d, p) =>
      expectColumnValuesToBeValidImsiCountryCode(
        d,
        p.column as string,
        p.country_code as string,
        mostly(p)
      ),
  },
  expectColumnValuesToBeValidPhonenumber: {
    level: 'field',
    description: 'Column values are valid phone numbers (supports mostly)',
    invoke: (d, p) => expectColumnValuesToBeValidPhonenumber(d, p.column as string, mostly(p)),
  },
  // Multi-field
  expectColumnPairValuesToBeEqual: {
    level: 'multi-field',
    description: 'Column pair values are equal (supports mostly)',
    invoke: (d, p) =>
      expectColumnPairValuesToBeEqual(d, p.columnA as string, p.columnB as string, mostly(p)),
  },
  expectColumnPairValuesAToBeGreaterThanB: {
    level: 'multi-field',
    description: 'Column A values are greater than (or equal to) column B (supports mostly)',
    invoke: (d, p) =>
      expectColumnPairValuesAToBeGreaterThanB(d, p.columnA as string, p.columnB as string, {
        ...mostly(p),
        or_equal: p.or_equal as boolean,
      }),
  },
  expectColumnPairValuesToBeInSet: {
    level: 'multi-field',
    description: 'Column pair values are in the specified set (supports mostly)',
    invoke: (d, p) =>
      expectColumnPairValuesToBeInSet(
        d,
        p.columnA as string,
        p.columnB as string,
        p.pairSet as [unknown, unknown][],
        mostly(p)
      ),
  },
  expectCompoundColumnsToBeUnique: {
    level: 'multi-field',
    description: 'Compound of columns is unique',
    invoke: (d, p) => expectCompoundColumnsToBeUnique(d, p.columns as string[]),
  },
  // Row
  expectSelectColumnValuesToBeUniqueWithinRecord: {
    level: 'row',
    description: 'Selected columns are unique within each row (supports mostly)',
    invoke: (d, p) =>
      expectSelectColumnValuesToBeUniqueWithinRecord(d, p.columns as string[], mostly(p)),
  },
  expectMulticolumnSumToEqual: {
    level: 'row',
    description: 'Sum of columns equals specified total (supports mostly)',
    invoke: (d, p) =>
      expectMulticolumnSumToEqual(d, p.columns as string[], p.sumTotal as number, mostly(p)),
  },
};
