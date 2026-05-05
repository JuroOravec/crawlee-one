/**
 * Duration distribution histogram for preview server.
 * Vertical bar chart: x = time taken, y = count of requests.
 * Uses ApexCharts bar (loaded from CDN).
 */

import type { RequestTimelineEntry } from './storage.js';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Format duration in seconds for axis labels. */
function formatDuration(sec: number): string {
  if (sec < 1) return `${(sec * 1000).toFixed(0)}ms`;
  if (sec < 60) return `${sec.toFixed(1)}s`;
  return `${(sec / 60).toFixed(1)}m`;
}

export interface DurationHistogramChartLabels {
  title?: string;
  itemLabel?: 'request' | 'entry';
}

const DEFAULT_HISTOGRAM_LABELS: Required<DurationHistogramChartLabels> = {
  title: 'Time taken distribution',
  itemLabel: 'request',
};

/**
 * Render HTML for a duration distribution histogram.
 * Buckets time-taken values and plots count per bucket.
 */
export function renderDurationHistogramChart(
  entries: RequestTimelineEntry[],
  labels?: DurationHistogramChartLabels
): string {
  const { title, itemLabel } = { ...DEFAULT_HISTOGRAM_LABELS, ...labels };
  const emptyMsg =
    itemLabel === 'entry'
      ? 'No entry data to compute durations.'
      : 'No request data to compute durations.';

  if (entries.length === 0) {
    return `
<div class="duration-histogram-container">
  <h2 class="duration-histogram-title">${escapeHtml(title)}</h2>
  <p class="duration-histogram-empty">${escapeHtml(emptyMsg)}</p>
</div>`;
  }

  const durationsSec = entries.map((e) => {
    const start = new Date(e.lastHandledAt).getTime();
    const end = new Date(e.handledAt).getTime();
    return (end - start) / 1000;
  });
  const maxSec = Math.max(...durationsSec);

  const numBuckets = Math.min(80, Math.max(30, Math.ceil(Math.sqrt(entries.length)) * 2));
  const bucketWidth = Math.max(0.001, maxSec / numBuckets);

  const counts = new Array<number>(numBuckets).fill(0);
  const categories: string[] = [];

  for (let i = 0; i < numBuckets; i++) {
    const lo = i * bucketWidth;
    const hi = i === numBuckets - 1 ? Infinity : (i + 1) * bucketWidth;
    categories.push(formatDuration(lo));
    for (const d of durationsSec) {
      if (d >= lo && d < hi) counts[i]++;
    }
  }

  const containerId = `histogram-${Math.random().toString(36).slice(2, 11)}`;
  const categoriesJson = JSON.stringify(categories).replace(/</g, '\\u003c');
  const seriesJson = JSON.stringify(counts);
  const itemPlural = itemLabel === 'entry' ? 'entries' : 'requests';
  const itemSingular = itemLabel === 'entry' ? 'entry' : 'request';
  return `
<div class="duration-histogram-container">
  <h2 class="duration-histogram-title">${escapeHtml(title)}</h2>
  <p class="duration-histogram-summary">${entries.length} ${itemPlural} — each bar: number of ${itemPlural} in that duration bucket.</p>
  <div id="${escapeHtml(containerId)}" class="duration-histogram-chart" style="width:600px;height:220px;"></div>
  <script>
(function(){
  var el=document.getElementById("${escapeHtml(containerId)}");
  if(!el||typeof ApexCharts==="undefined")return;
  var ttSingular="${escapeHtml(itemSingular)}", ttPlural="${escapeHtml(itemPlural)}";
  var opts={
    series:[{name:"Count",data:${seriesJson}}],
    chart:{type:"bar",height:220,toolbar:{show:false}},
    plotOptions:{bar:{columnWidth:"40%",distributed:false,dataLabels:{enabled:false}}},
    dataLabels:{enabled:false},
    xaxis:{categories:${categoriesJson},labels:{rotate:-45,style:{fontSize:"10px"}}},
    yaxis:{title:{text:"Count"},labels:{style:{fontSize:"11px"}}},
    grid:{xaxis:{lines:{show:false}},yaxis:{lines:{show:true}}},
    legend:{show:false},
    tooltip:{y:{formatter:function(v){return v+" "+(v===1?ttSingular:ttPlural);}}}
  };
  new ApexCharts(el,opts).render();
})();
  <\/script>
</div>
<style>
  .duration-histogram-container { margin: 1.5rem 0; }
  .duration-histogram-title { font-size: 1rem; margin: 0 0 0.5rem; }
  .duration-histogram-summary { font-size: 0.875rem; color: #666; margin: 0 0 1rem; }
  .duration-histogram-chart { border: 1px solid #ddd; border-radius: 4px; }
</style>`;
}
