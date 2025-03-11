// src/utils/currencyUtils.js

/**
 * Configuration for supported networks and their tokens
 * For each network, include native token info and any additional supported tokens
 */
export const networkConfig = {
    // Ethereum Mainnet
    1: {
      name: "Ethereum Mainnet",
      nativeCurrency: {
        coingeckoId: "ethereum",
        symbol: "ETH",
        decimals: 18
      },
      supportedTokens: {
        // Example ERC20 tokens
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": { // USDC
          coingeckoId: "usd-coin",
          symbol: "USDC",
          decimals: 6
        },
        "0xdAC17F958D2ee523a2206206994597C13D831ec7": { // USDT
          coingeckoId: "tether",
          symbol: "USDT",
          decimals: 6
        }
        // Add more tokens as needed
      }
    },
    // Polygon
    137: {
      name: "Polygon",
      nativeCurrency: {
        coingeckoId: "matic-network",
        symbol: "MATIC",
        decimals: 18
      },
      supportedTokens: {
        // Polygon tokens
      }
    },
    // Optimism
    10: {
      name: "Optimism",
      nativeCurrency: {
        coingeckoId: "ethereum", // Uses ETH
        symbol: "ETH",
        decimals: 18
      },
      supportedTokens: {
        // Optimism tokens
      }
    },
    // Arbitrum
    42161: {
      name: "Arbitrum",
      nativeCurrency: {
        coingeckoId: "ethereum", // Uses ETH
        symbol: "ETH",
        decimals: 18
      },
      supportedTokens: {
        // Arbitrum tokens
      }
    },
    // Base
    8453: {
      name: "Base",
      nativeCurrency: {
        coingeckoId: "ethereum", // Uses ETH
        symbol: "ETH",
        decimals: 18
      },
      supportedTokens: {
        // Base tokens
      }
    },
    // BSC
    56: {
      name: "BNB Smart Chain",
      nativeCurrency: {
        coingeckoId: "binancecoin",
        symbol: "BNB",
        decimals: 18
      },
      supportedTokens: {
        // BSC tokens
      }
    },
    //Testnet
    // Base Sepolio
    84532: {
        name: "Base Sepolio",
        nativeCurrency: {
          coingeckoId: "ethereum", // Uses ETH
          symbol: "ETH",
          decimals: 18
        },
        supportedTokens: {
          "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": { // USDC
            coingeckoId: "usd-coin",
            symbol: "USDC",
            decimals: 6
          },
          // Base tokens
        }
      },
    // Add more networks as needed
  };
  
  /**
   * Get network configuration by chain ID
   * @param {number} chainId - The blockchain network ID
   * @returns {Object|null} The network configuration or null if not supported
   */
  export const getNetworkConfig = (chainId) => {
    return networkConfig[chainId] || null;
  };
  
  /**
   * Gets the CoinGecko token ID based on chain ID and token address
   * @param {number} chainId - The blockchain network ID
   * @param {string|null} tokenAddress - The token contract address (null for native token)
   * @returns {string|null} The corresponding CoinGecko token ID or null if not found
   */
  export const getTokenInfo = (chainId, tokenAddress = null) => {
    const network = getNetworkConfig(chainId);
    if (!network) return null;
    
    // If no token address is provided, return native currency info
    if (!tokenAddress) {
      return network.nativeCurrency;
    }
    
    // Check if the token is supported on this network
    const tokenInfo = network.supportedTokens[tokenAddress.toLowerCase()];
    return tokenInfo || null;
  };
  
  /**
   * Fetches the current exchange rate for a specific token
   * @param {number} chainId - The blockchain network ID
   * @param {string|null} tokenAddress - The token contract address (null for native token)
   * @returns {Promise<number>} The exchange rate (token per USD)
   */
  export const fetchExchangeRate = async (chainId, tokenAddress = null) => {
    const tokenInfo = getTokenInfo(chainId, tokenAddress);
    
    if (!tokenInfo) {
      throw new Error(`Token not supported on network ${chainId}`);
    }
    
    // Fetch the current price of the token in USD
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenInfo.coingeckoId}&vs_currencies=usd`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rate: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if the response contains the expected data
    if (!data[tokenInfo.coingeckoId] || !data[tokenInfo.coingeckoId].usd) {
      throw new Error("Invalid exchange rate data received");
    }
    
    // Calculate the exchange rate (token per USD)
    return 1 / data[tokenInfo.coingeckoId].usd;
  };
  
  /**
   * Converts USD amount to token amount
   * @param {string|number} usdAmount - The amount in USD
   * @param {number} exchangeRate - The current exchange rate
   * @param {number} chainId - The blockchain network ID
   * @param {string|null} tokenAddress - The token contract address (null for native token)
   * @returns {string} The formatted amount in the specified token
   */
  export const convertToTokenAmount = (usdAmount, exchangeRate, chainId, tokenAddress = null) => {
    if (!exchangeRate) return "0";
    
    // Get token info
    const tokenInfo = getTokenInfo(chainId, tokenAddress);
    if (!tokenInfo) return "0";
    
    // Convert USD to token amount
    const tokenAmount = parseFloat(usdAmount) * exchangeRate;
    
    // Return the token amount formatted as a string with appropriate precision based on token decimals
    // For display, we use 6 decimal places max, but the full precision is stored for the actual transaction
    return tokenAmount.toFixed(Math.min(6, tokenInfo.decimals));
  };
  
  /**
   * Gets the currency symbol for a given token
   * @param {number} chainId - The blockchain network ID
   * @param {string|null} tokenAddress - The token contract address (null for native token)
   * @returns {string} The currency symbol or "ETH" as default
   */
  export const getTokenSymbol = (chainId, tokenAddress = null) => {
    const tokenInfo = getTokenInfo(chainId, tokenAddress);
    return tokenInfo ? tokenInfo.symbol : "ETH";
  };
  
  /**
   * Formats a token amount with the appropriate symbol
   * @param {string|number} amount - The token amount
   * @param {number} chainId - The blockchain network ID
   * @param {string|null} tokenAddress - The token contract address (null for native token)
   * @returns {string} Formatted amount with symbol
   */
  export const formatTokenAmount = (amount, chainId, tokenAddress = null) => {
    const symbol = getTokenSymbol(chainId, tokenAddress);
    return `${amount} ${symbol}`;
  };
  
  /**
   * Gets a list of supported tokens for a given network
   * @param {number} chainId - The blockchain network ID
   * @returns {Array} List of supported tokens with addresses and symbols
   */
  export const getSupportedTokens = (chainId) => {
    const network = getNetworkConfig(chainId);
    if (!network) return [];
    
    // Always include native token
    const tokens = [
      {
        address: null, // null represents native token
        symbol: network.nativeCurrency.symbol,
        name: network.nativeCurrency.symbol, // We could enhance this with actual names
        isNative: true
      }
    ];
    
    // Add ERC20 tokens
    Object.entries(network.supportedTokens).forEach(([address, tokenInfo]) => {
      tokens.push({
        address,
        symbol: tokenInfo.symbol,
        name: tokenInfo.symbol, // We could enhance this with actual names
        isNative: false
      });
    });
    
    return tokens;
  };