'use client'

import WalletWrapper from './wallet-wrapper'

export default function SignupButton() {
  return (
    <WalletWrapper
      className="ockConnectWallet_Container min-w-[90px] shrink bg-slate-200 dark:bg-slate-800 text-[#030712] dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 px-6 py-2 rounded-lg transition-colors duration-300 font-medium"
      text="Sign up"
    />
  )
}