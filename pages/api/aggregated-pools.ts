import type { NextRequest } from 'next/server'
import { getDataArcade } from '~/AggregatorAdapters/arcade'
import { getDataBendDao } from '~/AggregatorAdapters/benddao'
import { getDataJpegd } from '~/AggregatorAdapters/jpegd'
import { getDataNftFi } from '~/AggregatorAdapters/nftfi'
import { getDataX2y2 } from '~/AggregatorAdapters/x2y2'

export const config = {
	runtime: 'edge'
}

export default async function getAggregatedPools(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const collectionAddress = searchParams.get('collectionAddress')

	try {
		if (!collectionAddress) throw new Error('Missing Collection Address')

		if (typeof collectionAddress !== 'string') throw new Error('Invalid Collection Address')

		const [arcade, bendDao, jpegd, nftfi, x2y2] = await Promise.allSettled([
			getDataArcade(collectionAddress),
			getDataBendDao(collectionAddress),
			getDataJpegd(collectionAddress),
			getDataNftFi(collectionAddress),
			getDataX2y2(collectionAddress)
		])

		console.log({ arcade, bendDao, jpegd })

		return new Response(
			JSON.stringify({
				pools: {
					arcade: arcade.status === 'fulfilled' ? arcade.value : [],
					bendDao: bendDao.status === 'fulfilled' ? bendDao.value : [],
					jpegd: jpegd.status === 'fulfilled' ? jpegd.value : [],
					nftfi: nftfi.status === 'fulfilled' ? nftfi.value : [],
					x2y2: x2y2.status === 'fulfilled' ? x2y2.value : []
				}
			}),
			{
				status: 200,
				headers: {
					'content-type': 'application/json'
				}
			}
		)
	} catch (error: any) {
		console.error(error)

		return new Response(error, { status: 400 })
	}
}
