# great-expectations-js

Data quality expectations for TypeScript/Node.js. Inspired by [Great Expectations](https://github.com/great-expectations/great_expectations) (Python).

## Install

```sh
npm install great-expectations-js
```

## What is this?

A TypeScript/Node.js library that implements data quality checks ("expectations") from the [Great Expectations](https://greatexpectations.io/) ecosystem. Each expectation is a self-contained function that validates a column, table, or dataset property and returns a pass/fail result.

The primary use case is **agentic data integrity**: show the list of available expectations to an LLM agent, let it pick which ones apply to each field in a scraped dataset, then run them programmatically.

## Status

**Version 0.1.0** -- skeleton only. No expectations are implemented yet. The tables below track progress.

To refresh the expectation list from the upstream GE repo, run:

```sh
npx tsx packages/great-expectations-js/scripts/list-ge-expectations.ts
```

## Expectations

### Core (60)

| # | Expectation | Status |
|---|-------------|--------|
| 1 | `expect_column_bootstrapped_ks_test_p_value_to_be_greater_than` | :x: |
| 2 | `expect_column_chisquare_test_p_value_to_be_greater_than` | :x: |
| 3 | `expect_column_distinct_values_to_be_in_set` | :x: |
| 4 | `expect_column_distinct_values_to_contain_set` | :x: |
| 5 | `expect_column_distinct_values_to_equal_set` | :x: |
| 6 | `expect_column_kl_divergence_to_be_less_than` | :x: |
| 7 | `expect_column_max_to_be_between` | :x: |
| 8 | `expect_column_mean_to_be_between` | :x: |
| 9 | `expect_column_median_to_be_between` | :x: |
| 10 | `expect_column_min_to_be_between` | :x: |
| 11 | `expect_column_most_common_value_to_be_in_set` | :x: |
| 12 | `expect_column_pair_cramers_phi_value_to_be_less_than` | :x: |
| 13 | `expect_column_pair_values_a_to_be_greater_than_b` | :x: |
| 14 | `expect_column_pair_values_to_be_equal` | :x: |
| 15 | `expect_column_pair_values_to_be_in_set` | :x: |
| 16 | `expect_column_parameterized_distribution_ks_test_p_value_to_be_greater_than` | :x: |
| 17 | `expect_column_proportion_of_non_null_values_to_be_between` | :x: |
| 18 | `expect_column_proportion_of_unique_values_to_be_between` | :x: |
| 19 | `expect_column_quantile_values_to_be_between` | :x: |
| 20 | `expect_column_stdev_to_be_between` | :x: |
| 21 | `expect_column_sum_to_be_between` | :x: |
| 22 | `expect_column_to_exist` | :x: |
| 23 | `expect_column_unique_value_count_to_be_between` | :x: |
| 24 | `expect_column_value_lengths_to_be_between` | :x: |
| 25 | `expect_column_value_lengths_to_equal` | :x: |
| 26 | `expect_column_value_z_scores_to_be_less_than` | :x: |
| 27 | `expect_column_values_to_be_between` | :x: |
| 28 | `expect_column_values_to_be_dateutil_parseable` | :x: |
| 29 | `expect_column_values_to_be_decreasing` | :x: |
| 30 | `expect_column_values_to_be_in_set` | :x: |
| 31 | `expect_column_values_to_be_in_type_list` | :x: |
| 32 | `expect_column_values_to_be_increasing` | :x: |
| 33 | `expect_column_values_to_be_json_parseable` | :x: |
| 34 | `expect_column_values_to_be_null` | :x: |
| 35 | `expect_column_values_to_be_of_type` | :x: |
| 36 | `expect_column_values_to_be_unique` | :x: |
| 37 | `expect_column_values_to_match_json_schema` | :x: |
| 38 | `expect_column_values_to_match_like_pattern` | :x: |
| 39 | `expect_column_values_to_match_like_pattern_list` | :x: |
| 40 | `expect_column_values_to_match_regex` | :x: |
| 41 | `expect_column_values_to_match_regex_list` | :x: |
| 42 | `expect_column_values_to_match_strftime_format` | :x: |
| 43 | `expect_column_values_to_not_be_in_set` | :x: |
| 44 | `expect_column_values_to_not_be_null` | :x: |
| 45 | `expect_column_values_to_not_match_like_pattern` | :x: |
| 46 | `expect_column_values_to_not_match_like_pattern_list` | :x: |
| 47 | `expect_column_values_to_not_match_regex` | :x: |
| 48 | `expect_column_values_to_not_match_regex_list` | :x: |
| 49 | `expect_compound_columns_to_be_unique` | :x: |
| 50 | `expect_multicolumn_sum_to_equal` | :x: |
| 51 | `expect_multicolumn_values_to_be_unique` | :x: |
| 52 | `expect_query_results_to_match_comparison` | :x: |
| 53 | `expect_select_column_values_to_be_unique_within_record` | :x: |
| 54 | `expect_table_column_count_to_be_between` | :x: |
| 55 | `expect_table_column_count_to_equal` | :x: |
| 56 | `expect_table_columns_to_match_ordered_list` | :x: |
| 57 | `expect_table_columns_to_match_set` | :x: |
| 58 | `expect_table_row_count_to_be_between` | :x: |
| 59 | `expect_table_row_count_to_equal` | :x: |
| 60 | `expect_table_row_count_to_equal_other_table` | :x: |

### Semantic Types (114)

| # | Expectation | Status |
|---|-------------|--------|
| 1 | `expect_column_values_are_in_language` | :x: |
| 2 | `expect_column_values_bic_belong_to_country` | :x: |
| 3 | `expect_column_values_bitcoin_address_positive_balance` | :x: |
| 4 | `expect_column_values_bitcoin_tx_is_confirmed` | :x: |
| 5 | `expect_column_values_email_domain_is_not_disposable` | :x: |
| 6 | `expect_column_values_eth_address_positive_balance` | :x: |
| 7 | `expect_column_values_imsi_belong_to_country_code` | :x: |
| 8 | `expect_column_values_ip_address_in_network` | :x: |
| 9 | `expect_column_values_ip_asn_country_code_in_set` | :x: |
| 10 | `expect_column_values_ip_is_not_blacklisted` | :x: |
| 11 | `expect_column_values_password_is_not_leaked` | :x: |
| 12 | `expect_column_values_to_be_a_non_bot_user_agent` | :x: |
| 13 | `expect_column_values_to_be_ascii` | :x: |
| 14 | `expect_column_values_to_be_daytime` | :x: |
| 15 | `expect_column_values_to_be_fibonacci_number` | :x: |
| 16 | `expect_column_values_to_be_gtin_base_unit` | :x: |
| 17 | `expect_column_values_to_be_gtin_variable_measure_trade_item` | :x: |
| 18 | `expect_column_values_to_be_icd_ten_category_or_subcategory` | :x: |
| 19 | `expect_column_values_to_be_iso_languages` | :x: |
| 20 | `expect_column_values_to_be_not_holiday` | :x: |
| 21 | `expect_column_values_to_be_prime_number` | :x: |
| 22 | `expect_column_values_to_be_private_ip_v4` | :x: |
| 23 | `expect_column_values_to_be_private_ip_v6` | :x: |
| 24 | `expect_column_values_to_be_private_ipv4_class` | :x: |
| 25 | `expect_column_values_to_be_secure_passwords` | :x: |
| 26 | `expect_column_values_to_be_slug` | :x: |
| 27 | `expect_column_values_to_be_valid_arxiv_id` | :x: |
| 28 | `expect_column_values_to_be_valid_barcode` | :x: |
| 29 | `expect_column_values_to_be_valid_base32` | :x: |
| 30 | `expect_column_values_to_be_valid_base64` | :x: |
| 31 | `expect_column_values_to_be_valid_bch_address` | :x: |
| 32 | `expect_column_values_to_be_valid_bic` | :x: |
| 33 | `expect_column_values_to_be_valid_bitcoin_address` | :x: |
| 34 | `expect_column_values_to_be_valid_city_name` | :x: |
| 35 | `expect_column_values_to_be_valid_country` | :x: |
| 36 | `expect_column_values_to_be_valid_country_fip` | :x: |
| 37 | `expect_column_values_to_be_valid_crypto_ticker` | :x: |
| 38 | `expect_column_values_to_be_valid_currency_code` | :x: |
| 39 | `expect_column_values_to_be_valid_dash_address` | :x: |
| 40 | `expect_column_values_to_be_valid_date` | :x: |
| 41 | `expect_column_values_to_be_valid_doge_address` | :x: |
| 42 | `expect_column_values_to_be_valid_doi` | :x: |
| 43 | `expect_column_values_to_be_valid_dot_address` | :x: |
| 44 | `expect_column_values_to_be_valid_dow_ticker` | :x: |
| 45 | `expect_column_values_to_be_valid_ean` | :x: |
| 46 | `expect_column_values_to_be_valid_eth_address` | :x: |
| 47 | `expect_column_values_to_be_valid_ethereum_address` | :x: |
| 48 | `expect_column_values_to_be_valid_formatted_vat` | :x: |
| 49 | `expect_column_values_to_be_valid_hashtag` | :x: |
| 50 | `expect_column_values_to_be_valid_hex_color` | :x: |
| 51 | `expect_column_values_to_be_valid_http_method` | :x: |
| 52 | `expect_column_values_to_be_valid_http_methods` | :x: |
| 53 | `expect_column_values_to_be_valid_http_status_code` | :x: |
| 54 | `expect_column_values_to_be_valid_http_status_name` | :x: |
| 55 | `expect_column_values_to_be_valid_iana_timezone` | :x: |
| 56 | `expect_column_values_to_be_valid_iban` | :x: |
| 57 | `expect_column_values_to_be_valid_imdb_id` | :x: |
| 58 | `expect_column_values_to_be_valid_imei` | :x: |
| 59 | `expect_column_values_to_be_valid_imsi` | :x: |
| 60 | `expect_column_values_to_be_valid_ipv4` | :x: |
| 61 | `expect_column_values_to_be_valid_ipv6` | :x: |
| 62 | `expect_column_values_to_be_valid_isan` | :x: |
| 63 | `expect_column_values_to_be_valid_isbn10` | :x: |
| 64 | `expect_column_values_to_be_valid_isbn13` | :x: |
| 65 | `expect_column_values_to_be_valid_isin` | :x: |
| 66 | `expect_column_values_to_be_valid_ismn` | :x: |
| 67 | `expect_column_values_to_be_valid_iso_country` | :x: |
| 68 | `expect_column_values_to_be_valid_leap_year` | :x: |
| 69 | `expect_column_values_to_be_valid_ltc_address` | :x: |
| 70 | `expect_column_values_to_be_valid_mac` | :x: |
| 71 | `expect_column_values_to_be_valid_mbti` | :x: |
| 72 | `expect_column_values_to_be_valid_md5` | :x: |
| 73 | `expect_column_values_to_be_valid_meid` | :x: |
| 74 | `expect_column_values_to_be_valid_mic` | :x: |
| 75 | `expect_column_values_to_be_valid_mic_match_country_code` | :x: |
| 76 | `expect_column_values_to_be_valid_mime` | :x: |
| 77 | `expect_column_values_to_be_valid_nasdaq_ticker` | :x: |
| 78 | `expect_column_values_to_be_valid_open_library_id` | :x: |
| 79 | `expect_column_values_to_be_valid_orcid` | :x: |
| 80 | `expect_column_values_to_be_valid_phonenumber` | :x: |
| 81 | `expect_column_values_to_be_valid_powerful_number` | :x: |
| 82 | `expect_column_values_to_be_valid_price` | :x: |
| 83 | `expect_column_values_to_be_valid_pronic_number` | :x: |
| 84 | `expect_column_values_to_be_valid_pubmed_id` | :x: |
| 85 | `expect_column_values_to_be_valid_roman_numeral` | :x: |
| 86 | `expect_column_values_to_be_valid_semiprime` | :x: |
| 87 | `expect_column_values_to_be_valid_sha1` | :x: |
| 88 | `expect_column_values_to_be_valid_sp500_ticker` | :x: |
| 89 | `expect_column_values_to_be_valid_sphenic_number` | :x: |
| 90 | `expect_column_values_to_be_valid_square_free_number` | :x: |
| 91 | `expect_column_values_to_be_valid_ssn` | :x: |
| 92 | `expect_column_values_to_be_valid_stellar_address` | :x: |
| 93 | `expect_column_values_to_be_valid_tcp_port` | :x: |
| 94 | `expect_column_values_to_be_valid_temperature` | :x: |
| 95 | `expect_column_values_to_be_valid_tld` | :x: |
| 96 | `expect_column_values_to_be_valid_udp_port` | :x: |
| 97 | `expect_column_values_to_be_valid_urls` | :x: |
| 98 | `expect_column_values_to_be_valid_us_county_fip` | :x: |
| 99 | `expect_column_values_to_be_valid_us_county_name` | :x: |
| 100 | `expect_column_values_to_be_valid_us_state` | :x: |
| 101 | `expect_column_values_to_be_valid_us_state_abbreviation` | :x: |
| 102 | `expect_column_values_to_be_valid_us_state_or_territory` | :x: |
| 103 | `expect_column_values_to_be_valid_us_state_or_territory_abbreviation` | :x: |
| 104 | `expect_column_values_to_be_valid_uuid` | :x: |
| 105 | `expect_column_values_to_be_valid_vies_vat` | :x: |
| 106 | `expect_column_values_to_be_valid_wikipedia_articles` | :x: |
| 107 | `expect_column_values_to_be_vectors` | :x: |
| 108 | `expect_column_values_to_be_weekday` | :x: |
| 109 | `expect_column_values_to_be_xml_parseable` | :x: |
| 110 | `expect_column_values_to_contain_valid_email` | :x: |
| 111 | `expect_column_values_to_have_valid_icd10_code_format` | :x: |
| 112 | `expect_column_values_url_has_got_valid_cert` | :x: |
| 113 | `expect_column_values_url_hostname_match_with_cert` | :x: |
| 114 | `expect_column_values_url_is_available` | :x: |

## Usage

> Not yet available. Once expectations are implemented, usage will look like:

```ts
import { expectColumnValuesToNotBeNull } from 'great-expectations-js';

const result = expectColumnValuesToNotBeNull(data, 'email');
// { success: true, unexpected_count: 0, unexpected_percent: 0 }
```

## Contributing

Each expectation is a standalone function in `src/expectations/`. To add one:

1. Pick an unimplemented expectation from the tables above.
2. Create `src/expectations/{expectation_name}.ts` with the implementation.
3. Create `src/expectations/{expectation_name}.test.ts` with tests.
4. Export it from `src/index.ts`.
5. Update the status in this README from :x: to :white_check_mark:.

## Upstream reference

Expectation names and semantics are based on:

- [Great Expectations core](https://github.com/great-expectations/great_expectations/tree/develop/great_expectations/expectations/core)
- [Great Expectations semantic types plugin](https://github.com/great-expectations/great_expectations/tree/develop/contrib/great_expectations_semantic_types_expectations/great_expectations_semantic_types_expectations/expectations)

## License

MIT
