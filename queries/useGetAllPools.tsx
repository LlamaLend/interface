import { ethers } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'
import { useQuery } from '@tanstack/react-query'
import { request, gql } from 'graphql-request'
import type { IBorrowPool, ITransactionError, IGetAdminPoolDataArgs } from '~/types'
import { chainConfig, ERC721_ABI, POOL_ABI, SECONDS_IN_A_YEAR } from '~/lib/constants'
import { fetchOracle } from './useGetOracle'
import { getMaxNftsToBorrow, getTotalReceivedArg } from '~/utils'

interface IGetAllPoolsArgs {
	chainId?: number | null
	collectionAddress?: string
	ownerAddress?: string
	skipOracle?: boolean
}

interface IPoolsQueryResponse {
	pools: Array<{
		name: string
		address: string
		symbol: string
		maxLoanLength: string
		minimumInterest: string
		maxVariableInterestPerEthPerSecond: string
		ltv: string
		nftContract: string
		owner: string
	}>
}

async function getPoolAddlInfo({
	poolAddress,
	provider,
	nftContractAddress,
	quoteApi,
	ltv,
	isTestnet,
	skipOracle
}: {
	poolAddress: string
	nftContractAddress: string
	provider: ethers.providers.BaseProvider
	quoteApi: string
	ltv: string
	isTestnet: boolean
	skipOracle?: boolean
}) {
	try {
		const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider)
		const nftContract = new ethers.Contract(nftContractAddress, ERC721_ABI, provider)

		const quote = skipOracle ? null : await fetchOracle({ api: quoteApi, isTestnet, nftContractAddress })

		const res = await Promise.allSettled([
			nftContract.name(),
			provider.getBalance(poolAddress),
			poolContract.totalBorrowed(),
			poolContract.getDailyBorrows(),
			poolContract.currentAnnualInterest(getTotalReceivedArg({ oraclePrice: quote?.price, noOfItems: 1, ltv })),
			poolContract.maxPrice(),
			poolContract.oracle()
		])

		const [collectionName, poolBalance, totalBorrowed, dailyBorrows, currentAnnualInterest, maxPrice, oracle] = res.map(
			(data) => (data.status === 'fulfilled' ? data.value : null)
		)

		const priceAndCurrentBorrowables = getMaxNftsToBorrow({
			maxInstantBorrow: dailyBorrows && dailyBorrows.maxInstantBorrow.toString(),
			oraclePrice: quote?.price,
			ltv
		})

		return {
			collectionName,
			poolBalance: poolBalance?.toString(),
			totalBorrowed: totalBorrowed?.toString(),
			totalDeposited: new BigNumber(poolBalance.toString()).plus(totalBorrowed.toString()).toFixed(0, 1),
			pricePerNft: priceAndCurrentBorrowables.pricePerNft,
			maxPrice: Number(maxPrice),
			maxNftsToBorrow: priceAndCurrentBorrowables.maxNftsToBorrow,
			maxInstantBorrow: dailyBorrows && Number(dailyBorrows.maxInstantBorrow),
			dailyBorrows: dailyBorrows && Number(dailyBorrows.dailyBorrows),
			maxDailyBorrows: dailyBorrows && Number(dailyBorrows.maxDailyBorrowsLimit),
			currentAnnualInterest,
			oracle,
			oraclePrice: quote?.price
		}
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get total pool addl info"))
	}
}
async function getPoolNameAndDeposits({
	poolAddress,
	provider,
	nftContractAddress,
	quoteApi,
	ltv,
	isTestnet
}: {
	poolAddress: string
	nftContractAddress: string
	provider: ethers.providers.BaseProvider
	quoteApi: string
	ltv: string
	isTestnet: boolean
}) {
	try {
		const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider)
		const nftContract = new ethers.Contract(nftContractAddress, ERC721_ABI, provider)

		const quote = await fetchOracle({ api: quoteApi, isTestnet, nftContractAddress, skipRetries: true })

		const res = await Promise.allSettled([
			nftContract.name(),
			provider.getBalance(poolAddress),
			poolContract.totalBorrowed(),
			poolContract.getDailyBorrows()
		])

		const [collectionName, poolBalance, totalBorrowed, dailyBorrows] = res.map((data) =>
			data.status === 'fulfilled' ? data.value : null
		)

		const priceAndCurrentBorrowables = getMaxNftsToBorrow({
			maxInstantBorrow: dailyBorrows && dailyBorrows.maxInstantBorrow.toString(),
			oraclePrice: quote?.price,
			ltv
		})

		return {
			collectionName,
			totalDeposited: new BigNumber(poolBalance.toString()).plus(totalBorrowed.toString()).toFixed(0, 1),
			maxNftsToBorrow: priceAndCurrentBorrowables.maxNftsToBorrow
		}
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get total pool addl info"))
	}
}

