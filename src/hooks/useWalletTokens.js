import { useState, useEffect, useMemo } from 'react';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { getNetworkConfig } from '../utils/currencyUtils';
import erc20Abi from '../abi/IERC20.json';

/**
 * Hook to get all supported tokens in the user's wallet with balances
 * @param {number} chainId - Current chain ID
 * @returns {Object} Object containing wallet tokens and loading state
 */
export const useWalletTokens = (chainId) => {
  const { address, isConnected } = useAccount();
  const [walletTokens, setWalletTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const ERC20_ABI = erc20Abi.abi;

  // Get native token balance
  const { data: nativeBalance, isLoading: nativeLoading } = useBalance({
    address,
    chainId,
    enabled: isConnected && !!chainId,
  });

  // Get supported tokens for the current chain
  const networkConfig = getNetworkConfig(chainId);
  const supportedTokenAddresses = useMemo(() => {
    return networkConfig 
      ? Object.keys(networkConfig.supportedTokens) 
      : [];
  }, [networkConfig]);

  // Prepare contract calls for all token balances + symbols
  const contractCalls = supportedTokenAddresses.flatMap(tokenAddress => [
    {
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address],
    },
    {
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'decimals',
    },
    {
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'symbol',
    }
  ]);

  // Execute all token balance + info reads in one batch
  const { data: tokenData, isLoading: tokenLoading } = useReadContract({
    contracts: contractCalls,
    enabled: isConnected && supportedTokenAddresses.length > 0 && !!address,
  });

  useEffect(() => {
    if (!isConnected || !chainId) {
      setWalletTokens([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    const tokens = [];
    
    // Add native token if we have balance data
    if (nativeBalance) {
      const nativeToken = {
        address: null,
        symbol: nativeBalance.symbol,
        decimals: nativeBalance.decimals,
        balance: nativeBalance.value,
        formattedBalance: nativeBalance.formatted,
        isNative: true
      };
      tokens.push(nativeToken);
    }
    
    // Process ERC20 token balances
    if (tokenData && supportedTokenAddresses.length > 0) {
      // Process token data in groups of 3 (balance, decimals, symbol)
      for (let i = 0; i < tokenData.length; i += 3) {
        const balance = tokenData[i].result;
        const decimals = tokenData[i+1].result;
        const symbol = tokenData[i+2].result;
        const tokenAddress = supportedTokenAddresses[Math.floor(i/3)];
        
        // Skip tokens with zero balance
        if (balance && balance > 0n) {
          // Format the balance to a human-readable format
          const formattedBalance = (Number(balance) / 10 ** Number(decimals)).toFixed(4);
          
          tokens.push({
            address: tokenAddress,
            symbol,
            decimals,
            balance,
            formattedBalance,
            isNative: false
          });
        }
      }
    }
    
    setWalletTokens(tokens);
    setIsLoading(false);
  }, [isConnected, chainId, nativeBalance, tokenData, supportedTokenAddresses, address]);

  return { walletTokens, isLoading: isLoading || nativeLoading || tokenLoading };
};