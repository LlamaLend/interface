import { ethers } from 'ethers'
import { useQuery } from '@tanstack/react-query'
import { IContractReadConfig, ITransactionError } from '~/types'
import { chainConfig } from '~/lib/constants'
import { erc721ABI, useContractRead, useNetwork } from 'wagmi'
import { fetchOracle } from './useGetOracle'
import { getMaxNftsToBorrow, getTotalReceivedArg } from '~/utils'

interface IGetPoolDataArgs {
	contractArgs: IContractReadConfig | null
	chainId?: number | null
	isTestnet: boolean
	quoteApi: string
}

export interface IPoolData {
	name: string
	symbol: string
	maxLoanLength: number
	currentAnnualInterest: number
	maxVariableInterestPerEthPerSecond: number
	ltv: number
	nftContract: string
	nftName: string
	owner: string
	maxNftsToBorrow: string
}

export async function getPool({ contractArgs, chainId, quoteApi, isTestnet }: IGetPoolDataArgs) {
	try {
		if (!chainId || !contractArgs) {
			return null
		}

		const { address, abi, provider } = contractArgs

		if (!provider || !quoteApi) {
			throw new Error('Invalid arguments')
		}

		const quote = await fetchOracle({ api: quoteApi, isTestnet, poolAddress: address })

		if (!quote?.price) {
			throw new Error("Couldn't get oracle price")
		}

		const contract = new ethers.Contract(address, abi, provider)

		const [
			name,
			symbol,
			maxLoanLength,
			minimumInterest,
			maxVariableInterestPerEthPerSecond,
			ltv,
			nftContract,
			owner
		]: Array<string> = await Promise.all([
			contract.name(),
			contract.symbol(),
			contract.maxLoanLength(),
			contract.minimumInterest(),
			contract.maxVariableInterestPerEthPerSecond(),
			contract.ltv(),
			contract.nftContract(),
			contract.owner()
		])

		const nftContractInterface = new ethers.Contract(nftContract, erc721ABI, provider)

		const [currentAnnualInterest, { maxInstantBorrow }, nftName] = await Promise.all([
			contract.currentAnnualInterest(getTotalReceivedArg({ oraclePrice: quote.price, noOfItems: 1, ltv: Number(ltv) })),
			contract.getDailyBorrows(),
			nftContractInterface.name()
		])

		return {
			name,
			symbol,
			maxLoanLength: Number(maxLoanLength),
			currentAnnualInterest: Number(currentAnnualInterest),
			maxVariableInterestPerEthPerSecond: Number(maxVariableInterestPerEthPerSecond) + Number(minimumInterest),
			ltv: Number(ltv),
			nftContract,
			nftName,
			owner,
			maxNftsToBorrow: getMaxNftsToBorrow({
				maxInstantBorrow: Number(maxInstantBorrow),
				oraclePrice: quote.price,
				ltv: Number(ltv)
			})
		}
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get pool data"))
	}
}

export function useGetPoolData({ chainId, poolAddress }: { chainId?: number | null; poolAddress?: string }) {
	const config = chainConfig(chainId)

	const contractArgs = poolAddress
		? {
				address: poolAddress,
				abi: config.poolABI,
				provider: config.chainProvider
		  }
		: null

	return useQuery<IPoolData | null, ITransactionError>(
		['pool', chainId, poolAddress],
		() => getPool({ contractArgs, chainId, quoteApi: config.quoteApi, isTestnet: config.isTestnet }),
		{
			refetchInterval: 30_000
		}
	)
}

export function useGetPoolInterestInCart({
	poolAddress,
	totalReceived
}: {
	poolAddress: string
	totalReceived: string
}) {
	const { chain } = useNetwork()
	const config = chainConfig(chain?.id)

	return useContractRead({
		addressOrName: poolAddress,
		contractInterface: config.poolABI,
		functionName: 'currentAnnualInterest',
		args: totalReceived
	})
}
