import Image from 'next/future/image'
import Link from 'next/link'
import ItemWrapper from './ItemWrapper'

interface IBorrowCollectionItemProps {
	data: { name: string; address: string; imgUrl: string }
	chainName: string
}

export function BorrowCollectionItem({ data, chainName }: IBorrowCollectionItemProps) {
	return (
		<ItemWrapper>
			<div className="relative -mx-4 -mt-4 aspect-square rounded-t-xl bg-[#202020]">
				{data.imgUrl === '' ? (
					<div className="aspect-square rounded-t-xl"></div>
				) : (
					<Image src={data.imgUrl} fill alt={data.name} className="aspect-square rounded-t-xl" priority />
				)}
			</div>

			<h1>{data.name}</h1>

			<Link href={`/collections/${chainName}/${data.address}`}>
				<a className="mt-auto rounded-xl bg-[#243b55] p-2 text-center text-sm">View Pools</a>
			</Link>
		</ItemWrapper>
	)
}
