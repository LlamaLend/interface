import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import toast from 'react-hot-toast'
import { txConfirming, txError, txSuccess } from '~/components/TxToast'
import { useTxContext } from '~/contexts'
import { chainConfig } from '~/lib/constants'
import { formatLtv } from '~/utils'

interface IUpdateLtv {
	userAddress: string
	chainId: number
	poolAddress: string
	newLtv: string
}

export default function useUpdateLtv({ userAddress, chainId, poolAddress, newLtv }: IUpdateLtv) {
	const txContext = useTxContext()

	const { chain } = useNetwork()

	const queryClient = useQueryClient()

	const { address } = useAccount()

	const config = chainConfig(chainId)

	const txConfirmingId = useRef<string>()

	const validLtv = newLtv ? new RegExp('^(60|[1-5][0-9]?)$').test(newLtv) : false

	const { config: contractConfig } = usePrepareContractWrite({
		addressOrName: poolAddress,
		contractInterface: config.poolABI,
		functionName: 'changeLTV',
		args: formatLtv(validLtv ? newLtv : '0'),
		enabled: chain?.id === chainId && address?.toLowerCase() === userAddress?.toLowerCase() && validLtv
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
