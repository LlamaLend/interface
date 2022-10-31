import { useQuery } from '@tanstack/react-query'
import { getAddress } from 'ethers/lib/utils'
import { chainConfig } from '~/lib/constants'
import { getAllpools } from './useGetAllPools'
import verifiedCollections from '~/lib/collections'
import type { ICollection } from '~/types'
import { getPool } from './useGetPoolData'

const getPoolInfo = async ({ poolAddress, chainId }: { poolAddress: string; chainId?: number | null }) => {
	const config = chainConfig(chainId)

	const contractArgs = poolAddress
		? {
				address: poolAddress,
				abi: config.poolABI,
				provider: config.chainProvider
		  }
		: null

	return await getPool({
		contractArgs,
		chainId,
		quoteApi: config.quoteApi,
		isTestnet: config.isTestnet,
		graphEndpoint: config.subgraphUrl
	})
}

export async function getAllCollections({ chainId }: { chainId?: number | null }) {
	const pools = await getAllpools({ chainId })

	const poolsWithAddlData = (
		await Promise.all(pools.map((pool) => getPoolInfo({ poolAddress: pool.address, chainId })))
	).filter((pool) => !!pool && Number(pool.maxNftsToBorrow) > 0)

	const collections = new Set<string>()

	poolsWithAddlData.forEach((pool) => {
		if (pool) {
			collections.add(getAddress(pool?.nftContract))
		}
	})

	const verified: Array<ICollection> = []

	const notVerified: Array<ICollection> = []

	Array.from(collections).forEach((address) => {
		const verifiedCollectionIndex = verifiedCollections[chainId || 1].findIndex(
			(x) => x.address.toLowerCase() === address.toLowerCase()
		)

		const name = poolsWithAddlData.find((pool) => pool?.nftContract?.toLowerCase() === address.toLowerCase())?.nftName

		if (verifiedCollectionIndex + 1) {
			verified.push({
				address,
				name: name,
				imgUrl: verifiedCollections[chainId || 1][verifiedCollectionIndex].imgUrl,
				sortIndex: verifiedCollectionIndex + 1
			})
		} else {
			notVerified.push({ address, name: name, imgUrl: '', sortIndex: -1 })
		}
	})

	return [...verified.sort((a, b) => a.sortIndex - b.sortIndex), ...notVerified]
}

export function useGetAllCollections({ chainId }: { chainId?: number | null }) {
	return useQuery(
		['allCollections', chainId],
		() =>
			getAllCollections({
				chainId
			}),
		{
			refetchInterval: 30_000
		}
	)
}
