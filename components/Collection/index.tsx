import Image from 'next/image'
import Link from 'next/link'

interface IBorrowCollectionItemProps {
	data: { name: string; address: string; imgUrl: string }
	chainName: string
}

export function BorrowCollectionItem({ data, chainName }: IBorrowCollectionItemProps) {
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
