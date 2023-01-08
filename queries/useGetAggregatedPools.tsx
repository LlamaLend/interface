import { useQuery } from '@tanstack/react-query'

export async function getAggregatedPools({ collectionAddress }: { collectionAddress?: string }) {
	try {
		if (!collectionAddress) throw new Error('Missing Collection Address')

		const { pools } = await fetch(`/api/aggregated-pools?collectionAddress=${collectionAddress}`).then((res) =>
			res.json()
		)

		return Object.entries(pools || {})
	} catch (error) {
		console.error(error)

		return Object.entries({
			arcade: [],
			bendDao: [],
			jpegd: [],
			nftfi: [],
			x2y2: []
		})
	}
}

export function useGetAggregatedPools({ collectionAddress }: { collectionAddress?: string }) {
	return useQuery(['aggregatedPools', collectionAddress], () => getAggregatedPools({ collectionAddress }), {
		refetchInterval: 60_000
	})
}
