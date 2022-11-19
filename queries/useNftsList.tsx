import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { chainConfig } from '~/lib/constants'
import type { INftApiResponse, INftItem, ITransactionError } from '~/types'

interface IGetOwnedNfts {
	userAddress?: string
	alchemyNftUrl: string
	nftContractAddress?: string
}

export async function getOwnedNfts({
	userAddress,
	alchemyNftUrl,
	nftContractAddress
}: IGetOwnedNfts): Promise<Array<INftItem>> {
	try {
		if (!nftContractAddress || !userAddress) {
			return []
		}

		if (!alchemyNftUrl) {
			throw new Error('Error: Invalid arguments')
		}

		const data: INftApiResponse = await fetch(
			`${alchemyNftUrl}/getNFTs?owner=${userAddress}&contractAddresses[]=${nftContractAddress}`
		).then((res) => res.json())

		return data?.ownedNfts?.map((item) => ({
			tokenId: Number(item.id.tokenId),
			imgUrl: formatImageUrl(item.media[0].gateway) || ''
		}))
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get nfts of user"))
	}
}

export async function getNftMetadata({
	alchemyNftUrl,
	nftContractAddress,
	nftId
}: {
	alchemyNftUrl: string
	nftContractAddress?: string
	nftId: string
}): Promise<string> {
	try {
		if (!nftContractAddress) {
			return ''
		}

		if (!alchemyNftUrl) {
			throw new Error('Error: Invalid arguments')
		}

		const data = await fetch(
			`${alchemyNftUrl}/getNFTMetadata?contractAddress=${nftContractAddress.toLowerCase()}&tokenId=${nftId}`
		).then((res) => res.json())

		return formatImageUrl(data.media[0].gateway) || ''
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get nft metadata"))
	}
}

export function useGetNftsList({
	nftContractAddress,
	chainId
}: {
	nftContractAddress?: string
	chainId?: number | null
}) {
	const { address: userAddress } = useAccount()

	const { alchemyNftUrl } = chainConfig(chainId)

	return useQuery<Array<INftItem>, ITransactionError>(
		['nftsList', userAddress, chainId, nftContractAddress],
		() =>
			getOwnedNfts({
				userAddress,
				alchemyNftUrl,
				nftContractAddress
			}),
		{
			refetchInterval: 60 * 100
		}
	)
}

function formatImageUrl(url?: string) {
	if (url) {
		if (url.startsWith('https://api.tubbysea.com')) return url

		if (url.startsWith('https://ipfs.io/')) return `https://cloudflare-ipfs.com/` + url.split('https://ipfs.io/')[1]

		if (url.startsWith('ipfs://')) return `https://cloudflare-ipfs.com/` + url.split('ipfs://')[1]

		return url
	}
}
