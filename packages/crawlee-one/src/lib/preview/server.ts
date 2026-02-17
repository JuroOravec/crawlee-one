import path from 'node:path';

import express from 'express';

import { flattenForCsv } from '../export/flattenForCsv.js';
import { createFilterFn, validateFilterScript } from './filter.js';
import {
  getEntriesPage,
  getEntriesPageWithSort,
  listDatasets,
  listEntryIds,
  parseSortParam,
  readEntry,
} from './storage.js';
import { pageDatasets, pageDatasetEntries, pageEntryDetail, pageError } from './pages.js';

const PAGE_SIZE = 100;

function createPreviewServer(storageDir: string): express.Application {
  const app = express();

  // Redirect / to /datasets
  app.get('/', (_req, res) => {
    res.redirect(302, '/datasets');
  });

  // List datasets
  app.get('/datasets', async (_req, res) => {
    try {
      const datasets = await listDatasets(storageDir);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(pageDatasets('', datasets));
    } catch (err) {
      res.status(500).send(pageError(err instanceof Error ? err.message : String(err)));
    }
  });

  // Paginated dataset entries (table view)
  app.get('/datasets/:id', async (req, res) => {
    const { id: datasetId } = req.params;
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const sortParam = req.query.sort as string | undefined;
    const filterParam = req.query.filter as string | undefined;
    const filterScript = typeof filterParam === 'string' ? filterParam.trim() : '';
    const sortSpec = parseSortParam(sortParam);

    let filterFn: ((e: { id: string; data: object }) => boolean) | undefined;
    let filterError: string | null = null;
    if (filterScript) {
      filterError = validateFilterScript(filterScript);
      if (!filterError) {
        try {
          filterFn = createFilterFn(filterScript);
        } catch (e) {
          filterError = e instanceof Error ? e.message : String(e);
        }
      }
    }

    try {
      const entryIds = await listEntryIds(storageDir, datasetId);

      if (entryIds.length === 0) {
        res.status(404).send(pageError(`Dataset "${datasetId}" is empty or not found.`));
        return;
      }

      const offset = (page - 1) * PAGE_SIZE;
      const limit = PAGE_SIZE;

      let pageEntries: { id: string; data: object }[];
      let totalCount: number;

      if (sortSpec.length === 0 && !filterFn) {
        pageEntries = await getEntriesPage(storageDir, datasetId, offset, limit);
        totalCount = entryIds.length;
      } else {
        const result = await getEntriesPageWithSort(
          storageDir,
          datasetId,
          offset,
          limit,
          sortSpec,
          filterFn
        );
        pageEntries = result.entries;
        totalCount = result.totalCount;
      }

      const flattened = pageEntries.map(({ id, data }) => {
        const flat = flattenForCsv((data ?? {}) as Record<string, unknown>);
        return { id, ...flat } as Record<string, string | number | boolean | null>;
      });

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(
        pageDatasetEntries(
          '',
          datasetId,
          flattened,
          totalCount,
          page,
          PAGE_SIZE,
          sortSpec,
          filterScript,
          filterError
        )
      );
    } catch (err) {
      res.status(500).send(pageError(err instanceof Error ? err.message : String(err)));
    }
  });

  // Single entry detail (JSON)
  app.get('/datasets/:id/:entryId', async (req, res) => {
    const { id: datasetId, entryId } = req.params;

    try {
      const entry = await readEntry(storageDir, datasetId, entryId);

      if (entry === null) {
        res.status(404).send(pageError(`Entry "${entryId}" not found in dataset "${datasetId}".`));
        return;
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(pageEntryDetail('', datasetId, entryId, entry));
    } catch (err) {
      res.status(500).send(pageError(err instanceof Error ? err.message : String(err)));
    }
  });

  return app;
}

export interface PreviewServerOptions {
  storageDir?: string;
  port?: number;
}

/**
 * Start the preview server. Uses APIFY_LOCAL_STORAGE_DIR or ./storage.
 *
 * @param options.port - Port to listen on (default: 3000).
 * @param options.storageDir - Override storage directory (otherwise from env or cwd/storage).
 */
export async function startPreviewServer(
  options: PreviewServerOptions = {}
): Promise<{ port: number; url: string }> {
  const storageDir =
    options.storageDir ??
    (process.env.APIFY_LOCAL_STORAGE_DIR
      ? path.resolve(process.env.APIFY_LOCAL_STORAGE_DIR)
      : path.join(process.cwd(), 'storage'));

  const port = options.port ?? 3000;
  const app = createPreviewServer(storageDir);

  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      const url = `http://localhost:${port}`;
      resolve({ port, url });
    });
    server.on('error', reject);
  });
}
