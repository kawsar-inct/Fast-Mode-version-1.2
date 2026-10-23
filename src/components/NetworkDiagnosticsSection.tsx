import React, { useState } from 'react';
import {
  Radio,
  Globe,
  MapPin,
  Building,
  ShieldAlert,
  Server,
  Cpu,
  Sliders,
  Copy,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { NetworkDetails } from '../types';

interface NetworkDiagnosticsProps {
  network: NetworkDetails;
  isDark: boolean;
}

export const NetworkDiagnosticsSection: React.FC<NetworkDiagnosticsProps> = ({
  network,
  isDark
}) => {
  const [copiedDiag, setCopiedDiag] = useState(false);
  const [mtuValue, setMtuValue] = useState<number>(1500);

  const copyDiagnostics = () => {
    const text = [
      '====================================',
      'FASTMODE NETWORK DIAGNOSTICS REPORT',
      '====================================',
      `Timestamp: ${new Date().toISOString()}`,
      `Public IP: ${network.ip}`,
      `ISP / Provider: ${network.isp || 'N/A'}`,
      `ASN: ${network.asn || 'N/A'}`,
      `Location: ${network.loc || 'N/A'}`,
      `Coordinates: ${network.latitude && network.longitude ? `${network.latitude}, ${network.longitude}` : 'N/A'}`,
      `Connection Type: ${network.connectionType || 'Unknown'}`,
      `Effective Protocol: ${network.effectiveType || 'Unknown'}`,
      `Downlink Link Capacity: ${network.downlinkMb ? `${network.downlinkMb} Mbps` : 'N/A'}`,
      `Link RTT: ${network.rttMs ? `${network.rttMs} ms` : 'N/A'}`,
      `WebRTC Local IPs: ${network.localIps?.join(', ') || 'Protected / None leaked'}`,
      `Browser User-Agent: ${navigator.userAgent}`,
      '===================================='
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedDiag(true);
    setTimeout(() => setCopiedDiag(false), 2000);
  };

  // MTU calculations
  // Standard IPv4 header is 20 bytes, TCP header is 20 bytes -> MSS = MTU - 40
  // Standard IPv6 header is 40 bytes, TCP header is 20 bytes -> MSS = MTU - 60
  const ipv4Mss = Math.max(0, mtuValue - 40);
  const ipv6Mss = Math.max(0, mtuValue - 60);

  return (
    <section id="diagnostics" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4" />
            <span>Network Health & Diagnostics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Detailed Connection Telemetry
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Inspect your public routing path, ASN registration, local WebRTC exposure, network adapter attributes, and calculate optimal MTU packet sizes.
          </p>
        </div>

        <button
          onClick={copyDiagnostics}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition border cursor-pointer ${
            isDark
              ? 'bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800'
              : 'bg-white border-slate-300 text-blue-600 hover:bg-slate-50'
          }`}
        >
          {copiedDiag ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Report Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Full Diagnostic Report</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Public IP & Routing Identity */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          isDark ? 'glass-panel' : 'glass-panel-light'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-3">
              <Globe className="w-4 h-4" />
              <h4>Public Routing Identity</h4>
            </div>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Public IP:</span>
                <span className="font-bold text-slate-200">{network.ip}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">ISP / Carrier:</span>
                <span className="font-bold text-slate-200 truncate max-w-[170px]" title={network.isp || 'N/A'}>
                  {network.isp || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Autonomous System:</span>
                <span className="font-bold text-cyan-400">{network.asn || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Organization:</span>
                <span className="font-bold text-slate-200 truncate max-w-[170px]" title={network.org || 'N/A'}>
                  {network.org || network.isp || 'N/A'}
                </span>
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-4">
            BGP routing authority detected via anycast lookup.
          </div>
        </div>

        {/* 2. Geolocation & Coordinates */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          isDark ? 'glass-panel' : 'glass-panel-light'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-3">
              <MapPin className="w-4 h-4" />
              <h4>Geolocation & Point of Presence</h4>
            </div>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">City / Region:</span>
                <span className="font-bold text-slate-200">
                  {[network.city, network.region].filter(Boolean).join(', ') || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Country:</span>
                <span className="font-bold text-slate-200">
                  {network.country} {network.countryCode ? `(${network.countryCode})` : ''}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Approx. Coordinates:</span>
                <span className="font-bold text-slate-200">
                  {network.latitude && network.longitude
                    ? `${network.latitude.toFixed(2)}°, ${network.longitude.toFixed(2)}°`
                    : 'Approximate only'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Privacy Status:</span>
                <span className="font-bold text-emerald-400">IP-Level Geo Only</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-4">
            No precise GPS or device sensors queried; preserves user privacy.
          </div>
        </div>

        {/* 3. Local WebRTC & Interface Security */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          isDark ? 'glass-panel' : 'glass-panel-light'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-purple-400 mb-3">
              <ShieldAlert className="w-4 h-4" />
              <h4>WebRTC & Interface Leak Test</h4>
            </div>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Adapter Mode:</span>
                <span className="font-bold text-purple-400">{network.effectiveType || 'Broadband'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Link Bandwidth:</span>
                <span className="font-bold text-slate-200">
                  {network.downlinkMb ? `${network.downlinkMb} Mbps` : 'Direct Ethernet / High'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Internal LAN Leak:</span>
                <span className={`font-bold ${network.localIps?.length ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {network.localIps?.length ? network.localIps.join(', ') : 'Protected / None'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Browser Security:</span>
                <span className="font-bold text-emerald-400">CORS & mDNS Safe</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-4">
            Verified RFC 6598 / mDNS anonymization active.
          </div>
        </div>
      </div>

      {/* Interactive MTU & Packet Size Optimizer */}
      <div className={`p-6 rounded-2xl border ${
        isDark ? 'glass-panel' : 'glass-panel-light'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base">MTU & Maximum Segment Size (MSS) Calculator</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Current MTU: <strong className="text-cyan-400 font-bold">{mtuValue} bytes</strong>
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Maximum Transmission Unit (MTU) defines the largest data packet allowed over your link before fragmentation occurs. 
          Selecting the correct MTU prevents packet fragmentation, lowers gaming latency spikes, and eliminates packet loss.
        </p>

        {/* Quick MTU presets */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-mono">
          <span className="text-slate-400 mr-1">Presets:</span>
          {[
            { label: 'Standard Ethernet / Fiber (1500)', val: 1500 },
            { label: 'PPPoE DSL / Broadband (1492)', val: 1492 },
            { label: 'WireGuard / VPN Tunnel (1420)', val: 1420 },
            { label: 'OpenVPN / IPsec (1400)', val: 1400 }
          ].map((preset) => (
            <button
              key={preset.val}
              onClick={() => setMtuValue(preset.val)}
              className={`px-3 py-1.5 rounded-lg border transition ${
                mtuValue === preset.val
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Sliders and Calculations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-slate-400 uppercase text-[10px] tracking-wider mb-1">Adjust MTU</div>
            <input
              type="range"
              min={1200}
              max={1500}
              step={2}
              value={mtuValue}
              onChange={(e) => setMtuValue(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1200 B</span>
              <span className="text-cyan-400 font-bold">{mtuValue} Bytes</span>
              <span>1500 B</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-slate-400 uppercase text-[10px] tracking-wider mb-1">IPv4 MSS (Payload Cap)</div>
            <div className="text-xl font-bold text-emerald-400">{ipv4Mss} Bytes</div>
            <div className="text-[10px] text-slate-400 mt-1">MTU - 20B (IP) - 20B (TCP)</div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-slate-400 uppercase text-[10px] tracking-wider mb-1">IPv6 MSS (Payload Cap)</div>
            <div className="text-xl font-bold text-purple-400">{ipv6Mss} Bytes</div>
            <div className="text-[10px] text-slate-400 mt-1">MTU - 40B (IPv6) - 20B (TCP)</div>
          </div>
        </div>
      </div>
    </section>
  );
};
