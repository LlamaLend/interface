import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { chainConfig, ERC721_ABI } from '~/lib/constants'
import { getAllpools } from './useGetAllPools'
import verifiedCollections from '~/lib/collections'
import type { ICollection } from '~/types'

const getCollectionName = async ({ address, chainId }: { address: string; chainId?: number | null }) => {
	const config = chainConfig(chainId)

	const nftContract = new ethers.Contract(address, ERC721_ABI, config.chainProvider)

	return await nftContract.name()
}

export async function getAllCollections({ chainId }: { chainId?: number | null }) {
	const pools = await getAllpools({ chainId })
	const collections = new Set<string>()

	pools.forEach((pool) => {
		collections.add(getAddress(pool.nftContract))
	})

	const collectionNames = await Promise.all(
		Array.from(collections).map((address) => getCollectionName({ address, chainId }))
	)

	const verified: Array<ICollection> = []

	const notVerified: Array<ICollection> = []

	Array.from(collections).forEach((address, index) => {
		const verifiedCollectionIndex = verifiedCollections[chainId || 1].findIndex(
			(x) => x.address.toLowerCase() === address.toLowerCase()
		)

		if (verifiedCollectionIndex + 1) {
			verified.push({
				address,
				name: collectionNames[index],
				imgUrl: verifiedCollections[chainId || 1][verifiedCollectionIndex].imgUrl,
				sortIndex: verifiedCollectionIndex + 1
			})
		} else {
			notVerified.push({ address, name: collectionNames[index], imgUrl: '', sortIndex: -1 })
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
