import { useQuery } from '@tanstack/react-query'
import { getDataArcade } from '~/components/Aggregator/adapters/arcade'
import { getDataBendDao } from '~/components/Aggregator/adapters/benddao'
import { getDataJpegd } from '~/components/Aggregator/adapters/jpegd'

export async function getAggregatedPools({ chainId, nft }: { chainId: number | null; nft: string }) {
	try {
		if (chainId !== 1) throw new Error('Not on ETH')
		const [arcade, bendDao, jpegd] = await Promise.all([getDataArcade(nft), getDataBendDao(nft), getDataJpegd(nft)])
		return {
			arcade,
			bendDao,
			jpegd
		}
	} catch (error) {
		return {
			arcade: [],
			bendDao: [],
			jpegd: []
		}
		console.error(error)
	}
}

export function useGetAggregatedPools({ chainId, nft }: { chainId: number | null; nft: string }) {
	return useQuery(['aggregatedPools', chainId, nft], () => getAggregatedPools({ chainId, nft }), {
		refetchInterval: 60000
	})
}
