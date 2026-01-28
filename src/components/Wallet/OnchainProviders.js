import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { baseSepolia } from 'viem/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { WC_PROJECT_ID } from '../../utils/config';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  walletConnectWallet,
  metaMaskWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';

// Create a client outside of the component
const queryClient = new QueryClient();

// Create the wagmi config outside of the component
function createWagmiConfig() {
  const projectId = WC_PROJECT_ID || 'YOUR_PROJECT_ID'; // Replace with your actual WalletConnect Project ID
  
  const wallets = [
    {
      groupName: 'Recommended Wallet',
      wallets: [coinbaseWallet],
    }
  ];

  // Only add WalletConnect-enabled wallets if projectId is available
  if (projectId && projectId !== 'YOUR_PROJECT_ID') {
    wallets.push({
      groupName: 'Other Wallets',
      wallets: [rainbowWallet, metaMaskWallet, walletConnectWallet],
    });
  }

  const connectors = connectorsForWallets(wallets, {
    appName: 'BAM',
    projectId,
  });

  return createConfig({
    chains: [baseSepolia],
    multiInjectedProviderDiscovery: false,
    connectors,
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
    },
  });
}

// Create the config once
const wagmiConfig = createWagmiConfig();

function OnchainProviders({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;