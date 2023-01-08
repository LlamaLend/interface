import type { NextApiRequest, NextApiResponse } from 'next'
import { getDataArcade } from '~/AggregatorAdapters/arcade'
import { getDataBendDao } from '~/AggregatorAdapters/benddao'
import { getDataJpegd } from '~/AggregatorAdapters/jpegd'
import { getDataNftFi } from '~/AggregatorAdapters/nftfi'
import { getDataX2y2 } from '~/AggregatorAdapters/x2y2'

export default async function getAggregatedPools(req: NextApiRequest, res: NextApiResponse) {
	const { collectionAddress } = req.query

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

		res.status(200).json({
			pools: {
				arcade: arcade.status === 'fulfilled' ? arcade.value : [],
				bendDao: bendDao.status === 'fulfilled' ? bendDao.value : [],
				jpegd: jpegd.status === 'fulfilled' ? jpegd.value : [],
				nftfi: nftfi.status === 'fulfilled' ? nftfi.value : [],
				x2y2: x2y2.status === 'fulfilled' ? x2y2.value : []
			}
		})
	} catch (error: any) {
		console.error(error)

		res.status(400)
	}
}
