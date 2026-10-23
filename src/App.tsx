import React, { useState, useEffect, useRef } from 'react';
import {
  SpeedTestPhase,
  SpeedTestResult,
  TestServerOption,
  NetworkDetails,
  TimePoint,
  BufferbloatGrade
} from './types';
import {
  SERVERS,
  PROFILES,
  measureLatency,
  runDownload,
  runUpload,
  fetchNetworkDetails,
  calculateBufferbloatGrade
} from './services/networkTester';
import {
  getHistory,
  saveResultToHistory,
  clearHistory,
  deleteHistoryItem,
  exportHistoryAsCsv
} from './services/historyStorage';
import { Navbar } from './components/Navbar';
import { SpeedGauge } from './components/SpeedGauge';
import { MetricsGrid } from './components/MetricsGrid';
import { LiveCharts } from './components/LiveCharts';
import { NetworkInfoBar } from './components/NetworkInfoBar';
import { TestControls } from './components/TestControls';
import { ResultsSummaryCard } from './components/ResultsSummaryCard';
import { DnsBenchmarkSection } from './components/DnsBenchmarkSection';
import { NetworkDiagnosticsSection } from './components/NetworkDiagnosticsSection';
import { HistorySection } from './components/HistorySection';
import { WifiToolsSection } from './components/WifiToolsSection';
import { EducationalSection } from './components/EducationalSection';
import { ServerModal, InfoModal } from './components/Modals';
import { ShieldCheck, Zap, Lock, ExternalLink } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('fastmode_theme');
    if (saved) return saved === 'dark';
    return true; // Default dark
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('speed');

  // Connection & Server options
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [selectedServer, setSelectedServer] = useState<TestServerOption>(SERVERS[0]);
  const [serverModalOpen, setServerModalOpen] = useState<boolean>(false);
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'terms' | 'about' | null>(null);

  // Speed test core state
  const [phase, setPhase] = useState<SpeedTestPhase>('idle');
  const [statusText, setStatusText] = useState<string>('Ready to test');
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [peakSpeed, setPeakSpeed] = useState<number>(0);
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [loadedPingDown, setLoadedPingDown] = useState<number | undefined>(undefined);
  const [loadedPingUp, setLoadedPingUp] = useState<number | undefined>(undefined);
  const [bufferbloatGrade, setBufferbloatGrade] = useState<BufferbloatGrade | undefined>(undefined);
  const [bytesUsed, setBytesUsed] = useState<number>(0);
  const [lightMode, setLightMode] = useState<boolean>(false);

  // Telemetry time series
  const [downloadSeries, setDownloadSeries] = useState<TimePoint[]>([]);
  const [uploadSeries, setUploadSeries] = useState<TimePoint[]>([]);
  const [latencySamples, setLatencySamples] = useState<number[]>([]);

  // Network info & historical records
  const [network, setNetwork] = useState<NetworkDetails>({
    ip: 'Detecting...',
    isp: null,
    org: null,
    city: null,
    region: null,
    country: null,
    countryCode: null,
    loc: null
  });

  const [history, setHistory] = useState<SpeedTestResult[]>([]);
  const [lastResult, setLastResult] = useState<SpeedTestResult | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Abort controller reference for instant stopping
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Update theme class on document
  useEffect(() => {
    localStorage.setItem('fastmode_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setStatusText('Internet connection lost');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch initial network info
  useEffect(() => {
    fetchNetworkDetails().then((data) => {
      setNetwork(data);
    });
  }, []);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Reset test metrics
  const resetMetrics = () => {
    setCurrentSpeed(0);
    setPeakSpeed(0);
    setPing(null);
    setJitter(null);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setLoadedPingDown(undefined);
    setLoadedPingUp(undefined);
    setBufferbloatGrade(undefined);
    setBytesUsed(0);
    setDownloadSeries([]);
    setUploadSeries([]);
    setLatencySamples([]);
    setLastResult(null);
  };

  // Stop active test
  const stopTest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setPhase('aborted');
    setStatusText('Test cancelled by user');
    setCurrentSpeed(0);
  };

  // Start complete speed test sequence
  const startTest = async () => {
    if (['latency', 'download', 'upload'].includes(phase)) {
      stopTest();
      return;
    }

    if (!navigator.onLine) {
      setPhase('error');
      setStatusText('You appear to be offline');
      return;
    }

    resetMetrics();
    const ac = new AbortController();
    abortControllerRef.current = ac;

    const profile = PROFILES[lightMode ? 'light' : 'standard'];
    let totalBytes = 0;
    let measuredPing = 0;
    let measuredJitter = 0;
    let measuredDl = 0;
    let measuredUl = 0;
    let loadedDl: number | undefined;
    let loadedUl: number | undefined;
    let dlSeries: TimePoint[] = [];
    let ulSeries: TimePoint[] = [];

    try {
      // 1. Latency & Jitter Probe
      setPhase('latency');
      setStatusText('Measuring idle latency & jitter...');

      const latResult = await measureLatency(
        selectedServer.latencyUrl,
        profile.latencySamples,
        ac.signal,
        (currentMed) => {
          setPing(Math.round(currentMed));
        }
      );

      if (ac.signal.aborted) return;

      measuredPing = latResult.idlePing;
      measuredJitter = latResult.jitter;
      setPing(measuredPing);
      setJitter(measuredJitter);
      setLatencySamples(latResult.samples);

      // 2. Download Speed Test
      setPhase('download');
      setStatusText('Testing multi-stream download throughput...');
      setCurrentSpeed(0);

      const dlResult = await runDownload(
        selectedServer.downloadUrl,
        selectedServer.latencyUrl,
        profile,
        ac.signal,
        (liveRate, _, bytes) => {
          setCurrentSpeed(liveRate);
          setPeakSpeed((p) => Math.max(p, liveRate));
          setBytesUsed(bytes);
        },
        (currentLoadedPing) => {
          setLoadedPingDown(Math.round(currentLoadedPing));
        }
      );

      if (ac.signal.aborted) return;

      measuredDl = dlResult.mbps;
      totalBytes += dlResult.bytes;
      loadedDl = dlResult.loadedPing;
      dlSeries = dlResult.series;

      setDownloadSpeed(measuredDl);
      setDownloadSeries(dlSeries);
      setLoadedPingDown(loadedDl);
      setBytesUsed(totalBytes);
      setCurrentSpeed(measuredDl);

      // Brief transition pause
      await new Promise((r) => setTimeout(r, 400));
      if (ac.signal.aborted) return;

      // 3. Upload Speed Test
      setPhase('upload');
      setStatusText('Testing upload throughput & bufferbloat...');
      setCurrentSpeed(0);

      const ulResult = await runUpload(
        selectedServer.uploadUrl,
        selectedServer.latencyUrl,
        profile,
        ac.signal,
        (liveRate, _, bytes) => {
          setCurrentSpeed(liveRate);
          setPeakSpeed((p) => Math.max(p, liveRate));
          setBytesUsed(totalBytes + bytes);
        },
        (currentLoadedPing) => {
          setLoadedPingUp(Math.round(currentLoadedPing));
        }
      );

      if (ac.signal.aborted) return;

      measuredUl = ulResult.mbps;
      totalBytes += ulResult.bytes;
      loadedUl = ulResult.loadedPing;
      ulSeries = ulResult.series;

      setUploadSpeed(measuredUl);
      setUploadSeries(ulSeries);
      setLoadedPingUp(loadedUl);
      setBytesUsed(totalBytes);
      setCurrentSpeed(measuredUl);

      // 4. Compute Bufferbloat Grade
      const worstLoadedPing = Math.max(loadedDl || measuredPing, loadedUl || measuredPing);
      const grade = calculateBufferbloatGrade(measuredPing, worstLoadedPing);
      setBufferbloatGrade(grade);

      // Save to History
      const finalResult: SpeedTestResult = {
        id: `ft-${Date.now()}`,
        timestamp: Date.now(),
        ping: measuredPing,
        jitter: measuredJitter,
        downloadMbps: measuredDl,
        uploadMbps: measuredUl,
        loadedPingDown: loadedDl,
        loadedPingUp: loadedUl,
        bufferbloatGrade: grade,
        bytesUsed: totalBytes,
        serverName: selectedServer.name,
        serverLocation: selectedServer.badge,
        ip: network.ip,
        isp: network.isp || network.org || undefined,
        location: network.loc || undefined,
        lightMode,
        downloadSeries: dlSeries,
        uploadSeries: ulSeries
      };

      setLastResult(finalResult);
      const updatedHistory = saveResultToHistory(finalResult);
      setHistory(updatedHistory);

      setPhase('complete');
      setStatusText('Speed test completed successfully');
      setCurrentSpeed(measuredDl); // Default needle to download
    } catch (err: any) {
      if (ac.signal.aborted) {
        setPhase('aborted');
        setStatusText('Test cancelled');
      } else {
        setPhase('error');
        setStatusText(err.message || 'Error occurred during network test');
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleShareResult = () => {
    if (!lastResult && !downloadSpeed) return;
    const shareText = [
      '🚀 FastMode Speed Test Results:',
      `⬇️ Download: ${downloadSpeed ? `${downloadSpeed.toFixed(2)} Mbps` : '--'}`,
      `⬆️ Upload: ${uploadSpeed ? `${uploadSpeed.toFixed(2)} Mbps` : '--'}`,
      `⚡ Ping: ${ping ? `${ping.toFixed(1)} ms` : '--'} (Jitter: ${jitter ? `${jitter.toFixed(1)} ms` : '--'})`,
      `🛡️ Bufferbloat Grade: ${bufferbloatGrade || 'A'}`,
      `🌐 Server: ${selectedServer.name}`,
      `📍 Tested at: ${window.location.origin}`
    ].join('\n');

    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        isOnline={isOnline}
        serverName={selectedServer.badge}
        onOpenServerModal={() => setServerModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Network Identity Banner */}
        <NetworkInfoBar
          network={network}
          serverName={selectedServer.name}
          onOpenServerModal={() => setServerModalOpen(true)}
          isDark={isDark}
        />

        {/* TAB 1: SPEED TEST (Main View) */}
        {activeTab === 'speed' && (
          <div className="space-y-6 animate-fade-in">
            {/* Speed Test Main Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Center Speedometer & Control Stage (8 cols on lg) */}
              <div className={`lg:col-span-8 p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col items-center justify-between min-h-[480px] relative overflow-hidden ${
                isDark ? 'glass-panel' : 'glass-panel-light'
              }`}>
                {/* Background futuristic glow rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

                {/* SVG Gauge */}
                <SpeedGauge
                  currentSpeed={currentSpeed}
                  peakSpeed={peakSpeed}
                  phase={phase}
                  isDark={isDark}
                  statusText={statusText}
                />

                {/* Launch & Control Actions */}
                <TestControls
                  phase={phase}
                  onStart={startTest}
                  onStop={stopTest}
                  lightMode={lightMode}
                  setLightMode={setLightMode}
                  onShare={handleShareResult}
                  onExportCsv={() => exportHistoryAsCsv(history)}
                  onPrintReport={() => window.print()}
                  hasResults={downloadSpeed !== null || uploadSpeed !== null}
                  isDark={isDark}
                  copiedShare={copiedShare}
                />

                {/* Metrics Breakdown Grid */}
                <div className="w-full mt-6 pt-6 border-t border-slate-800/60">
                  <MetricsGrid
                    ping={ping}
                    jitter={jitter}
                    downloadSpeed={downloadSpeed}
                    uploadSpeed={uploadSpeed}
                    loadedPingDown={loadedPingDown}
                    loadedPingUp={loadedPingUp}
                    bufferbloatGrade={bufferbloatGrade}
                    bytesUsed={bytesUsed}
                    phase={phase}
                    isDark={isDark}
                  />
                </div>
              </div>

              {/* Side Column: Security Banner & Quick Diagnostics (4 cols on lg) */}
              <aside className="lg:col-span-4 space-y-4">
                {/* Security / VPN Card with genuine assets */}
                <div className={`p-6 rounded-3xl border relative overflow-hidden flex flex-col justify-between ${
                  isDark ? 'glass-panel' : 'glass-panel-light'
                }`}>
                  <div className="relative mb-4 overflow-hidden rounded-2xl group">
                    <img
                      src="/nordbanner.webp"
                      alt="NordVPN Security & Encryption"
                      className="w-full h-auto object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/nordbanner.png';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400 border border-cyan-500/30">
                      Encrypted Tunnel
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-100 flex items-center gap-1.5 mb-1.5">
                      <Lock className="w-4 h-4 text-cyan-400" />
                      <span>Protect Your Real IP & Data</span>
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Your public IP <span className="text-cyan-300 font-mono font-semibold">{network.ip}</span> exposes your city and ISP to trackers. Encrypt your traffic with military-grade VPN tunneling.
                    </p>
                  </div>

                  <a
                    href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=139463&url_id=902"
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-white shadow-lg shadow-cyan-900/30 transition-all active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Get Secure Connection</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                  <p className="text-[10px] text-slate-500 text-center mt-2 font-mono">
                    Sponsored partner &bull; Zero logs policy
                  </p>
                </div>

                {/* Quick DNS Hint Card */}
                <div
                  onClick={() => setActiveTab('dns')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                    isDark ? 'glass-panel hover:border-cyan-500/50' : 'glass-panel-light hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      DNS Benchmark Ready
                    </span>
                    <span className="text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">&rarr;</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Compare Cloudflare 1.1.1.1, Google 8.8.8.8, Quad9 & 5 other resolvers using real DoH queries.
                  </p>
                </div>
              </aside>
            </div>

            {/* Live Telemetry Charts (Throughput Timeline + Latency Distribution) */}
            <LiveCharts
              downloadSeries={downloadSeries}
              uploadSeries={uploadSeries}
              latencySamples={latencySamples}
              isDark={isDark}
              phase={phase}
            />

            {/* Post-Test Activity Suitability Intelligence */}
            {lastResult && (
              <ResultsSummaryCard
                result={lastResult}
                isDark={isDark}
              />
            )}
          </div>
        )}

        {/* TAB 2: DNS BENCHMARK */}
        {activeTab === 'dns' && (
          <div className="animate-fade-in">
            <DnsBenchmarkSection isDark={isDark} />
          </div>
        )}

        {/* TAB 3: NETWORK DIAGNOSTICS */}
        {activeTab === 'diagnostics' && (
          <div className="animate-fade-in">
            <NetworkDiagnosticsSection network={network} isDark={isDark} />
          </div>
        )}

        {/* TAB 4: HISTORY & REPORTS */}
        {activeTab === 'history' && (
          <div className="animate-fade-in">
            <HistorySection
              history={history}
              onDeleteItem={(id) => setHistory(deleteHistoryItem(id))}
              onClearHistory={() => {
                clearHistory();
                setHistory([]);
              }}
              isDark={isDark}
            />
          </div>
        )}

        {/* TAB 5: WI-FI TOOLKIT */}
        {activeTab === 'wifi' && (
          <div className="animate-fade-in">
            <WifiToolsSection isDark={isDark} />
          </div>
        )}

        {/* TAB 6: GUIDES & FAQ */}
        {activeTab === 'education' && (
          <div className="animate-fade-in">
            <EducationalSection isDark={isDark} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-8 px-4 sm:px-6 lg:px-8 mt-12 transition-colors ${
        isDark ? 'bg-slate-950/90 border-slate-900 text-slate-500' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
            <span>&copy; {new Date().getFullYear()} FastMode Pro. Open Internet Speed Test & DNS Diagnostic Suite.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setInfoModalType('privacy')}
              className="hover:text-cyan-400 transition"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setInfoModalType('terms')}
              className="hover:text-cyan-400 transition"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setInfoModalType('about')}
              className="hover:text-cyan-400 transition"
            >
              About FastMode
            </button>
          </div>
        </div>
      </footer>

      {/* Server Selection Modal */}
      <ServerModal
        isOpen={serverModalOpen}
        onClose={() => setServerModalOpen(false)}
        selectedServer={selectedServer}
        onSelectServer={(srv) => {
          setSelectedServer(srv);
          resetMetrics();
        }}
        isDark={isDark}
      />

      {/* Info Modals (Privacy, Terms, About) */}
      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
        isDark={isDark}
      />
    </div>
  );
}
