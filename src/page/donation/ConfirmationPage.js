import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';

const ConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const transactionHash = searchParams.get('tx');
  const [donorInfo, setDonorInfo] = useState(null);
  const { address } = useAccount();
  
  useEffect(() => {
    // Try to get donor info from localStorage
    const savedInfo = localStorage.getItem('donorInfo');
    if (savedInfo) {
      try {
        setDonorInfo(JSON.parse(savedInfo));
      } catch (e) {
        console.error("Error parsing donor info", e);
      }
    }
  }, []);
  
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center mb-6">
          <img 
            src="/assests/img/BAM transparent.png" 
            alt="BAM Logo" 
            className="h-16 mr-3" 
          />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h1>
          <div className="animate-bounce text-5xl mb-4">🎉</div>
          <p className="text-gray-600 text-lg">Your donation has been successfully processed.</p>
        </div>
        
        {donorInfo && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Donation Details</h3>
            <div className="space-y-2">
              <p className="text-gray-700"><span className="font-medium">Amount:</span> {donorInfo.tokenAmount} {donorInfo.tokenSymbol} (${donorInfo.usdAmount})</p>
              <p className="text-gray-700"><span className="font-medium">Wallet:</span> {shortenAddress(address)}</p>
            </div>
          </div>
        )}
        
        {transactionHash && (
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Transaction Information</h3>
            <p className="text-gray-700 break-all"><span className="font-medium">Transaction Hash:</span> {transactionHash}</p>
            <div className="mt-4">
              <a 
                href={`https://sepolia.basescan.org/tx/${transactionHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View on BaseScan
              </a>
            </div>
          </div>
        )}
        
        <div className="text-center mt-8">
          <a 
            href="/"
            className="inline-block bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;