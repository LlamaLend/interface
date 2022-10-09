import Image from 'next/future/image'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import ItemWrapper from './ItemWrapper'
import type { ILoan } from '~/types'

// @ts-ignore
dayjs.extend(relativeTime)

export function RepayNftItem({ data }: { data: ILoan }) {
	const isExpired = data.deadline - Date.now() <= 0 ? true : false

	return (
		<ItemWrapper className="gap-0 !p-2 text-sm">
			<div className="relative -mx-2 -mt-2 aspect-square rounded-t-xl bg-[#202020]">
				{data.tokenUri !== '' && <Image src={data.tokenUri} fill alt="" className="aspect-square rounded-t-xl" />}
			</div>

			<div className="mt-2 mb-4 flex h-5 items-center justify-between gap-4">
				<p className="overflow-hidden text-ellipsis">{data.id.slice(0, 4) + '...' + data.id.slice(-3)}</p>

				<div className="flex items-center gap-1.5 text-[#c6c6c6]">
					<span className="sr-only">Time left to repay loan</span>
					<svg
						stroke="currentColor"
						fill="none"
						strokeWidth="2"
						viewBox="0 0 24 24"
						strokeLinecap="round"
						strokeLinejoin="round"
						height="14px"
						width="14px"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="12" cy="12" r="10"></circle>
						<polyline points="12 6 12 12 16 14"></polyline>
					</svg>
					{/* @ts-ignore */}
					<p>{isExpired ? 'Expired' : dayjs(data.deadline).toNow(true)}</p>
				</div>
			</div>

			<p className="mt-auto">To Pay</p>

			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-1.5">
					<Image src="/assets/ethereum.png" height={16} width={16} className="object-contain" alt="ethereum" />
					<p>{data.toPay}</p>
				</div>

				<button className="flex items-center gap-1 rounded-xl border border-[#243b55] bg-[#243b55] px-2 py-1 text-center text-sm text-white">
					Add to cart
				</button>
			</div>
		</ItemWrapper>
	)
}

export function RepayNftPlaceholder() {
	return (
		<ItemWrapper className="gap-0 !p-2 text-sm">
			<div className="placeholder-box relative -mx-2 -mt-2 aspect-square rounded-t-xl bg-[#202020]"></div>

			<div className="mt-2 mb-4 flex h-5 flex-wrap items-center justify-between gap-4">
				<div className="placeholder-box h-4 w-[10ch]"></div>

				<div className="flex items-center gap-1.5 text-[#c6c6c6]">
					<span className="sr-only">Time left to repay loan</span>
					<svg
						stroke="currentColor"
						fill="none"
						strokeWidth="2"
						viewBox="0 0 24 24"
						strokeLinecap="round"
						strokeLinejoin="round"
						height="14px"
						width="14px"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="12" cy="12" r="10"></circle>
						<polyline points="12 6 12 12 16 14"></polyline>
					</svg>
					<div className="placeholder-box h-4 w-[10ch]"></div>
				</div>
			</div>

			<h4 className="mt-auto">To Pay</h4>

			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-1.5">
					<Image src="/assets/ethereum.png" height={16} width={16} className="object-contain" alt="ethereum" />
					<div className="placeholder-box h-4 w-[6ch]"></div>
				</div>
				<div className="rounded-xl bg-[#243b55] text-center text-sm text-white text-opacity-40">
					<div className="h-[1.875rem] w-[5.5rem]"></div>
				</div>
			</div>
		</ItemWrapper>
	)
}
