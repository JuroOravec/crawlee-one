# Changelog

## 0.1.0

Initial release with 131 of 174 expectations implemented.

### Features

- Implement 131 expectations (60 core + 71 semantic type validators):
  - **Table-level (7):** row count equal/between, column count equal/between, column set/order matching, row count equals other table.
  - **Column existence & uniqueness (7):** exist, null, not-null, unique, compound unique, multicolumn unique, unique-within-record.
  - **Column set membership (5):** in set, not in set, distinct values in/contain/equal set.
  - **Column ranges & types (7):** between, increasing, decreasing, string lengths, typeof checks.
  - **Column regex & parsing (7):** regex match/not-match/list, JSON parseable, date parseable, strftime format.
  - **Column aggregates (10):** max, min, mean, median, sum, stdev, unique count, most common, proportion of non-null, proportion of unique.
  - **Column pair & multicolumn (4):** pair equal, A > B, pair in set, multicolumn sum.
  - **LIKE patterns (4):** match/not-match like pattern and pattern list.
  - **Statistics (2):** quantile values between, z-scores less than threshold.
  - **JSON Schema (1):** validate column values against a JSON Schema (`ajv`).
  - **Semantic format (9):** UUID, email, ASCII, slug, hex color, MD5, SHA1, base64, hashtag.
  - **Semantic network (9):** URL, IPv4, IPv6, MAC, HTTP method, HTTP status code, TCP port, UDP port, IP in CIDR network.
  - **Semantic datetime (2):** valid date, weekday.
  - **Semantic checksum (11):** ISBN-10, ISBN-13, EAN, IMEI, ISIN, MEID, ISMN, ISAN, barcode, GTIN base unit, GTIN variable measure.
  - **Semantic format extended (14):** SSN, IMDb ID, DOI, ORCID, arXiv ID, PubMed ID, Roman numeral, base32, XML parseable, temperature, price, Open Library ID, secure passwords, vectors.
  - **Semantic math (8):** prime, Fibonacci, leap year, pronic, powerful, semiprime, sphenic, square-free.
  - **Semantic data-table (13):** ISO country, currency code, IANA timezone, ISO language, HTTP status name, MIME type, MBTI, TLD, US state (4 variants), country name.
  - **Semantic private IP (4):** private IPv4, private IPv6, private IPv4 class, IP in network.
  - **Semantic finance (3):** IBAN, BIC/SWIFT, EU VAT number.
  - **Semantic telecom (3):** IMSI format, IMSI country code, phone number.
- Core types: `Dataset`, `ExpectationResult`, `MostlyOptions`, `BetweenOptions`, `QuantileResult`.
- Utility functions: `getColumnValues`, `getColumnNames`, `buildColumnResult`, `buildTableResult`, `buildRowResult` (also exported for building custom expectations).
- All expectations support the `mostly` threshold where applicable.
- Dependencies: `ajv`, `libphonenumber-js`, `i18n-iso-countries`, `currency-codes`.

- **Declarative expectations.** Define expectations in a JSON-serializable config and run them in bulk with `runExpectations(dataset, expectations)`:

  ```ts
  const results = runExpectations(myDataset, {
    field: [
      { expectation: 'expectColumnToExist', params: { column: 'email' } },
      { expectation: 'expectColumnValuesToNotBeNull', params: { column: 'email' } },
    ],
  });
  ```