async function getAdminPoolInfo({ poolAddress, provider, nftContractAddress, graphEndpoint }: IGetAdminPoolDataArgs) {
	try {
		const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider)

		const [maxLoanLength, minimumInterest, maxVariableInterestPerEthPerSecond, { liquidators }] = await Promise.all([
			poolContract.maxLoanLength(),
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
				maxLoanLength +
				maxLoanLength +
				minInt +
				maxVariableInt +
				liqAddresses.join(''),

			maxLoanLength: Number(maxLoanLength),
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
			minimumInterest
			maxVariableInterestPerEthPerSecond
			ltv
			nftContract
			owner
			address
		}
	}
`

const getAllPoolsByCollectionQuery = (collectionAddress: string) => gql`
	query {
		pools (where: { nftContract: "${collectionAddress.toLowerCase()}" }) {
			name
			symbol
			maxLoanLength
			minimumInterest
			maxVariableInterestPerEthPerSecond
			ltv
			nftContract
			owner
			address
		}
	}
`

const getAllPoolsByOwner = (ownerAddress: string) => gql`
	query {
		pools (where: { owner: "${ownerAddress.toLowerCase()}" }) {
			name
			symbol
			maxLoanLength
			minimumInterest
			maxVariableInterestPerEthPerSecond
			ltv
			nftContract
			owner
			address
		}
	}
`

export async function getAllPools({ chainId, collectionAddress, ownerAddress, skipOracle }: IGetAllPoolsArgs) {
	try {
		// return empty array when no chainId, as there is no chainId returned on /borrow/[chainName] when chainName is not supported/invalid
		if (!chainId) {
			return []
		}

		const { chainProvider: provider, quoteApi, subgraphUrl: endpoint, isTestnet } = chainConfig(chainId)

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
				getPoolAddlInfo({
					poolAddress: pool.address,
					provider,
					nftContractAddress: pool.nftContract,
					quoteApi,
					isTestnet,
					ltv: pool.ltv,
					skipOracle
				})
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
				owner: getAddress(pool.owner),
				nftContract: getAddress(pool.nftContract),
				maxLoanLength: Number(pool.maxLoanLength),
				ltv: pool.ltv,
				collectionName: poolAddlInfo?.[index]?.collectionName ?? '',
				poolBalance: poolAddlInfo?.[index]?.poolBalance ?? '0',
				totalBorrowed: poolAddlInfo?.[index]?.totalBorrowed ?? '0',
				totalDeposited: poolAddlInfo?.[index]?.totalDeposited ?? '0',
				maxVariableInterestPerEthPerSecond: new BigNumber(pool.maxVariableInterestPerEthPerSecond)
					.plus(pool.minimumInterest)
					.toString(),
				currentAnnualInterest: poolAddlInfo?.[index]?.currentAnnualInterest.toString() ?? '0',
				pricePerNft: poolAddlInfo?.[index]?.pricePerNft ?? '0',
				maxNftsToBorrow: poolAddlInfo?.[index]?.maxNftsToBorrow ?? '0',
				maxInstantBorrow: poolAddlInfo?.[index]?.maxInstantBorrow ?? 0,
				dailyBorrows: poolAddlInfo?.[index]?.dailyBorrows ?? 0,
				maxDailyBorrows: poolAddlInfo?.[index]?.maxDailyBorrows ?? 0,
				maxPrice: poolAddlInfo?.[index]?.maxPrice ?? 0,
				oracle: poolAddlInfo?.[index]?.oracle ?? '',
				oraclePrice: poolAddlInfo?.[index]?.oraclePrice ?? '',
				adminPoolInfo: adminPoolInfo?.[index] ?? {}
			}))
			.sort((a, b) => Number(b.maxNftsToBorrow) - Number(a.maxNftsToBorrow))
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get pools"))
	}
}

export async function getAllPoolsNameAndDeposits({ chainId }: IGetAllPoolsArgs) {
	try {
		// return empty array when no chainId, as there is no chainId returned on /borrow/[chainName] when chainName is not supported/invalid
		if (!chainId) {
			return []
		}

		const { chainProvider: provider, quoteApi, subgraphUrl: endpoint, isTestnet } = chainConfig(chainId)

		if (!provider || !quoteApi || !endpoint) {
			throw new Error('Invalid arguments')
		}

		const { pools }: IPoolsQueryResponse = await request(
			endpoint,
			gql`
				query {
					pools {
						nftContract
						address
					}
				}
			`
		)

		const poolAddlInfo = await Promise.allSettled(
			pools.map((pool) =>
				getPoolNameAndDeposits({
					poolAddress: pool.address,
					provider,
					nftContractAddress: pool.nftContract,
					quoteApi,
					isTestnet,
					ltv: pool.ltv
				})
			)
		)

		const addlInfo = poolAddlInfo.map((pool) => (pool.status === 'fulfilled' ? pool.value : null))

		return pools
			.map((pool, index) => ({
				nftContract: getAddress(pool.nftContract),
				totalDeposited: addlInfo?.[index]?.totalDeposited ?? '0',
				maxNftsToBorrow: addlInfo?.[index]?.maxNftsToBorrow ?? '0',
				collectionName: addlInfo?.[index]?.collectionName ?? ''
			}))
			.sort((a, b) => Number(b.maxNftsToBorrow) - Number(a.maxNftsToBorrow))
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get pools"))
	}
}

export function useGetAllPools({
	chainId,
	collectionAddress,
	ownerAddress,
	skipOracle
}: {
	chainId?: number | null
	collectionAddress?: string
	ownerAddress?: string
	skipOracle?: boolean
}) {
	return useQuery<Array<IBorrowPool>, ITransactionError>(
		['allPools', chainId, collectionAddress, ownerAddress || null, skipOracle || false],
		() =>
			getAllPools({
				chainId,
				collectionAddress,
				ownerAddress,
				skipOracle
			}),
		{
			refetchInterval: 30_000
		}
	)
}
