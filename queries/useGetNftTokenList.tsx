import { useQuery } from '@tanstack/react-query'
import { ITokenList } from '~/lib/collections'
import { NFT_LIST, NFT_LIST_VERSION } from '~/lib/constants'

export async function getNftTokenList(): Promise<ITokenList> {
	try {
		const nftList = (await fetch(NFT_LIST).then((res) => res.json())) as ITokenList
		const otherList = (await fetch(`https://nft.llama.fi/collections`).then((res) => res.json())) as any[]
		const version = nftList.version
		const [major, minor, patch] = NFT_LIST_VERSION.split('.')
		// Only accept patch releases
		if (version.major !== Number(major) || version.minor !== Number(minor) || version.patch < Number(patch)) {
			throw new Error(
				`NFT List version not expected (actual: ${version.major}.${version.minor}.${version.patch}, expected: ${NFT_LIST_VERSION})`
			)
		}
		nftList.tokens = nftList.tokens.concat(
			otherList.map((c) => ({
				name: c.name,
				address: c.collectionId,
				symbol: c.symbol,
				chainId: 1,
				logoURI: c.image
			}))
		)
		return nftList
	} catch (error: any) {
		throw new Error(error.message || (error?.reason ?? "Couldn't get verified NFT List"))
	}
}

export function useGetNftTokenList() {
	return useQuery(['nftTokenList'], () => getNftTokenList())
}

export function useGetNftTokenByAddress(address: string) {
	const { data: nftTokenList } = useGetNftTokenList()
	return nftTokenList && nftTokenList.tokens.find((token) => token.address.toLowerCase() === address.toLowerCase())
}
