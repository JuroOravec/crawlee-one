# 12. Source control: Keep scraper configuration in sync

As you've seen, we can solve most of our data processing needs without having to spin up another server. What's more, we can even do it all through a single UI.

While that's great, you may wonder - if we keep all our transformation and filtering logic inside the scrapers, then how do we maintain the logic? What if we need to change or copy something? Won't it be a pain to manually update all logic for each single scraper instance I have?

The short answer is: No. We can store and import the scraper config from a source control like git (GitHub, GitLab).

With this approach, we can reuse a single config file for multiple scrapers. Or we can write the logic in TypeScript, compile it to JS, and import that as the config.

So, how do we do that?

Crawlee One defines 2 input fields: `inputExtendUrl` and `inputExtendFromFunction`:

- `inputExtendUrl` takes a plain URL, and sends a GET request to download remote config.
- `inputExtendFromFunction` gives you freedom to download or generate the config however you wish.

Let's go through an example:

1. Define the scraper config:

```json
// Formatted for clarity
{
  "maxConcurrency": 5,
  "minConcurrency": 3,
  "outputRenameFields": {
    "data[0].media.value": "images"
  },
  "outputFilter": "async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Filter entries based on number of images they have (at least 5)
    return entry.images.length > 5;
  };"
}
```

2. Make the config available. Let's assume that you've defined it in a public GitHub repo,
   so the config above is available at <https://raw.githubusercontent.com/username/project/main/config.json>.

3. Now configure an Apify Actor to use the config.

   For the simpler scenario, we can just set `inputExtendUrl` to the config URL:

   ```json
   {
    "inputExtendUrl": "https://raw.githubusercontent.com/username/project/main/config.json",
    "startUrls": [ ... ],
   }
   ```

   Or if we need more control, or need to make a POST request, we can use `inputExtendFromFunction`:

   ```json
   {
    "inputExtendFromFunction": "
      const config = await sendRequest.post('https://raw.githubusercontent.com/username/project/main/config.json').json();

      // Increase concurrency during off-peak hours
      // NOTE: Imagine we're targetting a small server, that can be slower during the day
      const hours = new Date().getUTCHours();
      const isOffPeak = hours < 6 || hours > 20;
      config.maxConcurrency = isOffPeak ? 8 : 3;

      return config;",
    "startUrls": [ ... ],
   }
   ```

4. You have effectively imported and merged a config from a source control. The resulting config is following:

```json
{
  // Fields from GitHub config
  "maxConcurrency": 5,
  "minConcurrency": 3,
  "outputRenameFields": {
    "data[0].media.value": "images"
  },
  "outputFilter": "async (entry, { Actor, input, state, sendRequest, itemCacheKey }) => {
    // Example: Filter entries based on number of images they have (at least 5)
    return entry.images.length > 5;
  };",

  // Fields defined on the Actor input
  "startUrls": [ ... ],
}
```
