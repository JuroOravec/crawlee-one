/**
 * Waterfall timeline chart for preview server.
 * Shows each request as a horizontal bar from lastHandledAt to handledAt.
 * Uses ApexCharts rangeBar (loaded from CDN).
 */

import type { RequestTimelineEntry } from './storage.js';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export interface WaterfallChartLabels {
  title?: string;
  itemLabel?: 'request' | 'entry';
}

const DEFAULT_WATERFALL_LABELS: Required<WaterfallChartLabels> = {
  title: 'Request handling timeline',
  itemLabel: 'request',
};

/**
 * Render HTML for a waterfall timeline of request handling.
 * Each bar spans from lastHandledAt to handledAt; y-axis is request order.
 */
export function renderWaterfallChart(
  entries: RequestTimelineEntry[],
  labels?: WaterfallChartLabels
): string {
  const { title, itemLabel } = { ...DEFAULT_WATERFALL_LABELS, ...labels };
  const emptyMsg =
    itemLabel === 'entry'
      ? 'No entry data with dateHandled timestamps.'
      : 'No request data with handledAt timestamps.';

  if (entries.length === 0) {
    return `
<div class="waterfall-chart-container">
  <h2 class="waterfall-chart-title">${escapeHtml(title)}</h2>
  <p class="waterfall-chart-empty">${escapeHtml(emptyMsg)}</p>
</div>`;
  }

  const starts = entries.map((e) => new Date(e.lastHandledAt).getTime());
  const ends = entries.map((e) => new Date(e.handledAt).getTime());
  const minTime = Math.min(...starts, ...ends);

  const rawEndSecs = entries.map((e) => (new Date(e.handledAt).getTime() - minTime) / 1000);
  const maxSec = Math.max(...rawEndSecs);
  const maxRounded = Math.max(60, Math.ceil(maxSec / 60) * 60);

  const PLOT_AREA_ESTIMATE_PX = 500; // Approx. x-axis span (chart is 600px; y-axis labels, padding)
  const MIN_BAR_PX = 3.5;
  const minBarSec = (MIN_BAR_PX / PLOT_AREA_ESTIMATE_PX) * maxRounded;

  const seriesData = entries.map((entry, i) => {
    const start = new Date(entry.lastHandledAt).getTime();
    const end = new Date(entry.handledAt).getTime();
    const durationSec = (end - start) / 1000;
    const startSec = (start - minTime) / 1000;
    let endSec = (end - minTime) / 1000;
    if (endSec - startSec < minBarSec) endSec = startSec + minBarSec;
    return {
      x: String(i + 1),
      y: [startSec, endSec],
      fillColor: '#008FFB',
      id: entry.id,
      url: entry.url,
      handledAt: entry.handledAt,
      durationSec,
    };
  });

  const tickAmount = Math.max(1, maxRounded / 60);
  // Vertical lines at each minute (annotations work around grid.xaxis.lines bug in rangeBar)
  const minuteMarks: number[] = [];
  for (let s = 0; s <= maxRounded; s += 60) minuteMarks.push(s);
  const annotationsJson = JSON.stringify(
    minuteMarks.map((x) => ({ x, borderColor: '#e0e0e0', strokeDashArray: 0 }))
  );
  const chartHeight = Math.min(500, Math.max(200, entries.length * 22));
  const containerId = `waterfall-${Math.random().toString(36).slice(2, 11)}`;
  const seriesDataJson = JSON.stringify(
    seriesData.map(({ x, y, fillColor }) => ({ x, y, fillColor }))
  ).replace(/</g, '\\u003c');
  const customDataJson = JSON.stringify(
    seriesData.map(({ id, url, handledAt, durationSec }) => ({
      id,
      url,
      handledAt,
      durationSec,
    }))
  ).replace(/</g, '\\u003c');

  const itemPlural = itemLabel === 'entry' ? 'entries' : 'requests';
  const itemSingular = itemLabel === 'entry' ? 'entry' : 'request';
  return `
<div class="waterfall-chart-container">
  <h2 class="waterfall-chart-title">${escapeHtml(title)}</h2>
  <p class="waterfall-chart-summary">${entries.length} ${itemPlural} — each bar: time from previous ${itemSingular} until this one was handled. Hover for ID, URL, timestamp.</p>
  <div id="${escapeHtml(containerId)}" class="waterfall-chart" style="width:600px;height:${chartHeight}px;"></div>
  <script src="https://cdn.jsdelivr.net/npm/apexcharts@3.45.1/dist/apexcharts.min.js"></script>
  <script>
(function(){
  var el=document.getElementById("${escapeHtml(containerId)}");
  if(!el||typeof ApexCharts==="undefined")return;
  var seriesData=${seriesDataJson};
  var customData=${customDataJson};
  var opts={
    series:[{data:seriesData}],
    chart:{height:${chartHeight},type:"rangeBar",toolbar:{show:true,tools:{zoom:true,zoomin:true,zoomout:true,pan:true,reset:true}}},
    plotOptions:{
      bar:{horizontal:true,distributed:true,barHeight:"70%",dataLabels:{hideOverflowingLabels:false}}
    },
    dataLabels:{
      enabled:true,
      formatter:function(val,opts){
        var d=customData[opts.dataPointIndex];
        return d?d.durationSec<1?(d.durationSec*1000).toFixed(0)+"ms":d.durationSec<60?d.durationSec.toFixed(1)+"s":Math.floor(d.durationSec/60)+"m "+(d.durationSec%60).toFixed(1)+"s":"";
      },
      style:{colors:["#f3f4f5","#fff"],fontSize:"11px"}
    },
    tooltip:{},
    xaxis:{
      type:"numeric",
      min:0,
      max:${maxRounded},
      tickAmount:${tickAmount},
      labels:{
        formatter:function(val){
          if(val<60)return val.toFixed(0)+"s";
          if(val<3600){var m=val/60;return m%1===0?m+"m":m.toFixed(1)+"m";}
          var h=val/3600;return h%1===0?h+"h":h.toFixed(1)+"h";
        }
      }
    },
    yaxis:{labels:{style:{fontSize:"11px"}}},
    grid:{row:{colors:["#f3f4f5","#fff"],opacity:1}},
    annotations:{xaxis:${annotationsJson}},
    legend:{show:false}
  };
  function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  function fmtDur(s){return s<1?(s*1000).toFixed(0)+"ms":s<60?s.toFixed(1)+"s":Math.floor(s/60)+"m "+(s%60).toFixed(1)+"s";}
  opts.tooltip.custom=function(o){var d=customData[o.dataPointIndex];if(!d)return"";return'<div class="apexcharts-tooltip-rangebar waterfall-tooltip"><div class="tt-row"><strong>ID:</strong> '+esc(d.id)+'</div><div class="tt-row"><strong>URL:</strong> '+esc(d.url)+'</div><div class="tt-row"><strong>Time taken:</strong> '+fmtDur(d.durationSec)+'</div><div class="tt-row"><strong>Handled:</strong> '+esc(d.handledAt)+'</div></div>';};
  new ApexCharts(el,opts).render();
})();
  </script>
</div>
<style>
  .waterfall-chart-container { margin: 1.5rem 0; }
  .waterfall-chart-title { font-size: 1rem; margin: 0 0 0.5rem; }
  .waterfall-chart-summary { font-size: 0.875rem; color: #666; margin: 0 0 1rem; }
  .waterfall-chart { border: 1px solid #ddd; border-radius: 4px; }
  .waterfall-tooltip .tt-row { margin: 4px 0; font-size: 12px; white-space: pre-wrap; word-break: break-all; }
</style>`;
}
