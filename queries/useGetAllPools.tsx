import { ContractInterface, ethers } from 'ethers'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { request, gql } from 'graphql-request'
import type { IBorrowPool, Provider, ITransactionError } from '~/types'
import { chainConfig } from '~/lib/constants'
import { fetchQuote } from './useGetQuote'

interface IGetAllPoolsArgs {
	endpoint: string
	poolAbi: ContractInterface
	quoteApi: string
	isTestnet: boolean
	provider: Provider
}

interface IPoolInterestPerNft {
	poolAddress: string
	quoteApi: string
	isTestnet: boolean
	poolAbi: ContractInterface
	provider: Provider
}

interface IPoolsQueryResponse {
	pools: Array<{
		name: string
		address: string
		symbol: string
		maxLoanLength: string
	}>
}

async function getPoolInterestPerNft({ poolAddress, quoteApi, isTestnet, poolAbi, provider }: IPoolInterestPerNft) {
	const contract = new ethers.Contract(poolAddress, poolAbi, provider)

	const quote = await fetchQuote({ api: quoteApi, isTestnet, poolAddress })

	const interest = await contract.currentAnnualInterest(new BigNumber(quote?.price ?? 0).multipliedBy(1e18).toFixed(0))

	return Number(interest)
}

export async function getAllpools({ endpoint, quoteApi, isTestnet, provider, poolAbi }: IGetAllPoolsArgs) {
	try {
		// return empty array when no chainId, as there is no chainId returned on /borrow/[chainName] when chainName is not supported/invalid
		if (!endpoint) {
			return []
		}

		if (!poolAbi || !provider || !quoteApi || !provider) {
			throw new Error('Invalid arguments')
		}

		const { pools }: IPoolsQueryResponse = await request(
			endpoint,
			gql`
				query {
					pools {
						name
						symbol
						maxLoanLength
						address
					}
				}
			`
		)

		const allPoolCurrentAnnualInterests = await Promise.all(
			pools.map((pool) => getPoolInterestPerNft({ quoteApi, isTestnet, poolAddress: pool.address, poolAbi, provider }))
		)

		return pools.map((pool, index) => ({
			name: pool.name,
			symbol: pool.symbol,
			maxLoanLength: Number(pool.maxLoanLength),
			currentAnnualInterest: Number(allPoolCurrentAnnualInterests[index]),
			address: pool.address
		}))
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get pools"))
	}
}

export function useGetAllPools({ chainId }: { chainId?: number | null }) {
	const config = chainConfig(chainId)

	return useQuery<Array<IBorrowPool>, ITransactionError>(
		['allPools', chainId],
		() =>
			getAllpools({
				endpoint: config.subgraphUrl,
				poolAbi: config.poolABI,
				quoteApi: config.quoteApi,
				isTestnet: config.isTestnet,
				provider: config.chainProvider
			}),
		{
			refetchInterval: 30_000
		}
	)
}
