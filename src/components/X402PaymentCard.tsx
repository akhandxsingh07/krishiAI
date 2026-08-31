import React, { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Loader2, LockKeyhole, WalletCards, XCircle } from 'lucide-react';
import { x402Client } from '@x402/core/client';
import { ExactAvmClient } from '@x402/avm';
import { ALGORAND_TESTNET_CAIP2 } from '@x402/avm';
import type { ClientAvmSigner } from '@x402/avm';
import { useWallet } from '@txnlab/use-wallet-react';

type SettlementResponse = {
  success?: boolean;
  transaction?: string;
  network?: string;
  payer?: string;
  errorReason?: string;
};

type GatewayStatus = {
  enabled: boolean;
  network: string;
  facilitator: string;
  asset: string;
  price: string;
};

function decodeSettlementHeader(value: string | null): SettlementResponse | null {
  if (!value) return null;

  try {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

export const X402PaymentCard: React.FC = () => {
  const { activeAddress, signTransactions, wallets, isReady } = useWallet();
  const [gateway, setGateway] = useState<GatewayStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settlement, setSettlement] = useState<SettlementResponse | null>(null);
  const [unlockedData, setUnlockedData] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/x402/status')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to read x402 gateway status.');
        return response.json() as Promise<GatewayStatus>;
      })
      .then((data) => {
        if (!cancelled) setGateway(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to read x402 status.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const connectWallet = async () => {
    const wallet = wallets[0];
    if (!wallet) {
      setError('Pera Wallet provider is not available.');
      return;
    }

    setConnecting(true);
    setError(null);

    try {
      await wallet.connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wallet connection was cancelled.');
    } finally {
      setConnecting(false);
    }
  };

  const payAndUnlock = async () => {
    if (!activeAddress) {
      setError('Connect your Pera Wallet first.');
      return;
    }

    setLoading(true);
    setError(null);
    setSettlement(null);
    setUnlockedData(null);

    try {
      const signer: ClientAvmSigner = {
        address: activeAddress,
        signTransactions: async (txns, indexesToSign) =>
          signTransactions(txns, indexesToSign),
      };

      const client = new x402Client({ schemes: [] });
      client.register(ALGORAND_TESTNET_CAIP2, new ExactAvmClient(signer));

      const response = await client.fetch(`${window.location.origin}/api/premium-procurement`);

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Payment request failed (${response.status}): ${body.slice(0, 240)}`);
      }

      const data = await response.json();
      const paymentResponse =
        response.headers.get('PAYMENT-RESPONSE') ||
        response.headers.get('X-PAYMENT-RESPONSE');
      const decoded = decodeSettlementHeader(paymentResponse);

      setSettlement(decoded || { success: true });
      setUnlockedData(data.recommendation || 'Premium procurement intelligence unlocked.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'x402 payment failed.');
    } finally {
      setLoading(false);
    }
  };

  const transactionUrl = settlement?.transaction
    ? `https://lora.algokit.io/testnet/transaction/${settlement.transaction}`
    : null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-[#a3b18a]/30 bg-[#121b12] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[#a3b18a] text-xs font-semibold uppercase tracking-widest">
              <LockKeyhole className="w-4 h-4" />
              x402 Premium Access
            </div>
            <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-[#f2f2e8]">
              Premium Procurement Intelligence
            </h3>
            <p className="mt-1 text-sm text-[#f2f2e8]/60">
              Pay per request with USDC on Algorand Testnet. No subscription required.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            {!activeAddress ? (
              <button
                onClick={connectWallet}
                disabled={!isReady || connecting}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#a3b18a] text-[#0a110a] font-semibold text-sm disabled:opacity-50"
              >
                {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <WalletCards className="w-4 h-4" />}
                Connect Pera Wallet
              </button>
            ) : (
              <button
                onClick={payAndUnlock}
                disabled={loading || !gateway?.enabled}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#a3b18a] text-[#0a110a] font-semibold text-sm disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <WalletCards className="w-4 h-4" />}
                {loading ? 'Processing…' : `Pay ${gateway?.price || '$0.01'} & Unlock`}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#f2f2e8]/50">
          <span className="px-2 py-1 rounded bg-[#141d14] border border-[#a3b18a]/20">Algorand Testnet</span>
          <span className="px-2 py-1 rounded bg-[#141d14] border border-[#a3b18a]/20">USDC · ASA 10458941</span>
          {activeAddress && (
            <span className="px-2 py-1 rounded bg-[#141d14] border border-[#a3b18a]/20 font-mono">
              {activeAddress.slice(0, 8)}…{activeAddress.slice(-6)}
            </span>
          )}
        </div>

        {!gateway?.enabled && gateway && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Server wallet is not configured yet. Add <code>AVM_ADDRESS</code> to the server environment before making a real payment.</span>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {unlockedData && (
          <div className="mt-4 rounded-lg border border-[#a3b18a]/30 bg-[#141d14] p-4">
            <div className="flex items-center gap-2 text-[#a3b18a] text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Payment settled — premium data unlocked
            </div>
            <p className="mt-2 text-sm text-[#f2f2e8]/75">{unlockedData}</p>
            {transactionUrl && (
              <a
                href={transactionUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#a3b18a] hover:underline"
              >
                View Algorand Testnet transaction
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
