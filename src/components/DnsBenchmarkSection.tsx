import React, { useState } from 'react';
import {
  Globe,
  RotateCw,
  Copy,
  Check,
  Shield,
  Zap,
  Info,
  Server,
  Filter
} from 'lucide-react';
import { DnsProvider } from '../types';
import { DNS_PROVIDERS, benchmarkDnsProvider, sleep } from '../services/networkTester';

interface DnsBenchmarkSectionProps {
  isDark: boolean;
}

export const DnsBenchmarkSection: React.FC<DnsBenchmarkSectionProps> = ({ isDark }) => {
  const [providers, setProviders] = useState<DnsProvider[]>(DNS_PROVIDERS);
  const [testing, setTesting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [fastestName, setFastestName] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const runBenchmark = async () => {
    if (testing) return;
    setTesting(true);
    setFastestName(null);

    // Reset results
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        cachedMs: null,
        uncachedMs: null,
        error: null,
        approx: false,
        isFastest: false
      }))
    );

    const updated = [...providers];

    for (let i = 0; i < updated.length; i++) {
      const p = updated[i];
      // Small stagger to avoid browser socket contention
      await sleep(60);
      const res = await benchmarkDnsProvider(p);
      
      updated[i] = {
        ...p,
        cachedMs: res.cached,
        uncachedMs: res.uncached,
        approx: res.approx,
        error: res.error
      };

      setProviders([...updated]);
    }

    // Determine fastest valid provider based on cached latency
    const valid = updated.filter((p) => p.cachedMs !== null && !p.error && !p.approx);
    if (valid.length > 0) {
      valid.sort((a, b) => (a.cachedMs || 9999) - (b.cachedMs || 9999));
      const fastestId = valid[0].id;
      setFastestName(valid[0].name);

      setProviders((prev) =>
        prev
          .map((p) => ({ ...p, isFastest: p.id === fastestId }))
          .sort((a, b) => {
            if (a.cachedMs === null) return 1;
            if (b.cachedMs === null) return -1;
            return a.cachedMs - b.cachedMs;
          })
      );
    }

    setTesting(false);
  };

  const filteredProviders = categoryFilter === 'All'
    ? providers
    : providers.filter((p) => p.category === categoryFilter);

  // Maximum cached latency for progress bar scaling
  const maxCached = Math.max(100, ...providers.map((p) => p.cachedMs || 0));

  return (
    <section id="dns" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>DNS-over-HTTPS (DoH RFC 8484) Benchmark</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Compare Top Public DNS Resolvers
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Measures recursive query latency across global public DNS servers directly from your browser.
            Discover which DNS provider gives your internet connection the lowest latency and fastest web lookups.
          </p>
        </div>

        <button
          onClick={runBenchmark}
          disabled={testing}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold font-mono text-sm transition-all shadow-lg cursor-pointer ${
            testing
              ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-900/30 active:scale-95'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'Benchmarking Providers...' : 'Run DNS Benchmark'}</span>
        </button>
      </div>

      {/* Fastest Winner Banner */}
      {fastestName && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Fastest DNS Provider for Your Connection
              </div>
              <div className="text-sm font-bold text-slate-100">
                {fastestName} delivered the lowest lookup response time right now!
              </div>
            </div>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-emerald-300 font-semibold px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            Recommended
          </span>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
        {['All', 'General', 'Security', 'Family', 'Regional'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 ${
              categoryFilter === cat
                ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40 font-bold'
                : isDark
                ? 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-white'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* DNS Provider Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProviders.map((provider) => {
          const isWinner = provider.isFastest;
          const barPct = provider.cachedMs ? Math.min(100, (provider.cachedMs / maxCached) * 100) : 0;

          return (
            <div
              key={provider.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                isWinner
                  ? 'border-emerald-500/60 bg-emerald-950/20 ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-950/30'
                  : isDark
                  ? 'glass-panel hover:border-slate-700'
                  : 'glass-panel-light hover:border-slate-300'
              }`}
            >
              {/* Winner ribbon */}
              {isWinner && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-l from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-black uppercase font-mono px-3 py-1 rounded-bl-xl shadow-md">
                  FASTEST
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: provider.color }}
                    />
                    <h3 className="font-bold text-base tracking-tight truncate">
                      {provider.name}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    isDark ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {provider.category}
                  </span>
                </div>

                {/* IP address pills with 1-click copy */}
                <div className="space-y-1.5 my-3">
                  {/* Primary IPv4 */}
                  <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-mono transition ${
                    isDark ? 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}>
                    <span className="text-slate-300 truncate">{provider.ip}</span>
                    <button
                      onClick={() => copyToClipboard(provider.ip, `${provider.id}-p4`)}
                      className="text-slate-400 hover:text-cyan-400 transition ml-1"
                      title="Copy Primary IPv4"
                    >
                      {copiedKey === `${provider.id}-p4` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Secondary IPv4 */}
                  <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-mono transition ${
                    isDark ? 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}>
                    <span className="text-slate-400 truncate">{provider.ip_alt}</span>
                    <button
                      onClick={() => copyToClipboard(provider.ip_alt, `${provider.id}-s4`)}
                      className="text-slate-400 hover:text-cyan-400 transition ml-1"
                      title="Copy Secondary IPv4"
                    >
                      {copiedKey === `${provider.id}-s4` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* IPv6 if available */}
                  {provider.ipv6 && (
                    <div className={`flex items-center justify-between px-2.5 py-1 rounded border text-[11px] font-mono transition ${
                      isDark ? 'bg-slate-900/30 border-slate-800/50 hover:bg-slate-800/60 text-slate-500' : 'bg-slate-50/50 border-slate-200 text-slate-500'
                    }`}>
                      <span className="truncate" title={provider.ipv6}>{provider.ipv6}</span>
                      <button
                        onClick={() => copyToClipboard(provider.ipv6!, `${provider.id}-p6`)}
                        className="text-slate-400 hover:text-cyan-400 transition ml-1"
                        title="Copy IPv6"
                      >
                        {copiedKey === `${provider.id}-p6` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Latency Results Footer */}
              <div className="pt-3 border-t border-slate-800/40">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono text-slate-400">Cached Lookup:</span>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span
                      className="text-2xl font-black"
                      style={{ color: provider.cachedMs ? provider.color : undefined }}
                    >
                      {provider.cachedMs !== null ? `${Math.round(provider.cachedMs)}` : '--'}
                    </span>
                    <span className="text-xs text-slate-500">ms</span>
                  </div>
                </div>

                {/* Progress bar comparison */}
                {provider.cachedMs !== null && (
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barPct}%`,
                        backgroundColor: provider.color
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                  <span>Uncached:</span>
                  <span>{provider.uncachedMs !== null ? `${Math.round(provider.uncachedMs)} ms` : '--'}</span>
                </div>

                {provider.approx && (
                  <div className="text-[10px] text-amber-400 font-mono mt-1">
                    ≈ HTTPS roundtrip (CORS restricted)
                  </div>
                )}
                {provider.error && (
                  <div className="text-[10px] text-rose-400 font-mono mt-1">
                    {provider.error}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
        isDark ? 'bg-slate-900/40 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">How FastMode tests DNS:</span> Queries are executed using authentic
          <strong> DNS-over-HTTPS (DoH, RFC 8484)</strong> binary wire format packets directly from your web browser. 
          <em> Cached</em> measures resolvers replying with previously stored records, while <em>Uncached</em> uses unique subdomains to measure full authoritative resolution time. 
          Switching your router or operating system to a faster DNS server makes website lookups snappier and can bypass ISP filtering.
        </div>
      </div>
    </section>
  );
};
