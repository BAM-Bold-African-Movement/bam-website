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
              <p className="text-gray-700"><span className="font-medium">Name:</span> {donorInfo.name}</p>
              <p className="text-gray-700"><span className="font-medium">Email:</span> {donorInfo.email}</p>
              <p className="text-gray-700"><span className="font-medium">Amount:</span> ${donorInfo.amount}</p>
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



/**
 import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function ConfirmationPage() {
  const location = useLocation();
  const { email, txHash, chain } = location.state || {};

  const chainExplorerUrls = {
    ethereum: 'https://etherscan.io/tx/',
    polygon: 'https://polygonscan.com/tx/',
    solana: 'https://explorer.solana.com/tx/',
    avalanche: 'https://snowtrace.io/tx/'
  };

  if (!email || !txHash || !chain) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Confirmation</h1>
          <p className="text-gray-700 mb-6">Sorry, we couldn't find the details of your NFT mint.</p>
          <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 rounded-full p-3 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">NFT Minted Successfully!</h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-1">
              <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <div className="text-white text-center p-6">
                  <div className="text-5xl font-bold mb-2">Thank You</div>
                  <div className="text-xl">Donor NFT</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 h-full">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Thank You Donation NFT</h2>
                <p className="text-gray-700 mb-6">This NFT represents your generous support of our cause and gives you access to exclusive benefits.</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="text-gray-900">{email}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Transaction:</span>
                    <a 
                      href={chainExplorerUrls[chain] + txHash} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition duration-200"
                    >
                      {txHash.slice(0, 6)}...{txHash.slice(-4)}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Chain:</span>
                    <span className="text-gray-900 flex items-center">
                      <div className="w-5 h-5 rounded-full bg-gray-300 mr-2"></div>
                      {chain.charAt(0).toUpperCase() + chain.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Share Your Support</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                Share on Twitter
              </button>
              <button className="flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
                Share on Facebook
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

**/