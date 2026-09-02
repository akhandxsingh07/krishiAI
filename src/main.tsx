import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WalletProvider } from '@txnlab/use-wallet-react';
import App from './App.tsx';
import { algorandWalletManager } from './services/algorandWallet';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider manager={algorandWalletManager}>
      <App />
    </WalletProvider>
  </StrictMode>,
);