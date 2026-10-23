import React from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  Activity,
  ShieldAlert,
  Database
} from 'lucide-react';
import { SpeedTestPhase, BufferbloatGrade } from '../types';

interface MetricsGridProps {
  ping: number | null;
  jitter: number | null;
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  loadedPingDown?: number;
  loadedPingUp?: number;
  bufferbloatGrade?: BufferbloatGrade;
  bytesUsed: number;
  phase: SpeedTestPhase;
  isDark: boolean;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  ping,
  jitter,
  downloadSpeed,
  uploadSpeed,
  loadedPingDown,
  loadedPingUp,
  bufferbloatGrade,
  bytesUsed,
  phase,
  isDark
}) => {
  const formatSpeed = (val: number | null) => {
    if (val === null) return '--';
    if (val >= 1000) return `${(val / 1000).toFixed(2)} Gbps`;
    if (val >= 100) return `${val.toFixed(0)} Mbps`;
    if (val >= 10) return `${val.toFixed(1)} Mbps`;
    return `${val.toFixed(2)} Mbps`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
    if (bytes >= 1e3) return `${Math.round(bytes / 1e3)} KB`;
    return `${bytes} B`;
  };

  const getGradeColor = (grade?: BufferbloatGrade) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'B':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'C':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'D':
      case 'F':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-slate-400 bg-slate-800/30 border-slate-700/50';
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
      {/* 1. Ping Card */}
      <div
        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
          phase === 'latency'
            ? 'border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/10'
            : isDark
            ? 'glass-panel hover:border-slate-700'
            : 'glass-panel-light hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Ping (Idle)
          </span>
          {phase === 'latency' && (
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono tracking-tight text-cyan-400">
            {ping !== null ? ping : '--'}
          </span>
          <span className="text-xs font-mono text-slate-400">ms</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">
          {loadedPingDown ? `+${Math.max(0, Math.round(loadedPingDown - (ping || 0)))}ms under DL` : 'Latency to server'}
        </div>
      </div>

      {/* 2. Jitter Card */}
      <div
        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
          isDark ? 'glass-panel hover:border-slate-700' : 'glass-panel-light hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            Jitter
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono tracking-tight text-amber-400">
            {jitter !== null ? jitter : '--'}
          </span>
          <span className="text-xs font-mono text-slate-400">ms</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">
          {jitter !== null && jitter < 5 ? 'Excellent stability' : 'Latency variance'}
        </div>
      </div>

      {/* 3. Download Speed Card */}
      <div
        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
          phase === 'download'
            ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
            : isDark
            ? 'glass-panel hover:border-slate-700'
            : 'glass-panel-light hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-400" />
            Download
          </span>
          {phase === 'download' && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-emerald-400 truncate">
            {downloadSpeed !== null ? formatSpeed(downloadSpeed) : '--'}
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">
          Multi-stream throughput
        </div>
      </div>

      {/* 4. Upload Speed Card */}
      <div
        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
          phase === 'upload'
            ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/10'
            : isDark
            ? 'glass-panel hover:border-slate-700'
            : 'glass-panel-light hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ArrowUpCircle className="w-3.5 h-3.5 text-purple-400" />
            Upload
          </span>
          {phase === 'upload' && (
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-purple-400 truncate">
            {uploadSpeed !== null ? formatSpeed(uploadSpeed) : '--'}
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">
          Outbound speed
        </div>
      </div>

      {/* 5. Bufferbloat Card */}
      <div
        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
          isDark ? 'glass-panel hover:border-slate-700' : 'glass-panel-light hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            Bufferbloat
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          {bufferbloatGrade ? (
            <span className={`text-lg font-black font-mono px-2.5 py-0.5 rounded-lg border ${getGradeColor(bufferbloatGrade)}`}>
              {bufferbloatGrade}
            </span>
          ) : (
            <span className="text-xl font-bold font-mono text-slate-500">--</span>
          )}
          {loadedPingDown && ping && (
            <span className="text-[10px] font-mono text-slate-400">
              +{Math.max(0, Math.round(loadedPingDown - ping))}ms
            </span>
          )}
        </div>
        <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">
          {bufferbloatGrade === 'A+' || bufferbloatGrade === 'A' ? 'Minimal lag under load' : 'Lag under traffic'}
        </div>
      </div>

      {/* 6. Data Transferred Card */}
      <div
        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
          isDark ? 'glass-panel hover:border-slate-700' : 'glass-panel-light hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            Data Used
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono tracking-tight text-slate-200">
            {bytesUsed > 0 ? formatBytes(bytesUsed) : '--'}
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">
          Total transferred
        </div>
      </div>
    </div>
  );
};
