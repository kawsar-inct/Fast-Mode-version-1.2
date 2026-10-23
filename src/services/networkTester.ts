import {
  SpeedProfile,
  LatencyResult,
  TimePoint,
  TestServerOption,
  DnsProvider,
  NetworkDetails,
  BufferbloatGrade
} from '../types';

export const SERVERS: TestServerOption[] = [
  {
    id: 'cloudflare',
    name: 'Cloudflare Global Anycast Edge',
    badge: 'Worldwide Anycast',
    description: '330+ data centers globally. Fastest real-world ISP measurement.',
    latencyUrl: 'https://speed.cloudflare.com/__down?bytes=0',
    downloadUrl: 'https://speed.cloudflare.com/__down?bytes=25000000',
    uploadUrl: 'https://speed.cloudflare.com/__up',
    traceUrl: 'https://speed.cloudflare.com/cdn-cgi/trace'
  },
  {
    id: 'local',
    name: 'FastMode Edge Server (Dedicated Node)',
    badge: 'Direct Server API',
    description: 'Internal zero-overhead stream node. 100% reliable bypass for ad-blockers.',
    latencyUrl: '/api/speedtest/ping',
    downloadUrl: '/api/speedtest/download?bytes=25000000',
    uploadUrl: '/api/speedtest/upload'
  },
  {
    id: 'cachefly',
    name: 'CacheFly & Multi-CDN Network',
    badge: 'High Bandwidth CDN',
    description: 'Global multi-CDN backbone with 10Gbps+ edge bandwidth.',
    latencyUrl: 'https://speed.cloudflare.com/__down?bytes=0',
    downloadUrl: 'https://cachefly.cachefly.net/10mb.test',
    uploadUrl: 'https://speed.cloudflare.com/__up'
  }
];

export const PROFILES: Record<'standard' | 'light', SpeedProfile> = {
  standard: {
    name: 'standard',
    latencySamples: 14,
    dlMs: 8000,
    ulMs: 8000,
    warmupMs: 1500,
    dlMaxBytes: 400_000_000,
    ulMaxBytes: 150_000_000,
    dlStreams: 6,
    ulStreams: 4
  },
  light: {
    name: 'light',
    latencySamples: 8,
    dlMs: 4500,
    ulMs: 4500,
    warmupMs: 1000,
    dlMaxBytes: 50_000_000,
    ulMaxBytes: 25_000_000,
    dlStreams: 4,
    ulStreams: 3
  }
};

