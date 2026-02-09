# 10. Privacy compliance: Include or omit personal data

> **TL;DR:** Toggle personal data inclusion with a single flag -- PII fields are automatically redacted when disabled.

> **Note on input format:** Examples show input as JSON. When using `crawlee-one` directly, pass the same fields via the `input` option:
>
> ```ts
> await crawleeOne({ type: '...', input: { startUrls: ['https://...'] } });
> ```

## The problem

Scraping e-commerce products is straightforward. Scraping social media profiles, employee directories, or any dataset containing personal information introduces privacy obligations under regulations like GDPR.

The responsibility lies with whoever processes the data -- not the platform, not the scraper author. You need a way to control whether personal data is included in the output.

## The solution

CrawleeOne provides a single input toggle: `includePersonalData`.

A well-configured CrawleeOne scraper identifies which fields contain personal data via `privacyMask`. When `includePersonalData` is `false` (the default), those fields are automatically redacted.

**With `includePersonalData: false`:**

```json
{
  "name": "<Redacted property \"name\">",
  "type": "employee",
  "likes": ["hotdog", "skiing"]
}
```

**With `includePersonalData: true`:**

```json
{
  "name": "John Smith",
  "type": "employee",
  "likes": ["hotdog", "skiing"]
}
```

## Important notes

- Enable `includePersonalData` only when you have consent, a legal basis, or accept the risk.
- This feature simplifies compliance but is not a complete solution. The scraper author is not liable for errors. It is your responsibility to verify that your use of the data complies with applicable privacy laws.

[Learn more about GDPR](https://gdpr.eu/eu-gdpr-personal-data/).
