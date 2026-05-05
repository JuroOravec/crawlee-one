# great-expectations-js

Data quality expectations for TypeScript/Node.js. Inspired by [Great Expectations](https://github.com/great-expectations/great_expectations) (Python).

## Install

```sh
npm install great-expectations-js
```

## What is this?

A TypeScript/Node.js library that implements data quality checks ("expectations") from the [Great Expectations](https://greatexpectations.io/) ecosystem. Each expectation is a self-contained function that validates a column, table, or dataset property and returns a pass/fail result.

The primary use case is **agentic data integrity**: show the list of available expectations to an LLM agent, let it pick which ones apply to each field in a scraped dataset, then run them programmatically.

## Usage

```ts
import {
  expectColumnValuesToNotBeNull,
  expectColumnValuesToBeInSet,
  expectTableRowCountToBeBetween,
} from 'great-expectations-js';

const data = [
  { email: 'alice@example.com', role: 'admin' },
  { email: 'bob@example.com', role: 'user' },
  { email: null, role: 'user' },
];

expectColumnValuesToNotBeNull(data, 'email');
// { success: false, unexpected_count: 1, unexpected_percent: 0.333, unexpected_values: [null] }

expectColumnValuesToNotBeNull(data, 'email', { mostly: 0.6 });
// { success: true, ... }  — passes because 66% of values are non-null

expectColumnValuesToBeInSet(data, 'role', ['admin', 'user', 'viewer']);
// { success: true, unexpected_count: 0, unexpected_percent: 0, unexpected_values: [] }

expectTableRowCountToBeBetween(data, { min_value: 1, max_value: 100 });
// { success: true, ... }
```

Every expectation returns an `ExpectationResult`:

```ts
interface ExpectationResult {
  success: boolean;
  unexpected_count: number;
  unexpected_percent: number;
  unexpected_values: unknown[]; // sample of up to 20 failing values
}
```

## Declarative expectations

You can define expectations declaratively and run them in bulk:

```ts
import { runExpectations, type DatasetExpectations } from 'great-expectations-js';

interface MyRow {
  offerId: string;
  offerUrl: string;
  email: string;
}

const expectations: DatasetExpectations<MyRow> = {
  dataset: [
    { expectation: 'expectTableRowCountToBeBetween', params: { min_value: 1, max_value: 100 } },
  ],
  field: [
    { expectation: 'expectColumnToExist', params: { column: 'email' } },
    { expectation: 'expectColumnValuesToNotBeNull', params: { column: 'email' } },
    { expectation: 'expectColumnValuesToBeUnique', params: { column: 'email' } },
  ],
};

const results = runExpectations(myDataset, expectations);
```

For column autocomplete, pass your row shape as the generic:

```ts
interface MyRow {
  offerId: string;
  offerUrl: string;
  supplierUrl: string;
}

const expectations: DatasetExpectations<MyRow> = {
  field: [
    { expectation: 'expectColumnToExist', params: { column: 'offerId' } }, // TS suggests offerId | offerUrl | supplierUrl
  ],
};
```

## Status

**Version 0.1.0** -- 130 of 174 expectations implemented (54 core + 76 semantic). The tables below track progress.

To refresh the expectation list from the upstream GE repo, run:

```sh
npx tsx packages/great-expectations-js/scripts/list-ge-expectations.ts
```

## Expectations

### Core (60)

| #   | Done | Expectation                                                                   |
| --- | ---- | ----------------------------------------------------------------------------- |
| 1   | ❌   | `expect_column_bootstrapped_ks_test_p_value_to_be_greater_than`               |
| 2   | ❌   | `expect_column_chisquare_test_p_value_to_be_greater_than`                     |
| 3   | ✅   | `expect_column_distinct_values_to_be_in_set`                                  |
| 4   | ✅   | `expect_column_distinct_values_to_contain_set`                                |
| 5   | ✅   | `expect_column_distinct_values_to_equal_set`                                  |
| 6   | ❌   | `expect_column_kl_divergence_to_be_less_than`                                 |
| 7   | ✅   | `expect_column_max_to_be_between`                                             |
| 8   | ✅   | `expect_column_mean_to_be_between`                                            |
| 9   | ✅   | `expect_column_median_to_be_between`                                          |
| 10  | ✅   | `expect_column_min_to_be_between`                                             |
| 11  | ✅   | `expect_column_most_common_value_to_be_in_set`                                |
| 12  | ❌   | `expect_column_pair_cramers_phi_value_to_be_less_than`                        |
| 13  | ✅   | `expect_column_pair_values_a_to_be_greater_than_b`                            |
| 14  | ✅   | `expect_column_pair_values_to_be_equal`                                       |
| 15  | ✅   | `expect_column_pair_values_to_be_in_set`                                      |
| 16  | ❌   | `expect_column_parameterized_distribution_ks_test_p_value_to_be_greater_than` |
| 17  | ✅   | `expect_column_proportion_of_non_null_values_to_be_between`                   |
| 18  | ✅   | `expect_column_proportion_of_unique_values_to_be_between`                     |
| 19  | ✅   | `expect_column_quantile_values_to_be_between`                                 |
| 20  | ✅   | `expect_column_stdev_to_be_between`                                           |
| 21  | ✅   | `expect_column_sum_to_be_between`                                             |
| 22  | ✅   | `expect_column_to_exist`                                                      |
| 23  | ✅   | `expect_column_unique_value_count_to_be_between`                              |
| 24  | ✅   | `expect_column_value_lengths_to_be_between`                                   |
| 25  | ✅   | `expect_column_value_lengths_to_equal`                                        |
| 26  | ✅   | `expect_column_value_z_scores_to_be_less_than`                                |
| 27  | ✅   | `expect_column_values_to_be_between`                                          |
| 28  | ✅   | `expect_column_values_to_be_dateutil_parseable`                               |
| 29  | ✅   | `expect_column_values_to_be_decreasing`                                       |
| 30  | ✅   | `expect_column_values_to_be_in_set`                                           |
| 31  | ✅   | `expect_column_values_to_be_in_type_list`                                     |
| 32  | ✅   | `expect_column_values_to_be_increasing`                                       |
| 33  | ✅   | `expect_column_values_to_be_json_parseable`                                   |
| 34  | ✅   | `expect_column_values_to_be_null`                                             |
| 35  | ✅   | `expect_column_values_to_be_of_type`                                          |
| 36  | ✅   | `expect_column_values_to_be_unique`                                           |
| 37  | ✅   | `expect_column_values_to_match_json_schema`                                   |
| 38  | ✅   | `expect_column_values_to_match_like_pattern`                                  |
| 39  | ✅   | `expect_column_values_to_match_like_pattern_list`                             |
| 40  | ✅   | `expect_column_values_to_match_regex`                                         |
| 41  | ✅   | `expect_column_values_to_match_regex_list`                                    |
| 42  | ✅   | `expect_column_values_to_match_strftime_format`                               |
| 43  | ✅   | `expect_column_values_to_not_be_in_set`                                       |
| 44  | ✅   | `expect_column_values_to_not_be_null`                                         |
| 45  | ✅   | `expect_column_values_to_not_match_like_pattern`                              |
| 46  | ✅   | `expect_column_values_to_not_match_like_pattern_list`                         |
| 47  | ✅   | `expect_column_values_to_not_match_regex`                                     |
| 48  | ✅   | `expect_column_values_to_not_match_regex_list`                                |
| 49  | ✅   | `expect_compound_columns_to_be_unique`                                        |
| 50  | ✅   | `expect_multicolumn_sum_to_equal`                                             |
| 51  | ✅   | `expect_multicolumn_values_to_be_unique`                                      |
| 52  | ❌   | `expect_query_results_to_match_comparison`                                    |
| 53  | ✅   | `expect_select_column_values_to_be_unique_within_record`                      |
| 54  | ✅   | `expect_table_column_count_to_be_between`                                     |
| 55  | ✅   | `expect_table_column_count_to_equal`                                          |
| 56  | ✅   | `expect_table_columns_to_match_ordered_list`                                  |
| 57  | ✅   | `expect_table_columns_to_match_set`                                           |
| 58  | ✅   | `expect_table_row_count_to_be_between`                                        |
| 59  | ✅   | `expect_table_row_count_to_equal`                                             |
| 60  | ✅   | `expect_table_row_count_to_equal_other_table`                                 |

### Semantic Types (114)

| #   | Done | Expectation                                                           |
| --- | ---- | --------------------------------------------------------------------- |
| 1   | ❌   | `expect_column_values_are_in_language`                                |
| 2   | ❌   | `expect_column_values_bic_belong_to_country`                          |
| 3   | ❌   | `expect_column_values_bitcoin_address_positive_balance`               |
| 4   | ❌   | `expect_column_values_bitcoin_tx_is_confirmed`                        |
| 5   | ❌   | `expect_column_values_email_domain_is_not_disposable`                 |
| 6   | ❌   | `expect_column_values_eth_address_positive_balance`                   |
| 7   | ✅   | `expect_column_values_imsi_belong_to_country_code`                    |
| 8   | ✅   | `expect_column_values_ip_address_in_network`                          |
| 9   | ❌   | `expect_column_values_ip_asn_country_code_in_set`                     |
| 10  | ❌   | `expect_column_values_ip_is_not_blacklisted`                          |
| 11  | ❌   | `expect_column_values_password_is_not_leaked`                         |
| 12  | ❌   | `expect_column_values_to_be_a_non_bot_user_agent`                     |
| 13  | ✅   | `expect_column_values_to_be_ascii`                                    |
| 14  | ❌   | `expect_column_values_to_be_daytime`                                  |
| 15  | ✅   | `expect_column_values_to_be_fibonacci_number`                         |
| 16  | ✅   | `expect_column_values_to_be_gtin_base_unit`                           |
| 17  | ✅   | `expect_column_values_to_be_gtin_variable_measure_trade_item`         |
| 18  | ❌   | `expect_column_values_to_be_icd_ten_category_or_subcategory`          |
| 19  | ✅   | `expect_column_values_to_be_iso_languages`                            |
| 20  | ❌   | `expect_column_values_to_be_not_holiday`                              |
| 21  | ✅   | `expect_column_values_to_be_prime_number`                             |
| 22  | ✅   | `expect_column_values_to_be_private_ip_v4`                            |
| 23  | ✅   | `expect_column_values_to_be_private_ip_v6`                            |
| 24  | ✅   | `expect_column_values_to_be_private_ipv4_class`                       |
| 25  | ✅   | `expect_column_values_to_be_secure_passwords`                         |
| 26  | ✅   | `expect_column_values_to_be_slug`                                     |
| 27  | ✅   | `expect_column_values_to_be_valid_arxiv_id`                           |
| 28  | ✅   | `expect_column_values_to_be_valid_barcode`                            |
| 29  | ✅   | `expect_column_values_to_be_valid_base32`                             |
| 30  | ✅   | `expect_column_values_to_be_valid_base64`                             |
| 31  | ❌   | `expect_column_values_to_be_valid_bch_address`                        |
| 32  | ✅   | `expect_column_values_to_be_valid_bic`                                |
| 33  | ❌   | `expect_column_values_to_be_valid_bitcoin_address`                    |
| 34  | ❌   | `expect_column_values_to_be_valid_city_name`                          |
| 35  | ✅   | `expect_column_values_to_be_valid_country`                            |
| 36  | ✅   | `expect_column_values_to_be_valid_country_fip`                        |
| 37  | ❌   | `expect_column_values_to_be_valid_crypto_ticker`                      |
| 38  | ✅   | `expect_column_values_to_be_valid_currency_code`                      |
| 39  | ❌   | `expect_column_values_to_be_valid_dash_address`                       |
| 40  | ✅   | `expect_column_values_to_be_valid_date`                               |
| 41  | ❌   | `expect_column_values_to_be_valid_doge_address`                       |
| 42  | ✅   | `expect_column_values_to_be_valid_doi`                                |
| 43  | ❌   | `expect_column_values_to_be_valid_dot_address`                        |
| 44  | ❌   | `expect_column_values_to_be_valid_dow_ticker`                         |
| 45  | ✅   | `expect_column_values_to_be_valid_ean`                                |
| 46  | ❌   | `expect_column_values_to_be_valid_eth_address`                        |
| 47  | ❌   | `expect_column_values_to_be_valid_ethereum_address`                   |
| 48  | ✅   | `expect_column_values_to_be_valid_formatted_vat`                      |
| 49  | ✅   | `expect_column_values_to_be_valid_hashtag`                            |
| 50  | ✅   | `expect_column_values_to_be_valid_hex_color`                          |
| 51  | ✅   | `expect_column_values_to_be_valid_http_method`                        |
| 52  | ✅   | `expect_column_values_to_be_valid_http_methods`                       |
| 53  | ✅   | `expect_column_values_to_be_valid_http_status_code`                   |
| 54  | ✅   | `expect_column_values_to_be_valid_http_status_name`                   |
| 55  | ✅   | `expect_column_values_to_be_valid_iana_timezone`                      |
| 56  | ✅   | `expect_column_values_to_be_valid_iban`                               |
| 57  | ✅   | `expect_column_values_to_be_valid_imdb_id`                            |
| 58  | ✅   | `expect_column_values_to_be_valid_imei`                               |
| 59  | ✅   | `expect_column_values_to_be_valid_imsi`                               |
| 60  | ✅   | `expect_column_values_to_be_valid_ipv4`                               |
| 61  | ✅   | `expect_column_values_to_be_valid_ipv6`                               |
| 62  | ✅   | `expect_column_values_to_be_valid_isan`                               |
| 63  | ✅   | `expect_column_values_to_be_valid_isbn10`                             |
| 64  | ✅   | `expect_column_values_to_be_valid_isbn13`                             |
| 65  | ✅   | `expect_column_values_to_be_valid_isin`                               |
| 66  | ✅   | `expect_column_values_to_be_valid_ismn`                               |
| 67  | ✅   | `expect_column_values_to_be_valid_iso_country`                        |
| 68  | ✅   | `expect_column_values_to_be_valid_leap_year`                          |
| 69  | ❌   | `expect_column_values_to_be_valid_ltc_address`                        |
| 70  | ✅   | `expect_column_values_to_be_valid_mac`                                |
| 71  | ✅   | `expect_column_values_to_be_valid_mbti`                               |
| 72  | ✅   | `expect_column_values_to_be_valid_md5`                                |
| 73  | ✅   | `expect_column_values_to_be_valid_meid`                               |
| 74  | ❌   | `expect_column_values_to_be_valid_mic`                                |
| 75  | ❌   | `expect_column_values_to_be_valid_mic_match_country_code`             |
| 76  | ✅   | `expect_column_values_to_be_valid_mime`                               |
| 77  | ❌   | `expect_column_values_to_be_valid_nasdaq_ticker`                      |
| 78  | ✅   | `expect_column_values_to_be_valid_open_library_id`                    |
| 79  | ✅   | `expect_column_values_to_be_valid_orcid`                              |
| 80  | ✅   | `expect_column_values_to_be_valid_phonenumber`                        |
| 81  | ✅   | `expect_column_values_to_be_valid_powerful_number`                    |
| 82  | ✅   | `expect_column_values_to_be_valid_price`                              |
| 83  | ✅   | `expect_column_values_to_be_valid_pronic_number`                      |
| 84  | ✅   | `expect_column_values_to_be_valid_pubmed_id`                          |
| 85  | ✅   | `expect_column_values_to_be_valid_roman_numeral`                      |
| 86  | ✅   | `expect_column_values_to_be_valid_semiprime`                          |
| 87  | ✅   | `expect_column_values_to_be_valid_sha1`                               |
| 88  | ❌   | `expect_column_values_to_be_valid_sp500_ticker`                       |
| 89  | ✅   | `expect_column_values_to_be_valid_sphenic_number`                     |
| 90  | ✅   | `expect_column_values_to_be_valid_square_free_number`                 |
| 91  | ✅   | `expect_column_values_to_be_valid_ssn`                                |
| 92  | ❌   | `expect_column_values_to_be_valid_stellar_address`                    |
| 93  | ✅   | `expect_column_values_to_be_valid_tcp_port`                           |
| 94  | ✅   | `expect_column_values_to_be_valid_temperature`                        |
| 95  | ✅   | `expect_column_values_to_be_valid_tld`                                |
| 96  | ✅   | `expect_column_values_to_be_valid_udp_port`                           |
| 97  | ✅   | `expect_column_values_to_be_valid_urls`                               |
| 98  | ❌   | `expect_column_values_to_be_valid_us_county_fip`                      |
| 99  | ❌   | `expect_column_values_to_be_valid_us_county_name`                     |
| 100 | ✅   | `expect_column_values_to_be_valid_us_state`                           |
| 101 | ✅   | `expect_column_values_to_be_valid_us_state_abbreviation`              |
| 102 | ✅   | `expect_column_values_to_be_valid_us_state_or_territory`              |
| 103 | ✅   | `expect_column_values_to_be_valid_us_state_or_territory_abbreviation` |
| 104 | ✅   | `expect_column_values_to_be_valid_uuid`                               |
| 105 | ❌   | `expect_column_values_to_be_valid_vies_vat`                           |
| 106 | ❌   | `expect_column_values_to_be_valid_wikipedia_articles`                 |
| 107 | ✅   | `expect_column_values_to_be_vectors`                                  |
| 108 | ✅   | `expect_column_values_to_be_weekday`                                  |
| 109 | ✅   | `expect_column_values_to_be_xml_parseable`                            |
| 110 | ✅   | `expect_column_values_to_contain_valid_email`                         |
| 111 | ❌   | `expect_column_values_to_have_valid_icd10_code_format`                |
| 112 | ❌   | `expect_column_values_url_has_got_valid_cert`                         |
| 113 | ❌   | `expect_column_values_url_hostname_match_with_cert`                   |
| 114 | ❌   | `expect_column_values_url_is_available`                               |

## Divergences from Python GE

There may be minor differences between the Python and JS package. Please report them as bugs.

Some expectations behave differently from the upstream Python Great Expectations library:

- **LIKE patterns** (`match_like_pattern` / `not_match_like_pattern`): Upstream is SQL-only (delegated to the database engine). Our JS version implements in-memory LIKE-to-regex conversion, extending GE to work without a database.
- **arXiv ID**: Upstream makes live API calls to arxiv.org to verify IDs exist. Our version uses offline regex format validation only.
- **Base32**: Upstream uses Python's `base64.b32decode()`. Our version uses an inline base32 format decoder (Node.js has no native base32 support).
- **Daytime**: Not yet implemented. Upstream uses the `ephem` astronomical library with GPS lat/lon to compute actual sunrise/sunset. A future implementation would use `suncalc` for equivalent behavior.
- **Quantile result**: `expectColumnQuantileValuesToBeBetween` returns a `QuantileResult` (extends `ExpectationResult`) with additional `observed_value` and `details.success_details` fields, matching upstream's richer return shape.

## Contributing

Each expectation is a standalone function in `src/expectations/`. To add one:

1. Pick an unimplemented expectation from the tables above.
2. Create `src/expectations/{expectation_name}.ts` with the implementation.
3. Create `src/expectations/{expectation_name}.test.ts` with tests.
4. Export it from `src/index.ts`.
5. Update the status in this README from ❌ to ✅.

## Upstream reference

Expectation names and semantics are based on:

- [Great Expectations core](https://github.com/great-expectations/great_expectations/tree/develop/great_expectations/expectations/core)
- [Great Expectations semantic types plugin](https://github.com/great-expectations/great_expectations/tree/develop/contrib/great_expectations_semantic_types_expectations/great_expectations_semantic_types_expectations/expectations)

## License

MIT
