# Deploying to Apify

This guide walks you through deploying a CrawleeOne scraper to the [Apify platform](https://apify.com/).

For working examples, see:

- [SKCRIS Scraper](https://github.com/JuroOravec/apify-actor-skcris)
- [Profesia.sk Scraper](https://github.com/JuroOravec/apify-actor-profesia-sk)

## 1. Write the crawler with CrawleeOne

Use the example projects above as a starting point, or set up your own project. Remember that Apify requires a Dockerized project for deployment.

```sh
npm install crawlee-one
```

## 2. Define the crawler's input

Apify needs to know what input your crawler accepts. This is done via an [`actor.json`](https://docs.apify.com/platform/actors/development/actor-definition/actor-json) file that describes the input schema.

CrawleeOne provides pre-defined input fields through `allActorInputs`. To use them:

1. Install [`apify-actor-config`](https://github.com/JuroOravec/apify-actor-config) as a dev dependency:

   ```sh
   npm i -D apify-actor-config
   ```

2. Create a config file that combines your custom inputs with CrawleeOne's inputs:

   ```ts
   import { allActorInputs } from 'crawlee-one';
   import { createActorConfig, createActorInputSchema } from 'apify-actor-config';

   const inputSchema = createActorInputSchema({
     schemaVersion: 1,
     // ...
     properties: {
       ...customActorInput,
       ...allActorInputs,
     },
   });

   const config = createActorConfig({
     actorSpecification: 1,
     // ...
     input: inputSchema,
   });

   export default config;
   ```

   You can override defaults from `allActorInputs` directly:

   ```ts
   allActorInputs.requestHandlerTimeoutSecs.prefill = 60 * 3;
   ```

   [See here](https://github.com/JuroOravec/apify-actor-profesia-sk/blob/main/src/config.ts) for a full example config.

3. Build the config to vanilla JS (if using TypeScript or other non-JS languages).

4. Generate the `actor.json` file:

   ```sh
   npx apify-actor-config gen -c ./path/to/dist/config.js
   ```

   This creates `./actor/actor.json` with all CrawleeOne input fields.

## 3. Deploy to Apify

Follow [Apify's deployment docs](https://docs.apify.com/academy/deploying-your-code/deploying) to push the project to the platform.

## 4. Verify

Once deployed, navigate to your actor on Apify. You should see all the CrawleeOne input fields available in the UI.

See the [user guide](./user-guide.md) for how the input looks in the Apify UI, including screenshots.
