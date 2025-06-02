import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount } from 'wagmi';
import { 
  useDonationsByDonor, 
  useHasReceivedNFT, 
  useClaimNFT, 
  useIsDonationClaimed,
  formatDonation,
  formatTimestamp,
  shortenAddress 
} from '../../services/donationService';

export default function NftMintPage() {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();

  // Get user's donations
  const { donations, donationIndices, isLoading: donationsLoading } = useDonationsByDonor(address);
  
  // Check if user has already received an NFT
  const { hasReceivedNFT, isLoading: nftCheckLoading } = useHasReceivedNFT(address);
  
  // NFT claiming functionality
  const { 
    claimNFT, 
    isLoading: claimLoading, 
    isSuccess: claimSuccess, 
    isError: claimError, 
    error: claimErrorDetails,
    transactionHash 
  } = useClaimNFT();

  // Reset errors when wallet changes
  useEffect(() => {
    if (address) {
      setError('');
      setSuccess('');
      setSelectedDonation(null);
    }
  }, [address]);

  // Handle successful NFT claim
  useEffect(() => {
    if (claimSuccess && transactionHash) {
      setSuccess('NFT claimed successfully!');
      setTimeout(() => {
        navigate('/confirmation', { 
          state: { 
            txHash: transactionHash,
            type: 'nft_claim'
          } 
        });
      }, 2000);
    }
  }, [claimSuccess, transactionHash, navigate]);

  // Handle claim errors
  useEffect(() => {
    if (claimError && claimErrorDetails) {
      setError(claimErrorDetails.message || 'Error claiming NFT');
    }
  }, [claimError, claimErrorDetails]);

  const handleClaimNFT = () => {
    if (!selectedDonation) {
      setError('Please select a donation first');
      return;
    }
    
    setError('');
    claimNFT(selectedDonation.index);
  };

  // Format donations for display
  const formattedDonations = donations.map((donation, idx) => ({
    ...formatDonation(donation),
    index: donationIndices[idx]
  }));

  // Filter out donations that might not be eligible
  const eligibleDonations = formattedDonations.filter(donation => donation && donation.donor === address);

  const DonationCard = ({ donation, isSelected, onSelect }) => {
    const { isClaimed } = useIsDonationClaimed(donation.index);
    
    return (
      <div
        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
          isClaimed
            ? 'bg-gray-100 border border-gray-200 opacity-60 cursor-not-allowed'
            : isSelected
            ? 'bg-blue-100 border-2 border-blue-500'
            : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'
        }`}
        onClick={() => !isClaimed && onSelect(donation)}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-semibold text-gray-900">
              {donation.formattedAmount} {donation.isNative ? 'ETH' : 'Tokens'}
            </p>
            <p className="text-sm text-gray-600">
              {formatTimestamp(donation.timestamp)}
            </p>
          </div>
          {isClaimed && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              NFT Claimed
            </span>
          )}
        </div>
        
        {donation.message && (
          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded italic">
            "{donation.message}"
          </p>
        )}
        
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>Donation #{donation.index}</span>
          <span>{donation.isNative ? 'Native' : 'Token'}</span>
        </div>
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-gray-50 py-8 px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to view your donations and claim your NFT.
          </p>
          <Wallet>
            <ConnectWallet className="w-full" />
          </Wallet>
        </div>
      </div>
    );
  }

  if (donationsLoading || nftCheckLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-700">Loading your donation history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Claim Your Donor NFT</h1>
          
          {/* Wallet Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              Connected: <span className="font-medium">{shortenAddress(address)}</span>
            </p>
          </div>

          {/* Error Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Success Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Already has NFT */}
          {hasReceivedNFT ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <div className="mb-4 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">You Already Have an NFT!</h3>
              <p className="text-gray-700 mb-6">
                You've already claimed your donor NFT. Thank you for your contribution!
              </p>
              <button 
                onClick={() => navigate('/')} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Return Home
              </button>
            </div>
          ) : eligibleDonations.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
              <div className="mb-4 text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">No Eligible Donations Found</h3>
              <p className="text-gray-700 mb-6">
                You haven't made any donations yet. Make a donation to become eligible for an NFT!
              </p>
              <button 
                onClick={() => navigate('/donations')} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Make a Donation
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Donation Selection */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Select a Donation to Claim NFT ({eligibleDonations.length} available)
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {eligibleDonations.map((donation) => (
                    <DonationCard
                      key={donation.index}
                      donation={donation}
                      isSelected={selectedDonation?.index === donation.index}
                      onSelect={setSelectedDonation}
                    />
                  ))}
                </div>
              </div>

              {/* Claim Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Claim Your NFT</h3>
                
                {selectedDonation ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <p className="text-blue-800">
                        <span className="font-medium">Selected Donation:</span> {selectedDonation.formattedAmount} {selectedDonation.isNative ? 'ETH' : 'Tokens'}
                      </p>
                      <p className="text-blue-600 text-sm">
                        Donation #{selectedDonation.index} • {formatTimestamp(selectedDonation.timestamp)}
                      </p>
                    </div>
                    
                    {claimLoading ? (
                      <div className="text-center py-8">
                        <div className="inline-block w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-4"></div>
                        <p className="text-lg text-gray-700">Claiming your NFT...</p>
                      </div>
                    ) : (
                      <button 
                        onClick={handleClaimNFT}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                      >
                        Claim NFT
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">Please select a donation above to claim your NFT.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}