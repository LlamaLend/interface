import { useQuery } from '@tanstack/react-query'
import type {
	IArcadeQuote,
	IBendDaoQuote,
	IBorrowPool,
	ICyanQuote,
	IJpegdQuote,
	INFTFiQuote,
	IX2Y2Quote
} from '~/types'
import { checkIfPoolDisabled } from '~/utils'
import { getAllPools } from './useGetAllPools'

interface IAggregatedProtocols {
	pools: {
		arcade: Array<IArcadeQuote>
		bendDao: Array<IBendDaoQuote>
		jpegd: Array<IJpegdQuote>
		nftfi: Array<INFTFiQuote>
		x2y2: Array<IX2Y2Quote>
		cyan: Array<ICyanQuote>
	}
}

export async function getAggregatedPools({ collectionAddress }: { collectionAddress?: string }) {
	try {
		if (!collectionAddress) throw new Error('Missing Collection Address')

		const [{ pools }, llamalendPools]: [IAggregatedProtocols, Array<IBorrowPool>] = await Promise.all([
			fetch(`/api/aggregated-pools?collectionAddress=${collectionAddress}`).then((res) => res.json()),
			getAllPools({ chainId: 1, collectionAddress })
		])

		const aggrProtocols = {
			llamalend: llamalendPools
				.filter((pool) => (checkIfPoolDisabled(pool) ? false : true))
				.map((pool) => ({
					pricePerNft: pool.pricePerNft,
					maxLoanLength: pool.maxLoanLength,
					currentAnnualInterest: pool.currentAnnualInterest,
					url: `https://llamalend.com/collections/Ethereum/${collectionAddress}`
				})),
			...(pools || {})
		}

		return Object.entries(aggrProtocols || {}).filter((pool) => pool[1].length > 0)
	} catch (error) {
		console.error(error)

		return null
	}
}

export function useGetAggregatedPools({ collectionAddress }: { collectionAddress?: string }) {
	return useQuery(['aggregatedPools', collectionAddress], () => getAggregatedPools({ collectionAddress }), {
		refetchInterval: 60_000
	})
}
