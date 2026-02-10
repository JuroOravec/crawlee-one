[**actor-spec**](../README.md)

***

[actor-spec](../globals.md) / DatasetFaultTolerance

# Interface: DatasetFaultTolerance

Defined in: [actorSpec.ts:281](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L281)

Describes how well the scraper handles failures when scraping the given dataset.

## Properties

### dataLossScope

> **dataLossScope**: `"all"` \| `"batch"` \| `"entry"` \| `"fields"`

Defined in: [actorSpec.ts:289](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L289)

How much of the data will be lost when the scraper fails:
- `all` - all data is lost
- `batch` - a batch of entries (e.g. a single page) is lost
- `entry` - single entry is lost
- `fields` - one or more fields on the entry is lost, but not the whole entry

***

### timeLostAvgSec

> **timeLostAvgSec**: `number`

Defined in: [actorSpec.ts:301](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L301)

Average estimate of how much time may be lost if the scraper fails.

Examples:
- If the scraper fails on the `batch` scope, each page has 10 entries,
and each entry takes 5 sec to scrape, the average time lost would be about
25 seconds (5 entries * 5 sec).
- If the scraper fails on the `entry` scope, and entry may take 2 sec to 5 min
to extract, but for most of entries it's the 2 sec, then the average time lost
would be about 2 seconds.

***

### timeLostMaxSec

> **timeLostMaxSec**: `number`

Defined in: [actorSpec.ts:315](https://github.com/JuroOravec/crawlee-one/blob/main/packages/actor-spec/src/types/actorSpec.ts#L315)

Worst case estimate of how much time may be lost if the scraper fails.

Examples:
- If the scraper fails on the `all` scope, the worst case estimate is
the time it takes to extract the whole dataset.
- If the scraper fails on the `batch` scope, each page has 10 entries,
and each entry takes 5 sec to scrape, the worst case time lost would be about
50 seconds (10 entries * 5 sec).
- If the scraper fails on the `entry` scope, and entry may take 2 sec to 5 min
to extract, but for most of entries it's the 2 sec, then the worst case time
lost would be about 300 seconds (5 min).
