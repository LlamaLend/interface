import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { useMutation } from '@tanstack/react-query'
import { useNetwork, useQueryClient, useSigner } from 'wagmi'
import { useTxContext } from '~/contexts'
import toast from 'react-hot-toast'
import { IContractWriteConfig, ITransactionError, ITransactionSuccess } from '~/types'
import { txConfirming, txError, txSuccess } from '~/components/TxToast'
import { chainConfig } from '~/lib/constants'
import { useGetAllPools } from './useGetAllPools'

export enum FormNames {
	maxPrice = 'maxPrice',
	nftAddress = 'nftAddress',
	maxDailyBorrows = 'maxDailyBorrows',
	name = 'name',
	symbol = 'symbol',
	maxLength = 'maxLength',
	maxVariableInterestPerEthPerSecond = 'maxVariableInterestPerEthPerSecond',
	minimumInterest = 'minimumInterest',
	ltv = 'ltv'
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
			maxVariableInterestPerEthPerSecond,
			minimumInterest,
			ltv
		} = args

		if (Object.values(args).filter((x) => !x).length > 0 || !contractArgs.signer) {
			throw new Error('Invalid arguments')
		}

		const { address, abi, signer } = contractArgs

		const contract = new ethers.Contract(address, abi, signer)

		return await contract.createPool(oracleAddress, maxPrice, nftAddress, maxDailyBorrows, name, symbol, maxLength, {
			maxVariableInterestPerEthPerSecond,
			minimumInterest,
			ltv
		})
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't create a pool"))
	}
}

export function useCreatePool() {
	const { chain } = useNetwork()
	const txContext = useTxContext()

	const { refetch } = useGetAllPools({ chainId: chain?.id })

	const { factoryAddress, factoryABI, oracleAddress, blockExplorer } = chainConfig(chain?.id)

	const { data: signer } = useSigner()

	const contractArgs: IContractWriteConfig = {
		address: factoryAddress,
		abi: factoryABI,
		signer: signer || null
	}

	const queryClient = useQueryClient()
	const router = useRouter()

	return useMutation<ITransactionSuccess, ITransactionError, PoolArgs, unknown>(
		(args: PoolArgs) => createPool({ ...args, contractArgs, oracleAddress }),
		{
			onSuccess: (data) => {
				txContext.hash!.current = data.hash
				txContext.dialog?.toggle()

				const toastid = txConfirming({ txHash: data.hash, blockExplorer })

				data.wait().then((res) => {
					toast.dismiss(toastid)
					if (res.status === 1) {
						txSuccess({ txHash: data.hash, blockExplorer, content: 'Transaction Success' })

						// refetch all pools query before redirecting
						refetch()

						// redirect user to deposit page
						router.push(`/deposit/${res.events[0].address}`)
					} else {
						txError({ txHash: data.hash, blockExplorer })
					}
				})
			},
			onSettled: () => {
				queryClient.invalidateQueries()
			}
		}
	)
}
