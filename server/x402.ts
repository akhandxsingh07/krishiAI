import { paymentMiddleware, x402ResourceServer } from '@x402/express';
import { ExactAvmScheme } from '@x402/avm/exact/server';
import {
  ALGORAND_MAINNET_CAIP2,
  ALGORAND_TESTNET_CAIP2,
  USDC_TESTNET_ASA_ID,
} from '@x402/avm';
import { HTTPFacilitatorClient } from '@x402/core/server';

export const X402_FACILITATOR_URL =
  process.env.X402_FACILITATOR_URL ||
  'https://facilitator.goplausible.xyz';

export const X402_PREMIUM_PRICE_USD =
  process.env.X402_PREMIUM_PRICE_USD ||
  '$0.01';

export const X402_TESTNET_NETWORK =
  ALGORAND_TESTNET_CAIP2;

export const X402_USDC_ASSET =
  USDC_TESTNET_ASA_ID;

/**
 * GoPlausible currently advertises Algorand networks in /supported using
 * the 32-character CAIP network reference, while @x402/avm uses the full
 * Algorand genesis-hash identifier. @x402/core compares these strings
 * literally during facilitator preflight, which otherwise makes a valid
 * Algorand route fail with "Facilitator does not support scheme exact".
 *
 * Normalize only the facilitator capability response. Payment verification
 * and settlement requests are passed through unchanged.
 */
function normalizeFacilitatorNetwork(network: string): string {
  const [namespace, reference] = network.split(':', 2);

  if (namespace !== 'algorand' || !reference) {
    return network;
  }

  const testnetReference = ALGORAND_TESTNET_CAIP2.split(':', 2)[1];
  const mainnetReference = ALGORAND_MAINNET_CAIP2.split(':', 2)[1];

  if (reference === testnetReference.slice(0, 32)) {
    return ALGORAND_TESTNET_CAIP2;
  }

  if (reference === mainnetReference.slice(0, 32)) {
    return ALGORAND_MAINNET_CAIP2;
  }

  return network;
}

class KrishiAIFacilitatorClient extends HTTPFacilitatorClient {
  override async getSupported() {
    const supported = await super.getSupported();

    return {
      ...supported,
      kinds: supported.kinds.map((kind) => ({
        ...kind,
        network: normalizeFacilitatorNetwork(kind.network),
      })),
    };
  }
}

export function isX402Configured(): boolean {
  return Boolean(process.env.AVM_ADDRESS?.trim());
}

export function createX402Middleware() {
  const payTo = process.env.AVM_ADDRESS?.trim();

  if (!payTo) {
    console.warn(
      '[x402] AVM_ADDRESS is not configured; the x402 premium route remains disabled.',
    );

    return null;
  }

  const facilitatorClient = new KrishiAIFacilitatorClient({
    url: X402_FACILITATOR_URL,
  });

  const resourceServer = new x402ResourceServer(
    facilitatorClient,
  ).register(
    ALGORAND_TESTNET_CAIP2,
    new ExactAvmScheme(),
  );

  const routes = {
    'GET /api/premium-procurement': {
      accepts: [
        {
          scheme: 'exact',
          network: ALGORAND_TESTNET_CAIP2 as `${string}:${string}`,
          payTo,
          price: X402_PREMIUM_PRICE_USD,
          maxTimeoutSeconds: 60,
          extra: {
            asset: USDC_TESTNET_ASA_ID,
            name: 'USDC',
            decimals: 6,
          },
        },
      ],

      description:
        'KrishiAI premium procurement intelligence on Algorand Testnet',

      mimeType: 'application/json',
    },
  };

  return paymentMiddleware(
    routes,
    resourceServer,
  );
}
