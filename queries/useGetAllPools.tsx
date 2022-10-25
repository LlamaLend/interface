import { ContractInterface, ethers } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { erc721ABI } from 'wagmi'
import BigNumber from 'bignumber.js'
import { useQuery } from '@tanstack/react-query'
import { request, gql } from 'graphql-request'
import type { IBorrowPool, Provider, ITransactionError, IGetAdminPoolDataArgs } from '~/types'
import { chainConfig, SECONDS_IN_A_YEAR } from '~/lib/constants'

interface IGetAllPoolsArgs {
	endpoint: string
	poolAbi: ContractInterface
	quoteApi: string
	provider: Provider
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

// TODO fetch this inside useGetPoolData
async function getAdminPoolInfo({
	poolAddress,
	poolAbi,
	provider,
	nftContractAddress,
	graphEndpoint
}: IGetAdminPoolDataArgs) {
	try {
		const poolContract = new ethers.Contract(poolAddress, poolAbi, provider)
		const nftContract = new ethers.Contract(nftContractAddress, erc721ABI, provider)

		const [
			nftName,
			poolBalance,
			maxPrice,
			{ maxDailyBorrowsLimit },
			maxLoanLength,
			oracle,
			minimumInterest,
			maxVariableInterestPerEthPerSecond,
			{ liquidators }
		] = await Promise.all([
			nftContract.name(),
			provider.getBalance(poolAddress),
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

		const minInt = new BigNumber(Number(minimumInterest)).div(1e16).times(SECONDS_IN_A_YEAR).toFixed(0)
		const maxVariableInt = new BigNumber(Number(maxVariableInterestPerEthPerSecond))
			.div(1e16)
			.times(SECONDS_IN_A_YEAR)
			.toFixed(0)

		const liqAddresses = liquidators.map((l: { address: string }) => getAddress(l.address))

		return {
			key:
				nftName +
				poolBalance +
				maxPrice +
				maxDailyBorrowsLimit +
				maxLoanLength +
				maxLoanLength +
				minInt +
				maxVariableInt +
				liqAddresses.join(''),
			nftName: nftName,
			poolBalance: Number(poolBalance),
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

export async function getAllpools({
	endpoint,
	quoteApi,
	provider,
	poolAbi,
	collectionAddress,
	ownerAddress
}: IGetAllPoolsArgs) {
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
			ownerAddress
				? getAllPoolsByOwner(ownerAddress)
				: collectionAddress
				? getAllPoolsByCollectionQuery(collectionAddress)
				: getAllPoolsQuery()
		)

		const adminPoolInfo = ownerAddress
			? await Promise.all(
					pools.map((pool) =>
						getAdminPoolInfo({
							poolAbi,
							poolAddress: pool.address,
							nftContractAddress: pool.nftContract,
							provider,
							graphEndpoint: endpoint
						})
					)
			  )
			: await Promise.resolve([])

		return pools.map((pool, index) => ({
			name: pool.name,
			symbol: pool.symbol,
			address: getAddress(pool.address),
			nftContract: getAddress(pool.nftContract),
			maxLoanLength: Number(pool.maxLoanLength),
			ltv: Number(pool.ltv),
			adminPoolInfo: adminPoolInfo?.[index] ?? {}
		}))
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
	const config = chainConfig(chainId)

	return useQuery<Array<IBorrowPool>, ITransactionError>(
		['allPools', chainId, collectionAddress, ownerAddress],
		() =>
			getAllpools({
				endpoint: config.subgraphUrl,
				poolAbi: config.poolABI,
				quoteApi: config.quoteApi,
				provider: config.chainProvider,
				collectionAddress,
				ownerAddress
			}),
		{
			refetchInterval: 30_000
		}
	)
}
