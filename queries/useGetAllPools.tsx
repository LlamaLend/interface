import { ContractInterface, ethers } from 'ethers'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import type { IBorrowPool, IContractReadConfig, ITransactionError } from '~/types'
import { chainConfig } from '~/lib/constants'
import { fetchQuote } from './useGetQuote'

interface IContractArgs extends IContractReadConfig {
	poolAbi: ContractInterface
}

interface IGetAllPoolsArgs {
	contractArgs: IContractArgs
	chainId?: number | null
	isTestnet: boolean
	quoteApi: string
}

interface IPoolInterestPerNft {
	contract: ethers.Contract
	poolAddress: string
	quoteApi: string
	isTestnet: boolean
}

async function getPoolInterestPerNft({ contract, poolAddress, quoteApi, isTestnet }: IPoolInterestPerNft) {
	const quote = await fetchQuote({ api: quoteApi, isTestnet, poolAddress })

	const interest = await contract.currentAnnualInterest(new BigNumber(quote?.price ?? 0).multipliedBy(1e18).toFixed(0))

	return Number(interest)
}

export async function getAllpools({ contractArgs, chainId, quoteApi, isTestnet }: IGetAllPoolsArgs) {
	try {
		// return empty array when no chainId, as there is no chainId returned on /borrow/[chainName] when chainName is not supported/invalid
		if (!chainId) {
			return []
		}

		const { address, abi, provider, poolAbi } = contractArgs

		if (!address || !abi || !provider || !poolAbi) {
			throw new Error('Invalid arguments')
		}

		const factory = new ethers.Contract(address, abi, provider)

		// get no.of pools created from factory and loop over them to get their addresses
		const poolsLength = await factory.allPoolsLength()

		const poolAddresses = await Promise.all(
			new Array(Number(poolsLength)).fill(1).map((_, index) => factory.allPools(index))
		)

		const allPoolContracts = poolAddresses.map((address) => {
			return new ethers.Contract(address, poolAbi, provider)
		})

		const allPoolNames = await Promise.all(allPoolContracts.map((contract) => contract.name()))

		const allPoolSymbols = await Promise.all(allPoolContracts.map((contract) => contract.symbol()))

		const allPoolMaxLoanLengths = await Promise.all(allPoolContracts.map((contract) => contract.maxLoanLength()))

		const allPoolCurrentAnnualInterests = await Promise.all(
			allPoolContracts.map((contract, index) =>
				getPoolInterestPerNft({ contract, quoteApi, isTestnet, poolAddress: poolAddresses[index] })
			)
		)

		return allPoolNames.map((name, index) => ({
			name,
			symbol: allPoolSymbols[index],
			maxLoanLength: Number(allPoolMaxLoanLengths[index]),
			currentAnnualInterest: Number(allPoolCurrentAnnualInterests[index]),
			address: poolAddresses[index]
		}))
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get pools"))
	}
}

export function useGetAllPools({ chainId }: { chainId?: number | null }) {
	const config = chainConfig(chainId)

	const contractArgs: IContractArgs = {
		address: config.factoryAddress,
		abi: config.factoryABI,
		poolAbi: config.poolABI,
		provider: config.chainProvider
	}

	return useQuery<Array<IBorrowPool>, ITransactionError>(
		['allPools', chainId],
		() => getAllpools({ contractArgs, chainId, quoteApi: config.quoteApi, isTestnet: config.isTestnet }),
		{
			refetchInterval: 30_000
		}
	)
}
