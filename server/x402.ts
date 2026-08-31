import { paymentMiddleware, x402ResourceServer } from '@x402/express';
import { ExactAvmScheme } from '@x402/avm/exact/server';
import {
  ALGORAND_MAINNET_CAIP2,
  ALGORAND_MAINNET_GENESIS_HASH,
  ALGORAND_TESTNET_CAIP2,
  ALGORAND_TESTNET_GENESIS_HASH,
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
 * GoPlausible may advertise Algorand networks in /supported using the
 * complete genesis hash, while @x402/avm route configuration uses the
 * canonical CAIP-2 identifier. @x402/core performs a literal capability
 * comparison, so normalize only the facilitator capability response.
 * Verification and settlement requests are left untouched.
 */
function normalizeFacilitatorNetwork(network: string): string {
  if (!network.startsWith('algorand:')) {
    return network;
  }

  const reference = network.slice('algorand:'.length);

  if (reference === ALGORAND_TESTNET_GENESIS_HASH) {
    return ALGORAND_TESTNET_CAIP2;
  }

  if (reference === ALGORAND_MAINNET_GENESIS_HASH) {
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
