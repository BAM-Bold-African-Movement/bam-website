'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  fetchExchangeRate, 
  convertToTokenAmount, 
  getTokenSymbol,
  getTokenInfo
} from '@/utils/currencyUtils';
import { useWalletTokens } from '@/hooks/useWalletTokens';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Address } from 'viem';
import { useNativeDonation, useTokenDonation } from '@/utils/useDonation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import type { WalletToken } from '@/hooks/useWalletTokens';

interface DonorInfo {
  usdAmount: string;
  tokenAmount: string;
  tokenSymbol: string;
  tokenAddress: Address | string;
  transactionHash: string;
  message?: string;
}

const DonationDetailsForm: React.FC = () => {
  const router = useRouter();
  
  // User account state
  const { address, isConnected, chain } = useAccount();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  
  // Token selection and amount state
  const [selectedToken, setSelectedToken] = useState<WalletToken | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [usdEquivalent, setUsdEquivalent] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);
  
  // Minimum donation amount in USD
  const MINIMUM_DONATION_USD = 0.1;
  
  // Get tokens from user wallet
  const { walletTokens, isLoading: loadingWalletTokens } = useWalletTokens(chain?.id);
  
  // Get the donation hooks
  const { 
    makeDonation: makeNativeDonation, 
    isLoading: isNativeLoading, 
    isSuccess: isNativeSuccess, 
    isError: isNativeError, 
    error: nativeDonationError,
    transactionHash: nativeTransactionHash 
  } = useNativeDonation(message);
  
  const { 
    makeDonation: makeTokenDonation, 
    isLoading: isTokenLoading, 
    isSuccess: isTokenSuccess, 
    isError: isTokenError, 
    error: tokenDonationError,
    transactionHash: tokenTransactionHash 
  } = useTokenDonation();
  
  // Combined state values for cleaner template
  const isLoading = isNativeLoading || isTokenLoading;
  const isSuccess = isNativeSuccess || isTokenSuccess;
  const isError = isNativeError || isTokenError;
  const donationError = nativeDonationError || tokenDonationError;
  const transactionHash = nativeTransactionHash || tokenTransactionHash;

  // Set initial token selection when wallet tokens load
  useEffect(() => {
    if (walletTokens.length > 0 && !selectedToken) {
      setSelectedToken(walletTokens[0]);
      if (walletTokens[0].address) {
        updateExchangeRate(walletTokens[0].address as Address);
      }
    }
  }, [walletTokens, selectedToken]);
  
  // Update exchange rate when token selection changes
  useEffect(() => {
    if (chain?.id && selectedToken) {
      if (selectedToken.address) {
        updateExchangeRate(selectedToken.address as Address);
      }
    }
  }, [selectedToken, chain]);
  
  // Update USD equivalent when donation amount or exchange rate changes
  useEffect(() => {
    if (donationAmount && exchangeRate) {
      // Convert token amount to USD
      const usd = parseFloat(donationAmount) / exchangeRate;
      setUsdEquivalent(usd.toFixed(2));
    } else {
      setUsdEquivalent("");
    }
  }, [donationAmount, exchangeRate]);

  // Function to get and update the exchange rate
  const updateExchangeRate = async (tokenAddress: Address) => {
    if (!chain?.id) return;
    
    setLoadingRate(true);
    try {
      const rate = await fetchExchangeRate(chain.id, tokenAddress);
      setExchangeRate(rate);
    } catch (err) {
      console.error("Error fetching exchange rate:", err);
      setError("Could not fetch current exchange rate. Please try again later.");
    } finally {
      setLoadingRate(false);
    }
  };
  
  // Handle token selection change
  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAddress = e.target.value;
    const token = walletTokens.find(t => 
      (t.isNative && selectedAddress === "native") || 
      (!t.isNative && t.address === selectedAddress)
    );
    
    if (token) {
      setSelectedToken(token);
      setDonationAmount("");
      setUsdEquivalent("");
    }
  };
  
  // Handle donation amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only valid numbers
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setDonationAmount(value);
    }
  };
  
  // Use max balance
  const handleUseMaxBalance = () => {
    if (selectedToken) {
      // Leave a small amount for gas if it's the native token
      const amount = selectedToken.isNative 
        ? (parseFloat(selectedToken.formattedBalance) * 0.95).toFixed(4) // 95% of balance for gas
        : selectedToken.formattedBalance;
      
      setDonationAmount(amount);
    }
  };
  
  const handleDonate = () => {
    if (!donationAmount || isNaN(parseFloat(donationAmount)) || parseFloat(donationAmount) <= 0) {
      setError('Please enter a valid donation amount');
      return;
    }
    
    // Check minimum donation amount
    if (parseFloat(usdEquivalent) < MINIMUM_DONATION_USD) {
      setError(`Minimum donation amount is $${MINIMUM_DONATION_USD} USD`);
      return;
    }
    
    // Check if amount exceeds balance
    if (selectedToken && parseFloat(donationAmount) > parseFloat(selectedToken.formattedBalance)) {
      setError('Donation amount exceeds your wallet balance');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Make the donation
    try {
      if (selectedToken?.isNative) {
        // Native token donation
        makeNativeDonation(donationAmount);
      } else if (selectedToken) {
        // ERC20 token donation
        makeTokenDonation(selectedToken.address, donationAmount, selectedToken.decimals, message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error making donation: ${errorMessage}`);
    }
  };
  
  // Handle successful transaction
  useEffect(() => {
    if (isSuccess && transactionHash && selectedToken) {
      // Save donor info to sessionStorage
      const donorInfo: DonorInfo = {
        usdAmount: usdEquivalent,
        tokenAmount: donationAmount,
        tokenSymbol: selectedToken.symbol,
        tokenAddress: selectedToken.address ?? "",
        transactionHash,
        message: message || undefined
      };
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('donorInfo', JSON.stringify(donorInfo));
      }
      
      // Redirect to confirmation page
      router.push(`/confirmation?tx=${transactionHash}&type=donation`);
    }
  }, [isSuccess, transactionHash, selectedToken, usdEquivalent, donationAmount, message, router]);
  
  // Handle donation errors
  useEffect(() => {
    if (isError && donationError) {
      setError(`Transaction failed: ${donationError.message}`);
    }
  }, [isError, donationError]);

  return (
    <Card className="max-w-lg mx-auto">
      {/* <CardHeader>
        <div className="flex items-center gap-3">
          <Image 
            src="/assets/img/BAM-transparent.png" 
            alt="BAM Logo" 
            width={40}
            height={40}
          />
          <CardTitle className="text-2xl">Support BAM&apos;s Mission</CardTitle>
        </div>
      </CardHeader> */}
      
      <CardContent className="space-y-6 mt-14">
        <p className="text-muted-foreground">
          Help us drive impactful innovation in Africa&apos;s tech ecosystem. Your donation supports hackathons, workshops, mentorship programs, and resources to empower African talent and startups. Join us in building the future of tech in Africa.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message (optional)
            </label>
            <textarea 
              id="message"
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              placeholder="Leave a message with your donation"
              rows={3}
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {!isConnected ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Connect your wallet to donate:</p>
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select token and amount</h3>
            
            {loadingWalletTokens ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : walletTokens.length === 0 ? (
              <div className="relative w-full rounded-lg border border-destructive/50 px-4 py-3 text-sm text-destructive dark:border-destructive">
                No supported tokens found in your wallet.
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label htmlFor="token-select" className="text-sm font-medium">
                    Select token from your wallet
                  </label>
                  <select
                    id="token-select"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedToken?.isNative ? "native" : (selectedToken?.address || "")}
                    onChange={handleTokenChange}
                    disabled={isSuccess}
                  >
                    {walletTokens.map(token => (
                      <option 
                        key={token.isNative ? "native" : token.address} 
                        value={token.isNative ? "native" : (token.address || "")}
                      >
                        {token.symbol} - Balance: {token.formattedBalance}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Donation amount ({selectedToken?.symbol})
                  </label>
                  <div className="relative">
                    <Input 
                      id="amount"
                      type="text" 
                      value={donationAmount} 
                      onChange={handleAmountChange}
                      placeholder={`0.00 ${selectedToken?.symbol}`}
                      disabled={isSuccess}
                      required
                      className="pr-20"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7"
                      onClick={handleUseMaxBalance}
                      disabled={isSuccess}
                    >
                      MAX
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Balance: {selectedToken?.formattedBalance} {selectedToken?.symbol}
                  </p>
                </div>
                
                {donationAmount && exchangeRate && (
                  <div className="bg-muted p-4 rounded-lg space-y-1">
                    <p className="text-sm">
                      Estimated value: ${usdEquivalent} USD
                    </p>
                    {parseFloat(usdEquivalent) < MINIMUM_DONATION_USD && (
                      <p className="text-xs text-destructive">
                        Minimum donation amount is ${MINIMUM_DONATION_USD} USD
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Exchange rate: 1 {selectedToken?.symbol} ≈ ${(1/exchangeRate).toFixed(6)} USD
                    </p>
                  </div>
                )}
                
                {isSuccess && (
                  <div className="relative w-full rounded-lg border border-green-500 bg-green-50 dark:bg-green-950/20 px-4 py-3 text-sm">
                    <div className="text-green-700 dark:text-green-400">
                      ✅ Donation successful! Redirecting to confirmation page...
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="relative w-full rounded-lg border border-destructive/50 px-4 py-3 text-sm text-destructive dark:border-destructive">
                    {error}
                  </div>
                )}
                
                <Button 
                  onClick={handleDonate} 
                  disabled={isLoading || loadingRate || loadingWalletTokens || !donationAmount || isSuccess}
                  className="w-full"
                  size="lg"
                >
                  {isSuccess ? 'Donation Complete ✅' : isLoading ? 'Processing...' : 'Donate Now'}
                </Button>
                
                {transactionHash && (
                  <div className="p-3 bg-muted rounded-lg space-y-1">
                    <p className="text-sm font-medium">Transaction Hash:</p>
                    <p className="text-xs font-mono break-all text-muted-foreground">{transactionHash}</p>
                  </div>
                )}
                
                {isLoading && (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Spinner />
                    <p className="text-sm text-muted-foreground">Waiting for confirmation...</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DonationDetailsForm;