import Image from 'next/image'
import Link from 'next/link'
import { chainConfig } from '~/lib/constants'
import { useGetAllPools } from '~/queries/useGetAllPools'

interface IBorrowCollectionItemProps {
	data: { name: string; address: string; imgUrl: string }
	chainName: string
	chainId?: number
}

export function BorrowCollectionItemList({ data, chainName, chainId }: IBorrowCollectionItemProps) {
	const { data: pools } = useGetAllPools({ chainId, collectionAddress: data.address })

	const chainSymbol = chainConfig(chainId)?.nativeCurrency?.symbol

	const poolsWithLiquidity = pools?.filter((pool) => Number(pool.totalDeposited) / 1e18 > 0.01)
	const poolsTotalAvailableBalance =
		poolsWithLiquidity && poolsWithLiquidity?.map((pool) => Number(pool.poolBalance) / 1e18).reduce((a, b) => a + b, 0)
	const poolsMaxApr =
		poolsWithLiquidity &&
		poolsWithLiquidity.length > 0 &&
		Math.max(...poolsWithLiquidity.map((pool) => Number(pool.currentAnnualInterest) / 1e16))

	const floorPrice =
		pools && pools.length > 0 && pools[0].oraclePrice ? (Number(pools[0].oraclePrice) / 1e18).toFixed(2) : null

	return (
		<li className="grid min-h-[80px] grid-cols-3 justify-between gap-4 p-4 shadow md:grid-cols-[280px_repeat(5,_120px)] xl:grid-cols-[360px_repeat(5,_120px)]">
			<div className="flex gap-4">
				<div className="flex flex-col justify-center">
					<div className="relative aspect-square min-h-[50px] w-full min-w-[50px]">
						{data.imgUrl === '' ? (
							<div className="aspect-square rounded-xl bg-[#22242A]"></div>
						) : (
							<Image src={data.imgUrl} fill alt={data.name} className="aspect-square rounded-xl" priority />
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
				<h1 className="min-h-[1.5rem]">{floorPrice ? `${floorPrice} ${chainSymbol}` : ''}</h1>
				<p className="text-sm text-[#D4D4D8]">Floor</p>
			</div>

			<div className="flex flex-col justify-center">
				<h1 className="min-h-[1.5rem]">{poolsMaxApr ? `${poolsMaxApr.toFixed(2)}%` : ''}</h1>
				<p className="text-sm text-[#D4D4D8]">APR up to</p>
			</div>

			<div className="flex flex-col justify-center">
				<h1 className="min-h-[1.5rem]">
					{poolsTotalAvailableBalance && `${poolsTotalAvailableBalance.toFixed(2)} ${chainSymbol}`}
				</h1>
				<p className="text-sm text-[#D4D4D8]">Available</p>
			</div>

			<div className="flex flex-col justify-center">
				<h1 className="min-h-[1.5rem]">{pools?.length}</h1>
				<p className="text-sm text-[#D4D4D8]">Loans</p>
			</div>

			<div className="col-span-3 mx-auto flex w-full flex-col justify-center md:col-span-1 md:mr-0">
				<Link
					href={`/collections/${chainName}/${data.address}`}
					className="w-full min-w-[100px] rounded-xl bg-[#243b55] p-2 text-center text-sm"
				>
					View Pools
				</Link>
			</div>
		</li>
	)
}

export function BorrowCollectionItemCard({ data, chainName }: IBorrowCollectionItemProps) {
	return (
		<li className="flex min-h-[300px] min-w-[240px] flex-col gap-4 rounded-xl bg-[#191919] p-4 shadow">
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
