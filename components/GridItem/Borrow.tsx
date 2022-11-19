import * as React from 'react'
import Image from 'next/image'
import ItemWrapper from './ItemWrapper'
import { INftItem } from '~/types'
import { useGetCartItems, useSaveItemToCart } from '~/queries/useCart'
import { getQuotePrice } from '~/utils'

export const BorrowNftItem = ({
	data,
	oraclePrice,
	ltv,
	contractAddress,
	chainId
}: {
	data: INftItem
	oraclePrice: string
	ltv: string
	contractAddress: string
	chainId?: number
}) => {
	const { data: cartItems } = useGetCartItems({ contractAddress, chainId })
	const { mutate } = useSaveItemToCart({ chainId })

	const storeItem = () => {
		if (!data.tokenId) return

		mutate({ tokenId: data.tokenId, contractAddress })
	}

	const isAddedToCart = cartItems?.includes(data.tokenId)

	return (
		<ItemWrapper className="gap-0 !p-2 text-sm">
			<div className="relative -mx-2 -mt-2 aspect-square rounded-t-xl bg-[#202020]">
				{data.imgUrl !== '' && (
					<Image src={data.imgUrl} fill alt={data.tokenId.toString()} className="aspect-square rounded-t-xl" />
				)}
			</div>

			<p className="mt-2 mb-4">#{data.tokenId}</p>

			<h4 className="mt-auto">Quote</h4>

			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-1.5">
					<Image src="/assets/ethereum.png" width={16} height={16} className="object-contain" alt="ethereum" />
					<p className="min-h-4">{getQuotePrice({ oraclePrice, ltv })}</p>
				</div>

				{isAddedToCart ? (
					<button
						className="flex items-center gap-1 rounded-xl border border-[#243b55] px-2 py-1 text-center text-sm text-white"
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
						className="flex items-center gap-1 rounded-xl border border-[#243b55] bg-[#243b55] px-2 py-1 text-center text-sm text-white"
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
		<ItemWrapper className="gap-0 !p-2 text-sm">
			<div className="placeholder-box relative -mx-2 -mt-2 aspect-square rounded-t-xl bg-[#202020]"></div>

			<div className="placeholder-box mt-2 mb-4 h-5 w-[10ch]"></div>

			<h4 className="mt-auto">Quote</h4>

			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-1.5">
					<Image src="/assets/ethereum.png" width={16} height={16} className="object-contain" alt="ethereum" />
					<div className="placeholder-box h-4 w-[6ch]"></div>
				</div>

				<div className="rounded-xl bg-[#243b55] text-center text-sm text-white text-opacity-40">
					<div className="h-[1.875rem] w-[5.5rem]"></div>
				</div>
			</div>
		</ItemWrapper>
	)
}
