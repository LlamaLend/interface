import { useGetAggregatedPools } from '~/queries/useGetAggregatedPools'
import type { IArcadeQuote, IBendDaoQuote, IJpegdQuote, INFTFiQuote, IX2Y2Quote } from '~/types'
import { NFTFIPools } from './NFTFi'
import { X2Y2Pools } from './X2Y2'

export function AggregatedAdapters({ selectedCollection }: { selectedCollection?: string }) {
	const { data: adapters, isLoading: fetchingPools } = useGetAggregatedPools({ collectionAddress: selectedCollection })

	if (!fetchingPools && selectedCollection && (!adapters || adapters?.length === 0)) {
		return (
			<p className="mt-[10%] text-center text-white text-opacity-60">Couldn't find lending pool of this collection</p>
		)
	}

	console.log({ adapters })

	return (
		<div className="mt-[5%] flex flex-col gap-4">
			{adapters?.map((adapter) => (
				<Adapter key={adapter[0]} name={adapter[0]} pools={adapter[1]} />
			))}
		</div>
	)
}

const Adapter = ({
	name,
	pools
}: {
	name: string
	pools: Array<INFTFiQuote> | Array<IArcadeQuote> | Array<IBendDaoQuote> | Array<IJpegdQuote> | Array<IX2Y2Quote>
}) => {
	if (name === 'x2y2') {
		return <X2Y2Pools pools={pools as Array<IX2Y2Quote>} />
	}
	if (name === 'nftfi') {
		return <NFTFIPools pools={pools as Array<INFTFiQuote>} />
	}

	return <></>
}

// 'nftfi' | 'x2y2' | 'arcade' | 'bendDao' | 'jpegd'
