import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { base, baseSepolia, sepolia } from 'viem/chains';
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
  const projectId = WC_PROJECT_ID ?? '';
  if (!projectId) {
    const providerErrMessage =
      'To connect to all Wallets you need to provide a WC_PROJECT_ID env variable';
    throw new Error(providerErrMessage);
  }

  const connectors = connectorsForWallets(
      [
        {
          groupName: 'Recommended Wallet',
          wallets: [ coinbaseWallet ],
        },
        {
          groupName: 'Other Wallets',
          wallets: [rainbowWallet, metaMaskWallet, walletConnectWallet],
        },
      ],
      {
        appName: 'BAM',
        projectId,
      },
    );

  return createConfig({
    chains: [/*base,*/ baseSepolia, sepolia],
    // turn off injected provider discovery
    multiInjectedProviderDiscovery: false,
    connectors,
    ssr: true,
    transports: {
      /*[base.id]: http(),*/
      [baseSepolia.id]: http(),
      [sepolia.id]: http(),
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