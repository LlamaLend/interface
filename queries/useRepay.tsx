import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { chainConfig, LOCAL_STORAGE_KEY } from '~/lib/constants'
import { txError, txSuccess } from '~/components/TxToast'
import { useTxContext } from '~/contexts'

export interface ILoanToRepay {
	nft: string
	interest: string
	startTime: string
	borrowed: string
}

interface IUseRepayProps {
	loanPoolAddress: string
	loansToRepay: Array<ILoanToRepay>
	payableAmout: string
	enabled: boolean
}

export function useRepay({ loanPoolAddress, loansToRepay, payableAmout, enabled }: IUseRepayProps) {
	const router = useRouter()

	const { cart, ...queries } = router.query

	const queryClient = useQueryClient()

	const { address: userAddress } = useAccount()
	const { chain } = useNetwork()

	const config = chainConfig(chain?.id)

	const txContext = useTxContext()

	const { config: contractConfig } = usePrepareContractWrite({
		addressOrName: loanPoolAddress,
		contractInterface: config.poolABI,
		functionName: 'repay',
		args: [loansToRepay],
		overrides: {
			value: payableAmout
			// gasLimit: new BigNumber(0.0005).times(1e9).toFixed(0)
		},
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
				txSuccess({
					txHash: contractWrite.data?.hash ?? '',
					blockExplorer: config.blockExplorer,
					content: 'Transaction Success'
				})

				// clear items in cart if tx is successfull
				const prevItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')

				if (userAddress) {
					if (prevItems) {
						const items = prevItems[userAddress]

						localStorage.setItem(
							LOCAL_STORAGE_KEY,
							JSON.stringify({
								...items,
								[userAddress]: {
									[loanPoolAddress]: []
								}
							})
						)
					} else {
						localStorage.setItem(
							LOCAL_STORAGE_KEY,
							JSON.stringify({
								[userAddress]: {
									[loanPoolAddress]: []
								}
							})
						)
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
