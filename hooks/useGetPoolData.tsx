import { ethers } from 'ethers'
import { useQuery } from '@tanstack/react-query'
import { useProvider } from 'wagmi'
import { IContractReadConfig, ITransactionError } from '~/types'
import useConfig from './useConfig'

interface IGetAllPoolsArgs {
	contractArgs: IContractReadConfig
	chainId?: number | null
	address: string
}

export interface IPoolData {
	name: string
	symbol: string
	maxLoanLength: number
	currentAnnualInterest: number
}

async function getPool({ contractArgs, chainId }: IGetAllPoolsArgs) {
	try {
		// return empty array when no chainId, as there is no chainId returned on /pool/[chainName] when chainName is not supported/invalid
		if (!chainId) {
			return null
		}

		const { address, abi, provider } = contractArgs

		if (!address || !abi || !provider) {
			throw new Error('Invalid arguments')
		}

		const contract = new ethers.Contract(address, abi, provider)

		const [name, symbol, maxLoanLength, currentAnnualInterest]: Array<string> = await Promise.all([
			contract.name(),
			contract.symbol(),
			contract.maxLoanLength(),
			contract.currentAnnualInterest(0)
		])

		return {
			name,
			symbol,
			maxLoanLength: Number(maxLoanLength),
			currentAnnualInterest: Number(currentAnnualInterest)
		}
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get pool data"))
	}
}

export function useGetAllPools({ chainId, address }: { chainId?: number | null; address: string }) {
	const config = useConfig(chainId)

	const contractArgs: IContractReadConfig = {
		address: address,
		abi: config.poolABI,
		provider: config.chainProvider
	}

	return useQuery<IPoolData | null, ITransactionError>(
		['pool', chainId, address],
		() => getPool({ contractArgs, chainId, address }),
		{
			refetchInterval: 30_000
		}
	)
}
