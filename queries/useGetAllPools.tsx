import { ethers } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'
import { useQuery } from '@tanstack/react-query'
import { request, gql } from 'graphql-request'
import type { IBorrowPool, ITransactionError, IGetAdminPoolDataArgs } from '~/types'
import { chainConfig, ERC721_ABI, POOL_ABI, SECONDS_IN_A_YEAR } from '~/lib/constants'

interface IGetAllPoolsArgs {
	chainId?: number | null
	collectionAddress?: string
	ownerAddress?: string
}

interface IPoolsQueryResponse {
	pools: Array<{
		name: string
		address: string
		symbol: string
		maxLoanLength: string
		ltv: string
		nftContract: string
	}>
}

async function getPoolAddlInfo({
	poolAddress,
	provider,
	nftContractAddress
}: {
	poolAddress: string
	nftContractAddress: string
	provider: ethers.providers.BaseProvider
}) {
	try {
		const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider)
		const nftContract = new ethers.Contract(nftContractAddress, ERC721_ABI, provider)

		const [collectionName, poolBalance, totalBorrowed] = await Promise.all([
			nftContract.name(),
			provider.getBalance(poolAddress),
			poolContract.totalBorrowed()
		])

		return {
			collectionName,
			poolBalance: poolBalance.toString(),
			totalBorrowed: totalBorrowed.toString(),
			totalDeposited: new BigNumber(poolBalance.toString()).plus(totalBorrowed.toString()).toFixed(0, 1)
		}
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get total amount deposited in pool."))
	}
}

// TODO fetch this inside useGetPoolData
async function getAdminPoolInfo({ poolAddress, provider, nftContractAddress, graphEndpoint }: IGetAdminPoolDataArgs) {
	try {
		const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider)

		const [
			maxPrice,
			{ maxDailyBorrowsLimit },
			maxLoanLength,
			oracle,
			minimumInterest,
			maxVariableInterestPerEthPerSecond,
			{ liquidators }
		] = await Promise.all([
			poolContract.maxPrice(),
			poolContract.getDailyBorrows(),
			poolContract.maxLoanLength(),
			poolContract.oracle(),
			poolContract.minimumInterest(),
			poolContract.maxVariableInterestPerEthPerSecond(),
			request(
				graphEndpoint,
				gql`
					query {
						liquidators (where: {pool: "${poolAddress.toLowerCase()}"}) {
							address
						}
					}
				`
			)
		])

		const minInt = new BigNumber(Number(minimumInterest)).div(1e16).times(SECONDS_IN_A_YEAR).toFixed(0, 1)
		const maxVariableInt = new BigNumber(Number(maxVariableInterestPerEthPerSecond))
			.div(1e16)
			.times(SECONDS_IN_A_YEAR)
			.toFixed(0, 1)

		const liqAddresses = liquidators.map((l: { address: string }) => getAddress(l.address))

		return {
			key:
				nftContractAddress +
				poolAddress +
				maxPrice +
				maxDailyBorrowsLimit +
				maxLoanLength +
				maxLoanLength +
				minInt +
				maxVariableInt +
				liqAddresses.join(''),
			maxPrice: Number(maxPrice),
			maxDailyBorrows: Number(maxDailyBorrowsLimit),
			maxLoanLength: Number(maxLoanLength),
			oracle,
			minimumInterest: minInt,
			maximumInterest: (Number(maxVariableInt) + Number(minInt)).toFixed(0),
			liquidators: liqAddresses
		}
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get pool data"))
	}
}

const getAllPoolsQuery = () => gql`
	query {
		pools {
			name
			symbol
			maxLoanLength
			address
			ltv
			nftContract
		}
	}
`

const getAllPoolsByCollectionQuery = (collectionAddress: string) => gql`
	query {
		pools (where: { nftContract: "${collectionAddress.toLowerCase()}" }) {
			name
			symbol
			maxLoanLength
			address
			ltv
			nftContract
		}
	}
`

const getAllPoolsByOwner = (ownerAddress: string) => gql`
	query {
		pools (where: { owner: "${ownerAddress.toLowerCase()}" }) {
			name
			symbol
			maxLoanLength
			address
			ltv
			nftContract
		}
	}
`

export async function getAllpools({ chainId, collectionAddress, ownerAddress }: IGetAllPoolsArgs) {
	try {
		// return empty array when no chainId, as there is no chainId returned on /borrow/[chainName] when chainName is not supported/invalid
		if (!chainId) {
			return []
		}

		const { chainProvider: provider, quoteApi, subgraphUrl: endpoint } = chainConfig(chainId)

		if (!provider || !quoteApi || !endpoint) {
			throw new Error('Invalid arguments')
		}

		const { pools }: IPoolsQueryResponse = await request(
			endpoint,
			ownerAddress
				? getAllPoolsByOwner(ownerAddress)
				: collectionAddress
				? getAllPoolsByCollectionQuery(collectionAddress)
				: getAllPoolsQuery()
		)

		const poolAddlInfo = await Promise.all(
			pools.map((pool) =>
				getPoolAddlInfo({ poolAddress: pool.address, provider, nftContractAddress: pool.nftContract })
			)
		)

		const adminPoolInfo = ownerAddress
			? await Promise.all(
					pools.map((pool) =>
						getAdminPoolInfo({
							poolAddress: pool.address,
							nftContractAddress: pool.nftContract,
							provider,
							graphEndpoint: endpoint
						})
					)
			  )
			: await Promise.resolve([])

		return pools
			.map((pool, index) => ({
				name: pool.name,
				symbol: pool.symbol,
				address: getAddress(pool.address),
				nftContract: getAddress(pool.nftContract),
				maxLoanLength: Number(pool.maxLoanLength),
				ltv: Number(pool.ltv),
				collectionName: poolAddlInfo?.[index]?.collectionName ?? '',
				poolBalance: poolAddlInfo?.[index]?.poolBalance ?? '0',
				totalBorrowed: poolAddlInfo?.[index]?.totalBorrowed ?? '0',
				totalDeposited: poolAddlInfo?.[index]?.totalDeposited ?? '0',
				adminPoolInfo: adminPoolInfo?.[index] ?? {}
			}))
			.sort((a, b) => Number(b.poolBalance) - Number(a.poolBalance))
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get pools"))
	}
}

export function useGetAllPools({
	chainId,
	collectionAddress,
	ownerAddress
}: {
	chainId?: number | null
	collectionAddress?: string
	ownerAddress?: string
}) {
	return useQuery<Array<IBorrowPool>, ITransactionError>(
		['allPools', chainId, collectionAddress, ownerAddress],
		() =>
			getAllpools({
				chainId,
				collectionAddress,
				ownerAddress
			}),
		{
			refetchInterval: 30_000
		}
	)
}
