import React from 'react';
import {
  Wifi,
  ExternalLink,
  Download,
  Layers,
  Radio,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Maximize2
} from 'lucide-react';

interface WifiToolsSectionProps {
  isDark: boolean;
}

export const WifiToolsSection: React.FC<WifiToolsSectionProps> = ({ isDark }) => {
  const tools = [
    {
      name: 'NetSpot Wi-Fi Site Survey',
      category: 'Heatmap & Survey',
      description: 'Professional visual Wi-Fi site surveys and dead zone mapping for home and office wireless deployments.',
      platforms: ['Windows', 'macOS', 'Android'],
      url: 'https://www.netspotapp.com/download.html',
      badge: 'Best for Heatmaps',
      color: 'blue'
    },
    {
      name: 'WiFi Analyzer Pro',
      category: 'Channel Spectrum',
      description: 'Real-time 2.4 GHz and 5 GHz frequency grapher to detect overlapping neighbor SSIDs and pick clean channels.',
      platforms: ['Windows 10/11', 'Android'],
      url: 'https://apps.microsoft.com/store/detail/wifi-analyzer/9NBLGGH33N0N',
      badge: 'Channel Scanner',
      color: 'emerald'
    },
    {
      name: 'Acrylic Wi-Fi Scanner',
      category: '802.11ax/ac Security',
      description: 'Enterprise wireless packet analyzer displaying 802.11be/ax/ac signal strength, channel widths, and WPA3 security.',
      platforms: ['Windows'],
      url: 'https://www.acrylicwifi.com/en/downloads-free-license-wifi-wireless-network-software-tools/download-wifi-scanner-windows/',
      badge: 'Protocol Sniffer',
      color: 'purple'
    }
  ];

  return (
    <section id="wifi" className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <Wifi className="w-4 h-4" />
          <span>Wireless Signal Optimization</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Wi-Fi Diagnostics & Channel Analyzer
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Discover interference, eliminate dead zones, and optimize wireless router settings for peak throughput and minimum latency.
        </p>
      </div>

      {/* Recommended Diagnostics Software */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tools.map((tool) => (
          <div
            key={tool.name}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all hover:scale-[1.01] ${
              isDark ? 'glass-panel hover:border-slate-600' : 'glass-panel-light hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  tool.color === 'blue'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : tool.color === 'emerald'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                }`}>
                  {tool.badge}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{tool.category}</span>
              </div>

              <h3 className="font-bold text-lg text-slate-100 mb-2">{tool.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {tool.description}
              </p>

              {/* Supported Platforms */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {tool.platforms.map((p) => (
                  <span
                    key={p}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isDark ? 'bg-slate-900 text-slate-400 border border-slate-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-mono text-xs font-bold transition shadow ${
                tool.color === 'blue'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
                  : tool.color === 'emerald'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/30'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Download Free</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        ))}
      </div>

      {/* Wi-Fi Frequency Comparison (2.4 GHz vs 5 GHz vs 6 GHz) */}
      <div className={`p-6 rounded-2xl border ${
        isDark ? 'glass-panel' : 'glass-panel-light'
      }`}>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/60">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-base">Wi-Fi Bands: 2.4 GHz vs 5 GHz vs 6 GHz (Wi-Fi 6E/7)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* 2.4 GHz */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-bold text-sm text-cyan-400 mb-1 flex items-center justify-between">
              <span>2.4 GHz Band</span>
              <span className="text-[10px] text-slate-500 font-mono">Long Range</span>
            </div>
            <ul className="space-y-1.5 text-slate-400 mt-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Travels deeply through solid walls and long distances.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Compatible with all legacy smart home IoT devices.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>High congestion; speeds capped at 50-150 Mbps real-world.</span>
              </li>
            </ul>
          </div>

          {/* 5 GHz */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-bold text-sm text-emerald-400 mb-1 flex items-center justify-between">
              <span>5 GHz Band</span>
              <span className="text-[10px] text-slate-500 font-mono">High Speed</span>
            </div>
            <ul className="space-y-1.5 text-slate-400 mt-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Real-world speeds up to 400-800 Mbps on 80MHz channels.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Much lower interference from neighbor networks.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Weaker wall penetration; optimal in same or adjacent room.</span>
              </li>
            </ul>
          </div>

          {/* 6 GHz */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-bold text-sm text-purple-400 mb-1 flex items-center justify-between">
              <span>6 GHz (Wi-Fi 6E & 7)</span>
              <span className="text-[10px] text-slate-500 font-mono">Ultra Bandwidth</span>
            </div>
            <ul className="space-y-1.5 text-slate-400 mt-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Ultra-wide 160MHz and 320MHz channels (1.5Gbps+ speed).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero legacy interference: exclusive to Wi-Fi 6E/7 hardware.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Shortest line-of-sight range; best for high-bandwidth gaming.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Router Placement & Optimization Tips */}
      <div className={`p-6 rounded-2xl border ${
        isDark ? 'glass-panel' : 'glass-panel-light'
      }`}>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/60">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-base">Router Placement Checklist for Low Latency</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">1</span>
            <div>
              <strong className="text-slate-200 block mb-0.5">Central & Elevated Positioning</strong>
              Place your router at waist or chest height in a central room. Placing it on the floor or inside a cabinet severely degrades signal propagation.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">2</span>
            <div>
              <strong className="text-slate-200 block mb-0.5">Avoid RF Interferences</strong>
              Keep routers at least 1-2 meters away from microwaves, baby monitors, cordless landlines, and metal mirrors that reflect 2.4/5GHz electromagnetic waves.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">3</span>
            <div>
              <strong className="text-slate-200 block mb-0.5">Pick Non-Overlapping Channels</strong>
              On 2.4 GHz, strictly stick to channels <strong>1, 6, or 11</strong> with 20MHz width. Do not use 40MHz channel width on 2.4GHz as it causes co-channel interference.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">4</span>
            <div>
              <strong className="text-slate-200 block mb-0.5">Use Wired Cat6/Cat6A for Gaming & PC</strong>
              Wi-Fi packets suffer from collision avoidance (CSMA/CA). A physical Ethernet cable bypasses Wi-Fi jitter completely for rock-solid 0% packet loss.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