export const DNS_PROVIDERS: DnsProvider[] = [
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    url: 'https://cloudflare-dns.com/dns-query',
    ip: '1.1.1.1',
    ip_alt: '1.0.0.1',
    ipv6: '2606:4700:4700::1111',
    ipv6_alt: '2606:4700:4700::1001',
    color: '#06b6d4',
    category: 'General',
    cachedMs: null,
    uncachedMs: null
  },
  {
    id: 'google',
    name: 'Google Public DNS',
    url: 'https://dns.google/dns-query',
    ip: '8.8.8.8',
    ip_alt: '8.8.4.4',
    ipv6: '2001:4860:4860::8888',
    ipv6_alt: '2001:4860:4860::8844',
    color: '#3b82f6',
    category: 'General',
    cachedMs: null,
    uncachedMs: null
  },
  {
    id: 'quad9',
    name: 'Quad9 (Malware Blocking)',
    url: 'https://dns.quad9.net/dns-query',
    ip: '9.9.9.9',
    ip_alt: '149.112.112.112',
    ipv6: '2620:fe::fe',
    ipv6_alt: '2620:fe::9',
    color: '#a855f7',
    category: 'Security',
    cachedMs: null,
    uncachedMs: null
  },
  {
    id: 'opendns',
    name: 'OpenDNS (Cisco Umbrella)',
    url: 'https://doh.opendns.com/dns-query',
    ip: '208.67.222.222',
    ip_alt: '208.67.220.220',
    ipv6: '2620:119:35::35',
    ipv6_alt: '2620:119:53::53',
    color: '#f59e0b',
    category: 'Security',
    cachedMs: null,
    uncachedMs: null
  },
  {
    id: 'adguard',
    name: 'AdGuard DNS (Ad Blocking)',
    url: 'https://dns.adguard-dns.com/dns-query',
    ip: '94.140.14.14',
    ip_alt: '94.140.15.15',
    ipv6: '2a10:50c0::ad1:ff',
    ipv6_alt: '2a10:50c0::ad2:ff',
    color: '#10b981',
    category: 'Security',
    cachedMs: null,
    uncachedMs: null
  },
  {
    id: 'cleanbrowsing',
    name: 'CleanBrowsing (Family Filter)',
    url: 'https://doh.cleanbrowsing.org/doh/family-filter/',
    ip: '185.228.168.168',
    ip_alt: '185.228.169.168',
    ipv6: '2a0d:2a00:1::',
    ipv6_alt: '2a0d:2a00:2::',
    color: '#6366f1',
    category: 'Family',
    cachedMs: null,
    uncachedMs: null
  },
  {
    id: 'controld',
    name: 'Control D',
    url: 'https://freedns.controld.com/p0',
    ip: '76.76.2.0',
    ip_alt: '76.76.10.0',
    ipv6: '2606:1a40::',
    ipv6_alt: '2606:1a40:1::',
    color: '#ec4899',
    category: 'General',
    cachedMs: null,
    uncachedMs: null
  },
  {
    id: 'alidns',
    name: 'AliDNS (Alibaba Cloud)',
    url: 'https://dns.alidns.com/dns-query',
    ip: '223.5.5.5',
    ip_alt: '223.6.6.6',
    ipv6: '2400:3200::1',
    ipv6_alt: '2400:3200:baba::1',
    color: '#f97316',
    category: 'Regional',
    cachedMs: null,
    uncachedMs: null
  }
];

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function rand(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function withParam(url: string, k: string, v: string): string {
  return url + (url.indexOf('?') === -1 ? '?' : '&') + encodeURIComponent(k) + '=' + encodeURIComponent(v);
}

export function median(arr: number[]): number {
  if (!arr.length) return 0;
  const s = arr.slice().sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// RFC 3550 jitter calculation
export function calculateJitter(arr: number[]): number {
  if (arr.length < 2) return 0;
  let sum = 0;
  for (let i = 1; i < arr.length; i++) {
    sum += Math.abs(arr[i] - arr[i - 1]);
  }
  return sum / (arr.length - 1);
}

export function calculateBufferbloatGrade(idlePing: number, loadedPing: number): BufferbloatGrade {
  const delta = Math.max(0, loadedPing - idlePing);
  if (delta <= 6) return 'A+';
  if (delta <= 18) return 'A';
  if (delta <= 38) return 'B';
  if (delta <= 75) return 'C';
  if (delta <= 140) return 'D';
  return 'F';
}

/* ------------------------------------------------------------------ *
 * Throughput Meter Class
 * ------------------------------------------------------------------ */
export class Meter {
  t0: number;
  bytes: number;
  t: number[];
  b: number[];

  constructor() {
    this.t0 = performance.now();
    this.bytes = 0;
    this.t = [0];
    this.b = [0];
  }

  now(): number {
    return performance.now() - this.t0;
  }

  add(n: number): void {
    if (!n || n <= 0) return;
    const time = this.now();
    this.bytes += n;
    const last = this.t.length - 1;
    // Coalesce rapid bursts within 20ms to keep arrays lean and fast
    if (last > 0 && time - this.t[last] < 20) {
      this.t[last] = time;
      this.b[last] = this.bytes;
    } else {
      this.t.push(time);
      this.b.push(this.bytes);
    }
  }

  bytesAt(time: number): number {
    const T = this.t;
    const B = this.b;
    const n = T.length;
    if (time <= T[0]) return B[0];
    if (time >= T[n - 1]) return B[n - 1];
    let lo = 0;
    let hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (T[mid] <= time) lo = mid;
      else hi = mid;
    }
    const factor = (time - T[lo]) / (T[hi] - T[lo]);
    return B[lo] + factor * (B[hi] - B[lo]);
  }

  rate(fromMs: number, toMs: number): number {
    const dtSeconds = (toMs - fromMs) / 1000;
    if (dtSeconds <= 0) return 0;
    const deltaBytes = this.bytesAt(toMs) - this.bytesAt(fromMs);
    return (deltaBytes * 8) / dtSeconds / 1_000_000; // Mbps
  }

  live(windowMs: number = 1000): number {
    const curr = this.now();
    return Math.max(0, this.rate(Math.max(0, curr - windowMs), curr));
  }

  final(warmupMs: number): number {
    const end = this.t[this.t.length - 1] || this.now();
    let from = warmupMs;
    if (end - from < 1200) from = 0; // if test was too short, don't drop warmup
    return Math.max(0, this.rate(from, end));
  }
}

/* ------------------------------------------------------------------ *
 * Latency Probe
 * ------------------------------------------------------------------ */
export async function timedFetch(url: string, signal?: AbortSignal): Promise<{ wall: number; rt: number | null }> {
  const targetUrl = withParam(url, 'r', rand());
  const t0 = performance.now();
  try {
    const res = await fetch(targetUrl, {
      cache: 'no-store',
      signal
    });
    await res.arrayBuffer();
    const wall = performance.now() - t0;
    let rt: number | null = null;
    try {
      const entries = performance.getEntriesByName(targetUrl);
      const e = entries[entries.length - 1] as PerformanceResourceTiming;
      if (e && e.requestStart > 0 && e.responseStart >= e.requestStart) {
        rt = Math.max(0.1, e.responseStart - e.requestStart);
      }
    } catch {
      // Ignore performance entry lookup failure
    }
    return { wall, rt };
  } catch (err: any) {
    if (signal?.aborted) throw err;
    // Fallback: estimate
    const wall = performance.now() - t0;
    return { wall, rt: null };
  }
}

export async function measureLatency(
  latencyUrl: string,
  sampleCount: number,
  signal: AbortSignal,
  onSample?: (currentMedian: number, sampleCount: number) => void
): Promise<LatencyResult> {
  // Warm-up connection (discards first TCP/TLS handshake latency)
  try {
    await timedFetch(latencyUrl, signal);
  } catch (e: any) {
    if (signal.aborted) throw e;
  }

  const raw: { wall: number; rt: number | null }[] = [];

  for (let i = 0; i < sampleCount; i++) {
    if (signal.aborted) break;
    const sample = await timedFetch(latencyUrl, signal);
    raw.push(sample);

    // Pick consistent metric (Resource Timing if all available, else wall clock)
    const useRt = raw.length > 0 && raw.every((x) => x.rt !== null);
    const currentSamples = raw.map((x) => (useRt && x.rt !== null ? x.rt : x.wall));
    const currMed = median(currentSamples);
    if (onSample) {
      onSample(currMed, i + 1);
    }
    await sleep(45);
  }

  const useRt = raw.length > 0 && raw.every((x) => x.rt !== null);
  const samples = raw.map((x) => (useRt && x.rt !== null ? x.rt : x.wall));
  const idlePing = median(samples);
  const jitterVal = calculateJitter(samples);

  return {
    idlePing: parseFloat(idlePing.toFixed(1)),
    jitter: parseFloat(jitterVal.toFixed(1)),
    samples
  };
}

/* ------------------------------------------------------------------ *
 * Download Engine
 * ------------------------------------------------------------------ */
async function downloadWorker(
  url: string,
  signal: AbortSignal,
  meter: Meter,
  state: { stop: boolean; error: Error | null }
) {
  try {
    while (!state.stop && !signal.aborted) {
      const fetchUrl = withParam(url, 'r', rand());
      const res = await fetch(fetchUrl, {
        cache: 'no-store',
        signal
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) {
        const ab = await res.arrayBuffer();
        meter.add(ab.byteLength);
        continue;
      }

      const reader = res.body.getReader();
      while (true) {
        if (state.stop || signal.aborted) {
          try {
            await reader.cancel();
          } catch {
            // ignore
          }
          return;
        }
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          meter.add(value.byteLength);
        }
      }
    }
  } catch (err: any) {
    if (!state.stop && !signal.aborted) {
      state.error = err;
    }
  }
}

export async function runDownload(
  downloadUrl: string,
  latencyUrl: string,
  profile: SpeedProfile,
  signal: AbortSignal,
  onTick: (liveMbps: number, timeMs: number, bytesTransferred: number) => void,
  onLoadedPing?: (loadedPing: number) => void
): Promise<{ mbps: number; bytes: number; series: TimePoint[]; loadedPing?: number }> {
  const meter = new Meter();
  const state = { stop: false, error: null as Error | null };
  const series: TimePoint[] = [];
  const loadedPingSamples: number[] = [];

  // Start workers
  const workers: Promise<void>[] = [];
  for (let i = 0; i < profile.dlStreams; i++) {
    workers.push(downloadWorker(downloadUrl, signal, meter, state));
  }
  const allWorkers = Promise.all(workers);

  // Monitor loop + periodic loaded latency probes
  const startTime = performance.now();
  let lastPingProbe = 0;

  while (!signal.aborted) {
    await sleep(100);
    const elapsed = performance.now() - startTime;
    const currentRate = meter.live(1000);
    series.push({ timeMs: Math.round(elapsed), mbps: parseFloat(currentRate.toFixed(2)) });
    onTick(currentRate, elapsed, meter.bytes);

    // Measure loaded ping every 700ms after initial 1s warmup
    if (elapsed > 1000 && elapsed - lastPingProbe > 700 && latencyUrl) {
      lastPingProbe = elapsed;
      timedFetch(latencyUrl, signal)
        .then((probe) => {
          const val = probe.rt !== null ? probe.rt : probe.wall;
          if (val > 0) {
            loadedPingSamples.push(val);
            if (onLoadedPing) onLoadedPing(median(loadedPingSamples));
          }
        })
        .catch(() => {});
    }

    if (elapsed >= profile.dlMs || meter.bytes >= profile.dlMaxBytes) {
      break;
    }
  }

  state.stop = true;
  await Promise.race([allWorkers, sleep(300)]);

  if (signal.aborted) {
    throw new Error('Test cancelled');
  }

  if (meter.bytes === 0 && state.error) {
    throw state.error;
  }

  const finalSpeed = meter.final(profile.warmupMs);
  const loadedPing = loadedPingSamples.length ? median(loadedPingSamples) : undefined;

  return {
    mbps: parseFloat(finalSpeed.toFixed(2)),
    bytes: meter.bytes,
    series,
    loadedPing: loadedPing ? parseFloat(loadedPing.toFixed(1)) : undefined
  };
}

/* ------------------------------------------------------------------ *
 * Upload Engine
 * ------------------------------------------------------------------ */
// Reusable pre-allocated random data buffer to prevent CPU freezing during upload
let sharedUploadPayload: Blob | null = null;

function getSharedUploadPayload(sizeBytes: number): Blob {
  if (sharedUploadPayload && sharedUploadPayload.size === sizeBytes) {
    return sharedUploadPayload;
  }
  const buf = new Uint8Array(sizeBytes);
  // Fill in chunks with crypto random values
  for (let o = 0; o < sizeBytes; o += 65536) {
    crypto.getRandomValues(buf.subarray(o, Math.min(o + 65536, sizeBytes)));
  }
  sharedUploadPayload = new Blob([buf], { type: 'application/octet-stream' });
  return sharedUploadPayload;
}

function uploadWorkerXhr(
  url: string,
  blob: Blob,
  meter: Meter,
  state: { stop: boolean; error: Error | null; xhrs: XMLHttpRequest[] },
  signal: AbortSignal
): Promise<void> {
  return new Promise((resolve) => {
    function next() {
      if (state.stop || signal.aborted) return resolve();
      const xhr = new XMLHttpRequest();
      let lastUploaded = 0;
      state.xhrs.push(xhr);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && e.loaded > lastUploaded) {
          meter.add(e.loaded - lastUploaded);
          lastUploaded = e.loaded;
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (blob.size > lastUploaded) {
            meter.add(blob.size - lastUploaded);
          }
          next();
        } else {
          state.error = new Error(`HTTP ${xhr.status}`);
          resolve();
        }
      };

      xhr.onerror = () => {
        if (!state.stop && !signal.aborted) {
          state.error = new Error('Upload network error');
        }
        resolve();
      };

      xhr.onabort = () => resolve();

      xhr.open('POST', withParam(url, 'r', rand()));
      xhr.send(blob);
    }

    next();
  });
}

