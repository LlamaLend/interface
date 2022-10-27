import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi'
import toast from 'react-hot-toast'
import { txConfirming, txError, txSuccess } from '~/components/TxToast'
import { useTxContext } from '~/contexts'
import { useGetLoans } from './useLoans'
import { chainConfig, LOCAL_STORAGE_KEY } from '~/lib/constants'

export interface ILoanToRepay {
	pool: string
	loans: Array<{ nft: string; interest: string; startTime: string; borrowed: string }>
}

interface IUseRepayProps {
	loansToRepay: Array<ILoanToRepay>
	payableAmout: string
	enabled: boolean
	chainId?: number
}

export function useRepay({ loansToRepay, payableAmout, enabled, chainId }: IUseRepayProps) {
	const router = useRouter()

	const { cart, ...queries } = router.query

	const queryClient = useQueryClient()

	const { address: userAddress } = useAccount()
	const { chain } = useNetwork()

	const { refetch } = useGetLoans({ chainId, userAddress })

	const config = chainConfig(chainId)

	const txConfirmingId = useRef<string>()

	const txContext = useTxContext()

	const uniquePools = Array.from(
		loansToRepay.reduce((acc, curr) => {
			acc.add(curr.pool)
			return acc
		}, new Set<string>())
	)

	// Interact with repay() of LlamaLendFactory when there are multiple pools, or else use pools's repay() to pay off loans
	const addressOrName = uniquePools.length > 1 ? config.factoryAddress : uniquePools[0]
	const contractInterface = uniquePools.length > 1 ? config.factoryABI : config.poolABI
	const args = uniquePools.length > 1 ? [loansToRepay] : [...loansToRepay.map((x) => x.loans), userAddress]

	// const { config: contractConfig } = usePrepareContractWrite({
	// 	addressOrName,
	// 	contractInterface,
	// 	functionName: 'repay',
	// 	args,
	// 	overrides: {
	// 		value: payableAmout
	// 	},
	// 	enabled: enabled && chain?.id === chainId
	// })

	const contractWrite = useContractWrite({
		mode: 'recklesslyUnprepared',
		addressOrName,
		contractInterface,
		functionName: 'repay',
		args,
		overrides: {
			value: payableAmout
		},
		enabled: enabled && chain?.id === chainId,
		onSuccess: (data) => {
			// hide cart after tx is submitted
			router.push({ pathname: router.pathname, query: { ...queries } })
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
				txSuccess({
					txHash: contractWrite.data?.hash ?? '',
					blockExplorer: config.blockExplorer,
					content: 'Transaction Success'
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
											['repay']: []
										}
									}
								})
							)
						}
					}
				}

				// refetch all loans
				refetch()

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
		waitForTransaction
	}
}
