import { useAccount, useReadContract, useWriteContract, useWaitForTransaction, useTransactionReceipt } from 'wagmi';
import { parseEther, parseUnits, formatEther } from 'viem';
import bamDonationAbi from '../abi/BAMDonation.json';
import bamNftTrackerAbi from '../abi/BAMDonationNFTTracker.json';
import bamNftAbi from '../abi/BAMDonationNFT.json';
import erc20Abi from '../abi/IERC20.json';

// Contract addresses - replace with your deployed addresses
const BAM_DONATION_CONTRACT = '0x48EAc2465b4BfA6DEE4009C3D043A5FcCbE26545';
const BAM_NFT_TRACKER_CONTRACT = '0x24690A3f62633C45E4473120F5227741E8689f6c'; // Add your NFT tracker contract address
const BAM_NFT_CONTRACT = '0xbBb74709629B14539f705Fe1673567FC56CFe6C5'; // Add your NFT contract address

// Hook for native currency donation
export const useNativeDonation = (message = "") => {
  const { address } = useAccount();
  
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract();
  
  const { isLoading: isTransactionLoading, isSuccess: isConfirmed } = useTransactionReceipt({
    hash: hash,
  });
  
  const makeDonation = (amountInEth) => {
    if (!address) {
      console.error("Wallet not connected");
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
    isSuccess: isConfirmed,
    isError,
    error,
    transactionHash: hash
  };
};

// Hook for token donation
export const useTokenDonation = () => {
  const { address } = useAccount();
  
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract();
  
  const { isLoading: isTransactionLoading, isSuccess: isConfirmed } = useTransactionReceipt({
    hash: hash,
  });
  
  const makeDonation = (tokenAddress, amount, decimals = 18, message = "") => {
    if (!address) {
      console.error("Wallet not connected");
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
    isSuccess: isConfirmed,
    isError,
    error,
    transactionHash: hash
  };
};

// Hook to approve token spending
export const useTokenApproval = () => {
  const { address } = useAccount();
  
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract();
  
  const { isLoading: isTransactionLoading, isSuccess: isConfirmed } = useTransactionReceipt({
    hash: hash,
  });
  
  const approveToken = (tokenAddress, amount, decimals = 18) => {
    if (!address) {
      console.error("Wallet not connected");
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
    approveToken,
    isLoading: isPending || isTransactionLoading,
    isSuccess: isConfirmed,
    isError,
    error,
    transactionHash: hash
  };
};

// Hook to check token allowance
export const useTokenAllowance = (tokenAddress, ownerAddress) => {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress, BAM_DONATION_CONTRACT],
    enabled: !!(tokenAddress && ownerAddress),
  });
  
  return {
    allowance: data,
    isLoading,
    isError,
    error,
    refetch
  };
};

// Hook to get all donations
export const useAllDonations = () => {
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: BAM_DONATION_CONTRACT,
    abi: bamDonationAbi.abi,
    functionName: 'getAllDonations',
  });

  // console.log('Hook result:', { data, isLoading, isError, error });
  
  return {
    donations: data,
    isLoading,
    isError,
    error,
    refetch
  };
};

// Hook to get donations by donor
export const useDonationsByDonor = (donorAddress) => {
  const { data: donationIndices, isLoading: indicesLoading } = useReadContract({
    address: BAM_NFT_TRACKER_CONTRACT,
    abi: bamNftTrackerAbi.abi,
    functionName: 'getDonationIndices',
    args: [donorAddress],
    enabled: !!donorAddress,
  });

  // console.log('contractAddress:', BAM_NFT_TRACKER_CONTRACT);
  // console.log('donorAddress:', donorAddress);
  // console.log('donationIndices:', donationIndices);

  const { donations: allDonations, isLoading: donationsLoading } = useAllDonations();


  const userDonations = donationIndices && allDonations 
    ? donationIndices.map(index => allDonations[Number(index)])
    : [];

  console.log('userDonations:', userDonations);

  return {
    donations: userDonations,
    donationIndices: donationIndices || [],
    isLoading: indicesLoading || donationsLoading,
  };
};

// Hook to get contract native balance
export const useContractBalance = () => {
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_DONATION_CONTRACT,
    abi: bamDonationAbi.abi,
    functionName: 'getNativeBalance',
  });
  
  return {
    balance: data ? formatEther(data) : '0',
    balanceWei: data,
    isLoading,
    isError,
    error
  };
};

// Hook to get token balance of contract
export const useContractTokenBalance = (tokenAddress) => {
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_DONATION_CONTRACT,
    abi: bamDonationAbi.abi,
    functionName: 'getTokenBalance',
    args: [tokenAddress],
    enabled: !!tokenAddress,
  });
  
  return {
    balance: data,
    isLoading,
    isError,
    error
  };
};

// NFT-related hooks

// Hook to claim NFT for a donation
export const useClaimNFT = () => {
  const { address } = useAccount();
  
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract();
  
  const { isLoading: isTransactionLoading, isSuccess: isConfirmed } = useTransactionReceipt({
    hash: hash,
  });
  
  const claimNFT = (donationIndex) => {
    if (!address) {
      console.error("Wallet not connected");
      return;
    }
    
    writeContract({
      address: BAM_NFT_TRACKER_CONTRACT,
      abi: bamNftTrackerAbi.abi,
      functionName: 'claimNFT',
      args: [donationIndex],
    });
  };
  
  return {
    claimNFT,
    isLoading: isPending || isTransactionLoading,
    isSuccess: isConfirmed,
    isError,
    error,
    transactionHash: hash
  };
};

// Hook to check if user has received NFT
export const useHasReceivedNFT = (userAddress) => {
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_NFT_CONTRACT,
    abi: bamNftAbi.abi,
    functionName: 'hasReceivedNFT',
    args: [userAddress],
    enabled: !!userAddress,
  });
  
  return {
    hasReceivedNFT: data || false,
    isLoading,
    isError,
    error
  };
};

// Hook to check if donation has been claimed for NFT
export const useIsDonationClaimed = (donationIndex) => {
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_NFT_TRACKER_CONTRACT,
    abi: bamNftTrackerAbi.abi,
    functionName: 'isDonationClaimed',
    args: [donationIndex],
    enabled: donationIndex !== undefined,
  });
  
  return {
    isClaimed: data || false,
    isLoading,
    isError,
    error
  };
};

// Hook to get user's NFT balance
export const useUserNFTBalance = (userAddress) => {
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_NFT_CONTRACT,
    abi: bamNftAbi.abi,
    functionName: 'balanceOf',
    args: [userAddress],
    enabled: !!userAddress,
  });
  
  return {
    balance: data ? Number(data) : 0,
    isLoading,
    isError,
    error
  };
};

// Helper function to format donation data
export const formatDonation = (donation) => {
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
    assetType: donation.assetType, // 0 = NATIVE, 1 = TOKEN
    isNative: donation.assetType === 0,
    isToken: donation.assetType === 1
  };
};

// Utility functions
export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};