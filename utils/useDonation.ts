import { useAccount, useReadContract, useWriteContract, useTransactionReceipt, useChainId } from 'wagmi';
import { parseEther, parseUnits, formatEther, Address, Hex } from 'viem';
import { baseSepolia, sepolia } from 'viem/chains';
import bamDonationAbi from '../abi/BAMDonation.json';
import bamNftTrackerAbi from '../abi/BAMDonationNFTTracker.json';
import bamNftAbi from '../abi/BAMDonationNFT.json';
import erc20AbiJson from '../abi/IERC20.json';

const erc20Abi = erc20AbiJson.abi;

interface ContractAddresses {
  BAM_DONATION_CONTRACT: Address;
  BAM_NFT_TRACKER_CONTRACT: Address;
  BAM_NFT_CONTRACT: Address;
}

interface ContractAddressesResult extends Partial<ContractAddresses> {
  isSupported: boolean;
}

interface DonationData {
  donor: Address;
  amount: bigint;
  timestamp: bigint;
  message: string;
  tokenAddress: Address;
  assetType: number;
}

export interface FormattedDonation {
  donor: Address;
  amount: bigint;
  formattedAmount: string;
  timestamp: Date;
  message: string;
  tokenAddress: Address;
  assetType: number;
  isNative: boolean;
  isToken: boolean;
}

interface DonationHookResult {
  makeDonation: (...args: any[]) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  transactionHash?: Hex;
  isNetworkSupported: boolean;
}

interface ReadHookResult<T> {
  data?: T;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch?: () => void;
  isNetworkSupported: boolean;
}

const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = {
  [baseSepolia.id]: {
    BAM_DONATION_CONTRACT: '0x48EAc2465b4BfA6DEE4009C3D043A5FcCbE26545',
    BAM_NFT_TRACKER_CONTRACT: '0x24690A3f62633C45E4473120F5227741E8689f6c',
    BAM_NFT_CONTRACT: '0xbBb74709629B14539f705Fe1673567FC56CFe6C5',
  },
  [sepolia.id]: {
    BAM_DONATION_CONTRACT: '0x8A4143dfBeD35f34bbb9f3f95b8065932157a329',
    BAM_NFT_TRACKER_CONTRACT: '0xdFE7ece717f6ac1e50a8f4d80D9Ce842390F3DD0',
    BAM_NFT_CONTRACT: '0x9C66b0AD3c944793B437d5c72B052fb964e3d455',
  },
};

export const useContractAddresses = (): ContractAddressesResult => {
  const chainId = useChainId();
  
  const addresses = CONTRACT_ADDRESSES[chainId];
  
  if (!addresses) {
    console.error(`Contract addresses not configured for chain ID: ${chainId}`);
    return {
      BAM_DONATION_CONTRACT: undefined,
      BAM_NFT_TRACKER_CONTRACT: undefined,
      BAM_NFT_CONTRACT: undefined,
      isSupported: false,
    };
  }
  
  return {
    ...addresses,
    isSupported: true,
  };
};

export const useNativeDonation = (message: string = ""): DonationHookResult => {
  const { address } = useAccount();
  const { BAM_DONATION_CONTRACT, isSupported } = useContractAddresses();
  
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract();
  
  const { isLoading: isTransactionLoading, isSuccess: isConfirmed } = useTransactionReceipt({
    hash: hash,
  });
  
  const makeDonation = (amountInEth: number | string): void => {
    if (!address) {
      console.error("Wallet not connected");
      return;
    }
    
    if (!isSupported || !BAM_DONATION_CONTRACT) {
      console.error("Network not supported or contract address not found");
      return;
    }
    
    writeContract({
      address: BAM_DONATION_CONTRACT,
      abi: bamDonationAbi.abi,
      functionName: 'donate',
      args: [message],
      value: parseEther(amountInEth.toString()),
    });
  };
  
  return {
    makeDonation,
    isLoading: isPending || isTransactionLoading,
    isSuccess: isConfirmed || false,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    transactionHash: hash,
    isNetworkSupported: isSupported,
  };
};

