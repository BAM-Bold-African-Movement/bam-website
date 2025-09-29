'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount } from 'wagmi';
import { 
    useIsDonationClaimed, 
    formatTimestamp, 
    useDonationsByDonor, 
    useHasReceivedNFT, 
    useClaimNFT, 
    formatDonation, 
    shortenAddress, 
    FormattedDonation,
} from '@/utils/useDonation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2, AlertCircle, Gift, Home } from 'lucide-react';

interface DonationWithIndex extends FormattedDonation {
  index: bigint;
}

interface DonationCardProps {
  donation: DonationWithIndex;
  isSelected: boolean;
  onSelect: (donation: DonationWithIndex) => void;
}

const DonationCard: React.FC<DonationCardProps> = ({ donation, isSelected, onSelect }) => {
  const { isClaimed } = useIsDonationClaimed(donation.index);
  
  return (
    <div
      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
        isClaimed
          ? 'bg-muted/50 border-border opacity-60 cursor-not-allowed'
          : isSelected
          ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500 dark:border-blue-600 border-2'
          : 'bg-card border-border hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
      }`}
      onClick={() => !isClaimed && onSelect(donation)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold">
            {donation.formattedAmount} {donation.isNative ? 'ETH' : 'Tokens'}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatTimestamp(donation.timestamp)}
          </p>
        </div>
        {isClaimed && (
          <span className="bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full">
            NFT Claimed
          </span>
        )}
      </div>
      
      {donation.message && (
        <p className="text-sm bg-muted p-2 rounded italic">
          &ldquo;{donation.message}&rdquo;
        </p>
      )}
      
      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
        <span>Donation #{donation.index.toString()}</span>
        <span>{donation.isNative ? 'Native' : 'Token'}</span>
      </div>
    </div>
  );
};

export default function NftMintPage() {
  const [selectedDonation, setSelectedDonation] = useState<DonationWithIndex | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const { donations, donationIndices, isLoading: donationsLoading } = useDonationsByDonor(address);
  const { hasReceivedNFT, isLoading: nftCheckLoading } = useHasReceivedNFT(address);
  const { 
    claimNFT, 
    isLoading: claimLoading, 
    isSuccess: claimSuccess, 
    isError: claimError, 
    error: claimErrorDetails,
    transactionHash 
  } = useClaimNFT();

  useEffect(() => {
    if (address) {
      setError('');
      setSuccess('');
      setSelectedDonation(null);
    }
  }, [address]);

  useEffect(() => {
    if (claimSuccess && transactionHash) {
      setSuccess('NFT claimed successfully!');
      setTimeout(() => {
        router.push(`/confirmation?tx=${transactionHash}&type=nft_claim`);
      }, 2000);
    }
  }, [claimSuccess, transactionHash, router]);

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

  const formattedDonations: DonationWithIndex[] = donations
    .map((donation, idx) => {
      const formatted = formatDonation(donation);
      return formatted ? {
        ...formatted,
        index: donationIndices[idx]
      } : null;
    })
    .filter((d): d is DonationWithIndex => d !== null);

  const eligibleDonations = formattedDonations.filter(
    donation => donation && donation.donor.toLowerCase() === address?.toLowerCase()
  );

  if (!isConnected) {
    return (
      <div className="flex min-h-screen justify-center items-center py-8 px-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center space-y-6">
            <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
            <p className="text-muted-foreground">
              Please connect your wallet to view your donations and claim your NFT.
            </p>
            <Wallet>
              <ConnectWallet className="w-full" />
            </Wallet>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (donationsLoading || nftCheckLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <div className="text-center space-y-4">
          <Spinner className="mx-auto" />
          <p className="text-lg text-muted-foreground">Loading your donation history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center items-center py-8 px-4">
      <Card className="max-w-4xl mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Claim Your Donor NFT</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              Connected: <span className="font-medium">{shortenAddress(address)}</span>
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {hasReceivedNFT ? (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 dark:text-green-400" />
              <h3 className="text-xl font-semibold">You Already Have an NFT!</h3>
              <p className="text-muted-foreground">
                You&apos;ve already claimed your donor NFT. Thank you for your contribution!
              </p>
              <Button onClick={() => router.push('/')} className="gap-2">
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            </div>
          ) : eligibleDonations.length === 0 ? (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 text-center space-y-4">
              <AlertCircle className="h-16 w-16 mx-auto text-yellow-500 dark:text-yellow-400" />
              <h3 className="text-xl font-semibold">No Eligible Donations Found</h3>
              <p className="text-muted-foreground">
                You haven&apos;t made any donations yet. Make a donation to become eligible for an NFT!
              </p>
              <Button onClick={() => router.push('/donations')} className="gap-2">
                <Gift className="h-4 w-4" />
                Make a Donation
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Select a Donation to Claim NFT ({eligibleDonations.length} available)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {eligibleDonations.map((donation) => (
                      <DonationCard
                        key={donation.index.toString()}
                        donation={donation}
                        isSelected={selectedDonation?.index === donation.index}
                        onSelect={setSelectedDonation}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Claim Your NFT</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedDonation ? (
                    <>
                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-blue-800 dark:text-blue-300">
                          <span className="font-medium">Selected Donation:</span> {selectedDonation.formattedAmount} {selectedDonation.isNative ? 'ETH' : 'Tokens'}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 text-sm">
                          Donation #{selectedDonation.index.toString()} • {formatTimestamp(selectedDonation.timestamp)}
                        </p>
                      </div>
                      
                      {claimLoading ? (
                        <div className="text-center py-8 space-y-4">
                          <Spinner className="mx-auto" />
                          <p className="text-lg text-muted-foreground">Claiming your NFT...</p>
                        </div>
                      ) : (
                        <Button onClick={handleClaimNFT} className="w-full gap-2" size="lg">
                          <Gift className="h-5 w-5" />
                          Claim NFT
                        </Button>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground">Please select a donation above to claim your NFT.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}