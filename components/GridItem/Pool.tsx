import * as React from 'react'
import Link from 'next/link'
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import ItemWrapper from './ItemWrapper'
import type { IBorrowPool, IRepayPool } from '~/types'

// @ts-ignore
dayjs.extend(relativeTime)

interface IBorrowPoolItemProps {
	data: IBorrowPool
	chainName: string
}

interface IRepayPoolItemProps {
	data: IRepayPool
	chainName: string
}

export function BorrowPoolItem({ data, chainName }: IBorrowPoolItemProps) {
	return (
		<ItemWrapper>
			<div className="relative -mx-4 -mt-4 mb-4 h-20 rounded-t-xl bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]">
				<span className="absolute -bottom-5 left-4 h-12 w-12 rounded-full bg-gradient-to-r from-[#141e30] to-[#243b55]"></span>
			</div>
			<h1>{data.name}</h1>
			<p className="flex flex-col gap-1">
				<span className="text-xs font-light text-gray-400">Max Loan Duration</span>
				{/* @ts-ignore */}
				<span>{dayjs(new Date(new Date().getTime() + data.maxLoanLength * 1000)).toNow(true)}</span>
			</p>
			<p className="flex flex-col gap-1">
				<span className="text-xs font-light text-gray-400">Current Annual Interest</span>
				<span>{(data.currentAnnualInterest / 1e16).toFixed(2)}% p.a.</span>
			</p>

			<Link href={`/borrow/${chainName}/${data.address}`}>
				<a className="rounded-xl bg-[#243b55] p-2 text-center text-sm">View Pool</a>
			</Link>
		</ItemWrapper>
	)
}

export function RepayPoolItem({ data, chainName }: IRepayPoolItemProps) {
	return (
		<ItemWrapper>
			<div className="relative -mx-4 -mt-4 mb-4 h-20 rounded-t-xl bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]">
				<span className="absolute -bottom-5 left-4 h-12 w-12 rounded-full bg-gradient-to-r from-[#141e30] to-[#243b55]"></span>
			</div>
			<h1>{data.name}</h1>

			<p className="flex flex-col gap-1">
				<span className="text-xs font-light text-gray-400">Loans</span>
				<span>{data.loans}</span>
			</p>

			<Link href={`/repay/${chainName}/${data.address}`}>
				<a className="mt-auto rounded-xl bg-[#243b55] p-2 text-center text-sm">View Pool</a>
			</Link>
		</ItemWrapper>
	)
}

export function PlaceholderBorrowPoolItem() {
	return (
		<ItemWrapper>
			<div className="placeholder-box relative -mx-4 -mt-4 mb-4 h-20 rounded-t-xl bg-[#202020]">
				<span
					className="placeholder-box absolute -bottom-5 left-4 h-12 w-12 rounded-full"
					style={{ background: 'linear-gradient(to right, #232323 5%, #252525 20%, #232323 40%)' }}
				></span>
			</div>
			<h1 className="placeholder-box h-6 w-36"></h1>
			<p className="flex flex-col gap-1">
				<span className="text-xs font-light text-gray-400">Max Loan Duration</span>
				<span className="placeholder-box h-6 w-20"></span>
			</p>
			<p className="flex flex-col gap-1">
				<span className="text-xs font-light text-gray-400">Current Annual Interest</span>
				<span className="placeholder-box h-6 w-20"></span>
			</p>

			<div className="mt-auto rounded-xl bg-[#243b55] p-2 text-center text-sm text-white text-opacity-40">
				<div className="h-5"></div>
			</div>
		</ItemWrapper>
	)
}

export function PlaceholderRepayPoolItem() {
	return (
		<ItemWrapper>
			<div className="placeholder-box relative -mx-4 -mt-4 mb-4 h-20 rounded-t-xl bg-[#202020]">
				<span
					className="placeholder-box absolute -bottom-5 left-4 h-12 w-12 rounded-full"
					style={{ background: 'linear-gradient(to right, #232323 5%, #252525 20%, #232323 40%)' }}
				></span>
			</div>
			<h1 className="placeholder-box h-6 w-36"></h1>

			<p className="flex flex-col gap-1">
				<span className="text-xs font-light text-gray-400">Loans</span>
				<span className="placeholder-box h-6 w-20"></span>
			</p>

			<div className="mt-auto rounded-xl bg-[#243b55] p-2 text-center text-sm text-white text-opacity-40">
				<div className="h-5"></div>
			</div>
		</ItemWrapper>
	)
}