export const useTokenDonation = (): DonationHookResult => {
  const { address } = useAccount();
  const { BAM_DONATION_CONTRACT, isSupported } = useContractAddresses();
  
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract();
  
  const { isLoading: isTransactionLoading, isSuccess: isConfirmed } = useTransactionReceipt({
    hash: hash,
  });
  
  const makeDonation = (
    tokenAddress: Address,
    amount: number | string,
    decimals: number = 18,
    message: string = ""
  ): void => {
    if (!address) {
      console.error("Wallet not connected");
      return;
    }
    
    if (!isSupported || !BAM_DONATION_CONTRACT) {
      console.error("Network not supported or contract address not found");
      return;
    }
    
    const tokenAmount = parseUnits(amount.toString(), decimals);
    
    writeContract({
      address: BAM_DONATION_CONTRACT,
      abi: bamDonationAbi.abi,
      functionName: 'donateToken',
      args: [tokenAddress, tokenAmount, message],
    });
  };
  
  return {
    makeDonation,
    isLoading: isPending || isTransactionLoading,
    isSuccess: isConfirmed || false,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    transactionHash: hash,
    isNetworkSupported: isSupported,
  };
};

export const useTokenApproval = (): DonationHookResult => {
  const { address } = useAccount();
  const { BAM_DONATION_CONTRACT, isSupported } = useContractAddresses();
  
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract();
  
  const { isLoading: isTransactionLoading, isSuccess: isConfirmed } = useTransactionReceipt({
    hash: hash,
  });
  
  const approveToken = (
    tokenAddress: Address,
    amount: number | string,
    decimals: number = 18
  ): void => {
    if (!address) {
      console.error("Wallet not connected");
      return;
    }
    
    if (!isSupported || !BAM_DONATION_CONTRACT) {
      console.error("Network not supported or contract address not found");
      return;
    }
    
    const tokenAmount = parseUnits(amount.toString(), decimals);
    
    writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [BAM_DONATION_CONTRACT, tokenAmount],
    });
  };
  
  return {
    makeDonation: approveToken,
    isLoading: isPending || isTransactionLoading,
    isSuccess: isConfirmed || false,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    transactionHash: hash,
    isNetworkSupported: isSupported,
  };
};

export const useTokenAllowance = (
  tokenAddress?: Address,
  ownerAddress?: Address
): ReadHookResult<bigint> & { allowance?: bigint } => {
  const { BAM_DONATION_CONTRACT, isSupported } = useContractAddresses();
  
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress!, BAM_DONATION_CONTRACT!],
    query: {
      enabled: !!(tokenAddress && ownerAddress && isSupported && BAM_DONATION_CONTRACT),
    }
  });
  
  return {
    allowance: data as bigint | undefined,
    data: data as bigint | undefined,
    isLoading,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    refetch,
    isNetworkSupported: isSupported,
  };
};

export const useAllDonations = (): ReadHookResult<DonationData[]> & { donations?: DonationData[] } => {
  const { BAM_DONATION_CONTRACT, isSupported } = useContractAddresses();
  
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: BAM_DONATION_CONTRACT,
    abi: bamDonationAbi.abi,
    functionName: 'getAllDonations',
    query: {
      enabled: !!(isSupported && BAM_DONATION_CONTRACT),
    }
  });
  
  return {
    donations: data as DonationData[] | undefined,
    data: data as DonationData[] | undefined,
    isLoading,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    refetch,
    isNetworkSupported: isSupported,
  };
};

export const useDonationsByDonor = (donorAddress?: Address) => {
  const { BAM_NFT_TRACKER_CONTRACT, isSupported } = useContractAddresses();
  
  const { data: donationIndices, isLoading: indicesLoading } = useReadContract({
    address: BAM_NFT_TRACKER_CONTRACT,
    abi: bamNftTrackerAbi.abi,
    functionName: 'getDonationIndices',
    args: [donorAddress!],
    query: {
      enabled: !!(donorAddress && isSupported && BAM_NFT_TRACKER_CONTRACT),
    }
  });

  const { donations: allDonations, isLoading: donationsLoading } = useAllDonations();

  const userDonations = donationIndices && allDonations 
    ? (donationIndices as bigint[]).map(index => allDonations[Number(index)])
    : [];

  return {
    donations: userDonations,
    donationIndices: (donationIndices as bigint[]) || [],
    isLoading: indicesLoading || donationsLoading,
    isNetworkSupported: isSupported,
  };
};

export const useContractBalance = () => {
  const { BAM_DONATION_CONTRACT, isSupported } = useContractAddresses();
  
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_DONATION_CONTRACT,
    abi: bamDonationAbi.abi,
    functionName: 'getNativeBalance',
    query: {
      enabled: !!(isSupported && BAM_DONATION_CONTRACT),
    }
  });
  
  return {
    balance: data ? formatEther(data as bigint) : '0',
    balanceWei: data as bigint | undefined,
    isLoading,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    isNetworkSupported: isSupported,
  };
};

