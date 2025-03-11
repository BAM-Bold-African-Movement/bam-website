// src/services/donationService.js
import { useAccount, useReadContract, useWriteContract, useWaitForTransaction, useTransactionReceipt  } from 'wagmi';
import { parseEther } from 'viem';
import abi from '../abi/BAMDonation.json';
import erc20Abi from '../abi/IERC20.json';

// Replace with your deployed contract's address
const BAM_DONATION_CONTRACT = '0x8A4143dfBeD35f34bbb9f3f95b8065932157a329';

// ABI should be imported from a separate file with your full ABI
// This is a simplified version for the example
const BAM_DONATION_ABI = abi.abi;
// const BAM_DONATION_ABI = [
//   // Donation functions
//   {
//     "inputs": [{"internalType": "string", "name": "_message", "type": "string"}],
//     "name": "donate",
//     "outputs": [],
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {"internalType": "address", "name": "_token", "type": "address"},
//       {"internalType": "uint256", "name": "_amount", "type": "uint256"},
//       {"internalType": "string", "name": "_message", "type": "string"}
//     ],
//     "name": "donateToken",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   // Read functions
//   {
//     "inputs": [],
//     "name": "getAllDonations",
//     "outputs": [
//       {
//         "components": [
//           {"internalType": "address", "name": "donor", "type": "address"},
//           {"internalType": "uint256", "name": "amount", "type": "uint256"},
//           {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
//           {"internalType": "string", "name": "message", "type": "string"},
//           {"internalType": "address", "name": "tokenAddress", "type": "address"},
//           {"internalType": "enum BAMDonation.AssetType", "name": "assetType", "type": "uint8"}
//         ],
//         "internalType": "struct BAMDonation.Donation[]",
//         "name": "",
//         "type": "tuple[]"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "getNativeBalance",
//     "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
//     "stateMutability": "view",
//     "type": "function"
//   }
// ];

// Hook for native currency donation
export const useNativeDonation = (message = "") => {
  const { address } = useAccount();
  
  const { data: hash, writeContract , isPending, isError, error } = useWriteContract();
  
  const { isLoading: isTransactionLoading, isSuccess: isConfirmed  } = useTransactionReceipt({
    hash: hash,
  });
  
  const makeDonation = (amountInEth) => {
    if (!address) {
      return console.error("Wallet not connected");
    }
    
    writeContract({
      address: BAM_DONATION_CONTRACT,
      abi: BAM_DONATION_ABI,
      functionName: 'donate',
      args: [message],
      value: parseEther(amountInEth),
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
export const useTokenDonation = (tokenAddress, amount, message = "") => {
  const { address } = useAccount();
  
  const { data: hash, writeContract, isLoading, isError, error } = useWriteContract();
  
  const { isLoading: isTransactionLoading, isSuccess: isConfirmed } = useTransactionReceipt({
    hash: hash,
  });
  
  const makeDonation = (amountInEth) => {
    if (!address) {
      return console.error("Wallet not connected");
    }
    
    writeContract({
      address: BAM_DONATION_CONTRACT,
      abi: BAM_DONATION_ABI,
      functionName: 'donateToken',
      args: [tokenAddress, amount, message],
      value: parseEther(amountInEth),
    });
  };
  
  return {
    makeDonation,
    isLoading: isLoading || isTransactionLoading,
    isSuccess: isConfirmed,
    isError,
    error,
    transactionHash: hash
  };
};

// Hook to get all donations
export const useAllDonations = () => {
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_DONATION_CONTRACT,
    abi: BAM_DONATION_ABI,
    functionName: 'getAllDonations',
  });
  
  return {
    donations: data || [],
    isLoading,
    isError,
    error
  };
};

// Hook to get contract native balance
export const useContractBalance = () => {
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_DONATION_CONTRACT,
    abi: BAM_DONATION_ABI,
    functionName: 'getNativeBalance',
  });
  
  return {
    balance: data,
    isLoading,
    isError,
    error
  };
};