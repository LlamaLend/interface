import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import toast from 'react-hot-toast'
import { txConfirming, txError, txSuccess } from '~/components/TxToast'
import { useTxContext } from '~/contexts'
import { chainConfig } from '~/lib/constants'

interface ILiquidateLoan {
	loanToLiquidate: { nft: string; interest: string; startTime: string; borrowed: string }
	chainId: number
	poolAddress: string
	liquidatorAddress: string
}

export function useLiquidateLoan({ loanToLiquidate, liquidatorAddress, chainId, poolAddress }: ILiquidateLoan) {
	const txContext = useTxContext()

	const { chain } = useNetwork()

	const queryClient = useQueryClient()

	const { address } = useAccount()

	const config = chainConfig(chainId)

	const txConfirmingId = useRef<string>()

	const validAddress = liquidatorAddress && liquidatorAddress.length === 42 ? true : false

	const { config: contractConfig } = usePrepareContractWrite({
		addressOrName: poolAddress,
		contractInterface: config.poolABI,
		functionName: 'doEffectiveAltruism',
		args: [loanToLiquidate, liquidatorAddress],
		enabled: chain?.id === chainId && address?.toLowerCase() === liquidatorAddress?.toLowerCase() && validAddress
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