async function uploadWorkerFetch(
  url: string,
  blob: Blob,
  meter: Meter,
  state: { stop: boolean; error: Error | null },
  signal: AbortSignal
): Promise<void> {
  try {
    while (!state.stop && !signal.aborted) {
      await fetch(withParam(url, 'r', rand()), {
        method: 'POST',
        body: blob,
        mode: 'no-cors',
        cache: 'no-store',
        signal
      });
      meter.add(blob.size);
    }
  } catch (err: any) {
    if (!state.stop && !signal.aborted) {
      state.error = err;
    }
  }
}

export async function runUpload(
  uploadUrl: string,
  latencyUrl: string,
  profile: SpeedProfile,
  signal: AbortSignal,
  onTick: (liveMbps: number, timeMs: number, bytesTransferred: number) => void,
  onLoadedPing?: (loadedPing: number) => void
): Promise<{ mbps: number; bytes: number; series: TimePoint[]; loadedPing?: number }> {
  const chunkSize = profile.name === 'light' ? 1_500_000 : 3_000_000;
  const payload = getSharedUploadPayload(chunkSize);

  const meter = new Meter();
  const state = { stop: false, error: null as Error | null, xhrs: [] as XMLHttpRequest[] };
  const series: TimePoint[] = [];
  const loadedPingSamples: number[] = [];

  // Try XHR first for true event-driven byte progress
  const workers: Promise<void>[] = [];
  for (let i = 0; i < profile.ulStreams; i++) {
    workers.push(uploadWorkerXhr(uploadUrl, payload, meter, state, signal));
  }
  const allWorkers = Promise.all(workers);

  const startTime = performance.now();
  let lastPingProbe = 0;

  while (!signal.aborted) {
    await sleep(100);
    const elapsed = performance.now() - startTime;
    const currentRate = meter.live(1000);
    series.push({ timeMs: Math.round(elapsed), mbps: parseFloat(currentRate.toFixed(2)) });
    onTick(currentRate, elapsed, meter.bytes);

    // Measure loaded ping every 700ms during upload
    if (elapsed > 1000 && elapsed - lastPingProbe > 700 && latencyUrl) {
      lastPingProbe = elapsed;
      timedFetch(latencyUrl, signal)
        .then((probe) => {
          const val = probe.rt !== null ? probe.rt : probe.wall;
          if (val > 0) {
            loadedPingSamples.push(val);
            if (onLoadedPing) onLoadedPing(median(loadedPingSamples));
          }
        })
        .catch(() => {});
    }

    if (elapsed >= profile.ulMs || meter.bytes >= profile.ulMaxBytes) {
      break;
    }
  }

  state.stop = true;
  state.xhrs.forEach((x) => {
    try {
      x.abort();
    } catch {
      // ignore
    }
  });

  await Promise.race([allWorkers, sleep(300)]);

  // Fallback to fetch upload if XHR yielded 0 bytes
  if (meter.bytes === 0 && !signal.aborted) {
    state.stop = false;
    const fetchWorkers: Promise<void>[] = [];
    for (let i = 0; i < profile.ulStreams; i++) {
      fetchWorkers.push(uploadWorkerFetch(uploadUrl, payload, meter, state, signal));
    }
    const fetchAll = Promise.all(fetchWorkers);
    const fStart = performance.now();
    while (!signal.aborted) {
      await sleep(100);
      const elapsed = performance.now() - fStart;
      const currentRate = meter.live(1000);
      series.push({ timeMs: Math.round(elapsed), mbps: parseFloat(currentRate.toFixed(2)) });
      onTick(currentRate, elapsed, meter.bytes);
      if (elapsed >= profile.ulMs || meter.bytes >= profile.ulMaxBytes) break;
    }
    state.stop = true;
    await Promise.race([fetchAll, sleep(300)]);
  }

  if (signal.aborted) {
    throw new Error('Test cancelled');
  }

  const finalSpeed = meter.final(profile.warmupMs);
  const loadedPing = loadedPingSamples.length ? median(loadedPingSamples) : undefined;

  return {
    mbps: parseFloat(finalSpeed.toFixed(2)),
    bytes: meter.bytes,
    series,
    loadedPing: loadedPing ? parseFloat(loadedPing.toFixed(1)) : undefined
  };
}

