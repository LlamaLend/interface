import { ethers } from 'ethers'
import { useMutation } from '@tanstack/react-query'
import { useSigner } from 'wagmi'
import { useTxContext } from '~/contexts'
import useConfig from './useConfig'
import toast from 'react-hot-toast'
import { IContractWriteConfig, ITransactionError, ITransactionSuccess } from '~/types'
import { formatMsgInToast, txError, txSuccess } from '~/components/utils/toast'

export enum FormNames {
	maxPrice = 'maxPrice',
	nftAddress = 'nftAddress',
	maxDailyBorrows = 'maxDailyBorrows',
	name = 'name',
	symbol = 'symbol',
	maxLength = 'maxLength',
	maxInterestPerEthPerSecond = 'maxInterestPerEthPerSecond'
}

type PoolArgs = {
	[key in FormNames]: string
}

interface ICreatePoolArgs extends PoolArgs {
	oracleAddress: string
	contractArgs: IContractWriteConfig
}

const createPool = async (args: ICreatePoolArgs) => {
	try {
		const {
			contractArgs,
			oracleAddress,
			maxPrice,
			nftAddress,
			maxDailyBorrows,
			name,
			symbol,
			maxLength,
			maxInterestPerEthPerSecond
		} = args

		if (Object.values(args).filter((x) => !x).length > 0 || !contractArgs.signer) {
			throw new Error('Invalid arguments')
		}

		const { address, abi, signer } = contractArgs

		const contract = new ethers.Contract(address, abi, signer)

		return await contract.createPool(
			oracleAddress,
			maxPrice,
			nftAddress,
			maxDailyBorrows,
			name,
			symbol,
			maxLength,
			maxInterestPerEthPerSecond
		)
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't create a pool"))
	}
}

export function useCreatePool() {
	const txContext = useTxContext()
	const { factoryAddress, factoryABI, oracleAddress, blockExplorer } = useConfig()
	const { data: signer } = useSigner()

	const contractArgs: IContractWriteConfig = {
		address: factoryAddress,
		abi: factoryABI,
		signer: signer || null
	}

	return useMutation<ITransactionSuccess, ITransactionError, PoolArgs, unknown>(
		(args: PoolArgs) => createPool({ ...args, contractArgs, oracleAddress }),
		{
			onError: (error) => {
				toast.error(formatMsgInToast(error.message))
			},
			onSuccess: (data) => {
				txContext.hash!.current = data.hash
				txContext.dialog?.toggle()

				const toastid = toast.loading('Confirming...')

				data.wait().then((res) => {
					toast.dismiss(toastid)
					if (res.status === 1) {
						txSuccess({ txHash: data.hash, blockExplorer, content: 'Transaction Success' })
					} else {
						txError({ txHash: data.hash, blockExplorer })
					}
				})
			}
		}
	)
}
