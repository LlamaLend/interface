import { useQuery } from '@tanstack/react-query'
import { getAddress } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'
import { getAllpools } from './useGetAllPools'
import verifiedCollections from '~/lib/collections'
import type { ICollection } from '~/types'

export async function getAllCollections({ chainId }: { chainId?: number | null }) {
	const pools = await getAllpools({ chainId, skipOracle: false })

	const collections: Array<{ address: string; name: string; totalDeposited: string, oraclePrice: string }> = []

	pools.forEach((pool) => {
		const index = collections.findIndex((col) => col.address.toLowerCase() === pool.nftContract.toLowerCase())

		if (index >= 0) {
			collections[index] = {
				...collections[index],
				totalDeposited: new BigNumber(collections[index].totalDeposited).plus(pool.totalDeposited).toFixed(0, 1)
			}
		} else {
			collections.push({
				address: getAddress(pool.nftContract),
				name: pool.collectionName,
				totalDeposited: pool.totalDeposited,
				oraclePrice: pool.oraclePrice,
			})
		}
	})

	const verified: Array<ICollection> = []

	const notVerified: Array<ICollection> = []

	Array.from(collections).forEach(({ address, name, totalDeposited, oraclePrice }) => {
		const verifiedCollectionIndex = verifiedCollections[chainId || 1].findIndex(
			(x) => x.address.toLowerCase() == address.toLowerCase()
		)

		if (verifiedCollectionIndex + 1) {
			verified.push({
				address,
				name,
				imgUrl: verifiedCollections[chainId || 1][verifiedCollectionIndex].imgUrl,
				sortIndex: verifiedCollectionIndex + 1,
				totalDeposited,
				oraclePrice
			})
		} else {
			notVerified.push({
				address,
				name,
				totalDeposited,
				imgUrl: '',
				sortIndex: -1,
				oraclePrice
			})
		}
	})

	return [...verified.sort((a, b) => a.sortIndex - b.sortIndex), ...notVerified].sort(
		(a, b) => Number(b.totalDeposited) - Number(a.totalDeposited)
	)
}

export function useGetAllCollections({ chainId, skipOracle }: { chainId?: number | null; skipOracle?: boolean }) {
	return useQuery(
		['allCollections', chainId, skipOracle || false],
		() =>
			getAllCollections({
				chainId
			}),
		{
			refetchInterval: 30_000
		}
	)
}
