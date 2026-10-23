import React from 'react';
import {
  Play,
  Square,
  RotateCcw,
  Share2,
  DownloadCloud,
  FileSpreadsheet,
  Printer,
  Check
} from 'lucide-react';
import { SpeedTestPhase } from '../types';

interface TestControlsProps {
  phase: SpeedTestPhase;
  onStart: () => void;
  onStop: () => void;
  lightMode: boolean;
  setLightMode: (val: boolean) => void;
  onShare: () => void;
  onExportCsv: () => void;
  onPrintReport: () => void;
  hasResults: boolean;
  isDark: boolean;
  copiedShare: boolean;
}

export const TestControls: React.FC<TestControlsProps> = ({
  phase,
  onStart,
  onStop,
  lightMode,
  setLightMode,
  onShare,
  onExportCsv,
  onPrintReport,
  hasResults,
  isDark,
  copiedShare
}) => {
  const isRunning = ['latency', 'download', 'upload'].includes(phase);

  return (
    <div className="flex flex-col items-center justify-center gap-4 my-2 w-full">
      {/* Primary Action Button (GO / STOP / RETEST) */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing ring when running */}
        {isRunning && (
          <div className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-cyan-500/20 animate-ping pointer-events-none" />
        )}
        {/* Glow backdrop */}
        <div
          className={`absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full blur-xl transition-opacity duration-300 pointer-events-none ${
            isRunning
              ? 'bg-gradient-to-tr from-rose-500 to-amber-500 opacity-60'
              : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 opacity-50 group-hover:opacity-80'
          }`}
        />

        <button
          onClick={isRunning ? onStop : onStart}
          aria-label={isRunning ? 'Stop speed test' : 'Start speed test'}
          className={`relative z-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full font-black text-2xl tracking-wider transition-all duration-300 shadow-2xl flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer border-4 ${
            isRunning
              ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400/80 shadow-rose-900/60'
              : 'bg-gradient-to-b from-cyan-500 via-blue-600 to-blue-700 hover:from-cyan-400 hover:to-blue-600 text-white border-cyan-300/40 shadow-cyan-900/50'
          }`}
        >
          {isRunning ? (
            <>
              <Square className="w-8 h-8 fill-current" />
              <span className="text-sm font-mono font-bold tracking-widest mt-1">STOP</span>
            </>
          ) : hasResults ? (
            <>
              <RotateCcw className="w-8 h-8" />
              <span className="text-sm font-mono font-bold tracking-widest mt-1">AGAIN</span>
            </>
          ) : (
            <>
              <Play className="w-9 h-9 fill-current ml-1" />
              <span className="text-lg font-mono font-bold tracking-widest">GO</span>
            </>
          )}
        </button>
      </div>

      {/* Settings & Extras Row */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono mt-1">
        {/* Light mode toggle */}
        <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer select-none transition ${
          lightMode
            ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-semibold'
            : isDark
            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
        }`}>
          <input
            type="checkbox"
            checked={lightMode}
            onChange={(e) => setLightMode(e.target.checked)}
            disabled={isRunning}
            className="accent-cyan-500 rounded"
          />
          <span>Quick Mode (Lower data consumption)</span>
        </label>
      </div>

      {/* Post-Test Actions (Share, Export CSV, Print/PDF) */}
      {hasResults && !isRunning && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1 animate-fade-in">
          <button
            onClick={onShare}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition border ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200 hover:text-white'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Copy Result</span>
              </>
            )}
          </button>

          <button
            onClick={onExportCsv}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition border ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
            }`}
            title="Download CSV of tests"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onPrintReport}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition border ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
            }`}
            title="Print or Save PDF Report"
          >
            <Printer className="w-4 h-4 text-purple-400" />
            <span>Print / PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};