/* ------------------------------------------------------------------ *
 * DNS Benchmark (RFC 8484 DNS-over-HTTPS Wire Format)
 * ------------------------------------------------------------------ */
export function buildDnsQuery(name: string, qtype: number = 1): Uint8Array {
  const labels = name.replace(/\.$/, '').split('.');
  let len = 12 + 1 + 4;
  labels.forEach((l) => {
    len += l.length + 1;
  });
  const buf = new Uint8Array(len);
  const dv = new DataView(buf.buffer);
  dv.setUint16(0, 0); // ID 0 (RFC 8484 recommended)
  dv.setUint16(2, 0x0100); // Standard query with recursion desired
  dv.setUint16(4, 1); // 1 Question
  let o = 12;
  labels.forEach((l) => {
    buf[o++] = l.length;
    for (let i = 0; i < l.length; i++) buf[o++] = l.charCodeAt(i);
  });
  buf[o++] = 0;
  dv.setUint16(o, qtype); // Type: 1 = A, 28 = AAAA
  dv.setUint16(o + 2, 1); // Class: IN
  return buf;
}

export function b64url(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function dohUrl(base: string, name: string): string {
  return base + (base.indexOf('?') === -1 ? '?' : '&') + 'dns=' + b64url(buildDnsQuery(name, 1));
}

export async function dohQuery(base: string, name: string, expectAnswer: boolean): Promise<number> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 4000);
  const u = dohUrl(base, name);
  try {
    const t0 = performance.now();
    const res = await fetch(u, {
      headers: { accept: 'application/dns-message' },
      cache: 'no-store',
      mode: 'cors',
      signal: ac.signal
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = new Uint8Array(await res.arrayBuffer());
    let ms = performance.now() - t0;
    if (buf.length < 12) throw new Error('Malformed DNS response');
    const rcode = buf[3] & 15;
    const answers = (buf[6] << 8) | buf[7];
    if (rcode !== 0 && rcode !== 3) throw new Error(`DNS error ${rcode}`);
    if (expectAnswer && answers === 0) throw new Error('Empty answer');

    try {
      const e = performance.getEntriesByName(u).pop() as PerformanceResourceTiming;
      if (e && e.requestStart > 0 && e.responseStart >= e.requestStart) {
        const rt = e.responseStart - e.requestStart;
        if (rt > 0 && rt <= ms + 2) ms = rt;
      }
    } catch {
      // ignore
    }
    return ms;
  } finally {
    clearTimeout(timer);
  }
}

export async function benchmarkDnsProvider(p: DnsProvider): Promise<{
  cached: number | null;
  uncached: number | null;
  approx: boolean;
  error: string | null;
}> {
  const out = { cached: null as number | null, uncached: null as number | null, approx: false, error: null as string | null };
  try {
    // Warmup query
    await dohQuery(p.url, 'example.com', true);

    // Cached probes (median of 5)
    const c: number[] = [];
    for (let i = 0; i < 5; i++) {
      c.push(await dohQuery(p.url, 'example.com', true));
      await sleep(20);
    }
    out.cached = parseFloat(median(c).toFixed(1));

    // Uncached probe with unique random subdomain to force recursive lookup
    const un: number[] = [];
    for (let j = 0; j < 2; j++) {
      try {
        un.push(await dohQuery(p.url, `fm-${rand()}.example.com`, false));
      } catch {
        // skip
      }
      await sleep(20);
    }
    if (un.length) out.uncached = parseFloat(median(un).toFixed(1));
  } catch (e: any) {
    // Fallback if CORS blocked: measure HTTPS roundtrip time
    try {
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), 4000);
      const url = dohUrl(p.url, 'example.com');
      await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: ac.signal });
      const s: number[] = [];
      for (let k = 0; k < 3; k++) {
        const t0 = performance.now();
        await fetch(url + '&r=' + rand(), { mode: 'no-cors', cache: 'no-store', signal: ac.signal });
        s.push(performance.now() - t0);
        await sleep(20);
      }
      clearTimeout(timer);
      out.cached = parseFloat(median(s).toFixed(1));
      out.approx = true;
    } catch {
      out.error = 'Unreachable';
    }
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * IP & Geolocation Resolver
 * ------------------------------------------------------------------ */
