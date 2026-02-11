# TODO

- Create Website entity
  - Context:
    - Currently, we depend on the actors to tell us info about websites like what filters are available there (and whether the scraper matches all filter options)
    - While this is OK while we manage all scrapers that use actor-spec,
      this could lead to ambiguity once more stakeholders write actors for the
      same websites.
    - Hence, we sould create an entity that represents Website/API, that would store the info that's own to the website and which is the same across all actors interacting with that page.
- Create Property entity

  - Context:

    - Scraping data is a great first step. But if we want to work with the data further,
      e.g. we want to join multiple datasets, then there's the issues like:
      1. How do you merge which datasets by which field(s)
      2. Do those fields need pre-processing
      3. Are they 1-to-1 mapping, etc.
    - This is not easy, because e.g. a company name in one dataset may be different than in another, e.g. "Finstat" vs "Finstat s.r.o.". In fact, these are 2 different pieces of info. First is the commonly-referred name, let's call it "CompanyNameDisplay", while the second is the official name, let's call it "CompanyNameOfficial". From these two, "CompanyNameOfficial" looks like it could be used as an ID. However, we know that companies in different countries may have the name. So we can use "CompanyNameOfficial" as ID only in conjunction with "CompanyCountry" information.
    - Building on top of this example, it's clear that the dataset fields could be reliably used for data joining ONLY IF the fields were properly labelled.
    - Hence, we should create Property entities that define the properties found on scraper output entries.
    - Property entity could look like this:

      ```ts
      interface Property {
        /** Property name unique to our system, e.g. "OrgNameOfficial" */
        propertyId: string;
        /**
         * Entity that the property describes, e.g. "OrgNameOfficial" described
         * organisation, thus "org"
         */
        describedEntity: string;
        ...
      }
      ```

      The `ScraperDataset` output schema would then be extended to include `exampleEntryProperties` field, which would describe the properties by our property IDs, e.g.:

      ```json
      "exampleEntryProperties": {
        "someField": "OrgNameOfficial",
        "otherField": "OrgRegNum",
        "countryField": "CountryAlpha2Code",
      }
      ```

      Lastly, we'd define the combination of properties that can be used for merging datasets, e.g.:

      ```ts
      interface PrimaryKey {
        /**
         * List of Property.propertyId's that together uniquely identify entries.
         */
        properties: string[];
        /** Entity type on which the properties reside */
        describedEntity: string;
      }
      ```

      Thus, verifying if two datasets could be merged would become a 2-step process:

      1. For both datasets, find all `PrimaryKey`s where all `PrimaryKey.properties` are included in values of `Dataset.output.exampleEntryProperties`.
      2. Check if there's overlap between the two. If there is, the two could be directly merged.

      NOTE: Described above is a naive approach to merging datasets. If we have many datasets available, it could be that two datasets could be merged, but ONLY after merging with other datasets.

      - Imagine I have datasets

        - A.{a,b,c} (dataset A with props a, b, c)
        - B.{z,y,x}
        - C.{b,g}
        - D.{g, y}
          In such case, to join A with B, it would not work naively. But it would work if I merged A with C, then with D, and then with B.

        This looks like a path-finding/network-connectivity problem*, hence I assume that the possibility of two datasets joining would not be known until we build / traverse the network of dataset properties.

        \* or something that SQL databases solved decades ago
