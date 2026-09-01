import {
  paymentMiddleware,
  x402ResourceServer,
} from "@x402/express";

import { HTTPFacilitatorClient } from "@x402/core/server";

import { ExactAvmScheme } from "@x402/avm/exact/server";

import {
  USDC_TESTNET_ASA_ID,
} from "@x402/avm";


// ============================================================
// ALGORAND TESTNET NETWORK
// ============================================================

const ALGORAND_TESTNET_NETWORK =
  "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=";


// ============================================================
// ENVIRONMENT
// ============================================================

const FACILITATOR_URL =
  process.env.X402_FACILITATOR_URL ||
  "https://facilitator.goplausible.xyz";

const PAY_TO =
  process.env.X402_PAY_TO ||
  process.env.AVM_ADDRESS ||
  "";


// ============================================================
// X402 CONFIGURATION
// ============================================================

export function isX402Configured(): boolean {
  return (
    PAY_TO.length > 0 &&
    PAY_TO !== "YOUR_ALGORAND_TESTNET_WALLET_ADDRESS"
  );
}


// ============================================================
// FACILITATOR CLIENT
// ============================================================

const facilitatorClient = new HTTPFacilitatorClient({
  url: FACILITATOR_URL,
});


// ============================================================
// RESOURCE SERVER
// ============================================================

const resourceServer = new x402ResourceServer(
  facilitatorClient
);


// ============================================================
// REGISTER ALGORAND EXACT SCHEME
// ============================================================

resourceServer.register(
  ALGORAND_TESTNET_NETWORK,
  new ExactAvmScheme()
);


// ============================================================
// PAYMENT ROUTES
// ============================================================

const routes: Parameters<typeof paymentMiddleware>[0] = {
  "GET /api/premium-procurement": {
    accepts: {
      scheme: "exact",
      network: ALGORAND_TESTNET_NETWORK,
      payTo: PAY_TO,
      price: "$0.01",

      extra: {
        asset: USDC_TESTNET_ASA_ID,
      },
    },

    description:
      "KrishiAI premium procurement intelligence on Algorand Testnet",

    mimeType: "application/json",
  },
};


// ============================================================
// X402 MIDDLEWARE
// ============================================================

export function createX402Middleware() {
  return paymentMiddleware(
    routes,
    resourceServer
  );
}