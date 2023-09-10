# Actor Input Reference

Overview of the inputs supported by CrawleeOne that can be passed to Apify/Crawlee Actors.

The options are auto-generated from the source code.

## ToC

- [Programmatic Input (Advanced)](#programmatic-input-advanced)
- [Starting URLs](#starting-urls)
- [Proxy](#proxy)
- [Privacy & Data governance (GDPR)](#privacy--data-governance-gdpr)
- [Requests limit, transformation & filtering (Advanced)](#requests-limit-transformation--filtering-advanced)
- [Output size, transformation & filtering (T in ETL) (Advanced)](#output-size-transformation--filtering-t-in-etl-advanced)
- [Output Dataset & Caching (L in ETL) (Advanced)](#output-dataset--caching-l-in-etl-advanced)
- [Crawler configuration (Advanced)](#crawler-configuration-advanced)
- [Performance configuration (Advanced)](#performance-configuration-advanced)
- [Logging & Error handling (Advanced)](#logging--error-handling-advanced)
- [Integrations (Metamorphing) (Advanced)](#integrations-metamorphing-advanced)

<!--
NOTE: The reference below was generated from actor.json with the following script:

// TODO - Add generation of ToC to the script below

```js
inlineMultistring = (s, distance = 1) => {
    return s.split('\n').map((line) => ' '.repeat(distance) + line).join('\n');
};

console.log(Object.entries(o).reduce((str, [key, val]) => {
    const sectionStr = !val.sectionCaption ? '' : `### ${val.sectionCaption}
  ${val.sectionDescription || ''}\n`;

    const formattedVal = !val.example ? null : JSON.stringify(val.example).replace(/\\n/g, `
`).replace(/\s*\/\*\*(?:.|\s)*?\*\/\s*/g, '')
        .trim().replace(/(?:^|\n)\/\/ ?/g, '\n')
    const exampleStr = !val.example ? '' :
        `- **Example:**
    \`\`\`js
${inlineMultistring(formattedVal, 4)}
    \`\`\`
`;

    const newStr = `#### ${key}

- **Type:** ${val.type}
- **Description:** ${val.description}
${exampleStr}
`;
    return str + '\n' + sectionStr + newStr;
}, ''))
```
-->

### Programmatic Input (Advanced)

With these options you can configure other Actor options programmatically or from remote source.

#### inputExtendUrl

- **Type:** string
- **Description:** Extend Actor input with a config from a URL.<br/>
  For example, you can store your actor input in a source control, and import it here.<br/>
  In case of a conflict (if a field is defined both in Actor input and in imported input) the Actor input overwrites the imported fields.<br/>
  The URL is requested with GET method, and must point to a JSON file containing a single object (the config).<br/>
  If you need to send a POST request or to modify the response further, use `inputExtendFromFunction` instead.
- **Example:**
  ```js
  'https://raw.githubusercontent.com/jfairbank/programming-elm.com/master/cat-breeds.json';
  ```

#### inputExtendFromFunction

- **Type:** string
- **Description:** Extend Actor input with a config defined by a custom function.<br/>
  For example, you can store your actor input in a source control, and import it here.<br/>
  In case of a conflict (if a field is defined both in Actor input and in imported input) the Actor input overwrites the imported fields.<br/>
  The function must return an object (the config).
- **Example:**

  ```js
  "async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Load Actor config from GitHub URL (public)
    const config = await sendRequest.get('https://raw.githubusercontent.com/username/project/main/config.json').json();

    // Increase concurrency during off-peak hours
    // NOTE: Imagine we're targetting a small server, that can be slower during the day
    const hours = new Date().getUTCHours();
    const isOffPeak = hours < 6 || hours > 20;
    config.maxConcurrency = isOffPeak ? 8 : 3;

    return config;
  };"
  ```

### Starting URLs

#### startUrls

- **Type:** array
- **Description:** List of URLs to scrape.

#### startUrlsFromDataset

- **Type:** string
- **Description:** Import URLs to scrape from an existing Apify Dataset.<br/>
  Write the dataset and the field to import in the format `{datasetID}#{field}`.<br/>
  Example: `datasetid123#url` will take URLs from dataset `datasetid123` from field `url`.
- **Example:**
  ```js
  'datasetid123#url';
  ```

#### startUrlsFromFunction

- **Type:** string
- **Description:** Import or generate URLs to scrape using a custom function.<br/>
- **Example:**
  ```js
  "async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Create and load URLs from an Apify Dataset by combining multiple fields
    const dataset = await Actor.openDataset(datasetNameOrId);
    const data = await dataset.getData();
    const urls = data.items.map((item) => `https://example.com/u/${item.userId}/list/${item.listId}`);
    return urls;
  };"
  ```

### Proxy

Configure the proxy

#### proxy

- **Type:** object
- **Description:** Select proxies to be used by your crawler.

### Privacy & Data governance (GDPR)

#### includePersonalData

- **Type:** boolean
- **Description:** By default, fields that are potential personal data are censored. Toggle this option on to get the un-uncensored values.<br/>
  <strong>WARNING:</strong> Turn this on ONLY if you have consent, legal basis for using the data, or at your own risk. <a href="https://gdpr.eu/eu-gdpr-personal-data/">Learn more</a>

### Requests limit, transformation & filtering (Advanced)

#### requestMaxEntries

- **Type:** integer
- **Description:** If set, only at most this many requests will be processed.<br/>
  The count is determined from the Apify RequestQueue that's used for the Actor run.<br/>
  This means that if `requestMaxEntries` is set to 50, but the associated queue already handled 40 requests, then only 10 new requests will be handled.
- **Example:**
  ```js
  50;
  ```

#### requestTransform

- **Type:** string
- **Description:** Freely transform the request object using a custom function.<br/>
  If not set, the request will remain as is.
- **Example:**
  ```js
  "async (request, { Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Tag requests
    // (maybe because we use RequestQueue that pools multiple scrapers)
    request.userData.tag = \"VARIANT_A\";
    return requestQueue;
  };"
  ```

#### requestTransformBefore

- **Type:** string
- **Description:** Use this if you need to run one-time initialization code before `requestTransform`.<br/>
- **Example:**
  ```js
  "// async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Fetch data or run code BEFORE requests are processed.
    state.categories = await sendRequest.get('https://example.com/my-categories').json();
  };"
  ```

#### requestTransformAfter

- **Type:** string
- **Description:** Use this if you need to run one-time teardown code after `requestTransform`.<br/>
- **Example:**
  ```js
  "async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Fetch data or run code AFTER requests are processed.
    delete state.categories;
  };"
  ```

#### requestFilter

- **Type:** string
- **Description:** Decide which requests should be processed by using a custom function.<br/>
  If not set, all requests will be included.<br/>
  This is done after `requestTransform`.<br/>
- **Example:**
  ```js
  "async (request, { Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Filter requests based on their tag
    // (maybe because we use RequestQueue that pools multiple scrapers)
    return request.userData.tag === \"VARIANT_A\";
  };"
  ```

#### requestFilterBefore

- **Type:** string
- **Description:** Use this if you need to run one-time initialization code before `requestFilter`.<br/>
- **Example:**
  ```js
  "async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Fetch data or run code BEFORE requests are processed.
    state.categories = await sendRequest.get('https://example.com/my-categories').json();
  };"
  ```

#### requestFilterAfter

- **Type:** string
- **Description:** Use this if you need to run one-time teardown code after `requestFilter`.<br/>
- **Example:**
  ```js
  "async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Fetch data or run code AFTER requests are processed.
    delete state.categories;
  };"
  ```

#### requestQueueId

- **Type:** string
- **Description:** By default, requests are stored in the default request queue.
  Set this option if you want to use a non-default queue.
  <a href="https://docs.apify.com/sdk/python/docs/concepts/storages#opening-named-and-unnamed-storages">Learn more</a><br/>
  <strong>NOTE:</strong> RequestQueue name can only contain letters 'a' through 'z', the digits '0' through '9', and the hyphen ('-') but only in the middle of the string (e.g. 'my-value-1')
- **Example:**
  ```js
  'mIJVZsRQrDQf4rUAf';
  ```

### Output size, transformation & filtering (T in ETL) (Advanced)

#### outputMaxEntries

- **Type:** integer
- **Description:** If set, only at most this many entries will be scraped.<br/>
  The count is determined from the Apify Dataset that's used for the Actor run.<br/>
  This means that if `outputMaxEntries` is set to 50, but the associated Dataset already has 40 items in it, then only 10 new entries will be saved.
- **Example:**
  ```js
  50;
  ```

#### outputRenameFields

- **Type:** object
- **Description:** Rename fields (columns) of the output data.<br/>
  If not set, all fields will have their original names.<br/>
  This is done before `outputPickFields`.<br/>
  Keys can be nested, e.g. `"someProp.value[0]"`.
  Nested path is resolved using <a href="https://lodash.com/docs/4.17.15#get">Lodash.get()</a>.
- **Example:**
  ```js
  {"oldFieldName":"newFieldName"}
  ```

#### outputPickFields

- **Type:** array
- **Description:** Select a subset of fields of an entry that will be pushed to the dataset.<br/>
  If not set, all fields on an entry will be pushed to the dataset.<br/>
  This is done after `outputRenameFields`.<br/>
  Keys can be nested, e.g. `"someProp.value[0]"`.
  Nested path is resolved using <a href="https://lodash.com/docs/4.17.15#get">Lodash.get()</a>.
- **Example:**
  ```js
  ['fieldName', 'another.nested[0].field'];
  ```

#### outputTransform

- **Type:** string
- **Description:** Freely transform the output data object using a custom function.<br/>
  If not set, the data will remain as is.<br/>
  This is done after `outputPickFields` and `outputRenameFields`.<br/>
- **Example:**
  ```js
  "async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Add extra custom fields like aggregates
    return {
      ...entry,
      imagesCount: entry.images.length,
    };
  };"
  ```

#### outputTransformBefore

- **Type:** string
- **Description:** Use this if you need to run one-time initialization code before `outputTransform`.<br/>
- **Example:**
  ```js
  "async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Fetch data or run code BEFORE entries are scraped.
    state.categories = await sendRequest.get('https://example.com/my-categories').json();
  };"
  ```

#### outputTransformAfter

- **Type:** string
- **Description:** Use this if you need to run one-time teardown code after `outputTransform`.<br/>
- **Example:**
  ```js
  "async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Fetch data or run code AFTER entries are scraped.
    delete state.categories;
  };"
  ```

#### outputFilter

- **Type:** string
- **Description:** Decide which scraped entries should be included in the output by using a custom function.<br/>
  If not set, all scraped entries will be included.<br/>
  This is done after `outputPickFields`, `outputRenameFields`, and `outputTransform`.<br/>
- **Example:**
  ```js
  "async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Filter entries based on number of images they have (at least 5)
    return entry.images.length > 5;
  };"
  ```

#### outputFilterBefore

- **Type:** string
- **Description:** Use this if you need to run one-time initialization code before `outputFilter`.<br/>
- **Example:**
  ```js
  "async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Fetch data or run code BEFORE entries are scraped.
    state.categories = await sendRequest.get('https://example.com/my-categories').json();
  };"
  ```

#### outputFilterAfter

- **Type:** string
- **Description:** Use this if you need to run one-time teardown code after `outputFilter`.<br/>
- **Example:**
  ```js
  "async ({ Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Fetch data or run code AFTER entries are scraped.
    delete state.categories;
  };"
  ```

### Output Dataset & Caching (L in ETL) (Advanced)

#### outputDatasetIdOrName

- **Type:** string
- **Description:** By default, data is written to Default dataset.
  Set this option if you want to write data to non-default dataset.
  <a href="https://docs.apify.com/sdk/python/docs/concepts/storages#opening-named-and-unnamed-storages">Learn more</a><br/>
  <strong>NOTE:</strong> Dataset name can only contain letters 'a' through 'z', the digits '0' through '9', and the hyphen ('-') but only in the middle of the string (e.g. 'my-value-1')
- **Example:**
  ```js
  'mIJVZsRQrDQf4rUAf';
  ```

#### outputCacheStoreIdOrName

- **Type:** string
- **Description:** Set this option if you want to cache scraped entries in <a href="https://docs.apify.com/sdk/js/docs/guides/result-storage#key-value-store">Apify's Key-value store</a>.<br/>
  This is useful for example when you want to scrape only NEW entries. In such case, you can use the `outputFilter` option to define a custom function to filter out entries already found in the cache.
  <a href="https://docs.apify.com/sdk/python/docs/concepts/storages#working-with-key-value-stores">Learn more</a><br/>
  <strong>NOTE:</strong> Cache name can only contain letters 'a' through 'z', the digits '0' through '9', and the hyphen ('-') but only in the middle of the string (e.g. 'my-value-1')
- **Example:**
  ```js
  'mIJVZsRQrDQf4rUAf';
  ```

#### outputCachePrimaryKeys

- **Type:** array
- **Description:** Specify fields that uniquely identify entries (primary keys), so entries can be compared against the cache.<br/>
  <strong>NOTE:</strong> If not set, the entries are hashed based on all fields
- **Example:**
  ```js
  ['name', 'city'];
  ```

#### outputCacheActionOnResult

- **Type:** string
- **Description:** Specify whether scraped results should be added to, removed from, or overwrite the cache.<br/>
  - <strong>add</strong> - Adds scraped results to the cache<br/>
  - <strong>remove</strong> - Removes scraped results from the cache<br/>
  - <strong>set</strong> - First clears all entries from the cache, then adds scraped results to the cache<br/>
    <strong>NOTE:</strong> No action happens when this field is empty.
- **Example:**
  ```js
  'add';
  ```

### Crawler configuration (Advanced)

These options are applied directly to the Crawler. In majority of cases you don't need to change these. See https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions

#### maxRequestRetries

- **Type:** integer
- **Description:** Indicates how many times the request is retried if <a href="https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions#requestHandler">BasicCrawlerOptions.requestHandler</a> fails.
- **Example:**
  ```js
  3;
  ```

#### maxRequestsPerMinute

- **Type:** integer
- **Description:** The maximum number of requests per minute the crawler should run. We can pass any positive, non-zero integer.
- **Example:**
  ```js
  120;
  ```

#### maxRequestsPerCrawl

- **Type:** integer
- **Description:** Maximum number of pages that the crawler will open. The crawl will stop when this limit is reached.
  <br/> <strong>NOTE:</strong> In cases of parallel crawling, the actual number of pages visited might be slightly higher than this value.

#### minConcurrency

- **Type:** integer
- **Description:** Sets the minimum concurrency (parallelism) for the crawl.<br/>
  <strong>WARNING:</strong> If we set this value too high with respect to the available system memory and CPU, our crawler will run extremely slow or crash. If not sure, it's better to keep the default value and the concurrency will scale up automatically.
- **Example:**
  ```js
  1;
  ```

#### maxConcurrency

- **Type:** integer
- **Description:** Sets the maximum concurrency (parallelism) for the crawl.

#### navigationTimeoutSecs

- **Type:** integer
- **Description:** Timeout in which the HTTP request to the resource needs to finish, given in seconds.

#### requestHandlerTimeoutSecs

- **Type:** integer
- **Description:** Timeout in which the function passed as <a href="https://crawlee.dev/api/basic-crawler/interface/BasicCrawlerOptions#requestHandler">BasicCrawlerOptions.requestHandler</a> needs to finish, in seconds.
- **Example:**
  ```js
  180;
  ```

#### keepAlive

- **Type:** boolean
- **Description:** Allows to keep the crawler alive even if the RequestQueue gets empty. With keepAlive: true the crawler will keep running, waiting for more requests to come.

#### additionalMimeTypes

- **Type:** array
- **Description:** An array of MIME types you want the crawler to load and process. By default, only text/html and application/xhtml+xml MIME types are supported.

#### suggestResponseEncoding

- **Type:** string
- **Description:** By default this crawler will extract correct encoding from the HTTP response headers. There are some websites which use invalid headers. Those are encoded using the UTF-8 encoding. If those sites actually use a different encoding, the response will be corrupted. You can use suggestResponseEncoding to fall back to a certain encoding, if you know that your target website uses it. To force a certain encoding, disregarding the response headers, use forceResponseEncoding.

#### forceResponseEncoding

- **Type:** string
- **Description:** By default this crawler will extract correct encoding from the HTTP response headers. Use forceResponseEncoding to force a certain encoding, disregarding the response headers. To only provide a default for missing encodings, use suggestResponseEncoding.

### Performance configuration (Advanced)

Standalone performance options. These are not passed to the Crawler.

#### perfBatchSize

- **Type:** integer
- **Description:** If set, multiple Requests will be handled by a single Actor instance.<br/>
  Example: If set to 20, then up to 20 requests will be handled in a single "go".<br/>
  <a href="https://docs.apify.com/platform/actors/development/performance#batch-jobs-win-over-the-single-jobs">See Apify documentation</a>.
- **Example:**
  ```js
  20;
  ```

#### perfBatchWaitSecs

- **Type:** integer
- **Description:** How long to wait between entries within a single batch.<br/>
  Increase this value if you're using batching and you're sending requests to the scraped website too fast.<br/>
  Example: If set to 1, then after each entry in a batch, wait 1 second before continuing.
- **Example:**
  ```js
  1;
  ```

### Logging & Error handling (Advanced)

Configure how to handle errors or what should be displayed in the log console.

#### logLevel

- **Type:** string
- **Description:** Select how detailed should be the logging.
- **Example:**
  ```js
  'info';
  ```

#### errorReportingDatasetId

- **Type:** string
- **Description:** Apify dataset ID or name to which errors should be captured.<br/>
  Default: `'REPORTING'`.<br/>
  <strong>NOTE:</strong> Dataset name can only contain letters 'a' through 'z', the digits '0' through '9', and the hyphen ('-') but only in the middle of the string (e.g. 'my-value-1')
- **Example:**
  ```js
  'REPORTING';
  ```

#### errorTelemetry

- **Type:** boolean
- **Description:** Whether to send actor error reports to a telemery services like <a href="https://sentry.io/">Sentry</a>.<br/>
  This info is used by the author of this actor to identify broken integrations,
  and track down and fix issues.
- **Example:**
  ```js
  true;
  ```

### Integrations (Metamorphing) (Advanced)

#### metamorphActorId

- **Type:** string
- **Description:** Use this option if you want to run another actor with the same dataset after this actor has finished (AKA metamorph into another actor). <a href="https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph">Learn more</a> <br/>
  New actor is identified by its ID, e.g. "apify/web-scraper".
- **Example:**
  ```js
  'apify/web-scraper';
  ```

#### metamorphActorBuild

- **Type:** string
- **Description:** Tag or number of the target actor build to metamorph into (e.g. 'beta' or '1.2.345')
- **Example:**
  ```js
  '1.2.345';
  ```

#### metamorphActorInput

- **Type:** object
- **Description:** Input object passed to the follow-up (metamorph) actor. <a href="https://docs.apify.com/sdk/python/docs/concepts/interacting-with-other-actors#actormetamorph">Learn more</a>
- **Example:**
  ```js
  {"uploadDatasetToGDrive":true}
  ```
