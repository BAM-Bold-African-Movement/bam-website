'use client'

import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { baseSepolia, sepolia } from 'viem/chains'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  coinbaseWallet,
  walletConnectWallet,
  metaMaskWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { useTheme } from 'next-themes'
import { WC_PROJECT_ID } from '@/utils/config'
import '@rainbow-me/rainbowkit/styles.css';


// Create the wagmi config outside - ONLY ONCE
function getWagmiConfig() {
  const projectId = WC_PROJECT_ID ?? "a3508ee2b7a5865bd3d898d07e409954"
  
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_WC_PROJECT_ID is required')
  }

  const connectors = connectorsForWallets(
    [
      {
        groupName: 'Recommended Wallet',
        wallets: [coinbaseWallet],
      },
      {
        groupName: 'Other Wallets',
        wallets: [rainbowWallet, metaMaskWallet, walletConnectWallet],
      },
    ],
    {
      appName: 'BAM',
      projectId,
    }
  )

  return createConfig({
    chains: [baseSepolia, sepolia],
    multiInjectedProviderDiscovery: false,
    connectors,
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
      [sepolia.id]: http(),
    },
  })
}

// Create ONCE outside component
const wagmiConfig = getWagmiConfig()

interface OnchainProvidersProps {
  children: ReactNode
}

function RainbowKitWithTheme({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme()

  return (
    <RainbowKitProvider 
      modalSize="compact"
      theme={resolvedTheme === 'dark' ? darkTheme() : lightTheme()}
    >
      {children}
    </RainbowKitProvider>
  )
}

export default function OnchainProviders({ children }: OnchainProvidersProps) {
  // Create QueryClient inside component with useState to ensure it's stable
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitWithTheme>
          {children}
        </RainbowKitWithTheme>
      </QueryClientProvider>
    </WagmiProvider>
  )
}