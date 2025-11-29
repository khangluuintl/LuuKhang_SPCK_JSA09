const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

// Target Booking Demand API sandbox. Change to production if needed.
const TARGET = process.env.TARGET || 'https://demandapi-sandbox.booking.com/3.2';
const PORT = process.env.PORT || 3000;

const app = express();

// Allow browser origins during development
app.use(cors({ origin: true }));
app.use(express.json());

// Simple health endpoint
app.get('/health', (req, res) => res.json({ ok: true, target: TARGET }));

// Return proxy config (development convenience)
app.get('/config', (req, res) => {
  res.json({
    affiliate_id: process.env.AFFILIATE_ID || null,
    target: TARGET
  });
});

// Proxy /api/* -> TARGET/*
app.use('/api', createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
  onProxyReq(proxyReq, req, res) {
    // Forward Authorization header from client if present
    const auth = req.headers['authorization'];
    if (auth) proxyReq.setHeader('Authorization', auth);

    // Forward affiliate id either from incoming header or env var
    const aff = req.headers['x-affiliate-id'] || process.env.AFFILIATE_ID;
    if (aff) proxyReq.setHeader('X-Affiliate-Id', aff);
  },
  onProxyRes(proxyRes, req, res) {
    // Ensure responses include CORS headers so browser accepts them
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Authorization, X-Affiliate-Id, Content-Type';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
  },
  logLevel: 'warn'
}));

app.listen(PORT, () => console.log(`Proxy listening on http://localhost:${PORT} -> ${TARGET}`));
