import React, { useState } from 'react';
import {
  HelpCircle,
  Calculator,
  ChevronDown,
  Activity,
  Zap,
  Clock,
  Shield,
  Layers
} from 'lucide-react';

interface EducationalSectionProps {
  isDark: boolean;
}

export const EducationalSection: React.FC<EducationalSectionProps> = ({ isDark }) => {
  const [calcSpeedMbps, setCalcSpeedMbps] = useState<number>(100);
  const [calcFileSizeGb, setCalcFileSizeGb] = useState<number>(10);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Conversion: 1 Byte = 8 bits
  const speedMBs = calcSpeedMbps / 8;
  const timeSeconds = (calcFileSizeGb * 1024 * 8) / Math.max(0.1, calcSpeedMbps);

  const formatDownloadDuration = (sec: number) => {
    if (sec < 60) return `${Math.ceil(sec)} seconds`;
    if (sec < 3600) {
      const mins = Math.floor(sec / 60);
      const remSec = Math.ceil(sec % 60);
      return `${mins} min ${remSec > 0 ? `${remSec}s` : ''}`;
    }
    const hrs = Math.floor(sec / 3600);
    const mins = Math.ceil((sec % 3600) / 60);
    return `${hrs} hr ${mins} min`;
  };

  const faqs = [
    {
      q: 'Why do speed test results differ between FastMode, Ookla, and Fast.com?',
      a: 'Speed tests connect to different content delivery networks (CDNs) and physical hosting centers. Fast.com connects primarily to Netflix Open Connect servers, Ookla connects to local ISP-sponsored servers, and FastMode tests against global Cloudflare Anycast edge nodes. Furthermore, browser extensions, VPNs, Wi-Fi collisions, and active background downloads can alter the test sample.'
    },
    {
      q: 'What is Bufferbloat and why does my ping jump during downloads?',
      a: 'Bufferbloat happens when your router buffers excessive packets in a queue instead of transmitting or dropping them immediately. When someone is downloading a large file or updating a game, gaming ping spikes from 20ms to 250ms+. FastMode measures loaded ping to give you an authentic bufferbloat grade (A+ through F). Implementing Smart Queue Management (SQM / CAKE / FQ-CoDel) on your router eliminates bufferbloat.'
    },
    {
      q: 'What is the exact difference between Mbps and MB/s?',
      a: 'Internet Service Providers sell speed in Megabits per second (Mbps with lowercase "b"), whereas operating systems and Steam report download sizes in MegaBytes (MB with uppercase "B"). Because 8 bits equal 1 byte, a 100 Mbps internet connection downloads at a maximum theoretical speed of 12.5 MB/s (100 / 8 = 12.5).'
    },
    {
      q: 'What is an acceptable Ping (Latency) and Jitter for gaming & video calls?',
      a: 'Latency under 20ms is esports tournament tier; 20-50ms is standard for great gaming and instant video calls; 50-100ms is playable for casual games; 100ms+ causes noticeable delay and rubber-banding. Jitter measures the variance in latency: ideally, jitter should be below 5ms.'
    },
    {
      q: 'Does changing DNS increase my raw download speed?',
      a: 'Changing your DNS server does not increase your raw bandwidth (your cable or fiber pipe remains the same). However, public DNS like Cloudflare (1.1.1.1) or Google (8.8.8.8) resolves website hostnames in 10-25ms compared to 80-120ms on overloaded ISP resolvers, making web browsing feel noticeably snappier and bypassing ISP DNS filtering.'
    },
    {
      q: 'Why is upload speed usually lower than download on home connections?',
      a: 'Most residential cable (DOCSIS) and DSL lines are asymmetric by design because typical households consume far more multimedia downstream than they upload upstream. Only symmetrical Fiber-to-the-Home (FTTH) connections generally deliver equal download and upload speeds (e.g., 500 Mbps down / 500 Mbps up).'
    }
  ];

  return (
    <section id="education" className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Knowledge Base & Calculators</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Internet Speed Mechanics & Calculator
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Everything you need to master bandwidth vs transfer rates, latency, bufferbloat, and network optimization.
        </p>
      </div>

      {/* Interactive Mbps to MB/s Calculator */}
      <div className={`p-6 rounded-2xl border ${
        isDark ? 'glass-panel' : 'glass-panel-light'
      }`}>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/60">
          <Calculator className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-base">Interactive Download Time & Mbps Converter</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Your Connection Speed:</span>
                <span className="text-cyan-400 font-bold">{calcSpeedMbps} Mbps</span>
              </label>
              <input
                type="range"
                min={5}
                max={1000}
                step={5}
                value={calcSpeedMbps}
                onChange={(e) => setCalcSpeedMbps(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>5 Mbps</span>
                <span>250 Mbps</span>
                <span>500 Mbps</span>
                <span>1000 Mbps</span>
              </div>
            </div>

            <div>
              <label className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>File Download Size:</span>
                <span className="text-emerald-400 font-bold">{calcFileSizeGb} GB</span>
              </label>
              <input
                type="range"
                min={1}
                max={150}
                step={1}
                value={calcFileSizeGb}
                onChange={(e) => setCalcFileSizeGb(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>1 GB (Film)</span>
                <span>50 GB (Game)</span>
                <span>100 GB (4K Game)</span>
                <span>150 GB</span>
              </div>
            </div>
          </div>

          {/* Results Summary Box (2 cols) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[11px] font-mono uppercase text-slate-400">Actual Transfer Rate</div>
              <div className="mt-2 text-3xl font-extrabold font-mono text-cyan-400">
                {speedMBs.toFixed(1)} <span className="text-lg">MB/s</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Speed reported in Steam, Epic Games, Torrents, and web browser file downloads.
              </p>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-[11px] font-mono uppercase text-slate-400">Estimated Duration</div>
              <div className="mt-2 text-3xl font-extrabold font-mono text-emerald-400">
                {formatDownloadDuration(timeSeconds)}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Time required to download a {calcFileSizeGb} GB file on a continuous {calcSpeedMbps} Mbps link.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className={`p-6 rounded-2xl border ${
        isDark ? 'glass-panel' : 'glass-panel-light'
      }`}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-xl border transition-colors ${
                  isDark ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-sm select-none gap-3"
                >
                  <span className={isOpen ? 'text-cyan-400' : 'text-slate-200'}>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
