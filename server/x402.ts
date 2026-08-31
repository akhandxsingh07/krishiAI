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

export const X402_TESTNET_NETWORK = ALGORAND_TESTNET_CAIP2;
export const X402_USDC_ASSET = USDC_TESTNET_ASA_ID;

/**
 * The facilitator may advertise Algorand networks using the full genesis
 * hash, while @x402/avm uses the canonical CAIP-2 network identifier.
 * Normalize only the facilitator capability response so x402's literal
 * capability check matches the route configuration.
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
  const address = process.env.AVM_ADDRESS?.trim();
  return Boolean(
    address &&
      address !== 'YOUR_ALGORAND_TESTNET_RECEIVING_ADDRESS' &&
      address !== 'YOUR_ALGORAND_TESTNET_PUBLIC_ADDRESS',
  );
}

export function createX402Middleware() {
  const payTo = process.env.AVM_ADDRESS?.trim();

  if (!isX402Configured()) {
    console.warn(
      '[x402] AVM_ADDRESS is missing or still contains the example placeholder; premium payments are disabled.',
    );
    return null;
  }

  const facilitatorClient = new KrishiAIFacilitatorClient({
    url: X402_FACILITATOR_URL,
  });

  const resourceServer = new x402ResourceServer(facilitatorClient).register(
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

  return paymentMiddleware(routes, resourceServer);
}
