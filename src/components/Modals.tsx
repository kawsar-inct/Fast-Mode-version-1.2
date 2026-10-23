import React from 'react';
import { X, Server, Check, Shield, FileText, Info } from 'lucide-react';
import { TestServerOption } from '../types';
import { SERVERS } from '../services/networkTester';

interface ServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServer: TestServerOption;
  onSelectServer: (server: TestServerOption) => void;
  isDark: boolean;
}

export const ServerModal: React.FC<ServerModalProps> = ({
  isOpen,
  onClose,
  selectedServer,
  onSelectServer,
  isDark
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl relative ${
        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg">Select Speed Test Server</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Select which server network to benchmark your connection throughput and latency against:
        </p>

        <div className="space-y-3">
          {SERVERS.map((server) => {
            const isSelected = selectedServer.id === server.id;
            return (
              <div
                key={server.id}
                onClick={() => {
                  onSelectServer(server);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/40'
                    : isDark
                    ? 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{server.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      {server.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{server.description}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

interface InfoModalProps {
  type: 'privacy' | 'terms' | 'about' | null;
  onClose: () => void;
  isDark: boolean;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose, isDark }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 rounded-2xl border shadow-2xl relative ${
        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4 sticky top-0 bg-inherit z-10">
          <div className="flex items-center gap-2">
            {type === 'privacy' && <Shield className="w-5 h-5 text-emerald-400" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-blue-400" />}
            {type === 'about' && <Info className="w-5 h-5 text-cyan-400" />}
            <h3 className="font-bold text-lg capitalize">{type} Policy & Information</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-slate-400 space-y-4 leading-relaxed">
          {type === 'privacy' && (
            <>
              <p><strong>FastMode Privacy Policy (Updated 2026)</strong></p>
              <p>Your privacy is central to our architecture. FastMode was engineered from the ground up to minimize data collection and respect network anonymity.</p>
              <h4 className="font-bold text-slate-200 text-sm">1. Data Collected</h4>
              <p>During a speed test, your public IP address and browser headers are used transiently to route network packets and detect your nearest server node. We do not store, log, or sell IP addresses to third-party ad networks.</p>
              <h4 className="font-bold text-slate-200 text-sm">2. Test History</h4>
              <p>Your test history is stored exclusively in your browser’s local storage (client-side). You can clear this data at any moment with the "Clear History" button.</p>
              <h4 className="font-bold text-slate-200 text-sm">3. DNS-over-HTTPS (DoH)</h4>
              <p>DNS queries are transmitted directly to the respective providers (Cloudflare, Google, Quad9, etc.) using encrypted DoH. FastMode acts as a direct client without intermediary sniffing.</p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p><strong>Terms of Service</strong></p>
              <p>By accessing FastMode, you agree to these Terms of Service. FastMode is provided free of charge for personal and non-commercial network diagnostic testing.</p>
              <h4 className="font-bold text-slate-200 text-sm">1. Accurate Usage</h4>
              <p>Tests generate real download and upload data traffic to measure network bandwidth. You acknowledge that testing over cellular / metered connections consumes your data plan.</p>
              <h4 className="font-bold text-slate-200 text-sm">2. Disclaimer of Warranties</h4>
              <p>FastMode measurements are provided "as-is" without warranty of any kind. Speeds may vary due to internal home Wi-Fi interference, ISP routing decisions, or server load.</p>
            </>
          )}

          {type === 'about' && (
            <>
              <p><strong>About FastMode Pro</strong></p>
              <p>FastMode is an open, modern internet speed test and DNS diagnostic suite built for precision, transparency, and speed enthusiasts.</p>
              <h4 className="font-bold text-slate-200 text-sm">Key Technologies</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Multi-stream parallel download and upload throughput meters</li>
                <li>Dynamic TCP warmup discard algorithm</li>
                <li>RFC 3550 jitter calculation and loaded latency bufferbloat scoring</li>
                <li>Real RFC 8484 DNS-over-HTTPS binary resolver benchmark</li>
                <li>Full-stack local node and Cloudflare Anycast fallback</li>
              </ul>
            </>
          )}
        </div>

        <div className="mt-6 pt-3 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
