import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { chainConfig, LOCAL_STORAGE_KEY } from '~/lib/constants'
import { txError, txSuccess } from '~/components/TxToast'
import { useTxContext } from '~/contexts'
import { gasLimitOverride } from '~/utils'

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

	const config = chainConfig(chainId)

	const txContext = useTxContext()

	const { config: contractConfig } = usePrepareContractWrite({
		addressOrName: config.factoryAddress,
		contractInterface: config.factoryABI,
		functionName: 'repay',
		args: [loansToRepay],
		overrides: {
			value: payableAmout,
			gasLimit: gasLimitOverride
		},
		enabled: enabled && chain?.id === chainId
	})

	const contractWrite = useContractWrite({
		...contractConfig,
		onSuccess: (data) => {
			// hide cart after tx is submitted
			router.push({ pathname: router.pathname, query: { ...queries } })
			txContext.hash!.current = data.hash
			txContext.dialog?.toggle()
		}
	})

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash,
		onSettled: (data) => {
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
