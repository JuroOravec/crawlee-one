# 3. Simple transformations: Select and rename columns, set how many entries to scrape

> NOTE:
>
> In these examples, the input is mostly shown as a JSON, e.g.:
> ```json
> {
>   "startUrls": ["https://www.example.com/path/1"],
> }
> ```
> If you are using the `crawlee-one` package directly, then that is the same as:
> ```ts
> import { crawleeOne } from 'crawlee-one';
> await crawleeOne({
>   type: '...',
>   input: {
>     startUrls: ['https://www.example.com/path/1'],
>   },
> });
> ```

To start off this section, let's consider this scenario:

> _Imagine you are software developer who's making a payment gateway solution tailored to SaaS businesses. Your colleague Curt is in charge of sales and marketing. To get a sense of the market, Curt found a web scraper that downloads companies and user profiles from [ProductHunt](producthunt.com). ProductHunt is full of SaaS products, so this is a great start!_
>
> _Curt intends to import the data as JSON and into a CRM. But, uh-oh, the data from the web scraper is in a wrong format. The data is too large to be modified in a text editor or online tools, and Curt is not very tech-savvy, so he asks you to modify the data so it can be imported into the CRM._
>
> _In terms of the data, maybe we need to:_
>
> - _Rename the fields, so they match what the CRM expects_
> - _Remove extra fields, because CRM complains about them too_
>
> _This was fine at first, but Curt gets a new dataset every few weeks or so. And every time, he asks you to modify the data. Sometimes even the same dataset that you've massaged previously..._
>
> _You feel like this is taking too much of your time. But building a data processing pipeline for these kind of scenarios feels like massive overengineering, and you wonder, "Why can't he just change the headers of the scraped data...?" But Curt refuses to learn [jq](https://jqlang.github.io/jq/)..._ 😢

Sometimes, you need to make small tweaks to the scraped dataset, so it can work with the downstream integration - rename headers, or select only some fields.

Usually scrapers give you the data as is, and you are unable to make small adjustments to the scraped dataset if you don't know how. **That's why CrawleeOne allow you to rename, select, and limit the number of entries right from the Apify UI, with no coding required.**

Let's have a look at 3 Actor input fields that do just that:

- `outputMaxEntries` - If set, only at most this many entries will be scraped.
- `outputPickFields` - Specify which fields to keep from the scraped data (the rest is discarded). This is useful if you need to save storage space.
- `outputRenameFields` - Rename fields, so the data can be fed directly to the downstream systems.

So if the scraper produces a dataset like so:

```json
{
  "id": "xxxx-xxxx-xxxx-xxxx",
  "name": "XXXX XXXX",
  "profileUrl": "https://producthunt.com/p/xxxxxx",
  "email": "xxxx@xxxx.xx",
  "description": "<SOME VERY LONG TEXT>",
  "media": {
    "photos": [
      {
        "data": {
          "photoUrl": "https://.../img.png"
        }
      }
    ]
  }
  // Other fields...
}
```

Then, if we need to rename and select only some fields, we can use following Actor input for our scraper:

```json
{
  "outputRenameFields": { "photoUrl": "media.photos[0].data.photoUrl" },
  "outputPickFields": ["name", "email", "profileUrl", "photoUrl"]
}
```

To generate this output:

```json
{
  "name": "XXXX XXXX",
  "profileUrl": "https://producthunt.com/p/xxxxxx",
  "email": "xxxx@xxxx.xx",
  "photoUrl": "https://.../img.png"
}
```

> _Congrats! With CrawleeOne, you are able to rename and trim down the dataset right from the Apify UI. 🚀_
