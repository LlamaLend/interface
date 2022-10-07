import * as React from 'react'
import Image from 'next/future/image'
import ItemWrapper from './ItemWrapper'
import { INftItem } from '~/types'
import { useGetCartItems, useSaveItemToCart } from '~/queries/useCart'

export const BorrowNftItem = ({
	data,
	quotePrice,
	contractAddress
}: {
	data: INftItem
	quotePrice?: number | null
	contractAddress: string
}) => {
	const { data: cartItems } = useGetCartItems(contractAddress)
	const { mutate } = useSaveItemToCart()

	const storeItem = () => {
		if (!data.tokenId) return

		mutate({ tokenId: data.tokenId, contractAddress })
	}

	const isAddedToCart = cartItems?.includes(data.tokenId)

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

				{isAddedToCart ? (
					<button
						className="text-sm text-center rounded-xl px-2 py-1 border border-[#243b55] text-white flex items-center gap-1"
						onClick={storeItem}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
						</svg>
						<span>Added to cart</span>
					</button>
				) : (
					<button
						className="text-sm text-center rounded-xl px-2 py-1 border border-[#243b55] bg-[#243b55] text-white flex items-center gap-1"
						onClick={storeItem}
					>
						Add to cart
					</button>
				)}
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
