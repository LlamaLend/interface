import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import toast from 'react-hot-toast'
import { txConfirming, txError, txSuccess } from '~/components/TxToast'
import { useGetOracle } from './useGetOracle'
import { useTxContext } from '~/contexts'
import { useGetPoolData } from './useGetPoolData'
import { useGetNftsList } from './useNftsList'
import { chainConfig, LOCAL_STORAGE_KEY } from '~/lib/constants'

interface IUseBorrowProps {
	poolAddress: string
	cartTokenIds: Array<number>
	maxInterest?: number
	totalReceived: string
	enabled: boolean
	chainId?: number
}

export function useBorrow({
	poolAddress,
	cartTokenIds,
	maxInterest,
	totalReceived,
	enabled,
	chainId
}: IUseBorrowProps) {
	const router = useRouter()
	const txContext = useTxContext()

	const { chain } = useNetwork()

	const {
		data: oracle,
		isLoading: fetchingOracle,
		isError: errorFetchingOracle
	} = useGetOracle({ poolAddress, chainId: chainId })

	const { data: poolData, refetch: refetchPoolData } = useGetPoolData({ chainId, poolAddress })
	const { refetch: refetchNftsList } = useGetNftsList({
		nftContractAddress: poolData?.nftContract,
		chainId
	})

	const { cart, ...queries } = router.query

	const queryClient = useQueryClient()

	const { address: userAddress } = useAccount()

	const config = chainConfig(chainId)

	const txConfirmingId = useRef<string>()

	const { config: contractConfig } = usePrepareContractWrite({
		addressOrName: poolAddress,
		contractInterface: config.poolABI,
		functionName: 'borrow',
		args: [
			[...cartTokenIds],
			(oracle?.price ?? 0).toFixed(0),
			oracle?.deadline,
			maxInterest,
			totalReceived,
			oracle?.signature?.v,
			oracle?.signature?.r,
			oracle?.signature?.s
		],
		enabled: enabled && (oracle?.price ? true : false) && chain?.id === chainId
	})

	const contractWrite = useContractWrite({
		...contractConfig,
		onSuccess: (data) => {
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

				refetchPoolData()
				refetchNftsList()

				// hide cart
				router.push({ pathname: router.pathname, query: { ...queries } })
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
