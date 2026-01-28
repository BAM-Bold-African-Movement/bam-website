'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import Image from 'next/image';
import { shortenAddress } from '@/utils/useDonation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Gift, ExternalLink, Info, Sparkles } from 'lucide-react';

interface DonorInfo {
  tokenAmount: string;
  tokenSymbol: string;
  usdAmount?: string;
  message?: string;
}

const ConfirmationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionHash = searchParams.get('tx');
  const confirmationType = searchParams.get('type') || 'donation';
  const [donorInfo, setDonorInfo] = useState<DonorInfo | null>(null);
  const { address } = useAccount();
  
  useEffect(() => {
    if (typeof window !== 'undefined' && confirmationType === 'donation') {
      const savedInfo = sessionStorage.getItem('donorInfo');
      if (savedInfo) {
        try {
          setDonorInfo(JSON.parse(savedInfo));
          sessionStorage.removeItem('donorInfo');
        } catch (e) {
          console.error("Error parsing donor info", e);
        }
      }
    }
  }, [confirmationType]);

  const getExplorerUrl = (hash: string) => {
    return `https://sepolia.basescan.org/tx/${hash}`;
  };

  const DonationConfirmation = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
          Thank You for Your Donation!
        </h1>
        <div className="animate-bounce text-5xl mb-4">🎉</div>
        <p className="text-muted-foreground text-lg">
          Your donation has been successfully processed.
        </p>
      </div>
      
      {donorInfo && (
        <div className="bg-muted rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Donation Details</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Amount:</span> {donorInfo.tokenAmount} {donorInfo.tokenSymbol} 
              {donorInfo.usdAmount && ` ($${donorInfo.usdAmount})`}
            </p>
            <p>
              <span className="font-medium">Wallet:</span> {shortenAddress(address)}
            </p>
            {donorInfo.message && (
              <p>
                <span className="font-medium">Message:</span> &ldquo;{donorInfo.message}&rdquo;
              </p>
            )}
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-1">
              Claim Your Donor NFT
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
              As a donor, you&apos;re now eligible to claim a special NFT as a token of appreciation!
            </p>
            <Link href="/mint-nft">
              <Button className="gap-2" size="sm">
                Claim Your NFT
                <Gift className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  const NFTClaimConfirmation = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-4">
          NFT Claimed Successfully!
        </h1>
        <div className="animate-bounce text-5xl mb-4">🎨</div>
        <p className="text-muted-foreground text-lg">
          Your donor NFT has been minted and sent to your wallet.
        </p>
      </div>
      
      <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-6 mb-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-100">
          NFT Details
        </h3>
        <div className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
          <p>
            <span className="font-medium">Recipient:</span> {shortenAddress(address)}
          </p>
          <p>
            <span className="font-medium">Type:</span> Donor Appreciation NFT
          </p>
          <p>
            <span className="font-medium">Status:</span> Successfully Minted
          </p>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-green-800 dark:text-green-200 text-sm">
            Your NFT should appear in your wallet shortly. Thank you for being a valued donor!
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <Image 
              src="/public/assets/img/BAM-transparent.png" 
              alt="BAM Logo" 
              width={64}
              height={64}
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {confirmationType === 'nft_claim' ? <NFTClaimConfirmation /> : <DonationConfirmation />}
          
          {transactionHash && (
            <div className="bg-muted rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Transaction Information</h3>
              <p className="text-sm break-all mb-4">
                <span className="font-medium">Transaction Hash:</span>
                <span className="block font-mono text-xs mt-1 text-muted-foreground">
                  {transactionHash}
                </span>
              </p>
              <a 
                href={getExplorerUrl(transactionHash)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View on BaseScan
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
          
          <div className="space-y-3 pt-4">
            <Link href="/" className="block">
              <Button className="w-full" size="lg">
                Return to Home
              </Button>
            </Link>
            
            {confirmationType === 'donation' && (
              <Link href="/mint-nft" className="block">
                <Button variant="outline" className="w-full gap-2" size="default">
                  <Sparkles className="h-4 w-4" />
                  Claim NFT Now
                </Button>
              </Link>
            )}
            
            {confirmationType === 'nft_claim' && (
              <Link href="/donate" className="block">
                <Button variant="outline" className="w-full gap-2" size="default">
                  <Gift className="h-4 w-4" />
                  Make Another Donation
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationPage;