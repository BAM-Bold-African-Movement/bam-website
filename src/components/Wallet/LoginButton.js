import WalletWrapper from './WalletWrapper';

export default function LoginButton() {
  return (
    <WalletWrapper
      className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300 font-medium"
      text="Connect Wallet"
      withWalletAggregator={true}
    />
  );
}