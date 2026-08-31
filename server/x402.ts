import { paymentMiddleware, x402ResourceServer } from '@x402/express';
import { registerExactAvmScheme } from '@x402/avm/exact/server';
import {
  ALGORAND_TESTNET_CAIP2,
  USDC_TESTNET_ASA_ID,
  ALGORAND_ADDRESS_REGEX,
} from '@x402/avm';
import { HTTPFacilitatorClient } from '@x402/core/server';

export const X402_FACILITATOR_URL =
  process.env.X402_FACILITATOR_URL || 'https://facilitator.goplausible.xyz';

export const X402_PREMIUM_PRICE_USD =
  process.env.X402_PREMIUM_PRICE_USD || '$0.01';

export const X402_TESTNET_NETWORK = ALGORAND_TESTNET_CAIP2;
export const X402_USDC_ASSET = USDC_TESTNET_ASA_ID;

export function isX402Configured(): boolean {
  const payTo = process.env.AVM_ADDRESS?.trim();
  return Boolean(payTo && ALGORAND_ADDRESS_REGEX.test(payTo));
}

export function createX402Middleware() {
  const payTo = process.env.AVM_ADDRESS?.trim();

  if (!payTo) {
    console.warn(
      '[x402] AVM_ADDRESS is not configured; the x402 premium route remains disabled.'
    );
    return null;
  }

  if (!ALGORAND_ADDRESS_REGEX.test(payTo)) {
    console.error(
      '[x402] AVM_ADDRESS is invalid; the x402 premium route remains disabled.'
    );
    return null;
  }

  const facilitatorClient = new HTTPFacilitatorClient({
    url: X402_FACILITATOR_URL,
  });

  const resourceServer = new x402ResourceServer(facilitatorClient);
  registerExactAvmScheme(resourceServer, {
    networks: [ALGORAND_TESTNET_CAIP2],
  });

  const routes = {
    'GET /api/premium-procurement': {
      accepts: {
        scheme: 'exact',
        network: ALGORAND_TESTNET_CAIP2,
        payTo,
        price: X402_PREMIUM_PRICE_USD,
        maxTimeoutSeconds: 60,
        extra: {
          asset: USDC_TESTNET_ASA_ID,
          name: 'USDC',
          decimals: 6,
        },
      },
      description:
        'KrishiAI premium procurement intelligence on Algorand Testnet',
      mimeType: 'application/json',
    },
  };

  return paymentMiddleware(routes, resourceServer);
}
