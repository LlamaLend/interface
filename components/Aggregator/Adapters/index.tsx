import BeatLoader from '~/components/BeatLoader'
import { useGetAggregatedPools } from '~/queries/useGetAggregatedPools'
import type {
	IArcadeQuote,
	IBendDaoQuote,
	ICyanQuote,
	IJpegdQuote,
	ILlamaLendQuote,
	INFTFiQuote,
	IX2Y2Quote,
	IParaSpaceQuote,
	IZhartaQuote
} from '~/types'
import { ArcadePools } from './Arcade'
import { BenDaoPools } from './BenDao'
import { JPEGDPools } from './JPEGD'
import { LlamalendPools } from './LlamaLend'
import { NFTFIPools } from './NFTFi'
import { X2Y2Pools } from './X2Y2'
import { ParaSpacePools } from './Paraspace'
import { CyanPools } from './Cyan'
import { ZhartaPools } from './Zharta'

export function AggregatedAdapters({
	collectionAddress,
	collectionName
}: {
	collectionAddress?: string
	collectionName?: string | null
}) {
	const { data: adapters, isLoading: fetchingPools } = useGetAggregatedPools({ collectionAddress: collectionAddress })

	if (fetchingPools) {
		return (
			<div className="mt-[10%] p-4">
				<BeatLoader />
			</div>
		)
	}

	if (!fetchingPools && collectionAddress && (!adapters || adapters?.length === 0)) {
		return (
			<p className="mt-[10%] text-center text-white text-opacity-60">
				Couldn't find any protocols that lend against {collectionName || collectionAddress}
			</p>
		)
	}

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
	pools:
		| Array<INFTFiQuote>
		| Array<IArcadeQuote>
		| Array<IBendDaoQuote>
		| Array<IJpegdQuote>
		| Array<IX2Y2Quote>
		| Array<ILlamaLendQuote>
		| Array<IParaSpaceQuote>
		| Array<ICyanQuote>
		| Array<IZhartaQuote>
}) => {
	if (name === 'llamalend') {
		return <LlamalendPools pools={pools as Array<ILlamaLendQuote>} />
	}

	if (name === 'x2y2') {
		return <X2Y2Pools pools={pools as Array<IX2Y2Quote>} />
	}

	if (name === 'jpegd') {
		return <JPEGDPools pools={pools as Array<IJpegdQuote>} />
	}

	if (name === 'nftfi') {
		return <NFTFIPools pools={pools as Array<INFTFiQuote>} />
	}

	if (name === 'bendDao') {
		return <BenDaoPools pools={pools as Array<IBendDaoQuote>} />
	}

	if (name === 'arcade') {
		return <ArcadePools pools={pools as Array<IArcadeQuote>} />
	}

	if (name === 'paraspace') {
		return <ParaSpacePools pools={pools as Array<IParaSpaceQuote>} />
	}

	if (name === 'cyan') {
		return <CyanPools pools={pools as Array<ICyanQuote>} />
	}

	if (name === 'zharta') {
		return <ZhartaPools pools={pools as Array<IZhartaQuote>} />
	}

	return <></>
}

// 'nftfi' | 'x2y2' | 'arcade' | 'bendDao' | 'jpegd' | 'cyan'
