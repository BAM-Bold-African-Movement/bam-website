import { useState, useEffect } from 'react';
import { useAccount, useBalance, useReadContracts } from 'wagmi';
import type { Abi, Address } from 'viem';
import erc20Abi from '../abi/IERC20.json';
import { getNetworkConfig } from '@/utils/currencyUtils';

/**
 * Wallet token interface
 */
export interface WalletToken {
  address: string | null;
  symbol: string;
  decimals: number;
  balance: bigint;
  formattedBalance: string;
  isNative: boolean;
}

/**
 * Return type for the useWalletTokens hook
 */
interface UseWalletTokensReturn {
  walletTokens: WalletToken[];
  isLoading: boolean;
}

/**
 * Hook to get all supported tokens in the user's wallet with balances
 * @param {number | undefined} chainId - Current chain ID
 * @returns {UseWalletTokensReturn} Object containing wallet tokens and loading state
 */
export const useWalletTokens = (chainId: number | undefined): UseWalletTokensReturn => {
  const { address, isConnected } = useAccount();
  const [walletTokens, setWalletTokens] = useState<WalletToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ERC20_ABI = erc20Abi.abi as Abi;

  // Get native token balance
  const { data: nativeBalance, isLoading: nativeLoading } = useBalance({
    address,
    chainId,
    query: {
      enabled: isConnected && !!chainId,
    }
  });

  // Get supported tokens for the current chain
  const networkConfig = chainId ? getNetworkConfig(chainId) : null;
  const supportedTokenAddresses = networkConfig 
    ? Object.keys(networkConfig.supportedTokens) 
    : [];

  // Prepare contract calls for all token balances + symbols
  const contractCalls = supportedTokenAddresses.flatMap(tokenAddress => [
    {
      address: tokenAddress as Address,
      abi: ERC20_ABI as Abi,
      functionName: 'balanceOf',
      args: [address],
    },
    {
      address: tokenAddress as Address,
      abi: ERC20_ABI,
      functionName: 'decimals',
    },
    {
      address: tokenAddress as Address,
      abi: ERC20_ABI,
      functionName: 'symbol',
    }
  ]);

  // Execute all token balance + info reads in one batch
  const { data: tokenData, isLoading: tokenLoading } = useReadContracts({
    contracts: contractCalls,
    query: {
      enabled: isConnected && supportedTokenAddresses.length > 0 && !!address,
    }
  });

  useEffect(() => {
    if (!isConnected || !chainId) {
      setWalletTokens([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    const tokens: WalletToken[] = [];
    
    // Add native token if we have balance data
    if (nativeBalance) {
      const nativeToken: WalletToken = {
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
        const balanceResult = tokenData[i];
        const decimalsResult = tokenData[i + 1];
        const symbolResult = tokenData[i + 2];
        const tokenAddress = supportedTokenAddresses[Math.floor(i / 3)];
        
        // Type guard and extraction of results
        const balance = balanceResult?.result as bigint | undefined;
        const decimals = decimalsResult?.result as number | undefined;
        const symbol = symbolResult?.result as string | undefined;
        
        // Skip tokens with zero balance or missing data
        if (balance && decimals !== undefined && symbol && balance > BigInt(0)) {
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
  }, [isConnected, chainId, nativeBalance, tokenData, supportedTokenAddresses.length, address]);

  return { walletTokens, isLoading: isLoading || nativeLoading || tokenLoading };
};