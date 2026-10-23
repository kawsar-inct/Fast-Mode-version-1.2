import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Common CORS & Timing headers for maximum precision speed testing
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Timing-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// 1. High-Precision Latency Ping endpoint
app.get('/api/speedtest/ping', (req, res) => {
  res.status(200).json({
    status: 'ok',
    serverTime: Date.now(),
    clientIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress
  });
});

// 2. High-Throughput Download stream endpoint
app.get('/api/speedtest/download', (req, res) => {
  const requestedBytes = Math.min(Math.max(parseInt(req.query.bytes as string, 10) || 10_000_000, 1024), 100_000_000); // 1KB to 100MB
  
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Length', requestedBytes.toString());
  res.setHeader('Content-Disposition', 'attachment; filename="speedtest.bin"');

  // Chunk size 64KB
  const chunkSize = 64 * 1024;
  const buffer = Buffer.alloc(chunkSize, 0x5a); // 01011010 pattern
  let bytesRemaining = requestedBytes;

  function sendChunk() {
    while (bytesRemaining > 0) {
      const currentChunkSize = Math.min(bytesRemaining, chunkSize);
      const toSend = currentChunkSize === chunkSize ? buffer : buffer.subarray(0, currentChunkSize);
      bytesRemaining -= currentChunkSize;
      
      const canContinue = res.write(toSend);
      if (!canContinue && bytesRemaining > 0) {
        res.once('drain', sendChunk);
        return;
      }
    }
    res.end();
  }

  sendChunk();
});

// 3. High-Throughput Upload endpoint
app.post('/api/speedtest/upload', (req, res) => {
  let receivedBytes = 0;
  const startTime = Date.now();

  req.on('data', (chunk) => {
    receivedBytes += chunk.length;
  });

  req.on('end', () => {
    const elapsedMs = Math.max(1, Date.now() - startTime);
    const mbps = (receivedBytes * 8) / (elapsedMs / 1000) / 1_000_000;
    res.status(200).json({
      status: 'ok',
      bytesReceived: receivedBytes,
      elapsedMs,
      mbps: parseFloat(mbps.toFixed(2))
    });
  });

  req.on('error', (err) => {
    res.status(500).json({ status: 'error', error: err.message });
  });
});

// 4. IP and Network Details endpoint
app.get('/api/speedtest/ip', async (req, res) => {
  try {
    const rawIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
    
    // We can also fetch basic location data safely
    res.json({
      ip: rawIp,
      userAgent: req.headers['user-agent'] || 'Unknown',
      timestamp: new Date().toISOString()
    });
  } catch {
    res.status(500).json({ error: 'Failed to resolve IP' });
  }
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FastMode server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
