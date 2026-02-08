# 12. Source control: Keep scraper configuration in sync

> **TL;DR:** Import scraper configuration from a remote URL or source control to keep multiple scraper instances in sync.

> **Note on input format:** Examples show input as JSON. When using `crawlee-one` directly, pass the same fields via the `input` option:
>
> ```ts
> await crawleeOne({ type: '...', input: { startUrls: ['https://...'] } });
> ```

## The problem

CrawleeOne's transformation and filtering logic lives in scraper input. This is convenient for single instances, but becomes a maintenance burden when you have multiple scrapers sharing the same configuration. Updating each one manually is error-prone and doesn't scale.

## The solution

Store your scraper configuration in source control (GitHub, GitLab, Bitbucket) and import it at runtime. CrawleeOne provides two input fields for this:

- `inputExtendUrl` -- Fetch configuration from a URL via GET request.
- `inputExtendFromFunction` -- Use a custom function for full control (POST requests, auth headers, dynamic values).

## Example

### 1. Define the shared config

```json
{
  "maxConcurrency": 5,
  "minConcurrency": 3,
  "outputRenameFields": { "data[0].media.value": "images" },
  "outputFilter": "async (entry) => entry.images.length > 5"
}
```

### 2. Host it in source control

Make the file available at a URL, e.g.:
`https://raw.githubusercontent.com/org/project/main/config.json`

### 3. Reference it from the scraper input

**Simple -- static URL:**

```json
{
  "inputExtendUrl": "https://raw.githubusercontent.com/org/project/main/config.json",
  "startUrls": ["https://..."]
}
```

**Advanced -- custom function with dynamic logic:**

```json
{
  "inputExtendFromFunction": "const config = await sendRequest.post('https://raw.githubusercontent.com/org/project/main/config.json').json(); const hours = new Date().getUTCHours(); config.maxConcurrency = (hours < 6 || hours > 20) ? 8 : 3; return config;",
  "startUrls": ["https://..."]
}
```

### 4. Merged result

The remote config is merged with the local input. Fields from both sources are combined:

```json
{
  "maxConcurrency": 5,
  "minConcurrency": 3,
  "outputRenameFields": { "data[0].media.value": "images" },
  "outputFilter": "async (entry) => entry.images.length > 5",
  "startUrls": ["https://..."]
}
```

**Result:** One config file in source control, shared across any number of scraper instances. Update once, apply everywhere.
