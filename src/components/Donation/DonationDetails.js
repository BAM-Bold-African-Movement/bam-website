import React, { useState, useEffect } from 'react';
import { useAccount, useChains } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNativeDonation, useTokenDonation } from '../../services/donationService';
import { 
  fetchExchangeRate, 
  convertToTokenAmount, 
  getTokenSymbol,
  getTokenInfo
} from '../../utils/currencyUtils';
import { useWalletTokens } from '../../hooks/useWalletTokens';

const DonationDetailsForm = () => {
  // User account state
  const { address, isConnected } = useAccount();
  const { chain } = useChains();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  // User info state
  const [donorName, setDonorName] = useState("");
  const [email, setEmail] = useState("");
  
  // Token selection and amount state
  const [selectedToken, setSelectedToken] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [usdEquivalent, setUsdEquivalent] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loadingRate, setLoadingRate] = useState(false);
  
  // Minimum donation amount in USD
  const MINIMUM_DONATION_USD = 5;
  
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
  } = useTokenDonation(message);
  
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
      updateExchangeRate(walletTokens[0].address);
    }
  }, [walletTokens]);
  
  // Update exchange rate when token selection changes
  useEffect(() => {
    if (chain?.id && selectedToken) {
      updateExchangeRate(selectedToken.address);
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
  const updateExchangeRate = async (tokenAddress) => {
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
  const handleTokenChange = (e) => {
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
  const handleAmountChange = (e) => {
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
    // Form validation
    if (!donorName) {
      setError('Please enter your name');
      return;
    }
    
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
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
    if (parseFloat(donationAmount) > parseFloat(selectedToken.formattedBalance)) {
      setError('Donation amount exceeds your wallet balance');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Make the donation
    try {
      if (selectedToken.isNative) {
        // Native token donation
        makeNativeDonation(donationAmount);
      } else {
        // ERC20 token donation
        makeTokenDonation(selectedToken.address, donationAmount);
      }
    } catch (err) {
      setError(`Error making donation: ${err.message}`);
    }
  };
  
  // Handle successful transaction
  React.useEffect(() => {
    if (isSuccess && transactionHash) {
      // Save donor info
      localStorage.setItem('donorInfo', JSON.stringify({
        name: donorName,
        email: email,
        usdAmount: usdEquivalent,
        tokenAmount: donationAmount,
        tokenSymbol: selectedToken?.symbol,
        tokenAddress: selectedToken?.address,
        transactionHash
      }));
      
      // Redirect to confirmation page
      window.location.href = `/confirmation?tx=${transactionHash}`;
    }
  }, [isSuccess, transactionHash]);
  
  // Handle donation errors
  React.useEffect(() => {
    if (isError && donationError) {
      setError(`Transaction failed: ${donationError.message}`);
    }
  }, [isError, donationError]);

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-8">
      <div className="flex items-center mb-6">
        <img 
          src="/assets/img/BAM transparent.png" 
          alt="BAM Logo" 
          className="h-10 mr-3" 
        />
        <h2 className="text-2xl font-bold">Support BAM's Mission</h2>
      </div>
      
      <p className="text-gray-600 mb-8">
        Help us drive impactful innovation in Africa's tech ecosystem. Your donation supports hackathons, workshops, mentorship programs, and resources to empower African talent and startups. Join us in building the future of tech in Africa.
      </p>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Enter customer details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Customer name</label>
            <input 
              type="text" 
              value={donorName} 
              onChange={e => setDonorName(e.target.value)} 
              placeholder="Customer name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Email address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Message (optional)</label>
            <textarea 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              placeholder="Leave a message with your donation"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
        </div>
      </div>

      {!isConnected ? (
        <div className="mb-6">
          <p className="text-gray-700 mb-3">Connect your wallet to donate:</p>
          <ConnectButton />
        </div>
      ) : (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Select token and amount</h3>
          
          {loadingWalletTokens ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : walletTokens.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="text-yellow-700">No supported tokens found in your wallet.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select token from your wallet</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedToken?.isNative ? "native" : selectedToken?.address}
                  onChange={handleTokenChange}
                >
                  {walletTokens.map(token => (
                    <option 
                      key={token.isNative ? "native" : token.address} 
                      value={token.isNative ? "native" : token.address}
                    >
                      {token.symbol} - Balance: {token.formattedBalance}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Donation amount ({selectedToken?.symbol})
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={donationAmount} 
                    onChange={handleAmountChange}
                    placeholder={`0.00 ${selectedToken?.symbol}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-24"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold py-1 px-2 rounded"
                    onClick={handleUseMaxBalance}
                  >
                    MAX
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Balance: {selectedToken?.formattedBalance} {selectedToken?.symbol}
                </p>
              </div>
              
              {donationAmount && exchangeRate && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Estimated value: ${usdEquivalent} USD
                  </p>
                  {parseFloat(usdEquivalent) < MINIMUM_DONATION_USD && (
                    <p className="text-xs text-red-600 mt-1">
                      Minimum donation amount is ${MINIMUM_DONATION_USD} USD
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Exchange rate: 1 {selectedToken?.symbol} ≈ ${(1/exchangeRate).toFixed(6)} USD
                  </p>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              <button 
                onClick={handleDonate} 
                disabled={isLoading || loadingRate || loadingWalletTokens || !donationAmount}
                className={`w-full mt-6 ${isLoading || loadingRate || loadingWalletTokens || !donationAmount ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white py-3 px-4 rounded-lg transition-colors`}
              >
                {isLoading ? 'Processing...' : 'Donate Now'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DonationDetailsForm;