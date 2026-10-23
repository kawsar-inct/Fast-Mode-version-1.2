export type SpeedTestPhase = 'idle' | 'latency' | 'download' | 'upload' | 'complete' | 'aborted' | 'error';

export type BufferbloatGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface LatencySample {
  wall: number;
  rt: number | null;
}

export interface LatencyResult {
  idlePing: number;
  jitter: number;
  samples: number[];
  loadedPingDown?: number;
  loadedPingUp?: number;
  bufferbloatGrade?: BufferbloatGrade;
}

export interface TimePoint {
  timeMs: number;
  mbps: number;
}

export interface SpeedTestResult {
  id: string;
  timestamp: number;
  ping: number; // ms
  jitter: number; // ms
  downloadMbps: number;
  uploadMbps: number;
  loadedPingDown?: number;
  loadedPingUp?: number;
  bufferbloatGrade: BufferbloatGrade;
  bytesUsed: number;
  serverName: string;
  serverLocation?: string;
  ip?: string;
  isp?: string;
  location?: string;
  lightMode: boolean;
  downloadSeries: TimePoint[];
  uploadSeries: TimePoint[];
}

export interface SpeedProfile {
  name: 'standard' | 'light';
  latencySamples: number;
  dlMs: number;
  ulMs: number;
  warmupMs: number;
  dlMaxBytes: number;
  ulMaxBytes: number;
  dlStreams: number;
  ulStreams: number;
}

export interface TestServerOption {
  id: 'cloudflare' | 'local' | 'cachefly';
  name: string;
  badge: string;
  description: string;
  latencyUrl: string;
  downloadUrl: string;
  uploadUrl: string;
  traceUrl?: string;
}

export interface DnsProvider {
  id: string;
  name: string;
  url: string;
  ip: string;
  ip_alt: string;
  ipv6?: string;
  ipv6_alt?: string;
  color: string;
  category: 'General' | 'Security' | 'Family' | 'Regional';
  cachedMs: number | null;
  uncachedMs: number | null;
  isFastest?: boolean;
  error?: string | null;
  approx?: boolean;
}

export interface NetworkDetails {
  ip: string;
  isp: string | null;
  org: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  countryCode: string | null;
  loc: string | null;
  asn?: string | null;
  latitude?: number;
  longitude?: number;
  connectionType?: string;
  effectiveType?: string;
  downlinkMb?: number;
  rttMs?: number;
  localIps?: string[];
}
