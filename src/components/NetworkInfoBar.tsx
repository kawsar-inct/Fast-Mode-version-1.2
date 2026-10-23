import React, { useState } from 'react';
import {
  Globe,
  Server,
  MapPin,
  Building,
  Copy,
  Check,
  Signal,
  ShieldCheck
} from 'lucide-react';
import { NetworkDetails } from '../types';

interface NetworkInfoBarProps {
  network: NetworkDetails;
  serverName: string;
  onOpenServerModal: () => void;
  isDark: boolean;
}

export const NetworkInfoBar: React.FC<NetworkInfoBarProps> = ({
  network,
  serverName,
  onOpenServerModal,
  isDark
}) => {
  const [copiedIp, setCopiedIp] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      isDark ? 'glass-panel' : 'glass-panel-light'
    }`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Public IP */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Your Public IP
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono font-bold text-sm text-cyan-300 truncate">
                {network.ip}
              </span>
              {network.ip !== 'Detecting...' && network.ip !== 'Unavailable' && (
                <button
                  onClick={() => copyToClipboard(network.ip)}
                  title="Copy IP Address"
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  {copiedIp ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Provider / ISP */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Internet Provider
            </div>
            <div className="font-bold text-sm text-slate-200 truncate mt-0.5" title={network.isp || 'Detecting...'}>
              {network.isp || (network.asn ? `${network.asn}` : 'Detecting...')}
            </div>
          </div>
        </div>

        {/* 3. Location */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Location
            </div>
            <div className="font-bold text-sm text-slate-200 truncate mt-0.5" title={network.loc || 'Detecting...'}>
              {network.loc || 'Detecting...'}
            </div>
          </div>
        </div>

        {/* 4. Speed Test Server */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Test Server
              </div>
              <div className="font-bold text-sm text-purple-300 truncate mt-0.5">
                {serverName}
              </div>
            </div>
          </div>
          <button
            onClick={onOpenServerModal}
            className="text-xs px-2.5 py-1.5 rounded-lg border font-mono transition text-slate-300 hover:text-white border-slate-700 bg-slate-800/80 hover:bg-slate-700"
          >
            Change
          </button>
        </div>
      </div>

      {/* Secondary metadata row (Connection type, local IP, MTU hint) */}
      {(network.effectiveType || network.localIps?.length) && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/50 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
          <div className="flex items-center gap-4">
            {network.effectiveType && (
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Signal className="w-3.5 h-3.5" />
                Network Mode: {network.effectiveType} {network.downlinkMb ? `(~${network.downlinkMb} Mbps link)` : ''}
              </span>
            )}
            {network.localIps && network.localIps.length > 0 && (
              <span className="hidden md:inline text-slate-500">
                Local LAN IP: {network.localIps.join(', ')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400/90 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted WebRTC & DoH Active</span>
          </div>
        </div>
      )}
    </div>
  );
};
