'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout';
import { useAccount } from 'wagmi';
import Image from 'next/image';

interface DonorData {
  name: string;
  email: string;
  amount: number;
  message: string;
}

interface PaymentDetailsFormProps {
  donorData: DonorData;
  onBack: () => void;
}

const PaymentDetailsForm: React.FC<PaymentDetailsFormProps> = ({ 
  donorData,
  onBack
}) => {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  // Get CDP API key from environment variables
  const CDP_API_KEY = process.env.NEXT_PUBLIC_CDP_API_KEY || '';

  // Ensure wallet is connected before rendering checkout
  if (!isConnected || !address) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="text-center p-6">
          <p className="text-gray-700 mb-4">Please connect your wallet first</p>
          <button
            onClick={onBack}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!CDP_API_KEY) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">
            Payment configuration error. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-8">
      <div className="flex items-center mb-6">
        <Image 
          src="/public/assets/img/BAM-transparent.png" 
          alt="BAM Logo" 
          width={40}
          height={40}
          className="mr-3" 
        />
        <h2 className="text-2xl font-bold">Payment Details</h2>
      </div>
      
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Donation Summary</h3>
        <div className="space-y-2">
          <p className="text-gray-600">
            Amount: <span className="font-bold text-blue-600">${donorData.amount.toFixed(2)}</span>
          </p>
          {donorData.name && (
            <p className="text-gray-600">
              Name: <span className="font-medium">{donorData.name}</span>
            </p>
          )}
          {donorData.email && (
            <p className="text-gray-600">
              Email: <span className="font-medium">{donorData.email}</span>
            </p>
          )}
          {donorData.message && (
            <p className="text-gray-600">
              Message: <span className="font-medium italic">&ldquo;{donorData.message}&rdquo;</span>
            </p>
          )}
        </div>
      </div>
      
      <div className="border border-gray-300 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>
        
        {/* Note: This section uses Coinbase Commerce/OnchainKit checkout */}
        {/* You'll need to configure your charge creation on the backend */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="text-yellow-700 text-sm">
            Note: Payment integration requires backend configuration to create charges.
          </p>
        </div>
        
        {/* Uncomment when you have charge creation implemented */}
        {/*
        <Checkout
          apiKey={CDP_API_KEY}
          chargeId={chargeId} // You'll need to create this charge on your backend
          onSuccess={() => router.push(`/mint-nft?chargeId=${chargeId}`)}
          onError={(error) => {
            console.error('Checkout error:', error);
          }}
        >
          <CheckoutButton />
          <CheckoutStatus />
        </Checkout>
        */}
        
        <div className="space-y-3">
          <button
            onClick={onBack}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg transition-colors"
          >
            Back to Details
          </button>
          
          {/* Temporary direct navigation for testing */}
          <button
            onClick={() => router.push('/mint-nft')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors"
          >
            Continue to NFT Claim (Test)
          </button>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>Connected wallet: {address.slice(0, 6)}...{address.slice(-4)}</p>
      </div>
    </div>
  );
};

export default PaymentDetailsForm;