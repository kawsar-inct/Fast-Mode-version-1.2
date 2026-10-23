import React from 'react';
import {
  Tv,
  Gamepad2,
  Video,
  CloudDownload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import { SpeedTestResult } from '../types';

interface ResultsSummaryCardProps {
  result: SpeedTestResult;
  isDark: boolean;
}

export const ResultsSummaryCard: React.FC<ResultsSummaryCardProps> = ({
  result,
  isDark
}) => {
  const { downloadMbps, uploadMbps, ping, jitter, bufferbloatGrade } = result;

  // Streaming rating: 25 Mbps is standard for 4K UHD
  const canStream4K = downloadMbps >= 25;
  const canStream8K = downloadMbps >= 75;

  // Gaming rating: depends heavily on ping + jitter
  const isGamingPro = ping <= 25 && jitter <= 6;
  const isGamingGood = ping <= 50 && jitter <= 15;
  const isGamingFair = ping <= 95;

  // Video calls: 5-10 Mbps down and 3-5 Mbps up with low jitter
  const canVideoCallHD = downloadMbps >= 8 && uploadMbps >= 3;

  // Download time estimate for 25GB game / video
  const calculateDownloadTime = (gb: number) => {
    if (downloadMbps <= 0) return 'N/A';
    const totalBits = gb * 8 * 1024; // Megabits
    const seconds = totalBits / downloadMbps;
    if (seconds < 60) return `${Math.ceil(seconds)} sec`;
    if (seconds < 3600) return `${Math.ceil(seconds / 60)} min`;
    return `${(seconds / 3600).toFixed(1)} hrs`;
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all ${
      isDark ? 'glass-panel' : 'glass-panel-light'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60 mb-5">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>Connection Capability Analysis</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Verified
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-world application performance based on your measured bandwidth and latency.
          </p>
        </div>

        {/* Bufferbloat Score Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700/80 bg-slate-900/60">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase text-slate-400">Bufferbloat Score</div>
            <div className="text-xs font-mono text-slate-300">Traffic under load</div>
          </div>
          <span className={`text-xl font-black font-mono px-2 py-0.5 rounded-lg border ${
            bufferbloatGrade === 'A+' || bufferbloatGrade === 'A'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
              : bufferbloatGrade === 'B'
              ? 'bg-blue-500/15 text-blue-400 border-blue-500/40'
              : bufferbloatGrade === 'C'
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
              : 'bg-rose-500/15 text-rose-400 border-rose-500/40'
          }`}>
            {bufferbloatGrade}
          </span>
        </div>
      </div>

      {/* Activity Suitability Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. 4K/8K Video Streaming */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Tv className="w-5 h-5" />
            </div>
            {canStream4K ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {canStream8K ? '8K Ready' : '4K Ready'}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                HD Only
              </span>
            )}
          </div>
          <div className="mt-3">
            <h4 className="font-bold text-sm">Media Streaming</h4>
            <p className="text-xs text-slate-400 mt-1">
              {canStream8K
                ? 'Flawless multi-screen 4K/8K HDR streaming simultaneously.'
                : canStream4K
                ? 'Smooth 4K Ultra HD streaming on Netflix, YouTube, and Apple TV+.'
                : 'Supports 1080p Full HD streaming; 4K may buffer periodically.'}
            </p>
          </div>
        </div>

        {/* 2. Online Gaming */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
            {isGamingPro ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-cyan-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Pro Esports
              </span>
            ) : isGamingGood ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Good Gaming
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                Casual Lag
              </span>
            )}
          </div>
          <div className="mt-3">
            <h4 className="font-bold text-sm">Online Gaming</h4>
            <p className="text-xs text-slate-400 mt-1">
              {isGamingPro
                ? 'Competitive tournament tier. Ultra-low ping and minimal jitter.'
                : isGamingGood
                ? 'Responsive for FPS, battle royales, and multiplayer servers.'
                : isGamingFair
                ? 'Playable for casual games, occasional input lag possible.'
                : 'High latency detected. Expect rubber-banding in multiplayer.'}
            </p>
          </div>
        </div>

        {/* 3. HD Video Conferencing */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            {canVideoCallHD ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                HD Video Calls
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                SD Only
              </span>
            )}
          </div>
          <div className="mt-3">
            <h4 className="font-bold text-sm">Video Conferencing</h4>
            <p className="text-xs text-slate-400 mt-1">
              {canVideoCallHD
                ? 'High-definition 1080p screen-sharing on Zoom, Teams & Google Meet.'
                : 'Limited upload bandwidth. Video quality may scale down.'}
            </p>
          </div>
        </div>

        {/* 4. Large Downloads & Backups */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <CloudDownload className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-semibold text-purple-400">
              ~{calculateDownloadTime(10)} for 10 GB
            </span>
          </div>
          <div className="mt-3">
            <h4 className="font-bold text-sm">Download Estimates</h4>
            <div className="text-xs text-slate-400 mt-1 space-y-0.5 font-mono">
              <div>1 GB video: ~{calculateDownloadTime(1)}</div>
              <div>50 GB game: ~{calculateDownloadTime(50)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
