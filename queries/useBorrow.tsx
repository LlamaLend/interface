import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi'
import toast from 'react-hot-toast'
import { txConfirming, txError, txSuccess } from '~/components/TxToast'
import { useGetOracle } from './useGetOracle'
import { useTxContext } from '~/contexts'
import { chainConfig, EMAIL_SERVER_API, LOCAL_STORAGE_KEY } from '~/lib/constants'

interface IUseBorrowProps {
	poolAddress: string
	collectionAddress: string
	cartTokenIds: Array<number>
	maxInterest?: string
	totalReceived: string
	enabled: boolean
	chainId?: number
	email?: string
}

export function useBorrow({
	poolAddress,
	collectionAddress,
	cartTokenIds,
	maxInterest,
	totalReceived,
	enabled,
	chainId,
	email
}: IUseBorrowProps) {
	const { address } = useAccount()
	const router = useRouter()
	const txContext = useTxContext()

	const { chain } = useNetwork()

	const {
		data: oracle,
		isLoading: fetchingOracle,
		isError: errorFetchingOracle
	} = useGetOracle({ nftContractAddress: collectionAddress, chainId: chainId })

	const queryClient = useQueryClient()

	const { address: userAddress } = useAccount()

	const config = chainConfig(chainId)

	const txConfirmingId = useRef<string>()

	// const { config: contractConfig } = usePrepareContractWrite({
	// 	addressOrName: poolAddress,
	// 	contractInterface: config.poolABI,
	// 	functionName: 'borrow',
	// 	args: [
	// 		[...cartTokenIds],
	// 		oracle?.price,
	// 		oracle?.deadline,
	// 		maxInterest,
	// 		totalReceived,
	// 		oracle?.signature?.v,
	// 		oracle?.signature?.r,
	// 		oracle?.signature?.s
	// 	],
	// 	enabled: enabled && (oracle?.price ? true : false) && chain?.id === chainId
	// })

	const contractWrite = useContractWrite({
		mode: 'recklesslyUnprepared',
		addressOrName: poolAddress,
		contractInterface: config.poolABI,
		functionName: 'borrow',
		args: [
			[...cartTokenIds],
			oracle?.price,
			oracle?.deadline,
			maxInterest,
			totalReceived,
			oracle?.signature?.v,
			oracle?.signature?.r,
			oracle?.signature?.s
		],
		enabled: enabled && (oracle?.price ? true : false) && chain?.id === chainId,
		onSuccess: (data) => {
			if (email && email !== '') {
				fetch(EMAIL_SERVER_API, {
					method: 'POST',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({ email, address })
				})
			}

			txContext.hash!.current = data.hash
			txContext.dialog?.toggle()

			txConfirmingId.current = txConfirming({ txHash: data.hash, blockExplorer: config.blockExplorer })
		}
	})

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash,
		onSettled: (data) => {
			toast.dismiss(txConfirmingId.current)

			if (data?.status === 1) {
				const totalReceived = contractWrite.variables?.args?.[4]

				txSuccess({
					txHash: contractWrite.data?.hash ?? '',
					blockExplorer: config.blockExplorer,
					content: <span>{`Borrow ${totalReceived / 1e18} ETH`}</span>
				})

				// clear items in cart if tx is successfull
				const storage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')

				// get all items of this chain from local storage
				const allItemsInChain = chainId && storage?.[chainId]

				if (allItemsInChain) {
					if (userAddress) {
						// get all items of user
						const userItems = allItemsInChain[userAddress]
						if (userItems) {
							// clear items in cart
							localStorage.setItem(
								LOCAL_STORAGE_KEY,
								JSON.stringify({
									...storage,
									[chainId]: {
										...allItemsInChain,
										[userAddress]: {
											...userItems,
											[poolAddress]: []
										}
									}
								})
							)
						}
					}
				}

				queryClient.invalidateQueries()

				router.push('/repay')
			} else {
				txError({ txHash: contractWrite.data?.hash ?? '', blockExplorer: config.blockExplorer })
			}

			queryClient.invalidateQueries()
		}
	})

	return {
		...contractWrite,
		waitForTransaction,
		mutationDisabled: fetchingOracle || errorFetchingOracle
	}
}
