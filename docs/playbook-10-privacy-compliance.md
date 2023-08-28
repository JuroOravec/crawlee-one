# 10. Privacy compliance: Include or omit personal data

What's the difference between scraping e-commerce products vs scraping people's profiles from social media?

The second dataset includes personal information, which needs to be handled carefully.

When scraping data, you should always be wary of privacy regulations like GDPR. Even when you use platforms like Apify, the onus is on you. Not the platform, and not the developer of the scraper.

Crawlee One simplifies the compliance with privacy regulations - you can decide whether to include or exclude personal data with a simple toggle (`true` / `false`).

This is set via the `includePersonalData` input option.

A well-configured Crawlee One scraper has identified which fields include personal data. If `includePersonalData` is not enabled, then the fields with PII will be redacted. Redacted fields may look like this:

With `includePersonalData: false`

```json
{
  "name": "<Redacted property \"name\">"
  "type": "employee",
  "likes": ["hotdog", "skiing"],
}
```

With `includePersonalData: true`

```json
{
  "name": "John Smith"
  "type": "employee",
  "likes": ["hotdog", "skiing"],
}
```

NOTE: You should turn this on ONLY if you have a consent, legal basis for using the data, or at your own risk.

NOTE 2: While the aim of this feature is to simplify things for you, this is not a bullet-proof solution. The scraper author is not to be held liable for errors, and it is your responsibility to decide if the dataset that you're using is breaching privacy laws, whether some fields are redacted or not.

[Learn more about GDPR](https://gdpr.eu/eu-gdpr-personal-data/).
