import { ContractInterface, ethers } from 'ethers'
import { useQuery } from '@tanstack/react-query'
import { request, gql } from 'graphql-request'
import type { IBorrowPool, Provider, ITransactionError } from '~/types'
import { chainConfig } from '~/lib/constants'
import { fetchOracle } from './useGetOracle'
import { getMaxNftsToBorrow, getTotalReceivedArg } from '~/utils'

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
	ltv: string
}

interface IPoolsQueryResponse {
	pools: Array<{
		name: string
		address: string
		symbol: string
		maxLoanLength: string
		ltv: string
	}>
}

async function getPoolAddlInfo({ poolAddress, quoteApi, isTestnet, poolAbi, provider, ltv }: IPoolInterestPerNft) {
	const contract = new ethers.Contract(poolAddress, poolAbi, provider)

	const oracle = await fetchOracle({ api: quoteApi, isTestnet, poolAddress })

	if (!oracle?.price) {
		throw new Error("Couldn't get oracle price")
	}

	const [interest, { maxInstantBorrow }] = await Promise.all([
		contract.currentAnnualInterest(getTotalReceivedArg({ oraclePrice: oracle.price, noOfItems: 1, ltv: Number(ltv) })),
		contract.getDailyBorrows()
	])

	return {
		currentAnnualInterest: Number(interest),
		oraclePrice: Number(oracle.price),
		maxInstantBorrow: Number(maxInstantBorrow)
	}
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
						ltv
					}
				}
			`
		)

		const addlInfo = await Promise.all(
			pools.map((pool) =>
				getPoolAddlInfo({ quoteApi, isTestnet, poolAddress: pool.address, ltv: pool.ltv, poolAbi, provider })
			)
		)

		return pools.map((pool, index) => ({
			name: pool.name,
			symbol: pool.symbol,
			address: pool.address,
			maxLoanLength: Number(pool.maxLoanLength),
			ltv: Number(pool.ltv),
			currentAnnualInterest: addlInfo[index].currentAnnualInterest,
			maxNftsToBorrow: getMaxNftsToBorrow({
				maxInstantBorrow: addlInfo[index].maxInstantBorrow,
				oraclePrice: addlInfo[index].oraclePrice,
				ltv: Number(pool.ltv)
			})
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
