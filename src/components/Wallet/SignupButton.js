import WalletWrapper from './WalletWrapper';

export default function SignupButton() {
  return (
    <WalletWrapper
      className="ockConnectWallet_Container min-w-[90px] shrink bg-slate-200 text-[#030712] hover:bg-slate-300 px-6 py-2 rounded-lg transition-colors duration-300 font-medium"
      text="Sign up"
    />
  );
}