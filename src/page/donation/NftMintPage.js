import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount } from 'wagmi';
import { SERVER_URL } from '../../utils/config';

export default function NftMintPage() {
  /*
  const [email, setEmail] = useState('');
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedChain, setSelectedChain] = useState(null);
  const [chains, setChains] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [whitelistId, setWhitelistId] = useState(null);
  const [mintingStatus, setMintingStatus] = useState('idle'); // idle, minting, success, error
  const [txHash, setTxHash] = useState('');
  
  const navigate = useNavigate();
  const { address } = useAccount();

  useEffect(() => {
    // Fetch supported chains
    fetch(`${SERVER_URL}/v1/api/supported-chains`)
      .then(res => res.json())
      .then(data => setChains(data.chains))
      .catch(err => console.error('Error fetching chains:', err));
  }, []);

  const checkEligibility = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      const response = await fetch(`${SERVER_URL}/v1/api/check-nft-eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setEligibilityData(data);
        setEligibilityChecked(true);
        
        if (!data.eligible) {
          setError(data.reason || 'Not eligible for NFT minting');
        }
      } else {
        setError(data.error || 'Error checking eligibility');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Connection error when checking eligibility');
    }
  };

  const whitelistWallet = async () => {
    setError('');
    
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!selectedDonation) {
      setError('Please select a donation');
      return;
    }
    
    if (!selectedChain) {
      setError('Please select a blockchain');
      return;
    }
    
    try {
      const response = await fetch(`${SERVER_URL}/v1/api/whitelist-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          walletAddress: address,
          chain: selectedChain,
          donationId: selectedDonation
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsWhitelisted(true);
        setWhitelistId(data.whitelistId);
        setSuccess('Your wallet has been whitelisted! You can now mint your NFT.');
      } else {
        setError(data.error || 'Error whitelisting wallet');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Connection error when whitelisting wallet');
    }
  };

  const simulateMint = async () => {
    if (!isWhitelisted || !whitelistId) {
      setError('Your wallet must be whitelisted first');
      return;
    }
    
    setMintingStatus('minting');
    
    // In a real app, this would be your NFT minting logic
    // For this demo, we'll simulate the minting process
    setTimeout(() => {
      // Generate mock transaction hash
      const mockTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(mockTxHash);
      
      // Confirm the mint with the backend
      fetch(`${SERVER_URL}/v1/api/confirm-nft-mint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whitelistId,
          transactionHash: mockTxHash
        }),
      }).then(res => res.json())
        .then(data => {
          if (data.success) {
            setMintingStatus('success');
            setSuccess('NFT minted successfully!');
            
            // Redirect to confirmation page
            setTimeout(() => {
              navigate('/confirmation', { 
                state: { 
                  email, 
                  txHash: mockTxHash,
                  chain: selectedChain
                } 
              });
            }, 2000);
          } else {
            setMintingStatus('error');
            setError(data.error || 'Error confirming mint');
          }
        })
        .catch(err => {
          console.error('Error:', err);
          setMintingStatus('error');
          setError('Connection error when confirming mint');
        });
    }, 3000); // Simulate 3 second minting process
  };
  */

  return (
    <div className="flex flex-row min-h-screen justify-center items-center bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Mint Your Donor NFT</h1>
          
          {/* Coming Soon Message */}
          <div className="py-16 text-center">
            <div className="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              We're working on bringing you an amazing NFT minting experience. Please check back later!
            </p>
          </div>
          
          {/*
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}
          
          {!eligibilityChecked ? (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
              <p className="text-lg text-gray-700 mb-4">Enter the email you used for your donation to check eligibility:</p>
              <form onSubmit={checkEligibility} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                >
                  Check Eligibility
                </button>
              </form>
            </div>
          ) : eligibilityData?.eligible ? (
            <div className="space-y-8">
              {!isWhitelisted ? (
                <>
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Donation to Mint NFT For:</h3>
                    <div className="space-y-3">
                      {eligibilityData.donations
                        .filter(d => !d.nftMinted)
                        .map(donation => (
                          <div 
                            key={donation.id}
                            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedDonation === donation.id 
                                ? 'bg-blue-100 border-2 border-blue-500' 
                                : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => setSelectedDonation(donation.id)}
                          >
                            <div className="flex justify-between items-center">
                              <p className="font-medium text-gray-800">Donation of ${donation.amount.toFixed(2)}</p>
                              <p className="text-gray-500 text-sm">
                                {new Date(donation.timestamp.seconds * 1000).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Blockchain:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {chains.map(chain => (
                        <div
                          key={chain.id}
                          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center ${
                            selectedChain === chain.id 
                              ? 'bg-blue-100 border-2 border-blue-500' 
                              : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedChain(chain.id)}
                        >
                          <div className="w-12 h-12 mb-2 flex items-center justify-center">
                            {chain.icon ? (
                              <img src={chain.icon} alt={chain.name} className="max-w-full max-h-full" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                                {chain.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <p className="text-center text-sm font-medium">{chain.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Connect Your Wallet:</h3>
                    <div className="mb-6">
                      <Wallet>
                        <ConnectWallet className="w-full" />
                      </Wallet>
                    </div>
                    
                    {address && (
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                        <p className="text-blue-800">
                          Connected: <span className="font-medium">{address.slice(0, 6)}...{address.slice(-4)}</span>
                        </p>
                      </div>
                    )}
                    
                    <button 
                      onClick={whitelistWallet} 
                      disabled={!address || !selectedDonation || !selectedChain}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200 ${
                        !address || !selectedDonation || !selectedChain
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      Whitelist Wallet
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Mint Your Donor NFT</h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                    <p className="text-blue-800">
                      Your wallet <span className="font-medium">{address.slice(0, 6)}...{address.slice(-4)}</span> is now whitelisted to mint!
                    </p>
                  </div>
                  
                  {mintingStatus === 'idle' && (
                    <button 
                      onClick={simulateMint} 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                    >
                      Mint NFT
                    </button>
                  )}
                  
                  {mintingStatus === 'minting' && (
                    <div className="text-center py-8">
                      <div className="inline-block w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-4"></div>
                      <p className="text-lg text-gray-700">Minting in progress...</p>
                    </div>
                  )}
                  
                  {mintingStatus === 'success' && (
                    <div className="text-center py-8">
                      <div className="mb-4 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">NFT Minted Successfully!</h4>
                      <p className="text-gray-600 mb-2">Transaction: {txHash.slice(0, 6)}...{txHash.slice(-4)}</p>
                      <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
                    </div>
                  )}
                  
                  {mintingStatus === 'error' && (
                    <div className="text-center py-8">
                      <div className="mb-4 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">Error minting NFT</h4>
                      <button 
                        onClick={simulateMint} 
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <div className="mb-4 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Not Eligible</h3>
              <p className="text-gray-700 mb-6">Sorry, you're not eligible to mint an NFT. {eligibilityData?.reason}</p>
              <button 
                onClick={() => navigate('/')} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Donate Now
              </button>
            </div>
          )}
          */}
        </div>
      </div>
    </div>
  );
}