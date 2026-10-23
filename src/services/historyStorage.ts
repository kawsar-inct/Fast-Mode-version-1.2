import { SpeedTestResult } from '../types';

const STORAGE_KEY = 'fastmode_speedtest_history_v1';

export function getHistory(): SpeedTestResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveResultToHistory(result: SpeedTestResult): SpeedTestResult[] {
  try {
    const history = getHistory();
    // Keep last 50 results
    const updated = [result, ...history.filter((item) => item.id !== result.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function deleteHistoryItem(id: string): SpeedTestResult[] {
  try {
    const history = getHistory().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return history;
  } catch {
    return [];
  }
}

export function exportHistoryAsCsv(history: SpeedTestResult[]): void {
  if (!history.length) return;
  const headers = [
    'Date & Time',
    'Download (Mbps)',
    'Upload (Mbps)',
    'Ping (ms)',
    'Jitter (ms)',
    'Loaded Ping DL (ms)',
    'Loaded Ping UL (ms)',
    'Bufferbloat Grade',
    'Data Used (MB)',
    'Server',
    'ISP',
    'IP Address',
    'Location'
  ];

  const rows = history.map((item) => [
    new Date(item.timestamp).toISOString(),
    item.downloadMbps.toFixed(2),
    item.uploadMbps.toFixed(2),
    item.ping.toFixed(1),
    item.jitter.toFixed(1),
    item.loadedPingDown?.toFixed(1) || '',
    item.loadedPingUp?.toFixed(1) || '',
    item.bufferbloatGrade || '',
    (item.bytesUsed / 1_000_000).toFixed(1),
    `"${item.serverName.replace(/"/g, '""')}"`,
    `"${(item.isp || '').replace(/"/g, '""')}"`,
    item.ip || '',
    `"${(item.location || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fastmode-speedtest-history-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportHistoryAsJson(history: SpeedTestResult[]): void {
  const jsonContent = JSON.stringify(history, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fastmode-speedtest-history-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
