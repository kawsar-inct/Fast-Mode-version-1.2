import React from 'react';
import { TimePoint } from '../types';
import { TrendingUp, Activity } from 'lucide-react';

interface LiveChartsProps {
  downloadSeries: TimePoint[];
  uploadSeries: TimePoint[];
  latencySamples: number[];
  isDark: boolean;
  phase: string;
}

export const LiveCharts: React.FC<LiveChartsProps> = ({
  downloadSeries,
  uploadSeries,
  latencySamples,
  isDark,
  phase
}) => {
  const hasThroughputData = downloadSeries.length > 1 || uploadSeries.length > 1;
  const hasLatencyData = latencySamples.length > 0;

  // Compute maximum Mbps for scaling the Y axis
  const maxDownload = downloadSeries.reduce((m, p) => Math.max(m, p.mbps), 0);
  const maxUpload = uploadSeries.reduce((m, p) => Math.max(m, p.mbps), 0);
  const maxMbps = Math.max(20, Math.ceil(Math.max(maxDownload, maxUpload) * 1.15));

  // Max duration (e.g. 8000ms or highest recorded)
  const maxTimeMs = Math.max(
    8000,
    ...downloadSeries.map((p) => p.timeMs),
    ...uploadSeries.map((p) => p.timeMs)
  );

  const chartWidth = 500;
  const chartHeight = 160;
  const padding = { top: 15, right: 15, bottom: 25, left: 40 };

  const usableWidth = chartWidth - padding.left - padding.right;
  const usableHeight = chartHeight - padding.top - padding.bottom;

  function toPath(points: TimePoint[]): { linePath: string; areaPath: string } {
    if (!points.length) return { linePath: '', areaPath: '' };
    const coords = points.map((p) => {
      const x = padding.left + (Math.min(p.timeMs, maxTimeMs) / maxTimeMs) * usableWidth;
      const y = padding.top + usableHeight - (Math.min(p.mbps, maxMbps) / maxMbps) * usableHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const linePath = `M ${coords.join(' L ')}`;
    const firstX = padding.left + (Math.min(points[0].timeMs, maxTimeMs) / maxTimeMs) * usableWidth;
    const lastX = padding.left + (Math.min(points[points.length - 1].timeMs, maxTimeMs) / maxTimeMs) * usableWidth;
    const bottomY = padding.top + usableHeight;
    const areaPath = `${linePath} L ${lastX.toFixed(1)},${bottomY} L ${firstX.toFixed(1)},${bottomY} Z`;

    return { linePath, areaPath };
  }

  const dlPaths = toPath(downloadSeries);
  const ulPaths = toPath(uploadSeries);

  // Latency samples normalization
  const maxLatency = Math.max(40, Math.ceil(Math.max(...latencySamples, 0) * 1.25));

  return (
    <div className={`p-4 rounded-2xl border transition-colors ${
      isDark ? 'glass-panel' : 'glass-panel-light'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold tracking-wide">Live Performance Telemetry</h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Download</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span className="text-slate-400">Upload</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-400">Ping</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Throughput Chart (2 cols) */}
        <div className="lg:col-span-2 relative">
          <svg
            className="w-full h-44 overflow-visible"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="ulGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + usableHeight * (1 - ratio);
              const labelVal = Math.round(maxMbps * ratio);
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke={isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)'}
                    strokeDasharray={ratio > 0 && ratio < 1 ? '3 3' : undefined}
                  />
                  <text
                    x={padding.left - 6}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="9"
                    fill={isDark ? '#64748b' : '#94a3b8'}
                    className="font-mono"
                  >
                    {labelVal}
                  </text>
                </g>
              );
            })}

            {/* Time labels on bottom */}
            {[0, 2, 4, 6, 8].map((sec) => {
              const time = sec * 1000;
              const x = padding.left + (time / maxTimeMs) * usableWidth;
              return (
                <text
                  key={sec}
                  x={x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fill={isDark ? '#64748b' : '#94a3b8'}
                  className="font-mono"
                >
                  {sec}s
                </text>
              );
            })}

            {/* Download Curve */}
            {dlPaths.areaPath && (
              <path d={dlPaths.areaPath} fill="url(#dlGrad)" />
            )}
            {dlPaths.linePath && (
              <path
                d={dlPaths.linePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Upload Curve */}
            {ulPaths.areaPath && (
              <path d={ulPaths.areaPath} fill="url(#ulGrad)" />
            )}
            {ulPaths.linePath && (
              <path
                d={ulPaths.linePath}
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>

          {!hasThroughputData && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs font-mono text-slate-500">
                {phase === 'idle' ? 'Start test to view real-time throughput graph' : 'Awaiting throughput telemetry...'}
              </span>
            </div>
          )}
        </div>

        {/* Latency Stability Distribution / Sparkline (1 col) */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Latency Probes
            </span>
            <span className="text-cyan-400 font-bold">{latencySamples.length} samples</span>
          </div>

          <div className="my-2 h-24 flex items-end justify-between gap-1 px-1">
            {hasLatencyData ? (
              latencySamples.map((sample, idx) => {
                const heightPct = Math.min(100, Math.max(10, (sample / maxLatency) * 100));
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                  >
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full rounded-t bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:from-emerald-500 group-hover:to-cyan-300 transition-all"
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-cyan-300 border border-slate-700 text-[10px] font-mono px-1 rounded pointer-events-none z-10">
                      {Math.round(sample)}ms
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[11px] font-mono text-slate-500">
                Awaiting ping samples...
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/40">
            <span>Scale: 0 - {maxLatency} ms</span>
            <span>Target: &lt; 30 ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
