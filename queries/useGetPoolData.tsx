import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { useQuery } from '@tanstack/react-query'
import { request, gql } from 'graphql-request'
import { useContractRead, useNetwork } from 'wagmi'
import type { IBorrowPoolData, IContractReadConfig, ITransactionError } from '~/types'
import { chainConfig, ERC721_ABI } from '~/lib/constants'
import { fetchOracle } from './useGetOracle'
import { getMaxNftsToBorrow, getTotalReceivedArg } from '~/utils'

interface IGetPoolDataArgs {
	contractArgs: IContractReadConfig | null
	chainId?: number | null
	isTestnet: boolean
	quoteApi: string
	graphEndpoint: string
}

export async function getPool({ contractArgs, chainId, quoteApi, isTestnet, graphEndpoint }: IGetPoolDataArgs) {
	try {
		if (!chainId || !contractArgs) {
			return null
		}

		const { address, abi, provider } = contractArgs

		if (!provider || !quoteApi) {
			throw new Error('Invalid arguments')
		}

		const contract = new ethers.Contract(address, abi, provider)

		const { pools } = await request(
			graphEndpoint,
			gql`
					query {
						pools (where: { address: "${address.toLowerCase()}" }) {
							name
							symbol
							maxLoanLength
							minimumInterest
							maxVariableInterestPerEthPerSecond
							ltv
							nftContract
							owner
						}
					}
				`
		)

		const {
			name,
			symbol,
			maxLoanLength,
			minimumInterest,
			maxVariableInterestPerEthPerSecond,
			ltv,
			nftContract,
			owner
		} = pools[0]

		const nftContractInterface = new ethers.Contract(nftContract, ERC721_ABI, provider)
		const quote = await fetchOracle({ api: quoteApi, isTestnet, nftContractAddress: nftContract })

		if (!quote) {
			throw new Error("Couldn't get oracle price")
		}

		const [currentAnnualInterest, { maxInstantBorrow }, collectionName] = await Promise.all([
			contract.currentAnnualInterest(getTotalReceivedArg({ oraclePrice: quote.price, noOfItems: 1, ltv })),
			contract.getDailyBorrows(),
			nftContractInterface.name()
		])

		return {
			name,
			symbol,
			maxLoanLength,
			currentAnnualInterest,
			maxVariableInterestPerEthPerSecond: new BigNumber(maxVariableInterestPerEthPerSecond)
				.plus(minimumInterest)
				.toString(),
			ltv,
			nftContract,
			collectionName,
			owner,
			maxNftsToBorrow: getMaxNftsToBorrow({
				maxInstantBorrow: maxInstantBorrow.toString(),
				oraclePrice: quote.price,
				ltv
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

	return useQuery<IBorrowPoolData | null, ITransactionError>(
		['pool', chainId, poolAddress],
		() =>
			getPool({
				contractArgs,
				chainId,
				quoteApi: config.quoteApi,
				isTestnet: config.isTestnet,
				graphEndpoint: config.subgraphUrl
			}),
		{
			refetchInterval: 30_000
		}
	)
}

export function useGetPoolInterestInCart({
	poolAddress,
	totalReceived,
	chainId
}: {
	poolAddress: string
	totalReceived: string
	chainId?: number
}) {
	const { chain } = useNetwork()
	const config = chainConfig(chainId)

	return useContractRead({
		addressOrName: poolAddress,
		contractInterface: config.poolABI,
		functionName: 'currentAnnualInterest',
		args: totalReceived,
		enabled: chain?.id === chainId ? true : false
	})
}
