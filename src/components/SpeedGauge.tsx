import React from 'react';
import { SpeedTestPhase } from '../types';

interface SpeedGaugeProps {
  currentSpeed: number; // in Mbps
  peakSpeed: number; // in Mbps
  phase: SpeedTestPhase;
  isDark: boolean;
  statusText: string;
}

export const SpeedGauge: React.FC<SpeedGaugeProps> = ({
  currentSpeed,
  peakSpeed,
  phase,
  isDark,
  statusText
}) => {
  // Max scale 1000 Mbps with logarithmic interpolation
  const maxScale = 1000;
  const safeSpeed = Math.max(0, currentSpeed);

  // Log scale so both low speeds (5 Mbps) and gigabit speeds (900 Mbps) have dynamic needle movement
  const progressRatio = Math.min(1, Math.log10(1 + safeSpeed) / Math.log10(1 + maxScale));
  
  // Circumference for radius 110: 2 * Math.PI * 110 = ~691.15
  // We use a 240-degree arc: total dash length is 691.15 * (240 / 360) = 460.77
  const arcLength = 460.77;
  const strokeOffset = arcLength - (arcLength * progressRatio);

  // Needle angle: from -120 deg to +120 deg
  const needleAngle = -120 + (240 * progressRatio);

  // Format display numbers
  let displayValue = '0.0';
  let displayUnit = 'Mbps';

  if (safeSpeed >= 1000) {
    displayValue = (safeSpeed / 1000).toFixed(2);
    displayUnit = 'Gbps';
  } else if (safeSpeed >= 100) {
    displayValue = safeSpeed.toFixed(0);
    displayUnit = 'Mbps';
  } else if (safeSpeed >= 10) {
    displayValue = safeSpeed.toFixed(1);
    displayUnit = 'Mbps';
  } else if (safeSpeed > 0) {
    displayValue = safeSpeed.toFixed(2);
    displayUnit = 'Mbps';
  }

  // Ticks at key logarithmic points: 0, 5, 25, 100, 250, 500, 1000
  const ticks = [0, 5, 25, 100, 250, 500, 1000];

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      {/* Test Status Badge */}
      <div className="h-8 flex items-center justify-center mb-1">
        <div
          className={`px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider flex items-center gap-2 transition-all ${
            phase === 'download'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : phase === 'upload'
              ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
              : phase === 'latency'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : phase === 'complete'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : phase === 'error' || phase === 'aborted'
              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              : isDark
              ? 'bg-slate-900/60 text-slate-400 border border-slate-800'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}
        >
          {['latency', 'download', 'upload'].includes(phase) && (
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
          )}
          <span>{statusText.toUpperCase()}</span>
        </div>
      </div>

      {/* SVG Circular Gauge */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
        <svg
          className="w-full h-full transform"
          viewBox="0 0 260 260"
          aria-label="Speedometer Gauge"
        >
          <defs>
            {/* Gauge Gradient */}
            <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <linearGradient id="needleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc (240 degrees, centered at 130, 130) */}
          <circle
            cx="130"
            cy="130"
            r="105"
            fill="none"
            stroke={isDark ? '#1e293b' : '#e2e8f0'}
            strokeWidth="12"
            strokeDasharray="439.82 220"
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(150 130 130)"
          />

          {/* Foreground Active Speed Arc */}
          <circle
            cx="130"
            cy="130"
            r="105"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeDasharray="439.82 220"
            strokeDashoffset={439.82 - (439.82 * progressRatio)}
            strokeLinecap="round"
            transform="rotate(150 130 130)"
            filter="url(#gaugeGlow)"
            className="gauge-ring"
          />

          {/* Tick marks around the dial */}
          {ticks.map((val) => {
            const ratio = Math.log10(1 + val) / Math.log10(1 + maxScale);
            const angleDeg = -120 + (240 * ratio);
            const angleRad = (angleDeg - 90) * (Math.PI / 180);
            const tickInnerR = 86;
            const tickOuterR = 94;
            const textR = 74;

            const x1 = 130 + tickInnerR * Math.cos(angleRad);
            const y1 = 130 + tickInnerR * Math.sin(angleRad);
            const x2 = 130 + tickOuterR * Math.cos(angleRad);
            const y2 = 130 + tickOuterR * Math.sin(angleRad);
            const tx = 130 + textR * Math.cos(angleRad);
            const ty = 130 + textR * Math.sin(angleRad) + 3;

            return (
              <g key={val}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.5)'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  fontSize="8"
                  fill={isDark ? '#94a3b8' : '#64748b'}
                  className="font-mono font-medium"
                >
                  {val >= 1000 ? '1G' : val}
                </text>
              </g>
            );
          })}

          {/* Needle Pointer */}
          <g transform={`rotate(${needleAngle} 130 130)`} className="transition-transform duration-150 ease-out">
            <polygon
              points="127,130 133,130 130.5,35 129.5,35"
              fill="url(#needleGradient)"
              filter="drop-shadow(0 0 6px rgba(56, 189, 248, 0.6))"
            />
            {/* Center Pivot Pin */}
            <circle cx="130" cy="130" r="10" fill={isDark ? '#0f172a' : '#ffffff'} stroke="#0284c7" strokeWidth="4" />
            <circle cx="130" cy="130" r="4" fill="#38bdf8" />
          </g>
        </svg>

        {/* Center Digital Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-8">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-5xl sm:text-6xl font-black font-mono tracking-tight transition-colors ${
                safeSpeed > 0
                  ? isDark
                    ? 'text-white drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                    : 'text-slate-900'
                  : isDark
                  ? 'text-slate-400'
                  : 'text-slate-400'
              }`}
            >
              {displayValue}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold font-mono tracking-widest text-cyan-400 uppercase mt-0.5">
            {displayUnit}
          </span>

          {/* Peak Speed Marker */}
          {peakSpeed > 0 && (
            <div className={`mt-2 text-[10px] sm:text-xs font-mono font-medium px-2 py-0.5 rounded ${
              isDark ? 'bg-slate-900/80 text-slate-400 border border-slate-800' : 'bg-slate-100 text-slate-600'
            }`}>
              PEAK: <span className="text-cyan-400 font-bold">{peakSpeed >= 1000 ? (peakSpeed/1000).toFixed(2) + ' Gbps' : peakSpeed.toFixed(1) + ' Mbps'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
