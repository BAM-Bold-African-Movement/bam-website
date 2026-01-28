// 'use client'

// import {
//   Transaction,
//   TransactionButton,
//   TransactionStatus,
//   TransactionStatusAction,
//   TransactionStatusLabel,
// } from '@coinbase/onchainkit/transaction'
// import type { TransactionError, TransactionResponseType } from '@coinbase/onchainkit/transaction'
// import type { ContractFunctionParameters } from 'viem'

// import { BASE_SEPOLIA_CHAIN_ID, mintABI, mintContractAddress } from '@/utils/constants'

// export default function TransactionWrapper(
//   address: string,
// ) {
//   const contracts: ContractFunctionParameters[] = [
//     {
//       address: mintContractAddress,
//       abi: mintABI,
//       functionName: 'mint',
//       args: [address],
//     },
//   ]

//   const handleError = (err: TransactionError) => {
//     console.error('Transaction error:', err)
//   }

//   const handleSuccess = (response: TransactionResponseType) => {
//     console.log('Transaction successful', response)
//   }

//   return (
//     <div className="flex w-full max-w-[450px]">
//       <Transaction
//         calls={contracts}
//         className="w-full"
//         chainId={BASE_SEPOLIA_CHAIN_ID}
//         onError={handleError}
//         onSuccess={handleSuccess}
//       >
//         <TransactionButton className="mt-0 mx-auto w-full max-w-full text-white" />
//         <TransactionStatus>
//           <TransactionStatusLabel />
//           <TransactionStatusAction />
//         </TransactionStatus>
//       </Transaction>
//     </div>
//   )
// }