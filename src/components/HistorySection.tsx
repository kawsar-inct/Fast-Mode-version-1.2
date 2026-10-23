import React, { useState } from 'react';
import {
  History,
  FileSpreadsheet,
  Download,
  Trash2,
  Printer,
  Search,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SpeedTestResult } from '../types';
import { exportHistoryAsCsv, exportHistoryAsJson } from '../services/historyStorage';

interface HistorySectionProps {
  history: SpeedTestResult[];
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
  isDark: boolean;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onDeleteItem,
  onClearHistory,
  isDark
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = history.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.serverName.toLowerCase().includes(q) ||
      (item.isp && item.isp.toLowerCase().includes(q)) ||
      (item.ip && item.ip.includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q)) ||
      new Date(item.timestamp).toLocaleDateString().includes(q)
    );
  });

  // Calculate statistics
  const bestDown = history.reduce((m, item) => Math.max(m, item.downloadMbps), 0);
  const bestUp = history.reduce((m, item) => Math.max(m, item.uploadMbps), 0);
  const lowestPing = history.reduce((m, item) => (m === 0 ? item.ping : Math.min(m, item.ping)), 0);
  const avgDown = history.length
    ? history.reduce((s, item) => s + item.downloadMbps, 0) / history.length
    : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="history" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Speed Test Log & Export</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Historical Test Performance
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Track connection speed fluctuations over time, benchmark your ISP against contractual guarantees, and export audit-ready CSV, JSON, or PDF reports.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportHistoryAsCsv(history)}
            disabled={!history.length}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium border transition ${
              history.length
                ? isDark
                  ? 'bg-slate-900 border-slate-700 text-emerald-400 hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-emerald-600 hover:bg-slate-50'
                : 'opacity-50 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => exportHistoryAsJson(history)}
            disabled={!history.length}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium border transition ${
              history.length
                ? isDark
                  ? 'bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-blue-600 hover:bg-slate-50'
                : 'opacity-50 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>JSON</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={!history.length}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium border transition ${
              history.length
                ? isDark
                  ? 'bg-slate-900 border-slate-700 text-purple-400 hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-purple-600 hover:bg-slate-50'
                : 'opacity-50 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          {history.length > 0 && (
            <button
              onClick={() => {
                if (confirmClear) {
                  onClearHistory();
                  setConfirmClear(false);
                } else {
                  setConfirmClear(true);
                  setTimeout(() => setConfirmClear(false), 4000);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>{confirmClear ? 'Confirm Delete All?' : 'Clear History'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      {history.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={`p-4 rounded-xl border ${isDark ? 'glass-panel' : 'glass-panel-light'}`}>
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-400" />
              Peak Download
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
              {bestDown >= 1000 ? `${(bestDown / 1000).toFixed(2)} Gbps` : `${bestDown.toFixed(1)} Mbps`}
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'glass-panel' : 'glass-panel-light'}`}>
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <ArrowUpCircle className="w-3.5 h-3.5 text-purple-400" />
              Peak Upload
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-purple-400 mt-1">
              {bestUp >= 1000 ? `${(bestUp / 1000).toFixed(2)} Gbps` : `${bestUp.toFixed(1)} Mbps`}
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'glass-panel' : 'glass-panel-light'}`}>
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Lowest Ping
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
              {lowestPing.toFixed(1)} ms
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'glass-panel' : 'glass-panel-light'}`}>
            <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Average Download
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-blue-400 mt-1">
              {avgDown.toFixed(1)} Mbps
            </div>
          </div>
        </div>
      )}

      {/* Filter search bar */}
      {history.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by server, ISP, IP, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-mono transition outline-none ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
            }`}
          />
        </div>
      )}

      {/* History Records Table / Cards */}
      <div className={`rounded-2xl border overflow-hidden ${
        isDark ? 'glass-panel' : 'glass-panel-light'
      }`}>
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className={`border-b ${
                isDark ? 'bg-slate-900/80 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                <tr>
                  <th className="py-3 px-4 font-semibold">Date & Time</th>
                  <th className="py-3 px-4 font-semibold">Download</th>
                  <th className="py-3 px-4 font-semibold">Upload</th>
                  <th className="py-3 px-4 font-semibold">Ping / Jitter</th>
                  <th className="py-3 px-4 font-semibold">Bufferbloat</th>
                  <th className="py-3 px-4 font-semibold">Server & Network</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered.map((item) => {
                  const dateStr = new Date(item.timestamp).toLocaleString();
                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isDark ? 'hover:bg-slate-900/60' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-emerald-400 font-bold whitespace-nowrap">
                        {item.downloadMbps >= 1000
                          ? `${(item.downloadMbps / 1000).toFixed(2)} Gbps`
                          : `${item.downloadMbps.toFixed(2)} Mbps`}
                      </td>

                      <td className="py-3 px-4 text-purple-400 font-bold whitespace-nowrap">
                        {item.uploadMbps >= 1000
                          ? `${(item.uploadMbps / 1000).toFixed(2)} Gbps`
                          : `${item.uploadMbps.toFixed(2)} Mbps`}
                      </td>

                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        <span className="text-cyan-400 font-bold">{item.ping.toFixed(1)} ms</span>
                        <span className="text-slate-500 ml-1.5">(±{item.jitter.toFixed(1)}ms)</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded font-bold border ${
                          item.bufferbloatGrade === 'A+' || item.bufferbloatGrade === 'A'
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                            : item.bufferbloatGrade === 'B'
                            ? 'text-blue-400 bg-blue-500/10 border-blue-500/30'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                        }`}>
                          {item.bufferbloatGrade}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-400 max-w-[200px] truncate" title={`${item.serverName} | ${item.isp || ''}`}>
                        <div className="font-semibold text-slate-200 truncate">{item.serverName}</div>
                        <div className="text-[10px] text-slate-500 truncate">{item.isp || item.ip || 'Local Node'}</div>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Delete from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs font-mono space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
            <p>No speed test records found.</p>
            <p className="text-[11px] text-slate-600">Run your first test from the Speed Test tab to log benchmark data.</p>
          </div>
        )}
      </div>
    </section>
  );
};
