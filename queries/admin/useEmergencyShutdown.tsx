import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import toast from 'react-hot-toast'
import { txConfirming, txError, txSuccess } from '~/components/TxToast'
import { useTxContext } from '~/contexts'
import { chainConfig } from '~/lib/constants'
import { useGetAllPools } from '../useGetAllPools'

interface IShutdownBorrows {
	userAddress: string
	chainId: number
	poolAddress: string
}

export default function useEmergencyShutdown({ userAddress, chainId, poolAddress }: IShutdownBorrows) {
	const txContext = useTxContext()

	const { chain } = useNetwork()

	const queryClient = useQueryClient()

	const { address } = useAccount()

	const config = chainConfig(chainId)

	const txConfirmingId = useRef<string>()

	const { config: contractConfig } = usePrepareContractWrite({
		addressOrName: poolAddress,
		contractInterface: config.poolABI,
		functionName: 'setMaxPrice',
		args: '0',
		enabled: chain?.id === chainId && address?.toLowerCase() === userAddress?.toLowerCase()
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

export function useShutdownAllPools() {
	const { isConnected } = useAccount()
	const { chain } = useNetwork()

	const txContext = useTxContext()

	const queryClient = useQueryClient()

	const config = chainConfig(chain?.id)

	const txConfirmingId = useRef<string>()

	const { data } = useGetAllPools({ chainId: chain?.id, skipOracle: true })

	const { config: contractConfig } = usePrepareContractWrite({
		addressOrName: config.factoryAddress,
		contractInterface: config.factoryABI,
		functionName: 'emergencyShutdown',
		args: [data?.map((pool) => pool.address)],
		enabled: isConnected && !chain?.unsupported && data ? true : false
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