export const useContractTokenBalance = (tokenAddress?: Address) => {
  const { BAM_DONATION_CONTRACT, isSupported } = useContractAddresses();
  
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_DONATION_CONTRACT,
    abi: bamDonationAbi.abi,
    functionName: 'getTokenBalance',
    args: [tokenAddress!],
    query: {
      enabled: !!(tokenAddress && isSupported && BAM_DONATION_CONTRACT),
    }
  });
  
  return {
    balance: data as bigint | undefined,
    isLoading,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    isNetworkSupported: isSupported,
  };
};


export const useClaimNFT = (): DonationHookResult & { claimNFT: (donationIndex: number | bigint) => void } => {
  const { address } = useAccount();
  const { BAM_NFT_TRACKER_CONTRACT, isSupported } = useContractAddresses();
  
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract();
  
  const { isLoading: isTransactionLoading, isSuccess: isConfirmed } = useTransactionReceipt({
    hash: hash,
  });
  
  const claimNFT = (donationIndex: number | bigint): void => {
    if (!address) {
      console.error("Wallet not connected");
      return;
    }
    
    if (!isSupported || !BAM_NFT_TRACKER_CONTRACT) {
      console.error("Network not supported or contract address not found");
      return;
    }
    
    writeContract({
      address: BAM_NFT_TRACKER_CONTRACT,
      abi: bamNftTrackerAbi.abi,
      functionName: 'claimNFT',
      args: [BigInt(donationIndex)],
    });
  };
  
  return {
    claimNFT,
    makeDonation: claimNFT,
    isLoading: isPending || isTransactionLoading,
    isSuccess: isConfirmed || false,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    transactionHash: hash,
    isNetworkSupported: isSupported,
  };
};

export const useHasReceivedNFT = (userAddress?: Address) => {
  const { BAM_NFT_CONTRACT, isSupported } = useContractAddresses();
  
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_NFT_CONTRACT,
    abi: bamNftAbi.abi,
    functionName: 'hasReceivedNFT',
    args: [userAddress!],
    query: {
      enabled: !!(userAddress && isSupported && BAM_NFT_CONTRACT),
    }
  });
  
  return {
    hasReceivedNFT: (data as boolean) || false,
    isLoading,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    isNetworkSupported: isSupported,
  };
};

export const useIsDonationClaimed = (donationIndex?: number | bigint) => {
  const { BAM_NFT_TRACKER_CONTRACT, isSupported } = useContractAddresses();
  
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_NFT_TRACKER_CONTRACT,
    abi: bamNftTrackerAbi.abi,
    functionName: 'isDonationClaimed',
    args: [donationIndex !== undefined ? BigInt(donationIndex) : undefined!],
    query: {
      enabled: !!(donationIndex !== undefined && isSupported && BAM_NFT_TRACKER_CONTRACT),
    }
  });
  
  return {
    isClaimed: (data as boolean) || false,
    isLoading,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    isNetworkSupported: isSupported,
  };
};

export const useUserNFTBalance = (userAddress?: Address) => {
  const { BAM_NFT_CONTRACT, isSupported } = useContractAddresses();
  
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_NFT_CONTRACT,
    abi: bamNftAbi.abi,
    functionName: 'balanceOf',
    args: [userAddress!],
    query: {
      enabled: !!(userAddress && isSupported && BAM_NFT_CONTRACT),
    }
  });
  
  return {
    balance: data ? Number(data) : 0,
    isLoading,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    isNetworkSupported: isSupported,
  };
};

export const formatDonation = (donation?: DonationData): FormattedDonation | null => {
  if (!donation) return null;
  
  return {
    donor: donation.donor,
    amount: donation.amount,
    formattedAmount: donation.assetType === 0 
      ? formatEther(donation.amount) 
      : donation.amount.toString(),
    timestamp: new Date(Number(donation.timestamp) * 1000),
    message: donation.message,
    tokenAddress: donation.tokenAddress,
    assetType: donation.assetType,
    isNative: donation.assetType === 0,
    isToken: donation.assetType === 1
  };
};

export const shortenAddress = (address?: Address | string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const formatTimestamp = (timestamp: Date | number | bigint): string => {
  const date = typeof timestamp === 'bigint' 
    ? new Date(Number(timestamp) * 1000)
    : typeof timestamp === 'number'
    ? new Date(timestamp)
    : timestamp;
    
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const useNetworkInfo = () => {
  const chainId = useChainId();
  const { isSupported } = useContractAddresses();
  
  const getNetworkName = (chainId: number): string => {
    switch (chainId) {
      case baseSepolia.id:
        return 'Base Sepolia';
      case sepolia.id:
        return 'Ethereum Sepolia';
      default:
        return 'Unknown Network';
    }
  };
  
  return {
    chainId,
    networkName: getNetworkName(chainId),
    isSupported,
  };
};