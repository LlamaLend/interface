import * as React from 'react'
import Image from 'next/future/image'
import ItemWrapper from './ItemWrapper'
import { INftItem } from '~/types'

export const BorrowNftItem = ({ data, quotePrice }: { data: INftItem; quotePrice?: number | null }) => {
	return (
		<ItemWrapper className="text-sm gap-0 !p-2">
			<div className="aspect-square bg-[#202020] rounded-t-xl -mx-2 -mt-2 relative">
				{data.imgUrl !== '' && (
					<Image src={data.imgUrl} fill alt={data.tokenId.toString()} className="rounded-t-xl aspect-square" />
				)}
			</div>

			<p className="mt-2 mb-4">#{data.tokenId}</p>

			<h4 className="mt-auto">Quote</h4>

			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-1.5">
					<Image src="/assets/ethereum.png" width={16} height={16} className="object-contain" alt="ethereum" />
					<p className="min-h-4">{quotePrice || '-'}</p>
				</div>

				<button className="text-sm text-center rounded-xl px-2 py-1 border border-blue-500 text-white">
					Add to cart
				</button>
			</div>
		</ItemWrapper>
	)
}

export const BorrowNftPlaceholder = () => {
	return (
		<ItemWrapper className="text-sm gap-0 !p-2">
			<div className="aspect-square bg-[#202020] placeholder-box rounded-t-xl relative -mx-2 -mt-2"></div>

			<div className="placeholder-box h-5 w-[10ch] mt-2 mb-4"></div>

			<h4 className="mt-auto">Quote</h4>

			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-1.5">
					<Image src="/assets/ethereum.png" width={16} height={16} className="object-contain" alt="ethereum" />
					<div className="placeholder-box h-4 w-[6ch]"></div>
				</div>

				<div className="text-sm text-center rounded-xl bg-[#243b55] text-white text-opacity-40">
					<div className="h-[1.875rem] w-[5.5rem]"></div>
				</div>
			</div>
		</ItemWrapper>
	)
}
