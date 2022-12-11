import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { IToken } from '~/lib/collections'
import { chainConfig, ERC721_ABI } from '~/lib/constants'
import { useGetNftTokenByAddress } from './useGetNftTokenList'

interface ICollectionName {
	collectionAddress?: string
	chainId?: number | null
}

async function getCollectionName({ collectionAddress, chainId }: ICollectionName, nftToken?: IToken) {
	if (nftToken) {
		return nftToken.name
	}

	try {
		if (!collectionAddress) {
			throw new Error('Error: Invalid arguments')
		}

		const config = chainConfig(chainId)

		const nftContract = new ethers.Contract(collectionAddress, ERC721_ABI, config.chainProvider)

		return await nftContract.name()
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get collection name"))
	}
}

export default function useGetCollectionName(params: ICollectionName) {
	const nftToken = useGetNftTokenByAddress(params.collectionAddress || '')
	return useQuery(['collectionName', params.collectionAddress, params.chainId], () =>
		getCollectionName(params, nftToken)
	)
}
