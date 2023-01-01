import { useQuery } from '@tanstack/react-query'
import { getDataArcade } from '~/AggregatorAdapters/arcade'
import { getDataBendDao } from '~/AggregatorAdapters/benddao'
import { getDataJpegd } from '~/AggregatorAdapters/jpegd'
import { getDataNftFi } from '~/AggregatorAdapters/nftfi'
import { getDataX2y2 } from '~/AggregatorAdapters/x2y2'

export async function getAggregatedPools({
	chainId,
	collectionAddress
}: {
	chainId?: number | null
	collectionAddress?: string
}) {
	try {
		if (!collectionAddress) throw new Error('Missing Collection Address')

		if (chainId !== 1) throw new Error('Not on ETH')

		const [arcade, bendDao, jpegd, nftfi, x2y2] = await Promise.allSettled([
			getDataArcade(collectionAddress),
			getDataBendDao(collectionAddress),
			getDataJpegd(collectionAddress),
			getDataNftFi(collectionAddress),
			getDataX2y2(collectionAddress)
		])

		return {
			arcade: arcade.status === 'fulfilled' ? arcade.value : [],
			bendDao: bendDao.status === 'fulfilled' ? bendDao.value : [],
			jpegd: jpegd.status === 'fulfilled' ? jpegd.value : [],
			nftfi: nftfi.status === 'fulfilled' ? nftfi.value : [],
			x2y2: x2y2.status === 'fulfilled' ? x2y2.value : []
		}
	} catch (error) {
		console.error(error)

		return {
			arcade: [],
			bendDao: [],
			jpegd: [],
			nftfi: [],
			x2y2: []
		}
	}
}

export function useGetAggregatedPools({
	chainId,
	collectionAddress
}: {
	chainId?: number | null
	collectionAddress?: string
}) {
	return useQuery(
		['aggregatedPools', chainId, collectionAddress],
		() => getAggregatedPools({ chainId, collectionAddress }),
		{
			refetchInterval: 60_000
		}
	)
}
