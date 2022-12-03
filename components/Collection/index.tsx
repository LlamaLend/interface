import Image from 'next/image'
import Link from 'next/link'
import { chainConfig } from '~/lib/constants';
import { useGetAllPools } from '~/queries/useGetAllPools';
import { useGetOracle } from '~/queries/useGetOracle';

interface IBorrowCollectionItemProps {
	data: { name: string; address: string; imgUrl: string }
	chainName: string
	chainId?: number
}

export function BorrowCollectionItemList({ data, chainName, chainId }: IBorrowCollectionItemProps) {
	const { data: oracle } = useGetOracle({ nftContractAddress: data.address, chainId })
	const { data: pools} = useGetAllPools({ chainId, collectionAddress: data.address })
	const chainSymbol = chainConfig(chainId)?.nativeCurrency?.symbol
	const floorPrice = Number(oracle?.price) / 1e18
	const poolsWithLiquidity = pools?.filter(pool => Number(pool.totalDeposited) > 0)
	const poolsTotalAvailableBalance = poolsWithLiquidity && poolsWithLiquidity?.map(pool => Number(pool.poolBalance) / 1e18).reduce((a, b) => a + b, 0)
	return (
		<li className="grid grid-cols-3 md:grid-cols-5 gap-4 min-h-[80px] min-w-[300px] bg-[#191919] p-4 shadow backdrop-blur justify-between">
			<div className="flex gap-4">
				<div className="flex flex-col justify-center">
					<div className="relative min-h-[50px] min-w-[50px] w-full aspect-square">
						{data.imgUrl === '' ? (
							<div className="aspect-square rounded-xl bg-[#22242A]"></div>
						) : (
							<Image src={data.imgUrl} fill alt={data.name} className="aspect-square rounded-xl"  priority />
						)}						
					</div>
				</div>

				<div className="hidden md:block">
					<h1 className="font-semibold">{data.name}</h1>
					<p className="text-sm text-[#D4D4D8]">Collection</p>
				</div>
			</div>

			<div className="block md:hidden">
				<h1 className="font-semibold">{data.name}</h1>
				<p className="text-sm text-[#D4D4D8]">Collection</p>
			</div>

			<div className="flex flex-col justify-center">
				<h1>{oracle?.price ? `${floorPrice.toFixed(2)} ${chainSymbol}` : ''}</h1>
				<p className="text-sm text-[#D4D4D8]">Floor</p>
			</div>

			<div className="flex flex-col justify-center">
				<h1>{poolsTotalAvailableBalance && `${poolsTotalAvailableBalance.toFixed(2)} ${chainSymbol}`}</h1>
				<p className="text-sm text-[#D4D4D8]">Available</p>
			</div>

			<div className="flex flex-col justify-center">
				<h1>{pools?.length}</h1>
				<p className="text-sm text-[#D4D4D8]">Loans</p>
			</div>

			<div className="flex flex-col justify-center">
				<Link
					href={`/collections/${chainName}/${data.address}`}
					className="rounded-xl bg-[#243b55] p-2 text-center text-sm min-w-[100px] max-w-[120px]"
				>
					View Pools
				</Link>
			</div>
		</li>
	)
}

export function BorrowCollectionItemCard({ data, chainName }: IBorrowCollectionItemProps) {
	return (
		<li className="flex min-h-[300px] min-w-[240px] flex-col gap-4 rounded-xl bg-[#191919] p-4 shadow backdrop-blur">
			<div className="relative -mx-4 -mt-4 aspect-square rounded-t-xl bg-[#22242A]">
				{data.imgUrl === '' ? (
					<div className="aspect-square rounded-t-xl bg-[#22242A]"></div>
				) : (
					<Image src={data.imgUrl} fill alt={data.name} className="aspect-square rounded-t-xl" sizes="260px" priority />
				)}
			</div>

			<h1>{data.name}</h1>

			<Link
				href={`/collections/${chainName}/${data.address}`}
				className="mt-auto rounded-xl bg-[#243b55] p-2 text-center text-sm"
			>
				View Pools
			</Link>
		</li>
	)
}
