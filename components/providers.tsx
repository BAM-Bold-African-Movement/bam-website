'use client'

import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider, useTheme } from 'next-themes'
import { ConvexClientProvider } from '@/components/convex-client-provider'
import OnchainProviders from './providers/onchain-providers'


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <ThemeProvider
        enableSystem
        attribute='class'
        defaultTheme='dark'
        disableTransitionOnChange
      >
         <OnchainProviders>
            {children}
            <ToasterProvider />
          </OnchainProviders>
      </ThemeProvider>
    </ConvexClientProvider>
  )
}

function ToasterProvider() {
  const { resolvedTheme } = useTheme()

  return (
    <Toaster
      closeButton
      position='top-center'
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
    />
  )
}
