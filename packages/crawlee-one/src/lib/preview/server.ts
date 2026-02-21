import path from 'node:path';

import express from 'express';

import { flattenForCsv } from '../export/flattenForCsv.js';
import { createFilterFn, validateFilterScript } from './filter.js';
import {
  getAllDatasetTimelineData,
  getAllRequestTimelineData,
  getEntriesPage,
  getEntriesPageWithSort,
  getRequestsPage,
  getRequestsPageWithSort,
  listDatasets,
  listEntryIds,
  listReports,
  listRequestIds,
  listRequestQueues,
  parseSortParam,
  readEntry,
  readReportHtml,
  readRequest,
} from './storage.js';
import {
  pageDatasets,
  pageDatasetEntries,
  pageEntryDetail,
  pageError,
  pageReportDetail,
  pageReports,
  pageRequestDetail,
  pageRequestQueueEntries,
  pageRequestQueues,
} from './pages.js';

const PAGE_SIZE = 100;

function createPreviewServer(storageDir: string): express.Application {
  const app = express();

  // Redirect / to /datasets
  app.get('/', (_req, res) => {
    res.redirect(302, '/datasets');
  });

  // List request queues
  app.get('/requests', async (_req, res) => {
    try {
      const queues = await listRequestQueues(storageDir);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(pageRequestQueues('', queues));
    } catch (err) {
      res.status(500).send(pageError(err instanceof Error ? err.message : String(err)));
    }
  });

  // Paginated request queue entries (table or stats)
  app.get('/requests/:id', async (req, res) => {
    const { id: queueId } = req.params;
    const tab = (req.query.tab as string) === 'stats' ? 'stats' : 'table';
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
      const requestIds = await listRequestIds(storageDir, queueId);

      if (requestIds.length === 0) {
        res.status(404).send(pageError(`Request queue "${queueId}" is empty or not found.`));
        return;
      }

      let statsTimelineData: Awaited<ReturnType<typeof getAllRequestTimelineData>> = [];
      if (tab === 'stats') {
        statsTimelineData = await getAllRequestTimelineData(storageDir, queueId);
      }

      const offset = (page - 1) * PAGE_SIZE;
      const limit = PAGE_SIZE;

      let pageEntries: { id: string; data: object }[];
      let totalCount: number;

      if (sortSpec.length === 0 && !filterFn) {
        pageEntries = await getRequestsPage(storageDir, queueId, offset, limit);
        totalCount = requestIds.length;
      } else {
        const result = await getRequestsPageWithSort(
          storageDir,
          queueId,
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
        pageRequestQueueEntries(
          '',
          queueId,
          flattened,
          totalCount,
          page,
          PAGE_SIZE,
          sortSpec,
          filterScript,
          filterError,
          tab,
          statsTimelineData
        )
      );
    } catch (err) {
      res.status(500).send(pageError(err instanceof Error ? err.message : String(err)));
    }
  });

  // Single request detail (JSON)
  app.get('/requests/:id/:requestId', async (req, res) => {
    const { id: queueId, requestId } = req.params;

    try {
      const request = await readRequest(storageDir, queueId, requestId);

      if (request === null) {
        res.status(404).send(pageError(`Request "${requestId}" not found in queue "${queueId}".`));
        return;
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(pageRequestDetail('', queueId, requestId, request));
    } catch (err) {
      res.status(500).send(pageError(err instanceof Error ? err.message : String(err)));
    }
  });

  // List reports
  app.get('/reports', async (_req, res) => {
    try {
      const reports = await listReports(storageDir);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(pageReports('', reports));
    } catch (err) {
      res.status(500).send(pageError(err instanceof Error ? err.message : String(err)));
    }
  });

  // Report detail (embed HTML via iframe)
  app.get('/reports/:id', async (req, res) => {
    const { id: reportId } = req.params;

    try {
      const reports = await listReports(storageDir);
      const report = reports.find((r) => r.id === reportId);
      if (!report) {
        res.status(404).send(pageError(`Report "${reportId}" not found.`));
        return;
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(pageReportDetail('', reportId, report.hasHtml));
    } catch (err) {
      res.status(500).send(pageError(err instanceof Error ? err.message : String(err)));
    }
  });

  // Raw report HTML (for iframe embedding)
  app.get('/reports/:id/content', async (req, res) => {
    const { id: reportId } = req.params;

    try {
      const html = await readReportHtml(storageDir, reportId);
      if (html === null) {
        res.status(404).send(pageError(`Report "${reportId}" has no report.html.`));
        return;
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (err) {
      res.status(500).send(pageError(err instanceof Error ? err.message : String(err)));
    }
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

  // Paginated dataset entries (table or stats)
  app.get('/datasets/:id', async (req, res) => {
    const { id: datasetId } = req.params;
    const tab = (req.query.tab as string) === 'stats' ? 'stats' : 'table';
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

      let statsTimelineData: Awaited<ReturnType<typeof getAllDatasetTimelineData>> = [];
      if (tab === 'stats') {
        statsTimelineData = await getAllDatasetTimelineData(storageDir, datasetId);
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
          filterError,
          tab,
          statsTimelineData
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
