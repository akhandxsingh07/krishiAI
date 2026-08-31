import { NetworkId, WalletManager } from '@txnlab/use-wallet';
import { pera } from '@txnlab/use-wallet-pera';

export const algorandWalletManager = new WalletManager({
  wallets: [pera()],
  defaultNetwork: NetworkId.TESTNET,
});
