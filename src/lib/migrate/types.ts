import type { ApifyClient } from 'apify-client';

import type { MaybePromise } from '../../utils/types';

export interface Migration {
  migrate: (client: ApifyClient) => MaybePromise<void>;
  unmigrate: (client: ApifyClient) => MaybePromise<void>;
}
