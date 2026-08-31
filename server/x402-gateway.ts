import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createX402Middleware, isX402Configured } from './x402.ts';

const app = express();
const PORT = Number(process.env.GATEWAY_PORT || 3002);
const CORE_SERVER = process.env.KRISHIAI_CORE_URL || 'http://127.0.0.1:3001';

/*
 * The React app is served by the core server on port 3001 while the x402
 * gateway runs on port 3002. The browser therefore treats x402 requests as
 * cross-origin. x402 v2 also uses the PAYMENT-SIGNATURE request header and
 * PAYMENT-REQUIRED / PAYMENT-RESPONSE response headers, so CORS must allow
 * the request header and expose the response headers to browser JavaScript.
 */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, PAYMENT-SIGNATURE',
  );
  res.setHeader(
    'Access-Control-Expose-Headers',
    'PAYMENT-REQUIRED, PAYMENT-RESPONSE',
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

const x402Middleware = createX402Middleware();

app.get('/api/x402/status', (_req, res) => {
  res.json({
    enabled: isX402Configured(),
    network: 'Algorand Testnet',
    facilitator:
      process.env.X402_FACILITATOR_URL ||
      'https://facilitator.goplausible.xyz',
    asset: 'USDC Testnet ASA 10458941',
    price: process.env.X402_PREMIUM_PRICE_USD || '$0.01',
  });
});

if (x402Middleware) {
  app.use(x402Middleware);
}

app.get('/api/premium-procurement', (_req, res) => {
  if (!isX402Configured()) {
    return res.status(503).json({
      error: 'x402 is not configured on this deployment.',
      requiredEnv: 'AVM_ADDRESS',
    });
  }

  return res.json({
    product: 'KrishiAI Premium Procurement Intelligence',
    marketSignal:
      'Demo premium procurement signal unlocked after x402 settlement.',
    recommendation:
      'Compare local mandi offers, buyer demand and expected logistics cost before accepting a procurement quote.',
    network: 'Algorand Testnet',
    paymentAsset: 'USDC',
    timestamp: new Date().toISOString(),
  });
});

app.use(
  createProxyMiddleware({
    target: CORE_SERVER,
    changeOrigin: false,
    ws: true,
  }),
);

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `🔐 KrishiAI x402 gateway running at http://0.0.0.0:${PORT}`,
  );
  console.log(
    `🔗 Core KrishiAI server proxied from ${CORE_SERVER}`,
  );
});
