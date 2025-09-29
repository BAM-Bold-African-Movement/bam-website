'use client'

import React, { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface WalletWrapperProps {
  className?: string
  text?: string
}

export default function WalletWrapper({ className, text }: WalletWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted: buttonMounted,
      }) => {
        // Fix: Handle both authenticated status and when authenticationStatus is undefined
        const ready = buttonMounted && account && chain
        const connected =
          ready &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              className={className || 'bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition-colors'}
            >
              {text || 'Connect Wallet'}
            </button>
          )
        }

        if (chain.unsupported) {
          return (
            <button
              onClick={openChainModal}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Wrong network
            </button>
          )
        }

        return (
          <div className="flex items-center gap-3">
            <button
              onClick={openChainModal}
              className="flex items-center bg-gray-800 hover:bg-gray-700 text-white py-1 px-3 rounded-lg transition-colors"
            >
              {chain.hasIcon && chain.iconUrl && (
                <img
                  alt={chain.name ?? 'Chain icon'}
                  src={chain.iconUrl}
                  className="w-4 h-4 mr-2"
                />
              )}
              {chain.name}
            </button>
            <button
              onClick={openAccountModal}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              {account.displayName}
            </button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}