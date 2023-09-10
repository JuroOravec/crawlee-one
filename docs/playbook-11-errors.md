# 11. Capture errors

> NOTE:
>
> In these examples, the input is mostly shown as a JSON, e.g.:
>
> ```json
> {
>   "startUrls": ["https://www.example.com/path/1"]
> }
> ```
>
> If you are using the `crawlee-one` package directly, then that is the same as:
>
> ```ts
> import { crawleeOne } from 'crawlee-one';
> await crawleeOne({
>   type: '...',
>   input: {
>     startUrls: ['https://www.example.com/path/1'],
>   },
> });
> ```

### Scenario

> Imagine you're scraping Amazon products in large quantities and daily. One day, something changed, and you start getting a lot of errors. Something in the integration broke.
>
> If you're scraping north of tens of thousands of entries, keeping track of all the errors can be quite challenging. So, what do you do?
>
> - Do you check logs for errors? These can be easily lost or overlooked.
> - Or do you stop the whole scraping run if there's an error?
> - Or let it slide and work with the rest? But then what's your tolerance for errors?
> - Maybe you decide to change som configuration, but then you start receiving a different kind of error...

### Error Dataset

CrawleeOne helps to manage this issue out of the box. Errors are tracked in a separate Dataset. When an error occurs, it's automatically recorded. This can help you in several ways:

- The errors are persisted, so they can be re-visited later.
- The errors can be pooled from multiple scrapers into a single Dataset.

This can be configured with the `errorReportingDatasetId` input option:

```json
{
  "errorReportingDatasetId": "REPORTING"
}
```
