import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import BigNumber from 'bignumber.js'
import { chainConfig, LOCAL_STORAGE_KEY } from '~/lib/constants'
import { useGetQuote } from './useGetQuote'
import { txError, txSuccess } from '~/components/TxToast'
import { useTxContext } from '~/contexts'

interface IUseBorrowProps {
	poolAddress: string
	cartTokenIds: Array<number>
	enabled: boolean
}

export function useBorrow({ poolAddress, cartTokenIds, enabled }: IUseBorrowProps) {
	const { data: quote, isLoading: isFetchingQuote, isError: failedFetchQuotation } = useGetQuote(poolAddress)
	const router = useRouter()

	const queryClient = useQueryClient()

	const { chain } = useNetwork()

	const config = chainConfig(chain?.id)

	const txContext = useTxContext()

	const { config: contractConfig, refetch } = usePrepareContractWrite({
		addressOrName: poolAddress,
		contractInterface: config.poolABI,
		functionName: 'borrow',
		args: [
			[...cartTokenIds],
			new BigNumber(quote?.price ?? 0).times(1e18).toFixed(0),
			quote?.deadline,
			quote?.signature?.v,
			quote?.signature?.r,
			quote?.signature?.s
		],
		enabled
	})

	const contractWrite = useContractWrite({
		...contractConfig,
		onSuccess: (data) => {
			txContext.hash!.current = data.hash
			txContext.dialog?.toggle()
		}
	})

	const waitForTransaction = useWaitForTransaction({
		hash: contractWrite.data?.hash,
		onSettled: (data) => {
			if (data?.status === 1) {
				const tubbies = contractWrite.variables?.args?.[0].length
				const price = contractWrite.variables?.args?.[1]
				const total = new BigNumber(price).times(tubbies).div(1e18).toFixed(3)

				txSuccess({
					txHash: contractWrite.data?.hash ?? '',
					blockExplorer: config.blockExplorer,
					content: <span>{`Borrow ${total} ETH`}</span>
				})

				// clear items in cart if tx is successfull
				const prevItems = localStorage.getItem(LOCAL_STORAGE_KEY)

				if (prevItems) {
					const items = JSON.parse(prevItems)
					localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...items, [poolAddress]: [] }))
				} else {
					localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ [poolAddress]: [] }))
				}

				router.push('/')
			} else {
				txError({ txHash: contractWrite.data?.hash ?? '', blockExplorer: config.blockExplorer })
			}

			queryClient.invalidateQueries()
		}
	})

	return {
		...contractWrite,
		waitForTransaction,
		mutationDisabled: isFetchingQuote || failedFetchQuotation,
		refetchBorrow: refetch
	}
}
