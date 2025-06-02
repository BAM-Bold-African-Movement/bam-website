import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { shortenAddress } from '../../services/donationService';

const ConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const transactionHash = searchParams.get('tx') || location.state?.txHash;
  const confirmationType = location.state?.type || 'donation'; // 'donation' or 'nft_claim'
  const [donorInfo, setDonorInfo] = useState(null);
  const { address } = useAccount();
  
  useEffect(() => {
    // Try to get donor info from localStorage (for donation confirmations)
    const savedInfo = localStorage.getItem('donorInfo');
    if (savedInfo && confirmationType === 'donation') {
      try {
        setDonorInfo(JSON.parse(savedInfo));
        // Clear the saved info after displaying
        localStorage.removeItem('donorInfo');
      } catch (e) {
        console.error("Error parsing donor info", e);
      }
    }
  }, [confirmationType]);

  const getExplorerUrl = (hash) => {
    // You can modify this based on your network
    return `https://sepolia.basescan.org/tx/${hash}`;
  };

  const DonationConfirmation = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You for Your Donation!</h1>
        <div className="animate-bounce text-5xl mb-4">🎉</div>
        <p className="text-gray-600 text-lg">Your donation has been successfully processed.</p>
      </div>
      
      {donorInfo && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Donation Details</h3>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Amount:</span> {donorInfo.tokenAmount} {donorInfo.tokenSymbol} 
              {donorInfo.usdAmount && ` ($${donorInfo.usdAmount})`}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Wallet:</span> {shortenAddress(address)}
            </p>
            {donorInfo.message && (
              <p className="text-gray-700">
                <span className="font-medium">Message:</span> "{donorInfo.message}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* NFT Eligibility Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-900">Claim Your Donor NFT</h3>
            <p className="text-blue-700 mt-1">
              As a donor, you're now eligible to claim a special NFT as a token of appreciation!
            </p>
            <div className="mt-4">
              <Link 
                to="/mint-nft"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Claim Your NFT
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const NFTClaimConfirmation = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">NFT Claimed Successfully!</h1>
        <div className="animate-bounce text-5xl mb-4">🎨</div>
        <p className="text-gray-600 text-lg">Your donor NFT has been minted and sent to your wallet.</p>
      </div>
      
      <div className="bg-purple-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-900">NFT Details</h3>
        <div className="space-y-2">
          <p className="text-purple-800">
            <span className="font-medium">Recipient:</span> {shortenAddress(address)}
          </p>
          <p className="text-purple-800">
            <span className="font-medium">Type:</span> Donor Appreciation NFT
          </p>
          <p className="text-purple-800">
            <span className="font-medium">Status:</span> Successfully Minted
          </p>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-green-800">
              Your NFT should appear in your wallet shortly. Thank you for being a valued donor!
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img 
            src="/assests/img/BAM transparent.png" 
            alt="BAM Logo" 
            className="h-16 mr-3" 
          />
        </div>
        
        {/* Render appropriate confirmation based on type */}
        {confirmationType === 'nft_claim' ? <NFTClaimConfirmation /> : <DonationConfirmation />}
        
        {/* Transaction Information */}
        {transactionHash && (
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Transaction Information</h3>
            <p className="text-gray-700 break-all">
              <span className="font-medium">Transaction Hash:</span> {transactionHash}
            </p>
            <div className="mt-4">
              <a 
                href={getExplorerUrl(transactionHash)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 underline"
              >
                View on BaseScan
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="text-center mt-8 space-y-3">
          <div>
            <Link 
              to="/"
              className="inline-block bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors w-full"
            >
              Return to Home
            </Link>
          </div>
          
          {confirmationType === 'donation' && (
            <div>
              <Link 
                to="/mint-nft"
                className="inline-block bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors text-sm"
              >
                Claim NFT Now
              </Link>
            </div>
          )}
          
          {confirmationType === 'nft_claim' && (
            <div>
              <Link 
                to="/donate"
                className="inline-block bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                Make Another Donation
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;