export async function fetchNetworkDetails(): Promise<NetworkDetails> {
  const details: NetworkDetails = {
    ip: 'Detecting...',
    isp: null,
    org: null,
    city: null,
    region: null,
    country: null,
    countryCode: null,
    loc: null
  };

  // Inspect navigator.connection for client network telemetry
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    if (conn) {
      details.connectionType = conn.type || conn.effectiveType || undefined;
      details.effectiveType = conn.effectiveType?.toUpperCase();
      details.downlinkMb = conn.downlink;
      details.rttMs = conn.rtt;
    }
  }

  interface ParsedApiResult {
    ip: string;
    isp?: string | null;
    org?: string | null;
    city?: string | null;
    region?: string | null;
    country?: string | null;
    countryCode?: string | null;
    asn?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }

  // Provider candidates
  const apis: { url: string; parse: (d: any) => ParsedApiResult | null }[] = [
    {
      url: 'https://ipwho.is/',
      parse: (d: any) => {
        if (!d || d.success === false || !d.ip) return null;
        return {
          ip: d.ip,
          isp: d.connection?.isp || d.connection?.org || d.org,
          org: d.connection?.org,
          city: d.city,
          region: d.region,
          country: d.country,
          countryCode: d.country_code,
          asn: d.connection?.asn ? `AS${d.connection.asn}` : null,
          latitude: d.latitude,
          longitude: d.longitude
        };
      }
    },
    {
      url: 'https://ipapi.co/json/',
      parse: (d: any) => {
        if (!d || d.error || !d.ip) return null;
        return {
          ip: d.ip,
          isp: d.org,
          org: d.org,
          city: d.city,
          region: d.region,
          country: d.country_name,
          countryCode: d.country_code,
          asn: d.asn,
          latitude: d.latitude,
          longitude: d.longitude
        };
      }
    },
    {
      url: '/api/speedtest/ip',
      parse: (d: any) => {
        if (!d || !d.ip) return null;
        return { ip: d.ip, isp: null, org: null, city: null, region: null, country: null, countryCode: null, asn: null, latitude: null, longitude: null };
      }
    },
    {
      url: 'https://api.ipify.org?format=json',
      parse: (d: any) => (d?.ip ? { ip: d.ip, isp: null, org: null, city: null, region: null, country: null, countryCode: null, asn: null, latitude: null, longitude: null } : null)
    }
  ];

  for (const api of apis) {
    try {
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 4000);
      const res = await fetch(api.url, { signal: ac.signal, cache: 'no-store' });
      clearTimeout(t);
      if (res.ok) {
        const json = await res.json();
        const parsed = api.parse(json);
        if (parsed?.ip) {
          details.ip = parsed.ip;
          if (parsed.isp) details.isp = parsed.isp;
          if (parsed.org) details.org = parsed.org;
          if (parsed.city) details.city = parsed.city;
          if (parsed.region) details.region = parsed.region;
          if (parsed.country) details.country = parsed.country;
          if (parsed.countryCode) details.countryCode = parsed.countryCode;
          if (parsed.asn) details.asn = parsed.asn;
          if (parsed.latitude) details.latitude = parsed.latitude;
          if (parsed.longitude) details.longitude = parsed.longitude;

          const locParts = [details.city, details.region, details.country].filter(Boolean);
          details.loc = locParts.length ? locParts.join(', ') : null;

          if (details.isp && details.country) break;
        }
      }
    } catch {
      // try next API
    }
  }

  // WebRTC local IP candidate detection (for local LAN inspection)
  try {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    pc.createOffer().then((offer) => pc.setLocalDescription(offer));
    const localIps: string[] = [];
    pc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate || !ice.candidate.candidate) return;
      const match = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate);
      if (match && !localIps.includes(match[1])) {
        localIps.push(match[1]);
        details.localIps = localIps;
      }
    };
  } catch {
    // WebRTC not supported or blocked
  }

  return details;
}
