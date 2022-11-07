import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers'
import collections from '~/lib/collections'
import { chainConfig, ERC721_ABI } from '~/lib/constants'

interface ICollectionName {
	collectionAddress?: string
	chainId?: number | null
}

async function getCollectionName({ collectionAddress, chainId }: ICollectionName) {
	try {
		if (!collectionAddress) {
			throw new Error('Error: Invalid arguments')
		}

		const collection = collections[chainId || 1]?.find(
			(col) => col.address.toLowerCase() === collectionAddress?.toLowerCase()
		)

		if (collection) return collection.name

		const config = chainConfig(chainId)

		const nftContract = new ethers.Contract(collectionAddress, ERC721_ABI, config.chainProvider)

		return await nftContract.name()
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get collection name"))
	}
}

export default function useGetCollectionName(params: ICollectionName) {
	return useQuery(['collectionName', params.collectionAddress, params.chainId], () => getCollectionName(params))
}
