import { NetworkId, WalletId, WalletManager } from '@txnlab/use-wallet';

export const algorandWalletManager = new WalletManager({
  wallets: [WalletId.PERA],
  defaultNetwork: NetworkId.TESTNET,
  options: {
    resetNetwork: true,
  },
});
