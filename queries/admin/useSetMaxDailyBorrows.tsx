import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import toast from 'react-hot-toast'
import { txConfirming, txError, txSuccess } from '~/components/TxToast'
import { useTxContext } from '~/contexts'
import { chainConfig } from '~/lib/constants'
import { formatMaxDailyBorrows } from '~/utils'

interface ISetMaxDailyBorrows {
	userAddress: string
	chainId: number
	poolAddress: string
	newMaxDailyBorrows: string
}

export default function useSetMaxDailyBorrows({
	userAddress,
	chainId,
	poolAddress,
	newMaxDailyBorrows
}: ISetMaxDailyBorrows) {
	const txContext = useTxContext()

	const { chain } = useNetwork()

	const queryClient = useQueryClient()

	const { address } = useAccount()

	const config = chainConfig(chainId)

	const txConfirmingId = useRef<string>()

	const validMaxDailyBorrows =
		newMaxDailyBorrows && newMaxDailyBorrows !== '' ? new RegExp('^[0-9]*[.,]?[0-9]*$').test(newMaxDailyBorrows) : false

	const { config: contractConfig } = usePrepareContractWrite({
		addressOrName: poolAddress,
		contractInterface: config.poolABI,
		functionName: 'setMaxDailyBorrows',
		args: formatMaxDailyBorrows(validMaxDailyBorrows ? newMaxDailyBorrows : '0'),
		enabled: chain?.id === chainId && address?.toLowerCase() === userAddress?.toLowerCase() && validMaxDailyBorrows
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
				txSuccess({
					txHash: contractWrite.data?.hash ?? '',
					blockExplorer: config.blockExplorer,
					content: 'Transaction Success'
				})
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
