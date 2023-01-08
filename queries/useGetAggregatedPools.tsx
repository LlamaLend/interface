import { useQuery } from '@tanstack/react-query'
import type { IArcadeQuote, IBendDaoQuote, IJpegdQuote, INFTFiQuote, IX2Y2Quote } from '~/types'

export async function getAggregatedPools({ collectionAddress }: { collectionAddress?: string }) {
	try {
		if (!collectionAddress) throw new Error('Missing Collection Address')

		const {
			pools
		}: {
			pools: {
				arcade: Array<IArcadeQuote>
				bendDao: Array<IBendDaoQuote>
				jpegd: Array<IJpegdQuote>
				nftfi: Array<INFTFiQuote>
				x2y2: Array<IX2Y2Quote>
			}
		} = await fetch(`/api/aggregated-pools?collectionAddress=${collectionAddress}`).then((res) => res.json())

		return Object.entries(pools || {}).filter((pool) => pool[1].length > 0)
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
